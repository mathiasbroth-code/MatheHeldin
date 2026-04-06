#!/bin/bash
# Extrahiert 3 Frames pro Video bei 25%, 50%, 75% der Laufzeit
# Besser als I-Frames, weil die eigentlichen Inhalte erfasst werden

VIDEOS_DIR="$(dirname "$0")/videos"
OUT_DIR="$(dirname "$0")/video-content-frames"
mkdir -p "$OUT_DIR"

total=$(ls "$VIDEOS_DIR"/*.mp4 2>/dev/null | wc -l | tr -d ' ')
count=0

for video in "$VIDEOS_DIR"/*.mp4; do
  count=$((count + 1))
  basename=$(basename "$video" .mp4)
  outdir="$OUT_DIR/$basename"

  if [ -d "$outdir" ] && [ "$(ls "$outdir"/*.png 2>/dev/null | wc -l)" -ge 3 ]; then
    printf "\r[%d/%d] Skipped: %s" "$count" "$total" "$basename"
    continue
  fi

  mkdir -p "$outdir"

  # Get duration
  dur=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$video" 2>/dev/null)

  if [ -z "$dur" ] || [ "$dur" = "N/A" ]; then
    printf "\r[%d/%d] ERROR (no duration): %s\n" "$count" "$total" "$basename"
    continue
  fi

  # Calculate timestamps at 25%, 50%, 75%
  t25=$(echo "$dur * 0.25" | bc -l)
  t50=$(echo "$dur * 0.50" | bc -l)
  t75=$(echo "$dur * 0.75" | bc -l)

  for i in 1 2 3; do
    case $i in
      1) ts=$t25 ;;
      2) ts=$t50 ;;
      3) ts=$t75 ;;
    esac
    ffmpeg -nostdin -ss "$ts" -i "$video" -frames:v 1 -q:v 2 "$outdir/content_${i}.png" -y -loglevel error 2>/dev/null
  done

  printf "\r[%d/%d] Extracted: %s                    " "$count" "$total" "$basename"
done

echo ""
echo "Done! Content frames in $OUT_DIR"
