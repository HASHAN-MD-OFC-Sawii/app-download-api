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

// Premium Security Rate Limiter
const premiumLimiter = rateLimit({
    windowMs: 24 * 60 * 60 * 1000, 
    max: 5000, 
    message: { success: false, message: "Premium daily limit reached! Contact MR HASHUU." }
});

// Strict Gatekeeper Middleware
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
// 🌌 VERCEL ULTRA-PREMIUM GRAPHICS UI MODULE
// ─────────────────────────────────────────────────────────
app.get('/', (req, res) => {
    res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>MR HASHUU - Ultimate Premium Matrix</title>
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&family=Space+Grotesk:wght@500;700;800&display=swap" rel="stylesheet">
        
        <style>
            :root {
                --bg-black: #050507;
                --card-bg: rgba(13, 13, 17, 0.7);
                --border-color: rgba(255, 255, 255, 0.06);
                --border-hover: rgba(0, 245, 255, 0.3);
                --premium-cyan: #00F5FF;
                --premium-purple: #7B2CBF;
                --system-green: #00FF66;
                --text-muted: #8F8F99;
            }
            
            * { box-sizing: border-box; margin: 0; padding: 0; }
            
            body {
                background-color: var(--bg-black);
                color: #ffffff;
                font-family: 'Plus Jakarta Sans', sans-serif;
                min-height: 100vh;
                display: flex;
                justify-content: center;
                align-items: center;
                overflow-x: hidden;
                position: relative;
                padding: 20px 0;
            }

            /* ──🔥 ULTRA LUXURY GLOW AURA LOADER ── */
            #cyber-loader {
                position: fixed;
                top: 0; left: 0; width: 100vw; height: 100vh;
                background: var(--bg-black);
                z-index: 9999;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                transition: opacity 0.5s ease, visibility 0.5s;
            }

            .loader-aura {
                position: relative;
                width: 100px; height: 100px;
                background: linear-gradient(135deg, var(--premium-cyan), var(--premium-purple));
                border-radius: 50%;
                filter: blur(25px);
                opacity: 0.6;
                animation: pulseAura 2s infinite alternate ease-in-out;
            }

            .loader-brand {
                position: absolute;
                font-family: 'Space Grotesk', sans-serif;
                font-size: 1.4rem;
                font-weight: 800;
                letter-spacing: 2px;
                color: #ffffff;
                text-shadow: 0 0 20px rgba(255,255,255,0.6);
                animation: textGlitch 1.5s infinite alternate;
            }

            @keyframes pulseAura {
                0% { transform: scale(0.9); opacity: 0.4; filter: blur(20px); }
                100% { transform: scale(1.2); opacity: 0.8; filter: blur(35px); }
            }
            @keyframes textGlitch {
                0% { opacity: 0.7; transform: tracking(-1px); }
                100% { opacity: 1; transform: tracking(2px); }
            }

            /* Ambient Background Light Overlays */
            .ambient-glow { position: absolute; width: 500px; height: 500px; border-radius: 50%; filter: blur(140px); opacity: 0.12; pointer-events: none; z-index: 0; }
            .glow-1 { background: var(--premium-purple); top: -10%; left: -10%; }
            .glow-2 { background: var(--premium-cyan); bottom: -10%; right: -10%; }

            /* Master Glassmorphism Main Box */
            .vercel-box {
                width: 92%; max-width: 490px;
                background: var(--card-bg);
                backdrop-filter: blur(30px); -webkit-backdrop-filter: blur(30px);
                border: 1px solid var(--border-color); border-radius: 24px;
                padding: 24px; z-index: 2;
                box-shadow: 0 40px 100px rgba(0, 0, 0, 0.8);
                opacity: 0; transform: translateY(30px);
                transition: opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1), transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
                display: flex; flex-direction: column;
            }

            /* Active State triggered by JS to reveal perfectly */
            .vercel-box.system-ready {
                opacity: 1 !important;
                transform: translateY(0) !important;
            }

            header { display: flex; justify-content: space-between; align-items: center; padding-bottom: 16px; border-bottom: 1px solid var(--border-color); }
            header h1 {
                font-family: 'Space Grotesk', sans-serif; font-size: 1.4rem; font-weight: 800;
                background: linear-gradient(135deg, #ffffff 30%, #a1a1a6 100%);
                -webkit-background-clip: text; -webkit-text-fill-color: transparent;
            }

            /* Live Server Pulse Pill */
            .status-container {
                display: inline-flex; align-items: center; gap: 6px;
                font-size: 0.65rem; font-weight: 800; letter-spacing: 0.8px;
                color: var(--system-green); background: rgba(0, 255, 102, 0.06);
                padding: 6px 12px; border-radius: 20px; border: 1px solid rgba(0, 255, 102, 0.15);
            }
            .pulse-dot {
                width: 6px; height: 6px; background: var(--system-green); border-radius: 50%;
                animation: flashGreen 1s infinite alternate;
            }
            @keyframes flashGreen { 0% { box-shadow: 0 0 2px var(--system-green); opacity: 0.5; } 100% { box-shadow: 0 0 10px var(--system-green); opacity: 1; } }

            /* Live Analytics Counters */
            .analytics-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; margin-top: 16px; }
            .stat-card {
                background: rgba(255, 255, 255, 0.02); border: 1px solid var(--border-color); border-radius: 14px;
                padding: 12px 8px; text-align: center; transition: background 0.3s;
            }
            .stat-card:hover { background: rgba(255, 255, 255, 0.04); }
            .stat-label { font-size: 0.58rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.5px; }
            .stat-value { font-family: 'Space Grotesk', sans-serif; font-size: 1rem; font-weight: 800; color: #ffffff; margin-top: 4px; }
            .value-cyan { color: var(--premium-cyan); text-shadow: 0 0 10px rgba(0,245,255,0.2); }
            .value-purple { color: #b388ff; }

            /* Search System Bar */
            .search-container { position: relative; margin-top: 16px; }
            .search-input {
                width: 100%; padding: 14px 16px; background: rgba(0, 0, 0, 0.4);
                border: 1px solid var(--border-color); border-radius: 14px;
                color: #ffffff; font-size: 0.88rem; font-weight: 600; outline: none; transition: all 0.3s;
            }
            .search-input:focus { border-color: var(--premium-cyan); box-shadow: 0 0 20px rgba(0, 245, 255, 0.15); background: rgba(0, 0, 0, 0.6); }
            .search-input::placeholder { color: #55555c; }

            /* Accordion Wrap Area */
            .endpoint-list { margin: 18px 0; display: flex; flex-direction: column; gap: 12px; }
            
            .api-wrapper {
                background: rgba(255, 255, 255, 0.02); border: 1px solid var(--border-color);
                border-radius: 16px; overflow: hidden; transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
            }
            .api-wrapper:hover { border-color: rgba(255, 255, 255, 0.15); background: rgba(255, 255, 255, 0.04); }
            
            /* Main Interactive Click Bar */
            .api-row { padding: 16px; display: flex; justify-content: space-between; align-items: center; cursor: pointer; }
            .meta-details { display: flex; flex-direction: column; gap: 4px; max-width: 85%; }
            .endpoint-slug { font-family: 'Space Grotesk', monospace; font-size: 1.1rem; font-weight: 800; color: #ffffff; }
            .endpoint-info { font-size: 0.76rem; font-weight: 600; color: var(--text-muted); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

            .arrow-icon { font-size: 0.75rem; color: #555; transition: transform 0.3s; font-weight: 800; }
            
            /* Active Dynamic Row CSS styling */
            .api-wrapper.active { border-color: var(--border-hover); background: rgba(0, 245, 255, 0.02); box-shadow: 0 10px 30px rgba(0,245,255,0.05); }
            .api-wrapper.active .arrow-icon { transform: rotate(90deg); color: var(--premium-cyan); }
            .api-wrapper.active .endpoint-slug { color: var(--premium-cyan); }

            /* Inside Premium Hidden Docs */
            .api-docs {
                display: none; padding: 0 16px 16px 16px; border-top: 1px dashed rgba(255, 255, 255, 0.06);
                background: rgba(0,0,0,0.2); animation: revealFade 0.3s ease-in-out forwards;
            }
            @keyframes revealFade { from { opacity: 0; transform: translateY(-5px); } to { opacity: 1; transform: translateY(0); } }

            .docs-section-title { font-size: 0.62rem; font-weight: 800; color: #b388ff; text-transform: uppercase; margin: 14px 0 6px 0; letter-spacing: 0.8px; }
            
            /* Links Copy System Layout */
            .url-box-container { display: flex; gap: 8px; margin-top: 6px; }
            .url-display {
                flex-grow: 1; background: #09090b; border: 1px solid rgba(255,255,255,0.05); padding: 10px;
                border-radius: 10px; font-family: monospace; font-size: 0.7rem; font-weight: 600;
                color: #a1a1a6; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
            }
            .btn-copy {
                background: #ffffff; color: #000000; border: none; font-size: 0.68rem; font-weight: 800;
                padding: 0 14px; border-radius: 10px; cursor: pointer; text-transform: uppercase; transition: all 0.2s;
            }
            .btn-copy:hover { background: var(--premium-cyan); transform: scale(1.03); }

            .json-preview {
                background: #09090b; border: 1px solid rgba(255,255,255,0.04); border-radius: 10px;
                padding: 10px; font-family: monospace; font-size: 0.66rem; font-weight: 600; color: #79c0ff;
                white-space: pre-wrap; overflow-x: auto; max-height: 100px;
            }

            /* Custom Premium Notification Toast */
            #toast-alert {
                position: fixed; bottom: 5vh; background: #ffffff;
                color: #000000; font-weight: 800; font-size: 0.75rem; padding: 12px 24px; border-radius: 30px;
                z-index: 10000; opacity: 0; transform: translateY(15px); pointer-events: none;
                transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                box-shadow: 0 20px 40px rgba(0,0,0,0.4);
                letter-spacing: 0.5px;
            }
            #toast-alert.show { opacity: 1; transform: translateY(0); }

            #no-results { display: none; text-align: center; padding: 40px; font-size: 0.8rem; font-weight: 700; color: var(--text-muted); font-family: monospace; }

            footer { display: flex; justify-content: space-between; align-items: center; font-size: 0.72rem; font-weight: 700; color: var(--text-muted); border-top: 1px solid var(--border-color); padding-top: 16px; margin-top: 10px; }
            .buy-btn { color: var(--premium-cyan); text-decoration: none; font-weight: 800; transition: opacity 0.2s; }
            .buy-btn:hover { opacity: 0.8; }
        </style>
    </head>
    <body>

        <!-- GLOBAL TOAST NOTIFICATION SYSTEM -->
        <div id="toast-alert">SUCCESSFULLY COPIED TO CLIPBOARD ✔</div>

        <!-- ──🔥 PRE-LOADER PREMIUM SMOOTH GLOW AURA CONTAINER ── -->
        <div id="cyber-loader">
            <div class="loader-aura"></div>
            <div class="loader-brand">MR HASHUU</div>
        </div>

        <div class="ambient-glow glow-1"></div>
        <div class="ambient-glow glow-2"></div>

        <!-- Core Box Container Structure -->
        <div class="vercel-box" id="main-interface">
            
            <header>
                <h1>mr-hashuu-v11</h1>
                <div class="status-container">
                    <div class="pulse-dot"></div>
                    <span>SYSTEMS OPERATIONAL</span>
                </div>
            </header>

            <!-- Real-time Static Analytics Counters -->
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
                <input type="text" id="apiSearch" class="search-input" placeholder="Search secure premium endpoints..." onkeyup="filterEndpoints()">
            </div>

            <!-- Workspace Endpoints Grid -->
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

                <div id="no-results">// NO SECURITY INTERFACES MATCHED //</div>
            </div>

            <footer>
                <span>&copy; 2026 MR HASHUU</span>
                <a href="https://wa.me/your-number-here" target="_blank" class="buy-btn">GET ACCESS KEY</a>
            </footer>
        </div>

        <!-- ENGINE CONTROLLER JAVASCRIPT -->
        <script>
            // Instant Responsive Pre-loader System (Strict 2.2 Sec Dismount)
            window.addEventListener('DOMContentLoaded', () => {
                setTimeout(() => {
                    const loader = document.getElementById('cyber-loader');
                    const mainUI = document.getElementById('main-interface');
                    
                    loader.style.opacity = '0';
                    setTimeout(() => {
                        loader.style.style = 'none';
                        loader.remove(); // Delete loader completely from view DOM tree
                        
                        // Enforce system visibility activation class
                        mainUI.classList.add('system-ready');
                    }, 500);
                }, 2200); 
            });

            // Interactive Accordion Manager
            function toggleAccordion(element) {
                const parent = element.parentElement;
                const docsSection = parent.querySelector('.api-docs');
                const isOpen = parent.classList.contains('active');

                // Auto Close current open selectors
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

            // High Speed Real-time Filter Matrix Search
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

            // Clipboard Copy System Engine with Instant Fluid Pop notification
            function copyLink(elementId) {
                const pathText = document.getElementById(elementId).innerText;
                const fullUrl = window.location.origin + pathText;
                
                navigator.clipboard.writeText(fullUrl).then(() => {
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
    app.listen(3000, () => console.log("HASHU-API Luxury Matrix Running on port 3000"));
}

module.exports = app;
