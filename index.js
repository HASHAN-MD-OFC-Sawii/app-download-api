const express = require('express');
const axios = require('axios');
const rateLimit = require('express-rate-limit');
const obfuscator = require('javascript-obfuscator');
const cors = require('cors');
const multer = require('multer');
const FormData = require('form-data');

const app = express();
const upload = multer();

// 🌏 CORS Enable කිරීම
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
// 🌐 0. BEAUTIFUL ROOT DASHBOARD ROUTE (🆕 FIXED!)
// ─────────────────────────────────────────────────────────
app.get('/', (req, res) => {
    res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>HASHU-API Master Engine</title>
        <style>
            body {
                background-color: #0d1117;
                color: #c9d1d9;
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                margin: 0;
                padding: 40px 20px;
                display: flex;
                flex-direction: column;
                align-items: center;
            }
            .container {
                max-width: 800px;
                width: 100%;
                background: #161b22;
                border: 1px solid #30363d;
                border-radius: 12px;
                padding: 30px;
                box-shadow: 0 8px 24px rgba(0,0,0,0.5);
            }
            h1 {
                color: #58a6ff;
                margin-top: 0;
                font-size: 2.2rem;
                border-bottom: 2px solid #21262d;
                padding-bottom: 15px;
                text-align: center;
            }
            .status-badge {
                display: inline-block;
                background-color: #238636;
                color: white;
                padding: 6px 14px;
                border-radius: 20px;
                font-size: 0.9rem;
                font-weight: bold;
                margin-bottom: 20px;
            }
            p {
                font-size: 1.1rem;
                line-height: 1.6;
                color: #8b949e;
            }
            .creator {
                font-weight: bold;
                color: #ff7b72;
            }
            .endpoint-list {
                margin-top: 25px;
            }
            .endpoint-item {
                background: #21262d;
                border: 1px solid #30363d;
                border-radius: 6px;
                padding: 12px 18px;
                margin-bottom: 12px;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            .endpoint-name {
                font-family: 'Courier New', Courier, monospace;
                color: #79c0ff;
                font-weight: bold;
                font-size: 1.1rem;
            }
            .endpoint-desc {
                color: #8b949e;
                font-size: 0.95rem;
            }
            footer {
                margin-top: 30px;
                text-align: center;
                font-size: 0.9rem;
                color: #484f58;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>🚀 HASHU-API Master Engine v2.0</h1>
            <div style="text-align: center;">
                <span class="status-badge">● API SERVER ONLINE</span>
            </div>
            <p>Welcome to the official high-performance API cluster backend created by <span class="creator">Mr Hashuu Bot</span>. The core routing services are up and running perfectly.</p>
            
            <div class="endpoint-list">
                <h3>Available Premium Endpoints:</h3>
                <div class="endpoint-item"><span class="endpoint-name">/webdl</span><span class="endpoint-desc">Website Source Cloner</span></div>
                <div class="endpoint-item"><span class="endpoint-name">/song</span><span class="endpoint-desc">YouTube MP3 Play & Downloader</span></div>
                <div class="endpoint-item"><span class="endpoint-name">/tiktok</span><span class="endpoint-desc">TikTok No-Watermark Downloader</span></div>
                <div class="endpoint-item"><span class="endpoint-name">/pinterest</span><span class="endpoint-desc">Pinterest Image Engine</span></div>
                <div class="endpoint-item"><span class="endpoint-name">/apk</span><span class="endpoint-desc">Android APK Downloader</span></div>
                <div class="endpoint-item"><span class="endpoint-name">/facebook</span><span class="endpoint-desc">Facebook Video Fetcher</span></div>
                <div class="endpoint-item"><span class="endpoint-name">/obfuscate</span><span class="endpoint-desc">JS Code Encryption Engine</span></div>
                <div class="endpoint-item"><span class="endpoint-name">/imgbb</span><span class="endpoint-desc">Cloud Image Media Uploader</span></div>
            </div>
            
            <footer>&copy; 2026 Mr Hashuu Bot. All Rights Reserved.</footer>
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
        } else {
            res.json({ success: false, message: "Failed to fetch song from server." });
        }
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
                result: {
                    downloadUrl: data.response.downloadUrl,
                    isFinished: data.response.isFinished
                }
            });
        } else {
            res.json({ success: false, message: "Failed to clone the website. Ensure the target URL is active." });
        }
    } catch (e) { res.json({ success: false, message: e.message }); }
});

// ─────────────────────────────────────────────────────────
// PORT LISTENER
// ─────────────────────────────────────────────────────────
if (require.main === module) {
    app.listen(3000, () => console.log("HASHU-API Master Engine Running on port 3000"));
}

module.exports = app;
