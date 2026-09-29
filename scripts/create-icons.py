from PIL import Image, ImageOps
from pathlib import Path
import sys
root = Path(__file__).resolve().parents[1]
assets = root / 'assets'
assets.mkdir(exist_ok=True)
if len(sys.argv) == 3:
    for arg, name in zip(sys.argv[1:], ['brand-original.png', 'brand-transparent.png']):
        Image.open(arg).convert('RGBA').save(assets / name)
framed = Image.open(assets / 'brand-original.png').convert('RGBA')
transparent = Image.open(assets / 'brand-transparent.png').convert('RGBA')
out = root / 'public'
for name, size in [('icon-192.png',192),('icon-512.png',512),('apple-touch-icon.png',180)]:
    art = ImageOps.contain(framed,(size,size),method=Image.Resampling.LANCZOS)
    canvas = Image.new('RGBA',(size,size),'#041124')
    canvas.alpha_composite(art,((size-art.width)//2,(size-art.height)//2))
    canvas.convert('RGB').save(out/name,optimize=True)
canvas = Image.new('RGBA',(512,512),'#041124')
art = ImageOps.contain(framed,(356,356),method=Image.Resampling.LANCZOS)
canvas.alpha_composite(art,((512-art.width)//2,(512-art.height)//2))
canvas.convert('RGB').save(out/'icon-maskable.png',optimize=True)
for size in [32,64]:
    art = ImageOps.contain(transparent,(size,size),method=Image.Resampling.LANCZOS)
    canvas = Image.new('RGBA',(size,size))
    canvas.alpha_composite(art,((size-art.width)//2,(size-art.height)//2))
    if size == 32: canvas.save(out/'favicon-32.png',optimize=True)
    else: canvas.save(out/'favicon.ico',sizes=[(16,16),(32,32),(48,48),(64,64)])
ImageOps.contain(transparent,(640,640),method=Image.Resampling.LANCZOS).save(out/'brand-penguin.webp',quality=90,method=6)
for name in ['icon-192.png','icon-512.png','icon-maskable.png','apple-touch-icon.png','brand-penguin.webp','favicon-32.png']:
    with Image.open(out/name) as image:
        print(name,image.size,image.mode)
        if name in ['brand-penguin.webp','favicon-32.png']:
            assert image.mode == 'RGBA' and image.getchannel('A').getextrema()[0] == 0
print('PASS: logo and favicon retain transparent pixels; PWA icons have opaque backgrounds.')
