#!/bin/sh
# Keeps /stars.json up to date with the repository's star count, so the
# number in the navigation follows GitHub between deploys without visitors'
# browsers ever calling GitHub. Runs in the background from the image's
# entrypoint: at start, then every STARS_EVERY seconds (an hour by default),
# and every five minutes after a failed read until one succeeds. That stays
# well inside GitHub's 60 anonymous reads an hour. A failed read keeps the
# last count. Every attempt is logged, so `docker logs` shows what happened.
set -u
repo="${STARS_REPO:-zephium-browser/Zephium}"
every="${STARS_EVERY:-3600}"
out=/usr/share/nginx/html/stars.json

refresh() {
  body=$(curl -sS --max-time 15 -w '\n%{http_code}' \
    -H "Accept: application/vnd.github+json" \
    -H "User-Agent: zephium.app" \
    "https://api.github.com/repos/${repo}" 2>&1)
  code=$(printf '%s' "${body}" | tail -n 1)
  count=$(printf '%s' "${body}" | tr -d ' \n' |
    grep -o '"stargazers_count":[0-9]*' | head -n 1 | cut -d: -f2)
  if [ "${code}" = "200" ] && [ -n "${count}" ]; then
    printf '{"stars":%s}\n' "${count}" > "${out}.tmp" && mv "${out}.tmp" "${out}"
    echo "stars: ${count}"
    return 0
  fi
  echo "stars: read failed (HTTP ${code:-none}): $(printf '%s' "${body}" | head -c 200)"
  return 1
}

(
  while true; do
    if refresh; then sleep "${every}"; else sleep 300; fi
  done
) &
