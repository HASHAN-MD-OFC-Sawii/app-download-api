/**
 * ───────────────────────────────────────────────────────────────────────────────
 * 🚀 MR HASHUU PREMIUM API MATRIX GATEWAY SERVER
 * ───────────────────────────────────────────────────────────────────────────────
 * Developer/Owner : MR HASHUU
 * Release Version : 2.0.0 (Ultra Luxury Edition)
 * Platform        : Node.js / Express Architecture
 * ───────────────────────────────────────────────────────────────────────────────
 */

const express = require('express');
const axios = require('axios');
const rateLimit = require('express-rate-limit');
const obfuscator = require('javascript-obfuscator');
const cors = require('cors');
const multer = require('multer');
const FormData = require('form-data');

const app = express();
const upload = multer();

// Global Middlewares Configurations
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ─────────────────────────────────────────────────────────
// 🔑 AUTHORIZED PREMIUM API KEYS CORE DATABASE
// ─────────────────────────────────────────────────────────
const PREMIUM_DATABASE = {
    "HASHUU_PRO_KING_99": { owner: "Kasun", plan: "PREMIUM", level: "GOD_MODE" },
    "MR_HASHUU_SECRET_123": { owner: "MR HASHUU", plan: "PRO", level: "CREATOR" },
    "VIP_DEV_KEY_777": { owner: "Nimal", plan: "PREMIUM", level: "VIP" }
};

// ─────────────────────────────────────────────────────────
// 📊 ADAVNCED USAGE TRACKING SYSTEM
// ─────────────────────────────────────────────────────────
const usageStats = {};
const SERVER_START_TIME = Date.now();

/**
 * Tracks the API Key Usage per day dynamically
 * @param {string} apikey 
 */
function trackUsage(apikey) {
    const today = new Date().toISOString().split('T')[0];
    if (!usageStats[apikey]) usageStats[apikey] = {};
    if (!usageStats[apikey][today]) usageStats[apikey][today] = 0;
    usageStats[apikey][today]++;
}

/**
 * Gets the total usage count for today
 * @param {string} apikey 
 * @returns {number}
 */
function getTodayUsage(apikey) {
    const today = new Date().toISOString().split('T')[0];
    return (usageStats[apikey] && usageStats[apikey][today]) || 0;
}

/**
 * Gets the total all-time request count for a specific key
 * @param {string} apikey 
 * @returns {number}
 */
function getTotalUsage(apikey) {
    if (!usageStats[apikey]) return 0;
    return Object.values(usageStats[apikey]).reduce((a, b) => a + b, 0);
}

// Global Rate Limiter Policy Setup
const premiumLimiter = rateLimit({
    windowMs: 24 * 60 * 60 * 1000, // 24 Hours window
    max: 5000, 
    message: { 
        success: false, 
        creator: "MR HASHUU",
        status: 429,
        message: "Premium daily threshold limit reached! Please contact MR HASHUU for verification." 
    }
});

/**
 * Strict Security Authentication Gate Middleware
 */
const strictAuthGate = (req, res, next) => {
    const { apikey } = req.query;
    
    if (!apikey) {
        return res.status(401).json({
            success: false,
            creator: "MR HASHUU",
            status: "ACCESS_DENIED",
            message: "Authentication Failed! API Key is missing. Append '?apikey=YOUR_KEY' to your absolute URL."
        });
    }
    
    if (!PREMIUM_DATABASE[apikey]) {
        return res.status(403).json({
            success: false,
            creator: "MR HASHUU",
            status: "INVALID_KEY",
            message: "Access Denied! Invalid credentials. Contact MR HASHUU for an authorized secure premium key."
        });
    }
    
    // Injecting key authorization properties into request context
    req.planOwner = PREMIUM_DATABASE[apikey].owner;
    req.planType = PREMIUM_DATABASE[apikey].plan;
    req.apikey = apikey;
    
    trackUsage(apikey);
    return premiumLimiter(req, res, next);
};

// ─────────────────────────────────────────────────────────
// 📊 REALTIME SERVER STATS ENGINE
// ─────────────────────────────────────────────────────────
app.get('/api/stats', (req, res) => {
    try {
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

            return res.status(200).json({
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

        return res.status(200).json({
            success: true,
            server: {
                uptime: `${hours}h ${minutes}m ${seconds}s`,
                uptime_ms: uptimeMs,
                total_requests_all_keys: allTotalRequests,
                status: "ONLINE"
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Stats generation runtime exception error.", log: error.message });
    }
});

// ─────────────────────────────────────────────────────────
// 🌌 ULTRA LUXURY APPLE MATRIX INTERACTION UI HTML PORTAL
// ─────────────────────────────────────────────────────────
app.get('/', (req, res) => {
    // UI section directly serves the interactive web dashboard framework
    res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
        <title>MR HASHUU PREMIUM GATEWAY</title>
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@700;900&family=Inter:wght@700;800;900&display=swap" rel="stylesheet">
        <style>
            :root {
                --apple-black: #000000;
                --apple-dark-gray: #09090a;
                --apple-card: rgba(18, 18, 19, 0.75);
                --apple-border: rgba(255, 255, 255, 0.07);
                --apple-cyan: #00F5FF;
                --apple-blue: #7B2CBF;
                --apple-green: #00FF87;
                --apple-red: #ff453a;
                --text-main: #ffffff;
                --text-muted: #a1a1a6;
            }
            * { box-sizing: border-box; margin: 0; padding: 0; -webkit-tap-highlight-color: transparent; }
            body { background-color: var(--apple-black); color: var(--text-main); font-family: 'Inter', -apple-system, sans-serif; min-height: 100vh; display: flex; justify-content: center; align-items: center; padding: 40px 0; position: relative; }
            .ambient-glow { position: fixed; top: -20%; left: 50%; transform: translateX(-50%); width: 90vw; height: 60vh; background: radial-gradient(circle, rgba(123, 44, 191, 0.25) 0%, rgba(0, 245, 255, 0.06) 45%, transparent 100%); z-index: 1; pointer-events: none; filter: blur(70px); }
            #cyber-loader { position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: var(--apple-black); z-index: 9999; display: flex; flex-direction: column; justify-content: center; align-items: center; transition: opacity 0.4s ease-out; }
            .apple-loading-wrapper { display: flex; flex-direction: column; align-items: center; gap: 20px; }
            .smooth-aura-glow { width: 65px; height: 65px; border: 4px solid rgba(255, 255, 255, 0.02); border-top-color: var(--apple-cyan); border-bottom-color: var(--apple-blue); border-radius: 50%; animation: appleSpin 0.7s cubic-bezier(0.4, 0, 0.2, 1) infinite; }
            .loader-brand { font-family: 'Space Grotesk', sans-serif; font-size: 1.3rem; font-weight: 900; color: #ffffff; letter-spacing: 5px; text-transform: uppercase; background: linear-gradient(90deg, var(--apple-cyan), var(--apple-blue)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
            @keyframes appleSpin { to { transform: rotate(360deg); } }
            .vercel-box { width: 92%; max-width: 650px; background: var(--apple-card); backdrop-filter: blur(50px); -webkit-backdrop-filter: blur(50px); border: 1px solid var(--apple-border); border-radius: 28px; padding: 35px; z-index: 2; position: relative; box-shadow: 0 50px 100px rgba(0, 0, 0, 0.9); opacity: 0; transform: scale(0.96); transition: all 0.7s cubic-bezier(0.16, 1, 0.3, 1); }
            .vercel-box.system-ready { opacity: 1; transform: scale(1); }
            header { display: flex; justify-content: space-between; align-items: center; padding-bottom: 22px; border-bottom: 1px solid var(--apple-border); flex-wrap: wrap; gap: 15px; }
            header h1 { font-family: 'Space Grotesk', sans-serif; font-size: 2rem; font-weight: 900; letter-spacing: -0.5px; color: #ffffff; }
            .status-container { display: inline-flex; align-items: center; gap: 7px; font-size: 0.75rem; font-weight: 900; letter-spacing: 0.5px; color: var(--apple-cyan); background: rgba(0, 245, 255, 0.08); padding: 7px 15px; border-radius: 30px; border: 1px solid rgba(0, 245, 255, 0.2); }
            .pulse-dot { width: 8px; height: 8px; background: var(--apple-cyan); border-radius: 50%; box-shadow: 0 0 10px var(--apple-cyan); animation: pulse 1.5s infinite; }
            @keyframes pulse { 0%, 100% { opacity: 0.6; } 50% { opacity: 1; } }
            .analytics-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; margin-top: 24px; }
            .stat-card { background: rgba(255, 255, 255, 0.015); border: 1px solid var(--apple-border); border-radius: 18px; padding: 16px 12px; text-align: center; transition: all 0.3s; }
            .stat-card:hover { border-color: rgba(255,255,255,0.12); background: rgba(255,255,255,0.03); }
            .stat-label { font-size: 0.68rem; font-weight: 900; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.6px; }
            .stat-value { font-size: 1.15rem; font-weight: 900; color: #ffffff; margin-top: 5px; font-family: 'Space Grotesk', sans-serif; }
            .search-container { position: relative; margin-top: 24px; }
            .search-input { width: 100%; padding: 18px 22px; background: rgba(0, 0, 0, 0.5); border: 1px solid var(--apple-border); border-radius: 16px; color: #ffffff; font-size: 0.95rem; font-weight: 800; outline: none; transition: all 0.3s; }
            .search-input:focus { border-color: rgba(0, 245, 255, 0.5); background: rgba(0, 0, 0, 0.7); box-shadow: 0 0 25px rgba(0, 245, 255, 0.08); }
            ::placeholder { color: #4e4e54; font-weight: 800; }
            .endpoint-list { margin-top: 24px; display: flex; flex-direction: column; gap: 14px; }
            .api-wrapper { background: rgba(255, 255, 255, 0.01); border: 1px solid var(--apple-border); border-radius: 18px; overflow: hidden; transition: all 0.25s; }
            .api-wrapper:hover { border-color: rgba(255, 255, 255, 0.14); background: rgba(255, 255, 255, 0.02); }
            .api-row { padding: 20px; display: flex; justify-content: space-between; align-items: center; cursor: pointer; }
            .meta-details { display: flex; flex-direction: column; gap: 5px; max-width: 85%; }
            .endpoint-slug { font-size: 1.1rem; font-weight: 900; color: #ffffff; font-family: monospace; letter-spacing: -0.3px; }
            .endpoint-info { font-size: 0.82rem; font-weight: 800; color: var(--text-muted); }
            .arrow-icon { font-size: 0.8rem; color: #444; font-weight: 900; transition: transform 0.25s; }
            .api-wrapper.active { border-color: rgba(123, 44, 191, 0.6); background: rgba(0, 0, 0, 0.4); box-shadow: inset 0 0 20px rgba(123, 44, 191, 0.05); }
            .api-wrapper.active .arrow-icon { transform: rotate(90deg); color: var(--apple-cyan); }
            .api-docs { display: none; padding: 0 20px 20px 20px; border-top: 1px solid rgba(255, 255, 255, 0.04); background: rgba(0,0,0,0.2); }
            .docs-section-title { font-size: 0.7rem; font-weight: 900; color: var(--text-muted); text-transform: uppercase; margin: 18px 0 8px 0; letter-spacing: 0.6px; }
            .url-box-container { display: flex; gap: 10px; margin-top: 6px; }
            .url-display { flex-grow: 1; background: #000000; border: 1px solid var(--apple-border); padding: 15px; border-radius: 12px; font-family: monospace; font-size: 0.8rem; font-weight: 700; color: var(--apple-cyan); overflow-x: auto; white-space: nowrap; }
            .url-display::-webkit-scrollbar { height: 4px; }
            .url-display::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.1); border-radius: 10px; }
            .btn-action { border: none; font-size: 0.78rem; font-weight: 900; padding: 0 18px; border-radius: 12px; cursor: pointer; text-transform: uppercase; transition: all 0.2s; min-height: 46px; }
            .btn-copy { background: #ffffff; color: #000000; }
            .btn-copy:hover { opacity: 0.88; }
            .btn-run { background: linear-gradient(135deg, var(--apple-blue), #531cb3); color: #ffffff; }
            .btn-run:hover { box-shadow: 0 0 18px rgba(123, 44, 191, 0.5); }
            .json-preview { background: #000000; border: 1px solid var(--apple-border); border-radius: 12px; padding: 16px; font-family: monospace; font-size: 0.78rem; font-weight: 700; color: #666; white-space: pre-wrap; overflow-x: auto; max-height: 220px; line-height: 1.5; }
            #toast-alert { position: fixed; bottom: 35px; background: #ffffff; color: #000000; font-family: 'Space Grotesk', sans-serif; font-weight: 900; font-size: 0.85rem; padding: 14px 28px; border-radius: 14px; z-index: 10000; opacity: 0; transform: translateY(10px); pointer-events: none; box-shadow: 0 20px 40px rgba(0,0,0,0.4); transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1); }
            #toast-alert.show { opacity: 1; transform: translateY(0); }
            .dashboard-panel { margin-top: 24px; padding: 22px; background: rgba(0,0,0,0.4); border: 1px solid rgba(123,44,191,0.3); border-radius: 20px; }
            .dashboard-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 18px; }
            .dashboard-title { font-family: 'Space Grotesk', sans-serif; font-size: 0.75rem; font-weight: 900; color: var(--apple-blue); text-transform: uppercase; letter-spacing: 1px; display: flex; align-items: center; gap: 8px; }
            .dashboard-title::before { content: "📊"; }
            .btn-refresh { background: rgba(123,44,191,0.15); border: 1px solid rgba(123,44,191,0.3); color: var(--apple-blue); font-size: 0.7rem; font-weight: 900; padding: 6px 14px; border-radius: 8px; cursor: pointer; text-transform: uppercase; transition: all 0.2s; }
            .btn-refresh.spinning { animation: spin 0.6s linear infinite; }
            @keyframes spin { to { transform: rotate(360deg); } }
            .dash-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; margin-bottom: 16px; }
            .dash-card { background: rgba(255,255,255,0.02); border: 1px solid var(--apple-border); border-radius: 14px; padding: 14px 16px; }
            .dash-card-label { font-size: 0.65rem; font-weight: 900; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.6px; }
            .dash-card-value { font-family: 'Space Grotesk', sans-serif; font-size: 1.3rem; font-weight: 900; color: #fff; margin-top: 4px; }
            .plan-badge { display: inline-flex; align-items: center; gap: 6px; font-size: 0.7rem; font-weight: 900; padding: 5px 12px; border-radius: 20px; margin-top: 6px; text-transform: uppercase; letter-spacing: 0.5px; }
            .plan-badge.PREMIUM { background: rgba(0,245,255,0.1); border: 1px solid rgba(0,245,255,0.3); color: var(--apple-cyan); }
            .plan-badge.PRO { background: rgba(123,44,191,0.15); border: 1px solid rgba(123,44,191,0.4); color: #bf7eff; }
            .dash-no-key { text-align: center; padding: 20px; font-size: 0.8rem; font-weight: 800; color: var(--text-muted); font-family: monospace; }
            .server-row { display: grid; grid-template-columns: repeat(3,1fr); gap: 10px; margin-top: 12px; padding-top: 14px; border-top: 1px solid var(--apple-border); }
            .server-stat { text-align: center; }
            .server-stat-label { font-size: 0.6rem; font-weight: 900; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.5px; }
            .server-stat-value { font-size: 0.85rem; font-weight: 900; color: #fff; font-family: 'Space Grotesk', sans-serif; margin-top: 3px; }
            .apikey-section { margin-top: 24px; padding: 20px; background: rgba(0, 245, 255, 0.04); border: 1px solid rgba(0, 245, 255, 0.15); border-radius: 18px; }
            .apikey-label { font-size: 0.7rem; font-weight: 900; color: var(--apple-cyan); text-transform: uppercase; letter-spacing: 0.8px; margin-bottom: 10px; display: flex; align-items: center; gap: 8px; }
            .apikey-label::before { content: "🔑"; }
            .apikey-row { display: flex; gap: 10px; }
            .apikey-input { flex-grow: 1; padding: 14px 18px; background: rgba(0, 0, 0, 0.6); border: 1px solid rgba(0, 245, 255, 0.25); border-radius: 12px; color: var(--apple-cyan); font-size: 0.9rem; font-weight: 800; font-family: monospace; outline: none; transition: all 0.3s; letter-spacing: 1px; }
            .btn-setkey { background: linear-gradient(135deg, var(--apple-cyan), #00bcd4); color: #000000; font-size: 0.75rem; font-weight: 900; padding: 0 20px; border-radius: 12px; border: none; cursor: pointer; text-transform: uppercase; min-height: 46px; transition: all 0.2s; white-space: nowrap; }
            footer { display: flex; justify-content: space-between; align-items: center; font-size: 0.78rem; font-weight: 900; color: var(--text-muted); border-top: 1px solid var(--apple-border); padding-top: 22px; margin-top: 24px; flex-wrap: wrap; gap: 10px; }
            .buy-btn { color: var(--apple-cyan); text-decoration: none; font-weight: 900; }
        </style>
    </head>
    <body>
        <div class="ambient-glow"></div>
        <div id="toast-alert">COPIED TO CLIPBOARD ✔</div>
        <div id="cyber-loader">
            <div class="apple-loading-wrapper">
                <div class="smooth-aura-glow"></div>
                <div class="loader-brand">MR HASHUU</div>
            </div>
        </div>
        <div class="vercel-box" id="main-interface">
            <header>
                <h1>HASHU APIS</h1>
                <div class="status-container"><div class="pulse-dot"></div><span>SYSTEM RUNNING</span></div>
            </header>
            <div class="analytics-grid">
                <div class="stat-card"><div class="stat-label">Total Requests</div><div class="stat-value">245.8K</div></div>
                <div class="stat-card"><div class="stat-label">System Uptime</div><div class="stat-value">99.99%</div></div>
                <div class="stat-card"><div class="stat-label">Core Owner</div><div class="stat-value" style="background: linear-gradient(90deg, var(--apple-cyan), var(--apple-blue)); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">MR HASHUU</div></div>
            </div>
            <div class="dashboard-panel">
                <div class="dashboard-header">
                    <div class="dashboard-title">Usage Dashboard</div>
                    <button class="btn-refresh" id="refreshBtn" onclick="loadDashboard()">↻ REFRESH</button>
                </div>
                <div id="dashContent"><div class="dash-no-key">// Set your API key above to view your usage stats //</div></div>
            </div>
            <div class="apikey-section">
                <div class="apikey-label">Your API Key</div>
                <div class="apikey-row">
                    <input type="text" id="userApiKey" class="apikey-input" placeholder="Enter your API key here..." oninput="onKeyInput()" />
                    <button class="btn-setkey" onclick="setApiKey()">SET KEY</button>
                </div>
                <div class="apikey-status" id="keyStatus">// No API key set — endpoints will use default example key //</div>
            </div>
            <div class="search-container"><input type="text" id="apiSearch" class="search-input" placeholder="Search developer secure endpoints..." onkeyup="filterEndpoints()"></div>
            <div class="endpoint-list" id="listWrapper">
                <div class="api-wrapper" data-name="movie database omdb cinema film">
                    <div class="api-row" onclick="toggleAccordion(this)">
                        <div class="meta-details"><span class="endpoint-slug">/api/movie</span><span class="endpoint-info">OMDb Cinema & Film Tracker Engine</span></div>
                        <span class="arrow-icon">▶</span>
                    </div>
                    <div class="api-docs">
                        <div class="docs-section-title">Execution Gateway Endpoint</div>
                        <div class="url-box-container">
                            <div class="url-display" id="url-movie">/api/movie?text=Guardians of the Galaxy&apikey=MR_HASHUU_SECRET_123</div>
                            <button class="btn-action btn-copy" onclick="copyLink('url-movie')">Copy</button>
                            <button class="btn-action btn-run" onclick="runEndpoint('url-movie', 'res-movie', this)">Run API</button>
                        </div>
                        <pre class="json-preview" id="res-movie">{ "status": "idle", "message": "Click Run API to view live server stream data." }</pre>
                    </div>
                </div>
                </div>
            <footer><span>© 2026 MR HASHUU</span><a href="#" class="buy-btn">REQUEST CORE ACCESS</a></footer>
        </div>
        <script>
            // Advanced client side matrix logic here...
            window.addEventListener('DOMContentLoaded', () => { setTimeout(() => { const loader = document.getElementById('cyber-loader'); const mainUI = document.getElementById('main-interface'); loader.style.opacity = '0'; setTimeout(() => { loader.remove(); mainUI.classList.add('system-ready'); }, 400); }, 1200); });
            function toggleAccordion(e) { const p = e.parentElement; const d = p.querySelector('.api-docs'); const isOpen = p.classList.contains('active'); Array.from(document.getElementsByClassName('api-wrapper')).forEach(w => { w.classList.remove('active'); w.querySelector('.api-docs').style.display = 'none'; }); if(!isOpen) { p.classList.add('active'); d.style.display = 'block'; } }
            let activeApiKey = null;
            function onKeyInput() { if(!document.getElementById('userApiKey').value.trim()) { activeApiKey = null; document.getElementById('keyStatus').textContent = '// No API key set //'; } }
            function setApiKey() { const input = document.getElementById('userApiKey').value.trim(); if(!input) return; activeApiKey = input; document.getElementById('keyStatus').textContent = '✔ API Key set: ' + input; loadDashboard(); }
            async function loadDashboard() { /* Web Client AJAX Fetch logic mapping /api/stats */ }
        </script>
    </body>
    </html>
    `);
});

// ─────────────────────────────────────────────────────────
// 🛠️ BACKEND CONTROLLERS CORE BUSINESS LOGIC
// ─────────────────────────────────────────────────────────

// [🎬 MOVIE DATABASE] OMDb Router Gateway
app.get('/api/movie', strictAuthGate, async (req, res) => {
    try {
        const { text } = req.query;
        if (!text) return res.status(400).json({ success: false, message: "Required parameter query parameter (?text=) is completely missing!" });

        const movieUrl = `http://www.omdbapi.com/?t=${encodeURIComponent(text)}&apikey=2634bb02`;
        const { data } = await axios.get(movieUrl);

        if (data.Response === "True") {
            return res.status(200).json({ creator: "MR HASHUU", status: "Authenticated", success: true, result: data });
        }
        res.status(404).json({ success: false, message: data.Error || "Requested movie entity data not found!" });
    } catch (e) {
        res.status(500).json({ success: false, message: "Internal wrapper runtime connection break.", exception: e.message });
    }
});

// [🤖 AI INTELLIGENCE CHAT] ChatGPT-4o Router Gateway
app.get('/api/chat', strictAuthGate, async (req, res) => {
    try {
        const { prompt } = req.query;
        if (!prompt) return res.status(400).json({ success: false, message: "Prompt query parameter missing!" });

        const cleanPrompt = prompt.toLowerCase().trim();
        if (cleanPrompt === 'hi') {
            return res.json({ creator: "MR HASHUU", status: "Authenticated", success: true, result: "Hellow Im Hashuu Ai Service" });
        }
        if (cleanPrompt === 'kawad bn') {
            return res.json({ creator: "MR HASHUU", status: "Authenticated", success: true, result: "huththak kwa" });
        }

        const customSystemPrompt = "You are Hashan-md AI, a brilliant, helpful AI assistant developed and owned by MR HASHUU. Always respond in an intelligent and smart manner.";
        const targetUrl = `https://apis.davidcyriltech.my.id/ai/chatgpt?prompt=${encodeURIComponent(prompt)}&model=gpt-4o&system=${encodeURIComponent(customSystemPrompt)}`;
        
        const { data } = await axios.get(targetUrl);
        const aiReply = data?.data?.choices?.[0]?.message?.content || "AI Server experienced a temporary structural break. Retry.";

        res.status(200).json({ creator: "MR HASHUU", status: "Authenticated", success: true, result: aiReply });
    } catch (e) { 
        res.status(500).json({ success: false, message: e.message }); 
    }
});

// [🔗 LINK SHORTENER] Cuttly Router Engine
app.get('/api/url_shorten', strictAuthGate, async (req, res) => {
    try {
        const { link } = req.query;
        if (!link) return res.status(400).json({ success: false, message: "Target URL Link parameter is missing!" });
        
        const { data } = await axios.get(`https://apis.davidcyriltech.my.id/cuttly?link=${encodeURIComponent(link)}`);
        if (data.success) {
            return res.status(200).json({ creator: "MR HASHUU", status: "Authenticated", success: true, original_url: data.original_url, shortened_url: data.shortened_url });
        } 
        res.status(422).json({ success: false, message: "Provider URL shortening operation pipeline failed." });
    } catch (e) { 
        res.status(500).json({ success: false, message: e.message }); 
    }
});

// [🔞 ADULT STREAM CDN] XVideos Resolver Gateway
app.get('/xvideo', strictAuthGate, async (req, res) => {
    try {
        const { url } = req.query;
        if (!url) return res.status(400).json({ success: false, message: "Target XVideo URL query resource reference required!" });
        
        const { data } = await axios.get(`https://apis.davidcyriltech.my.id/xvideo?url=${encodeURIComponent(url)}`);
        if (data.success) {
            return res.status(200).json({ creator: "MR HASHUU", status: "Authenticated", success: true, title: data.title, thumbnail: data.thumbnail, download_url: data.download_url });
        } 
        res.status(422).json({ success: false, message: "Media extraction conversion processing pipeline failed." });
    } catch (e) { 
        res.status(500).json({ success: false, message: e.message }); 
    }
});

// [🎥 YOUTUBE VIDEO DOWNLOADER] HD MP4 Speed Grabber Router 
app.get('/ytmp4', strictAuthGate, async (req, res) => {
    try {
        const { url } = req.query;
        if (!url) return res.status(400).json({ success: false, message: "Valid YouTube video URL source target required!" });
        
        const { data } = await axios.get(`https://apis.davidcyriltech.my.id/download/ytmp4?url=${encodeURIComponent(url)}`);
        if (data.success && data.result) {
            return res.status(200).json({ creator: "MR HASHUU", status: "Authenticated", success: true, result: data.result });
        } 
        res.status(422).json({ success: false, message: "Media payload conversion and extraction execution failed." });
    } catch (e) { 
        res.status(500).json({ success: false, message: e.message }); 
    }
});

// [📁 MEDIAFIRE STORAGE ENGINE] Direct Binary Link Extractor
app.get('/mediafire', strictAuthGate, async (req, res) => {
    try {
        const { url } = req.query;
        if (!url) return res.status(400).json({ success: false, message: "Mediafire cloud folder/file URL path reference required!" });
        
        const { data } = await axios.get(`https://apis.davidcyriltech.my.id/mediafire?url=${encodeURIComponent(url)}`);
        res.status(200).json({ creator: "MR HASHUU", status: "Authenticated", success: true, result: data });
    } catch (e) { 
        res.status(500).json({ success: false, message: e.message }); 
    }
});

// [🎵 SPOTIFY DEEP EXTRACTOR] Lossless HQ Audio Grabber
app.get('/spotify', strictAuthGate, async (req, res) => {
    try {
        const { url } = req.query;
        if (!url) return res.status(400).json({ success: false, message: "Target Spotify Track/Playlist URL resource address required!" });
        
        const { data } = await axios.get(`https://apis.davidcyriltech.my.id/spotifydl?url=${encodeURIComponent(url)}`);
        res.status(200).json({ creator: "MR HASHUU", status: "Authenticated", success: true, result: data });
    } catch (e) { 
        res.status(500).json({ success: false, message: e.message }); 
    }
});

// [🐦 TWITTER MULTI-STREAM] X Platform Media CDN Grabber
app.get('/twitter', strictAuthGate, async (req, res) => {
    try {
        const { url } = req.query;
        if (!url) return res.status(400).json({ success: false, message: "X / Twitter status link target parameter required!" });
        
        const { data } = await axios.get(`https://apis.davidcyriltech.my.id/twitterV2?url=${encodeURIComponent(url)}`);
        res.status(200).json({ creator: "MR HASHUU", status: "Authenticated", success: true, result: data });
    } catch (e) { 
        res.status(500).json({ success: false, message: e.message }); 
    }
});

// [🎶 YOUTUBE AUDIO SEARCH] High Fidelity Stream Grabber
app.get('/song', strictAuthGate, async (req, res) => {
    try {
        const { text } = req.query;
        if (!text) return res.status(400).json({ success: false, message: "Song title tracking text keyword parameter required!" });
        
        const { data } = await axios.get(`https://apis.davidcyriltech.my.id/play?query=${encodeURIComponent(text)}`);
        if (data.status && data.result) {
            return res.status(200).json({ creator: "MR HASHUU", status: "Authenticated", success: true, result: data.result });
        } 
        res.status(422).json({ success: false, message: "Failed to fetch and process tracking audio stream metadata." });
    } catch (e) { 
        res.status(500).json({ success: false, message: e.message }); 
    }
});

// [📱 TIKTOK NO-WATERMARK Engine] Studio Source Video Fetcher
app.get('/tiktok', strictAuthGate, async (req, res) => {
    try {
        const { url } = req.query;
        if (!url) return res.status(400).json({ success: false, message: "Absolute TikTok clip share link required!" });
        
        const { data } = await axios.get(`https://apis.davidcyriltech.my.id/download/tiktok?url=${encodeURIComponent(url)}`);
        if (data.success && data.result) {
            return res.status(200).json({ creator: "MR HASHUU", status: "Authenticated", success: true, result: data.result });
        } 
        res.status(400).json({ success: false, message: "Invalid TikTok platform resource location address metadata mapping." });
    } catch (e) { 
        res.status(500).json({ success: false, message: e.message }); 
    }
});

// [📌 PINTEREST SEARCH ENGINE] UHD Visual Media Source Tracker
app.get('/pinterest', strictAuthGate, async (req, res) => {
    try {
        const { text } = req.query;
        if (!text) return res.status(400).json({ success: false, message: "Discovery query pattern match string parameter required!" });
        
        const { data } = await axios.get(`https://apis.davidcyriltech.my.id/search/pinterest?text=${encodeURIComponent(text)}`);
        res.status(200).json({ creator: "MR HASHUU", status: "Authenticated", success: true, result: data.result || [] });
    } catch (e) { 
        res.status(500).json({ success: false, message: e.message }); 
    }
});

// [🤖 APK PACKAGING SYSTEM] Android Binary Mirror Downloader
app.get('/apk', strictAuthGate, async (req, res) => {
    try {
        const { text } = req.query;
        if (!text) return res.status(400).json({ success: false, message: "Application bundle identifier/name matching keyword string required!" });
        
        const { data } = await axios.get(`https://apis.davidcyriltech.my.id/download/apk?text=${encodeURIComponent(text)}`, { 
            headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' }, 
            timeout: 8000 
        });
        res.status(200).json({ creator: "MR HASHUU", status: "Authenticated", success: true, result: data.apk || {} });
    } catch (e) { 
        res.status(500).json({ success: false, message: "APK resolution mirror engine failed due to network timeout limit.", log: e.message }); 
    }
});

// [👥 FACEBOOK STREAM WATCH] Multi-CDN Link Extractor
app.get('/facebook', strictAuthGate, async (req, res) => {
    try {
        const { url } = req.query;
        if (!url) return res.status(400).json({ success: false, message: "Facebook video watch endpoint parameter reference link missing!" });
        
        const { data } = await axios.get(`https://apis.davidcyriltech.my.id/facebook2?url=${encodeURIComponent(url)}`);
        if (data.status) {
            return res.status(200).json({ creator: "MR HASHUU", status: "Authenticated", success: true, result: data.video });
        } 
        res.status(422).json({ success: false, message: "Target social architecture core failed to streamline extraction parameters." });
    } catch (e) { 
        res.status(500).json({ success: false, message: e.message }); 
    }
});

// [🌐 STATIC SITE WEB CLONER] Structural HTML Stack Packager
app.get('/webdl', strictAuthGate, async (req, res) => {
    try {
        const { url } = req.query;
        if (!url) return res.status(400).json({ success: false, message: "Destination target asset platform root URL parameter required!" });
        
        const { data } = await axios.get(`https://apis.davidcyriltech.my.id/tools/downloadweb?url=${encodeURIComponent(url)}`);
        if (data.response && (data.response.success === true || data.response.success === "true")) {
            return res.status(200).json({ creator: "MR HASHUU", status: "Authenticated", success: true, result: { downloadUrl: data.response.downloadUrl, isFinished: data.response.isFinished } });
        } 
        res.status(422).json({ success: false, message: "Structural target cloner engine encountered errors parsing data elements." });
    } catch (e) { 
        res.status(500).json({ success: false, message: e.message }); 
    }
});

// [🔒 JAVASCRIPT ANTI-SCRAPE PROTECTOR] Advanced Code Obfuscator
app.get('/obfuscate', strictAuthGate, (req, res) => {
    try {
        const { code } = req.query;
        if (!code) return res.status(400).json({ success: false, message: "Source structural raw code payload parameter string is completely missing!" });
        
        const obfuscatedCode = obfuscator.obfuscate(code, { 
            compact: true, 
            controlFlowFlattening: true, 
            controlFlowFlatteningThreshold: 0.75,
            deadCodeInjection: true,
            stringArray: true
        }).getObfuscatedCode();
        
        res.status(200).json({ creator: "MR HASHUU", status: "Authenticated", success: true, result: obfuscatedCode });
    } catch (e) { 
        res.status(500).json({ success: false, message: "Syntax check evaluation crash during payload encryption sequence.", log: e.message }); 
    }
});

// [🖼️ IMGBB IMAGE CLOUD INTERFACE] Binary Multi-Part Form Processor
app.post('/imgbb', strictAuthGate, upload.single('file'), async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ success: false, message: "Target raw binary image asset file attachment buffer is missing!" });
        
        const form = new FormData();
        form.append('file', req.file.buffer, { filename: req.file.originalname || 'image.jpg', contentType: req.file.mimetype });
        
        const { data } = await axios.post('https://apis.davidcyriltech.my.id/uploader/imgbb', form, { 
            headers: { ...form.getHeaders(), 'User-Agent': 'Mozilla/5.0 (Server Engine Platform Node)' } 
        });
        
        if (data.success) { 
            return res.status(200).json({ creator: "MR HASHUU", status: "Authenticated", success: true, result: data.data }); 
        }
        res.status(424).json({ success: false, message: "Cloud CDN partner upload process declined transaction data structure." });
    } catch (e) { 
        res.status(500).json({ success: false, message: e.message }); 
    }
});

// Global Application Core Boot Execution
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.clear();
    console.log("─────────────────────────────────────────────────────────");
    console.log(` 🍏 Apple Matrix HASHU-API Engine Connected successfully!`);
    console.log(` 🚀 Live Production Service Listening on Local Port: ${PORT}`);
    console.log("─────────────────────────────────────────────────────────");
});

module.exports = app;
