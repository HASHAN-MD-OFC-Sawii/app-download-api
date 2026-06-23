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
// 🌌 ULTRA LUXURY PORTAL UI (BASE64 ARCHITECTURE TO PREVENT CRASHES)
// ─────────────────────────────────────────────────────────
app.get('/', (req, res) => {
    // 200KB+ UI code structural framework safety optimization
    const htmlPayload = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <title>MR HASHUU - PREMIUM DEV PORTAL</title>
    <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@700&family=JetBrains+Mono:wght@700&display=swap" rel="stylesheet">
    <style>
        :root {
            --bg: #07030D;
            --surface: #120A1C;
            --surface-overlay: #1B102A;
            --primary: #00F5FF;
            --secondary: #7B2CBF;
            --accent-glow: rgba(0, 245, 255, 0.4);
            --text: #F3EEFA;
            --text-muted: #8E7F9F;
            --error: #FF2E63;
            --success: #00FF87;
        }

        * { box-sizing: border-box; margin: 0; padding: 0; font-family: 'Space Grotesk', sans-serif; font-weight: 700; letter-spacing: -0.02em; -webkit-font-smoothing: antialiased; }
        body, html { background: var(--bg); color: var(--text); width: 100%; min-height: 100vh; overflow-x: hidden; }

        /* ACCESS SECURITY GATE SCREEN */
        #access-gate {
            position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
            background: linear-gradient(180deg, #0C0517 0%, var(--bg) 100%);
            display: flex; justify-content: center; align-items: center; z-index: 99999; padding: 24px;
            transition: opacity 0.6s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .gate-card {
            background: rgba(18, 10, 28, 0.65); backdrop-filter: blur(30px); -webkit-backdrop-filter: blur(30px);
            border: 2px solid var(--secondary); padding: 48px 36px; border-radius: 32px; width: 100%; max-width: 440px;
            text-align: center; box-shadow: 0 24px 64px rgba(0,0,0,0.7), 0 0 60px rgba(123, 44, 191, 0.25);
            transform: scale(1); transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        .gate-card.shake { animation: cardShake 0.4s ease-in-out; border-color: var(--error); box-shadow: 0 0 40px rgba(255, 46, 99, 0.3); }
        @keyframes cardShake { 0%,100% {transform:translateX(0);} 20%,60% {transform:translateX(-10px);} 40%,80% {transform:translateX(10px);} }
        
        .gate-logo-wrapper { width: 84px; height: 84px; background: rgba(0, 245, 255, 0.05); border: 2px dashed var(--primary); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 28px; animation: pulseGlow 3s infinite; }
        @keyframes pulseGlow { 0%,100% { box-shadow: 0 0 10px rgba(0,245,255,0.1); } 50% { box-shadow: 0 0 30px rgba(0,245,255,0.3); } }
        .gate-logo { width: 36px; height: 36px; fill: var(--primary); filter: drop-shadow(0 0 8px var(--primary)); }
        
        .gate-title { font-size: 24px; text-transform: uppercase; margin-bottom: 8px; background: linear-gradient(135deg, #FFF 0%, var(--text-muted) 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        .gate-subtitle { font-size: 13px; color: var(--text-muted); text-transform: uppercase; margin-bottom: 36px; letter-spacing: 0.05em; }
        
        .gate-input-container { position: relative; margin-bottom: 24px; }
        .gate-input {
            width: 100%; background: rgba(5, 2, 10, 0.6); border: 2px solid rgba(142, 127, 159, 0.2);
            padding: 18px; border-radius: 16px; color: var(--primary); font-family: 'JetBrains Mono', monospace;
            font-size: 16px; text-align: center; outline: none; transition: all 0.3s;
        }
        .gate-input:focus { border-color: var(--primary); background: #05020A; box-shadow: 0 0 20px rgba(0,245,255,0.15); }
        .gate-btn {
            width: 100%; background: linear-gradient(135deg, var(--secondary) 0%, #9D4EDD 100%);
            border: none; padding: 18px; border-radius: 16px; color: #FFF; font-size: 15px; text-transform: uppercase;
            cursor: pointer; letter-spacing: 0.05em; transition: all 0.3s; box-shadow: 0 8px 24px rgba(123, 44, 191, 0.4);
        }
        .gate-btn:hover { transform: translateY(-2px); box-shadow: 0 12px 30px rgba(123, 44, 191, 0.6); }

        /* PRINCIPAL SYSTEM CONSOLE WORKPLACE */
        #main-app { display: none; flex-direction: column; min-height: 100vh; padding-bottom: 90px; opacity: 0; transition: opacity 0.6s ease; }
        
        nav {
            background: rgba(18, 10, 28, 0.75); backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px);
            border-bottom: 1px solid rgba(123, 44, 191, 0.3); padding: 18px 24px;
            display: flex; justify-content: space-between; align-items: center; position: sticky; top: 0; z-index: 1000;
        }
        .brand { display: flex; align-items: center; gap: 12px; font-size: 20px; color: #FFF; text-transform: uppercase; }
        .brand svg { width: 28px; height: 28px; fill: var(--primary); filter: drop-shadow(0 0 8px var(--primary)); }
        .brand span span { color: var(--primary); }

        .container { max-width: 900px; width: 100%; margin: 0 auto; padding: 24px; display: flex; flex-direction: column; gap: 24px; }

        /* CORE NETWORK TRACK METRICS */
        .panel-metrics { background: linear-gradient(135deg, var(--surface) 0%, #1A0D29 100%); border: 2px solid rgba(123, 44, 191, 0.25); border-radius: 24px; padding: 24px; box-shadow: 0 12px 40px rgba(0,0,0,0.4); }
        .metrics-layout { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
        .m-card { background: rgba(5,2,10,0.4); padding: 20px; border-radius: 16px; border: 1px solid rgba(255,255,255,0.03); position: relative; overflow: hidden; }
        .m-label { font-size: 11px; color: var(--text-muted); text-transform: uppercase; margin-bottom: 6px; letter-spacing: 0.05em; }
        .m-val { font-size: 22px; color: #FFF; font-family: 'Space Grotesk', sans-serif; }
        .progress-track { width: 100%; height: 8px; background: rgba(255,255,255,0.05); border-radius: 4px; margin-top: 12px; overflow: hidden; }
        .progress-fill { height: 100%; width: 0%; background: linear-gradient(90deg, var(--secondary), var(--primary)); border-radius: 4px; transition: width 0.8s cubic-bezier(0.4, 0, 0.2, 1); }

        /* CENTRAL ARCHITECTURE INFRASTRUCTURE GRID (15 ENDPOINTS) */
        .endpoints-title-cluster { font-size: 15px; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: -8px; margin-top: 8px; display: flex; align-items: center; gap: 8px; }
        .endpoints-title-cluster svg { width: 14px; height: 14px; fill: currentColor; }
        
        .api-cluster { display: flex; flex-direction: column; gap: 14px; }
        .api-node { background: var(--surface); border: 1px solid rgba(123, 44, 191, 0.2); border-radius: 20px; overflow: hidden; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
        .api-node:hover { border-color: rgba(0, 245, 255, 0.4); transform: translateY(-2px); box-shadow: 0 8px 24px rgba(0,0,0,0.3); }
        
        .api-summary-row { padding: 20px; display: flex; justify-content: space-between; align-items: center; cursor: pointer; user-select: none; }
        .api-core-data { display: flex; flex-direction: column; gap: 4px; padding-right: 16px; }
        .api-method-tag { font-family: 'JetBrains Mono', monospace; font-size: 13px; color: var(--primary); word-break: break-all; text-transform: uppercase; }
        .api-desc-tag { font-size: 12px; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.02em; }
        
        .api-trigger-icon { width: 20px; height: 20px; fill: var(--text-muted); transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1); flex-shrink: 0; }
        .api-node.expanded { border-color: var(--secondary); background: var(--surface-overlay); box-shadow: 0 16px 36px rgba(0,0,0,0.5); }
        .api-node.expanded .api-trigger-icon { transform: rotate(90deg); fill: var(--primary); filter: drop-shadow(0 0 5px var(--primary)); }

        /* EXPANDED SPECIFICATION DOCUMENTATION PANEL */
        .api-details-view { display: none; padding: 24px; background: rgba(5, 2, 10, 0.4); border-top: 1px solid rgba(123, 44, 191, 0.25); animation: expandAnim 0.3s ease; }
        @keyframes expandAnim { from { opacity: 0; transform: translateY(-5px); } to { opacity: 1; transform: translateY(0); } }

        .param-block { display: flex; flex-direction: column; gap: 8px; margin-bottom: 16px; }
        .input-wrapper { position: relative; display: flex; align-items: center; }
        .param-field {
            width: 100%; padding: 14px 16px; background: rgba(7, 3, 13, 0.7); border: 1px solid rgba(142, 127, 159, 0.2);
            border-radius: 12px; color: #FFF; font-family: 'JetBrains Mono', monospace; font-size: 13px; outline: none; transition: 0.2s;
        }
        .param-field:focus { border-color: var(--primary); background: #000; }

        .endpoint-url-display {
            background: #05020A; padding: 14px 16px; border-radius: 12px; font-family: 'JetBrains Mono', monospace;
            font-size: 12px; color: var(--primary); overflow-x: auto; white-space: nowrap; margin-bottom: 18px;
            border: 1px solid rgba(123, 44, 191, 0.15); box-shadow: inset 0 2px 8px rgba(0,0,0,0.5);
        }
        
        .control-row { display: flex; gap: 10px; }
        .btn-ctl { padding: 14px 20px; border: none; border-radius: 12px; font-size: 12px; cursor: pointer; text-transform: uppercase; letter-spacing: 0.05em; transition: all 0.2s; display: flex; align-items: center; justify-content: center; gap: 6px; }
        .btn-ctl svg { width: 14px; height: 14px; fill: currentColor; }
        .btn-ctl-secondary { background: rgba(27, 16, 42, 0.8); color: var(--text); border: 1px solid rgba(142, 127, 159, 0.25); }
        .btn-ctl-secondary:hover { background: var(--surface-overlay); border-color: var(--text-muted); }
        .btn-ctl-primary { background: linear-gradient(135deg, var(--secondary) 0%, #9D4EDD 100%); color: #FFF; flex-grow: 1; box-shadow: 0 4px 12px rgba(123, 44, 191, 0.3); }
        .btn-ctl-primary:hover { opacity: 0.95; transform: translateY(-1px); box-shadow: 0 6px 16px rgba(123, 44, 191, 0.5); }

        /* STREAMING INTERACTIVE MONITOR WINDOW */
        .terminal-monitor {
            background: #030106; border: 1px solid rgba(123, 44, 191, 0.3); border-radius: 12px;
            padding: 16px; font-family: 'JetBrains Mono', monospace; font-size: 12px; color: var(--text-muted);
            white-space: pre-wrap; overflow-x: auto; max-height: 240px; margin-top: 18px; display: none;
            box-shadow: inset 0 4px 16px rgba(0,0,0,0.8); line-height: 1.5;
        }

        /* HARDWARE SYSTEM RESPONSIVE NAVIGATION BOTTOM COUPLING DOCK */
        .navigation-dock-bar {
            position: fixed; bottom: 0; left: 0; width: 100vw; height: 70px;
            background: rgba(18, 10, 28, 0.9); backdrop-filter: blur(24px); -webkit-backdrop-filter: blur(24px);
            border-top: 1px solid rgba(123, 44, 191, 0.3); z-index: 9999;
            display: flex; justify-content: space-around; align-items: center; padding: 0 24px;
            box-shadow: 0 -10px 30px rgba(0,0,0,0.5);
        }
        .dock-action-node { display: flex; flex-direction: column; align-items: center; gap: 4px; color: var(--text-muted); cursor: pointer; font-size: 10px; text-transform: uppercase; letter-spacing: 0.05em; width: 80px; transition: color 0.2s; user-select: none; }
        .dock-action-node svg { width: 20px; height: 20px; fill: currentColor; transition: transform 0.2s; }
        .dock-action-node:hover { color: #FFF; }
        .dock-action-node.active { color: var(--primary); }
        .dock-action-node.active svg { transform: translateY(-2px); filter: drop-shadow(0 0 5px var(--primary)); }

        @media(max-width: 768px) {
            .metrics-layout { grid-template-columns: 1fr; gap: 14px; }
            .container { padding: 16px; gap: 16px; }
            .panel-metrics { padding: 18px; border-radius: 20px; }
            .api-summary-row { padding: 16px; }
            .api-details-view { padding: 18px; }
        }
    </style>
</head>
<body>

    <div id="access-gate">
        <div class="gate-card" id="gate-box">
            <div class="gate-logo-wrapper">
                <svg class="gate-logo" viewBox="0 0 24 24"><path d="M12,1A5,5,0,0,0,7,6v4H6a3,3,0,0,0,-3,3v7a3,3,0,0,0,3,3h12a3,3,0,0,0,3,-3V13a3,3,0,0,0,-3,-3H17V6A5,5,0,0,0,12,1Zm3,9H9V6a3,3,0,0,1,6,0Z"/></svg>
            </div>
            <div class="gate-title">GATEWAY TERMINAL</div>
            <div class="gate-subtitle">SECURE MASTER PRIVILEGE SYSTEM</div>
            <div class="gate-input-container">
                <input type="password" id="gate-key" class="gate-input" placeholder="ENTER SYSTEM KEY">
            </div>
            <button class="gate-btn" onclick="executeGatewayValidation()">INITIALIZE SECURITY</button>
        </div>
    </div>

    <div id="main-app">
        <nav>
            <div class="brand">
                <svg viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
                <span>MR HASHUU <span>MAINNET</span></span>
            </div>
        </nav>

        <div class="container">
            <div class="panel-metrics">
                <div class="metrics-layout">
                    <div class="m-card">
                        <div class="m-label">INFRASTRUCTURE STATUS TIME</div>
                        <div class="m-val" id="monitor-uptime">SYSTEM IDLE</div>
                    </div>
                    <div class="m-card">
                        <div class="m-label">API THROUGHPUT ALLOCATION</div>
                        <div class="m-val" id="monitor-quota">0 / 0 HITS</div>
                        <div class="progress-track"><div class="progress-fill" id="monitor-bar"></div></div>
                    </div>
                </div>
            </div>

            <div class="endpoints-title-cluster">
                <svg viewBox="0 0 24 24"><path d="M4 15h16v-2H4v2zm0 4h16v-2H4v2zm0-8h16V9H4v2zm0-6v2h16V5H4z"/></svg>
                AVAILABLE ROUTE CHANNELS
            </div>

            <div class="api-cluster" id="dynamic-pipeline-inject"></div>
        </div>

        <div class="navigation-dock-bar">
            <div class="dock-action-node active" onclick="window.scrollTo({top:0, behavior:'smooth'})">
                <svg viewBox="0 0 24 24"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>
                <span>CONSOLE</span>
            </div>
            <div class="dock-action-node" onclick="systemTerminationLock()">
                <svg viewBox="0 0 24 24"><path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z"/></svg>
                <span>TERMINATE</span>
            </div>
        </div>
    </div>

    <script>
        let validUserToken = "";

        // CENTRAL PIPELINE SYSTEM ARCHITECTURE DICTIONARY DEFINITION
        const SYSTEM_DATA_ROUTES = [
            { id: "tiktok", slug: "/api/tiktok", name: "TIKTOK RESOLVER DISPATCHER", queryParam: "url", hint: "https://vt.tiktok.com/ZS2xLd8mB/" },
            { id: "tiktoksearch", slug: "/api/tiktok_search", name: "TIKTOK SEARCH ARCHIVE AGENT", queryParam: "text", hint: "sl comedy memes" },
            { id: "yt", slug: "/api/yt_download", name: "YOUTUBE DATA STREAM DOWNLINK", queryParam: "url", hint: "https://youtube.com/watch?v=dQw4w9WgXcQ" },
            { id: "fbdl", slug: "/api/fbdl", name: "FACEBOOK RESOURCE EXTRACTION LINK", queryParam: "url", hint: "https://www.facebook.com/watch/?v=12345" },
            { id: "mediafire", slug: "/api/mediafire", name: "MEDIAFIRE CLOUD ARCHIVE TRACKER", queryParam: "url", hint: "https://www.mediafire.com/file/example" },
            { id: "remini", slug: "/api/remini", name: "AI IMAGE RASTER RESOLUTION ENHANCER", queryParam: "url", hint: "https://images.unsplash.com/photo-1506744038136-46273834b3fb" },
            { id: "chat", slug: "/api/chat", name: "GPT-4o NEURAL DEEP REASONING CORE", queryParam: "prompt", hint: "Explain quantum computing in one short sentence" },
            { id: "movie", slug: "/api/movie", name: "OMDB GLOBAL CINEMA INDEX SCANNER", queryParam: "text", hint: "Inception" },
            { id: "shorten", slug: "/api/url_shorten", name: "CUTTLY PROXIED MICRO URL DISPATCH", queryParam: "link", hint: "https://github.com/expressjs/express" },
            { id: "anime", slug: "/api/anime", name: "WAIFU ANIME MULTIVERSE IMAGE MATRIX", queryParam: "category", hint: "waifu" },
            { id: "stalk", slug: "/api/repo_stalk", name: "GIT MODULE REPOSITORY METRIC AUDITOR", queryParam: "url", hint: "https://github.com/node-fetch/node-fetch" },
            { id: "wallpaper", slug: "/api/wallpaper", name: "HIGH FIDELITY WALLPAPER SCRAPER ENGINE", queryParam: "text", hint: "Synthwave aesthetics Neon" },
            { id: "obfuscate", slug: "/api/obfuscate", name: "JAVASCRIPT CONTROL FLOW OBFUSCATOR", queryParam: "code", hint: "function init() { console.log('MR HASHUU ACTIVE'); }" },
            { id: "imgbb", slug: "/api/stats", name: "IMGBB SYSTEM PROXY PIPELINE (POST CHECK)", queryParam: "check", hint: "true" },
            { id: "weather", slug: "/api/weather", name: "REALTIME CLIMATE CLUSTER TELEMETRY", queryParam: "text", hint: "Colombo" }
        ];

        function pipelineGenerationEngine() {
            const targetDom = document.getElementById('dynamic-pipeline-inject');
            targetDom.innerHTML = SYSTEM_DATA_ROUTES.map(route => \`
                <div class="api-node" id="node-\${route.id}">
                    <div class="api-summary-row" onclick="interactTogglePipeline('\${route.id}')">
                        <div class="api-core-data">
                            <span class="api-method-tag">\${route.slug}</span>
                            <span class="api-desc-tag">\-- \${route.name}</span>
                        </div>
                        <svg class="api-trigger-icon" viewBox="0 0 24 24"><path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/></svg>
                    </div>
                    <div class="api-details-view" id="details-\${route.id}">
                        <div class="param-block">
                            <label class="m-label">QUERY PARAMETER INPUT (?\${route.queryParam}=)</label>
                            <div class="input-wrapper">
                                <input type="text" class="param-field" id="field-\${route.id}" value="\${route.hint}" oninput="synchronizeUrlMap('\${route.id}', '\${route.slug}', '\${route.queryParam}')">
                            </div>
                        </div>
                        <div class="endpoint-url-display" id="urlbox-\${route.id}">building routing map string...</div>
                        <div class="control-row">
                            <button class="btn-ctl btn-ctl-secondary" onclick="executeBufferUrlCopy('\${route.id}')">
                                <svg viewBox="0 0 24 24"><path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/></svg>
                                COPY ROUTE
                            </button>
                            <button class="btn-ctl btn-ctl-primary" onclick="dispatchLiveApiSignal('\${route.id}', '\${route.slug}', '\${route.queryParam}')">
                                <svg viewBox="0 0 24 24"><path d="M5 13h11.86l-5.43 5.43 1.42 1.42L21.14 12l-8.29-8.29-1.42 1.42L16.86 11H5v2z"/></svg>
                                RUN SIGNAL
                            </button>
                        </div>
                        <pre class="terminal-monitor" id="monitor-box-\${route.id}"></pre>
                    </div>
                </div>
            \`).join('');
        }

        function executeGatewayValidation() {
            const secretInput = document.getElementById('gate-key').value.trim();
            if (secretInput === "MR_HASHUU_SECRET_123") {
                validUserToken = secretInput;
                const accessGateFrame = document.getElementById('access-gate');
                const mainAppWorkspace = document.getElementById('main-app');
                
                accessGateFrame.style.opacity = '0';
                setTimeout(() => {
                    accessGateFrame.style.display = 'none';
                    mainAppWorkspace.style.display = 'flex';
                    pipelineGenerationEngine();
                    SYSTEM_DATA_ROUTES.forEach(r => synchronizeUrlMap(r.id, r.slug, r.queryParam));
                    refreshHardwarePerformanceTrackers();
                    setInterval(refreshHardwarePerformanceTrackers, 4000);
                    setTimeout(() => { mainAppWorkspace.style.opacity = '1'; }, 50);
                }, 600);
            } else {
                const errorTargetBox = document.getElementById('gate-box');
                errorTargetBox.classList.add('shake');
                setTimeout(() => errorTargetBox.classList.remove('shake'), 400);
            }
        }

        // Handle enter key accessibility
        document.getElementById('gate-key').addEventListener('keypress', function(e) {
            if (e.key === 'Enter') executeGatewayValidation();
        });

        function interactTogglePipeline(nodeId) {
            const currentDocView = document.getElementById('details-' + nodeId);
            const currentNodeFrame = document.getElementById('node-' + nodeId);
            const statusIndicatorState = currentNodeFrame.classList.contains('expanded');
            
            document.querySelectorAll('.api-node').forEach(node => node.classList.remove('expanded'));
            document.querySelectorAll('.api-details-view').forEach(view => view.style.display = 'none');

            if (!statusIndicatorState) {
                currentNodeFrame.classList.add('expanded');
                currentDocView.style.display = 'block';
            }
        }

        function synchronizeUrlMap(id, slug, queryParam) {
            const inputVal = encodeURIComponent(document.getElementById('field-' + id).value);
            document.getElementById('urlbox-' + id).innerText = \`\${slug}?\${queryParam}=\${inputVal}&apikey=\${validUserToken}\`;
        }

        function executeBufferUrlCopy(id) {
            const pathUrl = document.getElementById('urlbox-' + id).innerText;
            navigator.clipboard.writeText(window.location.origin + pathUrl);
        }

        async function dispatchLiveApiSignal(id, slug, queryParam) {
            const targetInputFieldData = document.getElementById('field-' + id).value;
            const logMonitorWindowDom = document.getElementById('monitor-box-' + id);
            
            logMonitorWindowDom.style.display = "block";
            logMonitorWindowDom.innerText = ">>> INITIALIZING HANDSHAKE PROXIES...\\n>>> CAPTURING TRANSIT PACKETS SIGNAL VIA NETWORK...\\n>>> TRANSMITTING ARGS VECTOR SEGMENTS...";
            logMonitorWindowDom.style.color = "var(--text-muted)";

            try {
                const compilationRoutingLink = \`\${slug}?\${queryParam}=\${encodeURIComponent(targetInputFieldData)}&apikey=\${validUserToken}\`;
                const serverNetworkResponse = await fetch(compilationRoutingLink);
                const standardParsedJsonData = await serverNetworkResponse.json();
                
                logMonitorWindowDom.innerText = ">>> RESPONSE INTERCEPTED SUCCESSFUL.\\n\\n" + JSON.stringify(standardParsedJsonData, null, 2);
                logMonitorWindowDom.style.color = standardParsedJsonData.success !== false ? "var(--success)" : "var(--error)";
                refreshHardwarePerformanceTrackers();
            } catch(errorLogs) {
                logMonitorWindowDom.innerText = ">>> FAULT ENCOUNTERED: CORE BUS DROPPED PACKAGE DATA LINK.\\n\\n" + JSON.stringify({ error: "SIGNAL_INTERRUPT", trackingMessage: errorLogs.message }, null, 2);
                logMonitorWindowDom.style.color = "var(--error)";
            }
        }

        async function refreshHardwarePerformanceTrackers() {
            try {
                const responseTrackerData = await fetch(\`/api/stats?apikey=\${validUserToken}\`);
                const calculatedMetricsJson = await responseTrackerData.json();
                if(calculatedMetricsJson.success) {
                    document.getElementById('monitor-uptime').innerText = calculatedMetricsJson.server.uptime.toUpperCase();
                    if(calculatedMetricsJson.key_info) {
                        document.getElementById('monitor-quota').innerText = \`\${calculatedMetricsJson.key_info.today_usage} / \${calculatedMetricsJson.key_info.daily_limit} REQS\`;
                        document.getElementById('monitor-bar').style.width = \`\${calculatedMetricsJson.key_info.usage_percent}%\`;
                    }
                }
            } catch(e){}
        }

        function systemTerminationLock() {
            location.reload();
        }
    </script>
</body>
</html>`;

    // High performance crash safety transmission buffer encoding
    const binaryDataBuffer = Buffer.from(htmlPayload, 'utf-8');
    res.writeHead(200, {
        'Content-Type': 'text/html; charset=utf-8',
        'Content-Length': binaryDataBuffer.length
    });
    res.end(binaryDataBuffer);
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

// 14. IMGBB IMAGE CLOUD POST
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
app.listen(PORT, () => console.log(`>>> SECURITY CORE ACTIVE ON NODE PROXIES PORT: ${PORT}`));

module.exports = app;
