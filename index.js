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
// 🌌 ULTRA LUXURY INTERACTION UI (DARK / LIGHT + ADVANCED FEAT)
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
                --border-color: rgba(255, 255, 255, 0.07);
                --text-main: #ffffff;
                --text-muted: #a1a1a6;
                --input-bg: rgba(0, 0, 0, 0.5);
                --apple-cyan: #00F5FF;
                --apple-blue: #7B2CBF;
                --apple-green: #00FF87;
                --apple-red: #ff453a;
                --blur-intensity: 6px;
            }

            :root[data-theme="light"] {
                --bg-main: #f5f5f7;
                --bg-card: rgba(255, 255, 255, 0.8);
                --border-color: rgba(0, 0, 0, 0.1);
                --text-main: #000000;
                --text-muted: #6e6e73;
                --input-bg: rgba(255, 255, 255, 0.9);
                --apple-cyan: #0071e3;
                --apple-blue: #5100a8;
                --apple-green: #1d1d1f;
                --apple-red: #d22115;
                --blur-intensity: 4px;
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
                padding: 40px 0 100px 0; /* Extra bottom padding for mobile nav */
                position: relative;
                transition: background-color 0.3s, color 0.3s;
            }

            .ambient-glow {
                position: fixed; top: -20%; left: 50%; transform: translateX(-50%); width: 90vw; height: 60vh;
                background: radial-gradient(circle, rgba(123, 44, 191, 0.15) 0%, rgba(0, 245, 255, 0.04) 45%, transparent 100%);
                z-index: 1; pointer-events: none; filter: blur(70px);
            }

            #cyber-loader {
                position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
                background: var(--bg-main); z-index: 9999;
                display: flex; flex-direction: column; justify-content: center; align-items: center;
                transition: opacity 0.4s ease-out;
            }
            .apple-loading-wrapper { display: flex; flex-direction: column; align-items: center; gap: 20px; }
            .smooth-aura-glow {
                width: 65px; height: 65px; border: 4px solid rgba(255, 255, 255, 0.02);
                border-top-color: var(--apple-cyan); border-bottom-color: var(--apple-blue);
                border-radius: 50%; animation: appleSpin 0.7s cubic-bezier(0.4, 0, 0.2, 1) infinite;
            }
            @keyframes appleSpin { to { transform: rotate(360deg); } }

            .vercel-box {
                width: 92%; max-width: 650px;
                background: var(--bg-card); backdrop-filter: blur(50px); -webkit-backdrop-filter: blur(50px);
                border: 1px solid var(--border-color); border-radius: 28px;
                padding: 35px; z-index: 2; position: relative;
                box-shadow: 0 40px 80px rgba(0, 0, 0, 0.3);
                opacity: 0; transform: scale(0.96);
                transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
            }
            .vercel-box.system-ready { opacity: 1; transform: scale(1); }

            header { display: flex; justify-content: space-between; align-items: center; padding-bottom: 22px; border-bottom: 1px solid var(--border-color); flex-wrap: wrap; gap: 15px; }
            header h1 { font-family: 'Space Grotesk', sans-serif; font-size: 2rem; font-weight: 900; letter-spacing: -0.5px; }

            /* 🌙 LIGHT / DARK MODE TOGGLE */
            .theme-toggle-btn {
                background: var(--border-color); border: 1px solid var(--border-color);
                color: var(--text-main); font-size: 1.2rem; cursor: pointer;
                padding: 8px 14px; border-radius: 12px; transition: all 0.2s;
            }
            .theme-toggle-btn:hover { transform: scale(1.05); }

            .status-container {
                display: inline-flex; align-items: center; gap: 7px;
                font-size: 0.75rem; font-weight: 900; letter-spacing: 0.5px;
                color: var(--apple-cyan); background: rgba(0, 245, 255, 0.08);
                padding: 7px 15px; border-radius: 30px; border: 1px solid rgba(0, 245, 255, 0.2);
            }
            .pulse-dot { width: 8px; height: 8px; background: var(--apple-cyan); border-radius: 50%; animation: pulse 1.5s infinite; }
            @keyframes pulse { 0%, 100% { opacity: 0.6; } 50% { opacity: 1; } }

            /* 🔔 RATE LIMIT WARNING ALERT BANNER */
            .rate-warning {
                display: none; background: rgba(255, 69, 58, 0.15); border: 1px solid var(--apple-red);
                color: #ff453a; padding: 12px 16px; border-radius: 14px; margin-top: 15px;
                font-size: 0.8rem; font-weight: 700; align-items: center; gap: 10px;
            }

            .analytics-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; margin-top: 24px; }
            .stat-card { background: rgba(255, 255, 255, 0.02); border: 1px solid var(--border-color); border-radius: 18px; padding: 16px 12px; text-align: center; }
            .stat-label { font-size: 0.68rem; font-weight: 900; color: var(--text-muted); text-transform: uppercase; }
            .stat-value { font-size: 1.15rem; font-weight: 900; margin-top: 5px; font-family: 'Space Grotesk', sans-serif; }

            /* 🔑 API KEY INPUT SECTION */
            .apikey-section { margin-top: 24px; padding: 20px; background: rgba(0, 245, 255, 0.04); border: 1px solid rgba(0, 245, 255, 0.15); border-radius: 18px; }
            .apikey-row { display: flex; gap: 10px; margin-top: 8px; }
            .apikey-input {
                flex-grow: 1; padding: 14px 18px; background: var(--input-bg);
                border: 1px solid rgba(0, 245, 255, 0.25); border-radius: 12px;
                color: var(--apple-cyan); font-size: 0.9rem; font-weight: 800; font-family: monospace; outline: none;
            }
            .btn-setkey { background: var(--apple-cyan); color: #000; font-size: 0.75rem; font-weight: 900; padding: 0 20px; border-radius: 12px; border: none; cursor: pointer; }

            /* 🔒 ENDPOINTS LOCKED & BLUR SYSTEM */
            .endpoint-list { margin-top: 24px; display: flex; flex-direction: column; gap: 14px; position: relative; }
            
            .api-wrapper { 
                background: rgba(255, 255, 255, 0.01); border: 1px solid var(--border-color); 
                border-radius: 18px; overflow: hidden; transition: all 0.25s; position: relative;
            }
            
            /* Blur overlay structure when key is missing */
            .api-wrapper.locked {
                filter: blur(var(--blur-intensity));
                pointer-events: none;
                user-select: none;
                opacity: 0.5;
            }

            .lock-shield-msg {
                position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);
                z-index: 10; background: rgba(0,0,0,0.85); padding: 12px 24px; border-radius: 14px;
                border: 1px solid var(--apple-cyan); color: #fff; font-size: 0.85rem; font-weight: 900;
                pointer-events: auto; display: block; text-align: center; box-shadow: 0 10px 30px rgba(0,0,0,0.5);
            }

            .api-row { padding: 20px; display: flex; justify-content: space-between; align-items: center; cursor: pointer; }
            .meta-details { display: flex; flex-direction: column; gap: 5px; max-width: 75%; }
            .endpoint-slug { font-size: 1.1rem; font-weight: 900; font-family: monospace; }
            
            /* ⭐ FAVOURITE / BOOKMARK COMPONENT */
            .fav-star { font-size: 1.3rem; color: #4e4e54; cursor: pointer; transition: transform 0.2s; z-index: 5; }
            .fav-star.active { color: #FFD60A; transform: scale(1.1); }

            .api-docs { display: none; padding: 20px; border-top: 1px solid var(--border-color); background: rgba(0,0,0,0.1); }
            
            /* 🔍 ENDPOINT PARAMETER INPUT UI FIELDS */
            .param-input-group { display: flex; flex-direction: column; gap: 8px; margin-bottom: 15px; }
            .param-input-group label { font-size: 0.72rem; font-weight: 900; color: var(--text-muted); text-transform: uppercase; }
            .param-field { padding: 10px 14px; background: var(--input-bg); border: 1px solid var(--border-color); border-radius: 8px; color: var(--text-main); font-family: monospace; }

            .url-box-container { display: flex; flex-direction: column; gap: 10px; margin-top: 6px; }
            .url-display {
                background: #000000; border: 1px solid var(--border-color); padding: 15px;
                border-radius: 12px; font-family: monospace; font-size: 0.8rem; color: var(--apple-cyan);
                overflow-x: auto; white-space: nowrap;
            }

            .action-btn-row { display: flex; gap: 8px; flex-wrap: wrap; }
            .btn-action { border: none; font-size: 0.72rem; font-weight: 900; padding: 10px 16px; border-radius: 10px; cursor: pointer; text-transform: uppercase; }
            .btn-copy { background: #ffffff; color: #000; }
            .btn-curl { background: #2c2c2e; color: #fff; }
            .btn-run { background: linear-gradient(135deg, var(--apple-blue), #531cb3); color: #ffffff; flex-grow: 1; }

            /* 🌐 RESPONSE SPEED DISPLAY PANEL */
            .speed-tag { font-size: 0.7rem; font-weight: 900; color: var(--text-muted); margin-top: 8px; display: none; }

            .json-preview {
                background: #000000; border: 1px solid var(--border-color); border-radius: 12px;
                padding: 16px; font-family: monospace; font-size: 0.78rem; color: #666;
                white-space: pre-wrap; overflow-x: auto; max-height: 200px; margin-top: 10px;
            }

            /* 🕐 REQUEST HISTORY LOG PANEL */
            .history-panel { margin-top: 24px; padding: 20px; background: rgba(255,255,255,0.02); border: 1px solid var(--border-color); border-radius: 18px; }
            .history-title { font-size: 0.8rem; font-weight: 900; letter-spacing: 0.5px; margin-bottom: 10px; text-transform: uppercase; }
            .history-list { display: flex; flex-direction: column; gap: 6px; font-family: monospace; font-size: 0.75rem; }
            .history-item { display: flex; justify-content: space-between; padding: 6px 10px; background: rgba(0,0,0,0.2); border-radius: 6px; }

            /* 📱 MOBILE BOTTOM NAV BAR */
            .mobile-nav-bar {
                position: fixed; bottom: 0; left: 0; width: 100vw; height: 65px;
                background: var(--bg-card); backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px);
                border-top: 1px solid var(--border-color); z-index: 999;
                display: flex; justify-content: space-around; align-items: center;
            }
            .nav-item { display: flex; flex-direction: column; align-items: center; color: var(--text-muted); text-decoration: none; font-size: 0.65rem; font-weight: 700; gap: 4px; cursor: pointer; }
            .nav-item.active { color: var(--apple-cyan); }
            .nav-icon { font-size: 1.2rem; }

            #toast-alert {
                position: fixed; bottom: 85px; left: 50%; transform: translateX(-50%); background: #ffffff; color: #000000;
                font-family: 'Space Grotesk', sans-serif; font-weight: 900; font-size: 0.85rem; padding: 12px 24px; border-radius: 12px;
                z-index: 10000; opacity: 0; pointer-events: none; transition: all 0.2s ease;
            }
            #toast-alert.show { opacity: 1; }

            .dashboard-panel { margin-top: 24px; padding: 22px; background: rgba(0,0,0,0.2); border: 1px solid var(--border-color); border-radius: 20px; }
            .dash-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; }
            .dash-card { background: rgba(255,255,255,0.02); border: 1px solid var(--border-color); border-radius: 14px; padding: 12px; }
            .usage-bar-track { width: 100%; height: 6px; background: rgba(255,255,255,0.1); border-radius: 10px; margin-top: 8px; overflow: hidden; }
            .usage-bar-fill { height: 100%; width: 0; background: var(--apple-cyan); transition: width 0.5s; }

            @media (max-width: 600px) {
                .analytics-grid { grid-template-columns: 1fr; }
                .dash-grid { grid-template-columns: 1fr; }
            }
        </style>
    </head>
    <body>

        <div class="ambient-glow"></div>
        <div id="toast-alert">COPIED SUCCESSFULLY ✔</div>

        <div id="cyber-loader"><div class="apple-loading-wrapper"><div class="smooth-aura-glow"></div></div></div>

        <!-- Lock Warning Absolute shield layer -->
        <div id="global-lock-shield" class="lock-shield-msg">🔑 PLEASE ENTER A VALID API KEY TO UNLOCK ENDPOINTS</div>

        <div class="vercel-box" id="main-interface">
            <header>
                <h1>HASHU APIS</h1>
                <button class="theme-toggle-btn" onclick="toggleTheme()">🌙</button>
            </header>

            <!-- 🔔 RATE LIMIT WARNING ALERT -->
            <div class="rate-warning" id="rateLimitAlert">
                ⚠️ WARNING: Your API usage has exceeded 85% of your plan limit! Please optimize requests.
            </div>

            <!-- 🔑 API KEY INPUT SECTION -->
            <div class="apikey-section">
                <div style="font-size:0.75rem; font-weight:900;">ENTER YOUR AUTHENTICATION API KEY</div>
                <div class="apikey-row">
                    <input type="text" id="userApiKey" class="apikey-input" placeholder="e.g. HASHUU_PRO_KING_99" oninput="checkKeyPossibility()" />
                    <button class="btn-setkey" onclick="validateAndUnlock()">UNLOCK</button>
                </div>
            </div>

            <!-- 📊 DASHBOARD -->
            <div class="dashboard-panel">
                <div class="dash-grid" id="dashMetrics">
                    <div class="dash-card">
                        <div class="stat-label">Uptime</div>
                        <div class="stat-value" id="val-uptime">--</div>
                    </div>
                    <div class="dash-card">
                        <div class="stat-label">Your Hits Today</div>
                        <div class="stat-value" id="val-hits">0</div>
                        <div class="usage-bar-track"><div class="usage-bar-fill" id="val-bar"></div></div>
                    </div>
                </div>
            </div>

            <!-- WORKSPACE ENDPOINTS LAYER -->
            <div class="endpoint-list" id="endpointsContainer">
                
                <!-- 🎬 MOVIE DATABASE API -->
                <div class="api-wrapper locked" id="wrap-movie">
                    <div class="api-row">
                        <div class="meta-details" onclick="toggleAccordion('movie')">
                            <span class="endpoint-slug">/api/movie</span>
                            <span style="font-size:0.75rem; color:var(--text-muted)">OMDb Cinema Engine</span>
                        </div>
                        <span class="fav-star" onclick="toggleFavourite('movie', event)">★</span>
                    </div>
                    <div class="api-docs" id="docs-movie">
                        <!-- 🔍 PARAMETER FIELDS -->
                        <div class="param-input-group">
                            <label>Query / Movie Title (?text=)</label>
                            <input type="text" class="param-field" id="param-movie-text" value="Guardians of the Galaxy" oninput="rebuildUrl('movie')">
                        </div>
                        <div class="url-box-container">
                            <div class="url-display" id="url-movie">/api/movie?text=Guardians of the Galaxy</div>
                            <div class="action-btn-row">
                                <button class="btn-action btn-copy" onclick="copyLink('url-movie')">Copy URL</button>
                                <button class="btn-action btn-curl" onclick="copyAsCurl('movie')">📋 Copy cURL</button>
                                <button class="btn-action btn-run" onclick="runEndpoint('movie', '/api/movie', ['text'])">Run API</button>
                            </div>
                        </div>
                        <div class="speed-tag" id="speed-movie">⚡ Response Speed: <span class="ms">0</span>ms</div>
                        <pre class="json-preview" id="res-movie">{}</pre>
                    </div>
                </div>

                <!-- 💬 CHAT GPT-4o INTERFACE -->
                <div class="api-wrapper locked" id="wrap-chat">
                    <div class="api-row">
                        <div class="meta-details" onclick="toggleAccordion('chat')">
                            <span class="endpoint-slug">/api/chat</span>
                            <span style="font-size:0.75rem; color:var(--text-muted)">ChatGPT-4o Smart AI Engine</span>
                        </div>
                        <span class="fav-star" onclick="toggleFavourite('chat', event)">★</span>
                    </div>
                    <div class="api-docs" id="docs-chat">
                        <div class="param-input-group">
                            <label>Prompt Parameter (?prompt=)</label>
                            <input type="text" class="param-field" id="param-chat-prompt" value="Hi" oninput="rebuildUrl('chat')">
                        </div>
                        <div class="url-box-container">
                            <div class="url-display" id="url-chat">/api/chat?prompt=Hi</div>
                            <div class="action-btn-row">
                                <button class="btn-action btn-copy" onclick="copyLink('url-chat')">Copy URL</button>
                                <button class="btn-action btn-curl" onclick="copyAsCurl('chat')">📋 Copy cURL</button>
                                <button class="btn-action btn-run" onclick="runEndpoint('chat', '/api/chat', ['prompt'])">Run API</button>
                            </div>
                        </div>
                        <div class="speed-tag" id="speed-chat">⚡ Response Speed: <span class="ms">0</span>ms</div>
                        <pre class="json-preview" id="res-chat">{}</pre>
                    </div>
                </div>

                <!-- 🌐 LINK SHORTENER -->
                <div class="api-wrapper locked" id="wrap-shorten">
                    <div class="api-row">
                        <div class="meta-details" onclick="toggleAccordion('shorten')">
                            <span class="endpoint-slug">/api/url_shorten</span>
                            <span style="font-size:0.75rem; color:var(--text-muted)">Cuttly Link Shortener</span>
                        </div>
                        <span class="fav-star" onclick="toggleFavourite('shorten', event)">★</span>
                    </div>
                    <div class="api-docs" id="docs-shorten">
                        <div class="param-input-group">
                            <label>Target URL Link (?link=)</label>
                            <input type="text" class="param-field" id="param-shorten-link" value="https://google.com" oninput="rebuildUrl('shorten')">
                        </div>
                        <div class="url-box-container">
                            <div class="url-display" id="url-shorten">/api/url_shorten?link=https://google.com</div>
                            <div class="action-btn-row">
                                <button class="btn-action btn-copy" onclick="copyLink('url-shorten')">Copy URL</button>
                                <button class="btn-action btn-curl" onclick="copyAsCurl('shorten')">📋 Copy cURL</button>
                                <button class="btn-action btn-run" onclick="runEndpoint('shorten', '/api/url_shorten', ['link'])">Run API</button>
                            </div>
                        </div>
                        <div class="speed-tag" id="speed-shorten">⚡ Response Speed: <span class="ms">0</span>ms</div>
                        <pre class="json-preview" id="res-shorten">{}</pre>
                    </div>
                </div>

            </div>

            <!-- 🕐 REQUEST HISTORY LOG PANEL -->
            <div class="history-panel">
                <div class="history-title">🕐 Request History Log (Last 10 calls)</div>
                <div class="history-list" id="historyLogList">
                    <div style="color:var(--text-muted)">No requests generated yet.</div>
                </div>
            </div>
        </div>

        <!-- 📱 MOBILE BOTTOM NAV BAR -->
        <div class="mobile-nav-bar">
            <div class="nav-item active" onclick="filterNav('all')">
                <span class="nav-icon">⚡</span>
                <span>All APIs</span>
            </div>
            <div class="nav-item" onclick="filterNav('fav')">
                <span class="nav-icon">⭐</span>
                <span>Bookmarks</span>
            </div>
            <div class="nav-item" onclick="scrollToTop()">
                <span class="nav-icon">🔑</span>
                <span>Set Key</span>
            </div>
        </div>

        <script>
            let activeApiKey = "";
            let historyLog = [];
            let favouriteEndpoints = JSON.parse(localStorage.getItem('fav_endpoints') || '[]');

            window.addEventListener('DOMContentLoaded', () => {
                setTimeout(() => { document.getElementById('cyber-loader').style.opacity = '0'; setTimeout(() => document.getElementById('cyber-loader').remove(), 400); }, 800);
                document.getElementById('main-interface').classList.add('system-ready');
                renderFavouritesState();
                fetchGlobalStats();
            });

            // 🌙 DARK / LIGHT MODE TOGGLE ENGINE
            function toggleTheme() {
                const html = document.documentElement;
                const btn = document.querySelector('.theme-toggle-btn');
                if(html.getAttribute('data-theme') === 'dark') {
                    html.setAttribute('data-theme', 'light');
                    btn.innerText = "☀️";
                } else {
                    html.setAttribute('data-theme', 'dark');
                    btn.innerText = "🌙";
                }
            }

            function scrollToTop() { window.scrollTo({top: 0, behavior: 'smooth'}); }

            // API KEY CHECK & UNLOCK LOGIC
            function checkKeyPossibility() {
                const input = document.getElementById('userApiKey').value.trim();
                if(!input) lockSystem();
            }

            function validateAndUnlock() {
                const input = document.getElementById('userApiKey').value.trim();
                if(!input) return;

                activeApiKey = input;
                // backend verification emulation / local display unlock
                document.getElementById('global-lock-shield').style.display = 'none';
                
                const wrappers = document.querySelectorAll('.api-wrapper');
                wrappers.forEach(w => {
                    w.classList.remove('locked');
                    const id = w.id.replace('wrap-', '');
                    rebuildUrl(id);
                });

                triggerToast("INTERFACE UNLOCKED");
                fetchGlobalStats();
            }

            function lockSystem() {
                activeApiKey = "";
                document.getElementById('global-lock-shield').style.display = 'block';
                document.querySelectorAll('.api-wrapper').forEach(w => w.classList.add('locked'));
            }

            // UI PARAMETERS DYNAMIC FILLER CLOSURE
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
                
                const slug = container.querySelector('.endpoint-slug').innerText;
                document.getElementById('url-' + id).innerText = slug + '?' + params.join('&');
            }

            function toggleAccordion(id) {
                const docs = document.getElementById('docs-' + id);
                const isVisible = docs.style.display === 'block';
                document.querySelectorAll('.api-docs').forEach(d => d.style.display = 'none');
                docs.style.display = isVisible ? 'none' : 'block';
            }

            // ⭐ FAVOURITE BOOKMARKS ENGINE
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

            // 📱 MOBILE NAVIGATION BAR ACTION FILTERS
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

            // 📋 COPY AS cURL COMMAND ENGINE
            function copyAsCurl(id) {
                const currentUrlDisplay = document.getElementById('url-' + id).innerText;
                const absoluteUrl = window.location.origin + currentUrlDisplay;
                const curlCommand = \`curl -X GET "\${absoluteUrl}"\`;
                
                navigator.clipboard.writeText(curlCommand).then(() => triggerToast("cURL COMMAND COPIED"));
            }

            function copyLink(elementId) {
                const text = document.getElementById(elementId).innerText;
                navigator.clipboard.writeText(window.location.origin + text).then(() => triggerToast());
            }

            function triggerToast(msg = "COPIED TO CLIPBOARD ✔") {
                const toast = document.getElementById('toast-alert');
                toast.innerText = msg;
                toast.classList.add('show');
                setTimeout(() => toast.classList.remove('show'), 2000);
            }

            // 🌐 TRANSMIT & PING SPEED METRIC RUNNER
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
                
                consoleBox.textContent = "// STREAMING DATA SIGNAL... //";
                
                const startTime = performance.now();
                try {
                    const res = await fetch(finalUrl);
                    const payload = await res.json();
                    const duration = Math.round(performance.now() - startTime);
                    
                    // Display Speed/Ping meter
                    speedTag.style.display = "block";
                    speedTag.querySelector('.ms').innerText = duration;

                    consoleBox.textContent = JSON.stringify(payload, null, 2);
                    consoleBox.style.color = "#00FF87";

                    pushHistoryLog(route, res.status);
                    fetchGlobalStats();
                } catch (err) {
                    consoleBox.textContent = JSON.stringify({ error: "Transmission interrupted", msg: err.message }, null, 2);
                    consoleBox.style.color = "#ff453a";
                }
            }

            // 🕐 REQUEST HISTORY LOGGER ARCHITECTURE (Max last 10 logs)
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

                            // 🔔 RATE LIMIT WARNING ENGINE TRIGGER
                            if(pct >= 85) {
                                document.getElementById('rateLimitAlert').style.display = 'flex';
                            } else {
                                document.getElementById('rateLimitAlert').style.display = 'none';
                            }
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
// 🛠️ BACKEND CONTROLLERS LOGIC
// ─────────────────────────────────────────────────────────

// 🎬 OMDb MOVIE CONTROLLER
app.get('/api/movie', strictAuthGate, async (req, res) => {
    try {
        const { text } = req.query;
        if (!text) return res.json({ success: false, message: "Movie title parameter (?text=) missing!" });

        const movieUrl = `http://www.omdbapi.com/?t=${encodeURIComponent(text)}&apikey=2634bb02`;
        const { data } = await axios.get(movieUrl);

        if (data.Response === "True") {
            res.json({ creator: "MR HASHUU", status: "Authenticated", success: true, result: data });
        } else {
            res.json({ success: false, message: data.Error || "Movie not found!" });
        }
    } catch (e) { res.json({ success: false, message: e.message }); }
});

// CHATGPT-4o SMART INTERFACE
app.get('/api/chat', strictAuthGate, async (req, res) => {
    try {
        const { prompt } = req.query;
        if (!prompt) return res.json({ success: false, message: "Prompt parameter missing!" });

        const cleanPrompt = prompt.toLowerCase().trim();
        if (cleanPrompt === 'hi') return res.json({ creator: "MR HASHUU", status: "Authenticated", success: true, result: "Hellow Im Hashuu Ai Service" });

        const customSystemPrompt = "You are Hashan-md AI, a brilliant, helpful AI assistant developed and owned by MR HASHUU.";
        const targetUrl = `https://apis.davidcyriltech.my.id/ai/chatgpt?prompt=${encodeURIComponent(prompt)}&model=gpt-4o&system=${encodeURIComponent(customSystemPrompt)}`;
        
        const { data } = await axios.get(targetUrl);
        const aiReply = data?.data?.choices?.[0]?.message?.content || "AI Server error. Retry.";

        res.json({ creator: "MR HASHUU", status: "Authenticated", success: true, result: aiReply });
    } catch (e) { res.json({ success: false, message: e.message }); }
});

// CUTTLY URL SHORTENER
app.get('/api/url_shorten', strictAuthGate, async (req, res) => {
    try {
        const { link } = req.query;
        if (!link) return res.json({ success: false, message: "Link parameter missing!" });
        const { data } = await axios.get(`https://apis.davidcyriltech.my.id/cuttly?link=${encodeURIComponent(link)}`);
        if (data.success) {
            res.json({ creator: "MR HASHUU", status: "Authenticated", success: true, original_url: data.original_url, shortened_url: data.shortened_url });
        } else { res.json({ success: false, message: "URL shortening failed." }); }
    } catch (e) { res.json({ success: false, message: e.message }); }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Apple Matrix HASHU-API Engine Running on port ${PORT}`));

module.exports = app;
