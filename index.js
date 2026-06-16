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
// උඹ සල්ලි දීපු අයට දෙන හෝ උඹ පාවිච්චි කරන Keys ටික විතරක් මෙතන ඇඩ් කරපන්
const PREMIUM_DATABASE = {
    "HASHUU_PRO_KING_99": { owner: "Kasun", plan: "PREMIUM" },
    "MR_HASHUU_SECRET_123": { owner: "Admin/Owner", plan: "PRO" },
    "VIP_DEV_KEY_777": { owner: "Nimal", plan: "PREMIUM" }
};

// 🛡️ Premium Security Rate Limiter (Authorized අයට විතරයි)
const premiumLimiter = rateLimit({
    windowMs: 24 * 60 * 60 * 1000, // පැය 24ක්
    max: 5000, // දවසකට උපරිම රික්වෙස්ට් 5000ක්
    message: { success: false, message: "Premium daily limit reached! Contact MR HASHUU." }
});

// 🔒 Strict Gatekeeper Middleware (API Key එක හරියටම චෙක් කරන මොළය)
const strictAuthGate = (req, res, next) => {
    const { apikey } = req.query;

    // 1. API Key එකක් ඇත්තේම නැත්නම්
    if (!apikey) {
        return res.status(401).json({
            success: false,
            creator: "Mr Hashuu Bot",
            message: "Access Denied! API Key is missing. Please append '?apikey=YOUR_KEY' to your URL."
        });
    }

    // 2. API Key එකක් තිබ්බත් ඒක උඩ තියෙන Database එකේ නැත්නම් (වැරදි කී එකක් නම්)
    if (!PREMIUM_DATABASE[apikey]) {
        return res.status(403).json({
            success: false,
            creator: "Mr Hashuu Bot",
            message: "Access Denied! Invalid API Key. Contact MR HASHUU to purchase a valid key."
        });
    }

    // 3. API Key එක හරියටම මැච් වුණොත් විතරක් ඇතුලට යවනවා
    req.planOwner = PREMIUM_DATABASE[apikey].owner;
    req.planType = PREMIUM_DATABASE[apikey].plan;
    return premiumLimiter(req, res, next);
};

// ─────────────────────────────────────────────────────────
// 🌌 0. VERCEL PORTAL UI (STRICT MODE DESIGN)
// ─────────────────────────────────────────────────────────
app.get('/', (req, res) => {
    res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
        <title>MR HASHUU - Secure Core Gate</title>
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
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                height: 100vh;
                width: 100vw;
                display: flex;
                justify-content: center;
                align-items: center;
                overflow: hidden;
                position: relative;
            }

            .ambient-glow {
                position: absolute;
                width: 500px;
                height: 500px;
                border-radius: 50%;
                filter: blur(140px);
                opacity: 0.12;
                z-index: 0;
                pointer-events: none;
            }
            .glow-1 { background: var(--premium-purple); top: -10%; left: -10%; }
            .glow-2 { background: var(--premium-cyan); bottom: -10%; right: -10%; }

            .vercel-box {
                width: 92%;
                max-width: 450px;
                height: 90vh;
                background: var(--vercel-gray-dark);
                border: 1px solid var(--vercel-border);
                border-radius: 16px;
                padding: 20px;
                z-index: 2;
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                box-shadow: 0 30px 100px rgba(0,0,0,0.9);
            }

            header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                border-bottom: 1px solid var(--vercel-border);
                padding-bottom: 12px;
            }

            header h1 { font-size: 1.2rem; font-weight: 700; letter-spacing: -0.5px; }

            .plan-banner {
                background: rgba(255, 59, 48, 0.05);
                border: 1px solid rgba(255, 59, 48, 0.2);
                padding: 10px;
                border-radius: 8px;
                margin-top: 12px;
                font-size: 0.75rem;
                text-align: center;
                color: #FF3B30;
                font-weight: 600;
                letter-spacing: 0.3px;
            }

            .endpoint-list {
                flex-grow: 1;
                margin: 12px 0;
                overflow-y: auto;
                display: flex;
                flex-direction: column;
                gap: 8px;
            }

            .api-row {
                background: var(--vercel-gray-light);
                border: 1px solid var(--vercel-border);
                border-radius: 10px;
                padding: 12px 14px;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }

            .meta-details { display: flex; flex-direction: column; max-width: 70%; }
            .endpoint-slug { font-family: monospace; font-size: 0.95rem; font-weight: 600; }
            .endpoint-info { font-size: 0.75rem; color: var(--vercel-text-muted); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

            .btn-launch {
                background: transparent;
                color: var(--premium-cyan);
                border: 1px solid rgba(0, 245, 255, 0.2);
                font-size: 0.68rem;
                font-weight: 600;
                padding: 6px 12px;
                border-radius: 6px;
                text-decoration: none;
            }
            .btn-launch:hover { background: var(--premium-cyan); color: #000000; border-color: var(--premium-cyan); }

            ::-webkit-scrollbar { width: 3px; }
            ::-webkit-scrollbar-thumb { background: #222222; border-radius: 10px; }

            footer {
                display: flex;
                justify-content: space-between;
                align-items: center;
                font-size: 0.7rem;
                color: var(--vercel-text-muted);
                border-top: 1px solid var(--vercel-border);
                padding-top: 12px;
            }
            .buy-btn { color: #00FF66; text-decoration: none; font-weight: bold; }
        </style>
    </head>
    <body>

        <div class="ambient-glow glow-1"></div>
        <div class="ambient-glow glow-2"></div>

        <div class="vercel-box">
            <header>
                <h1>mr-hashuu-v7</h1>
                <div style="font-size:0.7rem; color:#FF3B30; background:rgba(255,59,48,0.05); padding:4px 8px; border-radius:5px; border:1px solid rgba(255,59,48,0.15)">
                    🔒 Strict Auth
                </div>
            </header>

            <!-- Warning Banner -->
            <div class="plan-banner">
                STRICT MODE: VALID API KEY REQUIRED TO ACCESS ALL ENDPOINTS
            </div>

            <div class="endpoint-list">
                <!-- Mediafire -->
                <div class="api-row">
                    <div class="meta-details">
                        <span class="endpoint-slug">/mediafire</span>
                        <span class="endpoint-info">Mediafire Direct File Downloader</span>
                    </div>
                    <a href="/mediafire?url=https://www.mediafire.com/file/n6tgcrktbnov1oy/Queen_Anita-V4.zip/file&apikey=MR_HASHUU_SECRET_123" target="_blank" class="btn-launch">Test Auth</a>
                </div>

                <!-- Spotify -->
                <div class="api-row">
                    <div class="meta-details">
                        <span class="endpoint-slug">/spotify</span>
                        <span class="endpoint-info">Spotify High-Quality Music Fetcher</span>
                    </div>
                    <a href="/spotify?url=https://open.spotify.com/track/285pBltuF7vW8TeWk8hdRR?si=HWuMcdM3RJ6Yy0b7Uc7uGQ&apikey=MR_HASHUU_SECRET_123" target="_blank" class="btn-launch">Test Auth</a>
                </div>

                <!-- Twitter -->
                <div class="api-row">
                    <div class="meta-details">
                        <span class="endpoint-slug">/twitter</span>
                        <span class="endpoint-info">Twitter / X Stream HD Extractor</span>
                    </div>
                    <a href="/twitter?url=https://x.com/elonmusk/status/1870901510319833540&apikey=MR_HASHUU_SECRET_123" target="_blank" class="btn-launch">Test Auth</a>
                </div>

                <!-- Song -->
                <div class="api-row">
                    <div class="meta-details">
                        <span class="endpoint-slug">/song</span>
                        <span class="endpoint-info">YouTube MP3 Audio Engine</span>
                    </div>
                    <a href="/song?text=faded&apikey=MR_HASHUU_SECRET_123" target="_blank" class="btn-launch">Test Auth</a>
                </div>
                
                <!-- JS Obfuscator -->
                <div class="api-row">
                    <div class="meta-details">
                        <span class="endpoint-slug">/obfuscate</span>
                        <span class="endpoint-info">Anti-Theft Code Obfuscator</span>
                    </div>
                    <a href="/obfuscate?code=console.log('hashu')&apikey=MR_HASHUU_SECRET_123" target="_blank" class="btn-launch">Test Auth</a>
                </div>
            </div>

            <footer>
                <span>Need Premium Access?</span>
                <a href="https://wa.me/your-number-here" target="_blank" class="buy-btn">Get API Key</a>
            </footer>
        </div>

    </body>
    </html>
    `);
});

// ─────────────────────────────────────────────────────────
// 🛠️ PROTECTED API ROUTES (ALL SECURED WITH strictAuthGate)
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
        if (!text) return res.json({ success: false, message: "Song name required" });
        const { data } = await axios.get(`https://apis.davidcyriltech.my.id/play?query=${encodeURIComponent(text)}`);
        res.json({ creator: "Mr Hashuu Bot", status: "Authenticated", user: req.planOwner, success: true, result: data.result });
    } catch (e) { res.json({ success: false, message: e.message }); }
});

app.get('/obfuscate', strictAuthGate, (req, res) => {
    try {
        const { code, level } = req.query;
        if (!code) return res.json({ success: false, message: "Code parameter missing!" });
        const intensity = level === 'high' ? 0.75 : 0.4;
        const obfuscatedCode = obfuscator.obfuscate(code, { compact: true, controlFlowFlattening: true, controlFlowFlatteningThreshold: intensity }).getObfuscatedCode();
        res.json({ creator: "Mr Hashuu Bot", status: "Authenticated", user: req.planOwner, success: true, result: obfuscatedCode });
    } catch (e) { res.json({ success: false, message: e.message }); }
});

// PORT LISTENER
if (require.main === module) {
    app.listen(3000, () => console.log("Strict HASHU-API Secure Gate Running on port 3000"));
}

module.exports = app;
