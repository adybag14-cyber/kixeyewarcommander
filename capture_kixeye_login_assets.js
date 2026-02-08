const fs = require("fs");
const path = require("path");
const puppeteer = require("puppeteer");

const START_URLS = [
    "https://www.kixeye.com/warcommander",
    "https://www.kixeye.com/game/play/war-commander"
];

function isAssetLikeUrl(rawUrl) {
    const url = String(rawUrl || "").toLowerCase();
    if (!url || url.startsWith("data:") || url.startsWith("blob:")) return false;

    if (/\.(png|jpg|jpeg|webp|gif|svg|json|xml|zip|swf|mp3|ogg|woff2?|ttf|otf|js|css)(\?|$)/i.test(url)) {
        return true;
    }
    if (url.includes("/assets/") || url.includes("/manifest/")) return true;
    if (url.includes("cdn-kixeye.com") || url.includes("kixeye.com")) return true;
    return false;
}

function stripHash(url) {
    const i = url.indexOf("#");
    return i >= 0 ? url.slice(0, i) : url;
}

function toAssetPath(rawUrl) {
    try {
        const u = new URL(rawUrl);
        let p = decodeURIComponent(u.pathname || "");
        if (p.startsWith("/")) p = p.slice(1);
        return p;
    } catch {
        return "";
    }
}

function ensureDir(dirPath) {
    if (!fs.existsSync(dirPath)) fs.mkdirSync(dirPath, { recursive: true });
}

async function main() {
    const startedAt = new Date();
    const stamp = startedAt.toISOString().replace(/[:.]/g, "-");
    const outDir = path.join(process.cwd(), "kixeye_capture");
    ensureDir(outDir);

    const networkRecords = [];
    const allUrls = new Set();
    const assetUrls = new Set();
    const assetPaths = new Set();

    const browser = await puppeteer.launch({
        headless: false,
        defaultViewport: null,
        userDataDir: path.join(process.cwd(), ".puppeteer-kixeye-profile"),
        args: ["--start-maximized"]
    });

    const page = await browser.newPage();
    page.setDefaultNavigationTimeout(120000);

    page.on("request", (req) => {
        const url = stripHash(req.url());
        allUrls.add(url);
        if (isAssetLikeUrl(url)) {
            assetUrls.add(url);
            const p = toAssetPath(url);
            if (p) assetPaths.add(p);
        }
        networkRecords.push({
            ts: Date.now(),
            kind: "request",
            method: req.method(),
            resourceType: req.resourceType(),
            url
        });
    });

    page.on("response", (res) => {
        const req = res.request();
        const url = stripHash(res.url());
        networkRecords.push({
            ts: Date.now(),
            kind: "response",
            status: res.status(),
            method: req.method(),
            resourceType: req.resourceType(),
            url
        });
    });

    page.on("requestfailed", (req) => {
        networkRecords.push({
            ts: Date.now(),
            kind: "requestfailed",
            method: req.method(),
            resourceType: req.resourceType(),
            errorText: req.failure() ? req.failure().errorText : "unknown",
            url: stripHash(req.url())
        });
    });

    page.on("console", (msg) => {
        networkRecords.push({
            ts: Date.now(),
            kind: "console",
            level: msg.type(),
            text: msg.text()
        });
    });

    let navigated = false;
    for (const url of START_URLS) {
        try {
            console.log(`[capture] Opening ${url}`);
            await page.goto(url, { waitUntil: "domcontentloaded" });
            navigated = true;
            break;
        } catch (err) {
            console.log(`[capture] Failed ${url}: ${err.message}`);
        }
    }

    if (!navigated) {
        console.log("[capture] Could not open KIXEYE start URLs.");
        await browser.close();
        process.exit(1);
    }

    console.log("[capture] Browser is open. Log in to War Commander now.");
    console.log("[capture] When done, close the browser window(s).");

    await new Promise((resolve) => {
        browser.on("disconnected", resolve);
    });

    const allUrlList = Array.from(allUrls).sort();
    const assetUrlList = Array.from(assetUrls).sort();
    const assetPathList = Array.from(assetPaths).sort();

    const files = {
        records: path.join(outDir, `kixeye_network_records_${stamp}.json`),
        allUrls: path.join(outDir, `kixeye_all_urls_${stamp}.txt`),
        assetUrls: path.join(outDir, `kixeye_asset_urls_${stamp}.txt`),
        assetPaths: path.join(outDir, `kixeye_asset_paths_${stamp}.txt`),
        summary: path.join(outDir, `kixeye_capture_summary_${stamp}.json`)
    };

    fs.writeFileSync(files.records, JSON.stringify(networkRecords, null, 2), "utf8");
    fs.writeFileSync(files.allUrls, allUrlList.join("\n"), "utf8");
    fs.writeFileSync(files.assetUrls, assetUrlList.join("\n"), "utf8");
    fs.writeFileSync(files.assetPaths, assetPathList.join("\n"), "utf8");
    fs.writeFileSync(
        files.summary,
        JSON.stringify(
            {
                startedAt: startedAt.toISOString(),
                endedAt: new Date().toISOString(),
                totalRecords: networkRecords.length,
                totalUniqueUrls: allUrlList.length,
                totalUniqueAssetUrls: assetUrlList.length,
                totalUniqueAssetPaths: assetPathList.length,
                outputFiles: files
            },
            null,
            2
        ),
        "utf8"
    );

    console.log("[capture] Done.");
    console.log(`[capture] Records: ${files.records}`);
    console.log(`[capture] Asset URL list: ${files.assetUrls}`);
    console.log(`[capture] Asset path list: ${files.assetPaths}`);
}

main().catch((err) => {
    console.error("[capture] Fatal:", err);
    process.exit(1);
});

