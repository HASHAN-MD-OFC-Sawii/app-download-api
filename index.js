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
// 🌌 0. VERCEL ULTRA-PREMIUM DEEP DARK LANDING PAGE
// ─────────────────────────────────────────────────────────
app.get('/', (req, res) => {
    res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
        <title>MR HASHUU - Free Api Keys</title>
        <!-- Google Fonts Link for Luxury Typography -->
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&family=Space+Grotesk:wght@500;700&display=swap" rel="stylesheet">
        
        <style>
            :root {
                --vercel-black: #000000;
                --vercel-gray-dark: #050505;
                --vercel-gray-light: #0d0d0d;
                --vercel-border: #1f1f1f;
                --vercel-text-muted: #a0a0a0;
                --premium-cyan: #00F5FF;
                --premium-purple: #7B2CBF;
                --neon-glow: 0 0 20px rgba(0, 245, 255, 0.2);
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
                overflow: hidden; /* Prevent body scrollbars */
                position: relative;
            }

            /* Ambient Glow Background Studio */
            .ambient-glow {
                position: absolute;
                width: 600px;
                height: 600px;
                border-radius: 50%;
                filter: blur(150px);
                opacity: 0.18;
                z-index: 0;
                pointer-events: none;
                animation: pulseGlow 10s infinite alternate ease-in-out;
            }
            .glow-1 { background: var(--premium-purple); top: -15%; left: -10%; }
            .glow-2 { background: var(--premium-cyan); bottom: -15%; right: -10%; animation-delay: 5s; }

            @keyframes pulseGlow {
                0% { opacity: 0.12; transform: scale(0.9); }
                100% { opacity: 0.22; transform: scale(1.1); }
            }

            /* Luxury Container Card */
            .vercel-box {
                width: 92%;
                max-width: 460px;
                height: 90vh;
                background: var(--vercel-gray-dark);
                border: 1px solid var(--vercel-border);
                border-radius: 24px;
                padding: 26px 22px;
                z-index: 2;
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                box-shadow: 0 40px 120px rgba(0, 0, 0, 0.95), inset 0 1px 0 rgba(255,255,255,0.05);
                animation: boxReveal 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
            }

            @keyframes boxReveal {
                from { opacity: 0; transform: translateY(30px); filter: blur(5px); }
                to { opacity: 1; transform: translateY(0); filter: blur(0); }
            }

            header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                border-bottom: 1px solid var(--vercel-border);
                padding-bottom: 18px;
            }

            header h1 {
                font-family: 'Space Grotesk', sans-serif;
                font-size: 1.4rem;
                font-weight: 700;
                letter-spacing: -0.5px;
                background: linear-gradient(135deg, #ffffff 40%, #888888 100%);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
            }

            .badge-strict {
                display: inline-flex;
                align-items: center;
                gap: 6px;
                font-size: 0.68rem;
                font-weight: 800;
                text-transform: uppercase;
                letter-spacing: 0.8px;
                color: #FF3B30;
                background: rgba(255, 59, 48, 0.06);
                padding: 5px 12px;
                border-radius: 8px;
                border: 1px solid rgba(255, 59, 48, 0.2);
            }

            .dot-red {
                width: 6px;
                height: 6px;
                background: #FF3B30;
                border-radius: 50%;
                box-shadow: 0 0 10px #FF3B30;
            }

            /* Warning Security Banner */
            .security-banner {
                background: linear-gradient(90deg, rgba(255,59,48,0.04) 0%, rgba(0,0,0,0) 100%);
                border-left: 3px solid #FF3B30;
                border-top: 1px solid var(--vercel-border);
                border-right: 1px solid var(--vercel-border);
                border-bottom: 1px solid var(--vercel-border);
                padding: 12px;
                border-radius: 10px;
                margin-top: 14px;
                font-size: 0.74rem;
                font-weight: 700;
                color: #FF453A;
                letter-spacing: 0.3px;
                text-transform: uppercase;
            }

            /* Main Endpoint Container Area */
            .endpoint-list {
                flex-grow: 1;
                margin: 16px 0;
                overflow-y: auto;
                padding-right: 4px;
                display: flex;
                flex-direction: column;
                gap: 10px;
            }

            .api-row {
                background: var(--vercel-gray-light);
                border: 1px solid var(--vercel-border);
                border-radius: 14px;
                padding: 14px 18px;
                display: flex;
                justify-content: space-between;
                align-items: center;
                transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
            }

            .api-row:hover {
                background: #121212;
                border-color: #333333;
                transform: translateY(-1px);
                box-shadow: var(--neon-glow);
            }

            .meta-details {
                display: flex;
                flex-direction: column;
                gap: 4px;
                max-width: 72%;
            }

            .endpoint-slug {
                font-family: 'Space Grotesk', monospace;
                font-size: 1.05rem;
                font-weight: 700; /* Super bolded as requested */
                color: #ffffff;
                letter-spacing: -0.3px;
            }

            .endpoint-info {
                font-size: 0.78rem;
                font-weight: 600; /* Bolded font for info too */
                color: var(--vercel-text-muted);
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }

            .btn-launch {
                background: #ffffff;
                color: #000000;
                border: 1px solid #ffffff;
                font-size: 0.7rem;
                font-weight: 800; /* Extra bold text for action button */
                text-transform: uppercase;
                letter-spacing: 0.5px;
                padding: 8px 14px;
                border-radius: 8px;
                text-decoration: none;
                transition: all 0.2s ease;
            }

            .btn-launch:hover {
                background: transparent;
                color: var(--premium-cyan);
                border-color: var(--premium-cyan);
                box-shadow: 0 0 15px rgba(0, 245, 255, 0.3);
            }

            /* Clean Elegant Scrollbar Customizer */
            ::-webkit-scrollbar { width: 4px; }
            ::-webkit-scrollbar-thumb { background: #222222; border-radius: 20px; }
            ::-webkit-scrollbar-thumb:hover { background: #444444; }

            footer {
                display: flex;
                justify-content: space-between;
                align-items: center;
                font-size: 0.75rem;
                font-weight: 700;
                color: var(--vercel-text-muted);
                border-top: 1px solid var(--vercel-border);
                padding-top: 16px;
            }

            .buy-btn {
                color: var(--premium-cyan);
                text-decoration: none;
                font-weight: 800;
                letter-spacing: 0.2px;
                transition: opacity 0.2s;
            }
            .buy-btn:hover { opacity: 0.8; text-shadow: 0 0 10px var(--premium-cyan); }
        </style>
    </head>
    <body>

        <div class="ambient-glow glow-1"></div>
        <div class="ambient-glow glow-2"></div>

        <div class="vercel-box">
            
            <header>
                <h1>HASHU-API-STORE</h1>
                <div class="badge-strict">
                    <div class="dot-red"></div>
                    <span>Strict Auth</span>
                </div>
            </header>

            <div class="security-banner">
                🔒 Premium Unlocked: Now Use Free
            </div>

            <div class="endpoint-list">
                
                <!-- 1. Mediafire -->
                <div class="api-row">
                    <div class="meta-details">
                        <span class="endpoint-slug">/mediafire</span>
                        <span class="endpoint-info">Mediafire Direct Storage Link Parser</span>
                    </div>
                    <a href="/mediafire?url=https://www.mediafire.com/file/n6tgcrktbnov1oy/Queen_Anita-V4.zip/file&apikey=MR_HASHUU_SECRET_123" target="_blank" class="btn-launch">Test</a>
                </div>

                <!-- 2. Spotify -->
                <div class="api-row">
                    <div class="meta-details">
                        <span class="endpoint-slug">/spotify</span>
                        <span class="endpoint-info">Spotify Premium HQ Audio Downloader</span>
                    </div>
                    <a href="/spotify?url=https://open.spotify.com/track/285pBltuF7vW8TeWk8hdRR?si=HWuMcdM3RJ6Yy0b7Uc7uGQ&apikey=MR_HASHUU_SECRET_123" target="_blank" class="btn-launch">Test</a>
                </div>

                <!-- 3. Twitter -->
                <div class="api-row">
                    <div class="meta-details">
                        <span class="endpoint-slug">/twitter</span>
                        <span class="endpoint-info">Twitter / X Multi-Quality Stream Extractor</span>
                    </div>
                    <a href="/twitter?url=https://x.com/elonmusk/status/1870901510319833540&apikey=MR_HASHUU_SECRET_123" target="_blank" class="btn-launch">Test</a>
                </div>

                <!-- 4. Song -->
                <div class="api-row">
                    <div class="meta-details">
                        <span class="endpoint-slug">/song</span>
                        <span class="endpoint-info">YouTube Core Audio Stream Engine</span>
                    </div>
                    <a href="/song?text=faded&apikey=MR_HASHUU_SECRET_123" target="_blank" class="btn-launch">Test</a>
                </div>

                <!-- 5. TikTok -->
                <div class="api-row">
                    <div class="meta-details">
                        <span class="endpoint-slug">/tiktok</span>
                        <span class="endpoint-info">TikTok Original Video No-Watermark Extractor</span>
                    </div>
                    <a href="/tiktok?url=https://vm.tiktok.com/ZM6789/&apikey=MR_HASHUU_SECRET_123" target="_blank" class="btn-launch">Test</a>
                </div>

                <!-- 6. Pinterest -->
                <div class="api-row">
                    <div class="meta-details">
                        <span class="endpoint-slug">/pinterest</span>
                        <span class="endpoint-info">Pinterest HD Resolution Visual Grid Search</span>
                    </div>
                    <a href="/pinterest?text=cyberpunk&apikey=MR_HASHUU_SECRET_123" target="_blank" class="btn-launch">Test</a>
                </div>

                <!-- 7. APK Downloader -->
                <div class="api-row">
                    <div class="meta-details">
                        <span class="endpoint-slug">/apk</span>
                        <span class="endpoint-info">Android Package App Safe Mirror Provider</span>
                    </div>
                    <a href="/apk?text=whatsapp&apikey=MR_HASHUU_SECRET_123" target="_blank" class="btn-launch">Test</a>
                </div>

                <!-- 8. Facebook -->
                <div class="api-row">
                    <div class="meta-details">
                        <span class="endpoint-slug">/facebook</span>
                        <span class="endpoint-info">Facebook Video Links CDN Resolver</span>
                    </div>
                    <a href="/facebook?url=https://www.facebook.com/watch/?v=123&apikey=MR_HASHUU_SECRET_123" target="_blank" class="btn-launch">Test</a>
                </div>

                <!-- 9. Website Cloner -->
                <div class="api-row">
                    <div class="meta-details">
                        <span class="endpoint-slug">/webdl</span>
                        <span class="endpoint-info">Static Page Cloner Repository Downloader</span>
                    </div>
                    <a href="/webdl?url=https://example.com&apikey=MR_HASHUU_SECRET_123" target="_blank" class="btn-launch">Test</a>
                </div>

                <!-- 10. JS Obfuscator -->
                <div class="api-row">
                    <div class="meta-details">
                        <span class="endpoint-slug">/obfuscate</span>
                        <span class="endpoint-info">Anti-Theft JavaScript Security Module</span>
                    </div>
                    <a href="/obfuscate?code=console.log('hashu')&apikey=MR_HASHUU_SECRET_123" target="_blank" class="btn-launch">Test</a>
                </div>

                <!-- 11. ImgBB Uploader -->
                <div class="api-row">
                    <div class="meta-details">
                        <span class="endpoint-slug">/imgbb (POST)</span>
                        <span class="endpoint-info">Cloud Photo CDN Hosting Interface</span>
                    </div>
                    <span style="font-size:0.7rem; font-weight:bold; color:var(--premium-purple)">POST REQ</span>
                </div>

            </div>

            <footer>
                <span>&copy; 2026 MR HASHUU</span>
                <a href="https://wa.me/your-number-here" target="_blank" class="buy-btn">GET ACCESS KEY</a>
            </footer>
        </div>

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
    app.listen(3000, () => console.log("Premium HASHU-API Luxury Matrix Matrix Running on port 3000"));
}

module.exports = app;
