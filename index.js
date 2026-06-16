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
// 🌌 0. PREMIUM MOBILE-FIT LANDING PAGE WITH ACTIVE TEST LINKS
// ─────────────────────────────────────────────────────────
app.get('/', (req, res) => {
    res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>MR HASHUU - API Hub</title>
        <style>
            :root {
                --purple: #7B2CBF;
                --cyan: #00F5FF;
                --dark-bg: #06060c;
                --glass: rgba(255, 255, 255, 0.02);
                --border: rgba(0, 245, 255, 0.15);
            }
            
            * { box-sizing: border-box; margin: 0; padding: 0; }
            
            body {
                background-color: var(--dark-bg);
                color: #ffffff;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                min-height: 100vh;
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                align-items: center;
                padding: 15px;
                overflow-x: hidden;
                position: relative;
            }

            /* Neon Ambient Glow Effects */
            body::before, body::after {
                content: '';
                position: absolute;
                width: 250px;
                height: 250px;
                border-radius: 50%;
                filter: blur(100px);
                opacity: 0.3;
                z-index: 0;
                animation: pulseGlow 6s infinite alternate ease-in-out;
            }
            body::before { background: var(--purple); top: -5%; left: -5%; }
            body::after { background: var(--cyan); bottom: -5%; right: -5%; animation-delay: 3s; }

            @keyframes pulseGlow {
                0% { transform: scale(1); opacity: 0.2; }
                100% { transform: scale(1.3); opacity: 0.4; }
            }

            /* Full Screen Container */
            .wrapper {
                width: 100%;
                max-width: 550px; /* Perfect sizing for Mobile & Desktop */
                z-index: 1;
                display: flex;
                flex-direction: column;
                gap: 15px;
            }

            /* Top Glow Header */
            header {
                background: var(--glass);
                backdrop-filter: blur(15px);
                -webkit-backdrop-filter: blur(15px);
                border: 1px solid var(--border);
                border-radius: 20px;
                padding: 20px;
                text-align: center;
                box-shadow: 0 10px 30px rgba(0, 245, 255, 0.03);
            }

            header h1 {
                font-size: 1.6rem;
                font-weight: 900;
                letter-spacing: -0.5px;
                background: linear-gradient(90deg, #fff, var(--cyan), var(--purple));
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                margin-bottom: 8px;
            }

            .status-badge {
                display: inline-flex;
                align-items: center;
                gap: 8px;
                font-size: 0.75rem;
                font-weight: 800;
                letter-spacing: 1px;
                text-transform: uppercase;
                background: rgba(0, 255, 102, 0.08);
                color: #00FF66;
                padding: 6px 14px;
                border-radius: 30px;
                border: 1px solid rgba(0, 255, 102, 0.2);
            }

            .pulse-dot {
                width: 8px;
                height: 8px;
                background: #00FF66;
                border-radius: 50%;
                box-shadow: 0 0 10px #00FF66;
                animation: blink 1.2s infinite;
            }

            @keyframes blink {
                0%, 100% { opacity: 0.4; }
                50% { opacity: 1; }
            }

            /* Main Endpoints Engine */
            .panel {
                background: var(--glass);
                backdrop-filter: blur(15px);
                -webkit-backdrop-filter: blur(15px);
                border: 1px solid rgba(255, 255, 255, 0.04);
                border-radius: 24px;
                padding: 15px;
                display: flex;
                flex-direction: column;
                gap: 10px;
            }

            .panel-title {
                font-size: 0.85rem;
                font-weight: 700;
                text-transform: uppercase;
                letter-spacing: 1.5px;
                color: #8a8a9e;
                padding: 5px 10px;
                margin-bottom: 5px;
            }

            /* Endpoint Grid Items */
            .route-card {
                background: rgba(0, 0, 0, 0.2);
                border: 1px solid rgba(255, 255, 255, 0.02);
                border-radius: 16px;
                padding: 12px 16px;
                display: flex;
                justify-content: space-between;
                align-items: center;
                transition: transform 0.2s ease, border-color 0.2s ease;
            }

            .route-card:hover {
                border-color: rgba(123, 44, 191, 0.4);
                transform: scale(1.01);
            }

            .route-info {
                display: flex;
                flex-direction: column;
                gap: 2px;
            }

            .route-name {
                font-family: monospace;
                font-size: 1.05rem;
                font-weight: 700;
                color: var(--cyan);
            }

            .route-desc {
                font-size: 0.78rem;
                color: #71718a;
            }

            /* Ultra-premium Clickable Test Buttons */
            .btn-test {
                background: linear-gradient(135deg, rgba(123, 44, 191, 0.2), rgba(0, 245, 255, 0.1));
                border: 1px solid rgba(0, 245, 255, 0.25);
                color: #ffffff;
                font-size: 0.75rem;
                font-weight: 700;
                text-transform: uppercase;
                letter-spacing: 0.5px;
                padding: 8px 14px;
                border-radius: 10px;
                text-decoration: none;
                transition: all 0.2s ease;
                box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            }

            .btn-test:hover {
                background: linear-gradient(135deg, var(--purple), var(--cyan));
                border-color: transparent;
                box-shadow: 0 0 15px rgba(0, 245, 255, 0.4);
                transform: translateY(-1px);
            }

            .btn-test:active {
                transform: translateY(1px);
            }

            footer {
                text-align: center;
                font-size: 0.75rem;
                color: #444455;
                padding: 10px 0;
                letter-spacing: 0.5px;
                width: 100%;
            }
        </style>
    </head>
    <body>

        <div class="wrapper">
            <header>
                <h1>MR HASHUU ENGINE</h1>
                <div class="status-badge">
                    <div class="pulse-dot"></div>
                    <span>Core Server Active</span>
                </div>
            </header>

            <div class="panel">
                <div class="panel-title">Available Operations</div>

                <div class="route-card">
                    <div class="route-info">
                        <span class="route-name">/song</span>
                        <span class="route-desc">YouTube MP3 Downloader Engine</span>
                    </div>
                    <a href="/song?text=faded&apikey=MR_HASHUU_SECRET_123" target="_blank" class="btn-test">Try Link</a>
                </div>

                <div class="route-card">
                    <div class="route-info">
                        <span class="route-name">/tiktok</span>
                        <span class="route-desc">TikTok Video Downloader No-WM</span>
                    </div>
                    <a href="/tiktok?url=https://vm.tiktok.com/ZM6789/&apikey=MR_HASHUU_SECRET_123" target="_blank" class="btn-test">Try Link</a>
                </div>

                <div class="route-card">
                    <div class="route-info">
                        <span class="route-name">/pinterest</span>
                        <span class="route-desc">Pinterest High-Res Image Search</span>
                    </div>
                    <a href="/pinterest?text=cyberpunk&apikey=MR_HASHUU_SECRET_123" target="_blank" class="btn-test">Try Link</a>
                </div>

                <div class="route-card">
                    <div class="route-info">
                        <span class="route-name">/apk</span>
                        <span class="route-desc">Android Application APK Fetcher</span>
                    </div>
                    <a href="/apk?text=whatsapp&apikey=MR_HASHUU_SECRET_123" target="_blank" class="btn-test">Try Link</a>
                </div>

                <div class="route-card">
                    <div class="route-info">
                        <span class="route-name">/facebook</span>
                        <span class="route-desc">Facebook HD Video Link Extractor</span>
                    </div>
                    <a href="/facebook?url=https://www.facebook.com/watch/?v=123&apikey=MR_HASHUU_SECRET_123" target="_blank" class="btn-test">Try Link</a>
                </div>

                <div class="route-card">
                    <div class="route-info">
                        <span class="route-name">/webdl</span>
                        <span class="route-desc">Website Source Code Cloner</span>
                    </div>
                    <a href="/webdl?url=https://example.com&apikey=MR_HASHUU_SECRET_123" target="_blank" class="btn-test">Try Link</a>
                </div>

                <div class="route-card">
                    <div class="route-info">
                        <span class="route-name">/obfuscate</span>
                        <span class="route-desc">JavaScript Source Anti-Tamper</span>
                    </div>
                    <a href="/obfuscate?code=console.log('hashu')&level=medium&apikey=MR_HASHUU_SECRET_123" target="_blank" class="btn-test">Try Link</a>
                </div>
            </div>
        </div>

        <footer>Engineered & Protected by MR HASHUU &copy; 2026</footer>

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
    app.listen(3000, () => console.log("HASHU-API Master Engine Running on port 3000"));
}

module.exports = app;
