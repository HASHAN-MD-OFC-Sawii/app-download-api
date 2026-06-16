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

// සැබෑ Request ගණන සර්වර් එකේ තාවකාලිකව ට්‍රැක් කිරීමට
let totalRequests = 14205; 

app.use((req, res, next) => {
    if (req.path !== '/') {
        totalRequests++;
    }
    next();
});

// 🛡️ Global Rate Limiter
const apiLimiter = rateLimit({
    windowMs: 24 * 60 * 60 * 1000,
    max: 100,
    skip: (req) => req.query.apikey === MY_SECRET_KEY,
    message: { success: false, message: "Free limit reached. Get Premium!" }
});

app.use(apiLimiter);

// ─────────────────────────────────────────────────────────
// 🔮 0. ULTRA-PREMIUM NEON GLASSMORPHISM ROOT DASHBOARD
// ─────────────────────────────────────────────────────────
app.get('/', (req, res) => {
    res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>MR HASHUU - API Master Engine</title>
        <style>
            :root {
                --purple: #7B2CBF;
                --cyan: #00F5FF;
                --bg: #050508;
                --card-bg: rgba(255, 255, 255, 0.02);
                --border: rgba(123, 44, 191, 0.25);
            }
            * { box-sizing: border-box; margin: 0; padding: 0; }
            body {
                background-color: var(--bg);
                color: #ffffff;
                font-family: '-apple-system', BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
                min-height: 100vh;
                padding: 40px 20px;
                display: flex;
                justify-content: center;
                align-items: center;
                overflow-x: hidden;
                position: relative;
            }
            /* Glowing background ambient blobs */
            body::before, body::after {
                content: '';
                position: absolute;
                width: 300px;
                height: 300px;
                border-radius: 50%;
                filter: blur(130px);
                z-index: 0;
                opacity: 0.4;
                animation: floatBg 8s infinite alternate ease-in-out;
            }
            body::before { background: var(--purple); top: -10%; left: -10%; }
            body::after { background: var(--cyan); bottom: -10%; right: -10%; animation-delay: 4s; }

            @keyframes floatBg {
                0% { transform: translate(0, 0) scale(1); }
                100% { transform: translate(50px, 40px) scale(1.2); }
            }

            .dashboard-card {
                position: relative;
                z-index: 1;
                max-width: 900px;
                width: 100%;
                background: var(--card-bg);
                backdrop-filter: blur(20px);
                -webkit-backdrop-filter: blur(20px);
                border: 1px solid var(--border);
                border-radius: 24px;
                padding: 40px;
                box-shadow: 0 20px 50px rgba(0, 0, 0, 0.7), inset 0 1px 0 rgba(255,255,255,0.1);
                animation: fadeIn 1s ease-out;
            }

            @keyframes fadeIn {
                from { opacity: 0; transform: translateY(20px); }
                to { opacity: 1; transform: translateY(0); }
            }

            h1 {
                font-size: 2.5rem;
                font-weight: 800;
                text-align: center;
                letter-spacing: -1px;
                background: linear-gradient(45deg, #ffffff, #a252ff, var(--cyan));
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                margin-bottom: 5px;
            }
            .sub-tag {
                text-align: center;
                color: #8888a0;
                font-size: 0.95rem;
                text-transform: uppercase;
                letter-spacing: 2px;
                margin-bottom: 25px;
            }
            .status-container {
                display: flex;
                justify-content: center;
                gap: 15px;
                margin-bottom: 35px;
                flex-wrap: wrap;
            }
            .badge {
                background: rgba(255, 255, 255, 0.04);
                border: 1px solid rgba(255,255,255,0.08);
                padding: 8px 16px;
                border-radius: 30px;
                font-size: 0.85rem;
                font-weight: 600;
                display: flex;
                align-items: center;
                gap: 8px;
            }
            .badge-pulse {
                width: 8px;
                height: 8px;
                background: #00FF66;
                border-radius: 50%;
                box-shadow: 0 0 10px #00FF66;
                animation: pulse 1.5s infinite;
            }
            @keyframes pulse {
                0% { transform: scale(0.9); opacity: 0.6; }
                50% { transform: scale(1.2); opacity: 1; box-shadow: 0 0 15px #00FF66; }
                100% { transform: scale(0.9); opacity: 0.6; }
            }
            .badge .count { color: var(--cyan); text-shadow: 0 0 8px rgba(0,245,255,0.3); }

            /* Grid Layout for content */
            .main-grid {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 30px;
            }
            @media (max-width: 768px) { .main-grid { grid-template-columns: 1fr; } }

            h3 {
                color: #fff;
                font-size: 1.2rem;
                margin-bottom: 15px;
                display: flex;
                align-items: center;
                gap: 10px;
            }
            /* Endpoints Styling */
            .endpoint-wrapper {
                max-height: 380px;
                overflow-y: auto;
                padding-right: 5px;
            }
            .endpoint-item {
                background: rgba(0, 0, 0, 0.3);
                border: 1px solid rgba(255,255,255,0.03);
                padding: 14px 18px;
                border-radius: 14px;
                margin-bottom: 12px;
                display: flex;
                justify-content: space-between;
                align-items: center;
                transition: 0.3s ease;
            }
            .endpoint-item:hover {
                border-color: var(--purple);
                transform: translateX(5px);
                background: rgba(123, 44, 191, 0.05);
            }
            .ep-name {
                font-family: 'Courier New', Courier, monospace;
                color: var(--cyan);
                font-weight: 700;
            }
            .ep-desc { color: #8a8a9e; font-size: 0.88rem; }

            /* Real-Time Logs Console Styling */
            .console-box {
                background: #020204;
                border: 1px solid rgba(0, 245, 255, 0.15);
                border-radius: 16px;
                padding: 20px;
                display: flex;
                flex-direction: column;
                height: 380px;
                box-shadow: inset 0 0 20px rgba(0,0,0,0.8);
            }
            .console-header {
                display: flex;
                justify-content: space-between;
                font-size: 0.75rem;
                color: #555566;
                text-transform: uppercase;
                letter-spacing: 1px;
                margin-bottom: 15px;
                border-bottom: 1px solid #111118;
                padding-bottom: 8px;
            }
            .console-logs {
                flex-grow: 1;
                overflow-y: hidden;
                font-family: 'Courier New', Courier, monospace;
                font-size: 0.82rem;
                display: flex;
                flex-direction: column;
                gap: 8px;
            }
            .log-row {
                animation: slideLog 0.3s ease-out forwards;
                line-height: 1.4;
                white-space: nowrap;
            }
            @keyframes slideLog {
                from { opacity: 0; transform: translateY(-10px); }
                to { opacity: 1; transform: translateY(0); }
            }
            .log-time { color: #444455; margin-right: 8px; }
            .log-ip { color: #7B2CBF; margin-right: 8px; }
            .log-ep { color: #fff; font-weight: bold; }
            .log-status { color: #00FF66; margin-left: auto; font-weight: bold; }

            ::-webkit-scrollbar { width: 6px; }
            ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }
            ::-webkit-scrollbar-thumb:hover { background: var(--purple); }

            footer {
                margin-top: 35px;
                text-align: center;
                font-size: 0.82rem;
                color: #555566;
                border-top: 1px solid rgba(255,255,255,0.04);
                padding-top: 20px;
            }
            footer span { color: #ff5555; }
        </style>
    </head>
    <body>

        <div class="dashboard-card">
            <h1>HASHU-API MASTER ENGINE</h1>
            <div class="sub-tag">Cluster Management Console v2.5</div>

            <div class="status-container">
                <div class="badge"><div class="badge-pulse"></div> SERVER STATUS: ONLINE</div>
                <div class="badge">OWNER: <span style="color:var(--purple); font-weight:bold; margin-left:3px;">MR HASHUU</span></div>
                <div class="badge">TOTAL HITSTREAK: <span class="count" id="hitsCount">${totalRequests}</span></div>
            </div>

            <div class="main-grid">
                <!-- Left: Beautiful Endpoints List -->
                <div>
                    <h3>🔮 Core Routing Mesh</h3>
                    <div class="endpoint-wrapper">
                        <div class="endpoint-item"><span class="ep-name">/webdl</span><span class="ep-desc">Website Source Cloner</span></div>
                        <div class="endpoint-item"><span class="ep-name">/song</span><span class="ep-desc">YouTube MP3 Play Engine</span></div>
                        <div class="endpoint-item"><span class="ep-name">/tiktok</span><span class="ep-desc">TikTok No-WM Engine</span></div>
                        <div class="endpoint-item"><span class="ep-name">/pinterest</span><span class="ep-desc">Pinterest Media Search</span></div>
                        <div class="endpoint-item"><span class="ep-name">/apk</span><span class="ep-desc">Android Application Downloader</span></div>
                        <div class="endpoint-item"><span class="ep-name">/facebook</span><span class="ep-desc">Facebook Video Fetcher</span></div>
                        <div class="endpoint-item"><span class="ep-name">/obfuscate</span><span class="ep-desc">JS Protection Layer</span></div>
                        <div class="endpoint-item"><span class="ep-name">/imgbb</span><span class="ep-desc">Cloud Storage Uploader</span></div>
                    </div>
                </div>

                <!-- Right: Cyber Live Request Terminal Stream -->
                <div>
                    <h3>⚡ Live Traffic Microservices</h3>
                    <div class="console-box">
                        <div class="console-header">
                            <span>Request Activity Stream</span>
                            <span style="color: var(--cyan)">● Streaming Live</span>
                        </div>
                        <div class="console-logs" id="consoleLogs">
                            <!-- JS will inject real-time looking simulated logs here dynamically -->
                        </div>
                    </div>
                </div>
            </div>

            <footer>Maintained and secured by <span class="creator">MR HASHUU</span> &copy; 2026</footer>
        </div>

        <script>
            // Live Data Stream Simulator to make it look highly futuristic and hyper-active
            const endpoints = ['/webdl', '/song', '/tiktok', '/pinterest', '/apk', '/facebook', '/obfuscate', '/imgbb'];
            const locations = ['124.43', '45.241', '192.168', '203.94', '103.22', '74.125', '185.23', '49.205'];
            const consoleLogs = document.getElementById('consoleLogs');
            const hitsCount = document.getElementById('hitsCount');

            let count = parseInt(hitsCount.innerText);

            function generateLog() {
                const time = new Date().toLocaleTimeString();
                const randomIP = locations[Math.floor(Math.random() * locations.length)] + '.' + Math.floor(Math.random()*254) + '.' + Math.floor(Math.random()*254);
                const randomEP = endpoints[Math.floor(Math.random() * endpoints.length)];
                
                const logRow = document.createElement('div');
                logRow.className = 'log-row';
                logRow.innerHTML = \`<span class="log-time">[\${time}]</span><span class="log-ip">\${randomIP}</span> -> <span class="log-ep">GET \${randomEP}</span> <span class="log-status">200 OK</span>\`;
                
                consoleLogs.insertBefore(logRow, consoleLogs.firstChild);
                
                // Limit logs inside container to prevent layout spill
                if (consoleLogs.children.length > 13) {
                    consoleLogs.removeChild(consoleLogs.lastChild);
                }

                // Increment total hit counter dynamically to mimic active cloud database sync
                count += Math.floor(Math.random() * 2) + 1;
                hitsCount.innerText = count;
            }

            // Trigger rows infinitely at highly hyper-active random micro intervals
            setInterval(generateLog, 1800);
            generateLog(); generateLog(); generateLog(); // Initial batch load
        </script>
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
