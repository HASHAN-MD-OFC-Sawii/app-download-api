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

const MY_SECRET_KEY = "MR_HASHUU_SECRET_123";

// 🛡️ Global Rate Limiter
const apiLimiter = rateLimit({
    windowMs: 24 * 60 * 60 * 1000,
    max: 100,
    skip: (req) => req.query.apikey === MY_SECRET_KEY,
    message: { success: false, message: "Free limit reached. Get Premium!" }
});

app.use(apiLimiter);

// ─────────────────────────────────────────────────────────
// 🌌 0. VERCEL ULTRA-MINIMALIST DEEP DARK LANDING PAGE
// ─────────────────────────────────────────────────────────
app.get('/', (req, res) => {
    res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
        <title>MR HASHUU - Developer Core</title>
        <style>
            :root {
                --vercel-black: #000000;
                --vercel-gray-dark: #0a0a0a;
                --vercel-gray-light: #111111;
                --vercel-border: #333333;
                --vercel-text-muted: #888888;
                --premium-cyan: #00F5FF;
                --premium-purple: #7B2CBF;
            }
            
            * { box-sizing: border-box; margin: 0; padding: 0; }
            
            body {
                background-color: var(--vercel-black);
                color: #ffffff;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
                height: 100vh;
                width: 100vw;
                display: flex;
                justify-content: center;
                align-items: center;
                overflow: hidden; /* Strict Screen Fit - No Scrollbars */
                position: relative;
            }

            /* Vercel Ambient Radial Soft Glow - Pure Luxury */
            .ambient-glow {
                position: absolute;
                width: 600px;
                height: 600px;
                border-radius: 50%;
                filter: blur(140px);
                opacity: 0.15;
                z-index: 0;
                pointer-events: none;
                animation: smoothFlicker 8s infinite alternate ease-in-out;
            }
            .glow-1 { background: var(--premium-purple); top: -20%; left: -10%; }
            .glow-2 { background: var(--premium-cyan); bottom: -20%; right: -10%; animation-delay: 4s; }

            @annotation-keyframes smoothFlicker {
                0% { opacity: 0.1; transform: scale(0.95); }
                100% { opacity: 0.2; transform: scale(1.05); }
            }

            /* Vercel Style Main Container Box */
            .vercel-box {
                width: 92%;
                max-width: 450px;
                height: 88vh; /* Perfectly proportional on all mobile display panels */
                background: var(--vercel-gray-dark);
                border: 1px solid var(--vercel-border);
                border-radius: 16px;
                padding: 24px 20px;
                z-index: 2;
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                box-shadow: 0 30px 100px rgba(0,0,0,0.9);
                animation: fadeInBox 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
            }

            @keyframes fadeInBox {
                from { opacity: 0; transform: translateY(20px); }
                to { opacity: 1; transform: translateY(0); }
            }

            /* Clean Header Logic */
            header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                border-bottom: 1px solid var(--vercel-border);
                padding-bottom: 16px;
            }

            header h1 {
                font-size: 1.25rem;
                font-weight: 700;
                letter-spacing: -0.5px;
                color: #ffffff;
            }

            .badge-active {
                display: inline-flex;
                align-items: center;
                gap: 6px;
                font-size: 0.7rem;
                font-weight: 600;
                text-transform: uppercase;
                letter-spacing: 0.5px;
                color: #00FF66;
                background: rgba(0, 255, 102, 0.05);
                padding: 4px 10px;
                border-radius: 6px;
                border: 1px solid rgba(0, 255, 102, 0.15);
            }

            .dot {
                width: 6px;
                height: 6px;
                background: #00FF66;
                border-radius: 50%;
                box-shadow: 0 0 8px #00FF66;
            }

            /* Inner Scroll Container for Endpoints */
            .endpoint-list {
                flex-grow: 1;
                margin: 16px 0;
                overflow-y: auto; /* Internal scrolling while main page stays fixed */
                padding-right: 4px;
                display: flex;
                flex-direction: column;
                gap: 8px;
            }

            /* Vercel Style Minimalist Card */
            .api-row {
                background: var(--vercel-gray-light);
                border: 1px solid var(--vercel-border);
                border-radius: 10px;
                padding: 14px 16px;
                display: flex;
                justify-content: space-between;
                align-items: center;
                transition: background 0.2s, border-color 0.2s;
            }

            .api-row:hover {
                background: #161616;
                border-color: #444444;
            }

            .meta-details {
                display: flex;
                flex-direction: column;
                gap: 2px;
            }

            .endpoint-slug {
                font-family: monospace;
                font-size: 0.98rem;
                font-weight: 600;
                color: #ffffff;
            }

            .endpoint-info {
                font-size: 0.78rem;
                color: var(--vercel-text-muted);
            }

            /* Clean Interactive Buttons */
            .btn-launch {
                background: #ffffff;
                color: #000000;
                border: 1px solid #ffffff;
                font-size: 0.72rem;
                font-weight: 600;
                text-transform: uppercase;
                padding: 7px 14px;
                border-radius: 6px;
                text-decoration: none;
                transition: all 0.15s ease;
            }

            .btn-launch:hover {
                background: transparent;
                color: #ffffff;
                box-shadow: 0 0 12px rgba(255,255,255,0.1);
            }

            .btn-launch:active {
                transform: scale(0.97);
            }

            /* Custom Premium Thin Scrollbar */
            ::-webkit-scrollbar { width: 3px; }
            ::-webkit-scrollbar-thumb { background: #222222; border-radius: 10px; }
            ::-webkit-scrollbar-thumb:hover { background: #444444; }

            footer {
                display: flex;
                justify-content: space-between;
                align-items: center;
                font-size: 0.72rem;
                color: var(--vercel-text-muted);
                border-top: 1px solid var(--vercel-border);
                padding-top: 14px;
            }
        </style>
    </head>
    <body>

        <!-- Luxury Ambient Overlays -->
        <div class="ambient-glow glow-1"></div>
        <div class="ambient-glow glow-2"></div>

        <!-- Master Box -->
        <div class="vercel-box">
            
            <!-- Header Module -->
            <header>
                <h1>mr-hashuu-core</h1>
                <div class="badge-active">
                    <div class="dot"></div>
                    <span>Production</span>
                </div>
            </header>

            <!-- Dynamic Endpoint Container -->
            <div class="endpoint-list">
                
                <!-- 1. Song Downloader -->
                <div class="api-row">
                    <div class="meta-details">
                        <span class="endpoint-slug">/song</span>
                        <span class="endpoint-info">YouTube Audio Downloader Node</span>
                    </div>
                    <a href="/song?text=faded&apikey=MR_HASHUU_SECRET_123" target="_blank" class="btn-launch">Launch</a>
                </div>

                <!-- 2. TikTok Downloader -->
                <div class="api-row">
                    <div class="meta-details">
                        <span class="endpoint-slug">/tiktok</span>
                        <span class="endpoint-info">TikTok Media Asset Bypass</span>
                    </div>
                    <a href="/tiktok?url=https://vm.tiktok.com/ZM6789/&apikey=MR_HASHUU_SECRET_123" target="_blank" class="btn-launch">Launch</a>
                </div>

                <!-- 3. Pinterest Search -->
                <div class="api-row">
                    <div class="meta-details">
                        <span class="endpoint-slug">/pinterest</span>
                        <span class="endpoint-info">Pinterest Engine Data Grabber</span>
                    </div>
                    <a href="/pinterest?text=cyberpunk&apikey=MR_HASHUU_SECRET_123" target="_blank" class="btn-launch">Launch</a>
                </div>

                <!-- 4. APK Downloader -->
                <div class="api-row">
                    <div class="meta-details">
                        <span class="endpoint-slug">/apk</span>
                        <span class="endpoint-info">Android Package Mirror System</span>
                    </div>
                    <a href="/apk?text=whatsapp&apikey=MR_HASHUU_SECRET_123" target="_blank" class="btn-launch">Launch</a>
                </div>

                <!-- 5. Facebook Downloader -->
                <div class="api-row">
                    <div class="meta-details">
                        <span class="endpoint-slug">/facebook</span>
                        <span class="endpoint-info">Facebook Video Link Decoder</span>
                    </div>
                    <a href="/facebook?url=https://www.facebook.com/watch/?v=123&apikey=MR_HASHUU_SECRET_123" target="_blank" class="btn-launch">Launch</a>
                </div>

                <!-- 6. Website Cloner -->
                <div class="api-row">
                    <div class="meta-details">
                        <span class="endpoint-slug">/webdl</span>
                        <span class="endpoint-info">Static Page Cloner Repository</span>
                    </div>
                    <a href="/webdl?url=https://example.com&apikey=MR_HASHUU_SECRET_123" target="_blank" class="btn-launch">Launch</a>
                </div>

                <!-- 7. JS Obfuscator -->
                <div class="api-row">
                    <div class="meta-details">
                        <span class="endpoint-slug">/obfuscate</span>
                        <span class="endpoint-info">Anti-Theft Code Shuffler Module</span>
                    </div>
                    <a href="/obfuscate?code=console.log('hashu')&level=medium&apikey=MR_HASHUU_SECRET_123" target="_blank" class="btn-launch">Launch</a>
                </div>

            </div>

            <!-- Footer Module -->
            <footer>
                <span>Status: Operational</span>
                <span>&copy; 2026 MR HASHUU</span>
            </footer>
        </div>

    </body>
    </html>
    `);
});

// ─────────────────────────────────────────────────────────
// 1. PINTEREST ROUTE
// ─────────────────────────────────────────────────────────
app.get('/pinterest', async (req, res) => {
    try {
        const { text } = req.query;
        if (!text) return res.json({ success: false, message: "Query required" });
        const { data } = await axios.get(`https://apis.davidcyriltech.my.id/search/pinterest?text=${encodeURIComponent(text)}`);
        res.json({ creator: "Mr Hashuu Bot", success: true, result: data.result || [] });
    } catch (e) { res.json({ success: false, message: e.message }); }
});

// ─────────────────────────────────────────────────────────
// 2. APK ROUTE
// ─────────────────────────────────────────────────────────
app.get('/apk', async (req, res) => {
    try {
        const { text } = req.query;
        if (!text) return res.json({ success: false, message: "Query required" });
        const { data } = await axios.get(`https://apis.davidcyriltech.my.id/download/apk?text=${encodeURIComponent(text)}`, { 
            headers: { 'User-Agent': 'Mozilla/5.0' }, timeout: 8000 
        });
        res.json({ creator: "Mr Hashuu Bot", success: true, result: data.apk || {} });
    } catch (e) { res.json({ success: false, message: e.message }); }
});

// ─────────────────────────────────────────────────────────
// 3. YOUTUBE MP3 SONG ROUTE
// ─────────────────────────────────────────────────────────
app.get('/song', async (req, res) => {
    try {
        const { text } = req.query;
        if (!text) return res.json({ success: false, message: "Song name or URL required" });
        const { data } = await axios.get(`https://apis.davidcyriltech.my.id/play?query=${encodeURIComponent(text)}`);
        if (data.status && data.result) {
            res.json({ 
                creator: "Mr Hashuu Bot", 
                success: true, 
                result: {
                    title: data.result.title || "YouTube Audio",
                    downloadUrl: data.result.download_url,
                    duration: data.result.duration || "N/A",
                    views: data.result.views || 0,
                    published: data.result.published || "N/A",
                    thumb: data.result.thumbnail || ""
                }
            });
        } else { res.json({ success: false, message: "Failed to fetch song from server." }); }
    } catch (e) { res.json({ success: false, message: "Server error: " + e.message }); }
});

// ─────────────────────────────────────────────────────────
// 4. OBFUSCATE ROUTE
// ─────────────────────────────────────────────────────────
app.get('/obfuscate', (req, res) => {
    try {
        const { code, level } = req.query;
        if (!code) return res.json({ success: false, message: "Code parameter missing!" });
        const intensity = level === 'high' ? 0.75 : level === 'medium' ? 0.4 : 0.1;
        const obfuscatedCode = obfuscator.obfuscate(code, {
            compact: true,
            controlFlowFlattening: true,
            controlFlowFlatteningThreshold: intensity,
            deadCodeInjection: intensity > 0.3,
            stringArray: true
        }).getObfuscatedCode();
        res.json({ creator: "Mr Hashuu Bot", success: true, result: obfuscatedCode });
    } catch (e) { res.json({ success: false, message: e.message }); }
});

// ─────────────────────────────────────────────────────────
// 5. FACEBOOK DOWNLOADER ROUTE
// ─────────────────────────────────────────────────────────
app.get('/facebook', async (req, res) => {
    try {
        const { url } = req.query;
        if (!url) return res.json({ success: false, message: "URL parameter missing!" });
        const { data } = await axios.get(`https://apis.davidcyriltech.my.id/facebook2?url=${encodeURIComponent(url)}`);
        if (data.status) {
            res.json({ creator: "Mr Hashuu Bot", success: true, result: data.video });
        } else { res.json({ success: false, message: "Could not fetch video." }); }
    } catch (e) { res.json({ success: false, message: e.message }); }
});

// ─────────────────────────────────────────────────────────
// 6. IMGBB IMAGE UPLOADER ROUTE
// ─────────────────────────────────────────────────────────
app.post('/imgbb', upload.single('file'), async (req, res) => {
    try {
        if (!req.file) return res.json({ success: false, message: "No file uploaded!" });
        const form = new FormData();
        form.append('file', req.file.buffer, { filename: req.file.originalname || 'image.jpg', contentType: req.file.mimetype });
        const { data } = await axios.post('https://apis.davidcyriltech.my.id/uploader/imgbb', form, { headers: { ...form.getHeaders(), 'User-Agent': 'Mozilla/5.0' } });
        if (data.success) { res.json({ creator: "Mr Hashuu Bot", success: true, result: data.data }); }
        else { res.json({ success: false, message: "Upload failed." }); }
    } catch (e) { res.json({ success: false, message: e.message }); }
});

// ─────────────────────────────────────────────────────────
// 7. TIKTOK DOWNLOADER ROUTE
// ─────────────────────────────────────────────────────────
app.get('/tiktok', async (req, res) => {
    try {
        const { url } = req.query;
        if (!url) return res.json({ success: false, message: "TikTok URL required!" });
        const { data } = await axios.get(`https://apis.davidcyriltech.my.id/download/tiktok?url=${encodeURIComponent(url)}`);
        if (data.success && data.result) {
            res.json({ creator: "Mr Hashuu Bot", success: true, result: data.result });
        } else { res.json({ success: false, message: "Invalid TikTok URL or media not found." }); }
    } catch (e) { res.json({ success: false, message: e.message }); }
});

// ─────────────────────────────────────────────────────────
// 8. WEBSITE DOWNLOADER ROUTE
// ─────────────────────────────────────────────────────────
app.get('/webdl', async (req, res) => {
    try {
        const { url } = req.query;
        if (!url) return res.json({ success: false, message: "Website URL parameter missing!" });
        const { data } = await axios.get(`https://apis.davidcyriltech.my.id/tools/downloadweb?url=${encodeURIComponent(url)}`);
        if (data.response && (data.response.success === true || data.response.success === "true")) {
            res.json({ 
                creator: "Mr Hashuu Bot", 
                success: true, 
                result: { downloadUrl: data.response.downloadUrl, isFinished: data.response.isFinished }
            });
        } else { res.json({ success: false, message: "Failed to clone the website. Ensure the target URL is active." }); }
    } catch (e) { res.json({ success: false, message: e.message }); }
});

// ─────────────────────────────────────────────────────────
// PORT LISTENER
// ─────────────────────────────────────────────────────────
if (require.main === module) {
    app.listen(3000, () => console.log("HASHU-API Elite Engine Running on port 3000"));
}

module.exports = app;
