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

createServer((request, response) => {
  const path = normalize(decodeURIComponent(new URL(request.url, "http://x").pathname));
  const base = join(root, path);
  const found =
    file(base) ?? file(`${base}.html`) ?? file(join(base, "index.html"));
  const target = found ?? join(root, "404.html");
  const type = found && path === "/opengraph-image" ? "image/png" : types[extname(target)];
  response.writeHead(found ? 200 : 404, { "content-type": type ?? "application/octet-stream" });
  createReadStream(target).pipe(response);
}).listen(port, () => console.log(`http://localhost:${port}`));
