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
// 🌌 0. GALACTIC CYBERPUNK 1000+ EFFECTS SCREEN-FIT LANDING PAGE
// ─────────────────────────────────────────────────────────
app.get('/', (req, res) => {
    res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
        <title>MR HASHUU - Galactic API Hub</title>
        <style>
            :root {
                --purple: #7B2CBF;
                --cyan: #00F5FF;
                --magenta: #FF007F;
                --dark-core: #020205;
                --glass-core: rgba(5, 5, 10, 0.6);
                --neon-border: rgba(0, 245, 255, 0.25);
            }
            
            * { box-sizing: border-box; margin: 0; padding: 0; }
            
            body {
                background-color: var(--dark-core);
                color: #ffffff;
                font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
                height: 100vh;
                width: 100vw;
                display: flex;
                justify-content: center;
                align-items: center;
                overflow: hidden; /* Perfect Screen Fit - No Ugly Scrollbars */
                position: relative;
                perspective: 1000px;
            }

            /* EFFECT 1: Moving Cyber Grid Matrix Background */
            body::before {
                content: '';
                position: absolute;
                inset: 0;
                background-image: 
                    linear-gradient(rgba(0, 245, 255, 0.015) 1px, transparent 1px),
                    linear-gradient(90deg, rgba(0, 245, 255, 0.015) 1px, transparent 1px);
                background-size: 25px 25px;
                background-position: center center;
                z-index: 0;
                animation: gridTravel 25s linear infinite;
            }

            @keyframes gridTravel {
                0% { background-position: 0 0; }
                100% { background-position: 50px 50px; }
            }

            /* EFFECT 2 & 3: Shifting Galactic Plasma Auroras */
            .aurora {
                position: absolute;
                width: 450px;
                height: 450px;
                border-radius: 50%;
                filter: blur(150px);
                opacity: 0.35;
                z-index: 0;
                mix-blend-mode: screen;
                animation: plasmaShift 10s infinite alternate ease-in-out;
            }
            .aurora-1 { background: var(--purple); top: -10%; left: -10%; }
            .aurora-2 { background: var(--cyan); bottom: -10%; right: -10%; animation-delay: 5s; }
            .aurora-3 { background: var(--magenta); top: 50%; left: 50%; transform: translate(-50%, -50%); animation-delay: 2.5s; opacity: 0.15; }

            @keyframes plasmaShift {
                0% { transform: scale(1) translate(0px, 0px) rotate(0deg); }
                100% { transform: scale(1.2) translate(50px, 30px) rotate(180deg); }
            }

            /* Master Responsive Card Framework */
            .galactic-container {
                width: 92%;
                max-width: 460px;
                height: 90vh; /* Scaled seamlessly for short and tall phone screens */
                background: var(--glass-core);
                backdrop-filter: blur(25px);
                -webkit-backdrop-filter: blur(25px);
                border: 1px solid var(--neon-border);
                border-radius: 30px;
                padding: 25px 20px;
                z-index: 2;
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                box-shadow: 0 25px 60px rgba(0,0,0,0.8), inset 0 1px 2px rgba(255,255,255,0.1);
                animation: entryScale 1.2s cubic-bezier(0.1, 1, 0.1, 1) forwards;
                position: relative;
            }

            @keyframes entryScale {
                from { opacity: 0; transform: scale(0.9) translateY(40px) rotateX(-10deg); }
                to { opacity: 1; transform: scale(1) translateY(0) rotateX(0deg); }
            }

            /* EFFECT 4: Tech Scanning Border Animation Overlay */
            .scan-line {
                position: absolute;
                top: 0; left: 0; width: 100%; height: 4px;
                background: linear-gradient(90deg, transparent, var(--cyan), var(--magenta), transparent);
                opacity: 0.5;
                animation: radarScan 4s linear infinite;
                border-radius: 30px;
            }

            @keyframes radarScan {
                0% { top: 0%; opacity: 0; }
                5% { opacity: 1; }
                95% { opacity: 1; }
                100% { top: 100%; opacity: 0; }
            }

            /* Header Section Styling */
            header {
                text-align: center;
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 8px;
            }

            header h1 {
                font-size: 1.65rem;
                font-weight: 900;
                letter-spacing: -0.5px;
                text-transform: uppercase;
                background: linear-gradient(45deg, #ffffff, var(--cyan), var(--magenta));
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                animation: hueRotate 8s linear infinite;
            }

            @keyframes hueRotate {
                0% { filter: hue-rotate(0deg); }
                100% { filter: hue-rotate(360deg); }
            }

            .status-badge {
                display: inline-flex;
                align-items: center;
                gap: 8px;
                font-size: 0.72rem;
                font-weight: 800;
                letter-spacing: 2px;
                text-transform: uppercase;
                background: rgba(0, 245, 255, 0.05);
                color: var(--cyan);
                padding: 6px 16px;
                border-radius: 40px;
                border: 1px solid rgba(0, 245, 255, 0.2);
                box-shadow: 0 0 15px rgba(0, 245, 255, 0.1);
            }

            .pulse-ring {
                width: 6px;
                height: 6px;
                background: var(--cyan);
                border-radius: 50%;
                position: relative;
            }
            .pulse-ring::before {
                content: '';
                position: absolute;
                inset: -4px;
                border: 1px solid var(--cyan);
                border-radius: 50%;
                animation: ringPulse 1.5s infinite linear;
            }

            @keyframes ringPulse {
                0% { transform: scale(0.6); opacity: 1; }
                100% { transform: scale(1.8); opacity: 0; }
            }

            /* Scrollable Micro-Mesh Engine Wrapper */
            .mesh-panel {
                flex-grow: 1;
                margin: 20px 0;
                overflow-y: auto; /* Handles inner elements beautifully on tiny mobile screens */
                padding-right: 5px;
                display: flex;
                flex-direction: column;
                gap: 10px;
            }

            /* EFFECT 5: Animated Mesh Cards */
            .route-card {
                background: rgba(255, 255, 255, 0.01);
                border: 1px solid rgba(255, 255, 255, 0.03);
                border-radius: 16px;
                padding: 12px 16px;
                display: flex;
                justify-content: space-between;
                align-items: center;
                transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
                position: relative;
                overflow: hidden;
            }

            .route-card:hover {
                background: rgba(123, 44, 191, 0.06);
                border-color: rgba(0, 245, 255, 0.4);
                transform: translateY(-2px) scale(1.01);
                box-shadow: 0 8px 20px rgba(0, 245, 255, 0.1);
            }

            .route-info {
                display: flex;
                flex-direction: column;
                gap: 2px;
            }

            .route-name {
                font-family: 'Courier New', Courier, monospace;
                font-size: 1.1rem;
                font-weight: 800;
                color: #ffffff;
                transition: color 0.3s;
            }
            .route-card:hover .route-name { color: var(--cyan); }

            .route-desc {
                font-size: 0.75rem;
                color: #787895;
            }

            /* EFFECT 6: Cyber Glow Test Action Buttons */
            .btn-action {
                background: linear-gradient(135deg, rgba(123, 44, 191, 0.3), rgba(0, 245, 255, 0.15));
                border: 1px solid rgba(0, 245, 255, 0.3);
                color: #ffffff;
                font-size: 0.72rem;
                font-weight: 800;
                text-transform: uppercase;
                letter-spacing: 1px;
                padding: 8px 16px;
                border-radius: 12px;
                text-decoration: none;
                transition: all 0.25s ease;
                box-shadow: 0 4px 10px rgba(0,0,0,0.4);
            }

            .btn-action:hover {
                background: linear-gradient(135deg, var(--purple), var(--magenta));
                border-color: transparent;
                box-shadow: 0 0 20px rgba(255, 0, 127, 0.5);
                transform: scale(1.05);
            }

            .btn-action:active { transform: scale(0.95); }

            /* Webkit Custom Scrollbars */
            ::-webkit-scrollbar { width: 4px; }
            ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.04); border-radius: 10px; }
            ::-webkit-scrollbar-thumb:hover { background: var(--cyan); }

            footer {
                text-align: center;
                font-size: 0.7rem;
                color: #525266;
                letter-spacing: 1px;
                text-transform: uppercase;
                border-top: 1px solid rgba(255,255,255,0.03);
                padding-top: 15px;
            }
        </style>
    </head>
    <body>

        <div class="aurora aurora-1"></div>
        <div class="aurora aurora-2"></div>
        <div class="aurora aurora-3"></div>

        <div class="galactic-container">
            <div class="scan-line"></div>

            <header>
                <h1>MR HASHUU ENGINE</h1>
                <div class="status-badge">
                    <div class="pulse-ring"></div>
                    <span>Quantum Core Active</span>
                </div>
            </header>

            <div class="mesh-panel">
                
                <div class="route-card">
                    <div class="route-info">
                        <span class="route-name">/song</span>
                        <span class="route-desc">YouTube MP3 Stream & Downloader</span>
                    </div>
                    <a href="/song?text=faded&apikey=MR_HASHUU_SECRET_123" target="_blank" class="btn-action">Test App</a>
                </div>

                <div class="route-card">
                    <div class="route-info">
                        <span class="route-name">/tiktok</span>
                        <span class="route-desc">TikTok No-Watermark Media Server</span>
                    </div>
                    <a href="/tiktok?url=https://vm.tiktok.com/ZM6789/&apikey=MR_HASHUU_SECRET_123" target="_blank" class="btn-action">Test App</a>
                </div>

                <div class="route-card">
                    <div class="route-info">
                        <span class="route-name">/pinterest</span>
                        <span class="route-desc">Pinterest Media Asset Search Engine</span>
                    </div>
                    <a href="/pinterest?text=cyberpunk&apikey=MR_HASHUU_SECRET_123" target="_blank" class="btn-action">Test App</a>
                </div>

                <div class="route-card">
                    <div class="route-info">
                        <span class="route-name">/apk</span>
                        <span class="route-desc">Android Package Binary Extractor</span>
                    </div>
                    <a href="/apk?text=whatsapp&apikey=MR_HASHUU_SECRET_123" target="_blank" class="btn-action">Test App</a>
                </div>

                <div class="route-card">
                    <div class="route-info">
                        <span class="route-name">/facebook</span>
                        <span class="route-desc">Facebook HD Social Link Parser</span>
                    </div>
                    <a href="/facebook?url=https://www.facebook.com/watch/?v=123&apikey=MR_HASHUU_SECRET_123" target="_blank" class="btn-action">Test App</a>
                </div>

                <div class="route-card">
                    <div class="route-info">
                        <span class="route-name">/webdl</span>
                        <span class="route-desc">Website Source Asset Compiler</span>
                    </div>
                    <a href="/webdl?url=https://example.com&apikey=MR_HASHUU_SECRET_123" target="_blank" class="btn-action">Test App</a>
                </div>

                <div class="route-card">
                    <div class="route-info">
                        <span class="route-name">/obfuscate</span>
                        <span class="route-desc">JavaScript Logic Polymorphic Layer</span>
                    </div>
                    <a href="/obfuscate?code=console.log('hashu')&level=medium&apikey=MR_HASHUU_SECRET_123" target="_blank" class="btn-action">Test App</a>
                </div>

            </div>

            <footer>Cloud Cluster Mesh &copy; 2026 MR HASHUU</footer>
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
    app.listen(3000, () => console.log("HASHU-API Galactic Engine Running on port 3000"));
}

module.exports = app;
