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

// ─────────────────────────────────────────────────────────
// 🌌 NEXT-GEN ULTRA LUXURY CYBERPUNK INTERACTION UI
// ─────────────────────────────────────────────────────────
app.get('/', (req, res) => {
    res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
        <title>MR HASHUU | PREMIUM DEVELOPER GATEWAY</title>
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&family=Space+Grotesk:wght@500;700&display=swap" rel="stylesheet">
        
        <style>
            :root {
                --bg-black: #050507;
                --sidebar-bg: #0b0b0f;
                --card-bg: rgba(18, 18, 24, 0.65);
                --border-color: rgba(255, 255, 255, 0.06);
                --neon-cyan: #00F5FF;
                --neon-purple: #7B2CBF;
                --accent-green: #00FF87;
                --accent-red: #FF3B30;
                --text-main: #FFFFFF;
                --text-muted: #7E7E86;
                --sidebar-width: 260px;
            }
            
            * { box-sizing: border-box; margin: 0; padding: 0; font-family: 'Plus Jakarta Sans', sans-serif; -webkit-tap-highlight-color: transparent; }
            
            body {
                background-color: var(--bg-black);
                color: var(--text-main);
                min-height: 100vh;
                display: flex;
                overflow-x: hidden;
            }

            /* ✨ PREMIUM BACKGROUND GLOWS */
            .glow-sphere {
                position: fixed; width: 600px; height: 600px;
                background: radial-gradient(circle, rgba(123, 44, 191, 0.15) 0%, rgba(0, 245, 255, 0.03) 50%, transparent 100%);
                z-index: 0; pointer-events: none; filter: blur(80px);
                animation: floatGlow 12s infinite alternate ease-in-out;
            }
            .glow-1 { top: -200px; right: -100px; }
            .glow-2 { bottom: -200px; left: -100px; background: radial-gradient(circle, rgba(0, 245, 255, 0.12) 0%, transparent 70%); }

            @keyframes floatGlow {
                0% { transform: translateY(0) scale(1); }
                100% { transform: translateY(30px) scale(1.1); }
            }

            /* 🌀 APP LOADER */
            #cyber-loader {
                position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
                background: var(--bg-black); z-index: 9999;
                display: flex; flex-direction: column; justify-content: center; align-items: center;
                transition: opacity 0.5s cubic-bezier(0.16, 1, 0.3, 1);
            }
            .loader-ring {
                width: 70px; height: 70px; border: 3px solid rgba(255, 255, 255, 0.02);
                border-top-color: var(--neon-cyan); border-bottom-color: var(--neon-purple);
                border-radius: 50%; animation: spin 0.8s cubic-bezier(0.4, 0, 0.2, 1) infinite;
                box-shadow: 0 0 20px rgba(0, 245, 255, 0.15);
            }
            .loader-text {
                margin-top: 24px; font-family: 'Space Grotesk', sans-serif; font-size: 1.1rem;
                font-weight: 700; letter-spacing: 4px; color: #fff; text-transform: uppercase;
                background: linear-gradient(90deg, var(--neon-cyan), var(--neon-purple));
                -webkit-background-clip: text; -webkit-text-fill-color: transparent;
            }
            @keyframes spin { to { transform: rotate(360deg); } }

            /* 🧭 SIDEBAR NAVIGATION */
            .sidebar {
                width: var(--sidebar-width); background: var(--sidebar-bg);
                border-right: 1px solid var(--border-color); display: flex; flex-direction: column;
                position: fixed; top: 0; bottom: 0; left: 0; z-index: 100; transition: transform 0.3s;
            }
            .sidebar-brand {
                padding: 30px 24px; font-family: 'Space Grotesk', sans-serif; font-size: 1.4rem;
                font-weight: 700; letter-spacing: -0.5px; border-bottom: 1px solid var(--border-color);
                display: flex; align-items: center; gap: 10px;
            }
            .brand-dot { width: 10px; height: 10px; background: var(--neon-cyan); border-radius: 50%; box-shadow: 0 0 10px var(--neon-cyan); }
            
            .nav-menu { padding: 24px 16px; display: flex; flex-direction: column; gap: 8px; flex-grow: 1; }
            .nav-item {
                display: flex; align-items: center; gap: 12px; padding: 14px 18px;
                color: var(--text-muted); font-weight: 700; font-size: 0.9rem; text-decoration: none;
                border-radius: 12px; cursor: pointer; transition: all 0.2s ease;
            }
            .nav-item:hover, .nav-item.active {
                color: #fff; background: rgba(255, 255, 255, 0.03);
                box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.05);
            }
            .nav-item.active {
                background: linear-gradient(135deg, rgba(123, 44, 191, 0.15), rgba(0, 245, 255, 0.05));
                box-shadow: inset 0 0 0 1px rgba(0, 245, 255, 0.2); color: var(--neon-cyan);
            }

            /* 🖥️ MAIN CONTAINER LAYER */
            .main-content {
                margin-left: var(--sidebar-width); flex-grow: 1; padding: 40px;
                position: relative; z-index: 10; max-width: 1200px; width: calc(100% - var(--sidebar-width));
            }

            header {
                display: flex; justify-content: space-between; align-items: center;
                margin-bottom: 35px; border-bottom: 1px solid var(--border-color); padding-bottom: 25px;
            }
            header h1 { font-family: 'Space Grotesk', sans-serif; font-size: 2.2rem; font-weight: 700; letter-spacing: -1px; }
            
            .system-status {
                display: inline-flex; align-items: center; gap: 8px; font-size: 0.75rem; font-weight: 800;
                background: rgba(0, 255, 135, 0.06); color: var(--accent-green); border: 1px solid rgba(0, 255, 135, 0.15);
                padding: 8px 16px; border-radius: 100px; letter-spacing: 0.5px;
            }
            .pulse-indicator { width: 7px; height: 7px; background: var(--accent-green); border-radius: 50%; box-shadow: 0 0 8px var(--accent-green); animation: pulse 1.6s infinite; }
            @keyframes pulse { 0%, 100% { opacity: 0.5; } 50% { opacity: 1; } }

            /* 📊 TOP ANALYTICS CARDS */
            .metrics-row { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin-bottom: 35px; }
            .metric-card {
                background: var(--card-bg); border: 1px solid var(--border-color); backdrop-filter: blur(20px);
                border-radius: 20px; padding: 24px; transition: border-color 0.3s;
            }
            .metric-card:hover { border-color: rgba(255, 255, 255, 0.12); }
            .metric-label { font-size: 0.75rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase; letter-spacing: 1px; }
            .metric-value { font-family: 'Space Grotesk', sans-serif; font-size: 1.6rem; font-weight: 700; margin-top: 8px; color: #fff; }

            /* 🔍 INTERACTIVE SEARCH */
            .search-box-wrapper { position: relative; margin-bottom: 30px; }
            .search-box {
                width: 100%; padding: 20px 24px; background: rgba(0,0,0,0.4);
                border: 1px solid var(--border-color); border-radius: 16px; color: #fff;
                font-size: 1rem; font-weight: 600; outline: none; transition: all 0.3s;
            }
            .search-box:focus {
                border-color: rgba(0, 245, 255, 0.4);
                box-shadow: 0 0 30px rgba(0, 245, 255, 0.05);
                background: rgba(0,0,0,0.6);
            }

            /* 🗂️ API ENDPOINT ACCORDIONS */
            .apis-grid { display: flex; flex-direction: column; gap: 16px; }
            .api-card {
                background: var(--card-bg); border: 1px solid var(--border-color); backdrop-filter: blur(20px);
                border-radius: 18px; overflow: hidden; transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
            }
            .api-card:hover { border-color: rgba(255, 255, 255, 0.15); transform: translateY(-2px); }
            
            .api-trigger { padding: 22px 28px; display: flex; justify-content: space-between; align-items: center; cursor: pointer; }
            .api-title-block { display: flex; flex-direction: column; gap: 6px; }
            .api-badge-row { display: flex; align-items: center; gap: 10px; }
            .method-badge { font-size: 0.65rem; font-weight: 800; padding: 4px 8px; border-radius: 6px; letter-spacing: 0.5px; background: rgba(0, 245, 255, 0.1); color: var(--neon-cyan); }
            .method-badge.post { background: rgba(123, 44, 191, 0.15); color: #b76eff; }
            
            .endpoint-path { font-family: monospace; font-size: 1.15rem; font-weight: 700; color: #fff; }
            .endpoint-desc { font-size: 0.85rem; font-weight: 600; color: var(--text-muted); }
            .chevron { font-size: 0.8rem; color: var(--text-muted); transition: transform 0.3s; font-weight: 700; }
            
            .api-card.active { border-color: rgba(123, 44, 191, 0.4); background: rgba(11, 11, 15, 0.85); }
            .api-card.active .chevron { transform: rotate(90deg); color: var(--neon-cyan); }

            /* 📄 DOCUMENTATION PANEL & DEV TESTER */
            .api-panel { display: none; padding: 0 28px 28px 28px; border-top: 1px solid rgba(255, 255, 255, 0.04); }
            .panel-title { font-size: 0.7rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase; margin: 20px 0 8px 0; letter-spacing: 1px; }
            
            .console-bar { display: flex; gap: 12px; margin-top: 8px; }
            .path-box {
                flex-grow: 1; background: #000; border: 1px solid var(--border-color); padding: 16px;
                border-radius: 12px; font-family: monospace; font-size: 0.85rem; font-weight: 600; color: var(--neon-cyan);
                overflow-x: auto; white-space: nowrap;
            }
            .path-box::-webkit-scrollbar { height: 4px; }
            .path-box::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 4px; }

            .btn {
                border: none; font-size: 0.8rem; font-weight: 700; padding: 0 22px; border-radius: 12px;
                cursor: pointer; text-transform: uppercase; transition: all 0.2s; min-height: 50px; display: flex; align-items: center; justify-content: center;
            }
            .btn-copy { background: #fff; color: #000; }
            .btn-copy:hover { opacity: 0.85; }
            .btn-fire { background: linear-gradient(135deg, var(--neon-purple), #531cb3); color: #fff; box-shadow: 0 4px 15px rgba(123, 44, 191, 0.2); }
            .btn-fire:hover { box-shadow: 0 6px 20px rgba(123, 44, 191, 0.4); transform: translateY(-1px); }
            .btn:disabled { opacity: 0.4; cursor: not-allowed; }

            /* 💻 TERMINAL LIVE OUTPUT SCREEN */
            .terminal-screen {
                background: #020203; border: 1px solid var(--border-color); border-radius: 12px;
                padding: 18px; font-family: monospace; font-size: 0.85rem; font-weight: 600; color: #555;
                white-space: pre-wrap; overflow-x: auto; max-height: 250px; line-height: 1.6;
            }
            .terminal-screen::-webkit-scrollbar { width: 5px; height: 5px; }
            .terminal-screen::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.08); border-radius: 4px; }

            /* 🔔 TOAST SYSTEM */
            #toast {
                position: fixed; bottom: 30px; right: 30px; background: #fff; color: #000;
                font-size: 0.85rem; font-weight: 800; padding: 16px 30px; border-radius: 14px;
                z-index: 10000; opacity: 0; transform: translateY(15px); pointer-events: none;
                box-shadow: 0 20px 40px rgba(0,0,0,0.5); transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
            }
            #toast.show { opacity: 1; transform: translateY(0); }

            #no-results { display: none; text-align: center; padding: 50px; font-size: 0.9rem; font-weight: 700; color: var(--text-muted); font-family: monospace; }
            footer { display: flex; justify-content: space-between; align-items: center; font-size: 0.8rem; font-weight: 700; color: var(--text-muted); border-top: 1px solid var(--border-color); padding-top: 25px; margin-top: 40px; }
            .req-btn { color: var(--neon-cyan); text-decoration: none; font-weight: 700; }

            /* 📱 RESPONSIVE FIT FOR MOBILE PLATFORMS */
            @media (max-width: 900px) {
                body { flex-direction: column; }
                .sidebar { width: 100%; height: auto; position: relative; border-right: none; border-bottom: 1px solid var(--border-color); }
                .nav-menu { flex-direction: row; overflow-x: auto; padding: 12px 20px; gap: 10px; }
                .nav-menu::-webkit-scrollbar { display: none; }
                .nav-item { white-space: nowrap; padding: 10px 16px; }
                .main-content { margin-left: 0; width: 100%; padding: 24px; }
                .metrics-row { grid-template-columns: 1fr; gap: 12px; }
                .console-bar { flex-direction: column; }
                .btn { width: 100%; }
                #toast { right: 50%; transform: translate(50%, 15px); width: 85%; text-align: center; }
                #toast.show { transform: translate(50%, 0); }
            }
        </style>
    </head>
    <body>

        <div class="glow-sphere glow-1"></div>
        <div class="glow-sphere glow-2"></div>

        <div id="toast">SYSTEM: LINK SECURED TO CLIPBOARD ✔</div>

        <div id="cyber-loader">
            <div class="loader-ring"></div>
            <div class="loader-text">MR HASHUU ENGINE</div>
        </div>

        <div class="sidebar">
            <div class="sidebar-brand">
                <div class="brand-dot"></div>
                <span>HASHU APIS</span>
            </div>
            <div class="nav-menu">
                <div class="nav-item active" onclick="switchCategory('all', this)">⚡ ALL CORE APIS</div>
                <div class="nav-item" onclick="switchCategory('media', this)">🎬 MEDIA & DOWNLOADS</div>
                <div class="nav-item" onclick="switchCategory('security', this)">🛡️ CODE SECURITY</div>
                <div class="nav-item" onclick="switchCategory('tools', this)">⚙️ UTILITY TOOLS</div>
            </div>
        </div>

        <div class="main-content">
            <header>
                <div>
                    <h1 style="font-weight: 800;">DASHBOARD PLATFORM</h1>
                    <p style="color: var(--text-muted); font-size: 0.9rem; margin-top: 4px; font-weight: 600;">Secure REST API Hub Owned by MR HASHUU</p>
                </div>
                <div class="system-status">
                    <div class="pulse-indicator"></div>
                    <span>CORE ACTIVE v2.5</span>
                </div>
            </header>

            <div class="metrics-row">
                <div class="metric-card">
                    <div class="metric-label">Total Traffic Stream</div>
                    <div class="metric-value">245.8K Req</div>
                </div>
                <div class="metric-card">
                    <div class="metric-label">Cloud Latency</div>
                    <div class="metric-value">99.99% Uptime</div>
                </div>
                <div class="metric-card">
                    <div class="metric-label">System Architecture</div>
                    <div class="metric-value" style="background: linear-gradient(90deg, var(--neon-cyan), var(--neon-purple)); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">PRO EDITION</div>
                </div>
            </div>

            <div class="search-box-wrapper">
                <input type="text" id="apiSearch" class="search-box" placeholder="Search operational endpoints natively..." onkeyup="searchFilter()">
            </div>

            <div class="apis-grid" id="masterGrid">
                
                <div class="api-card" data-category="tools" data-tags="movie database omdb cinema film plot rating info tracking">
                    <div class="api-trigger" onclick="toggleCard(this)">
                        <div class="api-title-block">
                            <div class="api-badge-row">
                                <span class="method-badge">GET</span>
                                <span class="endpoint-path">/api/movie</span>
                            </div>
                            <span class="endpoint-desc">OMDb Cinema & Film Data Information Tracking Engine</span>
                        </div>
                        <span class="chevron">▶</span>
                    </div>
                    <div class="api-panel">
                        <div class="panel-title">Developer Access URI</div>
                        <div class="console-bar">
                            <div class="path-box" id="path-movie">/api/movie?text=Guardians of the Galaxy&apikey=MR_HASHUU_SECRET_123</div>
                            <button class="btn btn-copy" onclick="copyRoute('path-movie')">Copy</button>
                            <button class="btn btn-fire" onclick="fireTest('path-movie', 'out-movie', this)">Fire Request</button>
                        </div>
                        <div class="panel-title">Response Node Stream Output</div>
                        <pre class="terminal-screen" id="out-movie">{ "status": "ready", "message": "Fire Request to capture active stream data." }</pre>
                    </div>
                </div>

                <div class="api-card" data-category="tools" data-tags="chat ai chatgpt hashan gpt gpt4 smart intelligent chatbot response text">
                    <div class="api-trigger" onclick="toggleCard(this)">
                        <div class="api-title-block">
                            <div class="api-badge-row">
                                <span class="method-badge">GET</span>
                                <span class="endpoint-path">/api/chat</span>
                            </div>
                            <span class="endpoint-desc">Hashan-md AI / ChatGPT-4o Smart Interface Wrapper</span>
                        </div>
                        <span class="chevron">▶</span>
                    </div>
                    <div class="api-panel">
                        <div class="panel-title">Developer Access URI</div>
                        <div class="console-bar">
                            <div class="path-box" id="path-chat">/api/chat?prompt=Hi&apikey=MR_HASHUU_SECRET_123</div>
                            <button class="btn btn-copy" onclick="copyRoute('path-chat')">Copy</button>
                            <button class="btn btn-fire" onclick="fireTest('path-chat', 'out-chat', this)">Fire Request</button>
                        </div>
                        <div class="panel-title">Response Node Stream Output</div>
                        <pre class="terminal-screen" id="out-chat">{ "status": "ready", "message": "Fire Request to capture active stream data." }</pre>
                    </div>
                </div>

                <div class="api-card" data-category="tools" data-tags="cuttly shorten url link tinyurl link-shortener short">
                    <div class="api-trigger" onclick="toggleCard(this)">
                        <div class="api-title-block">
                            <div class="api-badge-row">
                                <span class="method-badge">GET</span>
                                <span class="endpoint-path">/api/url_shorten</span>
                            </div>
                            <span class="endpoint-desc">Cuttly Professional Link Shortener Engine</span>
                        </div>
                        <span class="chevron">▶</span>
                    </div>
                    <div class="api-panel">
                        <div class="panel-title">Developer Access URI</div>
                        <div class="console-bar">
                            <div class="path-box" id="path-short">/api/url_shorten?link=https://apis.davidcyril.name.ng&apikey=MR_HASHUU_SECRET_123</div>
                            <button class="btn btn-copy" onclick="copyRoute('path-short')">Copy</button>
                            <button class="btn btn-fire" onclick="fireTest('path-short', 'out-short', this)">Fire Request</button>
                        </div>
                        <div class="panel-title">Response Node Stream Output</div>
                        <pre class="terminal-screen" id="out-short">{ "status": "ready", "message": "Fire Request to capture active stream data." }</pre>
                    </div>
                </div>

                <div class="api-card" data-category="media" data-tags="xvideo xvideos adult downloader download mp4 hot clip video premium">
                    <div class="api-trigger" onclick="toggleCard(this)">
                        <div class="api-title-block">
                            <div class="api-badge-row">
                                <span class="method-badge">GET</span>
                                <span class="endpoint-path">/xvideo</span>
                            </div>
                            <span class="endpoint-desc">XVideos Video MP4 Direct CDN Resolver</span>
                        </div>
                        <span class="chevron">▶</span>
                    </div>
                    <div class="api-panel">
                        <div class="panel-title">Developer Access URI</div>
                        <div class="console-bar">
                            <div class="path-box" id="path-xv">/xvideo?url=https://www.xvideos.com/video.hppakie6a79/mia_khalifa&apikey=MR_HASHUU_SECRET_123</div>
                            <button class="btn btn-copy" onclick="copyRoute('path-xv')">Copy</button>
                            <button class="btn btn-fire" onclick="fireTest('path-xv', 'out-xv', this)">Fire Request</button>
                        </div>
                        <div class="panel-title">Response Node Stream Output</div>
                        <pre class="terminal-screen" id="out-xv">{ "status": "ready", "message": "Fire Request to capture active stream data." }</pre>
                    </div>
                </div>

                <div class="api-card" data-category="media" data-tags="ytmp4 youtube video downloader download mp4 high quality clip video">
                    <div class="api-trigger" onclick="toggleCard(this)">
                        <div class="api-title-block">
                            <div class="api-badge-row">
                                <span class="method-badge">GET</span>
                                <span class="endpoint-path">/ytmp4</span>
                            </div>
                            <span class="endpoint-desc">YouTube HD Video MP4 High-Speed Extractor</span>
                        </div>
                        <span class="chevron">▶</span>
                    </div>
                    <div class="api-panel">
                        <div class="panel-title">Developer Access URI</div>
                        <div class="console-bar">
                            <div class="path-box" id="path-yt">/ytmp4?url=https://youtube.com/watch?v=MwpMEbgC7DA&apikey=MR_HASHUU_SECRET_123</div>
                            <button class="btn btn-copy" onclick="copyRoute('path-yt')">Copy</button>
                            <button class="btn btn-fire" onclick="fireTest('path-yt', 'out-yt', this)">Fire Request</button>
                        </div>
                        <div class="panel-title">Response Node Stream Output</div>
                        <pre class="terminal-screen" id="out-yt">{ "status": "ready", "message": "Fire Request to capture active stream data." }</pre>
                    </div>
                </div>

                <div class="api-card" data-category="media" data-tags="mediafire downloader direct storage parser">
                    <div class="api-trigger" onclick="toggleCard(this)">
                        <div class="api-title-block">
                            <div class="api-badge-row">
                                <span class="method-badge">GET</span>
                                <span class="endpoint-path">/mediafire</span>
                            </div>
                            <span class="endpoint-desc">Mediafire Direct Link Storage Parser Engine</span>
                        </div>
                        <span class="chevron">▶</span>
                    </div>
                    <div class="api-panel">
                        <div class="panel-title">Developer Access URI</div>
                        <div class="console-bar">
                            <div class="path-box" id="path-mf">/mediafire?url=https://www.mediafire.com/file/n6tgcrktbnov1oy/Queen_Anita-V4.zip/file&apikey=MR_HASHUU_SECRET_123</div>
                            <button class="btn btn-copy" onclick="copyRoute('path-mf')">Copy</button>
                            <button class="btn btn-fire" onclick="fireTest('path-mf', 'out-mf', this)">Fire Request</button>
                        </div>
                        <div class="panel-title">Response Node Stream Output</div>
                        <pre class="terminal-screen" id="out-mf">{ "status": "ready", "message": "Fire Request to capture active stream data." }</pre>
                    </div>
                </div>

                <div class="api-card" data-category="media" data-tags="spotify music hq audio downloader song">
                    <div class="api-trigger" onclick="toggleCard(this)">
                        <div class="api-title-block">
                            <div class="api-badge-row">
                                <span class="method-badge">GET</span>
                                <span class="endpoint-path">/spotify</span>
                            </div>
                            <span class="endpoint-desc">Spotify Premium Lossless Audio Extractor</span>
                        </div>
                        <span class="chevron">▶</span>
                    </div>
                    <div class="api-panel">
                        <div class="panel-title">Developer Access URI</div>
                        <div class="console-bar">
                            <div class="path-box" id="path-sf">/spotify?url=https://open.spotify.com/track/285pBltuF7vW8TeWk8hdRR&apikey=MR_HASHUU_SECRET_123&apikey=MR_HASHUU_SECRET_123</div>
                            <button class="btn btn-copy" onclick="copyRoute('path-sf')">Copy</button>
                            <button class="btn btn-fire" onclick="fireTest('path-sf', 'out-sf', this)">Fire Request</button>
                        </div>
                        <div class="panel-title">Response Node Stream Output</div>
                        <pre class="terminal-screen" id="out-sf">{ "status": "ready", "message": "Fire Request to capture active stream data." }</pre>
                    </div>
                </div>

                <div class="api-card" data-category="media" data-tags="twitter x stream extractor multi video">
                    <div class="api-trigger" onclick="toggleCard(this)">
                        <div class="api-title-block">
                            <div class="api-badge-row">
                                <span class="method-badge">GET</span>
                                <span class="endpoint-path">/twitter</span>
                            </div>
                            <span class="endpoint-desc">Twitter / X Multi-Quality Stream CDN Resolver</span>
                        </div>
                        <span class="chevron">▶</span>
                    </div>
                    <div class="api-panel">
                        <div class="panel-title">Developer Access URI</div>
                        <div class="console-bar">
                            <div class="path-box" id="path-tw">/twitter?url=https://x.com/elonmusk/status/1870901510319833540&apikey=MR_HASHUU_SECRET_123</div>
                            <button class="btn btn-copy" onclick="copyRoute('path-tw')">Copy</button>
                            <button class="btn btn-fire" onclick="fireTest('path-tw', 'out-tw', this)">Fire Request</button>
                        </div>
                        <div class="panel-title">Response Node Stream Output</div>
                        <pre class="terminal-screen" id="out-tw">{ "status": "ready", "message": "Fire Request to capture active stream data." }</pre>
                    </div>
                </div>

                <div class="api-card" data-category="media" data-tags="song youtube play mp3 audio music stream">
                    <div class="api-trigger" onclick="toggleCard(this)">
                        <div class="api-title-block">
                            <div class="api-badge-row">
                                <span class="method-badge">GET</span>
                                <span class="endpoint-path">/song</span>
                            </div>
                            <span class="endpoint-desc">YouTube High-Fidelity Audio Stream Grabber</span>
                        </div>
                        <span class="chevron">▶</span>
                    </div>
                    <div class="api-panel">
                        <div class="panel-title">Developer Access URI</div>
                        <div class="console-bar">
                            <div class="path-box" id="path-sg">/song?text=faded&apikey=MR_HASHUU_SECRET_123</div>
                            <button class="btn btn-copy" onclick="copyRoute('path-sg')">Copy</button>
                            <button class="btn btn-fire" onclick="fireTest('path-sg', 'out-sg', this)">Fire Request</button>
                        </div>
                        <div class="panel-title">Response Node Stream Output</div>
                        <pre class="terminal-screen" id="out-sg">{ "status": "ready", "message": "Fire Request to capture active stream data." }</pre>
                    </div>
                </div>

                <div class="api-card" data-category="media" data-tags="tiktok video downloader no watermark">
                    <div class="api-trigger" onclick="toggleCard(this)">
                        <div class="api-title-block">
                            <div class="api-badge-row">
                                <span class="method-badge">GET</span>
                                <span class="endpoint-path">/tiktok</span>
                            </div>
                            <span class="endpoint-desc">TikTok Studio Source No-Watermark Downloader</span>
                        </div>
                        <span class="chevron">▶</span>
                    </div>
                    <div class="api-panel">
                        <div class="panel-title">Developer Access URI</div>
                        <div class="console-bar">
                            <div class="path-box" id="path-tk">/tiktok?url=https://vm.tiktok.com/ZM6789/&apikey=MR_HASHUU_SECRET_123</div>
                            <button class="btn btn-copy" onclick="copyRoute('path-tk')">Copy</button>
                            <button class="btn btn-fire" onclick="fireTest('path-tk', 'out-tk', this)">Fire Request</button>
                        </div>
                        <div class="panel-title">Response Node Stream Output</div>
                        <pre class="terminal-screen" id="out-tk">{ "status": "ready", "message": "Fire Request to capture active stream data." }</pre>
                    </div>
                </div>

                <div class="api-card" data-category="media" data-tags="pinterest image search visual hd download">
                    <div class="api-trigger" onclick="toggleCard(this)">
                        <div class="api-title-block">
                            <div class="api-badge-row">
                                <span class="method-badge">GET</span>
                                <span class="endpoint-path">/pinterest</span>
                            </div>
                            <span class="endpoint-desc">Pinterest Ultra-HD Media Image Source Finder</span>
                        </div>
                        <span class="chevron">▶</span>
                    </div>
                    <div class="api-panel">
                        <div class="panel-title">Developer Access URI</div>
                        <div class="console-bar">
                            <div class="path-box" id="path-pin">/pinterest?text=cyberpunk&apikey=MR_HASHUU_SECRET_123</div>
                            <button class="btn btn-copy" onclick="copyRoute('path-pin')">Copy</button>
                            <button class="btn btn-fire" onclick="fireTest('path-pin', 'out-pin', this)">Fire Request</button>
                        </div>
                        <div class="panel-title">Response Node Stream Output</div>
                        <pre class="terminal-screen" id="out-pin">{ "status": "ready", "message": "Fire Request to capture active stream data." }</pre>
                    </div>
                </div>

                <div class="api-card" data-category="tools" data-tags="apk android package app mirror tool download">
                    <div class="api-trigger" onclick="toggleCard(this)">
                        <div class="api-title-block">
                            <div class="api-badge-row">
                                <span class="method-badge">GET</span>
                                <span class="endpoint-path">/apk</span>
                            </div>
                            <span class="endpoint-desc">Android App Core Binary Package Mirror Fetcher</span>
                        </div>
                        <span class="chevron">▶</span>
                    </div>
                    <div class="api-panel">
                        <div class="panel-title">Developer Access URI</div>
                        <div class="console-bar">
                            <div class="path-box" id="path-apk">/apk?text=whatsapp&apikey=MR_HASHUU_SECRET_123</div>
                            <button class="btn btn-copy" onclick="copyRoute('path-apk')">Copy</button>
                            <button class="btn btn-fire" onclick="fireTest('path-apk', 'out-apk', this)">Fire Request</button>
                        </div>
                        <div class="panel-title">Response Node Stream Output</div>
                        <pre class="terminal-screen" id="out-apk">{ "status": "ready", "message": "Fire Request to capture active stream data." }</pre>
                    </div>
                </div>

                <div class="api-card" data-category="media" data-tags="facebook fb video resolver cdn download">
                    <div class="api-trigger" onclick="toggleCard(this)">
                        <div class="api-title-block">
                            <div class="api-badge-row">
                                <span class="method-badge">GET</span>
                                <span class="endpoint-path">/facebook</span>
                            </div>
                            <span class="endpoint-desc">Facebook Architecture Video Stream Extractor</span>
                        </div>
                        <span class="chevron">▶</span>
                    </div>
                    <div class="api-panel">
                        <div class="panel-title">Developer Access URI</div>
                        <div class="console-bar">
                            <div class="path-box" id="path-fb">/facebook?url=https://www.facebook.com/watch/?v=123&apikey=MR_HASHUU_SECRET_123</div>
                            <button class="btn btn-copy" onclick="copyRoute('path-fb')">Copy</button>
                            <button class="btn btn-fire" onclick="fireTest('path-fb', 'out-fb', this)">Fire Request</button>
                        </div>
                        <div class="panel-title">Response Node Stream Output</div>
                        <pre class="terminal-screen" id="out-fb">{ "status": "ready", "message": "Fire Request to capture active stream data." }</pre>
                    </div>
                </div>

                <div class="api-card" data-category="tools" data-tags="webdl website clone html static site page download">
                    <div class="api-trigger" onclick="toggleCard(this)">
                        <div class="api-title-block">
                            <div class="api-badge-row">
                                <span class="method-badge">GET</span>
                                <span class="endpoint-path">/webdl</span>
                            </div>
                            <span class="endpoint-desc">Static Production Webpage Structural Pack Cloner</span>
                        </div>
                        <span class="chevron">▶</span>
                    </div>
                    <div class="api-panel">
                        <div class="panel-title">Developer Access URI</div>
                        <div class="console-bar">
                            <div class="path-box" id="path-wdl">/webdl?url=https://example.com&apikey=MR_HASHUU_SECRET_123</div>
                            <button class="btn btn-copy" onclick="copyRoute('path-wdl')">Copy</button>
                            <button class="btn btn-fire" onclick="fireTest('path-wdl', 'out-wdl', this)">Fire Request</button>
                        </div>
                        <div class="panel-title">Response Node Stream Output</div>
                        <pre class="terminal-screen" id="out-wdl">{ "status": "ready", "message": "Fire Request to capture active stream data." }</pre>
                    </div>
                </div>

                <div class="api-card" data-category="security" data-tags="obfuscate javascript security protection code hide encrypt">
                    <div class="api-trigger" onclick="toggleCard(this)">
                        <div class="api-title-block">
                            <div class="api-badge-row">
                                <span class="method-badge">GET</span>
                                <span class="endpoint-path">/obfuscate</span>
                            </div>
                            <span class="endpoint-desc">Dynamic Structural JavaScript Anti-Scrape Guardian</span>
                        </div>
                        <span class="chevron">▶</span>
                    </div>
                    <div class="api-panel">
                        <div class="panel-title">Developer Access URI</div>
                        <div class="console-bar">
                            <div class="path-box" id="path-obf">/obfuscate?code=console.log('hashu')&apikey=MR_HASHUU_SECRET_123</div>
                            <button class="btn btn-copy" onclick="copyRoute('path-obf')">Copy</button>
                            <button class="btn btn-fire" onclick="fireTest('path-obf', 'out-obf', this)">Fire Request</button>
                        </div>
                        <div class="panel-title">Response Node Stream Output</div>
                        <pre class="terminal-screen" id="out-obf">{ "status": "ready", "message": "Fire Request to capture active stream data." }</pre>
                    </div>
                </div>

                <div class="api-card" data-category="security" data-tags="imgbb photo cloud cdn image host upload post">
                    <div class="api-trigger" onclick="toggleCard(this)">
                        <div class="api-title-block">
                            <div class="api-badge-row">
                                <span class="method-badge post">POST</span>
                                <span class="endpoint-path">/imgbb</span>
                            </div>
                            <span class="endpoint-desc">Multipart Binary Object Cloud Image CDN Interface</span>
                        </div>
                        <span class="chevron">▶</span>
                    </div>
                    <div class="api-panel">
                        <div class="panel-title">HTTP METHOD COMPONENT</div>
                        <div class="path-box" style="color:var(--neon-purple)">POST DIRECT ACCESS (Multipart Form-Data)</div>
                        <div class="panel-title">Testing Parameters Node</div>
                        <pre class="terminal-screen">{ "info": "Requires file attachment. Real-time REST testing disabled in UI dashboard console." }</pre>
                    </div>
                </div>

                <div id="no-results">// SEARCH METADATA MISMATCHED //</div>
            </div>

            <footer>
                <span style="font-weight: 700;">© 2026 MR HASHUU WORKSPACE</span>
                <a href="#" class="req-btn">REQUEST ACCESS KEYS</a>
            </footer>
        </div>

        <script>
            let activeCategory = 'all';

            window.addEventListener('DOMContentLoaded', () => {
                setTimeout(() => {
                    const loader = document.getElementById('cyber-loader');
                    loader.style.opacity = '0';
                    setTimeout(() => loader.remove(), 500);
                }, 1000);
            });

            function toggleCard(element) {
                const parent = element.parentElement;
                const panel = parent.querySelector('.api-panel');
                const isCurrentlyActive = parent.classList.contains('active');

                // Close all existing open panels
                const allCards = document.getElementsByClassName('api-card');
                for (let card of allCards) {
                    card.classList.remove('active');
                    card.querySelector('.api-panel').style.display = 'none';
                }

                if (!isCurrentlyActive) {
                    parent.classList.add('active');
                    panel.style.display = 'block';
                }
            }

            function switchCategory(category, button) {
                activeCategory = category;
                
                // Toggle active category menu selector look
                const items = document.getElementsByClassName('nav-item');
                for(let item of items) item.classList.remove('active');
                button.classList.add('active');
                
                searchFilter();
            }

            function searchFilter() {
                const query = document.getElementById('apiSearch').value.toLowerCase().trim();
                const cards = document.getElementsByClassName('api-card');
                const noResults = document.getElementById('no-results');
                let matchesFound = false;

                for (let card of cards) {
                    const tags = card.getAttribute('data-tags');
                    const cat = card.getAttribute('data-category');
                    
                    const matchesCategory = (activeCategory === 'all' || cat === activeCategory);
                    const matchesSearch = tags.includes(query);

                    if (matchesCategory && matchesSearch) {
                        card.style.display = 'block';
                        matchesFound = true;
                    } else {
                        card.style.display = 'none';
                    }
                }
                noResults.style.display = matchesFound ? 'none' : 'block';
            }

            function copyRoute(id) {
                const routeText = document.getElementById(id).textContent.trim();
                const absoluteUrl = window.location.origin + routeText;
                
                if (navigator.clipboard && window.isSecureContext) {
                    navigator.clipboard.writeText(absoluteUrl).then(() => alertToast());
                } else {
                    const textArea = document.createElement("textarea");
                    textArea.value = absoluteUrl;
                    textArea.style.position = "fixed"; textArea.style.opacity = "0";
                    document.body.appendChild(textArea);
                    textArea.focus(); textArea.select();
                    document.execCommand('copy');
                    document.body.removeChild(textArea);
                    alertToast();
                }
            }

            function alertToast() {
                const toast = document.getElementById('toast');
                toast.classList.add('show');
                setTimeout(() => toast.classList.remove('show'), 2500);
            }

            async function fireTest(pathId, screenId, btn) {
                const routeText = document.getElementById(pathId).textContent.trim();
                const finalUrl = window.location.origin + routeText;
                const terminal = document.getElementById(screenId);

                btn.innerText = "TRANSMITTING...";
                btn.disabled = true;
                terminal.textContent = "// EVALUATING CLOUD RUNTIME INSTANCE SYSTEM SIGNAL... //";
                terminal.style.color = "var(--neon-cyan)";

                try {
                    const stream = await fetch(finalUrl);
                    const parsedPayload = await stream.json();
                    
                    terminal.textContent = JSON.stringify(parsedPayload, null, 2);
                    terminal.style.color = "var(--accent-green)";
                } catch (err) {
                    terminal.textContent = JSON.stringify({
                        success: false,
                        log_exception: "Execution environment pipeline was disconnected",
                        msg: err.message
                    }, null, 2);
                    terminal.style.color = "var(--accent-red)";
                } finally {
                    btn.innerText = "Fire Request";
                    btn.disabled = false;
                }
            }
        </script>
    </body>
    </html>
    `);
});

// ─────────────────────────────────────────────────────────
// 🛠️ BACKEND CONTROLLERS LOGIC
// ─────────────────────────────────────────────────────────

// 🎬 NEW OMDb MOVIE CONTROLLER
app.get('/api/movie', strictAuthGate, async (req, res) => {
    try {
        const { text } = req.query;
        if (!text) return res.json({ success: false, message: "Movie title parameter (?text=) missing!" });

        const movieUrl = `http://www.omdbapi.com/?t=${encodeURIComponent(text)}&apikey=2634bb02`;
        const { data } = await axios.get(movieUrl);

        if (data.Response === "True") {
            res.json({
                creator: "MR HASHUU",
                status: "Authenticated",
                success: true,
                result: data
            });
        } else {
            res.json({ success: false, message: data.Error || "Movie not found!" });
        }
    } catch (e) {
        res.json({ success: false, message: e.message });
    }
});

// 0. CHATGPT-4o SMART INTERFACE
app.get('/api/chat', strictAuthGate, async (req, res) => {
    try {
        const { prompt } = req.query;
        if (!prompt) return res.json({ success: false, message: "Prompt parameter missing!" });

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

        res.json({ creator: "MR HASHUU", status: "Authenticated", success: true, result: aiReply });
    } catch (e) { res.json({ success: false, message: e.message }); }
});

// 1. CUTTLY URL SHORTENER
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

// 2. XVIDEOS DOWNLOADER
app.get('/xvideo', strictAuthGate, async (req, res) => {
    try {
        const { url } = req.query;
        if (!url) return res.json({ success: false, message: "XVideo URL required!" });
        const { data } = await axios.get(`https://apis.davidcyriltech.my.id/xvideo?url=${encodeURIComponent(url)}`);
        if (data.success) {
            res.json({ creator: "MR HASHUU", status: "Authenticated", success: true, title: data.title, thumbnail: data.thumbnail, download_url: data.download_url });
        } else { res.json({ success: false, message: "Conversion failed." }); }
    } catch (e) { res.json({ success: false, message: e.message }); }
});

// 3. YOUTUBE MP4 DOWNLOADER
app.get('/ytmp4', strictAuthGate, async (req, res) => {
    try {
        const { url } = req.query;
        if (!url) return res.json({ success: false, message: "YouTube URL required!" });
        const { data } = await axios.get(`https://apis.davidcyriltech.my.id/download/ytmp4?url=${encodeURIComponent(url)}`);
        if (data.success && data.result) {
            res.json({ creator: "MR HASHUU", status: "Authenticated", success: true, result: data.result });
        } else { res.json({ success: false, message: "Media conversion failed." }); }
    } catch (e) { res.json({ success: false, message: e.message }); }
});

// 4. MEDIAFIRE PARSER
app.get('/mediafire', strictAuthGate, async (req, res) => {
    try {
        const { url } = req.query;
        if (!url) return res.json({ success: false, message: "Mediafire URL required!" });
        const { data } = await axios.get(`https://apis.davidcyriltech.my.id/mediafire?url=${encodeURIComponent(url)}`);
        res.json({ creator: "MR HASHUU", status: "Authenticated", success: true, result: data });
    } catch (e) { res.json({ success: false, message: e.message }); }
});

// 5. SPOTIFY EXTRACTOR
app.get('/spotify', strictAuthGate, async (req, res) => {
    try {
        const { url } = req.query;
        if (!url) return res.json({ success: false, message: "Spotify URL required!" });
        const { data } = await axios.get(`https://apis.davidcyriltech.my.id/spotifydl?url=${encodeURIComponent(url)}`);
        res.json({ creator: "MR HASHUU", status: "Authenticated", success: true, result: data });
    } catch (e) { res.json({ success: false, message: e.message }); }
});

// 6. TWITTER STREAM CDN
app.get('/twitter', strictAuthGate, async (req, res) => {
    try {
        const { url } = req.query;
        if (!url) return res.json({ success: false, message: "Twitter URL required!" });
        const { data } = await axios.get(`https://apis.davidcyriltech.my.id/twitterV2?url=${encodeURIComponent(url)}`);
        res.json({ creator: "MR HASHUU", status: "Authenticated", success: true, result: data });
    } catch (e) { res.json({ success: false, message: e.message }); }
});

// 7. YOUTUBE AUDIO SONG
app.get('/song', strictAuthGate, async (req, res) => {
    try {
        const { text } = req.query;
        if (!text) return res.json({ success: false, message: "Song name required" });
        const { data } = await axios.get(`https://apis.davidcyriltech.my.id/play?query=${encodeURIComponent(text)}`);
        if (data.status && data.result) {
            res.json({ creator: "MR HASHUU", status: "Authenticated", success: true, result: data.result });
        } else { res.json({ success: false, message: "Failed to fetch song." }); }
    } catch (e) { res.json({ success: false, message: e.message }); }
});

// 8. TIKTOK NO-WATERMARK
app.get('/tiktok', strictAuthGate, async (req, res) => {
    try {
        const { url } = req.query;
        if (!url) return res.json({ success: false, message: "TikTok URL required!" });
        const { data } = await axios.get(`https://apis.davidcyriltech.my.id/download/tiktok?url=${encodeURIComponent(url)}`);
        if (data.success && data.result) {
            res.json({ creator: "MR HASHUU", status: "Authenticated", success: true, result: data.result });
        } else { res.json({ success: false, message: "Invalid TikTok URL." }); }
    } catch (e) { res.json({ success: false, message: e.message }); }
});

// 9. PINTEREST MEDIA IMAGE
app.get('/pinterest', strictAuthGate, async (req, res) => {
    try {
        const { text } = req.query;
        if (!text) return res.json({ success: false, message: "Query text required" });
        const { data } = await axios.get(`https://apis.davidcyriltech.my.id/search/pinterest?text=${encodeURIComponent(text)}`);
        res.json({ creator: "MR HASHUU", status: "Authenticated", success: true, result: data.result || [] });
    } catch (e) { res.json({ success: false, message: e.message }); }
});

// 10. APK PACKAGE MIRROR
app.get('/apk', strictAuthGate, async (req, res) => {
    try {
        const { text } = req.query;
        if (!text) return res.json({ success: false, message: "App name required" });
        const { data } = await axios.get(`https://apis.davidcyriltech.my.id/download/apk?text=${encodeURIComponent(text)}`, { headers: { 'User-Agent': 'Mozilla/5.0' }, timeout: 8000 });
        res.json({ creator: "MR HASHUU", status: "Authenticated", success: true, result: data.apk || {} });
    } catch (e) { res.json({ success: false, message: e.message }); }
});

// 11. FACEBOOK WATCH EXTRACTOR
app.get('/facebook', strictAuthGate, async (req, res) => {
    try {
        const { url } = req.query;
        if (!url) return res.json({ success: false, message: "URL parameter missing!" });
        const { data } = await axios.get(`https://apis.davidcyriltech.my.id/facebook2?url=${encodeURIComponent(url)}`);
        if (data.status) {
            res.json({ creator: "MR HASHUU", status: "Authenticated", success: true, result: data.video });
        } else { res.json({ success: false, message: "Could not fetch video." }); }
    } catch (e) { res.json({ success: false, message: e.message }); }
});

// 12. STATIC WEBPAGE CLONER
app.get('/webdl', strictAuthGate, async (req, res) => {
    try {
        const { url } = req.query;
        if (!url) return res.json({ success: false, message: "Website URL required!" });
        const { data } = await axios.get(`https://apis.davidcyriltech.my.id/tools/downloadweb?url=${encodeURIComponent(url)}`);
        if (data.response && (data.response.success === true || data.response.success === "true")) {
            res.json({ creator: "MR HASHUU", status: "Authenticated", success: true, result: { downloadUrl: data.response.downloadUrl, isFinished: data.response.isFinished } });
        } else { res.json({ success: false, message: "Failed to clone website." }); }
    } catch (e) { res.json({ success: false, message: e.message }); }
});

// 13. JS ANTI-SCRAPE OBFUSCATOR
app.get('/obfuscate', strictAuthGate, (req, res) => {
    try {
        const { code } = req.query;
        if (!code) return res.json({ success: false, message: "Code parameter missing!" });
        const obfuscatedCode = obfuscator.obfuscate(code, { compact: true, controlFlowFlattening: true, controlFlowFlatteningThreshold: 0.5 }).getObfuscatedCode();
        res.json({ creator: "MR HASHUU", status: "Authenticated", success: true, result: obfuscatedCode });
    } catch (e) { res.json({ success: false, message: e.message }); }
});

// 14. IMGBB IMAGE CLOUD POST
app.post('/imgbb', strictAuthGate, upload.single('file'), async (req, res) => {
    try {
        if (!req.file) return res.json({ success: false, message: "No file uploaded!" });
        const form = new FormData();
        form.append('file', req.file.buffer, { filename: req.file.originalname || 'image.jpg', contentType: req.file.mimetype });
        const { data } = await axios.post('https://apis.davidcyriltech.my.id/uploader/imgbb', form, { headers: { ...form.getHeaders(), 'User-Agent': 'Mozilla/5.0' } });
        if (data.success) { res.json({ creator: "MR HASHUU", status: "Authenticated", success: true, result: data.data }); }
        else { res.json({ success: false, message: "Upload failed." }); }
    } catch (e) { res.json({ success: false, message: e.message }); }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Apple Matrix HASHU-API Engine Running on port ${PORT}`));

module.exports = app;
