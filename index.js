const express = require('express');
const axios = require('axios');
const rateLimit = require('express-rate-limit');
const obfuscator = require('javascript-obfuscator');
const cors = require('cors');
const multer = require('multer');
const FormData = require('form-data');

const app = express();
const upload = multer();

// 🌏 CORS Enable කිරීම (Frontend Requests බ්ලොක් වීම වැළැක්වීමට)
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
// 3. YOUTUBE MP3 SONG ROUTE (NEW & SUPER FAST 🎵)
// ─────────────────────────────────────────────────────────
app.get('/song', async (req, res) => {
    try {
        const { text } = req.query;
        if (!text) return res.json({ success: false, message: "Song name or URL required" });

        // 💡 ඩේවිඩ්ගේ අලුත්ම /play endpoint එක කෙලින්ම පාවිච්චි කරලා සිංදුව ගන්නවා මචං
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
            res.json({ success: false, message: "Failed to fetch song from server.", raw: data });
        }
    } catch (e) { 
        res.json({ success: false, message: "Server error: " + e.message }); 
    }
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
