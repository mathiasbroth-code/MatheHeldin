#!/bin/bash
# Extrahiert 3-5 I-Frame Keyframes pro Video als PNG
# Ergebnis: _reference/video-keyframes/<videoname_ohne_ext>/frame_001.png ...

VIDEOS_DIR="$(dirname "$0")/videos"
OUT_DIR="$(dirname "$0")/video-keyframes"
mkdir -p "$OUT_DIR"

total=$(ls "$VIDEOS_DIR"/*.mp4 2>/dev/null | wc -l | tr -d ' ')
count=0

for video in "$VIDEOS_DIR"/*.mp4; do
  count=$((count + 1))
  basename=$(basename "$video" .mp4)
  outdir="$OUT_DIR/$basename"

  # Skip if already extracted
  if [ -d "$outdir" ] && [ "$(ls "$outdir"/*.png 2>/dev/null | wc -l)" -gt 0 ]; then
    printf "\r[%d/%d] Skipped: %s" "$count" "$total" "$basename"
    continue
  fi

  mkdir -p "$outdir"

  # Extract up to 5 I-frames (keyframes)
  ffmpeg -nostdin -i "$video" \
    -vf "select=eq(pict_type\,I)" \
    -vsync vfr \
    -frames:v 5 \
    -q:v 2 \
    "$outdir/frame_%03d.png" \
    -y -loglevel error 2>/dev/null

  printf "\r[%d/%d] Extracted: %s                    " "$count" "$total" "$basename"
done

echo ""
echo "Done! Keyframes in $OUT_DIR"
