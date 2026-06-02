from pathlib import Path
from PIL import Image, ImageDraw, ImageFilter
import json, math

root=Path(__file__).resolve().parents[1]
out=root/'public/assets/game-sprites.png'
meta_out=root/'public/assets/game-sprites.json'
cell=128
names=[]

def add(name, frames):
    for i,fn in enumerate(frames):
        names.append((name,i,fn))

def shadow(d,x0,y0,x1,y1,alpha=90):
    d.ellipse([x0,y0,x1,y1], fill=(0,0,0,alpha))

def draw_player(frame, pose='run'):
    im=Image.new('RGBA',(cell,cell),(0,0,0,0)); d=ImageDraw.Draw(im)
    shadow(d, 30,105,98,119,75)
    bob=[0,-3,-1,2][frame%4]
    if pose=='jump': bob=-18
    if pose=='slide': bob=10
    if pose=='slide':
        d.rounded_rectangle([31,70,95,94], radius=13, fill=(93,20,24,255), outline=(244,210,142,255), width=4)
        d.rounded_rectangle([21,80,58,100], radius=10, fill=(28,29,26,255))
        d.rounded_rectangle([74,80,108,100], radius=10, fill=(28,29,26,255))
        d.ellipse([26,45,64,83], fill=(210,160,89,255), outline=(35,26,19,255), width=4)
        d.rectangle([34,62,56,69], fill=(23,21,19,255))
        d.arc([32,57,57,77], 0, 180, fill=(245,226,174,255), width=3)
    else:
        y=bob
        d.rounded_rectangle([42,47+y,86,96+y], radius=12, fill=(93,20,24,255), outline=(242,213,158,255), width=4)
        d.rectangle([49,66+y,79,89+y], fill=(159,31,34,255))
        d.ellipse([38,13+y,90,60+y], fill=(207,155,84,255), outline=(30,25,20,255), width=4)
        d.rounded_rectangle([49,32+y,79,47+y], radius=8, fill=(21,20,17,255))
        d.arc([48,26+y,80,48+y],0,180,fill=(247,229,180,255),width=3)
        arm_s=math.sin(frame*math.pi/2)
        d.line([42,60+y,29,76+y+arm_s*5], fill=(32,30,26,255), width=7)
        d.line([86,60+y,99,76+y-arm_s*5], fill=(32,30,26,255), width=7)
        if pose=='jump':
            d.line([52,94+y,36,108+y], fill=(28,28,25,255), width=8)
            d.line([76,94+y,93,108+y], fill=(28,28,25,255), width=8)
        else:
            leg_s=math.sin(frame*math.pi/2)
            d.line([53,94+y,45+leg_s*8,114+y], fill=(25,25,22,255), width=8)
            d.line([75,94+y,83-leg_s*8,114+y], fill=(25,25,22,255), width=8)
    return im

def draw_stool(frame=0):
    im=Image.new('RGBA',(cell,cell),(0,0,0,0)); d=ImageDraw.Draw(im); shadow(d,25,101,104,116,75)
    off=[0,1,0,-1][frame%4]
    d.rounded_rectangle([26,48+off,102,67+off], radius=9, fill=(132,78,43,255), outline=(201,128,72,255), width=4)
    d.rectangle([38,66+off,48,104+off], fill=(206,158,88,255)); d.rectangle([80,66+off,90,104+off], fill=(206,158,88,255))
    d.line([41,102+off,32,112+off], fill=(45,34,25,255), width=6); d.line([87,102+off,98,112+off], fill=(45,34,25,255), width=6)
    d.rounded_rectangle([32,41+off,96,56+off], radius=8, fill=(96,51,33,255), outline=(194,119,70,255), width=3)
    return im

def draw_keg(frame=0):
    im=Image.new('RGBA',(cell,cell),(0,0,0,0)); d=ImageDraw.Draw(im); shadow(d,28,101,102,116,80)
    shine=[0,4,2,0][frame%4]
    d.rounded_rectangle([34,33,94,105], radius=18, fill=(91,54,36,255), outline=(216,153,82,255), width=4)
    for y in [44,66,88]: d.rectangle([32,y,96,y+6], fill=(55,42,34,255))
    d.ellipse([44,50,84,88], fill=(130,77,48,255), outline=(45,35,30,255), width=3)
    d.rectangle([55,36,68,101], fill=(164,105,59,110))
    d.line([48,39,60+shine,39], fill=(240,190,113,255), width=3)
    return im

def draw_puddle(frame=0):
    im=Image.new('RGBA',(cell,cell),(0,0,0,0)); d=ImageDraw.Draw(im)
    d.ellipse([20,77,108,108], fill=(14,74,77,210), outline=(74,189,179,255), width=4)
    d.ellipse([39,84,73,95], fill=(123,232,208,120))
    if frame%2: d.arc([24,72,105,111], 195, 345, fill=(160,255,226,170), width=3)
    else: d.arc([30,80,96,104], 190, 350, fill=(160,255,226,120), width=2)
    return im

def draw_neon(frame=0):
    im=Image.new('RGBA',(cell,cell),(0,0,0,0)); glow=Image.new('RGBA',(cell,cell),(0,0,0,0)); gd=ImageDraw.Draw(glow)
    a=[120,190,150,220][frame%4]
    gd.rounded_rectangle([30,18,98,53], radius=10, fill=(184,23,42,a))
    glow=glow.filter(ImageFilter.GaussianBlur(7)); im.alpha_composite(glow); d=ImageDraw.Draw(im)
    d.rounded_rectangle([31,20,97,51], radius=9, fill=(50,12,18,245), outline=(255,84,104,255), width=4)
    d.text((43,30),'SAL', fill=(255,225,180,255))
    d.line([38,52,31,92], fill=(71,58,48,255), width=5); d.line([90,52,98,92], fill=(71,58,48,255), width=5)
    shadow(d,30,91,104,104,60)
    return im

def draw_beer(frame=0):
    im=Image.new('RGBA',(cell,cell),(0,0,0,0)); glow=Image.new('RGBA',(cell,cell),(0,0,0,0)); gd=ImageDraw.Draw(glow); y=[0,-2,0,2,0,-1][frame%6]
    gd.ellipse([34,31+y,91,94+y], fill=(216,148,44,75)); glow=glow.filter(ImageFilter.GaussianBlur(7)); im.alpha_composite(glow); d=ImageDraw.Draw(im)
    d.rounded_rectangle([44,34+y,78,91+y], radius=8, fill=(197,119,28,255), outline=(255,232,170,255), width=4)
    d.rectangle([52,47+y,59,78+y], fill=(255,181,69,185))
    d.rounded_rectangle([74,50+y,94,76+y], radius=4, outline=(238,230,201,255), width=5)
    d.rounded_rectangle([40,27+y,81,41+y], radius=6, fill=(255,245,208,255))
    if frame%3==0: d.ellipse([35,24+y,44,32+y], fill=(255,245,208,210))
    return im

def draw_shield(frame=0):
    im=Image.new('RGBA',(cell,cell),(0,0,0,0)); d=ImageDraw.Draw(im)
    a=[110,170,130,200][frame%4]
    d.ellipse([22,18,106,106], outline=(90,216,174,a), width=8)
    d.arc([31,29,97,95], frame*25, frame*25+230, fill=(222,255,219,220), width=5)
    d.polygon([(64,35),(88,48),(82,79),(64,94),(46,79),(40,48)], fill=(22,116,88,210), outline=(208,250,210,255))
    return im

def draw_impact(frame=0):
    im=Image.new('RGBA',(cell,cell),(0,0,0,0)); d=ImageDraw.Draw(im)
    r=[36,44,50,58][frame%4]; a=[230,190,130,60][frame%4]
    d.ellipse([64-r,64-r,64+r,64+r], outline=(255,198,83,a), width=5)
    for ang in range(0,360,45):
        x=64+math.cos(math.radians(ang))*r; y=64+math.sin(math.radians(ang))*r
        d.line([64,64,x,y], fill=(255,230,150,a), width=3)
    return im

add('playerRun',[lambda i=i: draw_player(i,'run') for i in range(4)])
add('playerJump',[lambda: draw_player(0,'jump')])
add('playerSlide',[lambda: draw_player(0,'slide')])
add('stool',[lambda i=i: draw_stool(i) for i in range(4)])
add('keg',[lambda i=i: draw_keg(i) for i in range(4)])
add('puddle',[lambda i=i: draw_puddle(i) for i in range(2)])
add('neon',[lambda i=i: draw_neon(i) for i in range(4)])
add('beer',[lambda i=i: draw_beer(i) for i in range(6)])
add('shield',[lambda i=i: draw_shield(i) for i in range(4)])
add('impact',[lambda i=i: draw_impact(i) for i in range(4)])
cols=8; rows=math.ceil(len(names)/cols)
atlas=Image.new('RGBA',(cols*cell,rows*cell),(0,0,0,0))
meta={'image':'/public/assets/game-sprites.png','cell':cell,'sprites':{}}
for idx,(name,frame,fn) in enumerate(names):
    x=(idx%cols)*cell; y=(idx//cols)*cell
    atlas.alpha_composite(fn(),(x,y))
    meta['sprites'].setdefault(name,[]).append({'x':x,'y':y,'w':cell,'h':cell,'duration':90})
out.parent.mkdir(parents=True, exist_ok=True)
atlas.save(out)
meta_out.write_text(json.dumps(meta,indent=2))
print(f'wrote {out} {atlas.size} frames={len(names)}')
print(f'wrote {meta_out}')
