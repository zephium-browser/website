// Serves the static export the way the production host does: clean URLs map
// to their .html files, and unknown paths get the 404 page.
import { createReadStream, statSync } from "node:fs";
import { createServer } from "node:http";
import { extname, join, normalize } from "node:path";

const root = join(process.cwd(), "out");
const port = Number(process.env.PORT ?? 4173);
const types = {
  ".html": "text/html; charset=utf-8", ".js": "text/javascript", ".css": "text/css",
  ".json": "application/json", ".txt": "text/plain; charset=utf-8", ".svg": "image/svg+xml",
  ".png": "image/png", ".webp": "image/webp", ".avif": "image/avif", ".ico": "image/x-icon",
  ".woff2": "font/woff2", ".xml": "application/xml", ".webmanifest": "application/manifest+json",
};

const file = (path) => {
  try {
    return statSync(path).isFile() ? path : null;
  } catch {
    return null;
  }
};

const server = createServer((request, response) => {
  const url = new URL(request.url, "http://x");
  // The billing return page answers once at its slash-less address, as nginx does.
  if (url.pathname === "/billing/return/") {
    response.writeHead(301, { location: `/billing/return${url.search}` }).end();
    return;
  }
  const path = normalize(decodeURIComponent(url.pathname));
  const privateAction = /^\/linux\/unsubscribe(?:\.html|\/)?$/.test(path);
  const base = join(root, privateAction ? "/linux/unsubscribe" : path);
  const found =
    file(base) ?? file(`${base}.html`) ?? file(join(base, "index.html"));
  const target = found ?? join(root, "404.html");
  const type = found && path === "/opengraph-image" ? "image/png" : types[extname(target)];
  const headers = { "content-type": type ?? "application/octet-stream" };
  // Match the unsubscribe page's production policy, including its aliases.
  if (privateAction) {
    const origin = process.env.NEXT_PUBLIC_LINUX_WAITLIST_API_ORIGIN;
    const api = ["https://api.zephium.app", "https://staging-api.zephium.app"].includes(origin) ? origin : "";
    headers["referrer-policy"] = "no-referrer";
    headers["x-robots-tag"] = "noindex, nofollow";
    headers["cache-control"] = "no-store";
    headers["content-security-policy"] = `default-src 'self'; script-src 'self' 'unsafe-inline'; connect-src 'self' ${api}; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self' data:; object-src 'none'; base-uri 'none'; form-action 'none'; frame-ancestors 'none'`;
  }
  response.writeHead(found ? 200 : 404, headers);
  createReadStream(target).pipe(response);
}).listen(port, "127.0.0.1", () => console.log(`http://127.0.0.1:${server.address().port}`));
