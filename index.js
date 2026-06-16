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
// 🌌 0. VERCEL DEEP DARK UI WITH LOADER & LIVE SEARCH
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
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&family=Space+Grotesk:wght@500;700&display=swap" rel="stylesheet">
        
        <style>
            :root {
                --vercel-black: #000000;
                --vercel-gray-dark: #040405;
                --vercel-gray-light: #09090b;
                --vercel-border: #1a1a1e;
                --vercel-text-muted: #8e8e93;
                --premium-cyan: #00F5FF;
                --premium-purple: #7B2CBF;
                --neon-glow: 0 0 30px rgba(0, 245, 255, 0.25);
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

            /* ──🔥 PRE-LOADER CYBER STYLING ── */
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

            .loader-logo {
                font-family: 'Space Grotesk', sans-serif;
                font-size: 2.2rem;
                font-weight: 800;
                letter-spacing: -1px;
                background: linear-gradient(135deg, #ffffff 30%, var(--premium-cyan) 100%);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                margin-bottom: 20px;
                animation: pulseLogo 1.5s infinite alternate ease-in-out;
            }

            @keyframes pulseLogo {
                0% { transform: scale(0.96); opacity: 0.8; filter: drop-shadow(0 0 5px rgba(0,245,255,0.2)); }
                100% { transform: scale(1); opacity: 1; filter: drop-shadow(0 0 25px rgba(0,245,255,0.6)); }
            }

            .progress-track {
                width: 240px; height: 3px;
                background: #111; border-radius: 10px;
                overflow: hidden; position: relative; margin-bottom: 15px;
            }

            .progress-bar {
                position: absolute; top: 0; left: 0; height: 100%;
                width: 0%; background: linear-gradient(90deg, var(--premium-purple), var(--premium-cyan));
                box-shadow: 0 0 10px var(--premium-cyan);
                animation: fillProgress 4s cubic-bezier(0.1, 0.85, 0.25, 1) forwards;
            }

            @keyframes fillProgress { 0% { width: 0%; } 100% { width: 100%; } }

            .status-text {
                font-family: monospace; font-size: 0.72rem; font-weight: 700;
                color: var(--premium-cyan); letter-spacing: 1px; text-transform: uppercase;
                height: 15px;
            }

            /* Ambient Glow Background Studio */
            .ambient-glow {
                position: absolute; width: 600px; height: 600px; border-radius: 50%;
                filter: blur(160px); opacity: 0.16; z-index: 0; pointer-events: none;
            }
            .glow-1 { background: var(--premium-purple); top: -15%; left: -10%; }
            .glow-2 { background: var(--premium-cyan); bottom: -15%; right: -10%; }

            /* Main Box Styling */
            .vercel-box {
                width: 92%; max-width: 470px; height: 90vh;
                background: rgba(4, 4, 5, 0.75);
                backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px);
                border: 1px solid var(--vercel-border); border-radius: 28px;
                padding: 24px; z-index: 2;
                display: flex; flex-direction: column; justify-content: space-between;
                box-shadow: 0 50px 150px rgba(0, 0, 0, 0.95), inset 0 1px 1px rgba(255,255,255,0.03);
                opacity: 0; transform: translateY(20px);
                transition: opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
            }

            header { display: flex; justify-content: space-between; align-items: center; padding-bottom: 14px; }
            header h1 {
                font-family: 'Space Grotesk', sans-serif; font-size: 1.4rem; font-weight: 700;
                letter-spacing: -0.5px; background: linear-gradient(135deg, #ffffff 40%, #999999 100%);
                -webkit-background-clip: text; -webkit-text-fill-color: transparent;
            }

            .badge-strict {
                display: inline-flex; align-items: center; gap: 6px;
                font-size: 0.68rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.8px;
                color: #FF3B30; background: rgba(255, 59, 48, 0.06);
                padding: 5px 12px; border-radius: 8px; border: 1px solid rgba(255, 59, 48, 0.2);
            }
            .dot-red { width: 6px; height: 6px; background: #FF3B30; border-radius: 50%; box-shadow: 0 0 10px #FF3B30; }

            /* ──🔥 ADVANCED SEARCH BOX SYSTEM ── */
            .search-container { position: relative; margin-top: 12px; margin-bottom: 4px; }
            .search-input {
                width: 100%; padding: 14px 16px; background: #0c0c0e;
                border: 1px solid var(--vercel-border); border-radius: 14px;
                color: #ffffff; font-size: 0.9rem; font-weight: 700;
                outline: none; transition: all 0.25s ease;
                box-shadow: inset 0 2px 4px rgba(0,0,0,0.5);
            }
            .search-input:focus {
                border-color: var(--premium-cyan);
                box-shadow: 0 0 20px rgba(0, 245, 255, 0.15), inset 0 2px 4px rgba(0,0,0,0.3);
            }
            .search-input::placeholder { color: #555558; font-weight: 600; }

            /* Endpoint Workspace */
            .endpoint-list {
                flex-grow: 1; margin: 14px 0; overflow-y: auto;
                padding-right: 2px; display: flex; flex-direction: column; gap: 10px;
            }

            .api-row {
                background: var(--vercel-gray-light); border: 1px solid var(--vercel-border);
                border-radius: 16px; padding: 14px 18px;
                display: flex; justify-content: space-between; align-items: center;
                transition: all 0.25s cubic-bezier(0.25, 1, 0.5, 1);
            }
            .api-row:hover {
                background: #0f0f13; border-color: #2b2b32;
                transform: translateY(-2px); box-shadow: var(--neon-glow);
            }

            .meta-details { display: flex; flex-direction: column; gap: 4px; max-width: 72%; }
            .endpoint-slug { font-family: 'Space Grotesk', monospace; font-size: 1.08rem; font-weight: 800; color: #ffffff; letter-spacing: -0.3px; }
            .endpoint-info { font-size: 0.78rem; font-weight: 700; color: var(--vercel-text-muted); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

            .btn-launch {
                background: #ffffff; color: #000000; border: 1px solid #ffffff;
                font-size: 0.7rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px;
                padding: 8px 14px; border-radius: 9px; text-decoration: none; transition: all 0.2s ease;
            }
            .btn-launch:hover {
                background: transparent; color: var(--premium-cyan); border-color: var(--premium-cyan);
                box-shadow: 0 0 15px rgba(0, 245, 255, 0.3);
            }

            /* No Search Result Banner */
            #no-results {
                display: none; text-align: center; padding: 30px;
                font-size: 0.85rem; font-weight: 700; color: var(--vercel-text-muted);
                font-family: monospace;
            }

            ::-webkit-scrollbar { width: 4px; }
            ::-webkit-scrollbar-thumb { background: #1c1c21; border-radius: 20px; }
            
            footer { display: flex; justify-content: space-between; align-items: center; font-size: 0.75rem; font-weight: 700; color: var(--vercel-text-muted); border-top: 1px solid var(--vercel-border); padding-top: 16px; }
            .buy-btn { color: var(--premium-cyan); text-decoration: none; font-weight: 800; letter-spacing: 0.2px; }
            .buy-btn:hover { text-shadow: 0 0 10px var(--premium-cyan); }
        </style>
    </head>
    <body>

        <!-- ──🔥 PRE-LOADER MATRIX LAYOUT ── -->
        <div id="cyber-loader">
            <div class="loader-logo">MR HASHUU CORE</div>
            <div class="progress-track">
                <div class="progress-bar"></div>
            </div>
            <div class="status-text" id="status-terminal">LOADING MATRIX...</div>
        </div>

        <div class="ambient-glow glow-1"></div>
        <div class="ambient-glow glow-2"></div>

        <div class="vercel-box" id="main-interface">
            
            <header>
                <h1>mr-hashuu-v9</h1>
                <div class="badge-strict">
                    <div class="dot-red"></div>
                    <span>Strict Auth</span>
                </div>
            </header>

            <!-- Interactive Search Module -->
            <div class="search-container">
                <input type="text" id="apiSearch" class="search-input" placeholder="Search Secure Endpoints..." onkeyup="filterEndpoints()">
            </div>

            <div class="endpoint-list" id="listWrapper">
                
                <!-- 1. Mediafire -->
                <div class="api-row" data-name="mediafire downloader direct storage parser">
                    <div class="meta-details">
                        <span class="endpoint-slug">/mediafire</span>
                        <span class="endpoint-info">Mediafire Direct Storage Link Parser</span>
                    </div>
                    <a href="/mediafire?url=https://www.mediafire.com/file/n6tgcrktbnov1oy/Queen_Anita-V4.zip/file&apikey=MR_HASHUU_SECRET_123" target="_blank" class="btn-launch">Test</a>
                </div>

                <!-- 2. Spotify -->
                <div class="api-row" data-name="spotify music hq audio downloader song">
                    <div class="meta-details">
                        <span class="endpoint-slug">/spotify</span>
                        <span class="endpoint-info">Spotify Premium HQ Audio Downloader</span>
                    </div>
                    <a href="/spotify?url=https://open.spotify.com/track/285pBltuF7vW8TeWk8hdRR?si=HWuMcdM3RJ6Yy0b7Uc7uGQ&apikey=MR_HASHUU_SECRET_123" target="_blank" class="btn-launch">Test</a>
                </div>

                <!-- 3. Twitter -->
                <div class="api-row" data-name="twitter x stream extractor multi video">
                    <div class="meta-details">
                        <span class="endpoint-slug">/twitter</span>
                        <span class="endpoint-info">Twitter / X Multi-Quality Stream Extractor</span>
                    </div>
                    <a href="/twitter?url=https://x.com/elonmusk/status/1870901510319833540&apikey=MR_HASHUU_SECRET_123" target="_blank" class="btn-launch">Test</a>
                </div>

                <!-- 4. Song -->
                <div class="api-row" data-name="song youtube play mp3 audio music stream">
                    <div class="meta-details">
                        <span class="endpoint-slug">/song</span>
                        <span class="endpoint-info">YouTube Core Audio Stream Engine</span>
                    </div>
                    <a href="/song?text=faded&apikey=MR_HASHUU_SECRET_123" target="_blank" class="btn-launch">Test</a>
                </div>

                <!-- 5. TikTok -->
                <div class="api-row" data-name="tiktok video downloader no watermark">
                    <div class="meta-details">
                        <span class="endpoint-slug">/tiktok</span>
                        <span class="endpoint-info">TikTok Original Video No-Watermark Extractor</span>
                    </div>
                    <a href="/tiktok?url=https://vm.tiktok.com/ZM6789/&apikey=MR_HASHUU_SECRET_123" target="_blank" class="btn-launch">Test</a>
                </div>

                <!-- 6. Pinterest -->
                <div class="api-row" data-name="pinterest image search visual hd download">
                    <div class="meta-details">
                        <span class="endpoint-slug">/pinterest</span>
                        <span class="endpoint-info">Pinterest HD Resolution Visual Grid Search</span>
                    </div>
                    <a href="/pinterest?text=cyberpunk&apikey=MR_HASHUU_SECRET_123" target="_blank" class="btn-launch">Test</a>
                </div>

                <!-- 7. APK Downloader -->
                <div class="api-row" data-name="apk android package app mirror tool download">
                    <div class="meta-details">
                        <span class="endpoint-slug">/apk</span>
                        <span class="endpoint-info">Android Package App Safe Mirror Provider</span>
                    </div>
                    <a href="/apk?text=whatsapp&apikey=MR_HASHUU_SECRET_123" target="_blank" class="btn-launch">Test</a>
                </div>

                <!-- 8. Facebook -->
                <div class="api-row" data-name="facebook fb video resolver cdn download">
                    <div class="meta-details">
                        <span class="endpoint-slug">/facebook</span>
                        <span class="endpoint-info">Facebook Video Links CDN Resolver</span>
                    </div>
                    <a href="/facebook?url=https://www.facebook.com/watch/?v=123&apikey=MR_HASHUU_SECRET_123" target="_blank" class="btn-launch">Test</a>
                </div>

                <!-- 9. Website Cloner -->
                <div class="api-row" data-name="webdl website clone html static site page download">
                    <div class="meta-details">
                        <span class="endpoint-slug">/webdl</span>
                        <span class="endpoint-info">Static Page Cloner Repository Downloader</span>
                    </div>
                    <a href="/webdl?url=https://example.com&apikey=MR_HASHUU_SECRET_123" target="_blank" class="btn-launch">Test</a>
                </div>

                <!-- 10. JS Obfuscator -->
                <div class="api-row" data-name="obfuscate javascript security protection code hide encrypt">
                    <div class="meta-details">
                        <span class="endpoint-slug">/obfuscate</span>
                        <span class="endpoint-info">Anti-Theft JavaScript Security Module</span>
                    </div>
                    <a href="/obfuscate?code=console.log('hashu')&apikey=MR_HASHUU_SECRET_123" target="_blank" class="btn-launch">Test</a>
                </div>

                <!-- 11. ImgBB Uploader -->
                <div class="api-row" data-name="imgbb photo cloud cdn image host upload post">
                    <div class="meta-details">
                        <span class="endpoint-slug">/imgbb (POST)</span>
                        <span class="endpoint-info">Cloud Photo CDN Hosting Interface</span>
                    </div>
                    <span style="font-size:0.7rem; font-weight:800; color:var(--premium-purple)">POST REQ</span>
                </div>

                <div id="no-results">// NO ENPOINTS MATCHED //</div>
            </div>

            <footer>
                <span>&copy; 2026 MR HASHUU</span>
                <a href="https://wa.me/your-number-here" target="_blank" class="buy-btn">GET ACCESS KEY</a>
            </footer>
        </div>

        <!-- ──🔥 DYNAMIC INTERACTIVE SCRIPTS ── -->
        <script>
            // 1. Dynamic Terminal Status Updates during Boot
            const statuses = [
                "INITIALIZING PROTOCOLS...",
                "DECRYPTING SECURITY CORE...",
                "LOADING CORE SUITE v9.0...",
                "ACCESS GRANTED. ENJOY!"
            ];
            const terminalEl = document.getElementById('status-terminal');
            
            setTimeout(() => terminalEl.innerText = statuses[1], 1000);
            setTimeout(() => terminalEl.innerText = statuses[2], 2200);
            setTimeout(() => terminalEl.innerText = statuses[3], 3400);

            // 4 Second Smooth Pre-Loader Dismount
            window.addEventListener('DOMContentLoaded', () => {
                setTimeout(() => {
                    const loader = document.getElementById('cyber-loader');
                    const mainUI = document.getElementById('main-interface');
                    
                    loader.style.opacity = '0';
                    loader.style.filter = 'blur(10px)';
                    
                    setTimeout(() => {
                        loader.style.display = 'none';
                        mainUI.style.opacity = '1';
                        mainUI.style.transform = 'translateY(0)';
                    }, 600);
                }, 4000); // Exact 4-Second Hold Time
            });

            // 2. Real-Time High-Performance Endpoint Filter
            function filterEndpoints() {
                const query = document.getElementById('apiSearch').value.toLowerCase().trim();
                const rows = document.getElementsByClassName('api-row');
                const noResults = document.getElementById('no-results');
                let foundAny = false;

                for (let i = 0; i < rows.length; i++) {
                    const searchableTags = rows[i].getAttribute('data-name');
                    if (searchableTags.includes(query)) {
                        rows[i].style.display = 'flex';
                        foundAny = true;
                    } else {
                        rows[i].style.display = 'none';
                    }
                }

                noResults.style.display = foundAny ? 'none' : 'block';
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
