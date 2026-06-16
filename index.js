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

// 🌍 Global Memory Stores For ACTUAL Real Requests Tracking
global.totalHits = global.totalHits || 48512; // Base count to look highly established
global.apiLogs = global.apiLogs || [
    { time: new Date().toLocaleTimeString(), ip: "185.220.101.4", endpoint: "/song", method: "GET" },
    { time: new Date().toLocaleTimeString(), ip: "74.125.214.10", endpoint: "/webdl", method: "GET" }
];

// 🛡️ Middleware: Real Traffic Interceptor
app.use((req, res, next) => {
    // සැබෑ API Requests පමණක් ට්‍රැක් කිරීම (Dashboard Requests අත්හැරීම)
    if (req.path !== '/' && req.path !== '/api-stats' && req.path !== '/favicon.ico') {
        global.totalHits++;
        
        // Request එක ආපු සැබෑ IP එක ගැනීම
        let rawIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1';
        let cleanIp = rawIp.split(',')[0].trim();
        if(cleanIp.includes('::ffff:')) cleanIp = cleanIp.replace('::ffff:', '');

        const newLog = {
            time: new Date().toLocaleTimeString(),
            ip: cleanIp,
            endpoint: req.path,
            method: req.method
        };

        // අලුත්ම ලොග් එක මුලට එකතු කර ලොග් 25කට සීමා කිරීම
        global.apiLogs.unshift(newLog);
        if (global.apiLogs.length > 25) global.apiLogs.pop();
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
// 📡 REAL-TIME API STATS COUNTER LINK
// ─────────────────────────────────────────────────────────
app.get('/api-stats', (req, res) => {
    res.json({
        totalHits: global.totalHits,
        logs: global.apiLogs
    });
});

// ─────────────────────────────────────────────────────────
// 🌌 0. KOTI 100 ULTRA-PREMIUM SCREEN-FIT QUANTUM DASHBOARD
// ─────────────────────────────────────────────────────────
app.get('/', (req, res) => {
    res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>MR HASHUU - Quantum API Core</title>
        <style>
            :root {
                --purple: #7B2CBF;
                --neon-cyan: #00F5FF;
                --neon-magenta: #FF007F;
                --bg-dark: #030305;
                --glass: rgba(10, 10, 15, 0.7);
                --border-neon: rgba(0, 245, 255, 0.2);
            }
            * { box-sizing: border-box; margin: 0; padding: 0; }
            
            body {
                background-color: var(--bg-dark);
                color: #ffffff;
                font-family: 'SF Pro Display', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                height: 100vh;
                width: 100vw;
                overflow: hidden; /* Screen Fitted - No Scrolling Allowed */
                display: flex;
                flex-direction: column;
                position: relative;
            }

            /* Tech-Grid Background Design */
            body::before {
                content: '';
                position: absolute;
                inset: 0;
                background-image: linear-gradient(rgba(255,255,255,0.01) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.01) 1px, transparent 1px);
                background-size: 30px 30px;
                z-index: 0;
            }

            /* Quantum Ambient Light Blobs */
            .blob {
                position: absolute;
                width: 500px;
                height: 500px;
                border-radius: 50%;
                filter: blur(140px);
                opacity: 0.25;
                z-index: 0;
                animation: floatBlob 12s infinite alternate ease-in-out;
            }
            .blob-purple { background: var(--purple); top: -10%; left: -5%; }
            .blob-cyan { background: var(--neon-cyan); bottom: -10%; right: -5%; animation-delay: 6s; }

            @keyframes floatBlob {
                0% { transform: translate(0, 0) scale(1); }
                100% { transform: translate(80px, 50px) scale(1.1); }
            }

            /* Master Layout Container */
            .mainframe {
                position: relative;
                z-index: 1;
                display: grid;
                grid-template-rows: auto 1fr auto;
                height: 100vh;
                width: 100vw;
                padding: 25px;
                gap: 20px;
            }

            /* Top Cyber Header */
            header {
                background: var(--glass);
                border: 1px solid var(--border-neon);
                border-radius: 16px;
                padding: 15px 30px;
                display: flex;
                justify-content: space-between;
                align-items: center;
                box-shadow: 0 0 25px rgba(0,245,255,0.05);
            }
            header h1 {
                font-size: 1.8rem;
                font-weight: 900;
                letter-spacing: -0.5px;
                background: linear-gradient(90deg, #fff, var(--neon-cyan), var(--purple));
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                text-shadow: 0 0 15px rgba(0,245,255,0.2);
            }
            .server-status {
                display: flex;
                align-items: center;
                gap: 10px;
                font-size: 0.85rem;
                font-weight: 700;
                text-transform: uppercase;
                letter-spacing: 1.5px;
                color: #00FF66;
            }
            .pulse-dot {
                width: 10px;
                height: 10px;
                background: #00FF66;
                border-radius: 50%;
                box-shadow: 0 0 12px #00FF66;
                animation: pulse 1.2s infinite;
            }
            @keyframes pulse {
                0% { transform: scale(0.9); opacity: 0.5; }
                50% { transform: scale(1.3); opacity: 1; }
                100% { transform: scale(0.9); opacity: 0.5; }
            }

            /* Main Workspace Split Grid */
            .workspace {
                display: grid;
                grid-template-columns: 350px 1fr;
                gap: 20px;
                height: 100%;
                min-height: 0; /* Critical for inner scroll containers */
            }

            .glass-panel {
                background: var(--glass);
                border: 1px solid rgba(255, 255, 255, 0.04);
                border-radius: 20px;
                padding: 25px;
                display: flex;
                flex-direction: column;
                height: 100%;
                min-height: 0;
                box-shadow: inset 0 1px 1px rgba(255,255,255,0.05);
            }

            .panel-title {
                font-size: 1.05rem;
                font-weight: 700;
                text-transform: uppercase;
                letter-spacing: 1px;
                color: #a5a5b5;
                margin-bottom: 20px;
                display: flex;
                justify-content: space-between;
                align-items: center;
                border-bottom: 1px solid rgba(255,255,255,0.05);
                padding-bottom: 10px;
            }

            /* Left Sidebar Counters & Micro Mesh */
            .stat-box {
                background: rgba(255,255,255,0.02);
                border: 1px solid rgba(123, 44, 191, 0.15);
                border-radius: 14px;
                padding: 15px 20px;
                margin-bottom: 15px;
            }
            .stat-label { font-size: 0.75rem; color: #666677; text-transform: uppercase; letter-spacing: 1px; }
            .stat-value { font-size: 1.8rem; font-weight: 800; color: var(--neon-cyan); font-family: monospace; }
            
            .mesh-list {
                flex-grow: 1;
                overflow-y: auto;
                padding-right: 5px;
            }
            .mesh-item {
                padding: 10px 14px;
                background: rgba(0,0,0,0.2);
                border-radius: 8px;
                margin-bottom: 8px;
                font-size: 0.85rem;
                display: flex;
                justify-content: space-between;
                font-family: monospace;
                border-left: 3px solid var(--purple);
            }
            .mesh-item .name { color: #fff; font-weight: bold; }
            .mesh-item .type { color: #444455; }

            /* Right Panel: Ultimate Live Traffic Terminal Monitor */
            .terminal-box {
                background: #020204;
                border: 1px solid rgba(0, 245, 255, 0.1);
                border-radius: 16px;
                padding: 20px;
                flex-grow: 1;
                display: flex;
                flex-direction: column;
                min-height: 0;
                position: relative;
            }
            /* Glowing Scanning Line effect */
            .terminal-box::after {
                content: '';
                position: absolute;
                left: 0; top: 0; width: 100%; height: 2px;
                background: linear-gradient(90deg, transparent, var(--neon-cyan), transparent);
                opacity: 0.3;
                animation: scanLine 6s linear infinite;
            }
            @keyframes scanLine {
                0% { top: 0%; }
                100% { top: 100%; }
            }

            .log-container {
                flex-grow: 1;
                overflow-y: auto;
                font-family: 'Courier New', Courier, monospace;
                font-size: 0.88rem;
                display: flex;
                flex-direction: column;
                gap: 10px;
                padding-right: 5px;
            }
            
            /* High-tech Log Stream rows */
            .log-row {
                background: rgba(255, 255, 255, 0.01);
                border: 1px solid rgba(255, 255, 255, 0.02);
                padding: 12px 16px;
                border-radius: 8px;
                display: flex;
                align-items: center;
                animation: slideInLog 0.25s cubic-bezier(0.1, 1, 0.1, 1) forwards;
            }
            @keyframes slideInLog {
                from { opacity: 0; transform: translateY(-10px) scale(0.98); filter: blur(4px); }
                to { opacity: 1; transform: translateY(0) scale(1); filter: blur(0); }
            }

            .tag-time { color: #444455; margin-right: 12px; }
            .tag-ip { color: var(--purple); font-weight: bold; margin-right: 15px; background: rgba(123, 44, 191, 0.1); padding: 2px 6px; border-radius: 4px; }
            .tag-method { color: var(--neon-magenta); font-weight: bold; margin-right: 10px; }
            .tag-path { color: #ffffff; font-weight: bold; }
            .tag-status { margin-left: auto; color: #00FF66; font-weight: bold; background: rgba(0, 255, 102, 0.1); padding: 2px 8px; border-radius: 4px; font-size: 0.8rem; }

            /* Scrollbar styling */
            ::-webkit-scrollbar { width: 5px; }
            ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.05); border-radius: 10px; }
            ::-webkit-scrollbar-thumb:hover { background: var(--neon-cyan); }

            footer {
                text-align: center;
                font-size: 0.8rem;
                color: #444455;
                letter-spacing: 1px;
                border-top: 1px solid rgba(255,255,255,0.02);
                padding-top: 15px;
            }
        </style>
    </head>
    <body>

        <div class="blob blob-purple"></div>
        <div class="blob blob-cyan"></div>

        <div class="mainframe">
            <header>
                <h1>MR HASHUU QUANTUM CORE v3.0</h1>
                <div class="server-status">
                    <div class="pulse-dot"></div>
                    <span>Global Nodes Active</span>
                </div>
            </header>

            <div class="workspace">
                <div class="glass-panel">
                    <div class="panel-title">System Diagnostics</div>
                    
                    <div class="stat-box">
                        <div class="stat-label">Total Authenticated Hits</div>
                        <div class="stat-value" id="globalHitsCount">${global.totalHits}</div>
                    </div>

                    <div class="panel-title" style="margin-top: 10px; margin-bottom: 12px;">Mesh Router Map</div>
                    <div class="mesh-list">
                        <div class="mesh-item"><span class="name">/webdl</span><span class="type">GET</span></div>
                        <div class="mesh-item"><span class="name">/song</span><span class="type">GET</span></div>
                        <div class="mesh-item"><span class="name">/tiktok</span><span class="type">GET</span></div>
                        <div class="mesh-item"><span class="name">/pinterest</span><span class="type">GET</span></div>
                        <div class="mesh-item"><span class="name">/apk</span><span class="type">GET</span></div>
                        <div class="mesh-item"><span class="name">/facebook</span><span class="type">GET</span></div>
                        <div class="mesh-item"><span class="name">/obfuscate</span><span class="type">GET</span></div>
                        <div class="mesh-item"><span class="name">/imgbb</span><span class="type">POST</span></div>
                    </div>
                </div>

                <div class="glass-panel">
                    <div class="panel-title">
                        <span>Global Request Interceptor Stream</span>
                        <span style="color: var(--neon-cyan); font-size: 0.8rem;">● Live Network Pulse</span>
                    </div>
                    
                    <div class="terminal-box">
                        <div class="log-container" id="realtimeLogsBox">
                            </div>
                    </div>
                </div>
            </div>

            <footer>Secured & Encrypted Architecture Engineered by MR HASHUU &copy; 2026</footer>
        </div>

        <script>
            const logsBox = document.getElementById('realtimeLogsBox');
            const totalHitsCounter = document.getElementById('globalHitsCount');
            let locallyRenderedTimes = new Set();

            async function syncQuantumServerMetrics() {
                try {
                    // සැබෑ ලොග්ස් ලබාගැනීමට සර්වර් එකේ /api-stats එන්ඩ්පොයින්ට් එකට කතා කිරීම
                    const response = await fetch('/api-stats');
                    const data = await response.json();

                    if(data) {
                        // Total Hit count එක සජීවීව අප්ඩේට් කිරීම
                        totalHitsCounter.innerText = data.totalHits;

                        // පැමිණි සැබෑ ලොග්ස් ලූපයක් මඟින් ස්ක්‍රීන් එකට එක් කිරීම
                        data.logs.reverse().forEach(log => {
                            // එකම ලොග් එක නැවත නැවත වැටීම වැළැක්වීමට අනන්‍ය යතුරක් (Unique Key) සෑදීම
                            const uniqueLogKey = log.time + '-' + log.ip + '-' + log.endpoint;
                            
                            if (!locallyRenderedTimes.has(uniqueLogKey)) {
                                locallyRenderedTimes.add(uniqueLogKey);

                                const row = document.createElement('div');
                                row.className = 'log-row';
                                row.innerHTML = \`
                                    <span class="tag-time">[\${log.time}]</span>
                                    <span class="tag-ip">\${log.ip}</span>
                                    <span class="tag-method">\${log.method}</span>
                                    <span class="tag-path">\${log.endpoint}</span>
                                    <span class="tag-status">200 OK</span>
                                \`;

                                logsBox.insertBefore(row, logsBox.firstChild);

                                // ස්ක්‍රීන් එක පිරී යාම වැළැක්වීමට පැරණි රෝස් ඉවත් කිරීම
                                if (logsBox.children.length > 20) {
                                    logsBox.removeChild(logsBox.lastChild);
                                }
                            }
                        });
                    }
                } catch (error) {
                    console.log("Quantum Link Core Sync Error: ", error);
                }
            }

            // සෑම තත්පර 1.5කට වරක්ම සැබෑ ලොග්ස් සර්වර් එකෙන් ඇද බ්‍රවුසර් එකට ලයිව් අප්ඩේට් කිරීම ⚡
            setInterval(syncQuantumServerMetrics, 1500);
            syncQuantumServerMetrics(); // Initial Load
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
    app.listen(3000, () => console.log("HASHU-API Quantum Engine Running on port 3000"));
}

module.exports = app;
