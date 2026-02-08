const fs = require("fs");
const path = require("path");
const puppeteer = require("puppeteer");

const DEFAULT_TIMEOUT_SEC = 180;
const FLUSH_INTERVAL_MS = 10000;
const METRIC_INTERVAL_MS = 5000;

const SENSITIVE_QUERY_KEYS = new Set([
    "kixigned_request",
    "kxltoken",
    "token",
    "session",
    "sessionid",
    "auth",
    "signature",
    "sig"
]);

function ensureDir(dirPath) {
    if (!fs.existsSync(dirPath)) fs.mkdirSync(dirPath, { recursive: true });
}

function parseArgs(argv) {
    const out = {};
    for (let i = 2; i < argv.length; i++) {
        const a = argv[i];
        if (a === "--url" && argv[i + 1]) out.url = argv[++i];
        else if (a === "--timeout" && argv[i + 1]) out.timeoutSec = Number(argv[++i]) || DEFAULT_TIMEOUT_SEC;
        else if (a === "--headless") out.headless = true;
        else if (a === "--visible") out.headless = false;
    }
    return out;
}

function redactUrl(rawUrl) {
    try {
        const u = new URL(String(rawUrl || ""));
        const kept = [];
        for (const [k, v] of u.searchParams.entries()) {
            const key = String(k || "").toLowerCase();
            if (SENSITIVE_QUERY_KEYS.has(key)) continue;
            kept.push([k, v]);
        }
        u.search = "";
        if (kept.length) {
            const params = new URLSearchParams();
            for (const [k, v] of kept) params.append(k, v);
            u.search = params.toString();
        }
        return u.toString();
    } catch {
        return String(rawUrl || "");
    }
}

function stripHash(rawUrl) {
    const s = String(rawUrl || "");
    const i = s.indexOf("#");
    return i >= 0 ? s.slice(0, i) : s;
}

function isAssetLikeUrl(rawUrl) {
    const url = String(rawUrl || "").toLowerCase();
    if (!url || url.startsWith("data:") || url.startsWith("blob:")) return false;
    if (/\.(png|jpg|jpeg|webp|gif|svg|json|xml|zip|swf|mp3|ogg|woff2?|ttf|otf|js|css)(\?|$)/i.test(url)) {
        return true;
    }
    return url.includes("/assets/") || url.includes("/manifest/") || url.includes("/embedded/");
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

function safeNow() {
    return new Date().toISOString();
}

function sanitizeConsoleArg(arg) {
    try {
        const s = String(arg);
        if (!s) return s;
        return s.replace(/kixigned_request=[^&\s]+/gi, "kixigned_request=[redacted]")
                .replace(/kxlToken=[^&\s]+/gi, "kxlToken=[redacted]");
    } catch {
        return "";
    }
}

function isInspectableApiUrl(url) {
    const s = String(url || "").toLowerCase();
    return s.includes("prod-kx-vip.sjc.kixeye.com/") && (s.includes("/api/") || s.includes("/backend/") || s.includes("/live/"));
}

async function main() {
    const args = parseArgs(process.argv);
    const startUrl = args.url || process.env.KIXEYE_START_URL;
    const timeoutSec = Number(args.timeoutSec || process.env.KIXEYE_TIMEOUT_SEC || DEFAULT_TIMEOUT_SEC) || DEFAULT_TIMEOUT_SEC;
    const headless = typeof args.headless === "boolean"
        ? args.headless
        : (process.env.KIXEYE_HEADLESS === "1" ? true : false);

    if (!startUrl) {
        console.error("Missing start URL. Use --url <signed_url> or KIXEYE_START_URL env var.");
        process.exit(1);
    }

    const startedAt = new Date();
    const stamp = startedAt.toISOString().replace(/[:.]/g, "-");
    const outDir = path.join(process.cwd(), "kixeye_capture");
    ensureDir(outDir);

    const recordsFile = path.join(outDir, `kixeye_network_records_timeout_${stamp}.json`);
    const summaryFile = path.join(outDir, `kixeye_capture_summary_timeout_${stamp}.json`);
    const allUrlsFile = path.join(outDir, `kixeye_all_urls_timeout_${stamp}.txt`);
    const assetUrlsFile = path.join(outDir, `kixeye_asset_urls_timeout_${stamp}.txt`);
    const assetPathsFile = path.join(outDir, `kixeye_asset_paths_timeout_${stamp}.txt`);
    const memoryFile = path.join(outDir, `kixeye_memory_timeout_${stamp}.json`);

    const networkRecords = [];
    const memorySamples = [];
    const allUrls = new Set();
    const assetUrls = new Set();
    const assetPaths = new Set();
    const endpointStats = new Map();

    const profileDir = process.env.KIXEYE_PROFILE_DIR || ".puppeteer-kixeye-profile-timeout";

    const browser = await puppeteer.launch({
        headless,
        defaultViewport: null,
        userDataDir: path.join(process.cwd(), profileDir),
        args: ["--start-maximized"]
    });
    const page = await browser.newPage();
    page.setDefaultNavigationTimeout(120000);

    function bumpEndpoint(url, status, kind) {
        try {
            const u = new URL(url);
            const key = `${u.host}${u.pathname}`;
            const cur = endpointStats.get(key) || { requests: 0, responses: 0, failed: 0, statusCodes: {} };
            if (kind === "request") cur.requests += 1;
            if (kind === "response") {
                cur.responses += 1;
                const s = String(status || 0);
                cur.statusCodes[s] = (cur.statusCodes[s] || 0) + 1;
            }
            if (kind === "failed") cur.failed += 1;
            endpointStats.set(key, cur);
        } catch {
            // ignore parse errors
        }
    }

    function record(item) {
        networkRecords.push(item);
    }

    function trackUrl(raw) {
        const url = redactUrl(stripHash(raw));
        allUrls.add(url);
        if (isAssetLikeUrl(url)) {
            assetUrls.add(url);
            const p = toAssetPath(url);
            if (p) assetPaths.add(p);
        }
        return url;
    }

    page.on("request", (req) => {
        const url = trackUrl(req.url());
        bumpEndpoint(url, 0, "request");
        record({
            ts: Date.now(),
            at: safeNow(),
            kind: "request",
            method: req.method(),
            resourceType: req.resourceType(),
            url
        });
    });

    page.on("response", async (res) => {
        const req = res.request();
        const url = trackUrl(res.url());
        const status = res.status();
        bumpEndpoint(url, status, "response");
        const entry = {
            ts: Date.now(),
            at: safeNow(),
            kind: "response",
            status,
            method: req.method(),
            resourceType: req.resourceType(),
            url
        };

        try {
            if (isInspectableApiUrl(url)) {
                const ctype = String(res.headers()["content-type"] || "");
                if (ctype.includes("json") || ctype.includes("text") || ctype.includes("javascript")) {
                    const text = await res.text();
                    const clipped = text.length > 8000 ? text.slice(0, 8000) : text;
                    entry.bodySnippet = clipped;
                    entry.bodyLength = text.length;
                    try {
                        const parsed = JSON.parse(text);
                        if (parsed && typeof parsed === "object") {
                            entry.bodyTopKeys = Object.keys(parsed).slice(0, 60);
                        }
                    } catch {
                        // not json
                    }
                }
            }
        } catch (e) {
            entry.bodySnippetError = String(e && e.message ? e.message : e);
        }

        record(entry);
    });

    page.on("requestfailed", (req) => {
        const url = trackUrl(req.url());
        bumpEndpoint(url, 0, "failed");
        record({
            ts: Date.now(),
            at: safeNow(),
            kind: "requestfailed",
            method: req.method(),
            resourceType: req.resourceType(),
            errorText: req.failure() ? req.failure().errorText : "unknown",
            url
        });
    });

    page.on("console", (msg) => {
        const txt = sanitizeConsoleArg(msg.text());
        record({
            ts: Date.now(),
            at: safeNow(),
            kind: "console",
            level: msg.type(),
            text: txt
        });
    });

    async function flush(reason) {
        const allUrlList = Array.from(allUrls).sort();
        const assetUrlList = Array.from(assetUrls).sort();
        const assetPathList = Array.from(assetPaths).sort();
        const endpointStatsObj = Object.fromEntries(
            Array.from(endpointStats.entries())
                .sort((a, b) => (b[1].requests + b[1].responses + b[1].failed) - (a[1].requests + a[1].responses + a[1].failed))
                .slice(0, 500)
        );

        fs.writeFileSync(recordsFile, JSON.stringify(networkRecords, null, 2), "utf8");
        fs.writeFileSync(memoryFile, JSON.stringify(memorySamples, null, 2), "utf8");
        fs.writeFileSync(allUrlsFile, allUrlList.join("\n"), "utf8");
        fs.writeFileSync(assetUrlsFile, assetUrlList.join("\n"), "utf8");
        fs.writeFileSync(assetPathsFile, assetPathList.join("\n"), "utf8");
        fs.writeFileSync(
            summaryFile,
            JSON.stringify(
                {
                    startedAt: startedAt.toISOString(),
                    endedAt: safeNow(),
                    reason,
                    timeoutSec,
                    records: networkRecords.length,
                    uniqueUrls: allUrlList.length,
                    uniqueAssetUrls: assetUrlList.length,
                    uniqueAssetPaths: assetPathList.length,
                    memorySamples: memorySamples.length,
                    topEndpoints: endpointStatsObj
                },
                null,
                2
            ),
            "utf8"
        );
    }

    const flushTimer = setInterval(() => {
        flush("periodic_flush").catch(() => {});
    }, FLUSH_INTERVAL_MS);

    const metricTimer = setInterval(async () => {
        try {
            const metrics = await page.metrics();
            memorySamples.push({
                ts: Date.now(),
                at: safeNow(),
                nodeHeapUsed: process.memoryUsage().heapUsed,
                nodeRss: process.memoryUsage().rss,
                jsHeapUsedSize: metrics.JSHeapUsedSize,
                jsHeapTotalSize: metrics.JSHeapTotalSize,
                documents: metrics.Documents,
                nodes: metrics.Nodes
            });
        } catch {
            // ignore
        }
    }, METRIC_INTERVAL_MS);

    let finished = false;
    async function finish(reason) {
        if (finished) return;
        finished = true;
        clearInterval(flushTimer);
        clearInterval(metricTimer);
        await flush(reason);
        try {
            await browser.close();
        } catch {
            // ignore
        }
        console.log(`[capture-timeout] done (${reason})`);
        console.log(`[capture-timeout] summary: ${summaryFile}`);
        console.log(`[capture-timeout] asset paths: ${assetPathsFile}`);
    }

    browser.on("disconnected", () => {
        finish("browser_disconnected").catch(() => {});
    });

    console.log("[capture-timeout] opening session url...");
    await page.goto(startUrl, { waitUntil: "domcontentloaded" });
    console.log(`[capture-timeout] running for ${timeoutSec}s...`);

    setTimeout(() => {
        finish("timeout").catch(() => process.exit(1));
    }, timeoutSec * 1000);
}

main().catch((err) => {
    console.error("[capture-timeout] fatal", err);
    process.exit(1);
});
