// Stop Stories London has moved to https://stopstories.com/london/ (since 2 Nov 2026).
// Every address here forwards there. Browsers keep the #line/#station part of the link across the redirect.
// /sw.js removes the old offline copy from phones that had the London app installed.
"use strict";
const http = require("http");
const TARGET = "https://stopstories.com/london/";
const KILL_SW = `self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", e => e.waitUntil((async () => {
  for (const k of await caches.keys()) await caches.delete(k);
  await self.registration.unregister();
  for (const c of await self.clients.matchAll({ type: "window" })) c.navigate(${JSON.stringify(TARGET)});
})()));
`;
http.createServer((req, res) => {
  const path = new URL(req.url, "http://x").pathname;
  if (path === "/sw.js") {
    res.writeHead(200, { "Content-Type": "text/javascript; charset=utf-8", "Cache-Control": "no-cache" });
    return res.end(KILL_SW);
  }
  res.writeHead(301, { Location: TARGET, "Cache-Control": "public, max-age=86400", "Content-Type": "text/html; charset=utf-8" });
  res.end(`<!doctype html><meta charset="utf-8"><title>Stop Stories London has moved</title><p>Stop Stories London is now at <a href="${TARGET}">${TARGET}</a>.</p>`);
}).listen(+process.env.PORT || 3000);
