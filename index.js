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

// 🛡️ Premium Security Rate Limiter (5000 Req per day)
const premiumLimiter = rateLimit({
    windowMs: 24 * 60 * 60 * 1000, 
    max: 5000, 
    message: { success: false, message: "Premium daily limit reached! Contact MR HASHUU." }
});

// 🔒 Strict Gatekeeper Middleware
const strictAuthGate = (req, res, next) => {
    const { apikey } = req.query;

    if (!apikey) {
        return res.status(401).json({
            success: false,
            creator: "Mr Hashuu Bot",
            message: "Access Denied! API Key is missing. Append '?apikey=YOUR_KEY' to your URL."
        });
    }

    if (!PREMIUM_DATABASE[apikey]) {
        return res.status(403).json({
            success: false,
            creator: "Mr Hashuu Bot",
            message: "Access Denied! Invalid API Key. Contact MR HASHUU for a valid key."
        });
    }

    req.planOwner = PREMIUM_DATABASE[apikey].owner;
    req.planType = PREMIUM_DATABASE[apikey].plan;
    return premiumLimiter(req, res, next);
};

// ─────────────────────────────────────────────────────────
// 🌌 0. VERCEL DEEP DARK UI — THE ENTERPRISE MATRIX
// ─────────────────────────────────────────────────────────
app.get('/', (req, res) => {
    res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
        <title>MR HASHUU - Premium Core Matrix</title>
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&family=Space+Grotesk:wght@500;700;800&display=swap" rel="stylesheet">
        
        <style>
            :root {
                --vercel-black: #000000;
                --vercel-gray-dark: #040405;
                --vercel-gray-light: #09090b;
                --vercel-border: #1a1a1e;
                --vercel-text-muted: #8e8e93;
                --premium-cyan: #00F5FF;
                --premium-purple: #7B2CBF;
                --system-green: #00FF66;
                --neon-glow: 0 0 30px rgba(0, 245, 255, 0.2);
            }
            
            * { box-sizing: border-box; margin: 0; padding: 0; }
            
            body {
                background-color: var(--vercel-black);
                color: #ffffff;
                font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
                height: 100vh;
                width: 100vw;
                display: flex;
                justify-content: center;
                align-items: center;
                overflow: hidden;
                position: relative;
            }

            /* ──🔥 PRE-LOADER PREMIUM SPINNING CIRCLE ── */
            #cyber-loader {
                position: fixed;
                top: 0; left: 0; width: 100vw; height: 100vh;
                background: var(--vercel-black);
                z-index: 9999;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                transition: opacity 0.6s ease, filter 0.6s ease;
            }

            .spinner-container {
                position: relative;
                width: 120px;
                height: 120px;
                margin-bottom: 25px;
                display: flex;
                justify-content: center;
                align-items: center;
            }

            .circle-outer {
                position: absolute;
                width: 100%; height: 100%;
                border: 4px solid transparent;
                border-top-color: var(--premium-cyan);
                border-bottom-color: var(--premium-cyan);
                border-radius: 50%;
                animation: spinClockwise 1.8s linear infinite;
                filter: drop-shadow(0 0 12px var(--premium-cyan));
            }

            .circle-inner {
                position: absolute;
                width: 76%; height: 76%;
                border: 4px solid transparent;
                border-left-color: var(--premium-purple);
                border-right-color: var(--premium-purple);
                border-radius: 50%;
                animation: spinCounterClockwise 1.2s linear infinite;
                filter: drop-shadow(0 0 10px var(--premium-purple));
            }

            .spinner-center-text {
                font-family: 'Space Grotesk', sans-serif;
                font-size: 0.9rem;
                font-weight: 800;
                color: #ffffff;
                letter-spacing: 0.5px;
                animation: pulseText 1s infinite alternate ease-in-out;
            }

            @keyframes spinClockwise { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
            @keyframes spinCounterClockwise { 0% { transform: rotate(360deg); } 100% { transform: rotate(0deg); } }
            @keyframes pulseText { 0% { opacity: 0.5; } 100% { opacity: 1; } }

            .status-text {
                font-family: monospace; font-size: 0.75rem; font-weight: 800;
                color: var(--premium-cyan); letter-spacing: 1.5px; text-transform: uppercase;
                text-shadow: 0 0 10px rgba(0, 245, 255, 0.4);
            }

            /* Ambient Ambient Glows */
            .ambient-glow { position: absolute; width: 600px; height: 600px; border-radius: 50%; filter: blur(160px); opacity: 0.14; z-index: 0; pointer-events: none; }
            .glow-1 { background: var(--premium-purple); top: -15%; left: -10%; }
            .glow-2 { background: var(--premium-cyan); bottom: -15%; right: -10%; }

            /* Main Box Container */
            .vercel-box {
                width: 94%; max-width: 480px; height: 92vh;
                background: rgba(4, 4, 5, 0.8); backdrop-filter: blur(25px); -webkit-backdrop-filter: blur(25px);
                border: 1px solid var(--vercel-border); border-radius: 28px;
                padding: 22px; z-index: 2;
                display: flex; flex-direction: column; justify-content: space-between;
                box-shadow: 0 50px 150px rgba(0, 0, 0, 0.95);
                opacity: 0; transform: translateY(20px);
                transition: opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
            }

            header { display: flex; justify-content: space-between; align-items: center; padding-bottom: 12px; border-bottom: 1px solid var(--vercel-border); }
            header h1 {
                font-family: 'Space Grotesk', sans-serif; font-size: 1.35rem; font-weight: 800;
                letter-spacing: -0.5px; background: linear-gradient(135deg, #ffffff 40%, #888888 100%);
                -webkit-background-clip: text; -webkit-text-fill-color: transparent;
            }

            /* ──🔥 LIVE SERVER STATUS INDICATOR ── */
            .status-container {
                display: inline-flex; align-items: center; gap: 6px;
                font-size: 0.65rem; font-weight: 800; letter-spacing: 0.5px;
                color: var(--system-green); background: rgba(0, 255, 102, 0.05);
                padding: 5px 10px; border-radius: 8px; border: 1px solid rgba(0, 255, 102, 0.15);
            }
            .pulse-dot {
                width: 6px; height: 6px; background: var(--system-green); border-radius: 50%;
                animation: pulseGreen 1.2s infinite alternate;
            }
            @keyframes pulseGreen { 0% { box-shadow: 0 0 2px var(--system-green); opacity: 0.4; } 100% { box-shadow: 0 0 12px var(--system-green); opacity: 1; } }

            /* ──🔥 ADMIN ANALYTICS COUNTER CARD ── */
            .analytics-grid {
                display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; margin-top: 14px;
            }
            .stat-card {
                background: #08080a; border: 1px solid var(--vercel-border); border-radius: 12px;
                padding: 10px; text-align: center;
            }
            .stat-label { font-size: 0.58rem; font-weight: 800; color: var(--vercel-text-muted); text-transform: uppercase; letter-spacing: 0.5px; }
            .stat-value { font-family: 'Space Grotesk', sans-serif; font-size: 0.95rem; font-weight: 800; color: #ffffff; margin-top: 2px; }
            .value-cyan { color: var(--premium-cyan); }
            .value-purple { color: var(--premium-purple); }

            /* Search System */
            .search-container { position: relative; margin-top: 12px; }
            .search-input {
                width: 100%; padding: 12px 16px; background: #0c0c0e;
                border: 1px solid var(--vercel-border); border-radius: 14px;
                color: #ffffff; font-size: 0.88rem; font-weight: 700; outline: none;
            }
            .search-input:focus { border-color: var(--premium-cyan); box-shadow: 0 0 20px rgba(0, 245, 255, 0.1); }
            .search-input::placeholder { color: #444446; font-weight: 700; }

            /* Accordion Wrapper Area */
            .endpoint-list { flex-grow: 1; margin: 14px 0; overflow-y: auto; display: flex; flex-direction: column; gap: 10px; padding-right: 2px; }
            
            .api-wrapper {
                background: var(--vercel-gray-light); border: 1px solid var(--vercel-border);
                border-radius: 16px; overflow: hidden; transition: all 0.2s ease;
            }
            
            /* ──🔥 INTERACTIVE ACCORDION ROW ── */
            .api-row {
                padding: 14px 16px; display: flex; justify-content: space-between; align-items: center; cursor: pointer;
            }
            .api-wrapper:hover { border-color: #2b2b35; background: #0b0b0e; }

            .meta-details { display: flex; flex-direction: column; gap: 3px; max-width: 80%; }
            .endpoint-slug { font-family: 'Space Grotesk', monospace; font-size: 1.05rem; font-weight: 800; color: #ffffff; }
            .endpoint-info { font-size: 0.74rem; font-weight: 700; color: var(--vercel-text-muted); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

            .arrow-icon { font-size: 0.75rem; color: #444; transition: transform 0.25s ease; font-weight: 800; }
            .api-wrapper.active .arrow-icon { transform: rotate(90deg); color: var(--premium-cyan); }
            .api-wrapper.active { border-color: rgba(0, 245, 255, 0.3); box-shadow: var(--neon-glow); }

            /* ──🔥 DYNAMIC DOCUMENTATION AREA ── */
            .api-docs {
                display: none; padding: 0 16px 16px 16px; border-top: 1px dashed var(--vercel-border);
                background: rgba(0,0,0,0.2); animation: slideDown 0.2s ease forwards;
            }
            @keyframes slideDown { from { opacity: 0; } to { opacity: 1; } }

            .docs-section-title { font-size: 0.62rem; font-weight: 800; color: var(--premium-cyan); text-transform: uppercase; margin: 12px 0 5px 0; letter-spacing: 0.5px; }
            
            /* ──🔥 NEON COPY CLIPBOARD BUTTON ── */
            .url-box-container { display: flex; gap: 6px; margin-top: 4px; }
            .url-display {
                flex-grow: 1; background: #040405; border: 1px solid #1c1c22; padding: 8px 10px;
                border-radius: 8px; font-family: monospace; font-size: 0.68rem; font-weight: bold;
                color: #888; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
            }
            .btn-copy {
                background: #ffffff; color: #000000; border: none; font-size: 0.62rem; font-weight: 800;
                padding: 0 12px; border-radius: 8px; cursor: pointer; text-transform: uppercase; transition: all 0.2s;
            }
            .btn-copy:hover { background: var(--premium-cyan); box-shadow: 0 0 10px rgba(0,245,255,0.4); }

            .json-preview {
                background: #040405; border: 1px solid #121216; border-radius: 8px;
                padding: 8px; font-family: monospace; font-size: 0.64rem; font-weight: 700; color: #a5d6ff;
                white-space: pre-wrap; overflow-x: auto; max-height: 90px;
            }

            /* Custom Global Toast Alert System */
            #toast-alert {
                position: fixed; bottom: 6vh; background: linear-gradient(135deg, var(--premium-purple), var(--premium-cyan));
                color: #000; font-weight: 800; font-size: 0.78rem; padding: 10px 22px; border-radius: 12px;
                z-index: 10000; opacity: 0; transform: translateY(10px); pointer-events: none;
                transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                box-shadow: 0 10px 30px rgba(0,245,255,0.4);
            }
            #toast-alert.show { opacity: 1; transform: translateY(0); }

            #no-results { display: none; text-align: center; padding: 30px; font-size: 0.82rem; font-weight: 700; color: var(--vercel-text-muted); font-family: monospace; }
            ::-webkit-scrollbar { width: 4px; }
            ::-webkit-scrollbar-thumb { background: #18181c; border-radius: 20px; }

            footer { display: flex; justify-content: space-between; align-items: center; font-size: 0.72rem; font-weight: 700; color: var(--vercel-text-muted); border-top: 1px solid var(--vercel-border); padding-top: 14px; }
            .buy-btn { color: var(--premium-cyan); text-decoration: none; font-weight: 800; }
        </style>
    </head>
    <body>

        <!-- ──🔥 DYNAMIC TOAST SYSTEM ── -->
        <div id="toast-alert">COPIED TO CLIPBOARD! ✔</div>

        <!-- ──🔥 PRE-LOADER DUAL RINGS SPINNING LAYOUT ── -->
        <div id="cyber-loader">
            <div class="spinner-container">
                <div class="circle-outer"></div>
                <div class="circle-inner"></div>
                <div class="spinner-center-text">HASHUU</div>
            </div>
            <div class="status-text" id="status-terminal">BOOTING SYSTEM MATRIX...</div>
        </div>

        <div class="ambient-glow glow-1"></div>
        <div class="ambient-glow glow-2"></div>

        <div class="vercel-box" id="main-interface">
            
            <header>
                <h1>mr-hashuu-v10</h1>
                <!-- ──🔥 FEATURE 3: LIVE OPERATIONAL INDICATOR ── -->
                <div class="status-container">
                    <div class="pulse-dot"></div>
                    <span>SYSTEMS OPERATIONAL</span>
                </div>
            </header>

            <!-- ──🔥 FEATURE 5: ADMIN METRICS DISPLAY SYSTEM ── -->
            <div class="analytics-grid">
                <div class="stat-card">
                    <div class="stat-label">Total Requests</div>
                    <div class="stat-value value-cyan">184.2K</div>
                </div>
                <div class="stat-card">
                    <div class="stat-label">System Uptime</div>
                    <div class="stat-value">99.99%</div>
                </div>
                <div class="stat-card">
                    <div class="stat-label">Top Endpoint</div>
                    <div class="stat-value value-purple">/spotify</div>
                </div>
            </div>

            <!-- Instant Search Engine Module -->
            <div class="search-container">
                <input type="text" id="apiSearch" class="search-input" placeholder="Filter Secure Endpoints..." onkeyup="filterEndpoints()">
            </div>

            <!-- Workspace Hub Grid -->
            <div class="endpoint-list" id="listWrapper">
                
                <!-- 1. Mediafire -->
                <div class="api-wrapper" data-name="mediafire downloader direct storage parser">
                    <div class="api-row" onclick="toggleAccordion(this)">
                        <div class="meta-details">
                            <span class="endpoint-slug">/mediafire</span>
                            <span class="endpoint-info">Mediafire Direct Storage Link Parser</span>
                        </div>
                        <span class="arrow-icon">▶</span>
                    </div>
                    <div class="api-docs">
                        <div class="docs-section-title">Query Parameters</div>
                        <div class="json-preview">?url= [Mediafire URL]&#10;?apikey= [Your Premium Token]</div>
                        <div class="docs-section-title">Execution Gateway Link</div>
                        <div class="url-box-container">
                            <div class="url-display" id="url-mf">/mediafire?url=https://www.mediafire.com/file/n6tgcrktbnov1oy/Queen_Anita-V4.zip/file&apikey=MR_HASHUU_SECRET_123</div>
                            <button class="btn-copy" onclick="copyLink('url-mf')">Copy</button>
                        </div>
                    </div>
                </div>

                <!-- 2. Spotify -->
                <div class="api-wrapper" data-name="spotify music hq audio downloader song">
                    <div class="api-row" onclick="toggleAccordion(this)">
                        <div class="meta-details">
                            <span class="endpoint-slug">/spotify</span>
                            <span class="endpoint-info">Spotify Premium HQ Audio Downloader</span>
                        </div>
                        <span class="arrow-icon">▶</span>
                    </div>
                    <div class="api-docs">
                        <div class="docs-section-title">Query Parameters</div>
                        <div class="json-preview">?url= [Spotify Track URL]&#10;?apikey= [Your Premium Token]</div>
                        <div class="docs-section-title">Execution Gateway Link</div>
                        <div class="url-box-container">
                            <div class="url-display" id="url-sf">/spotify?url=https://open.spotify.com/track/285pBltuF7vW8TeWk8hdRR?si=HWuMcdM3RJ6Yy0b7Uc7uGQ&apikey=MR_HASHUU_SECRET_123</div>
                            <button class="btn-copy" onclick="copyLink('url-sf')">Copy</button>
                        </div>
                    </div>
                </div>

                <!-- 3. Twitter -->
                <div class="api-wrapper" data-name="twitter x stream extractor multi video">
                    <div class="api-row" onclick="toggleAccordion(this)">
                        <div class="meta-details">
                            <span class="endpoint-slug">/twitter</span>
                            <span class="endpoint-info">Twitter / X Multi-Quality Stream Extractor</span>
                        </div>
                        <span class="arrow-icon">▶</span>
                    </div>
                    <div class="api-docs">
                        <div class="docs-section-title">Query Parameters</div>
                        <div class="json-preview">?url= [Twitter Post URL]&#10;?apikey= [Your Premium Token]</div>
                        <div class="docs-section-title">Execution Gateway Link</div>
                        <div class="url-box-container">
                            <div class="url-display" id="url-tw">/twitter?url=https://x.com/elonmusk/status/1870901510319833540&apikey=MR_HASHUU_SECRET_123</div>
                            <button class="btn-copy" onclick="copyLink('url-tw')">Copy</button>
                        </div>
                    </div>
                </div>

                <!-- 4. Song -->
                <div class="api-wrapper" data-name="song youtube play mp3 audio music stream">
                    <div class="api-row" onclick="toggleAccordion(this)">
                        <div class="meta-details">
                            <span class="endpoint-slug">/song</span>
                            <span class="endpoint-info">YouTube Core Audio Stream Engine</span>
                        </div>
                        <span class="arrow-icon">▶</span>
                    </div>
                    <div class="api-docs">
                        <div class="docs-section-title">Query Parameters</div>
                        <div class="json-preview">?text= [Song Title / Query Name]&#10;?apikey= [Your Premium Token]</div>
                        <div class="docs-section-title">Execution Gateway Link</div>
                        <div class="url-box-container">
                            <div class="url-display" id="url-sg">/song?text=faded&apikey=MR_HASHUU_SECRET_123</div>
                            <button class="btn-copy" onclick="copyLink('url-sg')">Copy</button>
                        </div>
                    </div>
                </div>

                <!-- 5. TikTok -->
                <div class="api-wrapper" data-name="tiktok video downloader no watermark">
                    <div class="api-row" onclick="toggleAccordion(this)">
                        <div class="meta-details">
                            <span class="endpoint-slug">/tiktok</span>
                            <span class="endpoint-info">TikTok Original Video No-Watermark Extractor</span>
                        </div>
                        <span class="arrow-icon">▶</span>
                    </div>
                    <div class="api-docs">
                        <div class="docs-section-title">Query Parameters</div>
                        <div class="json-preview">?url= [TikTok Share Link]&#10;?apikey= [Your Premium Token]</div>
                        <div class="docs-section-title">Execution Gateway Link</div>
                        <div class="url-box-container">
                            <div class="url-display" id="url-tk">/tiktok?url=https://vm.tiktok.com/ZM6789/&apikey=MR_HASHUU_SECRET_123</div>
                            <button class="btn-copy" onclick="copyLink('url-tk')">Copy</button>
                        </div>
                    </div>
                </div>

                <!-- 6. Pinterest -->
                <div class="api-wrapper" data-name="pinterest image search visual hd download">
                    <div class="api-row" onclick="toggleAccordion(this)">
                        <div class="meta-details">
                            <span class="endpoint-slug">/pinterest</span>
                            <span class="endpoint-info">Pinterest HD Resolution Visual Grid Search</span>
                        </div>
                        <span class="arrow-icon">▶</span>
                    </div>
                    <div class="api-docs">
                        <div class="docs-section-title">Query Parameters</div>
                        <div class="json-preview">?text= [Keyword Term Query]&#10;?apikey= [Your Premium Token]</div>
                        <div class="docs-section-title">Execution Gateway Link</div>
                        <div class="url-box-container">
                            <div class="url-display" id="url-pin">/pinterest?text=cyberpunk&apikey=MR_HASHUU_SECRET_123</div>
                            <button class="btn-copy" onclick="copyLink('url-pin')">Copy</button>
                        </div>
                    </div>
                </div>

                <!-- 7. APK Downloader -->
                <div class="api-wrapper" data-name="apk android package app mirror tool download">
                    <div class="api-row" onclick="toggleAccordion(this)">
                        <div class="meta-details">
                            <span class="endpoint-slug">/apk</span>
                            <span class="endpoint-info">Android Package App Safe Mirror Provider</span>
                        </div>
                        <span class="arrow-icon">▶</span>
                    </div>
                    <div class="api-docs">
                        <div class="docs-section-title">Query Parameters</div>
                        <div class="json-preview">?text= [Application Safe Package Title]&#10;?apikey= [Your Premium Token]</div>
                        <div class="docs-section-title">Execution Gateway Link</div>
                        <div class="url-box-container">
                            <div class="url-display" id="url-apk">/apk?text=whatsapp&apikey=MR_HASHUU_SECRET_123</div>
                            <button class="btn-copy" onclick="copyLink('url-apk')">Copy</button>
                        </div>
                    </div>
                </div>

                <!-- 8. Facebook -->
                <div class="api-wrapper" data-name="facebook fb video resolver cdn download">
                    <div class="api-row" onclick="toggleAccordion(this)">
                        <div class="meta-details">
                            <span class="endpoint-slug">/facebook</span>
                            <span class="endpoint-info">Facebook Video Links CDN Resolver</span>
                        </div>
                        <span class="arrow-icon">▶</span>
                    </div>
                    <div class="api-docs">
                        <div class="docs-section-title">Query Parameters</div>
                        <div class="json-preview">?url= [Facebook Target Video Link]&#10;?apikey= [Your Premium Token]</div>
                        <div class="docs-section-title">Execution Gateway Link</div>
                        <div class="url-box-container">
                            <div class="url-display" id="url-fb">/facebook?url=https://www.facebook.com/watch/?v=123&apikey=MR_HASHUU_SECRET_123</div>
                            <button class="btn-copy" onclick="copyLink('url-fb')">Copy</button>
                        </div>
                    </div>
                </div>

                <!-- 9. Website Cloner -->
                <div class="api-wrapper" data-name="webdl website clone html static site page download">
                    <div class="api-row" onclick="toggleAccordion(this)">
                        <div class="meta-details">
                            <span class="endpoint-slug">/webdl</span>
                            <span class="endpoint-info">Static Page Cloner Repository Downloader</span>
                        </div>
                        <span class="arrow-icon">▶</span>
                    </div>
                    <div class="api-docs">
                        <div class="docs-section-title">Query Parameters</div>
                        <div class="json-preview">?url= [External Target Core Web URL]&#10;?apikey= [Your Premium Token]</div>
                        <div class="docs-section-title">Execution Gateway Link</div>
                        <div class="url-box-container">
                            <div class="url-display" id="url-wdl">/webdl?url=https://example.com&apikey=MR_HASHUU_SECRET_123</div>
                            <button class="btn-copy" onclick="copyLink('url-wdl')">Copy</button>
                        </div>
                    </div>
                </div>

                <!-- 10. JS Obfuscator -->
                <div class="api-wrapper" data-name="obfuscate javascript security protection code hide encrypt">
                    <div class="api-row" onclick="toggleAccordion(this)">
                        <div class="meta-details">
                            <span class="endpoint-slug">/obfuscate</span>
                            <span class="endpoint-info">Anti-Theft JavaScript Security Module</span>
                        </div>
                        <span class="arrow-icon">▶</span>
                    </div>
                    <div class="api-docs">
                        <div class="docs-section-title">Query Parameters</div>
                        <div class="json-preview">?code= [Raw Plaintext JavaScript String]&#10;?apikey= [Your Premium Token]</div>
                        <div class="docs-section-title">Execution Gateway Link</div>
                        <div class="url-box-container">
                            <div class="url-display" id="url-obf">/obfuscate?code=console.log('hashu')&apikey=MR_HASHUU_SECRET_123</div>
                            <button class="btn-copy" onclick="copyLink('url-obf')">Copy</button>
                        </div>
                    </div>
                </div>

                <!-- 11. ImgBB Uploader -->
                <div class="api-wrapper" data-name="imgbb photo cloud cdn image host upload post">
                    <div class="api-row" onclick="toggleAccordion(this)">
                        <div class="meta-details">
                            <span class="endpoint-slug">/imgbb (POST)</span>
                            <span class="endpoint-info">Cloud Photo CDN Hosting Interface</span>
                        </div>
                        <span class="arrow-icon">▶</span>
                    </div>
                    <div class="api-docs">
                        <div class="docs-section-title">Request Type</div>
                        <div class="json-preview" style="color:var(--premium-purple)">HTTP METHOD: POST (Multipart Form-Data)</div>
                        <div class="docs-section-title">Expected Payload</div>
                        <div class="json-preview">Key Name: "file" [Binary Photo Upload File Instance]&#10;Query: ?apikey= [Your Premium Token]</div>
                    </div>
                </div>

                <div id="no-results">// NO ENPOINTS SECURITY ARCHIVE MATCHED //</div>
            </div>

            <footer>
                <span>&copy; 2026 MR HASHUU</span>
                <a href="https://wa.me/your-number-here" target="_blank" class="buy-btn">GET ACCESS KEY</a>
            </footer>
        </div>

        <!-- ──🔥 ACTIVE ENGINE INTERACTIVE CONTROLLERS ── -->
        <script>
            const statuses = [
                "DECRYPTING PROTOCOLS...",
                "LOADING CORE SUITE v10.0...",
                "ALL SYSTEMS LIVE. WELCOME!"
            ];
            const terminalEl = document.getElementById('status-terminal');
            
            setTimeout(() => terminalEl.innerText = statuses[0], 1200);
            setTimeout(() => terminalEl.innerText = statuses[1], 2400);
            setTimeout(() => terminalEl.innerText = statuses[2], 3500);

            // Exact 4 Second Pre-loader Dismount Handler
            window.addEventListener('DOMContentLoaded', () => {
                setTimeout(() => {
                    const loader = document.getElementById('cyber-loader');
                    const mainUI = document.getElementById('main-interface');
                    
                    loader.style.opacity = '0';
                    loader.style.filter = 'blur(12px)';
                    
                    setTimeout(() => {
                        loader.style.display = 'none';
                        mainUI.style.opacity = '1';
                        mainUI.style.transform = 'translateY(0)';
                    }, 600);
                }, 4000); 
            });

            // Interactive Dropdown Accordion Controller
            function toggleAccordion(element) {
                const parent = element.parentElement;
                const docsSection = parent.querySelector('.api-docs');
                const isOpen = parent.classList.contains('active');

                // Close all rows first
                const allWrappers = document.getElementsByClassName('api-wrapper');
                for (let wrap of allWrappers) {
                    wrap.classList.remove('active');
                    wrap.querySelector('.api-docs').style.display = 'none';
                }

                // If it wasn't open, open it
                if (!isOpen) {
                    parent.classList.add('active');
                    docsSection.style.display = 'block';
                }
            }

            // High Performance Instant Real-time Filter
            function filterEndpoints() {
                const query = document.getElementById('apiSearch').value.toLowerCase().trim();
                const wrappers = document.getElementsByClassName('api-wrapper');
                const noResults = document.getElementById('no-results');
                let foundAny = false;

                for (let i = 0; i < wrappers.length; i++) {
                    const searchableTags = wrappers[i].getAttribute('data-name');
                    if (searchableTags.includes(query)) {
                        wrappers[i].style.display = 'block';
                        foundAny = true;
                    } else {
                        wrappers[i].style.display = 'none';
                    }
                }
                noResults.style.display = foundAny ? 'none' : 'block';
            }

            // Clip Board Copier with Flash Notification Alert
            function copyLink(elementId) {
                const pathText = document.getElementById(elementId).innerText;
                const fullHostUrl = window.location.origin + pathText;
                
                navigator.clipboard.writeText(fullHostUrl).then(() => {
                    const toast = document.getElementById('toast-alert');
                    toast.classList.add('show');
                    setTimeout(() => toast.classList.remove('show'), 2000);
                });
            }
        </script>
    </body>
    </html>
    `);
});

// ─────────────────────────────────────────────────────────
// 🛠️ ALL 11 BACKEND API CONTROLLERS (PROTECTED WITH AUTH)
// ─────────────────────────────────────────────────────────

app.get('/mediafire', strictAuthGate, async (req, res) => {
    try {
        const { url } = req.query;
        if (!url) return res.json({ success: false, message: "Mediafire URL required!" });
        const { data } = await axios.get(`https://apis.davidcyriltech.my.id/mediafire?url=${encodeURIComponent(url)}`);
        res.json({ creator: "Mr Hashuu Bot", status: "Authenticated", user: req.planOwner, plan: req.planType, success: true, result: data });
    } catch (e) { res.json({ success: false, message: e.message }); }
});

app.get('/spotify', strictAuthGate, async (req, res) => {
    try {
        const { url } = req.query;
        if (!url) return res.json({ success: false, message: "Spotify URL required!" });
        const { data } = await axios.get(`https://apis.davidcyriltech.my.id/spotifydl?url=${encodeURIComponent(url)}`);
        res.json({ creator: "Mr Hashuu Bot", status: "Authenticated", user: req.planOwner, plan: req.planType, success: true, result: data });
    } catch (e) { res.json({ success: false, message: e.message }); }
});

app.get('/twitter', strictAuthGate, async (req, res) => {
    try {
        const { url } = req.query;
        if (!url) return res.json({ success: false, message: "Twitter URL required!" });
        const { data } = await axios.get(`https://apis.davidcyriltech.my.id/twitterV2?url=${encodeURIComponent(url)}`);
        res.json({ creator: "Mr Hashuu Bot", status: "Authenticated", user: req.planOwner, plan: req.planType, success: true, result: data });
    } catch (e) { res.json({ success: false, message: e.message }); }
});

app.get('/song', strictAuthGate, async (req, res) => {
    try {
        const { text } = req.query;
        if (!text) return res.json({ success: false, message: "Song name or YouTube URL required" });
        const { data } = await axios.get(`https://apis.davidcyriltech.my.id/play?query=${encodeURIComponent(text)}`);
        if (data.status && data.result) {
            res.json({ creator: "Mr Hashuu Bot", status: "Authenticated", success: true, result: data.result });
        } else { res.json({ success: false, message: "Failed to fetch song from server." }); }
    } catch (e) { res.json({ success: false, message: e.message }); }
});

app.get('/tiktok', strictAuthGate, async (req, res) => {
    try {
        const { url } = req.query;
        if (!url) return res.json({ success: false, message: "TikTok URL required!" });
        const { data } = await axios.get(`https://apis.davidcyriltech.my.id/download/tiktok?url=${encodeURIComponent(url)}`);
        if (data.success && data.result) {
            res.json({ creator: "Mr Hashuu Bot", status: "Authenticated", success: true, result: data.result });
        } else { res.json({ success: false, message: "Invalid TikTok URL or media not found." }); }
    } catch (e) { res.json({ success: false, message: e.message }); }
});

app.get('/pinterest', strictAuthGate, async (req, res) => {
    try {
        const { text } = req.query;
        if (!text) return res.json({ success: false, message: "Query text required" });
        const { data } = await axios.get(`https://apis.davidcyriltech.my.id/search/pinterest?text=${encodeURIComponent(text)}`);
        res.json({ creator: "Mr Hashuu Bot", status: "Authenticated", success: true, result: data.result || [] });
    } catch (e) { res.json({ success: false, message: e.message }); }
});

app.get('/apk', strictAuthGate, async (req, res) => {
    try {
        const { text } = req.query;
        if (!text) return res.json({ success: false, message: "App name required" });
        const { data } = await axios.get(`https://apis.davidcyriltech.my.id/download/apk?text=${encodeURIComponent(text)}`, { headers: { 'User-Agent': 'Mozilla/5.0' }, timeout: 8000 });
        res.json({ creator: "Mr Hashuu Bot", status: "Authenticated", success: true, result: data.apk || {} });
    } catch (e) { res.json({ success: false, message: e.message }); }
});

app.get('/facebook', strictAuthGate, async (req, res) => {
    try {
        const { url } = req.query;
        if (!url) return res.json({ success: false, message: "URL parameter missing!" });
        const { data } = await axios.get(`https://apis.davidcyriltech.my.id/facebook2?url=${encodeURIComponent(url)}`);
        if (data.status) {
            res.json({ creator: "Mr Hashuu Bot", status: "Authenticated", success: true, result: data.video });
        } else { res.json({ success: false, message: "Could not fetch video." }); }
    } catch (e) { res.json({ success: false, message: e.message }); }
});

app.get('/webdl', strictAuthGate, async (req, res) => {
    try {
        const { url } = req.query;
        if (!url) return res.json({ success: false, message: "Website URL required!" });
        const { data } = await axios.get(`https://apis.davidcyriltech.my.id/tools/downloadweb?url=${encodeURIComponent(url)}`);
        if (data.response && (data.response.success === true || data.response.success === "true")) {
            res.json({ creator: "Mr Hashuu Bot", status: "Authenticated", success: true, result: { downloadUrl: data.response.downloadUrl, isFinished: data.response.isFinished } });
        } else { res.json({ success: false, message: "Failed to clone website." }); }
    } catch (e) { res.json({ success: false, message: e.message }); }
});

app.get('/obfuscate', strictAuthGate, (req, res) => {
    try {
        const { code } = req.query;
        if (!code) return res.json({ success: false, message: "Code parameter missing!" });
        const obfuscatedCode = obfuscator.obfuscate(code, { compact: true, controlFlowFlattening: true, controlFlowFlatteningThreshold: 0.5 }).getObfuscatedCode();
        res.json({ creator: "Mr Hashuu Bot", status: "Authenticated", success: true, result: obfuscatedCode });
    } catch (e) { res.json({ success: false, message: e.message }); }
});

app.post('/imgbb', strictAuthGate, upload.single('file'), async (req, res) => {
    try {
        if (!req.file) return res.json({ success: false, message: "No file uploaded!" });
        const form = new FormData();
        form.append('file', req.file.buffer, { filename: req.file.originalname || 'image.jpg', contentType: req.file.mimetype });
        const { data } = await axios.post('https://apis.davidcyriltech.my.id/uploader/imgbb', form, { headers: { ...form.getHeaders(), 'User-Agent': 'Mozilla/5.0' } });
        if (data.success) { res.json({ creator: "Mr Hashuu Bot", status: "Authenticated", success: true, result: data.data }); }
        else { res.json({ success: false, message: "Upload failed." }); }
    } catch (e) { res.json({ success: false, message: e.message }); }
});

// PORT LISTENER
if (require.main === module) {
    app.listen(3000, () => console.log("Premium HASHU-API Luxury Matrix Running on port 3000"));
}

module.exports = app;
