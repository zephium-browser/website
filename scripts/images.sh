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

# The sky (the new tab's day source, the hero and the cards' desks), the new
# tab's baked night sky, the film's poster and the Work shot from the film,
# as AVIF with a JPEG beside each. ffmpeg with libsvtav1.
avif() { # source, output, width, crf
  ffmpeg -v error -y -i "$1" -vf "scale=$3:-2:flags=lanczos,format=yuv420p10le" -frames:v 1 -c:v libsvtav1 -crf "$4" -preset 4 "$2"
}
jpeg() { # source, output, width
  ffmpeg -v error -y -i "$1" -vf "scale=$3:-2:flags=lanczos" -q:v 3 "$2"
}
for w in 900 1672; do avif media/sky-day-source.png "public/sky/day-$w.avif" "$w" 18; jpeg media/sky-day-source.png "public/sky/day-$w.jpg" "$w"; done
for w in 1200 2200; do avif media/sky-night-baked.avif "public/sky/night-$w.avif" "$w" 24; jpeg media/sky-night-baked.avif "public/sky/night-$w.jpg" "$w"; done
for w in 1280 2560; do avif media/film-poster.png "public/film/poster-$w.avif" "$w" 22; jpeg media/film-poster.png "public/film/poster-$w.jpg" "$w"; done
for w in 1280 2560; do avif media/work-run.png "public/shots/work-run-$w.avif" "$w" 20; jpeg media/work-run.png "public/shots/work-run-$w.jpg" "$w"; done
ffmpeg -v error -y -i media/film-poster.png -vf "scale=1200:675:flags=lanczos,crop=1200:630:0:12" -q:v 2 app/opengraph-image.jpg
cp app/opengraph-image.jpg app/twitter-image.jpg
