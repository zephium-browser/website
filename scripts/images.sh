#!/usr/bin/env bash
# Prepares served images from the originals in media/.
# Screenshots keep their alpha and get a high quality (text must stay crisp);
# photos are cropped to 4:3.
set -euo pipefail
cd "$(dirname "$0")/.."
tmp=$(mktemp -d)
trap 'rm -rf "$tmp"' EXIT

shot() { # source, output, width
  magick "$1" -resize "$3x" -strip "PNG32:$tmp/shot.png"
  cwebp -q 90 -alpha_q 100 -m 6 -sharp_yuv -mt -quiet "$tmp/shot.png" -o "$2"
}
photo() { # source, output
  magick "$1" -resize 960x720^ -gravity center -extent 960x720 -strip "$tmp/photo.png"
  cwebp -q 82 -m 6 -sharp_yuv -mt -quiet "$tmp/photo.png" -o "$2"
}

for w in 1280 2482; do shot media/architecture.png "public/shots/architecture-$w.webp" "$w"; done
for w in 960 1934; do shot media/board.png "public/shots/board-$w.webp" "$w"; done
for w in 489 978; do shot media/attachments.png "public/shots/attachments-$w.webp" "$w"; done
for w in 800 1553; do shot media/launcher.png "public/shots/launcher-$w.webp" "$w"; done

photo media/stay-soma-loft.png public/demo/stay-soma-loft.webp
photo media/stay-mission-bay.png public/demo/stay-mission-bay.webp
photo media/stay-hayes-valley.png public/demo/stay-hayes-valley.webp

for w in 840 1678; do
  magick media/starship.png -resize "${w}x" -strip "$tmp/photo.png"
  cwebp -q 86 -m 6 -sharp_yuv -mt -quiet "$tmp/photo.png" -o "public/shots/starship-$w.webp"
done

# The hero's own sky, captured from the site, as the desktop behind the
# browser cards' panels.
for w in 800 1600; do
  magick media/sky.png -resize "${w}x" -strip "$tmp/photo.png"
  cwebp -q 80 -m 6 -sharp_yuv -mt -quiet "$tmp/photo.png" -o "public/shots/sky-$w.webp"
done
