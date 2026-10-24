#!/bin/sh
# Keeps /stars.json up to date with the repository's star count, so the
# number in the navigation follows GitHub between deploys without visitors'
# browsers ever calling GitHub. Runs in the background from the image's
# entrypoint: once at start, then every STARS_EVERY seconds (six hours by
# default), well inside GitHub's 60 anonymous reads an hour. A failed read
# keeps the last count.
set -u
repo="${STARS_REPO:-zephium-browser/Zephium}"
every="${STARS_EVERY:-21600}"
out=/usr/share/nginx/html/stars.json

refresh() {
  count=$(curl -fsS --max-time 10 -H "Accept: application/vnd.github+json" \
    "https://api.github.com/repos/${repo}" 2>/dev/null |
    sed -n 's/^ *"stargazers_count": *\([0-9][0-9]*\).*/\1/p' | head -n 1)
  if [ -n "${count}" ]; then
    printf '{"stars":%s}\n' "${count}" > "${out}.tmp" && mv "${out}.tmp" "${out}"
  fi
}

(
  while true; do
    refresh
    sleep "${every}"
  done
) &
