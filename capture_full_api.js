const fs = require("fs");
const path = require("path");
const puppeteer = require("puppeteer");

function ensureDir(dirPath) {
    if (!fs.existsSync(dirPath)) fs.mkdirSync(dirPath, { recursive: true });
}

function nowStamp() {
    return new Date().toISOString().replace(/[:.]/g, "-");
}

function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

function isApiUrl(url) {
    const s = String(url || "").toLowerCase();
    return s.includes("prod-kx-vip.sjc.kixeye.com/") && (s.includes("/api/") || s.includes("/backend/"));
}

async function main() {
    const startUrl = process.env.KX_START_URL || "https://prod-kx-vip.sjc.kixeye.com/canvas";
    const runMs = Number(process.env.KX_CAPTURE_MS || 90000) || 90000;
    const profileDir = process.env.KIXEYE_PROFILE_DIR || ".puppeteer-kixeye-profile-timeout";

    const outDir = path.join(process.cwd(), "kixeye_capture");
    ensureDir(outDir);
    const outFile = path.join(outDir, "kixeye_full_api_capture_" + nowStamp() + ".json");

    const browser = await puppeteer.launch({
        headless: true,
        defaultViewport: { width: 1600, height: 900 },
        userDataDir: path.join(process.cwd(), profileDir),
        args: ["--no-sandbox"]
    });

    const page = await browser.newPage();
    page.setDefaultNavigationTimeout(120000);

    const rows = [];
    const seen = new Set();

    page.on("response", async (res) => {
        const url = res.url();
        if (!isApiUrl(url)) return;

        const key = String(res.request().method()) + " " + String(url);
        if (seen.has(key)) return;
        seen.add(key);

        const entry = {
            at: new Date().toISOString(),
            url,
            method: res.request().method(),
            status: res.status(),
            resourceType: res.request().resourceType(),
            headers: res.headers()
        };

        try {
            const ctype = String(res.headers()["content-type"] || "");
            if (ctype.includes("json") || ctype.includes("text") || ctype.includes("javascript")) {
                const text = await res.text();
                entry.bodyLength = text.length;
                entry.body = text;
            }
        } catch (e) {
            entry.bodyError = String((e && e.message) || e);
        }

        rows.push(entry);
        console.log("[full-capture]", entry.status, entry.method, entry.url, "len", entry.bodyLength || 0);
    });

    console.log("[full-capture] opening", startUrl);
    await page.goto(startUrl, { waitUntil: "domcontentloaded" });
    await sleep(runMs);

    fs.writeFileSync(outFile, JSON.stringify(rows, null, 2), "utf8");
    console.log("[full-capture] wrote", outFile, "records", rows.length);

    await browser.close();
}

main().catch((err) => {
    console.error("[full-capture] fatal:", err && err.stack ? err.stack : err);
    process.exit(1);
});
