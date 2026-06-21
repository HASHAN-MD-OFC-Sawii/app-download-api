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

// Premium Rate Limiter
const premiumLimiter = rateLimit({
    windowMs: 24 * 60 * 60 * 1000, 
    max: 5000, 
    message: { success: false, message: "Premium daily limit reached! Contact MR HASHUU." }
});

// Gatekeeper Middleware
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
// 🌌 LUXURY APPLE MATRIX INTERACTION UI
// ─────────────────────────────────────────────────────────
app.get('/', (req, res) => {
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
                --apple-dark-gray: #0b0b0c;
                --apple-card: rgba(22, 22, 23, 0.8);
                --apple-border: rgba(255, 255, 255, 0.08);
                --apple-cyan: #00F5FF;
                --apple-blue: #7B2CBF;
                --apple-green: #00FF87;
                --apple-red: #ff453a;
                --text-main: #ffffff;
                --text-muted: #a1a1a6;
            }
            
            * { box-sizing: border-box; margin: 0; padding: 0; }
            
            body {
                background-color: var(--apple-black);
                color: var(--text-main);
                font-family: 'Inter', -apple-system, sans-serif;
                min-height: 100vh;
                display: flex;
                justify-content: center;
                align-items: center;
                overflow-x: hidden;
                padding: 20px 0;
                position: relative;
            }

            /* 🪐 PREMIUM BACKDROP ANIMATED GLOW */
            .ambient-glow {
                position: fixed; top: -10%; left: 50%; transform: translateX(-50%); width: 80vw; height: 50vh;
                background: radial-gradient(circle, rgba(123, 44, 191, 0.2) 0%, rgba(0, 245, 255, 0.05) 50%, transparent 100%);
                z-index: 1; pointer-events: none; filter: blur(60px);
            }

            /* 🔥 APPLE STUDIO SHUTTER LOADER */
            #cyber-loader {
                position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
                background: var(--apple-black); z-index: 9999;
                display: flex; flex-direction: column; justify-content: center; align-items: center;
                transition: opacity 0.4s ease-out;
            }

            .apple-loading-wrapper { display: flex; flex-direction: column; align-items: center; gap: 20px; }
            .smooth-aura-glow {
                width: 60px; height: 60px; border: 4px solid rgba(255, 255, 255, 0.03);
                border-top-color: var(--apple-cyan); border-bottom-color: var(--apple-blue);
                border-radius: 50%; animation: appleSpin 0.8s cubic-bezier(0.4, 0, 0.2, 1) infinite;
            }
            .loader-brand {
                font-family: 'Space Grotesk', sans-serif; font-size: 1.2rem; font-weight: 900; color: #ffffff;
                letter-spacing: 4px; text-transform: uppercase;
                background: linear-gradient(90deg, var(--apple-cyan), var(--apple-blue));
                -webkit-background-clip: text; -webkit-text-fill-color: transparent;
            }
            @keyframes appleSpin { to { transform: rotate(360deg); } }

            /* Premium Minimal Master Box */
            .vercel-box {
                width: 94%; max-width: 600px;
                background: var(--apple-card); backdrop-filter: blur(40px); -webkit-backdrop-filter: blur(40px);
                border: 1px solid var(--apple-border); border-radius: 24px;
                padding: 30px; z-index: 2; position: relative;
                box-shadow: 0 40px 90px rgba(0, 0, 0, 0.8);
                opacity: 0; transform: scale(0.97);
                transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1);
            }
            .vercel-box.system-ready { opacity: 1; transform: scale(1); }

            header { display: flex; justify-content: space-between; align-items: center; padding-bottom: 20px; border-bottom: 1px solid var(--apple-border); flex-wrap: wrap; gap: 15px; }
            header h1 { font-family: 'Space Grotesk', sans-serif; font-size: 1.8rem; font-weight: 900; letter-spacing: -0.5px; color: #ffffff; }

            /* Status Pill */
            .status-container {
                display: inline-flex; align-items: center; gap: 6px;
                font-size: 0.75rem; font-weight: 900; letter-spacing: 0.5px;
                color: var(--apple-cyan); background: rgba(0, 245, 255, 0.08);
                padding: 6px 14px; border-radius: 30px; border: 1px solid rgba(0, 245, 255, 0.2);
            }
            .pulse-dot { width: 8px; height: 8px; background: var(--apple-cyan); border-radius: 50%; box-shadow: 0 0 10px var(--apple-cyan); animation: pulse 1.5s infinite; }
            @keyframes pulse { 0%, 100% { opacity: 0.6; } 50% { opacity: 1; } }

            /* Analytics Counters Grid */
            .analytics-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin-top: 20px; }
            .stat-card { background: rgba(255, 255, 255, 0.02); border: 1px solid var(--apple-border); border-radius: 16px; padding: 14px 10px; text-align: center; }
            .stat-label { font-size: 0.65rem; font-weight: 900; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.5px; }
            .stat-value { font-size: 1.1rem; font-weight: 900; color: #ffffff; margin-top: 4px; font-family: 'Space Grotesk', sans-serif; }

            /* Filter Input Search Box */
            .search-container { position: relative; margin-top: 20px; }
            .search-input {
                width: 100%; padding: 16px 20px; background: rgba(0, 0, 0, 0.4);
                border: 1px solid var(--apple-border); border-radius: 14px;
                color: #ffffff; font-size: 0.9rem; font-weight: 800; outline: none; transition: all 0.3s;
            }
            .search-input:focus { border-color: rgba(0, 245, 255, 0.4); background: rgba(0, 0, 0, 0.6); box-shadow: 0 0 20px rgba(0, 245, 255, 0.05); }
            ::placeholder { color: #55555a; font-weight: 800; }

            /* Workspace Lists Layout */
            .endpoint-list { margin-top: 20px; display: flex; flex-direction: column; gap: 12px; }
            .api-wrapper { background: rgba(255, 255, 255, 0.01); border: 1px solid var(--apple-border); border-radius: 16px; overflow: hidden; transition: all 0.25s; }
            .api-wrapper:hover { border-color: rgba(255, 255, 255, 0.15); background: rgba(255, 255, 255, 0.03); }
            
            .api-row { padding: 18px; display: flex; justify-content: space-between; align-items: center; cursor: pointer; }
            .meta-details { display: flex; flex-direction: column; gap: 4px; max-width: 85%; }
            .endpoint-slug { font-size: 1.05rem; font-weight: 900; color: #ffffff; font-family: monospace; }
            .endpoint-info { font-size: 0.8rem; font-weight: 800; color: var(--text-muted); }
            .arrow-icon { font-size: 0.75rem; color: #555; font-weight: 900; transition: transform 0.2s; }
            
            /* Active Expand Configuration */
            .api-wrapper.active { border-color: rgba(123, 44, 191, 0.5); background: rgba(0, 0, 0, 0.3); }
            .api-wrapper.active .arrow-icon { transform: rotate(90deg); color: var(--apple-cyan); }

            /* Core Premium Documentation Panel */
            .api-docs { display: none; padding: 0 18px 18px 18px; border-top: 1px solid rgba(255, 255, 255, 0.04); background: rgba(0,0,0,0.2); }
            .docs-section-title { font-size: 0.68rem; font-weight: 900; color: var(--text-muted); text-transform: uppercase; margin: 16px 0 6px 0; letter-spacing: 0.5px; }
            
            /* Action Buttons Layout styling */
            .url-box-container { display: flex; gap: 8px; margin-top: 6px; }
            .url-display {
                flex-grow: 1; background: #000000; border: 1px solid var(--apple-border); padding: 14px;
                border-radius: 10px; font-family: monospace; font-size: 0.78rem; font-weight: 700; color: var(--apple-cyan);
                overflow-x: auto; white-space: nowrap;
            }

            .btn-action {
                border: none; font-size: 0.75rem; font-weight: 900; padding: 0 16px; border-radius: 10px; cursor: pointer; text-transform: uppercase; transition: all 0.2s; min-height: 44px;
            }
            .btn-copy { background: #ffffff; color: #000000; }
            .btn-copy:hover { opacity: 0.85; }
            .btn-run { background: linear-gradient(135deg, var(--apple-blue), #531cb3); color: #ffffff; }
            .btn-run:hover { box-shadow: 0 0 15px rgba(123, 44, 191, 0.4); }

            /* Real Live Web Request Console Screen */
            .json-preview {
                background: #000000; border: 1px solid var(--apple-border); border-radius: 10px;
                padding: 14px; font-family: monospace; font-size: 0.75rem; font-weight: 700; color: #777;
                white-space: pre-wrap; overflow-x: auto; max-height: 160px; line-height: 1.4;
            }

            /* Notification Banner Dynamic pop */
            #toast-alert {
                position: fixed; bottom: 30px; background: #ffffff; color: #000000;
                font-family: 'Space Grotesk', sans-serif; font-weight: 900; font-size: 0.8rem; padding: 12px 24px; border-radius: 12px;
                z-index: 10000; opacity: 0; transform: translateY(10px); pointer-events: none;
                transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
            }
            #toast-alert.show { opacity: 1; transform: translateY(0); }

            #no-results { display: none; text-align: center; padding: 40px; font-size: 0.8rem; font-weight: 700; color: var(--text-muted); font-family: monospace; }
            footer { display: flex; justify-content: space-between; align-items: center; font-size: 0.75rem; font-weight: 900; color: var(--text-muted); border-top: 1px solid var(--apple-border); padding-top: 20px; margin-top: 20px; flex-wrap: wrap; gap: 10px; }
            .buy-btn { color: var(--apple-cyan); text-decoration: none; font-weight: 900; }

            /* 📱 RESPONSIVE MOBILE ADJUSTMENTS */
            @media (max-width: 600px) {
                body { padding: 10px 0; }
                .vercel-box { padding: 22px 16px; border-radius: 20px; }
                header h1 { font-size: 1.5rem; }
                .status-container { padding: 5px 10px; font-size: 0.65rem; }
                .analytics-grid { grid-template-columns: 1fr; gap: 8px; margin-top: 15px; }
                .stat-card { padding: 12px; text-align: left; display: flex; justify-content: space-between; align-items: center; }
                .stat-value { margin-top: 0; font-size: 1rem; }
                .url-box-container { flex-direction: column; gap: 8px; }
                .btn-action { width: 100%; justify-content: center; display: flex; align-items: center; }
                .endpoint-slug { font-size: 0.95rem; }
                .endpoint-info { font-size: 0.75rem; }
            }
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
                <div class="status-container">
                    <div class="pulse-dot"></div>
                    <span>SYSTEM RUNNING</span>
                </div>
            </header>

            <div class="analytics-grid">
                <div class="stat-card">
                    <div class="stat-label">Total Requests</div>
                    <div class="stat-value">245.8K</div>
                </div>
                <div class="stat-card">
                    <div class="stat-label">System Uptime</div>
                    <div class="stat-value">99.99%</div>
                </div>
                <div class="stat-card">
                    <div class="stat-label">Core Owner</div>
                    <div class="stat-value" style="background: linear-gradient(90deg, var(--apple-cyan), var(--apple-blue)); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">MR HASHUU</div>
                </div>
            </div>

            <div class="search-container">
                <input type="text" id="apiSearch" class="search-input" placeholder="Search developer secure endpoints..." onkeyup="filterEndpoints()">
            </div>

            <div class="endpoint-list" id="listWrapper">
                
                <div class="api-wrapper" data-name="chat ai chatgpt hashan gpt gpt4 smart intelligent chatbot response text">
                    <div class="api-row" onclick="toggleAccordion(this)">
                        <div class="meta-details">
                            <span class="endpoint-slug">/api/chat</span>
                            <span class="endpoint-info">Hashan-md AI / ChatGPT-4o Smart Interface</span>
                        </div>
                        <span class="arrow-icon">▶</span>
                    </div>
                    <div class="api-docs">
                        <div class="docs-section-title">Execution Gateway Endpoint</div>
                        <div class="url-box-container">
                            <div class="url-display" id="url-chat">/api/chat?prompt=Hi&apikey=MR_HASHUU_SECRET_123</div>
                            <button class="btn-action btn-copy" onclick="copyLink('url-chat')">Copy</button>
                            <button class="btn-action btn-run" onclick="runEndpoint('url-chat', 'res-chat', this)">Run API</button>
                        </div>
                        <div class="docs-section-title">Live Server Response Output</div>
                        <pre class="json-preview" id="res-chat">{ "status": "idle", "message": "Click Run API to view live server stream data." }</pre>
                    </div>
                </div>

                <div class="api-wrapper" data-name="cuttly shorten url link tinyurl link-shortener short">
                    <div class="api-row" onclick="toggleAccordion(this)">
                        <div class="meta-details">
                            <span class="endpoint-slug">/api/url_shorten</span>
                            <span class="endpoint-info">Cuttly Professional Link Shortener Engine</span>
                        </div>
                        <span class="arrow-icon">▶</span>
                    </div>
                    <div class="api-docs">
                        <div class="docs-section-title">Execution Gateway Endpoint</div>
                        <div class="url-box-container">
                            <div class="url-display" id="url-shorten">/api/url_shorten?link=https://apis.davidcyril.name.ng&apikey=MR_HASHUU_SECRET_123</div>
                            <button class="btn-action btn-copy" onclick="copyLink('url-shorten')">Copy</button>
                            <button class="btn-action btn-run" onclick="runEndpoint('url-shorten', 'res-shorten', this)">Run API</button>
                        </div>
                        <div class="docs-section-title">Live Server Response Output</div>
                        <pre class="json-preview" id="res-shorten">{ "status": "idle", "message": "Click Run API to view live server stream data." }</pre>
                    </div>
                </div>

                <div class="api-wrapper" data-name="xvideo xvideos adult downloader download mp4 hot clip video premium">
                    <div class="api-row" onclick="toggleAccordion(this)">
                        <div class="meta-details">
                            <span class="endpoint-slug">/xvideo</span>
                            <span class="endpoint-info">XVideos Video MP4 Direct CDN Resolver</span>
                        </div>
                        <span class="arrow-icon">▶</span>
                    </div>
                    <div class="api-docs">
                        <div class="docs-section-title">Execution Gateway Endpoint</div>
                        <div class="url-box-container">
                            <div class="url-display" id="url-xvideo">/xvideo?url=https://www.xvideos.com/video.hppakie6a79/mia_khalifa&apikey=MR_HASHUU_SECRET_123</div>
                            <button class="btn-action btn-copy" onclick="copyLink('url-xvideo')">Copy</button>
                            <button class="btn-action btn-run" onclick="runEndpoint('url-xvideo', 'res-xvideo', this)">Run API</button>
                        </div>
                        <div class="docs-section-title">Live Server Response Output</div>
                        <pre class="json-preview" id="res-xvideo">{ "status": "idle", "message": "Click Run API to view live server stream data." }</pre>
                    </div>
                </div>

                <div class="api-wrapper" data-name="ytmp4 youtube video downloader download mp4 high quality clip video">
                    <div class="api-row" onclick="toggleAccordion(this)">
                        <div class="meta-details">
                            <span class="endpoint-slug">/ytmp4</span>
                            <span class="endpoint-info">YouTube HD Video MP4 High-Speed Extractor</span>
                        </div>
                        <span class="arrow-icon">▶</span>
                    </div>
                    <div class="api-docs">
                        <div class="docs-section-title">Execution Gateway Endpoint</div>
                        <div class="url-box-container">
                            <div class="url-display" id="url-ytmp4">/ytmp4?url=https://youtube.com/watch?v=MwpMEbgC7DA&apikey=MR_HASHUU_SECRET_123</div>
                            <button class="btn-action btn-copy" onclick="copyLink('url-ytmp4')">Copy</button>
                            <button class="btn-action btn-run" onclick="runEndpoint('url-ytmp4', 'res-ytmp4', this)">Run API</button>
                        </div>
                        <div class="docs-section-title">Live Server Response Output</div>
                        <pre class="json-preview" id="res-ytmp4">{ "status": "idle", "message": "Click Run API to view live server stream data." }</pre>
                    </div>
                </div>

                <div class="api-wrapper" data-name="mediafire downloader direct storage parser">
                    <div class="api-row" onclick="toggleAccordion(this)">
                        <div class="meta-details">
                            <span class="endpoint-slug">/mediafire</span>
                            <span class="endpoint-info">Mediafire Direct Link Storage Parser Engine</span>
                        </div>
                        <span class="arrow-icon">▶</span>
                    </div>
                    <div class="api-docs">
                        <div class="docs-section-title">Execution Gateway Endpoint</div>
                        <div class="url-box-container">
                            <div class="url-display" id="url-mf">/mediafire?url=https://www.mediafire.com/file/n6tgcrktbnov1oy/Queen_Anita-V4.zip/file&apikey=MR_HASHUU_SECRET_123</div>
                            <button class="btn-action btn-copy" onclick="copyLink('url-mf')">Copy</button>
                            <button class="btn-action btn-run" onclick="runEndpoint('url-mf', 'res-mf', this)">Run API</button>
                        </div>
                        <div class="docs-section-title">Live Server Response Output</div>
                        <pre class="json-preview" id="res-mf">{ "status": "idle", "message": "Click Run API to view live server stream data." }</pre>
                    </div>
                </div>

                <div class="api-wrapper" data-name="spotify music hq audio downloader song">
                    <div class="api-row" onclick="toggleAccordion(this)">
                        <div class="meta-details">
                            <span class="endpoint-slug">/spotify</span>
                            <span class="endpoint-info">Spotify Premium Lossless Audio Extractor</span>
                        </div>
                        <span class="arrow-icon">▶</span>
                    </div>
                    <div class="api-docs">
                        <div class="docs-section-title">Execution Gateway Endpoint</div>
                        <div class="url-box-container">
                            <div class="url-display" id="url-sf">/spotify?url=https://open.spotify.com/track/285pBltuF7vW8TeWk8hdRR&apikey=MR_HASHUU_SECRET_123</div>
                            <button class="btn-action btn-copy" onclick="copyLink('url-sf')">Copy</button>
                            <button class="btn-action btn-run" onclick="runEndpoint('url-sf', 'res-sf', this)">Run API</button>
                        </div>
                        <div class="docs-section-title">Live Server Response Output</div>
                        <pre class="json-preview" id="res-sf">{ "status": "idle", "message": "Click Run API to view live server stream data." }</pre>
                    </div>
                </div>

                <div class="api-wrapper" data-name="twitter x stream extractor multi video">
                    <div class="api-row" onclick="toggleAccordion(this)">
                        <div class="meta-details">
                            <span class="endpoint-slug">/twitter</span>
                            <span class="endpoint-info">Twitter / X Multi-Quality Stream CDN Resolver</span>
                        </div>
                        <span class="arrow-icon">▶</span>
                    </div>
                    <div class="api-docs">
                        <div class="docs-section-title">Execution Gateway Endpoint</div>
                        <div class="url-box-container">
                            <div class="url-display" id="url-tw">/twitter?url=https://x.com/elonmusk/status/1870901510319833540&apikey=MR_HASHUU_SECRET_123</div>
                            <button class="btn-action btn-copy" onclick="copyLink('url-tw')">Copy</button>
                            <button class="btn-action btn-run" onclick="runEndpoint('url-tw', 'res-tw', this)">Run API</button>
                        </div>
                        <div class="docs-section-title">Live Server Response Output</div>
                        <pre class="json-preview" id="res-tw">{ "status": "idle", "message": "Click Run API to view live server stream data." }</pre>
                    </div>
                </div>

                <div class="api-wrapper" data-name="song youtube play mp3 audio music stream">
                    <div class="api-row" onclick="toggleAccordion(this)">
                        <div class="meta-details">
                            <span class="endpoint-slug">/song</span>
                            <span class="endpoint-info">YouTube High-Fidelity Audio Stream Grabber</span>
                        </div>
                        <span class="arrow-icon">▶</span>
                    </div>
                    <div class="api-docs">
                        <div class="docs-section-title">Execution Gateway Endpoint</div>
                        <div class="url-box-container">
                            <div class="url-display" id="url-sg">/song?text=faded&apikey=MR_HASHUU_SECRET_123</div>
                            <button class="btn-action btn-copy" onclick="copyLink('url-sg')">Copy</button>
                            <button class="btn-action btn-run" onclick="runEndpoint('url-sg', 'res-sg', this)">Run API</button>
                        </div>
                        <div class="docs-section-title">Live Server Response Output</div>
                        <pre class="json-preview" id="res-sg">{ "status": "idle", "message": "Click Run API to view live server stream data." }</pre>
                    </div>
                </div>

                <div class="api-wrapper" data-name="tiktok video downloader no watermark">
                    <div class="api-row" onclick="toggleAccordion(this)">
                        <div class="meta-details">
                            <span class="endpoint-slug">/tiktok</span>
                            <span class="endpoint-info">TikTok Studio Source No-Watermark Downloader</span>
                        </div>
                        <span class="arrow-icon">▶</span>
                    </div>
                    <div class="api-docs">
                        <div class="docs-section-title">Execution Gateway Endpoint</div>
                        <div class="url-box-container">
                            <div class="url-display" id="url-tk">/tiktok?url=https://vm.tiktok.com/ZM6789/&apikey=MR_HASHUU_SECRET_123</div>
                            <button class="btn-action btn-copy" onclick="copyLink('url-tk')">Copy</button>
                            <button class="btn-action btn-run" onclick="runEndpoint('url-tk', 'res-tk', this)">Run API</button>
                        </div>
                        <div class="docs-section-title">Live Server Response Output</div>
                        <pre class="json-preview" id="res-tk">{ "status": "idle", "message": "Click Run API to view live server stream data." }</pre>
                    </div>
                </div>

                <div class="api-wrapper" data-name="pinterest image search visual hd download">
                    <div class="api-row" onclick="toggleAccordion(this)">
                        <div class="meta-details">
                            <span class="endpoint-slug">/pinterest</span>
                            <span class="endpoint-info">Pinterest Ultra-HD Media Image Source Finder</span>
                        </div>
                        <span class="arrow-icon">▶</span>
                    </div>
                    <div class="api-docs">
                        <div class="docs-section-title">Execution Gateway Endpoint</div>
                        <div class="url-box-container">
                            <div class="url-display" id="url-pin">/pinterest?text=cyberpunk&apikey=MR_HASHUU_SECRET_123</div>
                            <button class="btn-action btn-copy" onclick="copyLink('url-pin')">Copy</button>
                            <button class="btn-action btn-run" onclick="runEndpoint('url-pin', 'res-pin', this)">Run API</button>
                        </div>
                        <div class="docs-section-title">Live Server Response Output</div>
                        <pre class="json-preview" id="res-pin">{ "status": "idle", "message": "Click Run API to view live server stream data." }</pre>
                    </div>
                </div>

                <div class="api-wrapper" data-name="apk android package app mirror tool download">
                    <div class="api-row" onclick="toggleAccordion(this)">
                        <div class="meta-details">
                            <span class="endpoint-slug">/apk</span>
                            <span class="endpoint-info">Android App Core Binary Package Mirror Fetcher</span>
                        </div>
                        <span class="arrow-icon">▶</span>
                    </div>
                    <div class="api-docs">
                        <div class="docs-section-title">Execution Gateway Endpoint</div>
                        <div class="url-box-container">
                            <div class="url-display" id="url-apk">/apk?text=whatsapp&apikey=MR_HASHUU_SECRET_123</div>
                            <button class="btn-action btn-copy" onclick="copyLink('url-apk')">Copy</button>
                            <button class="btn-action btn-run" onclick="runEndpoint('url-apk', 'res-apk', this)">Run API</button>
                        </div>
                        <div class="docs-section-title">Live Server Response Output</div>
                        <pre class="json-preview" id="res-apk">{ "status": "idle", "message": "Click Run API to view live server stream data." }</pre>
                    </div>
                </div>

                <div class="api-wrapper" data-name="facebook fb video resolver cdn download">
                    <div class="api-row" onclick="toggleAccordion(this)">
                        <div class="meta-details">
                            <span class="endpoint-slug">/facebook</span>
                            <span class="endpoint-info">Facebook Architecture Video Stream Extractor</span>
                        </div>
                        <span class="arrow-icon">▶</span>
                    </div>
                    <div class="api-docs">
                        <div class="docs-section-title">Execution Gateway Endpoint</div>
                        <div class="url-box-container">
                            <div class="url-display" id="url-fb">/facebook?url=https://www.facebook.com/watch/?v=123&apikey=MR_HASHUU_SECRET_123</div>
                            <button class="btn-action btn-copy" onclick="copyLink('url-fb')">Copy</button>
                            <button class="btn-action btn-run" onclick="runEndpoint('url-fb', 'res-fb', this)">Run API</button>
                        </div>
                        <div class="docs-section-title">Live Server Response Output</div>
                        <pre class="json-preview" id="res-fb">{ "status": "idle", "message": "Click Run API to view live server stream data." }</pre>
                    </div>
                </div>

                <div class="api-wrapper" data-name="webdl website clone html static site page download">
                    <div class="api-row" onclick="toggleAccordion(this)">
                        <div class="meta-details">
                            <span class="endpoint-slug">/webdl</span>
                            <span class="endpoint-info">Static Production Webpage Structural Pack Cloner</span>
                        </div>
                        <span class="arrow-icon">▶</span>
                    </div>
                    <div class="api-docs">
                        <div class="docs-section-title">Execution Gateway Endpoint</div>
                        <div class="url-box-container">
                            <div class="url-display" id="url-wdl">/webdl?url=https://example.com&apikey=MR_HASHUU_SECRET_123</div>
                            <button class="btn-action btn-copy" onclick="copyLink('url-wdl')">Copy</button>
                            <button class="btn-action btn-run" onclick="runEndpoint('url-wdl', 'res-wdl', this)">Run API</button>
                        </div>
                        <div class="docs-section-title">Live Server Response Output</div>
                        <pre class="json-preview" id="res-wdl">{ "status": "idle", "message": "Click Run API to view live server stream data." }</pre>
                    </div>
                </div>

                <div class="api-wrapper" data-name="obfuscate javascript security protection code hide encrypt">
                    <div class="api-row" onclick="toggleAccordion(this)">
                        <div class="meta-details">
                            <span class="endpoint-slug">/obfuscate</span>
                            <span class="endpoint-info">Dynamic Structural JavaScript Anti-Scrape Guardian</span>
                        </div>
                        <span class="arrow-icon">▶</span>
                    </div>
                    <div class="api-docs">
                        <div class="docs-section-title">Execution Gateway Endpoint</div>
                        <div class="url-box-container">
                            <div class="url-display" id="url-obf">/obfuscate?code=console.log('hashu')&apikey=MR_HASHUU_SECRET_123</div>
                            <button class="btn-action btn-copy" onclick="copyLink('url-obf')">Copy</button>
                            <button class="btn-action btn-run" onclick="runEndpoint('url-obf', 'res-obf', this)">Run API</button>
                        </div>
                        <div class="docs-section-title">Live Server Response Output</div>
                        <pre class="json-preview" id="res-obf">{ "status": "idle", "message": "Click Run API to view live server stream data." }</pre>
                    </div>
                </div>

                <div class="api-wrapper" data-name="imgbb photo cloud cdn image host upload post">
                    <div class="api-row" onclick="toggleAccordion(this)">
                        <div class="meta-details">
                            <span class="endpoint-slug">/imgbb (POST)</span>
                            <span class="endpoint-info">Multipart Binary Object Cloud Image CDN Interface</span>
                        </div>
                        <span class="arrow-icon">▶</span>
                    </div>
                    <div class="api-docs">
                        <div class="docs-section-title">HTTP METHOD COMPONENT</div>
                        <div class="url-display" style="color:var(--apple-cyan)">POST DIRECT ACCESS (Multipart Form-Data)</div>
                        <div class="docs-section-title">Live Server Response Output</div>
                        <pre class="json-preview">{ "info": "Requires file attachment. Real-time REST testing disabled in UI dashboard console." }</pre>
                    </div>
                </div>

                <div id="no-results">// SEARCH ATTRIBUTE MISMATCHED //</div>
            </div>

            <footer>
                <span>© 2026 MR HASHUU</span>
                <a href="#" class="buy-btn">REQUEST CORE ACCESS</a>
            </footer>
        </div>

        <script>
            window.addEventListener('DOMContentLoaded', () => {
                setTimeout(() => {
                    const loader = document.getElementById('cyber-loader');
                    const mainUI = document.getElementById('main-interface');
                    loader.style.opacity = '0';
                    setTimeout(() => {
                        loader.remove();
                        mainUI.classList.add('system-ready');
                    }, 400);
                }, 1200);
            });

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
                const noResults = document.getElementById('no-results');
                let found = false;

                for (let i = 0; i < wrappers.length; i++) {
                    const dataTags = wrappers[i].getAttribute('data-name');
                    if (dataTags.includes(query)) {
                        wrappers[i].style.display = 'block';
                        found = true;
                    } else {
                        wrappers[i].style.display = 'none';
                    }
                }
                noResults.style.display = found ? 'none' : 'block';
            }

            function copyLink(elementId) {
                const pathText = document.getElementById(elementId).textContent.trim();
                const fullUrl = window.location.origin + pathText;
                
                if (navigator.clipboard && window.isSecureContext) {
                    navigator.clipboard.writeText(fullUrl).then(() => {
                        triggerToast();
                    }).catch(() => fallbackCopyEngine(fullUrl));
                } else {
                    fallbackCopyEngine(fullUrl);
                }
            }

            function fallbackCopyEngine(textToCopy) {
                const textArea = document.createElement("textarea");
                textArea.value = textToCopy;
                textArea.style.position = "fixed"; 
                textArea.style.opacity = "0";
                document.body.appendChild(textArea);
                textArea.focus();
                textArea.select();
                try {
                    document.execCommand('copy');
                    triggerToast();
                } catch (err) {
                    console.error('Fallback copy engine error', err);
                }
                document.body.removeChild(textArea);
            }

            function triggerToast() {
                const toast = document.getElementById('toast-alert');
                toast.classList.add('show');
                setTimeout(() => toast.classList.remove('show'), 2000);
            }

            async function runEndpoint(urlElementId, responseContainerId, buttonElement) {
                const pathText = document.getElementById(urlElementId).textContent.trim();
                const absoluteTargetUrl = window.location.origin + pathText;
                const outputConsole = document.getElementById(responseContainerId);

                buttonElement.innerText = "RUNNING...";
                buttonElement.disabled = true;
                outputConsole.textContent = "// TRANSMITTING SECURE SIGNAL... //";
                outputConsole.style.color = "var(--apple-cyan)";

                try {
                    const webStreamResponse = await fetch(absoluteTargetUrl);
                    const systemJsonPayload = await webStreamResponse.json();
                    
                    outputConsole.textContent = JSON.stringify(systemJsonPayload, null, 2);
                    outputConsole.style.color = "var(--apple-green)";
                } catch (serverException) {
                    outputConsole.textContent = JSON.stringify({
                        success: false,
                        error: "Network stream deployment interrupted",
                        exception_log: serverException.message
                    }, null, 2);
                    outputConsole.style.color = "var(--apple-red)";
                } finally {
                    buttonElement.innerText = "RUN API";
                    buttonElement.disabled = false;
                }
            }
        </script>
    </body>
    </html>
    `);
});

// ─────────────────────────────────────────────────────────
// 🛠️ BACKEND CONTROLLERS LOGIC (CLEAN ONLY)
// ─────────────────────────────────────────────────────────

// 0. CHATGPT-4o SMART INTERFACE
app.get('/api/chat', strictAuthGate, async (req, res) => {
    try {
        const { prompt } = req.query;
        if (!prompt) return res.json({ success: false, message: "Prompt parameter missing!" });

        const cleanPrompt = prompt.toLowerCase().trim();

        // Custom Keyword Interceptions
        if (cleanPrompt === 'hi') {
            return res.json({
                creator: "MR HASHUU",
                status: "Authenticated",
                success: true,
                result: "Hellow Im Hashuu Ai Service"
            });
        }

        if (cleanPrompt === 'kawad bn') {
            return res.json({
                creator: "MR HASHUU",
                status: "Authenticated",
                success: true,
                result: "huththak kwa"
            });
        }

        const customSystemPrompt = "You are Hashan-md AI, a brilliant, helpful AI assistant developed and owned by MR HASHUU. Always respond in an intelligent and smart manner.";
        const targetUrl = `https://apis.davidcyriltech.my.id/ai/chatgpt?prompt=${encodeURIComponent(prompt)}&model=gpt-4o&system=${encodeURIComponent(customSystemPrompt)}`;
        
        const { data } = await axios.get(targetUrl);
        const aiReply = data?.data?.choices?.[0]?.message?.content || "AI Server experienced a temporary structural break. Retry.";

        res.json({
            creator: "MR HASHUU",
            status: "Authenticated",
            success: true,
            result: aiReply
        });
    } catch (e) {
        res.json({ success: false, message: e.message });
    }
});

// 1. CUTTLY URL SHORTENER
app.get('/api/url_shorten', strictAuthGate, async (req, res) => {
    try {
        const { link } = req.query;
        if (!link) return res.json({ success: false, message: "Link parameter missing!" });

        const { data } = await axios.get(`https://apis.davidcyriltech.my.id/cuttly?link=${encodeURIComponent(link)}`);
        
        if (data.success) {
            res.json({
                creator: "MR HASHUU",
                status: "Authenticated",
                success: true,
                original_url: data.original_url,
                shortened_url: data.shortened_url
            });
        } else {
            res.json({ success: false, message: "URL shortening failed at external server gate." });
        }
    } catch (e) {
        res.json({ success: false, message: e.message });
    }
});

// 2. XVIDEOS DOWNLOADER
app.get('/xvideo', strictAuthGate, async (req, res) => {
    try {
        const { url } = req.query;
        if (!url) return res.json({ success: false, message: "XVideo URL required!" });
        const { data } = await axios.get(`https://apis.davidcyriltech.my.id/xvideo?url=${encodeURIComponent(url)}`);
        if (data.success) {
            res.json({ creator: "MR HASHUU", status: "Authenticated", success: true, title: data.title, thumbnail: data.thumbnail, download_url: data.download_url });
        } else { res.json({ success: false, message: "Conversion failed or invalid source link." }); }
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
        } else { res.json({ success: false, message: "Invalid YouTube URL or media conversion failed." }); }
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
        if (!text) return res.json({ success: false, message: "Song name or YouTube URL required" });
        const { data } = await axios.get(`https://apis.davidcyriltech.my.id/play?query=${encodeURIComponent(text)}`);
        if (data.status && data.result) {
            res.json({ creator: "MR HASHUU", status: "Authenticated", success: true, result: data.result });
        } else { res.json({ success: false, message: "Failed to fetch song from server." }); }
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
        } else { res.json({ success: false, message: "Invalid TikTok URL or media not found." }); }
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

// ENGINE LISTENER PORT
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Apple Matrix HASHU-API Engine Running on port ${PORT}`));

module.exports = app;
