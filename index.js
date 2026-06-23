const express = require('express');
const axios = require('axios');
const rateLimit = require('express-rate-limit');
const obfuscator = require('javascript-obfuscator');
const cors = require('cors');
const multer = require('multer');
const FormData = require('form-data');

const app = express();
const upload = multer();

app.use(cors());
app.use(express.json());

// ─────────────────────────────────────────────────────────
// 🔑 AUTHORIZED PREMIUM API KEYS DATABASE
// ─────────────────────────────────────────────────────────
const PREMIUM_DATABASE = {
    "HASHUU_PRO_KING_99": { owner: "Kasun", plan: "PREMIUM" },
    "MR_HASHUU_SECRET_123": { owner: "MR HASHUU", plan: "PRO" },
    "VIP_DEV_KEY_777": { owner: "Nimal", plan: "PREMIUM" }
};

// ─────────────────────────────────────────────────────────
// 📊 USAGE TRACKING SYSTEM
// ─────────────────────────────────────────────────────────
const usageStats = {};
const SERVER_START_TIME = Date.now();

function trackUsage(apikey) {
    const today = new Date().toISOString().split('T')[0];
    if (!usageStats[apikey]) usageStats[apikey] = {};
    if (!usageStats[apikey][today]) usageStats[apikey][today] = 0;
    usageStats[apikey][today]++;
}

function getTodayUsage(apikey) {
    const today = new Date().toISOString().split('T')[0];
    return (usageStats[apikey] && usageStats[apikey][today]) || 0;
}

function getTotalUsage(apikey) {
    if (!usageStats[apikey]) return 0;
    return Object.values(usageStats[apikey]).reduce((a, b) => a + b, 0);
}

const premiumLimiter = rateLimit({
    windowMs: 24 * 60 * 60 * 1000, 
    max: 5000, 
    message: { success: false, message: "Premium daily limit reached! Contact MR HASHUU." }
});

const strictAuthGate = (req, res, next) => {
    const { apikey } = req.query;
    if (!apikey) {
        return res.status(401).json({
            success: false,
            creator: "MR HASHUU",
            message: "Access Denied! API Key is missing. Append '?apikey=YOUR_KEY' to your URL."
        });
    }
    if (!PREMIUM_DATABASE[apikey]) {
        return res.status(403).json({
            success: false,
            creator: "MR HASHUU",
            message: "Access Denied! Invalid API Key. Contact MR HASHUU for a valid key."
        });
    }
    req.planOwner = PREMIUM_DATABASE[apikey].owner;
    req.planType = PREMIUM_DATABASE[apikey].plan;
    req.apikey = apikey;
    trackUsage(apikey);
    return premiumLimiter(req, res, next);
};

// ─────────────────────────────────────────────────────────
// 📊 STATS API ENDPOINT
// ─────────────────────────────────────────────────────────
app.get('/api/stats', (req, res) => {
    const { apikey } = req.query;
    const uptimeMs = Date.now() - SERVER_START_TIME;
    const hours = Math.floor(uptimeMs / 3600000);
    const minutes = Math.floor((uptimeMs % 3600000) / 60000);
    const seconds = Math.floor((uptimeMs % 60000) / 1000);

    const allTotalRequests = Object.keys(usageStats).reduce((sum, key) => sum + getTotalUsage(key), 0);

    if (apikey && PREMIUM_DATABASE[apikey]) {
        const plan = PREMIUM_DATABASE[apikey];
        const dailyLimit = plan.plan === 'PREMIUM' ? 5000 : 3000;
        const todayUsage = getTodayUsage(apikey);
        const totalUsage = getTotalUsage(apikey);

        return res.json({
            success: true,
            key_info: {
                owner: plan.owner,
                plan: plan.plan,
                daily_limit: dailyLimit,
                today_usage: todayUsage,
                today_remaining: Math.max(0, dailyLimit - todayUsage),
                usage_percent: Math.min(100, Math.round((todayUsage / dailyLimit) * 100)),
                total_all_time: totalUsage
            },
            server: {
                uptime: `${hours}h ${minutes}m ${seconds}s`,
                uptime_ms: uptimeMs,
                total_requests_all_keys: allTotalRequests,
                status: "ONLINE"
            }
        });
    }

    return res.json({
        success: true,
        server: {
            uptime: `${hours}h ${minutes}m ${seconds}s`,
            uptime_ms: uptimeMs,
            total_requests_all_keys: allTotalRequests,
            status: "ONLINE"
        }
    });
});

// ─────────────────────────────────────────────────────────
// 🌌 ULTRA LUXURY INTERACTION UI (RESPONSIVE & MOBILE READY)
// ─────────────────────────────────────────────────────────
app.get('/', (req, res) => {
    res.send(`
    <!DOCTYPE html>
    <html lang="en" data-theme="dark">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
        <title>MR HASHUU PREMIUM GATEWAY</title>
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@700;900&family=Inter:wght@400;600;800;900&display=swap" rel="stylesheet">
        
        <style>
            :root[data-theme="dark"] {
                --bg-main: #000000;
                --bg-card: rgba(18, 18, 19, 0.75);
                --border-color: rgba(255, 255, 255, 0.08);
                --text-main: #ffffff;
                --text-muted: #a1a1a6;
                --input-bg: rgba(0, 0, 0, 0.6);
                --apple-cyan: #00F5FF;
                --apple-blue: #7B2CBF;
                --apple-green: #00FF87;
                --apple-red: #ff453a;
                --blur-intensity: 8px;
            }

            :root[data-theme="light"] {
                --bg-main: #f5f5f7;
                --bg-card: rgba(255, 255, 255, 0.85);
                --border-color: rgba(0, 0, 0, 0.08);
                --text-main: #000000;
                --text-muted: #6e6e73;
                --input-bg: rgba(255, 255, 255, 0.95);
                --apple-cyan: #0071e3;
                --apple-blue: #5100a8;
                --apple-green: #1d1d1f;
                --apple-red: #d22115;
                --blur-intensity: 5px;
            }
            
            * { box-sizing: border-box; margin: 0; padding: 0; -webkit-tap-highlight-color: transparent; }
            
            body {
                background-color: var(--bg-main);
                color: var(--text-main);
                font-family: 'Inter', -apple-system, sans-serif;
                min-height: 100vh;
                display: flex;
                flex-direction: column;
                align-items: center;
                padding: 15px 10px 100px 10px;
                position: relative;
                transition: background-color 0.3s, color 0.3s;
                overflow-x: hidden;
            }

            .ambient-glow {
                position: fixed; top: -10%; left: 50%; transform: translateX(-50%); width: 100vw; height: 50vh;
                background: radial-gradient(circle, rgba(123, 44, 191, 0.12) 0%, rgba(0, 245, 255, 0.03) 50%, transparent 100%);
                z-index: 1; pointer-events: none; filter: blur(60px);
            }

            #cyber-loader {
                position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
                background: var(--bg-main); z-index: 9999;
                display: flex; flex-direction: column; justify-content: center; align-items: center;
                transition: opacity 0.4s ease-out;
            }
            .apple-loading-wrapper { display: flex; flex-direction: column; align-items: center; }
            .smooth-aura-glow {
                width: 50px; height: 50px; border: 3px solid rgba(255, 255, 255, 0.02);
                border-top-color: var(--apple-cyan); border-bottom-color: var(--apple-blue);
                border-radius: 50%; animation: appleSpin 0.7s linear infinite;
            }
            @keyframes appleSpin { to { transform: rotate(360deg); } }

            .container-box {
                width: 100%; max-width: 650px;
                background: var(--bg-card); backdrop-filter: blur(30px); -webkit-backdrop-filter: blur(30px);
                border: 1px solid var(--border-color); border-radius: 24px;
                padding: 20px; z-index: 2; position: relative;
                box-shadow: 0 30px 60px rgba(0, 0, 0, 0.25);
                opacity: 0; transform: scale(0.98);
                transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
            }
            .container-box.system-ready { opacity: 1; transform: scale(1); }

            header { display: flex; justify-content: space-between; align-items: center; padding-bottom: 15px; border-bottom: 1px solid var(--border-color); }
            header h1 { font-family: 'Space Grotesk', sans-serif; font-size: 1.6rem; font-weight: 900; letter-spacing: -0.5px; }

            .theme-toggle-btn {
                background: var(--border-color); border: none;
                color: var(--text-main); font-size: 1.1rem; cursor: pointer;
                padding: 8px 12px; border-radius: 12px; transition: 0.2s;
            }

            /* 🔔 RATE LIMIT WARNING ALERT */
            .rate-warning {
                display: none; background: rgba(255, 69, 58, 0.12); border: 1px solid var(--apple-red);
                color: #ff453a; padding: 12px; border-radius: 14px; margin-top: 15px;
                font-size: 0.8rem; font-weight: 700; align-items: center; gap: 8px;
            }

            /* 🔑 API KEY INPUT SECTION */
            .apikey-section { margin-top: 15px; padding: 15px; background: rgba(0, 245, 255, 0.04); border: 1px solid rgba(0, 245, 255, 0.12); border-radius: 16px; }
            .apikey-row { display: flex; gap: 8px; margin-top: 8px; }
            .apikey-input {
                flex-grow: 1; padding: 12px; background: var(--input-bg);
                border: 1px solid rgba(0, 245, 255, 0.2); border-radius: 10px;
                color: var(--apple-cyan); font-size: 0.85rem; font-weight: 700; font-family: monospace; outline: none; width: 50%;
            }
            .btn-setkey { background: var(--apple-cyan); color: #000; font-size: 0.75rem; font-weight: 900; padding: 0 15px; border-radius: 10px; border: none; cursor: pointer; }

            /* 📊 DASHBOARD */
            .dashboard-panel { margin-top: 15px; padding: 15px; background: rgba(0,0,0,0.15); border: 1px solid var(--border-color); border-radius: 16px; }
            .dash-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
            .dash-card { background: rgba(255, 255, 255, 0.02); border: 1px solid var(--border-color); border-radius: 12px; padding: 10px; }
            .stat-label { font-size: 0.65rem; font-weight: 800; color: var(--text-muted); text-transform: uppercase; }
            .stat-value { font-size: 1rem; font-weight: 900; margin-top: 4px; font-family: 'Space Grotesk', sans-serif; }
            .usage-bar-track { width: 100%; height: 5px; background: rgba(255,255,255,0.1); border-radius: 5px; margin-top: 6px; overflow: hidden; }
            .usage-bar-fill { height: 100%; width: 0; background: var(--apple-cyan); transition: width 0.4s; }

            /* 🔒 ENDPOINTS BLUR/LOCK SYSTEM */
            .endpoint-list { margin-top: 15px; display: flex; flex-direction: column; gap: 10px; }
            
            .api-wrapper { 
                background: rgba(255, 255, 255, 0.01); border: 1px solid var(--border-color); 
                border-radius: 16px; overflow: hidden; transition: all 0.2s; position: relative;
            }
            
            .api-wrapper.locked {
                filter: blur(var(--blur-intensity));
                pointer-events: none;
                user-select: none;
                opacity: 0.4;
            }

            #global-lock-shield {
                position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
                z-index: 100; background: rgba(0,0,0,0.9); padding: 15px 20px; border-radius: 14px;
                border: 1px solid var(--apple-cyan); color: #fff; font-size: 0.8rem; font-weight: 900;
                text-align: center; box-shadow: 0 10px 40px rgba(0,0,0,0.6); max-width: 90%; width: 320px;
            }

            .api-row { padding: 15px; display: flex; justify-content: space-between; align-items: center; cursor: pointer; }
            .meta-details { display: flex; flex-direction: column; gap: 3px; max-width: 80%; }
            .endpoint-slug { font-size: 0.95rem; font-weight: 800; font-family: monospace; overflow-wrap: break-word; word-break: break-all; }
            
            .fav-star { font-size: 1.2rem; color: #4e4e54; cursor: pointer; padding: 5px; }
            .fav-star.active { color: #FFD60A; }

            .api-docs { display: none; padding: 15px; border-top: 1px solid var(--border-color); background: rgba(0,0,0,0.15); }
            
            /* 🔍 DYNAMIC PARAMETER INPUTS */
            .param-input-group { display: flex; flex-direction: column; gap: 5px; margin-bottom: 12px; }
            .param-input-group label { font-size: 0.68rem; font-weight: 800; color: var(--text-muted); text-transform: uppercase; }
            .param-field { padding: 10px; background: var(--input-bg); border: 1px solid var(--border-color); border-radius: 8px; color: var(--text-main); font-family: monospace; font-size: 0.85rem; outline: none; }

            .url-box-container { display: flex; flex-direction: column; gap: 8px; margin-top: 5px; }
            .url-display {
                background: #000000; border: 1px solid var(--border-color); padding: 10px;
                border-radius: 8px; font-family: monospace; font-size: 0.75rem; color: var(--apple-cyan);
                overflow-x: auto; white-space: nowrap;
            }

            .action-btn-row { display: flex; gap: 6px; flex-wrap: wrap; }
            .btn-action { border: none; font-size: 0.68rem; font-weight: 900; padding: 10px 12px; border-radius: 8px; cursor: pointer; text-transform: uppercase; }
            .btn-copy { background: #ffffff; color: #000; }
            .btn-curl { background: #2c2c2e; color: #fff; }
            .btn-run { background: linear-gradient(135deg, var(--apple-blue), #531cb3); color: #ffffff; flex-grow: 1; }

            /* 🌐 RESPONSE PING SPEED DISPLAY */
            .speed-tag { font-size: 0.68rem; font-weight: 800; color: var(--text-muted); margin-top: 6px; display: none; }

            .json-preview {
                background: #000000; border: 1px solid var(--border-color); border-radius: 8px;
                padding: 12px; font-family: monospace; font-size: 0.75rem; color: #888;
                white-space: pre-wrap; overflow-x: auto; max-height: 180px; margin-top: 8px;
            }

            /* 🕐 REQUEST HISTORY LOG PANEL */
            .history-panel { margin-top: 15px; padding: 15px; background: rgba(255,255,255,0.02); border: 1px solid var(--border-color); border-radius: 16px; }
            .history-title { font-size: 0.75rem; font-weight: 800; margin-bottom: 8px; text-transform: uppercase; color: var(--text-muted); }
            .history-list { display: flex; flex-direction: column; gap: 5px; font-family: monospace; font-size: 0.7rem; }
            .history-item { display: flex; justify-content: space-between; padding: 6px; background: rgba(0,0,0,0.2); border-radius: 6px; }

            /* 📱 MOBILE BOTTOM NAV BAR */
            .mobile-nav-bar {
                position: fixed; bottom: 0; left: 0; width: 100vw; height: 60px;
                background: var(--bg-card); backdrop-filter: blur(15px); -webkit-backdrop-filter: blur(15px);
                border-top: 1px solid var(--border-color); z-index: 999;
                display: flex; justify-content: space-around; align-items: center;
            }
            .nav-item { display: flex; flex-direction: column; align-items: center; color: var(--text-muted); text-decoration: none; font-size: 0.65rem; font-weight: 700; gap: 3px; cursor: pointer; }
            .nav-item.active { color: var(--apple-cyan); }
            .nav-icon { font-size: 1.1rem; }

            #toast-alert {
                position: fixed; bottom: 75px; left: 50%; transform: translateX(-50%); background: #ffffff; color: #000000;
                font-family: 'Space Grotesk', sans-serif; font-weight: 900; font-size: 0.8rem; padding: 10px 20px; border-radius: 10px;
                z-index: 10000; opacity: 0; pointer-events: none; transition: all 0.2s ease; box-shadow: 0 5px 15px rgba(0,0,0,0.3);
            }
            #toast-alert.show { opacity: 1; }

            @media (max-width: 480px) {
                header h1 { font-size: 1.4rem; }
                .endpoint-slug { font-size: 0.85rem; }
            }
        </style>
    </head>
    <body>

        <div class="ambient-glow"></div>
        <div id="toast-alert">COPIED SUCCESSFULLY ✔</div>
        <div id="cyber-loader"><div class="apple-loading-wrapper"><div class="smooth-aura-glow"></div></div></div>

        <div id="global-lock-shield">🔑 ENTER VALID API KEY TO UNLOCK UI</div>

        <div class="container-box" id="main-interface">
            <header>
                <h1>HASHUU PORTAL</h1>
                <button class="theme-toggle-btn" onclick="toggleTheme()">🌙</button>
            </header>

            <div class="rate-warning" id="rateLimitAlert">
                ⚠️ WARNING: API key usage has exceeded 85% of your daily limit!
            </div>

            <div class="apikey-section">
                <div style="font-size:0.7rem; font-weight:800; color:var(--text-muted);">PREMIUM USER API AUTHENTICATION</div>
                <div class="apikey-row">
                    <input type="text" id="userApiKey" class="apikey-input" placeholder="e.g. HASHUU_PRO_KING_99" oninput="checkKeyPossibility()" />
                    <button class="btn-setkey" onclick="validateAndUnlock()">UNLOCK</button>
                </div>
            </div>

            <div class="dashboard-panel">
                <div class="dash-grid">
                    <div class="dash-card">
                        <div class="stat-label">System Uptime</div>
                        <div class="stat-value" id="val-uptime">--</div>
                    </div>
                    <div class="dash-card">
                        <div class="stat-label">Your Daily Usage</div>
                        <div class="stat-value" id="val-hits">0 / 0</div>
                        <div class="usage-bar-track"><div class="usage-bar-fill" id="val-bar"></div></div>
                    </div>
                </div>
            </div>

            <div class="endpoint-list" id="endpointsContainer">
                
                <div class="api-wrapper locked" id="wrap-tiktok">
                    <div class="api-row" onclick="toggleAccordion('tiktok')">
                        <div class="meta-details">
                            <span class="endpoint-slug">/api/tiktok</span>
                            <span style="font-size:0.7rem; color:var(--text-muted)">TikTok Video Downloader</span>
                        </div>
                        <span class="fav-star" onclick="toggleFavourite('tiktok', event)">★</span>
                    </div>
                    <div class="api-docs" id="docs-tiktok">
                        <div class="param-input-group"><label>Video Link URL (?url=)</label><input type="text" class="param-field" id="param-tiktok-url" value="https://vt.tiktok.com/ZS2amV76G/" oninput="rebuildUrl('tiktok')"></div>
                        <div class="url-box-container"><div class="url-display" id="url-tiktok">/api/tiktok?url=</div>
                            <div class="action-btn-row">
                                <button class="btn-action btn-copy" onclick="copyLink('url-tiktok')">Copy</button>
                                <button class="btn-action btn-curl" onclick="copyAsCurl('tiktok')">📋 cURL</button>
                                <button class="btn-action btn-run" onclick="runEndpoint('tiktok', '/api/tiktok', ['url'])">Run API</button>
                            </div>
                        </div>
                        <div class="speed-tag" id="speed-tiktok">⚡ Speed: <span class="ms">0</span>ms</div><pre class="json-preview" id="res-tiktok">{}</pre>
                    </div>
                </div>

                <div class="api-wrapper locked" id="wrap-tiktoksearch">
                    <div class="api-row" onclick="toggleAccordion('tiktoksearch')">
                        <div class="meta-details">
                            <span class="endpoint-slug">/api/tiktok_search</span>
                            <span style="font-size:0.7rem; color:var(--text-muted)">TikTok Video Search Engine</span>
                        </div>
                        <span class="fav-star" onclick="toggleFavourite('tiktoksearch', event)">★</span>
                    </div>
                    <div class="api-docs" id="docs-tiktoksearch">
                        <div class="param-input-group"><label>Search Query (?text=)</label><input type="text" class="param-field" id="param-tiktoksearch-text" value="sl meme" oninput="rebuildUrl('tiktoksearch')"></div>
                        <div class="url-box-container"><div class="url-display" id="url-tiktoksearch">/api/tiktok_search?text=</div>
                            <div class="action-btn-row">
                                <button class="btn-action btn-copy" onclick="copyLink('url-tiktoksearch')">Copy</button>
                                <button class="btn-action btn-curl" onclick="copyAsCurl('tiktoksearch')">📋 cURL</button>
                                <button class="btn-action btn-run" onclick="runEndpoint('tiktoksearch', '/api/tiktok_search', ['text'])">Run API</button>
                            </div>
                        </div>
                        <div class="speed-tag" id="speed-tiktoksearch">⚡ Speed: <span class="ms">0</span>ms</div><pre class="json-preview" id="res-tiktoksearch">{}</pre>
                    </div>
                </div>

                <div class="api-wrapper locked" id="wrap-yt">
                    <div class="api-row" onclick="toggleAccordion('yt')">
                        <div class="meta-details">
                            <span class="endpoint-slug">/api/yt_download</span>
                            <span style="font-size:0.7rem; color:var(--text-muted)">YouTube MP4/MP3 Multi Downloader</span>
                        </div>
                        <span class="fav-star" onclick="toggleFavourite('yt', event)">★</span>
                    </div>
                    <div class="api-docs" id="docs-yt">
                        <div class="param-input-group"><label>YouTube URL (?url=)</label><input type="text" class="param-field" id="param-yt-url" value="https://youtube.com/watch?v=dQw4w9WgXcQ" oninput="rebuildUrl('yt')"></div>
                        <div class="url-box-container"><div class="url-display" id="url-yt">/api/yt_download?url=</div>
                            <div class="action-btn-row">
                                <button class="btn-action btn-copy" onclick="copyLink('url-yt')">Copy</button>
                                <button class="btn-action btn-curl" onclick="copyAsCurl('yt')">📋 cURL</button>
                                <button class="btn-action btn-run" onclick="runEndpoint('yt', '/api/yt_download', ['url'])">Run API</button>
                            </div>
                        </div>
                        <div class="speed-tag" id="speed-yt">⚡ Speed: <span class="ms">0</span>ms</div><pre class="json-preview" id="res-yt">{}</pre>
                    </div>
                </div>

                <div class="api-wrapper locked" id="wrap-fbdl">
                    <div class="api-row" onclick="toggleAccordion('fbdl')">
                        <div class="meta-details">
                            <span class="endpoint-slug">/api/fbdl</span>
                            <span style="font-size:0.7rem; color:var(--text-muted)">Facebook HD Video Downloader</span>
                        </div>
                        <span class="fav-star" onclick="toggleFavourite('fbdl', event)">★</span>
                    </div>
                    <div class="api-docs" id="docs-fbdl">
                        <div class="param-input-group"><label>Facebook Post URL (?url=)</label><input type="text" class="param-field" id="param-fbdl-url" value="https://www.facebook.com/watch/?v=123" oninput="rebuildUrl('fbdl')"></div>
                        <div class="url-box-container"><div class="url-display" id="url-fbdl">/api/fbdl?url=</div>
                            <div class="action-btn-row">
                                <button class="btn-action btn-copy" onclick="copyLink('url-fbdl')">Copy</button>
                                <button class="btn-action btn-curl" onclick="copyAsCurl('fbdl')">📋 cURL</button>
                                <button class="btn-action btn-run" onclick="runEndpoint('fbdl', '/api/fbdl', ['url'])">Run API</button>
                            </div>
                        </div>
                        <div class="speed-tag" id="speed-fbdl">⚡ Speed: <span class="ms">0</span>ms</div><pre class="json-preview" id="res-fbdl">{}</pre>
                    </div>
                </div>

                <div class="api-wrapper locked" id="wrap-mediafire">
                    <div class="api-row" onclick="toggleAccordion('mediafire')">
                        <div class="meta-details">
                            <span class="endpoint-slug">/api/mediafire</span>
                            <span style="font-size:0.7rem; color:var(--text-muted)">Mediafire File Scraper</span>
                        </div>
                        <span class="fav-star" onclick="toggleFavourite('mediafire', event)">★</span>
                    </div>
                    <div class="api-docs" id="docs-mediafire">
                        <div class="param-input-group"><label>Mediafire URL (?url=)</label><input type="text" class="param-field" id="param-mediafire-url" value="https://www.mediafire.com/file/xxx" oninput="rebuildUrl('mediafire')"></div>
                        <div class="url-box-container"><div class="url-display" id="url-mediafire">/api/mediafire?url=</div>
                            <div class="action-btn-row">
                                <button class="btn-action btn-copy" onclick="copyLink('url-mediafire')">Copy</button>
                                <button class="btn-action btn-curl" onclick="copyAsCurl('mediafire')">📋 cURL</button>
                                <button class="btn-action btn-run" onclick="runEndpoint('mediafire', '/api/mediafire', ['url'])">Run API</button>
                            </div>
                        </div>
                        <div class="speed-tag" id="speed-mediafire">⚡ Speed: <span class="ms">0</span>ms</div><pre class="json-preview" id="res-mediafire">{}</pre>
                    </div>
                </div>

                <div class="api-wrapper locked" id="wrap-remini">
                    <div class="api-row" onclick="toggleAccordion('remini')">
                        <div class="meta-details">
                            <span class="endpoint-slug">/api/remini</span>
                            <span style="font-size:0.7rem; color:var(--text-muted)">AI Photo Quality Restorer</span>
                        </div>
                        <span class="fav-star" onclick="toggleFavourite('remini', event)">★</span>
                    </div>
                    <div class="api-docs" id="docs-remini">
                        <div class="param-input-group"><label>Image URL (?url=)</label><input type="text" class="param-field" id="param-remini-url" value="https://example.com/image.jpg" oninput="rebuildUrl('remini')"></div>
                        <div class="url-box-container"><div class="url-display" id="url-remini">/api/remini?url=</div>
                            <div class="action-btn-row">
                                <button class="btn-action btn-copy" onclick="copyLink('url-remini')">Copy</button>
                                <button class="btn-action btn-curl" onclick="copyAsCurl('remini')">📋 cURL</button>
                                <button class="btn-action btn-run" onclick="runEndpoint('remini', '/api/remini', ['url'])">Run API</button>
                            </div>
                        </div>
                        <div class="speed-tag" id="speed-remini">⚡ Speed: <span class="ms">0</span>ms</div><pre class="json-preview" id="res-remini">{}</pre>
                    </div>
                </div>

                <div class="api-wrapper locked" id="wrap-chat">
                    <div class="api-row" onclick="toggleAccordion('chat')">
                        <div class="meta-details">
                            <span class="endpoint-slug">/api/chat</span>
                            <span style="font-size:0.7rem; color:var(--text-muted)">ChatGPT-4o Brain Core</span>
                        </div>
                        <span class="fav-star" onclick="toggleFavourite('chat', event)">★</span>
                    </div>
                    <div class="api-docs" id="docs-chat">
                        <div class="param-input-group"><label>Prompt Parameter (?prompt=)</label><input type="text" class="param-field" id="param-chat-prompt" value="Hi" oninput="rebuildUrl('chat')"></div>
                        <div class="url-box-container"><div class="url-display" id="url-chat">/api/chat?prompt=</div>
                            <div class="action-btn-row">
                                <button class="btn-action btn-copy" onclick="copyLink('url-chat')">Copy</button>
                                <button class="btn-action btn-curl" onclick="copyAsCurl('chat')">📋 cURL</button>
                                <button class="btn-action btn-run" onclick="runEndpoint('chat', '/api/chat', ['prompt'])">Run API</button>
                            </div>
                        </div>
                        <div class="speed-tag" id="speed-chat">⚡ Speed: <span class="ms">0</span>ms</div><pre class="json-preview" id="res-chat">{}</pre>
                    </div>
                </div>

                <div class="api-wrapper locked" id="wrap-movie">
                    <div class="api-row" onclick="toggleAccordion('movie')">
                        <div class="meta-details">
                            <span class="endpoint-slug">/api/movie</span>
                            <span style="font-size:0.7rem; color:var(--text-muted)">OMDb Movie database lookup</span>
                        </div>
                        <span class="fav-star" onclick="toggleFavourite('movie', event)">★</span>
                    </div>
                    <div class="api-docs" id="docs-movie">
                        <div class="param-input-group"><label>Movie Name (?text=)</label><input type="text" class="param-field" id="param-movie-text" value="Avengers" oninput="rebuildUrl('movie')"></div>
                        <div class="url-box-container"><div class="url-display" id="url-movie">/api/movie?text=</div>
                            <div class="action-btn-row">
                                <button class="btn-action btn-copy" onclick="copyLink('url-movie')">Copy</button>
                                <button class="btn-action btn-curl" onclick="copyAsCurl('movie')">📋 cURL</button>
                                <button class="btn-action btn-run" onclick="runEndpoint('movie', '/api/movie', ['text'])">Run API</button>
                            </div>
                        </div>
                        <div class="speed-tag" id="speed-movie">⚡ Speed: <span class="ms">0</span>ms</div><pre class="json-preview" id="res-movie">{}</pre>
                    </div>
                </div>

                <div class="api-wrapper locked" id="wrap-shorten">
                    <div class="api-row" onclick="toggleAccordion('shorten')">
                        <div class="meta-details">
                            <span class="endpoint-slug">/api/url_shorten</span>
                            <span style="font-size:0.7rem; color:var(--text-muted)">Cuttly Link Redirection Generator</span>
                        </div>
                        <span class="fav-star" onclick="toggleFavourite('shorten', event)">★</span>
                    </div>
                    <div class="api-docs" id="docs-shorten">
                        <div class="param-input-group"><label>Target URL Link (?link=)</label><input type="text" class="param-field" id="param-shorten-link" value="https://google.com" oninput="rebuildUrl('shorten')"></div>
                        <div class="url-box-container"><div class="url-display" id="url-shorten">/api/url_shorten?link=</div>
                            <div class="action-btn-row">
                                <button class="btn-action btn-copy" onclick="copyLink('url-shorten')">Copy</button>
                                <button class="btn-action btn-curl" onclick="copyAsCurl('shorten')">📋 cURL</button>
                                <button class="btn-action btn-run" onclick="runEndpoint('shorten', '/api/url_shorten', ['link'])">Run API</button>
                            </div>
                        </div>
                        <div class="speed-tag" id="speed-shorten">⚡ Speed: <span class="ms">0</span>ms</div><pre class="json-preview" id="res-shorten">{}</pre>
                    </div>
                </div>

                <div class="api-wrapper locked" id="wrap-anime">
                    <div class="api-row" onclick="toggleAccordion('anime')">
                        <div class="meta-details">
                            <span class="endpoint-slug">/api/anime</span>
                            <span style="font-size:0.7rem; color:var(--text-muted)">Waifu Random Anime Database</span>
                        </div>
                        <span class="fav-star" onclick="toggleFavourite('anime', event)">★</span>
                    </div>
                    <div class="api-docs" id="docs-anime">
                        <div class="param-input-group"><label>Category Tag (?category=)</label><input type="text" class="param-field" id="param-anime-category" value="waifu" oninput="rebuildUrl('anime')"></div>
                        <div class="url-box-container"><div class="url-display" id="url-anime">/api/anime?category=</div>
                            <div class="action-btn-row">
                                <button class="btn-action btn-copy" onclick="copyLink('url-anime')">Copy</button>
                                <button class="btn-action btn-curl" onclick="copyAsCurl('anime')">📋 cURL</button>
                                <button class="btn-action btn-run" onclick="runEndpoint('anime', '/api/anime', ['category'])">Run API</button>
                            </div>
                        </div>
                        <div class="speed-tag" id="speed-anime">⚡ Speed: <span class="ms">0</span>ms</div><pre class="json-preview" id="res-anime">{}</pre>
                    </div>
                </div>

                <div class="api-wrapper locked" id="wrap-stalk">
                    <div class="api-row" onclick="toggleAccordion('stalk')">
                        <div class="meta-details">
                            <span class="endpoint-slug">/api/repo_stalk</span>
                            <span style="font-size:0.7rem; color:var(--text-muted)">Github Code Repository Metrics</span>
                        </div>
                        <span class="fav-star" onclick="toggleFavourite('stalk', event)">★</span>
                    </div>
                    <div class="api-docs" id="docs-stalk">
                        <div class="param-input-group"><label>Username / Repo (?url=)</label><input type="text" class="param-field" id="param-stalk-url" value="https://github.com/expressjs/express" oninput="rebuildUrl('stalk')"></div>
                        <div class="url-box-container"><div class="url-display" id="url-stalk">/api/repo_stalk?url=</div>
                            <div class="action-btn-row">
                                <button class="btn-action btn-copy" onclick="copyLink('url-stalk')">Copy</button>
                                <button class="btn-action btn-curl" onclick="copyAsCurl('stalk')">📋 cURL</button>
                                <button class="btn-action btn-run" onclick="runEndpoint('stalk', '/api/repo_stalk', ['url'])">Run API</button>
                            </div>
                        </div>
                        <div class="speed-tag" id="speed-stalk">⚡ Speed: <span class="ms">0</span>ms</div><pre class="json-preview" id="res-stalk">{}</pre>
                    </div>
                </div>

                <div class="api-wrapper locked" id="wrap-wallpaper">
                    <div class="api-row" onclick="toggleAccordion('wallpaper')">
                        <div class="meta-details">
                            <span class="endpoint-slug">/api/wallpaper</span>
                            <span style="font-size:0.7rem; color:var(--text-muted)">Ultra HD Wallpapers Scraper</span>
                        </div>
                        <span class="fav-star" onclick="toggleFavourite('wallpaper', event)">★</span>
                    </div>
                    <div class="api-docs" id="docs-wallpaper">
                        <div class="param-input-group"><label>Wallpaper Query (?text=)</label><input type="text" class="param-field" id="param-wallpaper-text" value="Cyberpunk" oninput="rebuildUrl('wallpaper')"></div>
                        <div class="url-box-container"><div class="url-display" id="url-wallpaper">/api/wallpaper?text=</div>
                            <div class="action-btn-row">
                                <button class="btn-action btn-copy" onclick="copyLink('url-wallpaper')">Copy</button>
                                <button class="btn-action btn-curl" onclick="copyAsCurl('wallpaper')">📋 cURL</button>
                                <button class="btn-action btn-run" onclick="runEndpoint('wallpaper', '/api/wallpaper', ['text'])">Run API</button>
                            </div>
                        </div>
                        <div class="speed-tag" id="speed-wallpaper">⚡ Speed: <span class="ms">0</span>ms</div><pre class="json-preview" id="res-wallpaper">{}</pre>
                    </div>
                </div>

                <div class="api-wrapper locked" id="wrap-obfuscate">
                    <div class="api-row" onclick="toggleAccordion('obfuscate')">
                        <div class="meta-details">
                            <span class="endpoint-slug">/api/obfuscate</span>
                            <span style="font-size:0.7rem; color:var(--text-muted)">Advanced Security Encryption Code Guard</span>
                        </div>
                        <span class="fav-star" onclick="toggleFavourite('obfuscate', event)">★</span>
                    </div>
                    <div class="api-docs" id="docs-obfuscate">
                        <div class="param-input-group"><label>Source Code Payload (?code=)</label><input type="text" class="param-field" id="param-obfuscate-code" value="console.log('hello world');" oninput="rebuildUrl('obfuscate')"></div>
                        <div class="url-box-container"><div class="url-display" id="url-obfuscate">/api/obfuscate?code=</div>
                            <div class="action-btn-row">
                                <button class="btn-action btn-copy" onclick="copyLink('url-obfuscate')">Copy</button>
                                <button class="btn-action btn-curl" onclick="copyAsCurl('obfuscate')">📋 cURL</button>
                                <button class="btn-action btn-run" onclick="runEndpoint('obfuscate', '/api/obfuscate', ['code'])">Run API</button>
                            </div>
                        </div>
                        <div class="speed-tag" id="speed-obfuscate">⚡ Speed: <span class="ms">0</span>ms</div><pre class="json-preview" id="res-obfuscate">{}</pre>
                    </div>
                </div>

                <div class="api-wrapper locked" id="wrap-imgbb">
                    <div class="api-row" onclick="toggleAccordion('imgbb')">
                        <div class="meta-details">
                            <span class="endpoint-slug">POST /imgbb</span>
                            <span style="font-size:0.7rem; color:var(--text-muted)">Cloud Engine Direct Uploader (Simulated Link)</span>
                        </div>
                        <span class="fav-star" onclick="toggleFavourite('imgbb', event)">★</span>
                    </div>
                    <div class="api-docs" id="docs-imgbb">
                        <div style="font-size:0.75rem; color:var(--text-muted); margin-bottom:10px;">Note: Production form data submission requires multipart/form-data. Below executes a dummy key execution check.</div>
                        <div class="url-box-container"><div class="url-display" id="url-imgbb">/imgbb</div>
                            <div class="action-btn-row">
                                <button class="btn-action btn-copy" onclick="navigator.clipboard.writeText(window.location.origin+'/imgbb?apikey='+activeApiKey); triggerToast();">Copy URL</button>
                                <button class="btn-action btn-run" onclick="runEndpoint('imgbb', '/api/stats', [])">Verify Backend Status</button>
                            </div>
                        </div>
                        <pre class="json-preview" id="res-imgbb">{}</pre>
                    </div>
                </div>

                <div class="api-wrapper locked" id="wrap-weather">
                    <div class="api-row" onclick="toggleAccordion('weather')">
                        <div class="meta-details">
                            <span class="endpoint-slug">/api/weather</span>
                            <span style="font-size:0.7rem; color:var(--text-muted)">Global Climate Report Engine</span>
                        </div>
                        <span class="fav-star" onclick="toggleFavourite('weather', event)">★</span>
                    </div>
                    <div class="api-docs" id="docs-weather">
                        <div class="param-input-group"><label>City Name (?text=)</label><input type="text" class="param-field" id="param-weather-text" value="Colombo" oninput="rebuildUrl('weather')"></div>
                        <div class="url-box-container"><div class="url-display" id="url-weather">/api/weather?text=</div>
                            <div class="action-btn-row">
                                <button class="btn-action btn-copy" onclick="copyLink('url-weather')">Copy</button>
                                <button class="btn-action btn-curl" onclick="copyAsCurl('weather')">📋 cURL</button>
                                <button class="btn-action btn-run" onclick="runEndpoint('weather', '/api/weather', ['text'])">Run API</button>
                            </div>
                        </div>
                        <div class="speed-tag" id="speed-weather">⚡ Speed: <span class="ms">0</span>ms</div><pre class="json-preview" id="res-weather">{}</pre>
                    </div>
                </div>

            </div>

            <div class="history-panel">
                <div class="history-title">🕐 Request History Log (Last 10 calls)</div>
                <div class="history-list" id="historyLogList">
                    <div style="color:var(--text-muted)">No active log signals yet.</div>
                </div>
            </div>
        </div>

        <div class="mobile-nav-bar">
            <div class="nav-item active" onclick="filterNav('all')"><span class="nav-icon">⚡</span><span>All APIs</span></div>
            <div class="nav-item" onclick="filterNav('fav')"><span class="nav-icon">⭐</span><span>Bookmarks</span></div>
            <div class="nav-item" onclick="scrollToTop()"><span class="nav-icon">🔑</span><span>Unlock Key</span></div>
        </div>

        <script>
            let activeApiKey = "";
            let historyLog = [];
            let favouriteEndpoints = JSON.parse(localStorage.getItem('fav_endpoints') || '[]');

            window.addEventListener('DOMContentLoaded', () => {
                setTimeout(() => { document.getElementById('cyber-loader').style.opacity = '0'; setTimeout(() => document.getElementById('cyber-loader').remove(), 300); }, 600);
                document.getElementById('main-interface').classList.add('system-ready');
                renderFavouritesState();
                fetchGlobalStats();
            });

            function toggleTheme() {
                const html = document.documentElement;
                const btn = document.querySelector('.theme-toggle-btn');
                if(html.getAttribute('data-theme') === 'dark') {
                    html.setAttribute('data-theme', 'light'); btn.innerText = "☀️";
                } else {
                    html.setAttribute('data-theme', 'dark'); btn.innerText = "🌙";
                }
            }

            function scrollToTop() { window.scrollTo({top: 0, behavior: 'smooth'}); }

            function checkKeyPossibility() {
                const input = document.getElementById('userApiKey').value.trim();
                if(!input) lockSystem();
            }

            function validateAndUnlock() {
                const input = document.getElementById('userApiKey').value.trim();
                if(!input) return;

                activeApiKey = input;
                document.getElementById('global-lock-shield').style.display = 'none';
                
                document.querySelectorAll('.api-wrapper').forEach(w => {
                    w.classList.remove('locked');
                    const id = w.id.replace('wrap-', '');
                    rebuildUrl(id);
                });

                triggerToast("INTERFACE ACCESS GRANTED");
                fetchGlobalStats();
            }

            function lockSystem() {
                activeApiKey = "";
                document.getElementById('global-lock-shield').style.display = 'block';
                document.querySelectorAll('.api-wrapper').forEach(w => w.classList.add('locked'));
            }

            function rebuildUrl(id) {
                const container = document.getElementById('wrap-' + id);
                if(!container || container.classList.contains('locked')) return;

                const fields = container.querySelectorAll('.param-field');
                let params = [];
                fields.forEach(f => {
                    const paramKey = f.id.replace('param-' + id + '-', '');
                    params.push(paramKey + '=' + encodeURIComponent(f.value));
                });
                if(activeApiKey) params.push('apikey=' + encodeURIComponent(activeApiKey));
                
                const slug = container.querySelector('.endpoint-slug').innerText.replace('POST ', '');
                document.getElementById('url-' + id).innerText = slug + '?' + params.join('&');
            }

            function toggleAccordion(id) {
                const docs = document.getElementById('docs-' + id);
                if(docs.style.display === 'block') {
                    docs.style.display = 'none';
                } else {
                    document.querySelectorAll('.api-docs').forEach(d => d.style.display = 'none');
                    docs.style.display = 'block';
                }
            }

            function toggleFavourite(id, e) {
                e.stopPropagation();
                if(favouriteEndpoints.includes(id)) {
                    favouriteEndpoints = favouriteEndpoints.filter(x => x !== id);
                } else {
                    favouriteEndpoints.push(id);
                }
                localStorage.setItem('fav_endpoints', JSON.stringify(favouriteEndpoints));
                renderFavouritesState();
            }

            function renderFavouritesState() {
                document.querySelectorAll('.api-wrapper').forEach(w => {
                    const id = w.id.replace('wrap-', '');
                    const star = w.querySelector('.fav-star');
                    if(favouriteEndpoints.includes(id)) star.classList.add('active');
                    else star.classList.remove('active');
                });
            }

            function filterNav(mode) {
                document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
                event.currentTarget.classList.add('active');

                document.querySelectorAll('.api-wrapper').forEach(w => {
                    const id = w.id.replace('wrap-', '');
                    if(mode === 'fav') {
                        w.style.display = favouriteEndpoints.includes(id) ? 'block' : 'none';
                    } else {
                        w.style.display = 'block';
                    }
                });
            }

            function copyAsCurl(id) {
                const currentUrlDisplay = document.getElementById('url-' + id).innerText;
                const curlCommand = \`curl -X GET "\${window.location.origin}\${currentUrlDisplay}"\`;
                navigator.clipboard.writeText(curlCommand).then(() => triggerToast("cURL COMMAND COPIED"));
            }

            function copyLink(elementId) {
                const text = document.getElementById(elementId).innerText;
                navigator.clipboard.writeText(window.location.origin + text).then(() => triggerToast());
            }

            function triggerToast(msg = "COPIED TO CLIPBOARD ✔") {
                const toast = document.getElementById('toast-alert');
                toast.innerText = msg; toast.classList.add('show');
                setTimeout(() => toast.classList.remove('show'), 1500);
            }

            async function runEndpoint(id, route, paramKeys) {
                const consoleBox = document.getElementById('res-' + id);
                const speedTag = document.getElementById('speed-' + id);
                
                let queryParts = [];
                paramKeys.forEach(k => {
                    const val = document.getElementById('param-' + id + '-' + k).value;
                    queryParts.push(k + '=' + encodeURIComponent(val));
                });
                queryParts.push('apikey=' + encodeURIComponent(activeApiKey));

                const finalUrl = route + '?' + queryParts.join('&');
                consoleBox.textContent = "// EVALUATING NETWORK SIGNAL TRANSFER... //";
                
                const startTime = performance.now();
                try {
                    const res = await fetch(finalUrl);
                    const payload = await res.json();
                    const duration = Math.round(performance.now() - startTime);
                    
                    speedTag.style.display = "block";
                    speedTag.querySelector('.ms').innerText = duration;

                    consoleBox.textContent = JSON.stringify(payload, null, 2);
                    consoleBox.style.color = "#00FF87";

                    pushHistoryLog(route, res.status);
                    fetchGlobalStats();
                } catch (err) {
                    consoleBox.textContent = JSON.stringify({ error: "Network stream broken", msg: err.message }, null, 2);
                    consoleBox.style.color = "#ff453a";
                }
            }

            function pushHistoryLog(endpoint, status) {
                const timeStr = new Date().toLocaleTimeString();
                historyLog.unshift({ endpoint, status, time: timeStr });
                if(historyLog.length > 10) historyLog.pop();

                const container = document.getElementById('historyLogList');
                container.innerHTML = historyLog.map(item => \`
                    <div class="history-item">
                        <span>\${item.endpoint}</span>
                        <span style="color:\${item.status === 200 ? 'var(--apple-green)':'var(--apple-red)'}">\${item.status} [\${item.time}]</span>
                    </div>
                \`).join('');
            }

            async function fetchGlobalStats() {
                try {
                    const keyParam = activeApiKey ? '?apikey=' + encodeURIComponent(activeApiKey) : '';
                    const res = await fetch('/api/stats' + keyParam);
                    const data = await res.json();
                    
                    if(data.success) {
                        document.getElementById('val-uptime').innerText = data.server.uptime;
                        if(data.key_info) {
                            const currentUsage = data.key_info.today_usage;
                            const limit = data.key_info.daily_limit;
                            const pct = data.key_info.usage_percent;

                            document.getElementById('val-hits').innerText = currentUsage + " / " + limit;
                            document.getElementById('val-bar').style.width = pct + "%";

                            if(pct >= 85) document.getElementById('rateLimitAlert').style.display = 'flex';
                            else document.getElementById('rateLimitAlert').style.display = 'none';
                        }
                    }
                } catch(e){}
            }
        </script>
    </body>
    </html>
    `);
});

// ─────────────────────────────────────────────────────────
// 🛠️ BACKEND API ROUTERS LOGIC (ALL 15 ORIGINAL ROUTERS)
// ─────────────────────────────────────────────────────────

// 1. TIKTOK DOWNLOADER
app.get('/api/tiktok', strictAuthGate, async (req, res) => {
    try {
        const { url } = req.query;
        if (!url) return res.json({ success: false, message: "Url parameter missing!" });
        const { data } = await axios.get(`https://apis.davidcyriltech.my.id/tiktok?url=${encodeURIComponent(url)}`);
        res.json({ creator: "MR HASHUU", status: "Authenticated", success: true, result: data.video_hd || data });
    } catch (e) { res.json({ success: false, message: e.message }); }
});

// 2. TIKTOK SEARCH
app.get('/api/tiktok_search', strictAuthGate, async (req, res) => {
    try {
        const { text } = req.query;
        if (!text) return res.json({ success: false, message: "Text parameter missing!" });
        const { data } = await axios.get(`https://apis.davidcyriltech.my.id/tiktoksearch?query=${encodeURIComponent(text)}`);
        res.json({ creator: "MR HASHUU", status: "Authenticated", success: true, result: data.results || data });
    } catch (e) { res.json({ success: false, message: e.message }); }
});

// 3. YOUTUBE DOWNLOADER
app.get('/api/yt_download', strictAuthGate, async (req, res) => {
    try {
        const { url } = req.query;
        if (!url) return res.json({ success: false, message: "Url parameter missing!" });
        const { data } = await axios.get(`https://apis.davidcyriltech.my.id/youtube/download?url=${encodeURIComponent(url)}`);
        res.json({ creator: "MR HASHUU", status: "Authenticated", success: true, result: data.result || data });
    } catch (e) { res.json({ success: false, message: e.message }); }
});

// 4. FACEBOOK DOWNLOADER
app.get('/api/fbdl', strictAuthGate, async (req, res) => {
    try {
        const { url } = req.query;
        if (!url) return res.json({ success: false, message: "Url parameter missing!" });
        const { data } = await axios.get(`https://apis.davidcyriltech.my.id/facebook?url=${encodeURIComponent(url)}`);
        res.json({ creator: "MR HASHUU", status: "Authenticated", success: true, result: data.video_hd || data });
    } catch (e) { res.json({ success: false, message: e.message }); }
});

// 5. MEDIAFIRE DOWNLOADER
app.get('/api/mediafire', strictAuthGate, async (req, res) => {
    try {
        const { url } = req.query;
        if (!url) return res.json({ success: false, message: "Url parameter missing!" });
        const { data } = await axios.get(`https://apis.davidcyriltech.my.id/mediafire?url=${encodeURIComponent(url)}`);
        res.json({ creator: "MR HASHUU", status: "Authenticated", success: true, result: data });
    } catch (e) { res.json({ success: false, message: e.message }); }
});

// 6. REMINI ENHANCER
app.get('/api/remini', strictAuthGate, async (req, res) => {
    try {
        const { url } = req.query;
        if (!url) return res.json({ success: false, message: "Url parameter missing!" });
        const { data } = await axios.get(`https://apis.davidcyriltech.my.id/remini?url=${encodeURIComponent(url)}`);
        res.json({ creator: "MR HASHUU", status: "Authenticated", success: true, result: data.image_url || data });
    } catch (e) { res.json({ success: false, message: e.message }); }
});

// 7. CHAT GPT-4o
app.get('/api/chat', strictAuthGate, async (req, res) => {
    try {
        const { prompt } = req.query;
        if (!prompt) return res.json({ success: false, message: "Prompt parameter missing!" });
        const cleanPrompt = prompt.toLowerCase().trim();
        if (cleanPrompt === 'hi') return res.json({ creator: "MR HASHUU", status: "Authenticated", success: true, result: "Hellow Im Hashuu Ai Service" });
        
        const systemPrompt = "You are Hashan-md AI, developed by MR HASHUU.";
        const { data } = await axios.get(`https://apis.davidcyriltech.my.id/ai/chatgpt?prompt=${encodeURIComponent(prompt)}&model=gpt-4o&system=${encodeURIComponent(systemPrompt)}`);
        res.json({ creator: "MR HASHUU", status: "Authenticated", success: true, result: data?.data?.choices?.[0]?.message?.content || data });
    } catch (e) { res.json({ success: false, message: e.message }); }
});

// 8. MOVIE SEARCH
app.get('/api/movie', strictAuthGate, async (req, res) => {
    try {
        const { text } = req.query;
        if (!text) return res.json({ success: false, message: "Text parameter missing!" });
        const { data } = await axios.get(`http://www.omdbapi.com/?t=${encodeURIComponent(text)}&apikey=2634bb02`);
        res.json({ creator: "MR HASHUU", status: "Authenticated", success: true, result: data });
    } catch (e) { res.json({ success: false, message: e.message }); }
});

// 9. URL SHORTENER
app.get('/api/url_shorten', strictAuthGate, async (req, res) => {
    try {
        const { link } = req.query;
        if (!link) return res.json({ success: false, message: "Link parameter missing!" });
        const { data } = await axios.get(`https://apis.davidcyriltech.my.id/cuttly?link=${encodeURIComponent(link)}`);
        res.json({ creator: "MR HASHUU", status: "Authenticated", success: true, result: data });
    } catch (e) { res.json({ success: false, message: e.message }); }
});

// 10. ANIME
app.get('/api/anime', strictAuthGate, async (req, res) => {
    try {
        const { category } = req.query;
        const target = category ? category : 'waifu';
        const { data } = await axios.get(`https://api.waifu.pics/sfw/${target}`);
        res.json({ creator: "MR HASHUU", status: "Authenticated", success: true, result: data.url });
    } catch (e) { res.json({ success: false, message: e.message }); }
});

// 11. REPO STALKER
app.get('/api/repo_stalk', strictAuthGate, async (req, res) => {
    try {
        const { url } = req.query;
        if (!url) return res.json({ success: false, message: "Url parameter missing!" });
        res.json({ creator: "MR HASHUU", status: "Authenticated", success: true, result: { repo: url, status: "Stalked" } });
    } catch (e) { res.json({ success: false, message: e.message }); }
});

// 12. WALLPAPER
app.get('/api/wallpaper', strictAuthGate, async (req, res) => {
    try {
        const { text } = req.query;
        if (!text) return res.json({ success: false, message: "Text parameter missing!" });
        const { data } = await axios.get(`https://apis.davidcyriltech.my.id/wallpaper?query=${encodeURIComponent(text)}`);
        res.json({ creator: "MR HASHUU", status: "Authenticated", success: true, result: data.result || data });
    } catch (e) { res.json({ success: false, message: e.message }); }
});

// 13. JAVASCRIPT OBFUSCATOR
app.get('/api/obfuscate', strictAuthGate, (req, res) => {
    try {
        const { code } = req.query;
        if (!code) return res.json({ success: false, message: "Code parameter missing!" });
        const obfuscatedCode = obfuscator.obfuscate(code, { compact: true, controlFlowFlattening: true }).getObfuscatedCode();
        res.json({ creator: "MR HASHUU", status: "Authenticated", success: true, result: obfuscatedCode });
    } catch (e) { res.json({ success: false, message: e.message }); }
});

// 14. IMGBB IMAGE CLOUD POST
app.post('/imgbb', strictAuthGate, upload.single('file'), async (req, res) => {
    try {
        if (!req.file) return res.json({ success: false, message: "No file uploaded!" });
        const form = new FormData();
        form.append('file', req.file.buffer, { filename: req.file.originalname || 'image.jpg', contentType: req.file.mimetype });
        const { data } = await axios.post('https://apis.davidcyriltech.my.id/uploader/imgbb', form, { headers: { ...form.getHeaders() } });
        res.json({ creator: "MR HASHUU", status: "Authenticated", success: true, result: data.data || data });
    } catch (e) { res.json({ success: false, message: e.message }); }
});

// 15. WEATHER SYSTEM
app.get('/api/weather', strictAuthGate, async (req, res) => {
    try {
        const { text } = req.query;
        if (!text) return res.json({ success: false, message: "Text parameter missing!" });
        res.json({ creator: "MR HASHUU", status: "Authenticated", success: true, result: { city: text, condition: "Sunny", temp: "31°C" } });
    } catch (e) { res.json({ success: false, message: e.message }); }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Engine running on port ${PORT}`));

module.exports = app;
