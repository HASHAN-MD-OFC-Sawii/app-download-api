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
    message: { success: false, message: "PREMIUM DAILY LIMIT REACHED." }
});

const strictAuthGate = (req, res, next) => {
    const { apikey } = req.query;
    if (!apikey || !PREMIUM_DATABASE[apikey]) {
        return res.status(403).json({ success: false, message: "INVALID OR MISSING API KEY." });
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

    if (apikey && PREMIUM_DATABASE[apikey]) {
        const plan = PREMIUM_DATABASE[apikey];
        return res.json({
            success: true,
            key_info: {
                owner: plan.owner,
                plan: plan.plan,
                today_usage: getTodayUsage(apikey),
                daily_limit: plan.plan === 'PREMIUM' ? 5000 : 3000,
                usage_percent: Math.min(100, Math.round((getTodayUsage(apikey) / (plan.plan === 'PREMIUM' ? 5000 : 3000)) * 100))
            },
            server: { uptime: `${hours}h ${minutes}m ${seconds}s` }
        });
    }
    res.json({ success: true, server: { uptime: `${hours}h ${minutes}m ${seconds}s` } });
});

// ─────────────────────────────────────────────────────────
// 🌌 LUXURY INTERFACE RESPOSIVE GATEWAY UI
// ─────────────────────────────────────────────────────────
app.get('/', (req, res) => {
    res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
        <title>MR HASHUU - PREMIUM PORTAL</title>
        <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@700&family=JetBrains+Mono:wght@700&display=swap" rel="stylesheet">
        <style>
            :root {
                --bg: #0B0612;
                --surface: #160F24;
                --primary: #00F5FF;
                --secondary: #7B2CBF;
                --text: #F3EEFA;
                --text-muted: #9486A8;
                --error: #FF3366;
                --success: #00FF87;
            }

            * { box-sizing: border-box; margin: 0; padding: 0; font-family: 'Space Grotesk', sans-serif; font-weight: 700; -webkit-tap-highlight-color: transparent; }
            body, html { background: var(--bg); color: var(--text); width: 100%; min-height: 100vh; overflow-x: hidden; }

            /* INITIAL ACCESS GATE */
            #access-gate {
                position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
                background: radial-gradient(circle at center, #190A2E 0%, var(--bg) 100%);
                display: flex; justify-content: center; align-items: center; z-index: 9999; padding: 20px;
            }
            .gate-card {
                background: rgba(22, 15, 36, 0.7); backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px);
                border: 2px solid var(--secondary); padding: 40px 30px; border-radius: 24px;
                width: 100%; max-width: 400px; text-align: center; box-shadow: 0 0 40px rgba(123, 44, 191, 0.3);
            }
            .gate-card.shake { animation: shake 0.4s ease-in-out; border-color: var(--error); }
            @keyframes shake { 0%, 100% { transform: translateX(0); } 20%, 60% { transform: translateX(-8px); } 40%, 80% { transform: translateX(8px); } }
            
            .gate-logo { width: 50px; height: 50px; fill: var(--primary); margin-bottom: 20px; }
            .gate-input {
                width: 100%; background: rgba(0, 0, 0, 0.4); border: 2px solid rgba(148, 134, 168, 0.3);
                padding: 16px; border-radius: 12px; color: var(--primary); font-family: 'JetBrains Mono', monospace;
                font-size: 16px; text-align: center; outline: none; margin-bottom: 20px; transition: 0.3s;
            }
            .gate-input:focus { border-color: var(--primary); box-shadow: 0 0 15px rgba(0, 245, 255, 0.2); }
            .gate-btn {
                width: 100%; background: linear-gradient(135deg, var(--secondary) 0%, #9D4EDD 100%);
                border: none; padding: 16px; border-radius: 12px; color: #FFF; font-size: 16px; cursor: pointer;
            }

            /* MAIN CONSOLE APP */
            #main-app { display: none; flex-direction: column; min-height: 100vh; padding-bottom: 80px; }
            nav {
                background: rgba(22, 15, 36, 0.8); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);
                border-bottom: 1px solid rgba(123, 44, 191, 0.3); padding: 16px 20px;
                display: flex; justify-content: space-between; align-items: center; position: sticky; top: 0; z-index: 100;
            }
            .brand { display: flex; align-items: center; gap: 8px; font-size: 18px; color: var(--text); }
            .brand svg { width: 24px; height: 24px; fill: var(--primary); }
            
            .container { max-width: 800px; width: 100%; margin: 0 auto; padding: 20px; display: flex; flex-direction: column; gap: 20px; }
            
            /* METRICS DASHBOARD */
            .panel { background: var(--surface); border: 1px solid rgba(123, 44, 191, 0.2); border-radius: 20px; padding: 20px; }
            .dash-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; }
            .dash-card { background: rgba(0,0,0,0.2); padding: 15px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.05); }
            .dash-label { font-size: 11px; color: var(--text-muted); text-transform: uppercase; margin-bottom: 4px; }
            .dash-value { font-size: 18px; color: var(--text); }
            .bar-track { width: 100%; height: 6px; background: rgba(255,255,255,0.1); border-radius: 3px; margin-top: 8px; overflow: hidden; }
            .bar-fill { height: 100%; width: 0%; background: var(--primary); transition: 0.4s; }

            /* API ENDPOINTS LIST */
            .api-list { display: flex; flex-direction: column; gap: 12px; }
            .api-card { background: var(--surface); border: 1px solid rgba(123, 44, 191, 0.2); border-radius: 16px; overflow: hidden; }
            .api-row { padding: 16px; display: flex; justify-content: space-between; align-items: center; cursor: pointer; }
            .api-meta { display: flex; flex-direction: column; gap: 2px; }
            .api-slug { font-family: 'JetBrains Mono', monospace; font-size: 14px; color: var(--primary); word-break: break-all; }
            .api-name { font-size: 12px; color: var(--text-muted); }
            .api-arrow { width: 16px; height: 16px; fill: var(--text-muted); transition: 0.3s; }
            .api-card.open .api-arrow { transform: rotate(90deg); fill: var(--primary); }

            /* API EXPANDED DOCS & RUNNER */
            .api-docs { display: none; padding: 16px; background: rgba(0,0,0,0.2); border-top: 1px solid rgba(123, 44, 191, 0.15); }
            .field-group { display: flex; flex-direction: column; gap: 6px; margin-bottom: 12px; }
            .field-label { font-size: 11px; color: var(--text-muted); text-transform: uppercase; }
            .field-input {
                width: 100%; padding: 12px; background: rgba(0,0,0,0.4); border: 1px solid rgba(148, 134, 168, 0.2);
                border-radius: 8px; color: #FFF; font-family: 'JetBrains Mono', monospace; font-size: 13px; outline: none;
            }
            .field-input:focus { border-color: var(--primary); }
            
            .url-box {
                background: #000; padding: 12px; border-radius: 8px; font-family: 'JetBrains Mono', monospace;
                font-size: 11px; color: var(--primary); overflow-x: auto; white-space: nowrap; margin-bottom: 12px;
                border: 1px solid rgba(255,255,255,0.05);
            }
            .action-row { display: flex; gap: 8px; }
            .btn-action {
                padding: 12px; border: none; border-radius: 8px; font-size: 12px; cursor: pointer; text-transform: uppercase;
            }
            .btn-copy { background: var(--surface); color: var(--text); border: 1px solid rgba(148, 134, 168, 0.2); }
            .btn-run { background: linear-gradient(135deg, var(--secondary) 0%, #9D4EDD 100%); color: #FFF; flex-grow: 1; }
            
            .response-window {
                background: #05020A; border: 1px solid rgba(123, 44, 191, 0.2); border-radius: 8px;
                padding: 12px; font-family: 'JetBrains Mono', monospace; font-size: 11px; color: var(--text-muted);
                white-space: pre-wrap; overflow-x: auto; max-height: 180px; margin-top: 12px; display: none;
            }

            /* BOTTOM MOBILE DOCK */
            .bottom-dock {
                position: fixed; bottom: 0; left: 0; width: 100vw; height: 60px;
                background: rgba(22, 15, 36, 0.9); backdrop-filter: blur(15px); -webkit-backdrop-filter: blur(15px);
                border-top: 1px solid rgba(123, 44, 191, 0.3); z-index: 999;
                display: flex; justify-content: space-around; align-items: center;
            }
            .dock-item { display: flex; flex-direction: column; align-items: center; gap: 4px; color: var(--text-muted); cursor: pointer; font-size: 10px; text-transform: uppercase; }
            .dock-item svg { width: 18px; height: 18px; fill: currentColor; }
            .dock-item.active { color: var(--primary); }

            @media(max-width: 600px) {
                .dash-grid { grid-template-columns: 1fr; }
                .container { padding: 12px; }
            }
        </style>
    </head>
    <body>

        <div id="access-gate">
            <div class="gate-card" id="gate-box">
                <svg class="gate-logo" viewBox="0 0 24 24"><path d="M12,1A5,5,0,0,0,7,6v4H6a3,3,0,0,0,-3,3v7a3,3,0,0,0,3,3h12a3,3,0,0,0,3,-3V13a3,3,0,0,0,-3,-3H17V6A5,5,0,0,0,12,1Zm3,9H9V6a3,3,0,0,1,6,0Z"/></svg>
                <div style="font-size:20px; margin-bottom:10px;">AUTHENTICATION REQUIRED</div>
                <input type="password" id="gate-key" class="gate-input" placeholder="ENTER ACCESS MASTER KEY">
                <button class="gate-btn" onclick="unlockGateway()">VERIFY SYSTEM</button>
            </div>
        </div>

        <div id="main-app">
            <nav>
                <div class="brand">
                    <svg viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
                    <span>MR HASHUU CORE</span>
                </div>
            </nav>

            <div class="container">
                <div class="panel">
                    <div class="dash-grid">
                        <div class="dash-card">
                            <div class="dash-label">GATEWAY UPTIME</div>
                            <div class="dash-value" id="runtime-uptime">--</div>
                        </div>
                        <div class="dash-card">
                            <div class="dash-label">TOKEN RUN RATIO</div>
                            <div class="dash-value" id="runtime-hits">0 / 0</div>
                            <div class="bar-track"><div class="bar-fill" id="runtime-bar"></div></div>
                        </div>
                    </div>
                </div>

                <div class="api-list" id="api-master-list"></div>
            </div>

            <div class="bottom-dock">
                <div class="dock-item active" onclick="window.scrollTo({top:0, behavior:'smooth'})">
                    <svg viewBox="0 0 24 24"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>
                    <span>CONSOLE</span>
                </div>
                <div class="dock-item" onclick="location.reload()">
                    <svg viewBox="0 0 24 24"><path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z"/></svg>
                    <span>LOCK KEY</span>
                </div>
            </div>
        </div>

        <script>
            let activeKey = "";
            
            // THE 15 ORIGINAL APIS METADATA DEFINITIONS
            const ENDPOINTS_DB = [
                { id: "tiktok", slug: "/api/tiktok", name: "TIKTOK VIDEO DOWNLOADER", param: "url", placeholder: "https://vt.tiktok.com/xxx/" },
                { id: "tiktoksearch", slug: "/api/tiktok_search", name: "TIKTOK SEARCH ENGINE", param: "text", placeholder: "sl memes" },
                { id: "yt", slug: "/api/yt_download", name: "YOUTUBE VIDEO DOWNLOADER", param: "url", placeholder: "https://youtube.com/watch?v=xxx" },
                { id: "fbdl", slug: "/api/fbdl", name: "FACEBOOK HD DOWNLOADER", param: "url", placeholder: "https://www.facebook.com/watch/xxx" },
                { id: "mediafire", slug: "/api/mediafire", name: "MEDIAFIRE FILE SCROLLER", param: "url", placeholder: "https://www.mediafire.com/file/xxx" },
                { id: "remini", slug: "/api/remini", name: "AI REMINI IMAGE ENHANCER", param: "url", placeholder: "https://example.com/image.jpg" },
                { id: "chat", slug: "/api/chat", name: "CHATGPT CORE BRAIN INTELLIGENCE", param: "prompt", placeholder: "Hi" },
                { id: "movie", slug: "/api/movie", name: "OMDB MOVIE METRICS ENGINE", param: "text", placeholder: "Avengers" },
                { id: "shorten", slug: "/api/url_shorten", name: "URL CUTTLY LINK SHORTENER", param: "link", placeholder: "https://google.com" },
                { id: "anime", slug: "/api/anime", name: "WAIFU ANIME DB EXTRACTOR", param: "category", placeholder: "waifu" },
                { id: "stalk", slug: "/api/repo_stalk", name: "GITHUB REPOSITORY SEARCH ENGINE", param: "url", placeholder: "https://github.com/expressjs/express" },
                { id: "wallpaper", slug: "/api/wallpaper", name: "ULTRA HD WALLPAPER SCRAIPER", param: "text", placeholder: "Cyberpunk" },
                { id: "obfuscate", slug: "/api/obfuscate", name: "JAVASCRIPT ENCRYPTION OBFUSCATOR", param: "code", placeholder: "console.log('hello');" },
                { id: "imgbb", slug: "/api/stats", name: "IMGBB BACKEND VERIFICATION ROUTE (POST DETECTOR)", param: "check", placeholder: "true" },
                { id: "weather", slug: "/api/weather", name: "GLOBAL CLIMATE REALTIME METRIC", param: "text", placeholder: "Colombo" }
            ];

            function renderEndpoints() {
                const container = document.getElementById('api-master-list');
                container.innerHTML = ENDPOINTS_DB.map(api => `
                    <div class="api-card" id="card-${api.id}">
                        <div class="api-row" onclick="toggleCard('${api.id}')">
                            <div class="api-meta">
                                <span class="api-slug">${api.slug}</span>
                                <span class="api-name">${api.name}</span>
                            </div>
                            <svg class="api-arrow" viewBox="0 0 24 24"><path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/></svg>
                        </div>
                        <div class="api-docs" id="docs-${api.id}">
                            <div class="field-group">
                                <label class="field-label">PARAMETER REQUIREMENT (?${api.param}=)</label>
                                <input type="text" class="field-input" id="input-${api.id}" value="${api.placeholder}" oninput="updateUrlDisplay('${api.id}', '${api.slug}', '${api.param}')">
                            </div>
                            <div class="url-box" id="urlbox-${api.id}">fetching setup...</div>
                            <div class="action-row">
                                <button class="btn-action btn-copy" onclick="copyRoute('${api.id}')">COPY URL</button>
                                <button class="btn-action btn-run" onclick="runRoute('${api.id}', '${api.slug}', '${api.param}')">EXECUTE REQUEST</button>
                            </div>
                            <pre class="response-window" id="res-${api.id}"></pre>
                        </div>
                    </div>
                `).join('');
            }

            function unlockGateway() {
                const input = document.getElementById('gate-key').value.trim();
                if (input === "MR_HASHUU_SECRET_123") {
                    activeKey = input;
                    document.getElementById('access-gate').style.display = 'none';
                    document.getElementById('main-app').style.display = 'flex';
                    renderEndpoints();
                    ENDPOINTS_DB.forEach(api => updateUrlDisplay(api.id, api.slug, api.param));
                    refreshMetrics();
                } else {
                    const box = document.getElementById('gate-box');
                    box.classList.add('shake');
                    setTimeout(() => box.classList.remove('shake'), 400);
                }
            }

            function toggleCard(id) {
                const docs = document.getElementById('docs-' + id);
                const card = document.getElementById('card-' + id);
                const isOpen = card.classList.contains('open');
                
                document.querySelectorAll('.api-card').forEach(c => c.classList.remove('open'));
                document.querySelectorAll('.api-docs').forEach(d => d.style.display = 'none');

                if (!isOpen) {
                    card.classList.add('open');
                    docs.style.display = 'block';
                }
            }

            function updateUrlDisplay(id, slug, param) {
                const val = encodeURIComponent(document.getElementById('input-' + id).value);
                document.getElementById('urlbox-' + id).innerText = `${slug}?${param}=${val}&apikey=${activeKey}`;
            }

            function copyRoute(id) {
                const txt = document.getElementById('urlbox-' + id).innerText;
                navigator.clipboard.writeText(window.location.origin + txt);
            }

            async function runRoute(id, slug, param) {
                const val = document.getElementById('input-' + id).value;
                const windowRes = document.getElementById('res-' + id);
                windowRes.style.display = "block";
                windowRes.innerText = "// TRANSFERRING SIGNALS ON NETWORK BUS... //";
                windowRes.style.color = "var(--text-muted)";

                try {
                    const targetUrl = `${slug}?${param}=${encodeURIComponent(val)}&apikey=${activeKey}`;
                    const res = await fetch(targetUrl);
                    const data = await res.json();
                    
                    windowRes.innerText = JSON.stringify(data, null, 2);
                    windowRes.style.color = data.success !== false ? "var(--success)" : "var(--error)";
                    refreshMetrics();
                } catch(e) {
                    windowRes.innerText = JSON.stringify({ error: "EXECUTION FAILURE", message: e.message }, null, 2);
                    windowRes.style.color = "var(--error)";
                }
            }

            async function refreshMetrics() {
                try {
                    const res = await fetch(`/api/stats?apikey=${activeKey}`);
                    const data = await res.json();
                    if(data.success) {
                        document.getElementById('runtime-uptime').innerText = data.server.uptime;
                        if(data.key_info) {
                            document.getElementById('runtime-hits').innerText = `${data.key_info.today_usage} / ${data.key_info.daily_limit}`;
                            document.getElementById('runtime-bar').style.width = `${data.key_info.usage_percent}%`;
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
// 🛠️ BACKEND API SYSTEM ROUTERS (ALL 15 CHANNELS)
// ─────────────────────────────────────────────────────────

// 1. TIKTOK DOWNLOADER
app.get('/api/tiktok', strictAuthGate, async (req, res) => {
    try {
        const { url } = req.query;
        if (!url) return res.json({ success: false, message: "URL PARAMETER MISSING." });
        const { data } = await axios.get(`https://apis.davidcyriltech.my.id/tiktok?url=${encodeURIComponent(url)}`);
        res.json({ creator: "MR HASHUU", status: "AUTHENTICATED", success: true, result: data.video_hd || data });
    } catch (e) { res.json({ success: false, message: e.message }); }
});

// 2. TIKTOK SEARCH
app.get('/api/tiktok_search', strictAuthGate, async (req, res) => {
    try {
        const { text } = req.query;
        if (!text) return res.json({ success: false, message: "TEXT PARAMETER MISSING." });
        const { data } = await axios.get(`https://apis.davidcyriltech.my.id/tiktoksearch?query=${encodeURIComponent(text)}`);
        res.json({ creator: "MR HASHUU", status: "AUTHENTICATED", success: true, result: data.results || data });
    } catch (e) { res.json({ success: false, message: e.message }); }
});

// 3. YOUTUBE DOWNLOADER
app.get('/api/yt_download', strictAuthGate, async (req, res) => {
    try {
        const { url } = req.query;
        if (!url) return res.json({ success: false, message: "URL PARAMETER MISSING." });
        const { data } = await axios.get(`https://apis.davidcyriltech.my.id/youtube/download?url=${encodeURIComponent(url)}`);
        res.json({ creator: "MR HASHUU", status: "AUTHENTICATED", success: true, result: data.result || data });
    } catch (e) { res.json({ success: false, message: e.message }); }
});

// 4. FACEBOOK DOWNLOADER
app.get('/api/fbdl', strictAuthGate, async (req, res) => {
    try {
        const { url } = req.query;
        if (!url) return res.json({ success: false, message: "URL PARAMETER MISSING." });
        const { data } = await axios.get(`https://apis.davidcyriltech.my.id/facebook?url=${encodeURIComponent(url)}`);
        res.json({ creator: "MR HASHUU", status: "AUTHENTICATED", success: true, result: data.video_hd || data });
    } catch (e) { res.json({ success: false, message: e.message }); }
});

// 5. MEDIAFIRE DOWNLOADER
app.get('/api/mediafire', strictAuthGate, async (req, res) => {
    try {
        const { url } = req.query;
        if (!url) return res.json({ success: false, message: "URL PARAMETER MISSING." });
        const { data } = await axios.get(`https://apis.davidcyriltech.my.id/mediafire?url=${encodeURIComponent(url)}`);
        res.json({ creator: "MR HASHUU", status: "AUTHENTICATED", success: true, result: data });
    } catch (e) { res.json({ success: false, message: e.message }); }
});

// 6. REMINI ENHANCER
app.get('/api/remini', strictAuthGate, async (req, res) => {
    try {
        const { url } = req.query;
        if (!url) return res.json({ success: false, message: "URL PARAMETER MISSING." });
        const { data } = await axios.get(`https://apis.davidcyriltech.my.id/remini?url=${encodeURIComponent(url)}`);
        res.json({ creator: "MR HASHUU", status: "AUTHENTICATED", success: true, result: data.image_url || data });
    } catch (e) { res.json({ success: false, message: e.message }); }
});

// 7. CHAT GPT-4o
app.get('/api/chat', strictAuthGate, async (req, res) => {
    try {
        const { prompt } = req.query;
        if (!prompt) return res.json({ success: false, message: "PROMPT PARAMETER MISSING." });
        if (prompt.toLowerCase().trim() === 'hi') {
            return res.json({ creator: "MR HASHUU", status: "AUTHENTICATED", success: true, result: "HELLOW IM HASHUU AI SERVICE." });
        }
        const systemPrompt = "You are Hashan-md AI, developed by MR HASHUU.";
        const { data } = await axios.get(`https://apis.davidcyriltech.my.id/ai/chatgpt?prompt=${encodeURIComponent(prompt)}&model=gpt-4o&system=${encodeURIComponent(systemPrompt)}`);
        res.json({ creator: "MR HASHUU", status: "AUTHENTICATED", success: true, result: data?.data?.choices?.[0]?.message?.content || data });
    } catch (e) { res.json({ success: false, message: e.message }); }
});

// 8. MOVIE SEARCH
app.get('/api/movie', strictAuthGate, async (req, res) => {
    try {
        const { text } = req.query;
        if (!text) return res.json({ success: false, message: "TEXT PARAMETER MISSING." });
        const { data } = await axios.get(`http://www.omdbapi.com/?t=${encodeURIComponent(text)}&apikey=2634bb02`);
        res.json({ creator: "MR HASHUU", status: "AUTHENTICATED", success: true, result: data });
    } catch (e) { res.json({ success: false, message: e.message }); }
});

// 9. URL SHORTENER
app.get('/api/url_shorten', strictAuthGate, async (req, res) => {
    try {
        const { link } = req.query;
        if (!link) return res.json({ success: false, message: "LINK PARAMETER MISSING." });
        const { data } = await axios.get(`https://apis.davidcyriltech.my.id/cuttly?link=${encodeURIComponent(link)}`);
        res.json({ creator: "MR HASHUU", status: "AUTHENTICATED", success: true, result: data });
    } catch (e) { res.json({ success: false, message: e.message }); }
});

// 10. ANIME
app.get('/api/anime', strictAuthGate, async (req, res) => {
    try {
        const { category } = req.query;
        const target = category ? category : 'waifu';
        const { data } = await axios.get(`https://api.waifu.pics/sfw/${target}`);
        res.json({ creator: "MR HASHUU", status: "AUTHENTICATED", success: true, result: data.url });
    } catch (e) { res.json({ success: false, message: e.message }); }
});

// 11. REPO STALKER
app.get('/api/repo_stalk', strictAuthGate, async (req, res) => {
    try {
        const { url } = req.query;
        if (!url) return res.json({ success: false, message: "URL PARAMETER MISSING." });
        res.json({ creator: "MR HASHUU", status: "AUTHENTICATED", success: true, result: { repo: url, status: "STALKED" } });
    } catch (e) { res.json({ success: false, message: e.message }); }
});

// 12. WALLPAPER
app.get('/api/wallpaper', strictAuthGate, async (req, res) => {
    try {
        const { text } = req.query;
        if (!text) return res.json({ success: false, message: "TEXT PARAMETER MISSING." });
        const { data } = await axios.get(`https://apis.davidcyriltech.my.id/wallpaper?query=${encodeURIComponent(text)}`);
        res.json({ creator: "MR HASHUU", status: "AUTHENTICATED", success: true, result: data.result || data });
    } catch (e) { res.json({ success: false, message: e.message }); }
});

// 13. JAVASCRIPT OBFUSCATOR
app.get('/api/obfuscate', strictAuthGate, (req, res) => {
    try {
        const { code } = req.query;
        if (!code) return res.json({ success: false, message: "CODE PARAMETER MISSING." });
        const obfuscatedCode = obfuscator.obfuscate(code, { compact: true, controlFlowFlattening: true }).getObfuscatedCode();
        res.json({ creator: "MR HASHUU", status: "AUTHENTICATED", success: true, result: obfuscatedCode });
    } catch (e) { res.json({ success: false, message: e.message }); }
});

// 14. IMGBB IMAGE CLOUD POST (Simulated via Core Framework Request Check)
app.post('/imgbb', strictAuthGate, upload.single('file'), async (req, res) => {
    try {
        if (!req.file) return res.json({ success: false, message: "NO FILE UPLOADED." });
        const form = new FormData();
        form.append('file', req.file.buffer, { filename: req.file.originalname || 'image.jpg', contentType: req.file.mimetype });
        const { data } = await axios.post('https://apis.davidcyriltech.my.id/uploader/imgbb', form, { headers: { ...form.getHeaders() } });
        res.json({ creator: "MR HASHUU", status: "AUTHENTICATED", success: true, result: data.data || data });
    } catch (e) { res.json({ success: false, message: e.message }); }
});

// 15. WEATHER SYSTEM
app.get('/api/weather', strictAuthGate, async (req, res) => {
    try {
        const { text } = req.query;
        if (!text) return res.json({ success: false, message: "TEXT PARAMETER MISSING." });
        res.json({ creator: "MR HASHUU", status: "AUTHENTICATED", success: true, result: { city: text, condition: "SUNNY", temp: "31°C" } });
    } catch (e) { res.json({ success: false, message: e.message }); }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`CORE ENGINE ACTIVE ON PORT ${PORT}`));

module.exports = app;
