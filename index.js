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
app.use(express.json());

// ─────────────────────────────────────────────────────────
// 🔑 AUTHORIZED PREMIUM API KEYS DATABASE
// ─────────────────────────────────────────────────────────
const PREMIUM_DATABASE = {
    "HASHUU_PRO_KING_99": { owner: "Kasun", plan: "PREMIUM" },
    "MR_HASHUU_SECRET_123": { owner: "MR HASHUU", plan: "PRO" },
    "VIP_DEV_KEY_777": { owner: "Nimal", plan: "PREMIUM" }
};

const premiumLimiter = rateLimit({
    windowMs: 24 * 60 * 60 * 1000, 
    max: 5000, 
    message: { success: false, message: "Premium daily limit reached! Contact MR HASHUU." }
});

const strictAuthGate = (req, res, next) => {
    const { apikey } = req.query;
    if (!apikey) {
        return res.status(401).json({
            success: false,
            creator: "MR HASHUU",
            message: "Access Denied! API Key is missing. Append '?apikey=YOUR_KEY' to your URL."
        });
    }
    if (!PREMIUM_DATABASE[apikey]) {
        return res.status(403).json({
            success: false,
            creator: "MR HASHUU",
            message: "Access Denied! Invalid API Key. Contact MR HASHUU for a valid key."
        });
    }
    req.planOwner = PREMIUM_DATABASE[apikey].owner;
    req.planType = PREMIUM_DATABASE[apikey].plan;
    return premiumLimiter(req, res, next);
};

// ─────────────────────────────────────────────────────────
// 🌌 Vercel Dark Core - Ultra-Premium Full Screen UI
// ─────────────────────────────────────────────────────────
app.get('/', (req, res) => {
    res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
        <title>MR HASHUU - VERCEL DARK CORE APIS</title>
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Geist+Mono:wght@300;400;700&family=Plus+Jakarta+Sans:wght@400;500;700;800&family=Space+Grotesk:wght@500;700;900&display=swap" rel="stylesheet">
        
        <style>
            :root {
                --vercel-black: #000000;
                --vercel-dark: #0a0a0a;
                --vercel-gray: #111111;
                --vercel-border: #333333;
                --text-pure: #ffffff;
                --text-secondary: #888888;
                --text-muted: #666666;
                --neon-cyan: #00F5FF;
                --neon-purple: #7B2CBF;
                --neon-pink: #ff007f;
                --neon-green: #00FF87;
                --heavy-shadow: 0 30px 60px rgba(0,0,0,0.8);
            }
            
            * { 
                box-sizing: border-box; 
                margin: 0; 
                padding: 0; 
                -webkit-tap-highlight-color: transparent;
            }
            
            body {
                background-color: var(--vercel-black);
                color: var(--text-pure);
                font-family: 'Plus Jakarta Sans', sans-serif;
                min-height: 100vh;
                display: flex;
                flex-direction: column;
                overflow-x: hidden;
                position: relative;
            }

            body::before {
                content: ''; position: fixed; top: 0; left: 0; width: 100%; height: 100%;
                background: radial-gradient(circle at 20% 10%, rgba(0, 245, 255, 0.04) 0%, transparent 45%),
                            radial-gradient(circle at 80% 90%, rgba(123, 44, 191, 0.05) 0%, transparent 50%);
                z-index: -1; pointer-events: none;
            }

            .main-wrapper {
                width: 100%;
                max-width: 1400px;
                margin: 0 auto;
                padding: 40px 24px;
                flex-grow: 1;
                display: flex;
                flex-direction: column;
            }

            .header-container {
                display: flex;
                flex-direction: column;
                align-items: center;
                text-align: center;
                margin-bottom: 45px;
                position: relative;
            }
            .premium-badge {
                font-family: 'Geist Mono', monospace;
                font-size: 0.7rem; font-weight: 700; color: var(--neon-cyan);
                background: rgba(0, 245, 255, 0.03);
                border: 1px solid rgba(0, 245, 255, 0.2);
                padding: 6px 14px; border-radius: 6px;
                letter-spacing: 2px; text-transform: uppercase;
                box-shadow: 0 0 20px rgba(0,245,255,0.05);
                animation: subtleGlow 3s infinite alternate;
            }
            @keyframes subtleGlow {
                0% { border-color: rgba(0, 245, 255, 0.15); box-shadow: 0 0 10px rgba(0,245,255,0.02); }
                100% { border-color: rgba(0, 245, 255, 0.4); box-shadow: 0 0 25px rgba(0,245,255,0.15); }
            }
            
            .main-title {
                font-family: 'Space Grotesk', sans-serif;
                font-size: 3rem; font-weight: 900; letter-spacing: -2px; margin-top: 15px;
                background: linear-gradient(180deg, #ffffff 0%, #a8a8a8 100%);
                -webkit-background-clip: text; -webkit-text-fill-color: transparent;
                text-transform: uppercase;
            }
            .subtitle-tag {
                font-size: 0.95rem; color: var(--text-secondary); margin-top: 6px;
                font-weight: 500; letter-spacing: 0.2px;
            }

            .search-wrapper {
                width: 100%; max-width: 650px; margin: 0 auto 40px auto; position: relative;
            }
            .search-input-core {
                width: 100%; padding: 16px 24px; background: var(--vercel-dark);
                border: 1px solid var(--vercel-border); border-radius: 12px;
                color: #fff; font-family: inherit; font-size: 0.95rem; font-weight: 500;
                transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
                box-shadow: 0 4px 20px rgba(0,0,0,0.4);
            }
            .search-input-core:focus {
                outline: none; border-color: var(--text-pure); background: var(--vercel-black);
                box-shadow: 0 0 0 1px var(--text-pure), 0 10px 30px rgba(255,255,255,0.03);
            }

            .api-matrix-grid {
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
                gap: 20px;
                width: 100%;
            }

            .api-core-card {
                background: var(--vercel-dark);
                border: 1px solid var(--vercel-border);
                border-radius: 14px; padding: 24px;
                display: flex; flex-direction: column; justify-content: space-between;
                gap: 16px; position: relative; overflow: hidden;
                transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
                box-shadow: 0 10px 30px rgba(0,0,0,0.5);
            }
            
            .api-core-card::before {
                content: ''; position: absolute; left: 0; top: 0; width: 3px; height: 100%;
                background: linear-gradient(180deg, var(--neon-purple), var(--neon-cyan));
                opacity: 0.3; transition: opacity 0.3s ease;
            }
            
            .api-core-card:hover {
                transform: translateY(-2px);
                border-color: #555555;
                box-shadow: 0 20px 40px rgba(0,0,0,0.7), 0 0 30px rgba(123,44,191,0.05);
            }
            .api-core-card:hover::before { opacity: 1; }

            .card-header-segment { 
                display: flex; justify-content: space-between; align-items: center; width: 100%; 
            }
            .endpoint-path {
                font-family: 'Geist Mono', monospace; font-size: 1.05rem; color: var(--text-pure);
                font-weight: 700; letter-spacing: -0.5px;
            }
            
            .badge-method {
                font-family: 'Geist Mono', monospace; font-size: 0.65rem; font-weight: 700;
                padding: 4px 8px; border-radius: 5px; background: rgba(255,255,255,0.05);
                color: #fff; border: 1px solid rgba(255,255,255,0.1); letter-spacing: 0.5px;
            }
            .badge-method.post {
                color: var(--neon-pink); border-color: rgba(255, 0, 127, 0.2); background: rgba(255, 0, 127, 0.02);
            }

            .endpoint-summary {
                font-size: 0.85rem; color: var(--text-secondary); line-height: 1.5; font-weight: 400;
            }

            .control-action-row {
                display: grid; grid-template-columns: 1fr 1fr; gap: 10px; width: 100%; margin-top: auto;
            }
            .action-trigger {
                border: none; font-family: 'Plus Jakarta Sans', sans-serif; font-size: 0.78rem; font-weight: 700;
                padding: 12px; border-radius: 8px; cursor: pointer; transition: all 0.2s ease;
                display: flex; justify-content: center; align-items: center; text-transform: uppercase; letter-spacing: 0.3px;
            }
            .trigger-copy {
                background: var(--vercel-gray); color: var(--text-pure); border: 1px solid var(--vercel-border);
            }
            .trigger-copy:hover {
                background: #1c1c1c; border-color: #666;
            }
            .trigger-test {
                background: var(--text-pure); color: var(--vercel-black); font-weight: 800;
            }
            .trigger-test:hover {
                background: #e5e5e5; transform: scale(1.01);
            }

            .post-block-announcement {
                text-align: center; font-size: 0.72rem; color: var(--text-muted); font-weight: 700;
                background: rgba(255,255,255,0.02); padding: 12px; border-radius: 8px;
                border: 1px solid var(--vercel-border); width: 100%;
                font-family: 'Geist Mono', monospace; letter-spacing: 0.5px;
            }

            .modal-console-overlay {
                position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
                background: rgba(0, 0, 0, 0.85); backdrop-filter: blur(15px); -webkit-backdrop-filter: blur(15px);
                z-index: 99999; display: flex; justify-content: center; align-items: center;
                opacity: 0; pointer-events: none; transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
                padding: 20px;
            }
            .modal-console-overlay.active { opacity: 1; pointer-events: auto; }
            
            .console-card-panel {
                width: 100%; max-width: 700px; background: var(--vercel-dark);
                border: 1px solid var(--vercel-border); border-radius: 16px; padding: 28px;
                transform: scale(0.95); transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
                box-shadow: var(--heavy-shadow); display: flex; flex-direction: column; gap: 16px;
            }
            .modal-console-overlay.active .console-card-panel { transform: scale(1); }

            .panel-header { display: flex; justify-content: space-between; align-items: center; }
            .panel-title { font-family: 'Geist Mono', monospace; font-size: 0.85rem; font-weight: 700; color: var(--text-pure); letter-spacing: 1px; }
            
            .btn-close-panel {
                background: var(--vercel-gray); border: 1px solid var(--vercel-border); width: 30px; height: 30px;
                border-radius: 6px; color: #fff; cursor: pointer; display: flex; align-items: center; justify-content: center;
                transition: all 0.2s; font-size: 0.8rem;
            }
            .btn-close-panel:hover { background: #1c1c1c; border-color: #555; }

            .panel-url-box {
                width: 100%; background: var(--vercel-black); padding: 14px 18px; border-radius: 8px;
                font-family: 'Geist Mono', monospace; font-size: 0.78rem; color: var(--neon-cyan);
                overflow-x: auto; border: 1px solid var(--vercel-border);
            }

            .terminal-output-screen {
                width: 100%; background: var(--vercel-black); border: 1px solid var(--vercel-border);
                border-radius: 10px; padding: 20px; font-family: 'Geist Mono', monospace; font-size: 0.8rem;
                white-space: pre-wrap; overflow-x: auto; max-height: 350px; min-height: 150px; line-height: 1.6;
            }

            #toast-system-alert {
                position: fixed; bottom: 35px; left: 50%; transform: translate(-50%, 20px);
                background: var(--text-pure); color: var(--vercel-black); font-size: 0.75rem; font-weight: 800;
                padding: 12px 24px; border-radius: 6px; z-index: 199999; opacity: 0; pointer-events: none;
                transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
                font-family: 'Geist Mono', monospace; letter-spacing: 0.5px;
                box-shadow: 0 20px 40px rgba(0,0,0,0.5);
            }
            #toast-system-alert.show { opacity: 1; transform: translate(-50%, 0); }

            #empty-search-state {
                display: none; text-align: center; color: var(--text-muted);
                font-size: 0.9rem; padding: 60px 20px; font-weight: 500;
                font-family: 'Geist Mono', monospace; width: 100%; grid-column: 1 / -1;
            }
            
            .footer-branding {
                text-align: center; margin-top: 60px; font-size: 0.75rem; color: var(--text-muted);
                font-weight: 700; letter-spacing: 1.5px; font-family: 'Geist Mono', monospace;
                padding-top: 24px; border-top: 1px solid var(--vercel-border);
            }
            .footer-branding span { color: var(--text-pure); font-weight: 900; }

            @media (max-width: 850px) {
                .api-matrix-grid { grid-template-columns: repeat(auto-fill, minmax(1fr, 1fr)); }
                .main-title { font-size: 2.3rem; }
            }
            @media (max-width: 480px) {
                .main-wrapper { padding: 25px 16px; }
                .api-matrix-grid { grid-template-columns: 1fr; }
                .main-title { font-size: 1.9rem; letter-spacing: -1px; }
                .control-action-row { grid-template-columns: 1fr; }
            }
        </style>
    </head>
    <body>

        <div id="toast-system-alert">SUCCESSFULLY EXPORTED TO CLIPBOARD</div>

        <div class="main-wrapper">
            <div class="header-container">
                <div class="premium-badge">Vercel Core Core System Architecture</div>
                <div class="main-title">HASHU ENGINE CORE</div>
                <div class="subtitle-tag">High-End Dynamic Data & Stream Isolation Hub</div>
            </div>

            <div class="search-wrapper">
                <input type="text" id="coreFilterInput" class="search-input-core" placeholder="Search operational matrices, categories or paths..." onkeyup="performRuntimeSearch()">
            </div>

            <div class="api-matrix-grid" id="matrixGridSystem">

                <!-- CARD 1. THENKIRI MOVIE SEARCH -->
                <div class="api-core-card" data-tags="movies search thenkiri catalog live database download">
                    <div class="card-header-segment">
                        <span class="endpoint-path">/api/movies/search</span>
                        <span class="badge-method">GET</span>
                    </div>
                    <div class="endpoint-summary">Thenkiri Media Index Query Hub resolving high-speed direct stream link extractions instantly.</div>
                    <div class="control-action-row">
                        <button class="action-trigger trigger-copy" onclick="processCopyLink('path-movsearch')">Copy URL</button>
                        <button class="action-trigger trigger-test" onclick="fireCoreSimulation('/api/movies/search?q=batman&limit=5&apikey=MR_HASHUU_SECRET_123', 'Thenkiri Search Engine')">Execute</button>
                    </div>
                    <div style="display:none;" id="path-movsearch">/api/movies/search?q=batman&limit=5&apikey=MR_HASHUU_SECRET_123</div>
                </div>

                <!-- CARD 2. THENKIRI LATEST MOVIES -->
                <div class="api-core-card" data-tags="movies latest catalog updates thenkiri streaming feeds">
                    <div class="card-header-segment">
                        <span class="endpoint-path">/api/movies/latest</span>
                        <span class="badge-method">GET</span>
                    </div>
                    <div class="endpoint-summary">Fetches latest uploaded movie directory datasets sorted by tracking categories dynamically.</div>
                    <div class="control-action-row">
                        <button class="action-trigger trigger-copy" onclick="processCopyLink('path-movlatest')">Copy URL</button>
                        <button class="action-trigger trigger-test" onclick="fireCoreSimulation('/api/movies/latest?category=international&page=1&limit=10&apikey=MR_HASHUU_SECRET_123', 'Thenkiri Live Feeds')">Execute</button>
                    </div>
                    <div style="display:none;" id="path-movlatest">/api/movies/latest?category=international&page=1&limit=10&apikey=MR_HASHUU_SECRET_123</div>
                </div>

                <!-- CARD 3. FZMOVIES -->
                <div class="api-core-card" data-tags="movies cinema downloads database movie files direct link">
                    <div class="card-header-segment">
                        <span class="endpoint-path">/api/movies/fzmovies</span>
                        <span class="badge-method">GET</span>
                    </div>
                    <div class="endpoint-summary">Global FzMovies structural catalog scraper resolving clean mp4 down-links across servers.</div>
                    <div class="control-action-row">
                        <button class="action-trigger trigger-copy" onclick="processCopyLink('path-fzmovies')">Copy URL</button>
                        <button class="action-trigger trigger-test" onclick="fireCoreSimulation('/api/movies/fzmovies?q=avengers&limit=5&apikey=MR_HASHUU_SECRET_123', 'FzMovies Resolver')">Execute</button>
                    </div>
                    <div style="display:none;" id="path-fzmovies">/api/movies/fzmovies?q=avengers&limit=5&apikey=MR_HASHUU_SECRET_123</div>
                </div>

                <!-- CARD 4. CINESUBZ -->
                <div class="api-core-card" data-tags="cinesubz subtitle sinhala srilanka sl movie files tracking">
                    <div class="card-header-segment">
                        <span class="endpoint-path">/api/cinesubz</span>
                        <span class="badge-method">GET</span>
                    </div>
                    <div class="endpoint-summary">Sinhala subtitles data mapping network integrated directly via custom Cinesubz scraping protocols.</div>
                    <div class="control-action-row">
                        <button class="action-trigger trigger-copy" onclick="processCopyLink('path-cinesubz')">Copy URL</button>
                        <button class="action-trigger trigger-test" onclick="fireCoreSimulation('/api/cinesubz?q=new&apikey=MR_HASHUU_SECRET_123', 'Cinesubz Sinhala Subtitles')">Execute</button>
                    </div>
                    <div style="display:none;" id="path-cinesubz">/api/cinesubz?q=new&apikey=MR_HASHUU_SECRET_123</div>
                </div>

                <!-- CARD 5. SUBDL -->
                <div class="api-core-card" data-tags="subdl global subtitle english tracks translation multi-language srt">
                    <div class="card-header-segment">
                        <span class="endpoint-path">/api/subdl</span>
                        <span class="badge-method">GET</span>
                    </div>
                    <div class="endpoint-summary">Subdl API integration scraping global subtitle records across diverse files and languages.</div>
                    <div class="control-action-row">
                        <button class="action-trigger trigger-copy" onclick="processCopyLink('path-subdl')">Copy URL</button>
                        <button class="action-trigger trigger-test" onclick="fireCoreSimulation('/api/subdl?q=avatar&apikey=MR_HASHUU_SECRET_123', 'Subdl Engine')">Execute</button>
                    </div>
                    <div style="display:none;" id="path-subdl">/api/subdl?q=avatar&apikey=MR_HASHUU_SECRET_123</div>
                </div>

                <!-- CARD 6. OMDb MOVIE INFO -->
                <div class="api-core-card" data-tags="movie profile omdb imdb plots ratings metrics directors cover art">
                    <div class="card-header-segment">
                        <span class="endpoint-path">/api/movie</span>
                        <span class="badge-method">GET</span>
                    </div>
                    <div class="endpoint-summary">Exposes deep cinematic descriptions, plots, cover graphics and user ratings via OMDb database clusters.</div>
                    <div class="control-action-row">
                        <button class="action-trigger trigger-copy" onclick="processCopyLink('path-omdb')">Copy URL</button>
                        <button class="action-trigger trigger-test" onclick="fireCoreSimulation('/api/movie?text=Guardians of the Galaxy&apikey=MR_HASHUU_SECRET_123', 'OMDb Profile Sync')">Execute</button>
                    </div>
                    <div style="display:none;" id="path-omdb">/api/movie?text=Guardians of the Galaxy&apikey=MR_HASHUU_SECRET_123</div>
                </div>

                <!-- CARD 7. CHATGPT-4o -->
                <div class="api-core-card" data-tags="chatgpt chat ai hashan gpt4 intelligence brain smart automation">
                    <div class="card-header-segment">
                        <span class="endpoint-path">/api/chat</span>
                        <span class="badge-method">GET</span>
                    </div>
                    <div class="endpoint-summary">Customized high-intelligence adaptive ChatGPT-4o engine running personalized routing rules.</div>
                    <div class="control-action-row">
                        <button class="action-trigger trigger-copy" onclick="processCopyLink('path-chatgpt')">Copy URL</button>
                        <button class="action-trigger trigger-test" onclick="fireCoreSimulation('/api/chat?prompt=Hi&apikey=MR_HASHUU_SECRET_123', 'Hashan-md ChatGPT AI')">Execute</button>
                    </div>
                    <div style="display:none;" id="path-chatgpt">/api/chat?prompt=Hi&apikey=MR_HASHUU_SECRET_123</div>
                </div>

                <!-- CARD 8. URL SHORTENER -->
                <div class="api-core-card" data-tags="shortener link cuttly compress minify tracking analytics url">
                    <div class="card-header-segment">
                        <span class="endpoint-path">/api/url_shorten</span>
                        <span class="badge-method">GET</span>
                    </div>
                    <div class="endpoint-summary">Cuttly backend algorithm utility safely converting long URLs into compact metadata links.</div>
                    <div class="control-action-row">
                        <button class="action-trigger trigger-copy" onclick="processCopyLink('path-shorten')">Copy URL</button>
                        <button class="action-trigger trigger-test" onclick="fireCoreSimulation('/api/url_shorten?link=https://apis.davidcyril.name.ng&apikey=MR_HASHUU_SECRET_123', 'Cuttly Link Compression')">Execute</button>
                    </div>
                    <div style="display:none;" id="path-shorten">/api/url_shorten?link=https://apis.davidcyril.name.ng&apikey=MR_HASHUU_SECRET_123</div>
                </div>

                <!-- CARD 9. XVIDEOS -->
                <div class="api-core-card" data-tags="xvideos download downloader adult hot clip resolver cdn stream">
                    <div class="card-header-segment">
                        <span class="endpoint-path">/xvideo</span>
                        <span class="badge-method">GET</span>
                    </div>
                    <div class="endpoint-summary">Advanced XVideos content-delivery network scraper pulling high-speed raw streaming mp4 files.</div>
                    <div class="control-action-row">
                        <button class="action-trigger trigger-copy" onclick="processCopyLink('path-xvideo')">Copy URL</button>
                        <button class="action-trigger trigger-test" onclick="fireCoreSimulation('/xvideo?url=https://www.xvideos.com/video.hppakie6a79/mia_khalifa&apikey=MR_HASHUU_SECRET_123', 'XVideo Media Puller')">Execute</button>
                    </div>
                    <div style="display:none;" id="path-xvideo">/xvideo?url=https://www.xvideos.com/video.hppakie6a79/mia_khalifa&apikey=MR_HASHUU_SECRET_123</div>
                </div>

                <!-- CARD 10. YTMP4 -->
                <div class="api-core-card" data-tags="ytmp4 youtube video download high resolution high quality media audio">
                    <div class="card-header-segment">
                        <span class="endpoint-path">/ytmp4</span>
                        <span class="badge-method">GET</span>
                    </div>
                    <div class="endpoint-summary">YouTube High-Definition mp4 conversion algorithm routing structural binary stream blocks safely.</div>
                    <div class="control-action-row">
                        <button class="action-trigger trigger-copy" onclick="processCopyLink('path-ytmp4')">Copy URL</button>
                        <button class="action-trigger trigger-test" onclick="fireCoreSimulation('/ytmp4?url=https://youtube.com/watch?v=MwpMEbgC7DA&apikey=MR_HASHUU_SECRET_123', 'YouTube HD Stream Exporter')">Execute</button>
                    </div>
                    <div style="display:none;" id="path-ytmp4">/ytmp4?url=https://youtube.com/watch?v=MwpMEbgC7DA&apikey=MR_HASHUU_SECRET_123</div>
                </div>

                <!-- CARD 11. MEDIAFIRE -->
                <div class="api-core-card" data-tags="mediafire storage cloud file downloads raw server bypass links">
                    <div class="card-header-segment">
                        <span class="endpoint-path">/mediafire</span>
                        <span class="badge-method">GET</span>
                    </div>
                    <div class="endpoint-summary">Decrypts native HTML patterns from target Mediafire storage pages to reveal explicit mirrors.</div>
                    <div class="control-action-row">
                        <button class="action-trigger trigger-copy" onclick="processCopyLink('path-mediafire')">Copy URL</button>
                        <button class="action-trigger trigger-test" onclick="fireCoreSimulation('/mediafire?url=https://www.mediafire.com/file/n6tgcrktbnov1oy/Queen_Anita-V4.zip/file&apikey=MR_HASHUU_SECRET_123', 'Mediafire Link Engine')">Execute</button>
                    </div>
                    <div style="display:none;" id="path-mediafire">/mediafire?url=https://www.mediafire.com/file/n6tgcrktbnov1oy/Queen_Anita-V4.zip/file&apikey=MR_HASHUU_SECRET_123</div>
                </div>

                <!-- CARD 12. SPOTIFY -->
                <div class="api-core-card" data-tags="spotify music tracks download song audio mp3 quality high metadata">
                    <div class="card-header-segment">
                        <span class="endpoint-path">/spotify</span>
                        <span class="badge-method">GET</span>
                    </div>
                    <div class="endpoint-summary">Extracts explicit track metadata fields and down-link mappings from the Spotify catalog array.</div>
                    <div class="control-action-row">
                        <button class="action-trigger trigger-copy" onclick="processCopyLink('path-spotify')">Copy URL</button>
                        <button class="action-trigger trigger-test" onclick="fireCoreSimulation('/spotify?url=https://open.spotify.com/track/285pBltuF7vW8TeWk8hdRR&apikey=MR_HASHUU_SECRET_123', 'Spotify Pipeline')">Execute</button>
                    </div>
                    <div style="display:none;" id="path-spotify">/spotify?url=https://open.spotify.com/track/285pBltuF7vW8TeWk8hdRR&apikey=MR_HASHUU_SECRET_123</div>
                </div>

                <!-- CARD 13. ANIMAGINE AI IMAGE GENERATION -->
                <div class="api-core-card" data-tags="ai image animagine anime girl generation prompt graphics photo draw art 4k">
                    <div class="card-header-segment">
                        <span class="endpoint-path">/api/ai/animagine</span>
                        <span class="badge-method">GET</span>
                    </div>
                    <div class="endpoint-summary">High-end anime style engine generating stunning 4K illustrative graphic renders from text prompts.</div>
                    <div class="control-action-row">
                        <button class="action-trigger trigger-copy" onclick="processCopyLink('path-animagine')">Copy URL</button>
                        <button class="action-trigger trigger-test" onclick="fireCoreSimulation('/api/ai/animagine?prompt=beautiful anime girl, cherry blossoms, sunset, detailed, 4k&apikey=MR_HASHUU_SECRET_123', 'Animagine AI Engine')">Execute</button>
                    </div>
                    <div style="display:none;" id="path-animagine">/api/ai/animagine?prompt=beautiful anime girl, cherry blossoms, sunset, detailed, 4k&apikey=MR_HASHUU_SECRET_123</div>
                </div>

                <!-- CARD 14. WRITECREAM AI IMAGE GENERATION -->
                <div class="api-core-card" data-tags="ai image writecream realistic scenic painting oil texture prompt art generation">
                    <div class="card-header-segment">
                        <span class="endpoint-path">/api/ai/writecream</span>
                        <span class="badge-method">GET</span>
                    </div>
                    <div class="endpoint-summary">Writecream AI pipeline turning prompts into high-texture oil paintings and atmospheric scenery graphics.</div>
                    <div class="control-action-row">
                        <button class="action-trigger trigger-copy" onclick="processCopyLink('path-writecream')">Copy URL</button>
                        <button class="action-trigger trigger-test" onclick="fireCoreSimulation('/api/ai/writecream?prompt=A serene mountain lake at sunrise, oil painting&apikey=MR_HASHUU_SECRET_123', 'Writecream AI Engine')">Execute</button>
                    </div>
                    <div style="display:none;" id="path-writecream">/api/ai/writecream?prompt=A serene mountain lake at sunrise, oil painting&apikey=MR_HASHUU_SECRET_123</div>
                </div>

                <!-- CARD 15. OBFUSCATOR -->
                <div class="api-core-card" data-tags="obfuscate javascript protection reverse engineering security hide protect encrypt lock">
                    <div class="card-header-segment">
                        <span class="endpoint-path">/obfuscate</span>
                        <span class="badge-method">GET</span>
                    </div>
                    <div class="endpoint-summary">Performs high-security production compilation of structural JS code arrays to block scraping.</div>
                    <div class="control-action-row">
                        <button class="action-trigger trigger-copy" onclick="processCopyLink('path-obfuscate')">Copy URL</button>
                        <button class="action-trigger trigger-test" onclick="fireCoreSimulation('/obfuscate?code=console.log(\\'hashu\\')&apikey=MR_HASHUU_SECRET_123', 'JS Obfuscation Core')">Execute</button>
                    </div>
                    <div style="display:none;" id="path-obfuscate">/obfuscate?code=console.log('hashu')&apikey=MR_HASHUU_SECRET_123</div>
                </div>

                <!-- CARD 16. IMGBB -->
                <div class="api-core-card" data-tags="imgbb image picture upload hosting graph photo post binary">
                    <div class="card-header-segment">
                        <span class="endpoint-path">/imgbb</span>
                        <span class="badge-method post">POST</span>
                    </div>
                    <div class="endpoint-summary">Accepts explicit multipart form payloads to transmit binary imagery directly onto ImgBB CDNs.</div>
                    <div class="control-action-row" style="grid-template-columns: 1fr;">
                        <div class="post-block-announcement">POST ROUTE - RUN ACTIONS DIRECTLY IN THE APPLICATION CODE LAYER</div>
                    </div>
                </div>

                <div id="empty-search-state">// RUNTIME ERROR: NO PIPELINE STACKS FOUND MATCHING SPECIFIED KEYWORDS //</div>
            </div>
        </div>

        <div class="modal-console-overlay" id="globalConsolePanelOverlay" onclick="dismissConsoleViaBackground(event)">
            <div class="console-card-panel">
                <div class="panel-header">
                    <span class="panel-title" id="panelRuntimeHeader">// DATA PIPELINE SYNC EXECUTION</span>
                    <button class="btn-close-panel" onclick="dismissConsolePanel()">✕</button>
                </div>
                <div class="panel-url-box" id="panelEndpointUrlDisplay">/api/route_target</div>
                <pre class="terminal-output-screen" id="panelTerminalScreen">// COMPILING PACKET INTERPOLATIONS...</pre>
            </div>
        </div>

        <div class="footer-branding">
            SYSTEM FRAMEWORK PROUDLY DESIGNED & MAINTAINED BY <span>MR HASHUU</span>
        </div>

        <script>
            function performRuntimeSearch() {
                const searchString = document.getElementById('coreFilterInput').value.toLowerCase().trim();
                const nodeCards = document.getElementsByClassName('api-core-card');
                const emptyFeedback = document.getElementById('empty-search-state');
                let validMatchOccurred = false;

                for (let k = 0; k < nodeCards.length; k++) {
                    const trackingDataTags = nodeCards[k].getAttribute('data-tags');
                    if (trackingDataTags.includes(searchString)) {
                        nodeCards[k].style.display = 'flex';
                        validMatchOccurred = true;
                    } else {
                        nodeCards[k].style.display = 'none';
                    }
                }
                emptyFeedback.style.display = validMatchOccurred ? 'none' : 'block';
            }

            function processCopyLink(nodeDomId) {
                const embeddedFragment = document.getElementById(nodeDomId).textContent.trim();
                const structuralAbsoluteUri = window.location.origin + embeddedFragment;
                
                if (navigator.clipboard && window.isSecureContext) {
                    navigator.clipboard.writeText(structuralAbsoluteUri).then(() => {
                        displayToastNotification();
                    }).catch(() => fallbackLegacyCopyClipboard(structuralAbsoluteUri));
                } else {
                    fallbackLegacyCopyClipboard(structuralAbsoluteUri);
                }
            }

            function fallbackLegacyCopyClipboard(textValue) {
                const invisibleTextArea = document.createElement("textarea");
                invisibleTextArea.value = textValue;
                invisibleTextArea.style.position = "fixed"; invisibleTextArea.style.opacity = "0";
                document.body.appendChild(invisibleTextArea);
                invisibleTextArea.focus(); invisibleTextArea.select();
                try {
                    document.execCommand('copy');
                    displayToastNotification();
                } catch (exception) {
                    console.error('Bypass Clipboard Routine Aborted:', exception);
                }
                document.body.removeChild(invisibleTextArea);
            }

            function displayToastNotification() {
                const toastNotificationLayer = document.getElementById('toast-system-alert');
                toastNotificationLayer.classList.add('show');
                setTimeout(() => toastNotificationLayer.classList.remove('show'), 2200);
            }

            async function fireCoreSimulation(simulatedPath, visualNodeTitle) {
                const modalOverlay = document.getElementById('globalConsolePanelOverlay');
                const monitoringTerminal = document.getElementById('panelTerminalScreen');
                
                document.getElementById('panelRuntimeHeader').innerText = "// MATRIX RESPONSE LOG: " + visualNodeTitle.toUpperCase();
                document.getElementById('panelEndpointUrlDisplay').innerText = window.location.origin + simulatedPath;
                
                modalOverlay.classList.add('active');
                monitoringTerminal.textContent = "// RECONSTRUCTING LIVE STACKS... BUFFERING STREAM PAYLOAD SYNC PACKETS //";
                monitoringTerminal.style.color = "var(--neon-cyan)";

                try {
                    const structuralNetworkResult = await fetch(window.location.origin + simulatedPath);
                    const structuralJsonPayload = await structuralNetworkResult.json();
                    
                    monitoringTerminal.textContent = JSON.stringify(structuralJsonPayload, null, 2);
                    monitoringTerminal.style.color = "var(--neon-green)"; 
                } catch (runtimeNetworkException) {
                    monitoringTerminal.textContent = JSON.stringify({
                        success: false,
                        error: "Data parsing interrupted during simulated gateway integration test sequence",
                        exception: runtimeNetworkException.message
                    }, null, 2);
                    monitoringTerminal.style.color = "var(--neon-pink)"; 
                }
            }

            function dismissConsolePanel() {
                document.getElementById('globalConsolePanelOverlay').classList.remove('active');
            }

            function dismissConsoleViaBackground(event) {
                if(event.target.id === "globalConsolePanelOverlay") {
                    dismissConsolePanel();
                }
            }
        </script>
    </body>
    </html>
    `);
});

// ─────────────────────────────────────────────────────────
// 🛠️ BACKEND CONTROLLERS LOGIC
// ─────────────────────────────────────────────────────────

// 1. THENKIRI MOVIE SEARCH
app.get('/api/movies/search', strictAuthGate, async (req, res) => {
    try {
        const { q, limit } = req.query;
        if (!q) return res.json({ success: false, message: "Search query (?q=) parameter missing!" });
        const finalLimit = limit || 5;
        const { data } = await axios.get(`https://apis.davidcyriltech.my.id/movies/search?q=${encodeURIComponent(q)}&limit=${finalLimit}`);
        if (data.success) {
            res.json({ creator: "MR HASHUU", status: "Authenticated", success: true, query: data.query, count: data.count, results: data.results });
        } else { res.json({ success: false, message: "No data found on Thenkiri database layer." }); }
    } catch (e) { res.json({ success: false, message: e.message }); }
});

// 2. THENKIRI LATEST MOVIES
app.get('/api/movies/latest', strictAuthGate, async (req, res) => {
    try {
        const { category, page, limit } = req.query;
        const finalCategory = category || "international";
        const finalPage = page || 1;
        const finalLimit = limit || 10;
        const { data } = await axios.get(`https://apis.davidcyriltech.my.id/movies/latest?category=${encodeURIComponent(finalCategory)}&page=${finalPage}&limit=${finalLimit}`);
        if (data.success) {
            res.json({ creator: "MR HASHUU", status: "Authenticated", success: true, category: data.category, page: data.page, count: data.count, results: data.results });
        } else { res.json({ success: false, message: "Failed to fetch latest data feed from Thenkiri stream." }); }
    } catch (e) { res.json({ success: false, message: e.message }); }
});

// 3. FZMOVIES SEARCH
app.get('/api/movies/fzmovies', strictAuthGate, async (req, res) => {
    try {
        const { q, limit } = req.query;
        if (!q) return res.json({ success: false, message: "Search query (?q=) parameter missing!" });
        const finalLimit = limit || 5;
        const { data } = await axios.get(`https://apis.davidcyriltech.my.id/movies/fzmovies/search?q=${encodeURIComponent(q)}&limit=${finalLimit}`);
        if (data.success) {
            res.json({ creator: "MR HASHUU", status: "Authenticated", success: true, query: data.query, count: data.count, results: data.results });
        } else { res.json({ success: false, message: "No results mapping your query on FzMovies architecture." }); }
    } catch (e) { res.json({ success: false, message: e.message }); }
});

// 4. CINESUBZ SEARCH
app.get('/api/cinesubz', strictAuthGate, async (req, res) => {
    try {
        const { q } = req.query;
        if (!q) return res.json({ success: false, message: "Search query (?q=) parameter missing!" });
        const { data } = await axios.get(`https://apis.davidcyriltech.my.id/cinesubz/search?q=${encodeURIComponent(q)}&limit=10`);
        if (data.success) { res.json({ creator: "MR HASHUU", status: "Authenticated", success: true, query: data.query, count: data.count, results: data.results }); }
        else { res.json({ success: false, message: "No data found on Cinesubz architecture." }); }
    } catch (e) { res.json({ success: false, message: e.message }); }
});

// 5. SUBDL SUBTITLE DATABASE
app.get('/api/subdl', strictAuthGate, async (req, res) => {
    try {
        const { q } = req.query;
        if (!q) return res.json({ success: false, message: "Search query (?q=) parameter missing!" });
        const { data } = await axios.get(`https://apis.davidcyriltech.my.id/subdl/search?q=${encodeURIComponent(q)}`);
        if (data.success) { res.json({ creator: "MR HASHUU", status: "Authenticated", success: true, query: data.query, total: data.total, results: data.results }); }
        else { res.json({ success: false, message: "No subtitle results found on Subdl matrix." }); }
    } catch (e) { res.json({ success: false, message: e.message }); }
});

// 6. OMDb MOVIE INFO
app.get('/api/movie', strictAuthGate, async (req, res) => {
    try {
        const { text } = req.query;
        if (!text) return res.json({ success: false, message: "Movie title parameter (?text=) missing!" });
        const { data } = await axios.get(`http://www.omdbapi.com/?t=${encodeURIComponent(text)}&apikey=2634bb02`);
        if (data.Response === "True") { res.json({ creator: "MR HASHUU", status: "Authenticated", success: true, result: data }); }
        else { res.json({ success: false, message: data.Error || "Movie not found!" }); }
    } catch (e) { res.json({ success: false, message: e.message }); }
});

// 7. CHATGPT-4o SMART INTERFACE
app.get('/api/chat', strictAuthGate, async (req, res) => {
    try {
        const { prompt } = req.query;
        if (!prompt) return res.json({ success: false, message: "Prompt parameter missing!" });
        const cleanPrompt = prompt.toLowerCase().trim();
        if (cleanPrompt === 'hi') return res.json({ creator: "MR HASHUU", status: "Authenticated", success: true, result: "Hellow Im Hashuu Ai Service" });
        if (cleanPrompt === 'kawad bn') return res.json({ creator: "MR HASHUU", status: "Authenticated", success: true, result: "huththak kwa" });

        const customSystemPrompt = "You are Hashan-md AI, a brilliant, helpful AI assistant developed and owned by MR HASHUU. Always respond in an intelligent and smart manner.";
        const { data } = await axios.get(`https://apis.davidcyriltech.my.id/ai/chatgpt?prompt=${encodeURIComponent(prompt)}&model=gpt-4o&system=${encodeURIComponent(customSystemPrompt)}`);
        res.json({ creator: "MR HASHUU", status: "Authenticated", success: true, result: data?.data?.choices?.[0]?.message?.content || "AI framework anomaly. Retry." });
    } catch (e) { res.json({ success: false, message: e.message }); }
});

// 8. CUTTLY URL SHORTENER
app.get('/api/url_shorten', strictAuthGate, async (req, res) => {
    try {
        const { link } = req.query;
        if (!link) return res.json({ success: false, message: "Link parameter missing!" });
        const { data } = await axios.get(`https://apis.davidcyriltech.my.id/cuttly?link=${encodeURIComponent(link)}`);
        if (data.success) res.json({ creator: "MR HASHUU", status: "Authenticated", success: true, original_url: data.original_url, shortened_url: data.shortened_url });
        else res.json({ success: false, message: "URL shortening failed." });
    } catch (e) { res.json({ success: false, message: e.message }); }
});

// 9. XVIDEOS DOWNLOADER
app.get('/xvideo', strictAuthGate, async (req, res) => {
    try {
        const { url } = req.query;
        if (!url) return res.json({ success: false, message: "XVideo URL required!" });
        const { data } = await axios.get(`https://apis.davidcyriltech.my.id/xvideo?url=${encodeURIComponent(url)}`);
        if (data.success) res.json({ creator: "MR HASHUU", status: "Authenticated", success: true, title: data.title, thumbnail: data.thumbnail, download_url: data.download_url });
        else res.json({ success: false, message: "Conversion failed." });
    } catch (e) { res.json({ success: false, message: e.message }); }
});

// 10. YOUTUBE MP4 DOWNLOADER
app.get('/ytmp4', strictAuthGate, async (req, res) => {
    try {
        const { url } = req.query;
        if (!url) return res.json({ success: false, message: "YouTube URL required!" });
        const { data } = await axios.get(`https://apis.davidcyriltech.my.id/download/ytmp4?url=${encodeURIComponent(url)}`);
        if (data.success && data.result) res.json({ creator: "MR HASHUU", status: "Authenticated", success: true, result: data.result });
        else res.json({ success: false, message: "Media conversion failed." });
    } catch (e) { res.json({ success: false, message: e.message }); }
});

// 11. MEDIAFIRE PARSER
app.get('/mediafire', strictAuthGate, async (req, res) => {
    try {
        const { url } = req.query;
        if (!url) return res.json({ success: false, message: "Mediafire URL required!" });
        const { data } = await axios.get(`https://apis.davidcyriltech.my.id/mediafire?url=${encodeURIComponent(url)}`);
        res.json({ creator: "MR HASHUU", status: "Authenticated", success: true, result: data });
    } catch (e) { res.json({ success: false, message: e.message }); }
});

// 12. SPOTIFY EXTRACTOR
app.get('/spotify', strictAuthGate, async (req, res) => {
    try {
        const { url } = req.query;
        if (!url) return res.json({ success: false, message: "Spotify URL required!" });
        const { data } = await axios.get(`https://apis.davidcyriltech.my.id/spotifydl?url=${encodeURIComponent(url)}`);
        res.json({ creator: "MR HASHUU", status: "Authenticated", success: true, result: data });
    } catch (e) { res.json({ success: false, message: e.message }); }
});

// 13. ANIMAGINE AI IMAGE GENERATION
app.get('/api/ai/animagine', strictAuthGate, async (req, res) => {
    try {
        const { prompt } = req.query;
        if (!prompt) return res.json({ success: false, message: "Prompt parameter (?prompt=) missing!" });
        const { data } = await axios.get(`https://apis.davidcyriltech.my.id/animagine?prompt=${encodeURIComponent(prompt)}`);
        res.json({ creator: "MR HASHUU", status: "Authenticated", success: true, result: data });
    } catch (e) { res.json({ success: false, message: e.message }); }
});

// 14. WRITECREAM AI IMAGE GENERATION
app.get('/api/ai/writecream', strictAuthGate, async (req, res) => {
    try {
        const { prompt } = req.query;
        if (!prompt) return res.json({ success: false, message: "Prompt parameter (?prompt=) missing!" });
        const { data } = await axios.get(`https://apis.davidcyriltech.my.id/ai/writecream/image?prompt=${encodeURIComponent(prompt)}`);
        res.json({ creator: "MR HASHUU", status: "Authenticated", success: true, result: data });
    } catch (e) { res.json({ success: false, message: e.message }); }
});

// 15. JS ANTI-SCRAPE OBFUSCATOR
app.get('/obfuscate', strictAuthGate, (req, res) => {
    try {
        const { code } = req.query;
        if (!code) return res.json({ success: false, message: "Code parameter missing!" });
        const obfuscatedCode = obfuscator.obfuscate(code, { compact: true, controlFlowFlattening: true, controlFlowFlatteningThreshold: 0.5 }).getObfuscatedCode();
        res.json({ creator: "MR HASHUU", status: "Authenticated", success: true, result: obfuscatedCode });
    } catch (e) { res.json({ success: false, message: e.message }); }
});

// 16. IMGBB IMAGE CLOUD POST
app.post('/imgbb', strictAuthGate, upload.single('file'), async (req, res) => {
    try {
        if (!req.file) return res.json({ success: false, message: "No file uploaded!" });
        const form = new FormData();
        form.append('file', req.file.buffer, { filename: req.file.originalname || 'image.jpg', contentType: req.file.mimetype });
        const { data } = await axios.post('https://apis.davidcyriltech.my.id/uploader/imgbb', form, { headers: { ...form.getHeaders(), 'User-Agent': 'Mozilla/5.0' } });
        if (data.success) res.json({ creator: "MR HASHUU", status: "Authenticated", success: true, result: data.data });
        else res.json({ success: false, message: "Upload failed." });
    } catch (e) { res.json({ success: false, message: e.message }); }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Vercel Dark Core HASHU Engine Running on port ${PORT}`));

module.exports = app;
