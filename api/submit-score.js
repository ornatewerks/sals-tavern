const KV_URL = process.env.KV_REST_API_URL;
const KV_TOKEN = process.env.KV_REST_API_TOKEN;
const MAX_BODY_BYTES = 4096;

function json(res, status, payload) {
  res.statusCode = status;
  res.setHeader('content-type', 'application/json; charset=utf-8');
  res.setHeader('cache-control', 'no-store');
  res.setHeader('x-content-type-options', 'nosniff');
  res.end(JSON.stringify(payload));
}

async function readJson(req) {
  const chunks = [];
  let size = 0;
  for await (const chunk of req) {
    size += chunk.length;
    if (size > MAX_BODY_BYTES) throw new Error('Request body too large.');
    chunks.push(chunk);
  }
  const raw = Buffer.concat(chunks).toString('utf8');
  return raw ? JSON.parse(raw) : {};
}

async function kv(command) {
  if (!KV_URL || !KV_TOKEN) throw new Error('KV env vars missing');
  const response = await fetch(KV_URL, {
    method: 'POST',
    headers: { authorization: `Bearer ${KV_TOKEN}`, 'content-type': 'application/json' },
    body: JSON.stringify(command)
  });
  if (!response.ok) throw new Error(`KV request failed: ${response.status}`);
  const data = await response.json();
  return data.result;
}

function nyParts(now = new Date()) {
  const parts = new Intl.DateTimeFormat('en-CA', { timeZone: 'America/New_York', year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(now).reduce((acc, p) => { acc[p.type] = p.value; return acc; }, {});
  const dateKey = `${parts.year}-${parts.month}-${parts.day}`;
  const d = new Date(`${dateKey}T12:00:00-05:00`);
  const day = d.getUTCDay();
  const mondayOffset = (day + 6) % 7;
  d.setUTCDate(d.getUTCDate() - mondayOffset);
  return { dateKey, weekKey: d.toISOString().slice(0, 10) };
}

function keys() {
  const { dateKey, weekKey } = nyParts();
  return { today: `sals-run:today:${dateKey}`, week: `sals-run:week:${weekKey}`, allTime: 'sals-run:all-time' };
}

function sanitizeName(value) {
  return String(value || '').toUpperCase().replace(/[^A-Z0-9 ._-]/g, '').replace(/\s+/g, ' ').trim().slice(0, 12);
}

function sanitizePhone(value) {
  return String(value || '').replace(/[^0-9+(). -]/g, '').trim().slice(0, 24);
}

function validate(payload) {
  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) return { error: 'Invalid score payload.' };
  const name = sanitizeName(payload.name);
  const phone = sanitizePhone(payload.phone);
  const score = Number(payload.score);
  const beers = Number(payload.beers);
  const durationMs = Number(payload.durationMs);
  const jumps = Number(payload.jumps || 0);
  const slides = Number(payload.slides || 0);
  const obstaclesCleared = Number(payload.obstaclesCleared || 0);
  const nearMisses = Number(payload.nearMisses || 0);
  const maxCombo = Number(payload.maxCombo || 0);
  const sessionId = String(payload.sessionId || '').replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 80);

  if (name.length < 2) return { error: 'Name must be at least 2 characters.' };
  if (!Number.isInteger(score) || score <= 0 || score > 250000) return { error: 'Invalid score.' };
  if (!Number.isInteger(beers) || beers < 0 || beers > 400) return { error: 'Invalid beer count.' };
  if (!Number.isInteger(durationMs) || durationMs < 3000 || durationMs > 20 * 60 * 1000) return { error: 'Run length failed verification.' };
  if (!sessionId || sessionId.length < 8) return { error: 'Invalid game session.' };

  const seconds = durationMs / 1000;
  const scorePerSecond = score / seconds;
  const beersPerSecond = beers / seconds;
  const actionRate = (jumps + slides) / seconds;

  if (scorePerSecond > 1400) return { error: 'Score failed verification.' };
  if (beersPerSecond > 2.2) return { error: 'Beer count failed verification.' };
  if (actionRate > 12) return { error: 'Input rate failed verification.' };
  if (obstaclesCleared > seconds * 4 + 12) return { error: 'Obstacle count failed verification.' };
  if (nearMisses > seconds * 3 + 10) return { error: 'Near-miss count failed verification.' };
  if (maxCombo > beers + nearMisses + 8) return { error: 'Combo failed verification.' };

  return { name, phone, score, beers, durationMs, jumps, slides, obstaclesCleared, nearMisses, maxCombo, sessionId };
}

async function rankFor(key, member) {
  const rank = await kv(['ZREVRANK', key, member]);
  return rank === null || rank === undefined ? null : Number(rank) + 1;
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('allow', 'POST');
    return json(res, 405, { ok: false, error: 'Method not allowed' });
  }
  if (!KV_URL || !KV_TOKEN) return json(res, 503, { ok: false, error: 'Global leaderboard is not configured yet.' });

  let payload;
  try { payload = await readJson(req); } catch (_) { return json(res, 400, { ok: false, error: 'Invalid JSON.' }); }
  const valid = validate(payload);
  if (valid.error) return json(res, 400, { ok: false, error: valid.error });

  const sessionKey = `sals-run:session:${valid.sessionId}`;
  try {
    const setResult = await kv(['SET', sessionKey, '1', 'EX', 60 * 60 * 24 * 30, 'NX']);
    if (setResult !== 'OK') return json(res, 409, { ok: false, error: 'This run was already submitted.' });
    const k = keys();
    const publicMember = JSON.stringify({ id: valid.sessionId, name: valid.name, score: valid.score, beers: valid.beers, durationMs: valid.durationMs, createdAt: new Date().toISOString() });
    const privatePrizeContact = valid.phone ? JSON.stringify({ name: valid.name, phone: valid.phone, score: valid.score, createdAt: new Date().toISOString() }) : '';
    await Promise.all([
      kv(['ZADD', k.today, valid.score, publicMember]),
      kv(['ZADD', k.week, valid.score, publicMember]),
      kv(['ZADD', k.allTime, valid.score, publicMember]),
      kv(['EXPIRE', k.today, 60 * 60 * 24 * 3]),
      kv(['EXPIRE', k.week, 60 * 60 * 24 * 21]),
      privatePrizeContact ? kv(['SET', `sals-run:contact:${valid.sessionId}`, privatePrizeContact, 'EX', 60 * 60 * 24 * 30]) : Promise.resolve(null)
    ]);
    const [rankToday, rankWeek, rankAllTime] = await Promise.all([rankFor(k.today, publicMember), rankFor(k.week, publicMember), rankFor(k.allTime, publicMember)]);
    return json(res, 200, { ok: true, rankToday, rankWeek, rankAllTime, isWeeklyLeader: rankWeek === 1 });
  } catch (_) {
    return json(res, 500, { ok: false, error: 'Could not submit score.' });
  }
};
