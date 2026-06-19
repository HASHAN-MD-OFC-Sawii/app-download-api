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

// ─────────────────────────────────────────────────────────
// 🔑 AUTHORIZED PREMIUM API KEYS DATABASE
// ─────────────────────────────────────────────────────────
const PREMIUM_DATABASE = {
    "HASHUU_PRO_KING_99": { owner: "Kasun", plan: "PREMIUM" },
    "MR_HASHUU_SECRET_123": { owner: "Admin/Owner", plan: "PRO" },
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
            creator: "Mr Hashuu Ofc",
            message: "Access Denied! API Key is missing. Append '?apikey=YOUR_KEY' to your URL."
        });
    }
    if (!PREMIUM_DATABASE[apikey]) {
        return res.status(403).json({
            success: false,
            creator: "Mr Hashuu Ofc",
            message: "Access Denied! Invalid API Key. Contact MR HASHUU for a valid key."
        });
    }
    req.planOwner = PREMIUM_DATABASE[apikey].owner;
    req.planType = PREMIUM_DATABASE[apikey].plan;
    return premiumLimiter(req, res, next);
};

// ─────────────────────────────────────────────────────────
// 🌌 APPLE PRO DIGITAL MATRIX INTERACTION UI
// ─────────────────────────────────────────────────────────
app.get('/', (req, res) => {
    res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>MR HASHUU FREE API</title>
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
        
        <style>
            :root {
                --apple-black: #000000;
                --apple-dark-gray: #161617;
                --apple-card: #1c1c1e;
                --apple-border: rgba(255, 255, 255, 0.08);
                --apple-cyan: #29b6f6;
                --apple-blue: #0071e3;
                --apple-green: #34c759;
                --apple-red: #ff453a;
                --text-main: #f5f5f7;
                --text-muted: #86868b;
            }
            
            * { box-sizing: border-box; margin: 0; padding: 0; }
            
            body {
                background-color: var(--apple-black);
                color: var(--text-main);
                font-family: -apple-system, BlinkMacSystemFont, "Inter", "SF Pro Display", sans-serif;
                min-height: 100vh;
                display: flex;
                justify-content: center;
                align-items: center;
                overflow-x: hidden;
                padding: 40px 0;
            }

            /* 🔥 APPLE STUDIO SHUTTER LOADER */
            #cyber-loader {
                position: fixed;
                top: 0; left: 0; width: 100vw; height: 100vh;
                background: var(--apple-black);
                z-index: 9999;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                transition: opacity 0.4s ease-out;
            }

            .apple-loading-wrapper {
                position: relative;
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 20px;
            }

            .smooth-aura-glow {
                width: 60px; height: 60px;
                border: 3px solid rgba(255, 255, 255, 0.05);
                border-top-color: #ffffff;
                border-radius: 50%;
                animation: appleSpin 0.8s cubic-bezier(0.4, 0, 0.2, 1) infinite;
            }

            .loader-brand {
                font-size: 0.85rem; font-weight: 600; color: #ffffff;
                letter-spacing: 3px; text-transform: uppercase; opacity: 0.7;
            }

            @keyframes appleSpin { to { transform: rotate(360deg); } }

            /* Premium Minimal Master Box */
            .vercel-box {
                width: 92%; max-width: 520px;
                background: rgba(22, 22, 23, 0.8);
                backdrop-filter: blur(40px); -webkit-backdrop-filter: blur(40px);
                border: 1px solid var(--apple-border); border-radius: 20px;
                padding: 26px; z-index: 2;
                box-shadow: 0 30px 70px rgba(0, 0, 0, 0.7);
                opacity: 0; transform: scale(0.98);
                transition: opacity 0.5s cubic-bezier(0.16, 1, 0.3, 1), transform 0.5s cubic-bezier(0.16, 1, 0.3, 1);
            }

            .vercel-box.system-ready { opacity: 1; transform: scale(1); }

            header { display: flex; justify-content: space-between; align-items: center; padding-bottom: 18px; border-bottom: 1px solid var(--apple-border); }
            header h1 { font-size: 1.25rem; font-weight: 600; letter-spacing: -0.5px; color: #ffffff; }

            /* Status Pill */
            .status-container {
                display: inline-flex; align-items: center; gap: 6px;
                font-size: 0.65rem; font-weight: 600; letter-spacing: 0.5px;
                color: var(--apple-green); background: rgba(52, 199, 89, 0.1);
                padding: 5px 12px; border-radius: 30px;
            }
            .pulse-dot { width: 6px; height: 6px; background: var(--apple-green); border-radius: 50%; }

            /* Analytics Counters Grid */
            .analytics-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; margin-top: 18px; }
            .stat-card {
                background: rgba(255, 255, 255, 0.02); border: 1px solid var(--apple-border); border-radius: 12px;
                padding: 12px 6px; text-align: center;
            }
            .stat-label { font-size: 0.58rem; font-weight: 600; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.3px; }
            .stat-value { font-size: 0.95rem; font-weight: 600; color: #ffffff; margin-top: 3px; }

            /* Filter Input Search Box */
            .search-container { position: relative; margin-top: 18px; }
            .search-input {
                width: 100%; padding: 12px 16px; background: rgba(0, 0, 0, 0.3);
                border: 1px solid var(--apple-border); border-radius: 12px;
                color: #ffffff; font-size: 0.85rem; outline: none; transition: all 0.2s;
            }
            .search-input:focus { border-color: rgba(255,255,255,0.25); background: rgba(0, 0, 0, 0.5); }
            ::placeholder { color: #55555a; }

            /* Workspace Lists Layout */
            .endpoint-list { margin-top: 20px; display: flex; flex-direction: column; gap: 10px; }
            
            .api-wrapper {
                background: rgba(255, 255, 255, 0.01); border: 1px solid var(--apple-border);
                border-radius: 14px; overflow: hidden; transition: all 0.2s;
            }
            .api-wrapper:hover { border-color: rgba(255, 255, 255, 0.15); background: rgba(255, 255, 255, 0.02); }
            
            .api-row { padding: 16px; display: flex; justify-content: space-between; align-items: center; cursor: pointer; }
            .meta-details { display: flex; flex-direction: column; gap: 2px; max-width: 85%; }
            .endpoint-slug { font-size: 0.95rem; font-weight: 600; color: #ffffff; font-family: monospace; }
            .endpoint-info { font-size: 0.74rem; color: var(--text-muted); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
            .arrow-icon { font-size: 0.7rem; color: #444; transition: transform 0.2s; }
            
            /* Active Expand Configuration */
            .api-wrapper.active { border-color: rgba(255, 255, 255, 0.25); background: rgba(255, 255, 255, 0.02); }
            .api-wrapper.active .arrow-icon { transform: rotate(90deg); color: #fff; }

            /* Core Premium Documentation Panel */
            .api-docs {
                display: none; padding: 0 16px 16px 16px; border-top: 1px solid rgba(255, 255, 255, 0.04);
                background: rgba(0,0,0,0.15); animation: appleReveal 0.2s ease-out;
            }
            @keyframes appleReveal { from { opacity: 0; transform: translateY(-3px); } to { opacity: 1; transform: translateY(0); } }

            .docs-section-title { font-size: 0.62rem; font-weight: 600; color: var(--text-muted); text-transform: uppercase; margin: 12px 0 6px 0; letter-spacing: 0.5px; }
            
            /* Action Buttons Layout styling */
            .url-box-container { display: flex; gap: 6px; margin-top: 6px; }
            .url-display {
                flex-grow: 1; background: #000000; border: 1px solid var(--apple-border); padding: 10px;
                border-radius: 8px; font-family: monospace; font-size: 0.7rem; color: #a1a1a6;
                overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
            }

            .btn-action {
                border: none; font-size: 0.65rem; font-weight: 600; padding: 0 12px; border-radius: 8px; cursor: pointer; text-transform: uppercase; transition: all 0.2s;
            }
            .btn-copy { background: #ffffff; color: #000000; }
            .btn-copy:hover { opacity: 0.85; }
            
            .btn-run { background: var(--apple-blue); color: #ffffff; }
            .btn-run:hover { opacity: 0.9; }

            /* Real Live Web Request Console Screen */
            .json-preview {
                background: #000000; border: 1px solid var(--apple-border); border-radius: 8px;
                padding: 12px; font-family: monospace; font-size: 0.66rem; color: #888;
                white-space: pre-wrap; overflow-x: auto; max-height: 140px; transition: color 0.2s;
            }

            /* Notification Banner Dynamic pop */
            #toast-alert {
                position: fixed; bottom: 40px; background: rgba(255, 255, 255, 0.95); backdrop-filter: blur(10px);
                color: #000000; font-weight: 600; font-size: 0.72rem; padding: 10px 20px; border-radius: 20px;
                z-index: 10000; opacity: 0; transform: translateY(10px); pointer-events: none;
                transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
            }
            #toast-alert.show { opacity: 1; transform: translateY(0); }

            #no-results { display: none; text-align: center; padding: 40px; font-size: 0.75rem; color: var(--text-muted); font-family: monospace; }
            footer { display: flex; justify-content: space-between; align-items: center; font-size: 0.7rem; color: var(--text-muted); border-top: 1px solid var(--apple-border); padding-top: 16px; margin-top: 12px; }
            .buy-btn { color: #ffffff; text-decoration: none; font-weight: 600; }
        </style>
    </head>
    <body>

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
                    <span>SYSTEM</span>
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
                    <div class="stat-label">Creator</div>
                    <div class="stat-value">/hashuh</div>
                </div>
            </div>

            <div class="search-container">
                <input type="text" id="apiSearch" class="search-input" placeholder="Search developer secure endpoints..." onkeyup="filterEndpoints()">
            </div>

            <div class="endpoint-list" id="listWrapper">
                
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
                            <div class="url-display" id="url-xvideo">/xvideo?url=https://www.xvideos.com/video.hppakie6a79/mia_khalifa_fucks_a_fanboy&apikey=MR_HASHUU_SECRET_123</div>
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
                            <div class="url-display" id="url-sf">/spotify?url=https://open.spotify.com/track/285pBltuF7vW8TeWk8hdRR?si=HWuMcdM3RJ6Yy0b7Uc7uGQ&apikey=MR_HASHUU_SECRET_123</div>
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
                <a href="https://wa.me/your-number-here" target="_blank" class="buy-btn">REQUEST CORE ACCESS</a>
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
                    console.error('Fallback engine failed compilation', err);
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
                outputConsole.textContent = "// TRANSMITTING SECURE MATRIX HANDSHAKE SIGNAL... //";
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
// 🛠️ ALL 13 BACKEND API CONTROLLERS (PROTECTED WITH AUTH)
// ─────────────────────────────────────────────────────────

// 🆕 1. XVIDEOS CONTROLLER
app.get('/xvideo', strictAuthGate, async (req, res) => {
    try {
        const { url } = req.query;
        if (!url) return res.json({ success: false, message: "XVideo URL required!" });
        
        const { data } = await axios.get(`https://apis.davidcyriltech.my.id/xvideo?url=${encodeURIComponent(url)}`);
        
        if (data.success) {
            res.json({ 
                creator: "Mr Hashuu Ofc", 
                status: "Authenticated", 
                user: req.planOwner,
                plan: req.planType,
                success: true, 
                title: data.title,
                thumbnail: data.thumbnail,
                download_url: data.download_url
            });
        } else { 
            res.json({ success: false, message: "Conversion failed or invalid source link." }); 
        }
    } catch (e) { 
        res.json({ success: false, message: e.message }); 
    }
});

// 2. YOUTUBE MP4 CONTROLLER
app.get('/ytmp4', strictAuthGate, async (req, res) => {
    try {
        const { url } = req.query;
        if (!url) return res.json({ success: false, message: "YouTube URL required!" });
        const { data } = await axios.get(`https://apis.davidcyriltech.my.id/download/ytmp4?url=${encodeURIComponent(url)}`);
        if (data.success && data.result) {
            res.json({ creator: "Mr Hashuu Ofc", status: "Authenticated", user: req.planOwner, plan: req.planType, success: true, result: data.result });
        } else { res.json({ success: false, message: "Invalid YouTube URL or media conversion failed." }); }
    } catch (e) { res.json({ success: false, message: e.message }); }
});

// 3. MEDIAFIRE CONTROLLER
app.get('/mediafire', strictAuthGate, async (req, res) => {
    try {
        const { url } = req.query;
        if (!url) return res.json({ success: false, message: "Mediafire URL required!" });
        const { data } = await axios.get(`https://apis.davidcyriltech.my.id/mediafire?url=${encodeURIComponent(url)}`);
        res.json({ creator: "Mr Hashuu Ofc", status: "Authenticated", user: req.planOwner, plan: req.planType, success: true, result: data });
    } catch (e) { res.json({ success: false, message: e.message }); }
});

// 4. SPOTIFY CONTROLLER
app.get('/spotify', strictAuthGate, async (req, res) => {
    try {
        const { url } = req.query;
        if (!url) return res.json({ success: false, message: "Spotify URL required!" });
        const { data } = await axios.get(`https://apis.davidcyriltech.my.id/spotifydl?url=${encodeURIComponent(url)}`);
        res.json({ creator: "Mr Hashuu Ofc", status: "Authenticated", user: req.planOwner, plan: req.planType, success: true, result: data });
    } catch (e) { res.json({ success: false, message: e.message }); }
});

// 5. TWITTER CONTROLLER
app.get('/twitter', strictAuthGate, async (req, res) => {
    try {
        const { url } = req.query;
        if (!url) return res.json({ success: false, message: "Twitter URL required!" });
        const { data } = await axios.get(`https://apis.davidcyriltech.my.id/twitterV2?url=${encodeURIComponent(url)}`);
        res.json({ creator: "Mr Hashuu Ofc", status: "Authenticated", user: req.planOwner, plan: req.planType, success: true, result: data });
    } catch (e) { res.json({ success: false, message: e.message }); }
});

// 6. SONG CONTROLLER
app.get('/song', strictAuthGate, async (req, res) => {
    try {
        const { text } = req.query;
        if (!text) return res.json({ success: false, message: "Song name or YouTube URL required" });
        const { data } = await axios.get(`https://apis.davidcyriltech.my.id/play?query=${encodeURIComponent(text)}`);
        if (data.status && data.result) {
            res.json({ creator: "Mr Hashuu Ofc", status: "Authenticated", success: true, result: data.result });
        } else { res.json({ success: false, message: "Failed to fetch song from server." }); }
    } catch (e) { res.json({ success: false, message: e.message }); }
});

// 7. TIKTOK CONTROLLER
app.get('/tiktok', strictAuthGate, async (req, res) => {
    try {
        const { url } = req.query;
        if (!url) return res.json({ success: false, message: "TikTok URL required!" });
        const { data } = await axios.get(`https://apis.davidcyriltech.my.id/download/tiktok?url=${encodeURIComponent(url)}`);
        if (data.success && data.result) {
            res.json({ creator: "Mr Hashuu Ofc", status: "Authenticated", success: true, result: data.result });
        } else { res.json({ success: false, message: "Invalid TikTok URL or media not found." }); }
    } catch (e) { res.json({ success: false, message: e.message }); }
});

// 8. PINTEREST CONTROLLER
app.get('/pinterest', strictAuthGate, async (req, res) => {
    try {
        const { text } = req.query;
        if (!text) return res.json({ success: false, message: "Query text required" });
        const { data } = await axios.get(`https://apis.davidcyriltech.my.id/search/pinterest?text=${encodeURIComponent(text)}`);
        res.json({ creator: "Mr Hashuu Ofc", status: "Authenticated", success: true, result: data.result || [] });
    } catch (e) { res.json({ success: false, message: e.message }); }
});

// 9. APK CONTROLLER
app.get('/apk', strictAuthGate, async (req, res) => {
    try {
        const { text } = req.query;
        if (!text) return res.json({ success: false, message: "App name required" });
        const { data } = await axios.get(`https://apis.davidcyriltech.my.id/download/apk?text=${encodeURIComponent(text)}`, { headers: { 'User-Agent': 'Mozilla/5.0' }, timeout: 8000 });
        res.json({ creator: "Mr Hashuu Ofc", status: "Authenticated", success: true, result: data.apk || {} });
    } catch (e) { res.json({ success: false, message: e.message }); }
});

// 10. FACEBOOK CONTROLLER
app.get('/facebook', strictAuthGate, async (req, res) => {
    try {
        const { url } = req.query;
        if (!url) return res.json({ success: false, message: "URL parameter missing!" });
        const { data } = await axios.get(`https://apis.davidcyriltech.my.id/facebook2?url=${encodeURIComponent(url)}`);
        if (data.status) {
            res.json({ creator: "Mr Hashuu Ofc", status: "Authenticated", success: true, result: data.video });
        } else { res.json({ success: false, message: "Could not fetch video." }); }
    } catch (e) { res.json({ success: false, message: e.message }); }
});

// 11. WEBSITE CLONER CONTROLLER
app.get('/webdl', strictAuthGate, async (req, res) => {
    try {
        const { url } = req.query;
        if (!url) return res.json({ success: false, message: "Website URL required!" });
        const { data } = await axios.get(`https://apis.davidcyriltech.my.id/tools/downloadweb?url=${encodeURIComponent(url)}`);
        if (data.response && (data.response.success === true || data.response.success === "true")) {
            res.json({ creator: "Mr Hashuu Ofc", status: "Authenticated", success: true, result: { downloadUrl: data.response.downloadUrl, isFinished: data.response.isFinished } });
        } else { res.json({ success: false, message: "Failed to clone website." }); }
    } catch (e) { res.json({ success: false, message: e.message }); }
});

// 12. JS OBFUSCATOR CONTROLLER
app.get('/obfuscate', strictAuthGate, (req, res) => {
    try {
        const { code } = req.query;
        if (!code) return res.json({ success: false, message: "Code parameter missing!" });
        const obfuscatedCode = obfuscator.obfuscate(code, { compact: true, controlFlowFlattening: true, controlFlowFlatteningThreshold: 0.5 }).getObfuscatedCode();
        res.json({ creator: "Mr Hashuu Ofc", status: "Authenticated", success: true, result: obfuscatedCode });
    } catch (e) { res.json({ success: false, message: e.message }); }
});

// 13. IMGBB UPLOADER CONTROLLER
app.post('/imgbb', strictAuthGate, upload.single('file'), async (req, res) => {
    try {
        if (!req.file) return res.json({ success: false, message: "No file uploaded!" });
        const form = new FormData();
        form.append('file', req.file.buffer, { filename: req.file.originalname || 'image.jpg', contentType: req.file.mimetype });
        const { data } = await axios.post('https://apis.davidcyriltech.my.id/uploader/imgbb', form, { headers: { ...form.getHeaders(), 'User-Agent': 'Mozilla/5.0' } });
        if (data.success) { res.json({ creator: "Mr Hashuu Ofc", status: "Authenticated", success: true, result: data.data }); }
        else { res.json({ success: false, message: "Upload failed." }); }
    } catch (e) { res.json({ success: false, message: e.message }); }
});

// PORT LISTENER
if (require.main === module) {
    app.listen(3000, () => console.log("Apple Pro HASHU-API Engine Running on port 3000"));
}

module.exports = app;
