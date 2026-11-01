"""Screenshots of the built site at phone size: python3 shot.py name=hash [name=hash ...] [--dark] [--lang=fr]"""
import sys, asyncio, os, http.server, threading, functools
from playwright.async_api import async_playwright
SITE = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "site")
OUTD = os.environ.get("SHOTS", "/tmp/claude-0/shots")
def serve():
    h = functools.partial(http.server.SimpleHTTPRequestHandler, directory=SITE)
    h.log_message = lambda *a: None
    s = http.server.ThreadingHTTPServer(("127.0.0.1", 8765), h); threading.Thread(target=s.serve_forever, daemon=True).start()
async def main():
    serve()
    dark = "--dark" in sys.argv
    lang = next((a[7:] for a in sys.argv if a.startswith("--lang=")), "en")
    async with async_playwright() as p:
        b = await p.chromium.launch(executable_path="/usr/bin/google-chrome")
        ctx = await b.new_context(viewport={"width": 390, "height": 844}, device_scale_factor=2, color_scheme="dark" if dark else "light", locale=lang)
        pg = await ctx.new_page()
        errs = []; pg.on("pageerror", lambda e: errs.append(str(e))); pg.on("console", lambda m: m.type == "error" and errs.append(m.text))
        await pg.goto("http://127.0.0.1:8765/index.html"); await pg.evaluate(f"localStorage.setItem('lang','{lang}')")
        for a in sys.argv[1:]:
            if a.startswith("--"): continue
            name, h = a.split("=", 1)
            click = None
            if "!" in h: h, click = h.split("!", 1)
            await pg.goto("http://127.0.0.1:8765/index.html#" + h); await pg.reload(); await pg.wait_for_timeout(700)
            if click: await pg.click(click); await pg.wait_for_timeout(400)
            await pg.screenshot(path=f"{OUTD}/{name}.png", full_page="full" in name)
        print("errors:", errs)
        await b.close()
if __name__ == "__main__":
    asyncio.run(main())
