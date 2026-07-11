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
// 🌌 NEW ULTIMATE MOBILE-FIRST PREMIUM API SITE DASHBOARD
// ─────────────────────────────────────────────────────────
app.get('/', (req, res) => {
    res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
        <title>MR HASHUU - ULTIMATE API CODESPACE</title>
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@700;900&display=swap" rel="stylesheet">
        
        <style>
            :root {
                --bg-main: #050508;
                --panel-blur: rgba(13, 13, 23, 0.5);
                --neon-cyan: #00F5FF;
                --neon-purple: #7B2CBF;
                --cyan-glow: rgba(0, 245, 255, 0.35);
                --text-main: #ffffff;
                --text-muted: #6c6c7e;
                --border-neon: rgba(0, 245, 255, 0.15);
            }
            
            * { box-sizing: border-box; margin: 0; padding: 0; -webkit-tap-highlight-color: transparent; }
            
            body {
                background-color: var(--bg-main);
                color: var(--text-main);
                font-family: 'Space Grotesk', sans-serif;
                font-weight: 900;
                min-height: 100vh;
                padding: 15px 15px 80px 15px;
                overflow-x: hidden;
            }

            /* Custom Ambient Neon Background Grid */
            body::before {
                content: ''; position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
                background: radial-gradient(circle at 10% 20%, rgba(123, 44, 191, 0.15) 0%, transparent 40%),
                            radial-gradient(circle at 90% 80%, rgba(0, 245, 255, 0.12) 0%, transparent 40%);
                z-index: -1; pointer-events: none;
            }

            /* 🌟 Premium Minimalist Header Matrix */
            .premium-hero {
                text-align: center; margin-top: 15px; margin-bottom: 25px; padding: 20px 10px;
            }
            .hero-badge {
                display: inline-flex; align-items: center; gap: 6px; font-size: 0.7rem; background: rgba(0, 245, 255, 0.08);
                border: 1px solid var(--border-neon); color: var(--neon-cyan); padding: 5px 12px; border-radius: 50px;
                text-transform: uppercase; letter-spacing: 1px; box-shadow: 0 0 15px rgba(0, 245, 255, 0.1);
            }
            .hero-badge::before { content: ''; width: 6px; height: 6px; background: var(--neon-cyan); border-radius: 50%; box-shadow: 0 0 8px var(--neon-cyan); }
            
            .hero-main-title {
                font-size: 2.3rem; font-weight: 900; text-transform: uppercase; margin-top: 10px; letter-spacing: -1px;
                background: linear-gradient(135deg, #ffffff 30%, var(--neon-cyan)); -webkit-background-clip: text; -webkit-text-fill-color: transparent;
                text-shadow: 0 0 30px rgba(0,245,255,0.1);
            }

            /* 🔍 Ultra-Sleek Fixed Floating Search Engine */
            .search-container {
                width: 100%; max-width: 550px; margin: 0 auto 25px auto; position: relative;
            }
            .search-box {
                width: 100%; padding: 18px 22px; background: rgba(255,255,255,0.02);
                border: 2px solid rgba(255,255,255,0.05); border-radius: 16px; color: #fff;
                font-family: inherit; font-weight: 700; font-size: 0.95rem; transition: all 0.3s ease;
                box-shadow: inset 0 2px 4px rgba(0,0,0,0.8);
            }
            .search-box:focus {
                outline: none; border-color: var(--neon-cyan); background: rgba(0,0,0,0.8);
                box-shadow: 0 0 25px rgba(0,245,255,0.15), inset 0 2px 4px rgba(0,0,0,1);
            }

            /* 📱 Modular Grid Engine (Perfect Fit for Any Mobile) */
            .api-grid-system {
                display: grid; grid-template-columns: 1fr; gap: 14px; max-width: 550px; margin: 0 auto;
            }

            .api-node-card {
                background: var(--panel-blur); backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px);
                border: 1px solid rgba(255, 255, 255, 0.04); border-radius: 20px; padding: 20px;
                display: flex; flex-direction: column; justify-content: space-between; gap: 15px;
                position: relative; overflow: hidden; transition: all 0.25s ease;
            }
            .api-node-card::after {
                content: ''; position: absolute; top: 0; left: 0; width: 100%; height: 100%;
                background: linear-gradient(135deg, rgba(0,245,255,0.03) 0%, transparent 100%); opacity: 0; transition: opacity 0.3s;
            }
            .api-node-card:active { transform: scale(0.98); border-color: var(--neon-cyan); }

            .card-top-row { display: flex; justify-content: space-between; align-items: center; width: 100%; }
            
            .method-pill {
                font-size: 0.65rem; font-weight: 900; padding: 4px 10px; border-radius: 8px;
                background: rgba(0, 245, 255, 0.08); border: 1px solid var(--border-neon); color: var(--neon-cyan);
            }
            .method-pill.post {
                background: rgba(123, 44, 191, 0.1); border-color: rgba(123, 44, 191, 0.3); color: var(--neon-purple);
            }

            .route-path-text { font-family: monospace; font-size: 1.1rem; color: #ffffff; font-weight: 900; letter-spacing: -0.5px; }
            .node-description { font-size: 0.8rem; color: var(--text-muted); font-weight: 700; line-height: 1.4; }

            /* Modern Integrated Action Ribbon */
            .action-ribbon { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; width: 100%; }
            .action-btn {
                border: none; font-family: inherit; font-size: 0.75rem; font-weight: 900; padding: 12px;
                border-radius: 12px; cursor: pointer; text-transform: uppercase; transition: all 0.2s;
                display: flex; justify-content: center; align-items: center; gap: 6px;
            }
            .btn-copy { background: rgba(255,255,255,0.04); color: #fff; border: 1px solid rgba(255,255,255,0.04); }
            .btn-run { background: var(--neon-cyan); color: #000; box-shadow: 0 4px 15px rgba(0, 245, 255, 0.2); }

            /* 🎛️ Dynamic Overlay Console Panel (Modal Sheet) */
            .console-overlay {
                position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(3,3,5,0.85);
                backdrop-filter: blur(25px); -webkit-backdrop-filter: blur(25px); z-index: 10000;
                display: flex; justify-content: center; align-items: flex-end; opacity: 0; pointer-events: none;
                transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
            }
            .console-overlay.active { opacity: 1; pointer-events: auto; }
            
            .console-sheet {
                width: 100%; max-width: 550px; background: #0b0b12; border-top: 2px solid var(--neon-cyan);
                border-radius: 24px 24px 0 0; padding: 25px 20px; transform: translateY(100%);
                transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
            }
            .console-overlay.active .console-sheet { transform: translateY(0); }

            .sheet-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; }
            .sheet-title { font-size: 1rem; text-transform: uppercase; color: var(--neon-cyan); }
            .close-sheet-btn {
                background: rgba(255,255,255,0.05); border: none; width: 32px; height: 32px;
                border-radius: 50%; color: #fff; font-family: inherit; font-weight: 900; cursor: pointer;
            }

            .sheet-endpoint-url {
                width: 100%; background: rgba(0,0,0,0.4); padding: 14px; border-radius: 12px;
                font-family: monospace; font-size: 0.78rem; color: #a0a0b0; overflow-x: auto;
                margin-bottom: 15px; border: 1px solid rgba(255,255,255,0.02);
            }

            .terminal-viewport {
                width: 100%; background: #020204; border: 1px solid rgba(255,255,255,0.04);
                border-radius: 14px; padding: 16px; font-family: monospace; font-size: 0.8rem;
                font-weight: 900; color: #555; white-space: pre-wrap; overflow-x: auto;
                max-height: 280px; line-height: 1.5; box-shadow: inset 0 4px 12px rgba(0,0,0,0.9);
            }

            /* Toast Layer System */
            #toast-layer {
                position: fixed; top: 25px; left: 50%; transform: translate(-50%, -20px);
                background: #fff; color: #000; font-size: 0.8rem; font-weight: 900;
                padding: 12px 24px; border-radius: 50px; z-index: 105000; opacity: 0; pointer-events: none;
                transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1); box-shadow: 0 20px 40px rgba(0,0,0,0.5);
            }
            #toast-layer.show { opacity: 1; transform: translate(-50%, 0); }

            #no-search-results { display: none; text-align: center; color: var(--text-muted); font-size: 0.85rem; padding: 40px 10px; text-transform: uppercase; }

            /* Fixed Minimalist Branding Anchor */
            .brand-anchor {
                text-align: center; margin-top: 40px; font-size: 0.75rem; color: var(--text-muted); letter-spacing: 0.5px;
            }
            .brand-anchor span { color: var(--neon-cyan); }

            /* Base adjustments for smaller screens */
            @media (max-width: 400px) {
                .hero-main-title { font-size: 1.9rem; }
                .route-path-text { font-size: 0.95rem; }
            }
        </style>
    </head>
    <body>

        <div id="toast-layer">PIPELINE COPIED SUCCESSFULLY ✔</div>

        <!-- Hero Branding Engine -->
        <div class="premium-hero">
            <div class="hero-badge">Next-Gen Interface Live</div>
            <div class="hero-main-title">HASHU CORE APIS</div>
        </div>

        <!-- Floating Search Architecture -->
        <div class="search-container">
            <input type="text" id="nodeSearch" class="search-box" placeholder="Search direct stream parameters..." onkeyup="filterNodeGrid()">
        </div>

        <!-- Grid Matrix Architecture -->
        <div class="api-grid-system" id="gridContainer">

            <!-- MOVIE SEARCH -->
            <div class="api-node-card" data-search="movies search thenkiri batman download link cinema">
                <div class="card-top-row">
                    <span class="route-path-text">/api/movies/search</span>
                    <span class="method-pill">GET</span>
                </div>
                <div class="node-description">Thenkiri Movie Indexing & Premium High-Speed Direct Stream Extporter Engine.</div>
                <div class="action-ribbon">
                    <button class="action-btn btn-copy" onclick="copyNodeUrl('url-movsearch')">Copy URL</button>
                    <button class="action-btn btn-run" onclick="openTerminalSheet('/api/movies/search?q=batman&limit=5&apikey=MR_HASHUU_SECRET_123', 'Thenkiri Movie Search')">Test Node</button>
                </div>
                <div style="display:none;" id="url-movsearch">/api/movies/search?q=batman&limit=5&apikey=MR_HASHUU_SECRET_123</div>
            </div>

            <!-- LATEST MOVIES -->
            <div class="api-node-card" data-search="movies latest feed thenkiri category">
                <div class="card-top-row">
                    <span class="route-path-text">/api/movies/latest</span>
                    <span class="method-pill">GET</span>
                </div>
                <div class="node-description">Thenkiri Structural Update Pipelines indexed dynamically by target tags.</div>
                <div class="action-ribbon">
                    <button class="action-btn btn-copy" onclick="copyNodeUrl('url-movlatest')">Copy URL</button>
                    <button class="action-btn btn-run" onclick="openTerminalSheet('/api/movies/latest?category=international&page=1&limit=10&apikey=MR_HASHUU_SECRET_123', 'Thenkiri Latest Catalog')">Test Node</button>
                </div>
                <div style="display:none;" id="url-movlatest">/api/movies/latest?category=international&page=1&limit=10&apikey=MR_HASHUU_SECRET_123</div>
            </div>

            <!-- FZMOVIES -->
            <div class="api-node-card" data-search="fzmovies search avengers download mp4 cinema">
                <div class="card-top-row">
                    <span class="route-path-text">/api/movies/fzmovies</span>
                    <span class="method-pill">GET</span>
                </div>
                <div class="node-description">Global FzMovies Server Array integration tracking MP4 resolution packages.</div>
                <div class="action-ribbon">
                    <button class="action-btn btn-copy" onclick="copyNodeUrl('url-fzsearch')">Copy URL</button>
                    <button class="action-btn btn-run" onclick="openTerminalSheet('/api/movies/fzmovies?q=avengers&limit=5&apikey=MR_HASHUU_SECRET_123', 'FzMovies Global Database')">Test Node</button>
                </div>
                <div style="display:none;" id="url-fzsearch">/api/movies/fzmovies?q=avengers&limit=5&apikey=MR_HASHUU_SECRET_123</div>
            </div>

            <!-- CINESUBZ -->
            <div class="api-node-card" data-search="cinesubz search sinhala subtitles movie cinesub sl">
                <div class="card-top-row">
                    <span class="route-path-text">/api/cinesubz</span>
                    <span class="method-pill">GET</span>
                </div>
                <div class="node-description">Sinhala Subtitle Link Forge parsed over Cinesubz Cloud Infrastructure.</div>
                <div class="action-ribbon">
                    <button class="action-btn btn-copy" onclick="copyNodeUrl('url-cinesubz')">Copy URL</button>
                    <button class="action-btn btn-run" onclick="openTerminalSheet('/api/cinesubz?q=new&apikey=MR_HASHUU_SECRET_123', 'Cinesubz Subtitle Tracker')">Test Node</button>
                </div>
                <div style="display:none;" id="url-cinesubz">/api/cinesubz?q=new&apikey=MR_HASHUU_SECRET_123</div>
            </div>

            <!-- SUBDL -->
            <div class="api-node-card" data-search="subdl search global subtitle srt english multi translation">
                <div class="card-top-row">
                    <span class="route-path-text">/api/subdl</span>
                    <span class="method-pill">GET</span>
                </div>
                <div class="node-description">Subdl Global Multilingual Decryption framework targeting direct Subtitle SRT logs.</div>
                <div class="action-ribbon">
                    <button class="action-btn btn-copy" onclick="copyNodeUrl('url-subdl')">Copy URL</button>
                    <button class="action-btn btn-run" onclick="openTerminalSheet('/api/subdl?q=avatar&apikey=MR_HASHUU_SECRET_123', 'Subdl Global Track Engine')">Test Node</button>
                </div>
                <div style="display:none;" id="url-subdl">/api/subdl?q=avatar&apikey=MR_HASHUU_SECRET_123</div>
            </div>

            <!-- OMDb MOVIE INFO -->
            <div class="api-node-card" data-search="movie database omdb cinema film plot rating info">
                <div class="card-top-row">
                    <span class="route-path-text">/api/movie</span>
                    <span class="method-pill">GET</span>
                </div>
                <div class="node-description">OMDb Core Integration Fetcher providing high density cinematic plot metrics.</div>
                <div class="action-ribbon">
                    <button class="action-btn btn-copy" onclick="copyNodeUrl('url-movie')">Copy URL</button>
                    <button class="action-btn btn-run" onclick="openTerminalSheet('/api/movie?text=Guardians of the Galaxy&apikey=MR_HASHUU_SECRET_123', 'OMDb Plot System')">Test Node</button>
                </div>
                <div style="display:none;" id="url-movie">/api/movie?text=Guardians of the Galaxy&apikey=MR_HASHUU_SECRET_123</div>
            </div>

            <!-- CHATGPT-4o -->
            <div class="api-node-card" data-search="chat ai chatgpt hashan gpt gpt4 smart intelligent chatbot">
                <div class="card-top-row">
                    <span class="route-path-text">/api/chat</span>
                    <span class="method-pill">GET</span>
                </div>
                <div class="node-description">Hashan-md Cognitive ChatGPT-4o High-Intelligence Response Core logic.</div>
                <div class="action-ribbon">
                    <button class="action-btn btn-copy" onclick="copyNodeUrl('url-chat')">Copy URL</button>
                    <button class="action-btn btn-run" onclick="openTerminalSheet('/api/chat?prompt=Hi&apikey=MR_HASHUU_SECRET_123', 'Cognitive ChatGPT-4o Node')">Test Node</button>
                </div>
                <div style="display:none;" id="url-chat">/api/chat?prompt=Hi&apikey=MR_HASHUU_SECRET_123</div>
            </div>

            <!-- URL SHORTENER -->
            <div class="api-node-card" data-search="cuttly shorten url link tinyurl link-shortener">
                <div class="card-top-row">
                    <span class="route-path-text">/api/url_shorten</span>
                    <span class="method-pill">GET</span>
                </div>
                <div class="node-description">Enterprise level Cuttly API Minimizer Layer designed for secure compact linking.</div>
                <div class="action-ribbon">
                    <button class="action-btn btn-copy" onclick="copyNodeUrl('url-shorten')">Copy URL</button>
                    <button class="action-btn btn-run" onclick="openTerminalSheet('/api/url_shorten?link=https://apis.davidcyril.name.ng&apikey=MR_HASHUU_SECRET_123', 'URL Shortener Engine')">Test Node</button>
                </div>
                <div style="display:none;" id="url-shorten">/api/url_shorten?link=https://apis.davidcyril.name.ng&apikey=MR_HASHUU_SECRET_123</div>
            </div>

            <!-- XVIDEOS -->
            <div class="api-node-card" data-search="xvideo xvideos adult downloader download mp4 hot clip video">
                <div class="card-top-row">
                    <span class="route-path-text">/xvideo</span>
                    <span class="method-pill">GET</span>
                </div>
                <div class="node-description">XVideos CDN Stream Resolver extracting raw payload locations directly.</div>
                <div class="action-ribbon">
                    <button class="action-btn btn-copy" onclick="copyNodeUrl('url-xvideo')">Copy URL</button>
                    <button class="action-btn btn-run" onclick="openTerminalSheet('/xvideo?url=https://www.xvideos.com/video.hppakie6a79/mia_khalifa&apikey=MR_HASHUU_SECRET_123', 'XVideos Engine Node')">Test Node</button>
                </div>
                <div style="display:none;" id="url-xvideo">/xvideo?url=https://www.xvideos.com/video.hppakie6a79/mia_khalifa&apikey=MR_HASHUU_SECRET_123</div>
            </div>

            <!-- YTMP4 -->
            <div class="api-node-card" data-search="ytmp4 youtube video downloader download mp4 high quality clip">
                <div class="card-top-row">
                    <span class="route-path-text">/ytmp4</span>
                    <span class="method-pill">GET</span>
                </div>
                <div class="node-description">High-Speed HD MP4 Converter processing requests via direct cloud bypass channels.</div>
                <div class="action-ribbon">
                    <button class="action-btn btn-copy" onclick="copyNodeUrl('url-ytmp4')">Copy URL</button>
                    <button class="action-btn btn-run" onclick="openTerminalSheet('/ytmp4?url=https://youtube.com/watch?v=MwpMEbgC7DA&apikey=MR_HASHUU_SECRET_123', 'YouTube High-Speed MP4')">Test Node</button>
                </div>
                <div style="display:none;" id="url-ytmp4">/ytmp4?url=https://youtube.com/watch?v=MwpMEbgC7DA&apikey=MR_HASHUU_SECRET_123</div>
            </div>

            <!-- MEDIAFIRE -->
            <div class="api-node-card" data-search="mediafire downloader direct storage parser">
                <div class="card-top-row">
                    <span class="route-path-text">/mediafire</span>
                    <span class="method-pill">GET</span>
                </div>
                <div class="node-description">Mediafire Cloud Node Scraper extracting standard direct application layout files.</div>
                <div class="action-ribbon">
                    <button class="action-btn btn-copy" onclick="copyNodeUrl('url-mf')">Copy URL</button>
                    <button class="action-btn btn-run" onclick="openTerminalSheet('/mediafire?url=https://www.mediafire.com/file/n6tgcrktbnov1oy/Queen_Anita-V4.zip/file&apikey=MR_HASHUU_SECRET_123', 'Mediafire Direct Extractor')">Test Node</button>
                </div>
                <div style="display:none;" id="url-mf">/mediafire?url=https://www.mediafire.com/file/n6tgcrktbnov1oy/Queen_Anita-V4.zip/file&apikey=MR_HASHUU_SECRET_123</div>
            </div>

            <!-- SPOTIFY -->
            <div class="api-node-card" data-search="spotify music hq audio downloader song">
                <div class="card-top-row">
                    <span class="route-path-text">/spotify</span>
                    <span class="method-pill">GET</span>
                </div>
                <div class="node-description">Spotify metadata matching array extracting absolute binary output sources.</div>
                <div class="action-ribbon">
                    <button class="action-btn btn-copy" onclick="copyNodeUrl('url-sf')">Copy URL</button>
                    <button class="action-btn btn-run" onclick="openTerminalSheet('/spotify?url=https://open.spotify.com/track/285pBltuF7vW8TeWk8hdRR&apikey=MR_HASHUU_SECRET_123', 'Spotify High-Fidelity Audio')">Test Node</button>
                </div>
                <div style="display:none;" id="url-sf">/spotify?url=https://open.spotify.com/track/285pBltuF7vW8TeWk8hdRR&apikey=MR_HASHUU_SECRET_123</div>
            </div>

            <!-- OBFUSCATOR -->
            <div class="api-node-card" data-search="obfuscate javascript security protection code hide encrypt">
                <div class="card-top-row">
                    <span class="route-path-text">/obfuscate</span>
                    <span class="method-pill">GET</span>
                </div>
                <div class="node-description">Premium Obfuscation Algorithm safeguarding Javascript structure code blocks.</div>
                <div class="action-ribbon">
                    <button class="action-btn btn-copy" onclick="copyNodeUrl('url-obf')">Copy URL</button>
                    <button class="action-btn btn-run" onclick="openTerminalSheet('/obfuscate?code=console.log(\\'hashu\\')&apikey=MR_HASHUU_SECRET_123', 'JS Anti-Scrape Structural Logic')">Test Node</button>
                </div>
                <div style="display:none;" id="url-obf">/obfuscate?code=console.log('hashu')&apikey=MR_HASHUU_SECRET_123</div>
            </div>

            <!-- IMGBB -->
            <div class="api-node-card" data-search="imgbb photo cloud cdn image host upload post">
                <div class="card-top-row">
                    <span class="route-path-text">/imgbb</span>
                    <span class="method-pill post">POST</span>
                </div>
                <div class="node-description">Multipart form binary data receiver delivering directly to safe ImgBB hosting vectors.</div>
                <div class="action-ribbon" style="grid-template-columns: 1fr;">
                    <div style="text-align:center; font-size:0.75rem; color:#ff453a; font-weight:900;">POST GATES NOT EVALUATED IN REAL-TIME CONSOLE</div>
                </div>
            </div>

            <div id="no-search-results">// MATCHING NODES NOT DEPLOYED //</div>
        </div>

        <!-- 🎛️ Bottom SHEET Overlay Console Logic -->
        <div class="console-overlay" id="overlayConsoleSystem" onclick="closeTerminalSheetViaOverlay(event)">
            <div class="console-sheet">
                <div class="sheet-header">
                    <span class="sheet-title" id="overlayTitle">// SYSTEM CONSOLE TERMINAL</span>
                    <button class="close-sheet-btn" onclick="hideTerminalSheet()">✕</button>
                </div>
                <div class="sheet-endpoint-url" id="overlayEndpointUrl">/api/target/stream</div>
                <pre class="terminal-viewport" id="overlayTerminalLog">// INITIALIZATION STREAMS QUEUED...</pre>
            </div>
        </div>

        <div class="brand-anchor">
            OWNED & MAINTAINED BY <span>MR HASHUU</span>
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
                    console.error('Terminal Pipeline Copy Error', err);
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
                
                document.getElementById('overlayTitle').innerText = "// " + cleanNodeTitle.toUpperCase();
                document.getElementById('overlayEndpointUrl').innerText = window.location.origin + endpointUrlPath;
                
                overlay.classList.add('active');
                logViewport.textContent = "// STREAM TRANSMISSION ESTABLISHED... CONNECTING VIA SSL PROXY //";
                logViewport.style.color = "var(--neon-cyan)";

                try {
                    const pipelineResponse = await fetch(window.location.origin + endpointUrlPath);
                    const formattedJsonPayload = await pipelineResponse.json();
                    
                    logViewport.textContent = JSON.stringify(formattedJsonPayload, null, 2);
                    logViewport.style.color = "#00FF87"; // Vibrant success neon green
                } catch (networkException) {
                    logViewport.textContent = JSON.stringify({
                        success: false,
                        error: "Data layer decryption failed",
                        exception_log: networkException.message
                    }, null, 2);
                    logViewport.style.color = "#ff453a"; // Crimson error code red
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

// 🎬 THENKIRI MOVIE SEARCH CONTROLLER
app.get('/api/movies/search', strictAuthGate, async (req, res) => {
    try {
        const { q, limit } = req.query;
        if (!q) return res.json({ success: false, message: "Search query (?q=) parameter missing!" });
        
        const finalLimit = limit || 5;
        const targetUrl = `https://apis.davidcyriltech.my.id/movies/search?q=${encodeURIComponent(q)}&limit=${finalLimit}`;
        const { data } = await axios.get(targetUrl);

        if (data.success) {
            res.json({
                creator: "MR HASHUU",
                status: "Authenticated",
                success: true,
                query: data.query,
                count: data.count,
                results: data.results
            });
        } else {
            res.json({ success: false, message: "No data found on Thenkiri database layer." });
        }
    } catch (e) {
        res.json({ success: false, message: e.message });
    }
});

// 🎬 THENKIRI LATEST MOVIES CONTROLLER
app.get('/api/movies/latest', strictAuthGate, async (req, res) => {
    try {
        const { category, page, limit } = req.query;
        
        const finalCategory = category || "international";
        const finalPage = page || 1;
        const finalLimit = limit || 10;

        const targetUrl = `https://apis.davidcyriltech.my.id/movies/latest?category=${encodeURIComponent(finalCategory)}&page=${finalPage}&limit=${finalLimit}`;
        const { data } = await axios.get(targetUrl);

        if (data.success) {
            res.json({
                creator: "MR HASHUU",
                status: "Authenticated",
                success: true,
                category: data.category,
                page: data.page,
                count: data.count,
                results: data.results
            });
        } else {
            res.json({ success: false, message: "Failed to fetch latest data feed from Thenkiri stream." });
        }
    } catch (e) {
        res.json({ success: false, message: e.message });
    }
});

// 🎬 FZMOVIES SEARCH CONTROLLER
app.get('/api/movies/fzmovies', strictAuthGate, async (req, res) => {
    try {
        const { q, limit } = req.query;
        if (!q) return res.json({ success: false, message: "Search query (?q=) parameter missing!" });

        const finalLimit = limit || 5;
        const targetUrl = `https://apis.davidcyriltech.my.id/movies/fzmovies/search?q=${encodeURIComponent(q)}&limit=${finalLimit}`;
        const { data } = await axios.get(targetUrl);

        if (data.success) {
            res.json({
                creator: "MR HASHUU",
                status: "Authenticated",
                success: true,
                query: data.query,
                count: data.count,
                results: data.results
            });
        } else {
            res.json({ success: false, message: "No results mapping your query on FzMovies architecture." });
        }
    } catch (e) {
        res.json({ success: false, message: e.message });
    }
});

// 🎬 CINESUBZ SEARCH CONTROLLER
app.get('/api/cinesubz', strictAuthGate, async (req, res) => {
    try {
        const { q } = req.query;
        if (!q) return res.json({ success: false, message: "Search query (?q=) parameter missing!" });

        const targetUrl = `https://apis.davidcyriltech.my.id/cinesubz/search?q=${encodeURIComponent(q)}&limit=10`;
        const { data } = await axios.get(targetUrl);

        if (data.success) {
            res.json({ creator: "MR HASHUU", status: "Authenticated", success: true, query: data.query, count: data.count, results: data.results });
        } else { res.json({ success: false, message: "No data found on Cinesubz architecture." }); }
    } catch (e) { res.json({ success: false, message: e.message }); }
});

// 🎬 SUBDL SUBTITLE DATABASE CONTROLLER
app.get('/api/subdl', strictAuthGate, async (req, res) => {
    try {
        const { q } = req.query;
        if (!q) return res.json({ success: false, message: "Search query (?q=) parameter missing!" });

        const targetUrl = `https://apis.davidcyriltech.my.id/subdl/search?q=${encodeURIComponent(q)}`;
        const { data } = await axios.get(targetUrl);

        if (data.success) {
            res.json({ creator: "MR HASHUU", status: "Authenticated", success: true, query: data.query, total: data.total, results: data.results });
        } else { res.json({ success: false, message: "No subtitle results found on Subdl matrix." }); }
    } catch (e) { res.json({ success: false, message: e.message }); }
});

// 🎬 MOVIE DATABASE CONTROLLER
app.get('/api/movie', strictAuthGate, async (req, res) => {
    try {
        const { text } = req.query;
        if (!text) return res.json({ success: false, message: "Movie title parameter (?text=) missing!" });

        const movieUrl = `http://www.omdbapi.com/?t=${encodeURIComponent(text)}&apikey=2634bb02`;
        const { data } = await axios.get(movieUrl);

        if (data.Response === "True") {
            res.json({ creator: "MR HASHUU", status: "Authenticated", success: true, result: data });
        } else { res.json({ success: false, message: data.Error || "Movie not found!" }); }
    } catch (e) { res.json({ success: false, message: e.message }); }
});

// CHATGPT-4o SMART INTERFACE
app.get('/api/chat', strictAuthGate, async (req, res) => {
    try {
        const { prompt } = req.query;
        if (!prompt) return res.json({ success: false, message: "Prompt parameter missing!" });

        const cleanPrompt = prompt.toLowerCase().trim();
        if (cleanPrompt === 'hi') return res.json({ creator: "MR HASHUU", status: "Authenticated", success: true, result: "Hellow Im Hashuu Ai Service" });
        if (cleanPrompt === 'kawad bn') return res.json({ creator: "MR HASHUU", status: "Authenticated", success: true, result: "huththak kwa" });

        const customSystemPrompt = "You are Hashan-md AI, a brilliant, helpful AI assistant developed and owned by MR HASHUU. Always respond in an intelligent and smart manner.";
        const targetUrl = `https://apis.davidcyriltech.my.id/ai/chatgpt?prompt=${encodeURIComponent(prompt)}&model=gpt-4o&system=${encodeURIComponent(customSystemPrompt)}`;
        const { data } = await axios.get(targetUrl);
        res.json({ creator: "MR HASHUU", status: "Authenticated", success: true, result: data?.data?.choices?.[0]?.message?.content || "AI break. Retry." });
    } catch (e) { res.json({ success: false, message: e.message }); }
});

// CUTTLY URL SHORTENER
app.get('/api/url_shorten', strictAuthGate, async (req, res) => {
    try {
        const { link } = req.query;
        if (!link) return res.json({ success: false, message: "Link parameter missing!" });
        const { data } = await axios.get(`https://apis.davidcyriltech.my.id/cuttly?link=${encodeURIComponent(link)}`);
        if (data.success) res.json({ creator: "MR HASHUU", status: "Authenticated", success: true, original_url: data.original_url, shortened_url: data.shortened_url });
        else res.json({ success: false, message: "URL shortening failed." });
    } catch (e) { res.json({ success: false, message: e.message }); }
});

// XVIDEOS DOWNLOADER
app.get('/xvideo', strictAuthGate, async (req, res) => {
    try {
        const { url } = req.query;
        if (!url) return res.json({ success: false, message: "XVideo URL required!" });
        const { data } = await axios.get(`https://apis.davidcyriltech.my.id/xvideo?url=${encodeURIComponent(url)}`);
        if (data.success) res.json({ creator: "MR HASHUU", status: "Authenticated", success: true, title: data.title, thumbnail: data.thumbnail, download_url: data.download_url });
        else res.json({ success: false, message: "Conversion failed." });
    } catch (e) { res.json({ success: false, message: e.message }); }
});

// YOUTUBE MP4 DOWNLOADER
app.get('/ytmp4', strictAuthGate, async (req, res) => {
    try {
        const { url } = req.query;
        if (!url) return res.json({ success: false, message: "YouTube URL required!" });
        const { data } = await axios.get(`https://apis.davidcyriltech.my.id/download/ytmp4?url=${encodeURIComponent(url)}`);
        if (data.success && data.result) res.json({ creator: "MR HASHUU", status: "Authenticated", success: true, result: data.result });
        else res.json({ success: false, message: "Media conversion failed." });
    } catch (e) { res.json({ success: false, message: e.message }); }
});

// MEDIAFIRE PARSER
app.get('/mediafire', strictAuthGate, async (req, res) => {
    try {
        const { url } = req.query;
        if (!url) return res.json({ success: false, message: "Mediafire URL required!" });
        const { data } = await axios.get(`https://apis.davidcyriltech.my.id/mediafire?url=${encodeURIComponent(url)}`);
        res.json({ creator: "MR HASHUU", status: "Authenticated", success: true, result: data });
    } catch (e) { res.json({ success: false, message: e.message }); }
});

// SPOTIFY EXTRACTOR
app.get('/spotify', strictAuthGate, async (req, res) => {
    try {
        const { url } = req.query;
        if (!url) return res.json({ success: false, message: "Spotify URL required!" });
        const { data } = await axios.get(`https://apis.davidcyriltech.my.id/spotifydl?url=${encodeURIComponent(url)}`);
        res.json({ creator: "MR HASHUU", status: "Authenticated", success: true, result: data });
    } catch (e) { res.json({ success: false, message: e.message }); }
});

// JS ANTI-SCRAPE OBFUSCATOR
app.get('/obfuscate', strictAuthGate, (req, res) => {
    try {
        const { code } = req.query;
        if (!code) return res.json({ success: false, message: "Code parameter missing!" });
        const obfuscatedCode = obfuscator.obfuscate(code, { compact: true, controlFlowFlattening: true, controlFlowFlatteningThreshold: 0.5 }).getObfuscatedCode();
        res.json({ creator: "MR HASHUU", status: "Authenticated", success: true, result: obfuscatedCode });
    } catch (e) { res.json({ success: false, message: e.message }); }
});

// IMGBB IMAGE CLOUD POST
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
app.listen(PORT, () => console.log(`Premium HASHU-API Engine Running on port ${PORT}`));

module.exports = app;
