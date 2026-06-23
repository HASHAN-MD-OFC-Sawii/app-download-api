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
// 🐙 REAL GITHUB DATABASE CONFIGURATION (AUTO-SAVE REAL REQUESTS)
// ─────────────────────────────────────────────────────────
const GITHUB_TOKEN = process.env.GITHUB_TOKEN || ""; 
const GIST_ID = process.env.GITHUB_GIST_ID || ""; 

// Initial core state
let globalAnalytics = {
    totalRequests: 0,
    systemUptime: "99.99%",
    lastUpdated: new Date().toISOString(),
    recentRequests: [] // Real time requests history track agutte
};

// Real database load from GitHub Gist on startup
async function loadDatabaseOnStartup() {
    if (!GITHUB_TOKEN || !GIST_ID) {
        console.log("⚠️ GitHub Configuration Missing. Running with local memory database.");
        return;
    }
    try {
        const { data } = await axios.get(`https://api.github.com/gists/${GIST_ID}`, {
            headers: { Authorization: `token ${GITHUB_TOKEN}` }
        });
        if (data.files && data.files["hashu_analytics.json"]) {
            const content = JSON.parse(data.files["hashu_analytics.json"].content);
            globalAnalytics.totalRequests = content.totalRequests || 0;
            globalAnalytics.recentRequests = content.recentRequests || [];
            console.log("🐙 Real GitHub Database Loaded Successfully!");
        }
    } catch (error) {
        console.error("Error loading database on startup:", error.message);
    }
}
loadDatabaseOnStartup();

// Sync Live Analytics with GitHub Gist
async function syncDatabase() {
    if (!GITHUB_TOKEN || !GIST_ID) return;
    try {
        await axios.patch(`https://api.github.com/gists/${GIST_ID}`, {
            files: {
                "hashu_analytics.json": {
                    content: JSON.stringify(globalAnalytics, null, 2)
                }
            }
        }, {
            headers: { Authorization: `token ${GITHUB_TOKEN}` }
        });
    } catch (error) {
        console.error("GitHub Live Sync Error:", error.message);
    }
}

// REAL REQUEST TRACKER MIDDLEWARE
const trackRequest = async (req, res, next) => {
    globalAnalytics.totalRequests++;
    globalAnalytics.lastUpdated = new Date().toISOString();
    
    // Real metadata packet capture
    const requestData = {
        endpoint: req.path,
        method: req.method,
        ip: req.headers['x-forwarded-for'] || req.socket.remoteAddress || "Unknown",
        time: new Date().toLocaleTimeString(),
        keyUsed: req.query.apikey || "Public/None"
    };

    // Store only the last 15 real requests logs to save gist space
    globalAnalytics.recentRequests.unshift(requestData);
    if (globalAnalytics.recentRequests.length > 15) {
        globalAnalytics.recentRequests.pop();
    }

    // Dynamic database updates
    await syncDatabase();
    next();
};

// 🔑 AUTHORIZED PREMIUM API KEYS DATABASE
const PREMIUM_DATABASE = {
    "HASHUU_PRO_KING_99": { owner: "Kasun", plan: "PREMIUM" },
    "MR_HASHUU_SECRET_123": { owner: "MR HASHUU", plan: "PRO" },
    "VIP_DEV_KEY_777": { owner: "Nimal", plan: "PREMIUM" }
};

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
    return premiumLimiter(req, res, next);
};

// Intercept routing layers for explicit data capture
app.use('/api/', trackRequest);
app.use('/xvideo', trackRequest);
app.use('/ytmp4', trackRequest);
app.use('/mediafire', trackRequest);
app.use('/spotify', trackRequest);
app.use('/twitter', trackRequest);
app.use('/song', trackRequest);
app.use('/tiktok', trackRequest);
app.use('/pinterest', trackRequest);
app.use('/apk', trackRequest);
app.use('/facebook', trackRequest);
app.use('/webdl', trackRequest);
app.use('/obfuscate', trackRequest);
app.use('/imgbb', trackRequest);

// ─────────────────────────────────────────────────────────
// 🌌 ULTRA LUXURY MOBILE OPTIMIZED DASHBOARD
// ─────────────────────────────────────────────────────────
app.get('/', (req, res) => {
    // Generate real-time dynamic logs view inside mobile UI
    let logsHtml = globalAnalytics.recentRequests.map(log => `
        <div style="background:rgba(255,255,255,0.02); border:1px solid rgba(255,255,255,0.05); padding:10px; border-radius:8px; margin-bottom:6px; font-size:0.75rem; font-family:monospace;">
            <span style="color:var(--apple-cyan); font-weight:900;">[${log.time}]</span> 
            <span style="color:var(--apple-green); font-weight:900;">${log.method}</span> ${log.endpoint} 
            <br><span style="color:#666;">IP: ${log.ip} | Key: ${log.keyUsed}</span>
        </div>
    `).join('');

    if(globalAnalytics.recentRequests.length === 0) {
        logsHtml = `<div style="text-align:center; padding:20px; color:var(--text-muted); font-size:0.8rem;">No real requests captured yet. System waiting...</div>`;
    }

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
                --apple-black: #06070d;
                --apple-card: #0d0f1a;
                --apple-border: rgba(255, 255, 255, 0.08);
                --apple-cyan: #00F5FF;
                --apple-blue: #7B2CBF;
                --apple-green: #00FF87;
                --text-main: #ffffff;
                --text-muted: #8e92a6;
            }
            
            * { box-sizing: border-box; margin: 0; padding: 0; -webkit-tap-highlight-color: transparent; }
            
            body {
                background-color: var(--apple-black);
                color: var(--text-main);
                font-family: 'Inter', sans-serif;
                min-height: 100vh;
                display: flex;
                justify-content: center;
                align-items: flex-start;
                padding: 20px 0;
                position: relative;
                overflow-x: hidden;
            }

            .ambient-glow {
                position: fixed; top: -10%; left: 50%; transform: translateX(-50%); width: 100vw; height: 50vh;
                background: radial-gradient(circle, rgba(0, 245, 255, 0.12) 0%, rgba(123, 44, 191, 0.06) 50%, transparent 100%);
                z-index: 1; pointer-events: none; filter: blur(70px);
            }

            .vercel-box {
                width: 92%; max-width: 720px;
                background: var(--apple-card);
                border: 1px solid var(--apple-border); border-radius: 20px;
                padding: 25px 15px; z-index: 2; position: relative;
                box-shadow: 0 40px 80px rgba(0, 0, 0, 0.7);
            }

            header { display: flex; justify-content: space-between; align-items: center; padding-bottom: 15px; border-bottom: 1px solid var(--apple-border); }
            header h1 { font-family: 'Space Grotesk', sans-serif; font-size: 1.8rem; font-weight: 900; }
            header h1 span { color: var(--apple-cyan); }

            .status-container {
                display: inline-flex; align-items: center; gap: 6px;
                font-size: 0.7rem; font-weight: 900; color: var(--apple-green); background: rgba(0, 255, 135, 0.08);
                padding: 6px 12px; border-radius: 8px; border: 1px solid rgba(0, 255, 135, 0.2);
            }
            .pulse-dot { width: 8px; height: 8px; background: var(--apple-green); border-radius: 50%; animation: pulse 1.5s infinite; }
            @keyframes pulse { 0%, 100% { opacity: 0.6; } 50% { opacity: 1; } }

            .analytics-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; margin-top: 15px; }
            .stat-card { background: rgba(255, 255, 255, 0.02); border: 1px solid var(--apple-border); border-radius: 12px; padding: 12px 8px; text-align: center; }
            .stat-label { font-size: 0.65rem; font-weight: 900; color: var(--text-muted); text-transform: uppercase; }
            .stat-value { font-size: 1.1rem; font-weight: 900; margin-top: 4px; font-family: 'Space Grotesk', sans-serif; }

            .database-logs-panel {
                margin-top: 20px; background: rgba(0,0,0,0.4); border: 1px solid var(--apple-border);
                border-radius: 14px; padding: 15px;
            }
            .panel-title { font-size: 0.8rem; font-weight: 900; text-transform: uppercase; letter-spacing: 1px; color: var(--text-muted); margin-bottom: 10px; display: flex; justify-content: space-between; }

            .search-container { position: relative; margin-top: 20px; }
            .search-input {
                width: 100%; padding: 16px 20px; background: #07080e;
                border: 1px solid var(--apple-border); border-radius: 12px;
                color: #ffffff; font-size: 0.95rem; font-weight: 800; outline: none;
            }
            .search-input:focus { border-color: var(--apple-cyan); }

            .endpoint-list { margin-top: 15px; display: flex; flex-direction: column; gap: 10px; }
            .api-wrapper { background: rgba(255, 255, 255, 0.01); border: 1px solid var(--apple-border); border-radius: 14px; overflow: hidden; }
            .api-row { padding: 16px; display: flex; justify-content: space-between; align-items: center; cursor: pointer; }
            .endpoint-slug { font-size: 0.95rem; font-weight: 900; font-family: monospace; }
            .endpoint-info { font-size: 0.78rem; color: var(--text-muted); font-weight: 800; margin-top: 3px; }
            
            .api-docs { display: none; padding: 16px; border-top: 1px solid rgba(255, 255, 255, 0.04); background: rgba(0,0,0,0.2); }
            .url-display {
                background: #030408; border: 1px solid var(--apple-border); padding: 12px;
                border-radius: 10px; font-family: monospace; font-size: 0.78rem; color: var(--apple-cyan);
                overflow-x: auto; white-space: nowrap; margin-bottom: 12px;
            }

            .btn-group { display: flex; gap: 8px; }
            .btn-action {
                flex: 1; border: none; font-size: 0.75rem; font-weight: 900; padding: 12px; border-radius: 10px; cursor: pointer; text-transform: uppercase;
            }
            .btn-copy { background: #ffffff; color: #000000; }
            .btn-run { background: linear-gradient(135deg, var(--apple-blue), #531cb3); color: #ffffff; }

            .json-preview {
                background: #030408; border: 1px solid var(--apple-border); border-radius: 10px;
                padding: 12px; font-family: monospace; font-size: 0.75rem; color: #4e536b;
                white-space: pre-wrap; overflow-x: auto; max-height: 180px; margin-top: 12px;
            }

            .method-get { color: var(--apple-cyan); font-weight: 900; margin-right: 5px; }

            @media (max-width: 600px) {
                .analytics-grid { grid-template-columns: 1fr; gap: 8px; }
                .stat-card { display: flex; justify-content: space-between; align-items: center; padding: 12px 15px; }
                .stat-value { margin-top: 0; font-size: 1rem; }
                header h1 { font-size: 1.5rem; }
                .endpoint-slug { font-size: 0.88rem; }
                .btn-group { flex-direction: column; gap: 8px; }
            }
        </style>
    </head>
    <body>
        <div class="ambient-glow"></div>

        <div class="vercel-box">
            <header>
                <h1>HASHU <span>APIS</span></h1>
                <div class="status-container"><div class="pulse-dot"></div><span>LIVE SERVER</span></div>
            </header>

            <div class="analytics-grid">
                <div class="stat-card"><div class="stat-label">Real Requests Count</div><div class="stat-value" id="count-val">${globalAnalytics.totalRequests}</div></div>
                <div class="stat-card"><div class="stat-label">SLA Latency</div><div class="stat-value">${globalAnalytics.systemUptime}</div></div>
                <div class="stat-card"><div class="stat-label">Project Owner</div><div class="stat-value" style="color:var(--apple-cyan)">MR HASHUU</div></div>
            </div>

            <div class="database-logs-panel">
                <div class="panel-title">
                    <span>Live Database Traffic Logs (Real Time)</span>
                    <span style="color:var(--apple-cyan); font-size:0.7rem;">Sync: Active</span>
                </div>
                <div style="max-height: 180px; overflow-y: auto;">
                    ${logsHtml}
                </div>
            </div>

            <div class="search-container">
                <input type="text" id="apiSearch" class="search-input" placeholder="Search developer operational endpoints..." onkeyup="filterEndpoints()">
            </div>

            <div class="endpoint-list" id="listWrapper">
                
                <div class="api-wrapper" data-name="movie database omdb cinema film">
                    <div class="api-row" onclick="toggleAccordion(this)">
                        <div><div class="endpoint-slug"><span class="method-get">GET</span>/api/movie</div><div class="endpoint-info">OMDb Cinema & Film Data Information Tracking Engine</div></div>
                    </div>
                    <div class="api-docs">
                        <div class="url-display" id="url-movie">/api/movie?text=Guardians&apikey=MR_HASHUU_SECRET_123</div>
                        <div class="btn-group">
                            <button class="btn-action btn-copy" onclick="copyLink('url-movie')">Copy Route</button>
                            <button class="btn-action btn-run" onclick="runEndpoint('url-movie', 'res-movie', this)">Run Request</button>
                        </div>
                        <pre class="json-preview" id="res-movie">{ "status": "idle" }</pre>
                    </div>
                </div>

                <div class="api-wrapper" data-name="chat ai chatgpt hashan gpt">
                    <div class="api-row" onclick="toggleAccordion(this)">
                        <div><div class="endpoint-slug"><span class="method-get">GET</span>/api/chat</div><div class="endpoint-info">Hashan-md AI / ChatGPT-4o Smart Interface</div></div>
                    </div>
                    <div class="api-docs">
                        <div class="url-display" id="url-chat">/api/chat?prompt=Hi&apikey=MR_HASHUU_SECRET_123</div>
                        <div class="btn-group">
                            <button class="btn-action btn-copy" onclick="copyLink('url-chat')">Copy Route</button>
                            <button class="btn-action btn-run" onclick="runEndpoint('url-chat', 'res-chat', this)">Run Request</button>
                        </div>
                        <pre class="json-preview" id="res-chat">{ "status": "idle" }</pre>
                    </div>
                </div>

                <div class="api-wrapper" data-name="cuttly shorten url link">
                    <div class="api-row" onclick="toggleAccordion(this)">
                        <div><div class="endpoint-slug"><span class="method-get">GET</span>/api/url_shorten</div><div class="endpoint-info">Cuttly Professional Link Shortener Engine</div></div>
                    </div>
                    <div class="api-docs">
                        <div class="url-display" id="url-shorten">/api/url_shorten?link=https://google.com&apikey=MR_HASHUU_SECRET_123</div>
                        <div class="btn-group">
                            <button class="btn-action btn-copy" onclick="copyLink('url-shorten')">Copy Route</button>
                            <button class="btn-action btn-run" onclick="runEndpoint('url-shorten', 'res-shorten', this)">Run Request</button>
                        </div>
                        <pre class="json-preview" id="res-shorten">{ "status": "idle" }</pre>
                    </div>
                </div>

                <div class="api-wrapper" data-name="xvideo adult downloader video clip">
                    <div class="api-row" onclick="toggleAccordion(this)">
                        <div><div class="endpoint-slug"><span class="method-get">GET</span>/xvideo</div><div class="endpoint-info">XVideos Video MP4 Direct CDN Resolver</div></div>
                    </div>
                    <div class="api-docs">
                        <div class="url-display" id="url-xvideo">/xvideo?url=https://www.xvideos.com/&apikey=MR_HASHUU_SECRET_123</div>
                        <div class="btn-group">
                            <button class="btn-action btn-copy" onclick="copyLink('url-xvideo')">Copy Route</button>
                            <button class="btn-action btn-run" onclick="runEndpoint('url-xvideo', 'res-xvideo', this)">Run Request</button>
                        </div>
                        <pre class="json-preview" id="res-xvideo">{ "status": "idle" }</pre>
                    </div>
                </div>

                <div class="api-wrapper" data-name="ytmp4 youtube video downloader hd">
                    <div class="api-row" onclick="toggleAccordion(this)">
                        <div><div class="endpoint-slug"><span class="method-get">GET</span>/ytmp4</div><div class="endpoint-info">YouTube HD Video MP4 High-Speed Extractor</div></div>
                    </div>
                    <div class="api-docs">
                        <div class="url-display" id="url-ytmp4">/ytmp4?url=https://youtube.com/watch?v=MwpMEbgC7DA&apikey=MR_HASHUU_SECRET_123</div>
                        <div class="btn-group">
                            <button class="btn-action btn-copy" onclick="copyLink('url-ytmp4')">Copy Route</button>
                            <button class="btn-action btn-run" onclick="runEndpoint('url-ytmp4', 'res-ytmp4', this)">Run Request</button>
                        </div>
                        <pre class="json-preview" id="res-ytmp4">{ "status": "idle" }</pre>
                    </div>
                </div>

                <div class="api-wrapper" data-name="mediafire downloader direct storage parser">
                    <div class="api-row" onclick="toggleAccordion(this)">
                        <div><div class="endpoint-slug"><span class="method-get">GET</span>/mediafire</div><div class="endpoint-info">Mediafire Direct Link Storage Parser Engine</div></div>
                    </div>
                    <div class="api-docs">
                        <div class="url-display" id="url-mf">/mediafire?url=https://www.mediafire.com/&apikey=MR_HASHUU_SECRET_123</div>
                        <div class="btn-group">
                            <button class="btn-action btn-copy" onclick="copyLink('url-mf')">Copy Route</button>
                            <button class="btn-action btn-run" onclick="runEndpoint('url-mf', 'res-mf', this)">Run Request</button>
                        </div>
                        <pre class="json-preview" id="res-mf">{ "status": "idle" }</pre>
                    </div>
                </div>

                <div class="api-wrapper" data-name="spotify music audio downloader song">
                    <div class="api-row" onclick="toggleAccordion(this)">
                        <div><div class="endpoint-slug"><span class="method-get">GET</span>/spotify</div><div class="endpoint-info">Spotify Premium Lossless Audio Extractor</div></div>
                    </div>
                    <div class="api-docs">
                        <div class="url-display" id="url-sf">/spotify?url=https://open.spotify.com/track/285pBltuF7vW8TeWk8hdRR&apikey=MR_HASHUU_SECRET_123&apikey=MR_HASHUU_SECRET_123</div>
                        <div class="btn-group">
                            <button class="btn-action btn-copy" onclick="copyLink('url-sf')">Copy Route</button>
                            <button class="btn-action btn-run" onclick="runEndpoint('url-sf', 'res-sf', this)">Run Request</button>
                        </div>
                        <pre class="json-preview" id="res-sf">{ "status": "idle" }</pre>
                    </div>
                </div>

                <div class="api-wrapper" data-name="twitter x stream extractor">
                    <div class="api-row" onclick="toggleAccordion(this)">
                        <div><div class="endpoint-slug"><span class="method-get">GET</span>/twitter</div><div class="endpoint-info">Twitter / X Multi-Quality Stream CDN Resolver</div></div>
                    </div>
                    <div class="api-docs">
                        <div class="url-display" id="url-tw">/twitter?url=https://x.com/&apikey=MR_HASHUU_SECRET_123</div>
                        <div class="btn-group">
                            <button class="btn-action btn-copy" onclick="copyLink('url-tw')">Copy Route</button>
                            <button class="btn-action btn-run" onclick="runEndpoint('url-tw', 'res-tw', this)">Run Request</button>
                        </div>
                        <pre class="json-preview" id="res-tw">{ "status": "idle" }</pre>
                    </div>
                </div>

                <div class="api-wrapper" data-name="song youtube play mp3 audio music">
                    <div class="api-row" onclick="toggleAccordion(this)">
                        <div><div class="endpoint-slug"><span class="method-get">GET</span>/song</div><div class="endpoint-info">YouTube High-Fidelity Audio Stream Grabber</div></div>
                    </div>
                    <div class="api-docs">
                        <div class="url-display" id="url-sg">/song?text=faded&apikey=MR_HASHUU_SECRET_123</div>
                        <div class="btn-group">
                            <button class="btn-action btn-copy" onclick="copyLink('url-sg')">Copy Route</button>
                            <button class="btn-action btn-run" onclick="runEndpoint('url-sg', 'res-sg', this)">Run Request</button>
                        </div>
                        <pre class="json-preview" id="res-sg">{ "status": "idle" }</pre>
                    </div>
                </div>

                <div class="api-wrapper" data-name="tiktok video downloader no watermark">
                    <div class="api-row" onclick="toggleAccordion(this)">
                        <div><div class="endpoint-slug"><span class="method-get">GET</span>/tiktok</div><div class="endpoint-info">TikTok Studio Source No-Watermark Downloader</div></div>
                    </div>
                    <div class="api-docs">
                        <div class="url-display" id="url-tk">/tiktok?url=https://vm.tiktok.com/&apikey=MR_HASHUU_SECRET_123</div>
                        <div class="btn-group">
                            <button class="btn-action btn-copy" onclick="copyLink('url-tk')">Copy Route</button>
                            <button class="btn-action btn-run" onclick="runEndpoint('url-tk', 'res-tk', this)">Run Request</button>
                        </div>
                        <pre class="json-preview" id="res-tk">{ "status": "idle" }</pre>
                    </div>
                </div>

                <div class="api-wrapper" data-name="pinterest image search visual hd">
                    <div class="api-row" onclick="toggleAccordion(this)">
                        <div><div class="endpoint-slug"><span class="method-get">GET</span>/pinterest</div><div class="endpoint-info">Pinterest Ultra-HD Media Image Source Finder</div></div>
                    </div>
                    <div class="api-docs">
                        <div class="url-display" id="url-pin">/pinterest?text=cyberpunk&apikey=MR_HASHUU_SECRET_123</div>
                        <div class="btn-group">
                            <button class="btn-action btn-copy" onclick="copyLink('url-pin')">Copy Route</button>
                            <button class="btn-action btn-run" onclick="runEndpoint('url-pin', 'res-pin', this)">Run Request</button>
                        </div>
                        <pre class="json-preview" id="res-pin">{ "status": "idle" }</pre>
                    </div>
                </div>

                <div class="api-wrapper" data-name="apk android package app mirror tool">
                    <div class="api-row" onclick="toggleAccordion(this)">
                        <div><div class="endpoint-slug"><span class="method-get">GET</span>/apk</div><div class="endpoint-info">Android App Core Binary Package Mirror Fetcher</div></div>
                    </div>
                    <div class="api-docs">
                        <div class="url-display" id="url-apk">/apk?text=whatsapp&apikey=MR_HASHUU_SECRET_123</div>
                        <div class="btn-group">
                            <button class="btn-action btn-copy" onclick="copyLink('url-apk')">Copy Route</button>
                            <button class="btn-action btn-run" onclick="runEndpoint('url-apk', 'res-apk', this)">Run Request</button>
                        </div>
                        <pre class="json-preview" id="res-apk">{ "status": "idle" }</pre>
                    </div>
                </div>

                <div class="api-wrapper" data-name="facebook fb video resolver cdn">
                    <div class="api-row" onclick="toggleAccordion(this)">
                        <div><div class="endpoint-slug"><span class="method-get">GET</span>/facebook</div><div class="endpoint-info">Facebook Architecture Video Stream Extractor</div></div>
                    </div>
                    <div class="api-docs">
                        <div class="url-display" id="url-fb">/facebook?url=https://www.facebook.com/&apikey=MR_HASHUU_SECRET_123</div>
                        <div class="btn-group">
                            <button class="btn-action btn-copy" onclick="copyLink('url-fb')">Copy Route</button>
                            <button class="btn-action btn-run" onclick="runEndpoint('url-fb', 'res-fb', this)">Run Request</button>
                        </div>
                        <pre class="json-preview" id="res-fb">{ "status": "idle" }</pre>
                    </div>
                </div>

                <div class="api-wrapper" data-name="webdl website clone html static site page">
                    <div class="api-row" onclick="toggleAccordion(this)">
                        <div><div class="endpoint-slug"><span class="method-get">GET</span>/webdl</div><div class="endpoint-info">Static Production Webpage Structural Pack Cloner</div></div>
                    </div>
                    <div class="api-docs">
                        <div class="url-display" id="url-wdl">/webdl?url=https://example.com&apikey=MR_HASHUU_SECRET_123</div>
                        <div class="btn-group">
                            <button class="btn-action btn-copy" onclick="copyLink('url-wdl')">Copy Route</button>
                            <button class="btn-action btn-run" onclick="runEndpoint('url-wdl', 'res-wdl', this)">Run Request</button>
                        </div>
                        <pre class="json-preview" id="res-wdl">{ "status": "idle" }</pre>
                    </div>
                </div>

                <div class="api-wrapper" data-name="obfuscate javascript security protection code hide">
                    <div class="api-row" onclick="toggleAccordion(this)">
                        <div><div class="endpoint-slug"><span class="method-get">GET</span>/obfuscate</div><div class="endpoint-info">Dynamic Structural JavaScript Anti-Scrape Guardian</div></div>
                    </div>
                    <div class="api-docs">
                        <div class="url-display" id="url-obf">/obfuscate?code=console.log('hashu')&apikey=MR_HASHUU_SECRET_123</div>
                        <div class="btn-group">
                            <button class="btn-action btn-copy" onclick="copyLink('url-obf')">Copy Route</button>
                            <button class="btn-action btn-run" onclick="runEndpoint('url-obf', 'res-obf', this)">Run Request</button>
                        </div>
                        <pre class="json-preview" id="res-obf">{ "status": "idle" }</pre>
                    </div>
                </div>

            </div>
        </div>

        <script>
            function toggleAccordion(element) {
                const parent = element.parentElement;
                const docsSection = parent.querySelector('.api-docs');
                const isOpen = parent.classList.contains('active');
                const allWrappers = document.getElementsByClassName('api-wrapper');
                for (let wrap of allWrappers) {
                    wrap.classList.remove('active');
                    wrap.querySelector('.api-docs').style.display = 'none';
                }
                if (!isOpen) {
                    parent.classList.add('active');
                    docsSection.style.display = 'block';
                }
            }

            function filterEndpoints() {
                const query = document.getElementById('apiSearch').value.toLowerCase().trim();
                const wrappers = document.getElementsByClassName('api-wrapper');
                for (let i = 0; i < wrappers.length; i++) {
                    const tags = wrappers[i].getAttribute('data-name');
                    wrappers[i].style.display = tags.includes(query) ? 'block' : 'none';
                }
            }

            function copyLink(id) {
                const text = window.location.origin + document.getElementById(id).textContent.trim();
                navigator.clipboard.writeText(text);
            }

            async function runEndpoint(urlId, resId, btn) {
                const path = document.getElementById(urlId).textContent.trim();
                btn.innerText = "RUNNING...";
                try {
                    const res = await fetch(window.location.origin + path);
                    const json = await res.json();
                    document.getElementById(resId).textContent = JSON.stringify(json, null, 2);
                    
                    // Trigger interface hot reload to see raw changes instantly
                    setTimeout(() => { window.location.reload(); }, 900);
                } catch (e) {
                    document.getElementById(resId).textContent = JSON.stringify({ error: e.message }, null, 2);
                } finally { btn.innerText = "Run Request"; }
            }
        </script>
    </body>
    </html>
    `);
});

// ─────────────────────────────────────────────────────────
// 🛠️ SECURE ENDPOINT CONTROLLERS
// ─────────────────────────────────────────────────────────

app.get('/api/movie', strictAuthGate, async (req, res) => {
    try {
        const { text } = req.query;
        if (!text) return res.json({ success: false, message: "Movie title parameter (?text=) missing!" });
        const { data } = await axios.get(`http://www.omdbapi.com/?t=${encodeURIComponent(text)}&apikey=2634bb02`);
        if (data.Response === "True") { res.json({ creator: "MR HASHUU", status: "Authenticated", success: true, result: data }); }
        else { res.json({ success: false, message: data.Error || "Movie not found!" }); }
    } catch (e) { res.json({ success: false, message: e.message }); }
});

app.get('/api/chat', strictAuthGate, async (req, res) => {
    try {
        const { prompt } = req.query;
        if (!prompt) return res.json({ success: false, message: "Prompt parameter missing!" });
        const cleanPrompt = prompt.toLowerCase().trim();
        if (cleanPrompt === 'hi') return res.json({ creator: "MR HASHUU", status: "Authenticated", success: true, result: "Hellow Im Hashuu Ai Service" });
        const customSystemPrompt = "You are Hashan-md AI, a brilliant, helpful AI assistant developed and owned by MR HASHUU.";
        const { data } = await axios.get(`https://apis.davidcyriltech.my.id/ai/chatgpt?prompt=${encodeURIComponent(prompt)}&model=gpt-4o&system=${encodeURIComponent(customSystemPrompt)}`);
        res.json({ creator: "MR HASHUU", status: "Authenticated", success: true, result: data?.data?.choices?.[0]?.message?.content || "AI Break." });
    } catch (e) { res.json({ success: false, message: e.message }); }
});

app.get('/api/url_shorten', strictAuthGate, async (req, res) => {
    try {
        const { link } = req.query;
        if (!link) return res.json({ success: false, message: "Link parameter missing!" });
        const { data } = await axios.get(`https://apis.davidcyriltech.my.id/cuttly?link=${encodeURIComponent(link)}`);
        if (data.success) { res.json({ creator: "MR HASHUU", status: "Authenticated", success: true, shortened_url: data.shortened_url }); }
        else { res.json({ success: false }); }
    } catch (e) { res.json({ success: false, message: e.message }); }
});

app.get('/xvideo', strictAuthGate, async (req, res) => {
    try {
        const { url } = req.query;
        if (!url) return res.json({ success: false, message: "XVideo URL required!" });
        const { data } = await axios.get(`https://apis.davidcyriltech.my.id/xvideo?url=${encodeURIComponent(url)}`);
        res.json({ creator: "MR HASHUU", status: "Authenticated", success: true, download_url: data.download_url });
    } catch (e) { res.json({ success: false, message: e.message }); }
});

app.get('/ytmp4', strictAuthGate, async (req, res) => {
    try {
        const { url } = req.query;
        if (!url) return res.json({ success: false, message: "YouTube URL required!" });
        const { data } = await axios.get(`https://apis.davidcyriltech.my.id/download/ytmp4?url=${encodeURIComponent(url)}`);
        res.json({ creator: "MR HASHUU", status: "Authenticated", success: true, result: data.result });
    } catch (e) { res.json({ success: false, message: e.message }); }
});

app.get('/mediafire', strictAuthGate, async (req, res) => {
    try {
        const { url } = req.query;
        if (!url) return res.json({ success: false, message: "Mediafire URL required!" });
        const { data } = await axios.get(`https://apis.davidcyriltech.my.id/mediafire?url=${encodeURIComponent(url)}`);
        res.json({ creator: "MR HASHUU", status: "Authenticated", success: true, result: data });
    } catch (e) { res.json({ success: false, message: e.message }); }
});

app.get('/spotify', strictAuthGate, async (req, res) => {
    try {
        const { url } = req.query;
        if (!url) return res.json({ success: false, message: "Spotify URL required!" });
        const { data } = await axios.get(`https://apis.davidcyriltech.my.id/spotifydl?url=${encodeURIComponent(url)}`);
        res.json({ creator: "MR HASHUU", status: "Authenticated", success: true, result: data });
    } catch (e) { res.json({ success: false, message: e.message }); }
});

app.get('/twitter', strictAuthGate, async (req, res) => {
    try {
        const { url } = req.query;
        if (!url) return res.json({ success: false, message: "Twitter URL required!" });
        const { data } = await axios.get(`https://apis.davidcyriltech.my.id/twitterV2?url=${encodeURIComponent(url)}`);
        res.json({ creator: "MR HASHUU", status: "Authenticated", success: true, result: data });
    } catch (e) { res.json({ success: false, message: e.message }); }
});

app.get('/song', strictAuthGate, async (req, res) => {
    try {
        const { text } = req.query;
        if (!text) return res.json({ success: false, message: "Song name required" });
        const { data } = await axios.get(`https://apis.davidcyriltech.my.id/play?query=${encodeURIComponent(text)}`);
        res.json({ creator: "MR HASHUU", status: "Authenticated", success: true, result: data.result });
    } catch (e) { res.json({ success: false, message: e.message }); }
});

app.get('/tiktok', strictAuthGate, async (req, res) => {
    try {
        const { url } = req.query;
        if (!url) return res.json({ success: false, message: "TikTok URL required!" });
        const { data } = await axios.get(`https://apis.davidcyriltech.my.id/download/tiktok?url=${encodeURIComponent(url)}`);
        res.json({ creator: "MR HASHUU", status: "Authenticated", success: true, result: data.result });
    } catch (e) { res.json({ success: false, message: e.message }); }
});

app.get('/pinterest', strictAuthGate, async (req, res) => {
    try {
        const { text } = req.query;
        if (!text) return res.json({ success: false, message: "Query text required" });
        const { data } = await axios.get(`https://apis.davidcyriltech.my.id/search/pinterest?text=${encodeURIComponent(text)}`);
        res.json({ creator: "MR HASHUU", status: "Authenticated", success: true, result: data.result || [] });
    } catch (e) { res.json({ success: false, message: e.message }); }
});

app.get('/apk', strictAuthGate, async (req, res) => {
    try {
        const { text } = req.query;
        if (!text) return res.json({ success: false, message: "App name required" });
        const { data } = await axios.get(`https://apis.davidcyriltech.my.id/download/apk?text=${encodeURIComponent(text)}`, { headers: { 'User-Agent': 'Mozilla/5.0' }, timeout: 8000 });
        res.json({ creator: "MR HASHUU", status: "Authenticated", success: true, result: data.apk || {} });
    } catch (e) { res.json({ success: false, message: e.message }); }
});

app.get('/facebook', strictAuthGate, async (req, res) => {
    try {
        const { url } = req.query;
        if (!url) return res.json({ success: false, message: "URL parameter missing!" });
        const { data } = await axios.get(`https://apis.davidcyriltech.my.id/facebook2?url=${encodeURIComponent(url)}`);
        if (data.status) { res.json({ creator: "MR HASHUU", status: "Authenticated", success: true, result: data.video }); }
        else { res.json({ success: false }); }
    } catch (e) { res.json({ success: false, message: e.message }); }
});

app.get('/webdl', strictAuthGate, async (req, res) => {
    try {
        const { url } = req.query;
        if (!url) return res.json({ success: false, message: "Website URL required!" });
        const { data } = await axios.get(`https://apis.davidcyriltech.my.id/tools/downloadweb?url=${encodeURIComponent(url)}`);
        if (data.response && (data.response.success === true || data.response.success === "true")) {
            res.json({ creator: "MR HASHUU", status: "Authenticated", success: true, result: { downloadUrl: data.response.downloadUrl, isFinished: data.response.isFinished } });
        } else { res.json({ success: false }); }
    } catch (e) { res.json({ success: false, message: e.message }); }
});

app.get('/obfuscate', strictAuthGate, (req, res) => {
    try {
        const { code } = req.query;
        if (!code) return res.json({ success: false, message: "Code parameter missing!" });
        const obfuscatedCode = obfuscator.obfuscate(code, { compact: true, controlFlowFlattening: true, controlFlowFlatteningThreshold: 0.5 }).getObfuscatedCode();
        res.json({ creator: "MR HASHUU", status: "Authenticated", success: true, result: obfuscatedCode });
    } catch (e) { res.json({ success: false, message: e.message }); }
});

app.post('/imgbb', strictAuthGate, upload.single('file'), async (req, res) => {
    try {
        if (!req.file) return res.json({ success: false, message: "No file uploaded!" });
        const form = new FormData();
        form.append('file', req.file.buffer, { filename: req.file.originalname || 'image.jpg', contentType: req.file.mimetype });
        const { data } = await axios.post('https://apis.davidcyriltech.my.id/uploader/imgbb', form, { headers: { ...form.getHeaders(), 'User-Agent': 'Mozilla/5.0' } });
        if (data.success) { res.json({ creator: "MR HASHUU", status: "Authenticated", success: true, result: data.data }); }
        else { res.json({ success: false }); }
    } catch (e) { res.json({ success: false, message: e.message }); }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Matrix Engine Running on port ${PORT}`));

module.exports = app;
