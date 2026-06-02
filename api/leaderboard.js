const KV_URL = process.env.KV_REST_API_URL;
const KV_TOKEN = process.env.KV_REST_API_TOKEN;

function json(res, status, payload) {
  res.statusCode = status;
  res.setHeader('content-type', 'application/json; charset=utf-8');
  res.setHeader('cache-control', 'no-store');
  res.end(JSON.stringify(payload));
}

async function kv(command) {
  if (!KV_URL || !KV_TOKEN) throw new Error('KV env vars missing');
  const response = await fetch(KV_URL, {
    method: 'POST',
    headers: {
      authorization: `Bearer ${KV_TOKEN}`,
      'content-type': 'application/json'
    },
    body: JSON.stringify(command)
  });
  if (!response.ok) throw new Error(`KV request failed: ${response.status}`);
  const data = await response.json();
  return data.result;
}

function nyParts(now = new Date()) {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/New_York',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    weekday: 'short'
  }).formatToParts(now).reduce((acc, p) => {
    acc[p.type] = p.value;
    return acc;
  }, {});

  const dateKey = `${parts.year}-${parts.month}-${parts.day}`;
  const d = new Date(`${dateKey}T12:00:00-05:00`);
  const day = d.getUTCDay();
  const mondayOffset = (day + 6) % 7;
  d.setUTCDate(d.getUTCDate() - mondayOffset);
  const weekKey = d.toISOString().slice(0, 10);
  return { dateKey, weekKey };
}

function keys() {
  const { dateKey, weekKey } = nyParts();
  return {
    today: `sals-run:today:${dateKey}`,
    week: `sals-run:week:${weekKey}`,
    allTime: 'sals-run:all-time'
  };
}

function parseRows(raw) {
  if (!Array.isArray(raw)) return [];
  const rows = [];
  for (let i = 0; i < raw.length; i += 2) {
    try {
      const payload = JSON.parse(raw[i]);
      rows.push({
        rank: rows.length + 1,
        name: String(payload.name || 'PLAYER').slice(0, 12),
        score: Number(raw[i + 1] || payload.score || 0),
        beers: Number(payload.beers || 0)
      });
    } catch (_) {}
  }
  return rows;
}

module.exports = async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('allow', 'GET');
    return json(res, 405, { error: 'Method not allowed' });
  }

  if (!KV_URL || !KV_TOKEN) {
    return json(res, 200, { today: [], week: [], allTime: [], configured: false });
  }

  try {
    const k = keys();
    const [today, week, allTime] = await Promise.all([
      kv(['ZREVRANGE', k.today, 0, 9, 'WITHSCORES']),
      kv(['ZREVRANGE', k.week, 0, 9, 'WITHSCORES']),
      kv(['ZREVRANGE', k.allTime, 0, 9, 'WITHSCORES'])
    ]);
    return json(res, 200, {
      today: parseRows(today),
      week: parseRows(week),
      allTime: parseRows(allTime),
      configured: true
    });
  } catch (error) {
    return json(res, 500, { today: [], week: [], allTime: [], error: 'Leaderboard unavailable' });
  }
};
