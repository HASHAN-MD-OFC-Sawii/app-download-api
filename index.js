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
// 🌌 Heavyweight Ultra-Premium Multi-Platform UI Framework
// ─────────────────────────────────────────────────────────
app.get('/', (req, res) => {
    res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
        <title>MR HASHUU - ULTIMATE SUPREME APIS</title>
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;700;900&family=Plus+Jakarta+Sans:wght@400;600;800&family=JetBrains+Mono:wght@400;700&display=swap" rel="stylesheet">
        
        <style>
            :root {
                --bg-main: #020205;
                --panel-blur: rgba(12, 12, 26, 0.75);
                --neon-cyan: #00F5FF;
                --neon-purple: #7B2CBF;
                --neon-pink: #ff007f;
                --text-main: #ffffff;
                --text-muted: #8585a3;
                --border-neon: rgba(0, 245, 255, 0.15);
                --heavy-shadow: 0 20px 50px rgba(0, 0, 0, 0.8);
            }
            
            * { 
                box-sizing: border-box; 
                margin: 0; 
                padding: 0; 
                -webkit-tap-highlight-color: transparent;
                scrollbar-width: none;
            }
            *::-webkit-scrollbar { display: none; }
            
            body {
                background-color: var(--bg-main);
                color: var(--text-main);
                font-family: 'Plus Jakarta Sans', sans-serif;
                min-height: 100vh;
                padding: 25px 15px 80px 15px;
                overflow-x: hidden;
                position: relative;
            }

            /* Ultimate Cyber Ambient Light Fields */
            body::before {
                content: ''; position: fixed; top: -10%; left: -10%; width: 120vw; height: 120vh;
                background: radial-gradient(circle at 10% 20%, rgba(123, 44, 191, 0.25) 0%, transparent 50%),
                            radial-gradient(circle at 90% 80%, rgba(0, 245, 255, 0.2) 0%, transparent 50%),
                            radial-gradient(circle at 50% 50%, rgba(255, 0, 127, 0.05) 0%, transparent 40%);
                z-index: -1; pointer-events: none;
            }

            /* Complex Decorative Scanlines & Grid Effects to increase file size & luxury aesthetics */
            .cyber-grid-overlay {
                position: fixed; top: 0; left: 0; width: 100%; height: 100%;
                background-image: linear-gradient(rgba(255,255,255,0.003) 1px, transparent 1px),
                                  linear-gradient(90deg, rgba(255,255,255,0.003) 1px, transparent 1px);
                background-size: 20px 20px; z-index: -1; pointer-events: none;
            }

            /* Premium Header Block */
            .premium-hero { 
                text-align: center; 
                margin: 30px 0 35px 0; 
                padding: 10px;
                position: relative;
            }
            .hero-badge {
                display: inline-flex; align-items: center; gap: 8px; font-size: 0.7rem; 
                background: linear-gradient(90deg, rgba(123,44,191,0.15), rgba(0,245,255,0.15));
                border: 1px solid rgba(0, 245, 255, 0.3); color: var(--neon-cyan); 
                padding: 6px 16px; border-radius: 50px;
                text-transform: uppercase; letter-spacing: 2px; font-weight: 800;
                font-family: 'Space Grotesk', sans-serif;
                box-shadow: 0 0 15px rgba(0,245,255,0.1);
                animation: pulseGlow 2.5s infinite alternate;
            }
            @keyframes pulseGlow {
                0% { box-shadow: 0 0 10px rgba(0,245,255,0.05); border-color: rgba(0, 245, 255, 0.2); }
                100% { box-shadow: 0 0 25px rgba(0,245,255,0.25); border-color: rgba(0, 245, 255, 0.5); }
            }
            .hero-badge::before { 
                content: ''; width: 6px; height: 6px; background: var(--neon-cyan); 
                border-radius: 50%; box-shadow: 0 0 10px var(--neon-cyan); 
            }
            
            .hero-main-title {
                font-family: 'Space Grotesk', sans-serif;
                font-size: 2.6rem; font-weight: 900; text-transform: uppercase; margin-top: 15px; letter-spacing: -2px;
                background: linear-gradient(135deg, #ffffff 30%, #a2a2d0 60%, var(--neon-cyan)); 
                -webkit-background-clip: text; -webkit-text-fill-color: transparent;
                text-shadow: 0 10px 30px rgba(0,0,0,0.5);
            }
            .hero-subtitle {
                font-size: 0.85rem; color: var(--text-muted); font-weight: 500; margin-top: 5px;
                letter-spacing: 0.5px;
            }

            /* Ultra-Sleek Floating Search Engine Container */
            .search-container { width: 100%; max-width: 580px; margin: 0 auto 30px auto; position: relative; }
            .search-box {
                width: 100%; padding: 18px 25px; background: rgba(10, 10, 22, 0.4);
                border: 1px solid rgba(255,255,255,0.05); border-radius: 18px; color: #fff;
                font-family: inherit; font-weight: 600; font-size: 0.95rem; transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
                backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px);
                box-shadow: inset 0 2px 4px rgba(255,255,255,0.01);
            }
            .search-box:focus {
                outline: none; border-color: var(--neon-cyan); background: rgba(5, 5, 12, 0.8);
                box-shadow: 0 0 30px rgba(0,245,255,0.15), inset 0 1px 2px rgba(0,245,255,0.2);
            }

            /* Responsive Premium Grid Structure */
            .api-grid-system { 
                display: grid; 
                grid-template-columns: 1fr; 
                gap: 16px; 
                max-width: 580px; 
                margin: 0 auto; 
            }

            /* Animated High-End Luxury Node Cards */
            .api-node-card {
                background: var(--panel-blur); backdrop-filter: blur(25px); -webkit-backdrop-filter: blur(25px);
                border: 1px solid rgba(255, 255, 255, 0.04); border-radius: 22px; padding: 22px;
                display: flex; flex-direction: column; gap: 14px; position: relative; transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
                overflow: hidden; box-shadow: var(--heavy-shadow);
            }
            
            /* High Luxury Border Tracing Animation Glow */
            .api-node-card::after {
                content: ''; position: absolute; top: 0; left: -100%; width: 50%; height: 100%;
                background: linear-gradient(90deg, transparent, rgba(0, 245, 255, 0.06), transparent);
                transition: none; pointer-events: none;
            }
            .api-node-card:hover::after {
                left: 200%; transition: all 0.8s ease-in-out;
            }
            .api-node-card:hover {
                transform: translateY(-3px);
                border-color: rgba(0, 245, 255, 0.25);
                box-shadow: 0 15px 35px rgba(0, 245, 255, 0.05), var(--heavy-shadow);
            }

            .card-top-row { display: flex; justify-content: space-between; align-items: center; width: 100%; }
            .route-path-text { 
                font-family: 'JetBrains Mono', monospace; font-size: 1.05rem; color: #ffffff; font-weight: 700; 
                letter-spacing: -0.3px;
            }
            
            .method-pill {
                font-family: 'Space Grotesk', sans-serif;
                font-size: 0.65rem; font-weight: 900; padding: 4px 10px; border-radius: 8px;
                background: rgba(0, 245, 255, 0.06); border: 1px solid var(--border-neon); color: var(--neon-cyan);
                letter-spacing: 1px;
            }
            .method-pill.post { 
                background: rgba(255, 0, 127, 0.06); border-color: rgba(255, 0, 127, 0.2); color: var(--neon-pink); 
            }

            .node-description { 
                font-size: 0.82rem; color: var(--text-muted); font-weight: 500; line-height: 1.5; 
            }

            /* Premium Grid Control System Buttons */
            .action-ribbon { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; width: 100%; margin-top: 4px; }
            .action-btn {
                border: none; font-family: 'Space Grotesk', sans-serif; font-size: 0.75rem; font-weight: 700; padding: 13px;
                border-radius: 12px; cursor: pointer; text-transform: uppercase; transition: all 0.2s ease;
                display: flex; justify-content: center; align-items: center; letter-spacing: 0.5px;
            }
            .btn-copy { 
                background: rgba(255,255,255,0.02); color: #fff; 
                border: 1px solid rgba(255,255,255,0.05); 
            }
            .btn-copy:hover {
                background: rgba(255,255,255,0.06); border-color: rgba(255,255,255,0.15);
            }
            .btn-run { 
                background: linear-gradient(135deg, var(--neon-cyan), #00d2ff); 
                color: #000; font-weight: 800;
                box-shadow: 0 4px 15px rgba(0, 245, 255, 0.2);
            }
            .btn-run:hover {
                transform: scale(1.02);
                box-shadow: 0 6px 20px rgba(0, 245, 255, 0.4);
            }

            /* ImgBB Notice Alert Styling */
            .post-notice-block {
                text-align: center; font-size: 0.72rem; color: var(--neon-pink); font-weight: 700;
                background: rgba(255, 0, 127, 0.04); padding: 12px; border-radius: 12px;
                border: 1px solid rgba(255, 0, 127, 0.15); width: 100%;
                font-family: 'Space Grotesk', sans-serif; letter-spacing: 0.5px;
            }

            /* Immersive Bottom Console Sheet Model */
            .console-overlay {
                position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(1, 1, 3, 0.88);
                backdrop-filter: blur(25px); -webkit-backdrop-filter: blur(25px); z-index: 10000;
                display: flex; justify-content: center; align-items: flex-end; opacity: 0; pointer-events: none;
                transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
            }
            .console-overlay.active { opacity: 1; pointer-events: auto; }
            
            .console-sheet {
                width: 100%; max-width: 580px; background: #07070f; 
                border-top: 2px solid var(--neon-cyan);
                border-radius: 26px 26px 0 0; padding: 25px; transform: translateY(100%);
                transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
                box-shadow: 0 -15px 40px rgba(0,0,0,0.5);
            }
            .console-overlay.active .console-sheet { transform: translateY(0); }

            .sheet-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
            .sheet-title { font-family: 'Space Grotesk', sans-serif; font-size: 0.9rem; font-weight: 800; color: var(--neon-cyan); text-transform: uppercase; letter-spacing: 1px; }
            .close-sheet-btn { 
                background: rgba(255,255,255,0.06); border: none; width: 32px; height: 32px; border-radius: 50%; 
                color: #fff; font-weight: 700; cursor: pointer; display: flex; align-items: center; justify-content: center;
                transition: background 0.2s;
            }
            .close-sheet-btn:hover { background: rgba(255,255,255,0.15); }

            .sheet-endpoint-url {
                width: 100%; background: rgba(0,0,0,0.4); padding: 12px 16px; border-radius: 10px;
                font-family: 'JetBrains Mono', monospace; font-size: 0.75rem; color: #a2a2d0; overflow-x: auto; margin-bottom: 16px;
                border: 1px solid rgba(255,255,255,0.02);
            }

            .terminal-viewport {
                width: 100%; background: #010103; border: 1px solid rgba(255,255,255,0.03);
                border-radius: 12px; padding: 16px; font-family: 'JetBrains Mono', monospace; font-size: 0.78rem;
                white-space: pre-wrap; overflow-x: auto; max-height: 280px; line-height: 1.5;
                box-shadow: inset 0 3px 10px rgba(0,0,0,0.8);
            }

            /* Ultimate Notification Engine Layer */
            #toast-layer {
                position: fixed; bottom: 30px; left: 50%; transform: translate(-50%, 20px);
                background: linear-gradient(135deg, #ffffff, #e0e0ff); color: #000; font-size: 0.75rem; font-weight: 800;
                padding: 12px 28px; border-radius: 50px; z-index: 105000; opacity: 0; pointer-events: none;
                transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                font-family: 'Space Grotesk', sans-serif; letter-spacing: 1px;
                box-shadow: 0 10px 25px rgba(255,255,255,0.1), 0 4px 10px rgba(0,0,0,0.4);
            }
            #toast-layer.show { opacity: 1; transform: translate(-50%, 0); }

            #no-search-results { 
                display: none; text-align: center; color: var(--text-muted); 
                font-size: 0.85rem; padding: 40px; font-weight: 700; 
                font-family: 'Space Grotesk', sans-serif; letter-spacing: 1px;
            }
            
            .brand-anchor { 
                text-align: center; margin-top: 50px; font-size: 0.75rem; color: var(--text-muted); 
                font-weight: 800; letter-spacing: 1px; font-family: 'Space Grotesk', sans-serif;
            }
            .brand-anchor span { 
                color: var(--neon-cyan); text-shadow: 0 0 10px rgba(0,245,255,0.3);
            }

            @media (max-width: 480px) {
                .hero-main-title { font-size: 2.1rem; }
                .route-path-text { font-size: 0.95rem; }
                body { padding-top: 15px; }
            }
        </style>
    </head>
    <body>

        <div class="cyber-grid-overlay"></div>
        <div id="toast-layer">PIPELINE ROUTE SECURED ✔</div>

        <div class="premium-hero">
            <div class="hero-badge">Ultra-Premium Engine Active</div>
            <div class="hero-main-title">HASHU CORE APIS</div>
            <div class="hero-subtitle">High-Fidelity Gateway Node Array</div>
        </div>

        <div class="search-container">
            <input type="text" id="nodeSearch" class="search-box" placeholder="Search and filter runtime endpoints..." onkeyup="filterNodeGrid()">
        </div>

        <div class="api-grid-system" id="gridContainer">

            <!-- NODE 1. THENKIRI MOVIE SEARCH -->
            <div class="api-node-card" data-search="movies search thenkiri database cinema query">
                <div class="card-top-row">
                    <span class="route-path-text">/api/movies/search</span>
                    <span class="method-pill">GET</span>
                </div>
                <div class="node-description">Thenkiri Movie Indexing & High-Speed Direct Stream Link Exporter Hub Layer.</div>
                <div class="action-ribbon">
                    <button class="action-btn btn-copy" onclick="copyNodeUrl('url-movsearch')">Copy URL</button>
                    <button class="action-btn btn-run" onclick="openTerminalSheet('/api/movies/search?q=batman&limit=5&apikey=MR_HASHUU_SECRET_123', 'Thenkiri Movie Search')">Test Node</button>
                </div>
                <div style="display:none;" id="url-movsearch">/api/movies/search?q=batman&limit=5&apikey=MR_HASHUU_SECRET_123</div>
            </div>

            <!-- NODE 2. THENKIRI LATEST MOVIES -->
            <div class="api-node-card" data-search="movies latest feed thenkiri catalog international updates">
                <div class="card-top-row">
                    <span class="route-path-text">/api/movies/latest</span>
                    <span class="method-pill">GET</span>
                </div>
                <div class="node-description">Thenkiri Dynamic Stream Updates sorted by categorical target tags and pages.</div>
                <div class="action-ribbon">
                    <button class="action-btn btn-copy" onclick="copyNodeUrl('url-movlatest')">Copy URL</button>
                    <button class="action-btn btn-run" onclick="openTerminalSheet('/api/movies/latest?category=international&page=1&limit=10&apikey=MR_HASHUU_SECRET_123', 'Thenkiri Latest Catalog')">Test Node</button>
                </div>
                <div style="display:none;" id="url-movlatest">/api/movies/latest?category=international&page=1&limit=10&apikey=MR_HASHUU_SECRET_123</div>
            </div>

            <!-- NODE 3. FZMOVIES -->
            <div class="api-node-card" data-search="fzmovies search global database cinema download resolution">
                <div class="card-top-row">
                    <span class="route-path-text">/api/movies/fzmovies</span>
                    <span class="method-pill">GET</span>
                </div>
                <div class="node-description">Global FzMovies Server Integration mapping core MP4 structural high-res download pipelines.</div>
                <div class="action-ribbon">
                    <button class="action-btn btn-copy" onclick="copyNodeUrl('url-fzsearch')">Copy URL</button>
                    <button class="action-btn btn-run" onclick="openTerminalSheet('/api/movies/fzmovies?q=avengers&limit=5&apikey=MR_HASHUU_SECRET_123', 'FzMovies Database')">Test Node</button>
                </div>
                <div style="display:none;" id="url-fzsearch">/api/movies/fzmovies?q=avengers&limit=5&apikey=MR_HASHUU_SECRET_123</div>
            </div>

            <!-- NODE 4. CINESUBZ -->
            <div class="api-node-card" data-search="cinesubz search sinhala subtitles sl srilanka download">
                <div class="card-top-row">
                    <span class="route-path-text">/api/cinesubz</span>
                    <span class="method-pill">GET</span>
                </div>
                <div class="node-description">Sinhala Subtitle Link Engine parsed directly through active Cinesubz Cloud Layers.</div>
                <div class="action-ribbon">
                    <button class="action-btn btn-copy" onclick="copyNodeUrl('url-cinesubz')">Copy URL</button>
                    <button class="action-btn btn-run" onclick="openTerminalSheet('/api/cinesubz?q=new&apikey=MR_HASHUU_SECRET_123', 'Cinesubz Subtitle Engine')">Test Node</button>
                </div>
                <div style="display:none;" id="url-cinesubz">/api/cinesubz?q=new&apikey=MR_HASHUU_SECRET_123</div>
            </div>

            <!-- NODE 5. SUBDL -->
            <div class="api-node-card" data-search="subdl search global subtitle srt english multi-language">
                <div class="card-top-row">
                    <span class="route-path-text">/api/subdl</span>
                    <span class="method-pill">GET</span>
                </div>
                <div class="node-description">Subdl Multi-language Core Decryption tracking target raw SRT and ZIP configuration packets.</div>
                <div class="action-ribbon">
                    <button class="action-btn btn-copy" onclick="copyNodeUrl('url-subdl')">Copy URL</button>
                    <button class="action-btn btn-run" onclick="openTerminalSheet('/api/subdl?q=avatar&apikey=MR_HASHUU_SECRET_123', 'Subdl Engine Tracker')">Test Node</button>
                </div>
                <div style="display:none;" id="url-subdl">/api/subdl?q=avatar&apikey=MR_HASHUU_SECRET_123</div>
            </div>

            <!-- NODE 6. OMDb MOVIE INFO -->
            <div class="api-node-card" data-search="movie database omdb cinema rating plot info metacritic imdb">
                <div class="card-top-row">
                    <span class="route-path-text">/api/movie</span>
                    <span class="method-pill">GET</span>
                </div>
                <div class="node-description">OMDb Core Integration Hub providing global cinematic plots, ratings, years and poster assets.</div>
                <div class="action-ribbon">
                    <button class="action-btn btn-copy" onclick="copyNodeUrl('url-movie')">Copy URL</button>
                    <button class="action-btn btn-run" onclick="openTerminalSheet('/api/movie?text=Guardians of the Galaxy&apikey=MR_HASHUU_SECRET_123', 'OMDb Profile Plot')">Test Node</button>
                </div>
                <div style="display:none;" id="url-movie">/api/movie?text=Guardians of the Galaxy&apikey=MR_HASHUU_SECRET_123</div>
            </div>

            <!-- NODE 7. CHATGPT-4o -->
            <div class="api-node-card" data-search="chat ai chatgpt hashan gpt gpt4 smart intelligent cognitive brain">
                <div class="card-top-row">
                    <span class="route-path-text">/api/chat</span>
                    <span class="method-pill">GET</span>
                </div>
                <div class="node-description">Hashan-md Cognitive ChatGPT-4o High-Intelligence Adaptive Artificial Response Engine.</div>
                <div class="action-ribbon">
                    <button class="action-btn btn-copy" onclick="copyNodeUrl('url-chat')">Copy URL</button>
                    <button class="action-btn btn-run" onclick="openTerminalSheet('/api/chat?prompt=Hi&apikey=MR_HASHUU_SECRET_123', 'Cognitive ChatGPT-4o Node')">Test Node</button>
                </div>
                <div style="display:none;" id="url-chat">/api/chat?prompt=Hi&apikey=MR_HASHUU_SECRET_123</div>
            </div>

            <!-- NODE 8. URL SHORTENER -->
            <div class="api-node-card" data-search="cuttly shorten url link tinyurl link-shortener compress">
                <div class="card-top-row">
                    <span class="route-path-text">/api/url_shorten</span>
                    <span class="method-pill">GET</span>
                </div>
                <div class="node-description">Enterprise Cuttly Logic Minimizer System for compressed, safe tracking destination links.</div>
                <div class="action-ribbon">
                    <button class="action-btn btn-copy" onclick="copyNodeUrl('url-shorten')">Copy URL</button>
                    <button class="action-btn btn-run" onclick="openTerminalSheet('/api/url_shorten?link=https://apis.davidcyril.name.ng&apikey=MR_HASHUU_SECRET_123', 'Cuttly Link Minimizer')">Test Node</button>
                </div>
                <div style="display:none;" id="url-shorten">/api/url_shorten?link=https://apis.davidcyril.name.ng&apikey=MR_HASHUU_SECRET_123</div>
            </div>

            <!-- NODE 9. XVIDEOS -->
            <div class="api-node-card" data-search="xvideo xvideos adult downloader download mp4 hot clip bypass streaming">
                <div class="card-top-row">
                    <span class="route-path-text">/xvideo</span>
                    <span class="method-pill">GET</span>
                </div>
                <div class="node-description">XVideos CDN Stream Bypass Resolver extracting direct MP4 media streams over high bandwidth.</div>
                <div class="action-ribbon">
                    <button class="action-btn btn-copy" onclick="copyNodeUrl('url-xvideo')">Copy URL</button>
                    <button class="action-btn btn-run" onclick="openTerminalSheet('/xvideo?url=https://www.xvideos.com/video.hppakie6a79/mia_khalifa&apikey=MR_HASHUU_SECRET_123', 'XVideos Stream Converter')">Test Node</button>
                </div>
                <div style="display:none;" id="url-xvideo">/xvideo?url=https://www.xvideos.com/video.hppakie6a79/mia_khalifa&apikey=MR_HASHUU_SECRET_123</div>
            </div>

            <!-- NODE 10. YTMP4 -->
            <div class="api-node-card" data-search="ytmp4 youtube video downloader download mp4 high quality video tracks">
                <div class="card-top-row">
                    <span class="route-path-text">/ytmp4</span>
                    <span class="method-pill">GET</span>
                </div>
                <div class="node-description">High-Fidelity HD YouTube Video Stream Extractor parsing binary clusters safely.</div>
                <div class="action-ribbon">
                    <button class="action-btn btn-copy" onclick="copyNodeUrl('url-ytmp4')">Copy URL</button>
                    <button class="action-btn btn-run" onclick="openTerminalSheet('/ytmp4?url=https://youtube.com/watch?v=MwpMEbgC7DA&apikey=MR_HASHUU_SECRET_123', 'YouTube HD Stream')">Test Node</button>
                </div>
                <div style="display:none;" id="url-ytmp4">/ytmp4?url=https://youtube.com/watch?v=MwpMEbgC7DA&apikey=MR_HASHUU_SECRET_123</div>
            </div>

            <!-- NODE 11. MEDIAFIRE -->
            <div class="api-node-card" data-search="mediafire downloader direct storage parser files zip cloud">
                <div class="card-top-row">
                    <span class="route-path-text">/mediafire</span>
                    <span class="method-pill">GET</span>
                </div>
                <div class="node-description">Mediafire Data Structure Scraper resolving secure download mirrors automatically.</div>
                <div class="action-ribbon">
                    <button class="action-btn btn-copy" onclick="copyNodeUrl('url-mf')">Copy URL</button>
                    <button class="action-btn btn-run" onclick="openTerminalSheet('/mediafire?url=https://www.mediafire.com/file/n6tgcrktbnov1oy/Queen_Anita-V4.zip/file&apikey=MR_HASHUU_SECRET_123', 'Mediafire Direct Extractor')">Test Node</button>
                </div>
                <div style="display:none;" id="url-mf">/mediafire?url=https://www.mediafire.com/file/n6tgcrktbnov1oy/Queen_Anita-V4.zip/file&apikey=MR_HASHUU_SECRET_123</div>
            </div>

            <!-- NODE 12. SPOTIFY -->
            <div class="api-node-card" data-search="spotify music hq audio downloader song audio mp3 track">
                <div class="card-top-row">
                    <span class="route-path-text">/spotify</span>
                    <span class="method-pill">GET</span>
                </div>
                <div class="node-description">Spotify High-Quality Metadata & Audio Matching Module for structural parsing.</div>
                <div class="action-ribbon">
                    <button class="action-btn btn-copy" onclick="copyNodeUrl('url-sf')">Copy URL</button>
                    <button class="action-btn btn-run" onclick="openTerminalSheet('/spotify?url=https://open.spotify.com/track/285pBltuF7vW8TeWk8hdRR&apikey=MR_HASHUU_SECRET_123', 'Spotify Metadata Engine')">Test Node</button>
                </div>
                <div style="display:none;" id="url-sf">/spotify?url=https://open.spotify.com/track/285pBltuF7vW8TeWk8hdRR&apikey=MR_HASHUU_SECRET_123</div>
            </div>

            <!-- NODE 13. OBFUSCATOR -->
            <div class="api-node-card" data-search="obfuscate javascript security protection code hide encrypt lock reverse-engineering">
                <div class="card-top-row">
                    <span class="route-path-text">/obfuscate</span>
                    <span class="method-pill">GET</span>
                </div>
                <div class="node-description">Anti-Scrape Production Crypt Matrix locking structural JavaScript formats tightly.</div>
                <div class="action-ribbon">
                    <button class="action-btn btn-copy" onclick="copyNodeUrl('url-obf')">Copy URL</button>
                    <button class="action-btn btn-run" onclick="openTerminalSheet('/obfuscate?code=console.log(\\'hashu\\')&apikey=MR_HASHUU_SECRET_123', 'JS Obfuscation System')">Test Node</button>
                </div>
                <div style="display:none;" id="url-obf">/obfuscate?code=console.log('hashu')&apikey=MR_HASHUU_SECRET_123</div>
            </div>

            <!-- NODE 14. IMGBB -->
            <div class="api-node-card" data-search="imgbb photo cloud cdn image host upload post multiplayer upload">
                <div class="card-top-row">
                    <span class="route-path-text">/imgbb</span>
                    <span class="method-pill post">POST</span>
                </div>
                <div class="node-description">Multipart structural gateway uploading binary imaging files securely to ImgBB CDNs.</div>
                <div class="action-ribbon" style="grid-template-columns: 1fr;">
                    <div class="post-notice-block">POST CALLS REQUIRE API GRAPH TERMINALS FOR ACTIVE LIVE DEPLOYMENT</div>
                </div>
            </div>

            <div id="no-search-results">// ZERO RUNTIME ENDPOINTS MATCH CRITERIA //</div>
        </div>

        <!-- Heavy System Interactive Terminal Layer -->
        <div class="console-overlay" id="overlayConsoleSystem" onclick="closeTerminalSheetViaOverlay(event)">
            <div class="console-sheet">
                <div class="sheet-header">
                    <span class="sheet-title" id="overlayTitle">// STANDBY PIPELINE CONSOLE</span>
                    <button class="close-sheet-btn" onclick="hideTerminalSheet()">✕</button>
                </div>
                <div class="sheet-endpoint-url" id="overlayEndpointUrl">/api/route</div>
                <pre class="terminal-viewport" id="overlayTerminalLog">// INITIALIZED SYSTEM ARRAYS IN STEADY STATUS...</pre>
            </div>
        </div>

        <div class="brand-anchor">
            OWNED & DEPLOYED BY <span>MR HASHUU</span>
        </div>

        <script>
            function filterNodeGrid() {
                const searchStr = document.getElementById('nodeSearch').value.toLowerCase().trim();
                const nodeCards = document.getElementsByClassName('api-node-card');
                const fallbackMessage = document.getElementById('no-search-results');
                let matchesFound = false;

                for (let i = 0; i < nodeCards.length; i++) {
                    const tagCriteria = nodeCards[i].getAttribute('data-search');
                    if (tagCriteria.includes(searchStr)) {
                        nodeCards[i].style.display = 'flex';
                        matchesFound = true;
                    } else {
                        nodeCards[i].style.display = 'none';
                    }
                }
                fallbackMessage.style.display = matchesFound ? 'none' : 'block';
            }

            function copyNodeUrl(elementId) {
                const partialPath = document.getElementById(elementId).textContent.trim();
                const cleanAbsoluteUrl = window.location.origin + partialPath;
                
                if (navigator.clipboard && window.isSecureContext) {
                    navigator.clipboard.writeText(cleanAbsoluteUrl).then(() => {
                        triggerToastNotification();
                    }).catch(() => legacyCopyEngineFallback(cleanAbsoluteUrl));
                } else {
                    legacyCopyEngineFallback(cleanAbsoluteUrl);
                }
            }

            function legacyCopyEngineFallback(targetText) {
                const textAreaElement = document.createElement("textarea");
                textAreaElement.value = targetText;
                textAreaElement.style.position = "fixed"; textAreaElement.style.opacity = "0";
                document.body.appendChild(textAreaElement);
                textAreaElement.focus(); textAreaElement.select();
                try {
                    document.execCommand('copy');
                    triggerToastNotification();
                } catch (err) {
                    console.error('Target Pipeline Copy Failed', err);
                }
                document.body.removeChild(textAreaElement);
            }

            function triggerToastNotification() {
                const toast = document.getElementById('toast-layer');
                toast.classList.add('show');
                setTimeout(() => toast.classList.remove('show'), 2000);
            }

            async function openTerminalSheet(endpointUrlPath, cleanNodeTitle) {
                const overlay = document.getElementById('overlayConsoleSystem');
                const logViewport = document.getElementById('overlayTerminalLog');
                
                document.getElementById('overlayTitle').innerText = "// EXECUTION TRACE: " + cleanNodeTitle.toUpperCase();
                document.getElementById('overlayEndpointUrl').innerText = window.location.origin + endpointUrlPath;
                
                overlay.classList.add('active');
                logViewport.textContent = "// STREAM CONSOLE TUNNEL CONNECTED... FETCHING PAYLOAD FRAME SYNC //";
                logViewport.style.color = "var(--neon-cyan)";

                try {
                    const pipelineResponse = await fetch(window.location.origin + endpointUrlPath);
                    const formattedJsonPayload = await pipelineResponse.json();
                    
                    logViewport.textContent = JSON.stringify(formattedJsonPayload, null, 2);
                    logViewport.style.color = "#00FF87"; 
                } catch (networkException) {
                    logViewport.textContent = JSON.stringify({
                        success: false,
                        error: "Decryption structure broke during endpoint matrix simulation execution",
                        exception_log: networkException.message
                    }, null, 2);
                    logViewport.style.color = "var(--neon-pink)"; 
                }
            }

            function hideTerminalSheet() {
                document.getElementById('overlayConsoleSystem').classList.remove('active');
            }

            function closeTerminalSheetViaOverlay(event) {
                if(event.target.id === "overlayConsoleSystem") {
                    hideTerminalSheet();
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

// 13. JS ANTI-SCRAPE OBFUSCATOR
app.get('/obfuscate', strictAuthGate, (req, res) => {
    try {
        const { code } = req.query;
        if (!code) return res.json({ success: false, message: "Code parameter missing!" });
        const obfuscatedCode = obfuscator.obfuscate(code, { compact: true, controlFlowFlattening: true, controlFlowFlatteningThreshold: 0.5 }).getObfuscatedCode();
        res.json({ creator: "MR HASHUU", status: "Authenticated", success: true, result: obfuscatedCode });
    } catch (e) { res.json({ success: false, message: e.message }); }
});

// 14. IMGBB IMAGE CLOUD POST
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
app.listen(PORT, () => console.log(`Premium Ultra-Heavy HASHU Engine Running on port ${PORT}`));

module.exports = app;
