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
// 🌌 ULTRA-PREMIUM CYBERPUNK DARK-MODE INTERACTION UI
// ─────────────────────────────────────────────────────────
app.get('/', (req, res) => {
    res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
        <title>MR HASHUU - COGNITIVE API METAVERSE</title>
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@700;800&family=Space+Grotesk:wght@700;900&display=swap" rel="stylesheet">
        
        <style>
            :root {
                --bg-black: #030303;
                --panel-dark: #0a0a0f;
                --neon-cyan: #00F5FF;
                --neon-purple: #7B2CBF;
                --neon-glow: rgba(0, 245, 255, 0.4);
                --purple-glow: rgba(123, 44, 191, 0.4);
                --text-bright: #ffffff;
                --text-dim: #7e7e8a;
                --border-glass: rgba(255, 255, 255, 0.05);
                --card-gradient: linear-gradient(145deg, rgba(13, 13, 20, 0.8) 0%, rgba(5, 5, 8, 0.9) 100%);
            }
            
            * { box-sizing: border-box; margin: 0; padding: 0; -webkit-tap-highlight-color: transparent; }
            
            body {
                background-color: var(--bg-black);
                color: var(--text-bright);
                font-family: 'Plus Jakarta Sans', sans-serif;
                font-weight: 800;
                min-height: 100vh;
                display: flex;
                justify-content: center;
                align-items: flex-start;
                padding: 20px 15px 100px 15px;
                overflow-x: hidden;
            }

            /* Complex Ambient Light Rings */
            .orb-1 {
                position: fixed; top: -10%; left: -20%; width: 60vw; height: 60vw;
                background: radial-gradient(circle, var(--purple-glow) 0%, transparent 70%);
                z-index: 1; pointer-events: none; filter: blur(80px);
            }
            .orb-2 {
                position: fixed; bottom: -10%; right: -20%; width: 60vw; height: 60vw;
                background: radial-gradient(circle, var(--neon-glow) 0%, transparent 70%);
                z-index: 1; pointer-events: none; filter: blur(80px);
            }

            /* Loader Matrix */
            #cyber-loader {
                position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
                background: var(--bg-black); z-index: 99999;
                display: flex; flex-direction: column; justify-content: center; align-items: center;
                transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
            }
            .loader-ring {
                width: 80px; height: 80px; border: 6px solid rgba(255,255,255,0.02);
                border-left-color: var(--neon-cyan); border-right-color: var(--neon-purple);
                border-radius: 50%; animation: spin 0.9s cubic-bezier(0.68, -0.55, 0.27, 1.55) infinite;
                box-shadow: 0 0 30px var(--purple-glow);
            }
            .loader-text {
                font-family: 'Space Grotesk', sans-serif; font-size: 1.4rem; font-weight: 900; color: #ffffff;
                letter-spacing: 6px; text-transform: uppercase; margin-top: 25px;
                background: linear-gradient(90deg, var(--neon-cyan), var(--neon-purple));
                -webkit-background-clip: text; -webkit-text-fill-color: transparent;
                animation: pulseText 1.5s infinite;
            }
            @keyframes spin { to { transform: rotate(360deg); } }
            @keyframes pulseText { 0%, 100% { opacity: 0.6; } 50% { opacity: 1; } }

            /* Main Premium Container */
            .api-container {
                width: 100%; max-width: 700px; z-index: 2; opacity: 0;
                transform: translateY(20px); transition: all 0.8s cubic-bezier(0.16, 1, 0.3, 1);
            }
            .api-container.loaded { opacity: 1; transform: translateY(0); }

            /* Brand Banner Header */
            .brand-header {
                background: var(--card-gradient); border: 1px solid var(--border-glass);
                padding: 25px; border-radius: 24px; display: flex; flex-direction: column;
                gap: 15px; position: relative; overflow: hidden; box-shadow: 0 20px 40px rgba(0,0,0,0.5);
            }
            .brand-header::before {
                content: ''; position: absolute; top: 0; left: 0; width: 4px; height: 100%;
                background: linear-gradient(to bottom, var(--neon-cyan), var(--neon-purple));
            }
            .brand-meta { display: flex; justify-content: space-between; align-items: center; }
            .brand-title { font-family: 'Space Grotesk', sans-serif; font-size: 2.2rem; font-weight: 900; letter-spacing: -1px; text-transform: uppercase; }
            
            .live-badge {
                display: flex; align-items: center; gap: 8px; font-size: 0.72rem; font-weight: 900;
                color: #000; background: var(--neon-cyan); padding: 6px 14px; border-radius: 50px;
                box-shadow: 0 0 15px var(--neon-glow); letter-spacing: 0.5px;
            }
            .badge-pulse { width: 6px; height: 6px; background: #000; border-radius: 50%; animation: pulseText 1s infinite; }

            /* Search Architecture */
            .search-bar-wrapper { margin-top: 20px; position: relative; }
            .search-input {
                width: 100%; padding: 20px 25px; background: rgba(0, 0, 0, 0.6);
                border: 2px solid var(--border-glass); border-radius: 18px; color: #fff;
                font-family: inherit; font-size: 1rem; font-weight: 800; transition: all 0.3s ease;
            }
            .search-input:focus {
                border-color: var(--neon-purple); background: rgba(0,0,0,0.8);
                box-shadow: 0 0 30px rgba(123, 44, 191, 0.25); outline: none;
            }

            /* Grid Statistics cards */
            .stats-dashboard { display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; margin-top: 15px; }
            .card-stat {
                background: rgba(255, 255, 255, 0.01); border: 1px solid var(--border-glass);
                border-radius: 16px; padding: 15px; display: flex; justify-content: space-between; align-items: center;
            }
            .lbl-stat { font-size: 0.75rem; color: var(--text-dim); text-transform: uppercase; letter-spacing: 0.5px; }
            .val-stat { font-family: 'Space Grotesk', sans-serif; font-size: 1.1rem; color: #fff; font-weight: 900; }

            /* Premium Endpoint Accoridons list */
            .endpoints-title { font-size: 1rem; color: var(--text-dim); text-transform: uppercase; margin: 30px 0 15px 5px; letter-spacing: 1px; }
            .endpoints-stack { display: flex; flex-direction: column; gap: 12px; }
            
            .premium-node {
                background: var(--card-gradient); border: 1px solid var(--border-glass);
                border-radius: 20px; overflow: hidden; transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
            }
            .premium-node:hover { border-color: rgba(255,255,255,0.12); transform: translateY(-2px); }
            
            .node-trigger { padding: 22px; display: flex; justify-content: space-between; align-items: center; cursor: pointer; }
            .node-identity { display: flex; flex-direction: column; gap: 6px; width: 85%; }
            .node-badge-method {
                align-self: flex-start; font-size: 0.65rem; padding: 4px 10px; border-radius: 6px;
                background: rgba(0, 245, 255, 0.06); border: 1px solid rgba(0, 245, 255, 0.15); color: var(--neon-cyan);
            }
            .node-route { font-family: monospace; font-size: 1.15rem; color: #fff; font-weight: 900; letter-spacing: -0.5px; margin-top: 2px; }
            .node-caption { font-size: 0.8rem; color: var(--text-dim); font-weight: 700; line-height: 1.4; }
            
            .node-chevron {
                font-size: 0.8rem; color: var(--text-dim); transition: transform 0.3s;
                background: rgba(255,255,255,0.03); width: 32px; height: 32px; border-radius: 50%;
                display: flex; justify-content: center; align-items: center; border: 1px solid var(--border-glass);
            }

            /* Node Activation States */
            .premium-node.expanded { border-color: var(--neon-cyan); box-shadow: 0 15px 35px rgba(0,245,255,0.06); }
            .premium-node.expanded .node-chevron { transform: rotate(90deg); color: var(--neon-cyan); background: rgba(0,245,255,0.05); }

            /* Expansion Content */
            .node-body { display: none; padding: 0 22px 22px 22px; border-top: 1px solid rgba(255,255,255,0.03); background: rgba(0,0,0,0.2); }
            .body-title { font-size: 0.72rem; color: var(--text-dim); text-transform: uppercase; margin: 18px 0 8px 0; letter-spacing: 0.5px; }
            
            .interactive-box-group { display: flex; flex-direction: column; gap: 10px; margin-top: 5px; }
            .field-link {
                width: 100%; background: #000; border: 1px solid var(--border-glass); padding: 16px;
                border-radius: 14px; font-family: monospace; font-size: 0.82rem; font-weight: 700; color: var(--neon-cyan);
                overflow-x: auto; white-space: nowrap;
            }
            .field-link::-webkit-scrollbar { height: 2px; }
            .field-link::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); }

            .control-row { display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; width: 100%; }
            .btn-core {
                border: none; font-family: inherit; font-size: 0.8rem; font-weight: 900; padding: 15px;
                border-radius: 12px; cursor: pointer; text-transform: uppercase; transition: all 0.2s;
                display: flex; justify-content: center; align-items: center; gap: 6px;
            }
            .btn-core-copy { background: #fff; color: #000; }
            .btn-core-copy:hover { background: #e5e5e5; }
            .btn-core-run { background: linear-gradient(135deg, var(--neon-purple), #531cb3); color: #fff; box-shadow: 0 4px 15px rgba(123, 44, 191, 0.3); }
            .btn-core-run:hover { box-shadow: 0 0 25px rgba(123, 44, 191, 0.6); transform: translateY(-1px); }

            .terminal-view {
                background: #000; border: 1px solid var(--border-glass); border-radius: 14px;
                padding: 18px; font-family: monospace; font-size: 0.8rem; font-weight: 700; color: #555;
                white-space: pre-wrap; overflow-x: auto; max-height: 250px; line-height: 1.6;
            }
            .terminal-view::-webkit-scrollbar { width: 4px; height: 4px; }
            .terminal-view::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.08); }

            /* Status & Empty Search Box */
            #no-results { display: none; text-align: center; padding: 50px 20px; font-size: 0.9rem; color: var(--text-dim); font-family: monospace; }

            /* Floating Toast Alert */
            #toast-alert {
                position: fixed; bottom: 30px; background: #fff; color: #000;
                font-family: 'Space Grotesk', sans-serif; font-weight: 900; font-size: 0.82rem;
                padding: 15px 30px; border-radius: 16px; z-index: 100000; opacity: 0;
                transform: translateY(15px); pointer-events: none; box-shadow: 0 30px 60px rgba(0,0,0,0.6);
                transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1); letter-spacing: 0.5px;
            }
            #toast-alert.show { opacity: 1; transform: translateY(0); }

            /* Permanent Bottom Bar for Premium feel */
            .bottom-bar {
                position: fixed; bottom: 0; left: 0; width: 100vw; background: rgba(5,5,8,0.7);
                backdrop-filter: blur(30px); -webkit-backdrop-filter: blur(30px);
                border-top: 1px solid var(--border-glass); padding: 18px; text-align: center;
                font-size: 0.8rem; color: var(--text-dim); z-index: 10;
            }
            .bottom-bar a { color: var(--neon-cyan); text-decoration: none; font-weight: 900; margin-left: 5px; }

            /* 📱 STUNNING MOBILE OPTIMIZATION METRIC */
            @media (max-width: 600px) {
                body { padding-top: 10px; }
                .brand-header { padding: 20px; border-radius: 20px; }
                .brand-title { font-size: 1.7rem; }
                .search-input { padding: 16px 20px; font-size: 0.9rem; border-radius: 14px; }
                .node-trigger { padding: 18px; }
                .node-route { font-size: 1rem; }
                .node-caption { font-size: 0.76rem; }
                .control-row { grid-template-columns: 1fr; gap: 8px; }
                .btn-core { padding: 12px; font-size: 0.75rem; border-radius: 10px; }
                .field-link, .terminal-view { padding: 14px; font-size: 0.78rem; border-radius: 12px; }
            }
        </style>
    </head>
    <body>

        <div class="orb-1"></div>
        <div class="orb-2"></div>
        <div id="toast-alert">TOKEN COPIED TO CLIPBOARD LAYER ✔</div>

        <!-- System Loader Interface -->
        <div id="cyber-loader">
            <div class="loader-ring"></div>
            <div class="loader-text">MR HASHUU</div>
        </div>

        <div class="api-container" id="main-interface">
            
            <div class="brand-header">
                <div class="brand-meta">
                    <div class="brand-title">HASHU APIS</div>
                    <div class="live-badge">
                        <div class="badge-pulse"></div>
                        <span>CORE LIVE</span>
                    </div>
                </div>
                
                <div class="stats-dashboard">
                    <div class="card-stat">
                        <span class="lbl-stat">Uptime</span>
                        <span class="val-stat" style="color:var(--neon-cyan)">99.99%</span>
                    </div>
                    <div class="card-stat">
                        <span class="lbl-stat">Developer</span>
                        <span class="val-stat" style="background: linear-gradient(90deg, var(--neon-cyan), var(--neon-purple)); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">HASHUU</span>
                    </div>
                </div>

                <div class="search-bar-wrapper">
                    <input type="text" id="apiSearch" class="search-input" placeholder="Filter premium endpoints..." onkeyup="filterEndpoints()">
                </div>
            </div>

            <div class="endpoints-title">Secure Server Nodes</div>

            <div class="endpoints-stack" id="listWrapper">

                <!-- 🎬 THENKIRI MOVIE SEARCH API -->
                <div class="premium-node" data-name="movies search thenkiri batman download link cinema film">
                    <div class="node-trigger" onclick="toggleAccordion(this)">
                        <div class="node-identity">
                            <span class="node-badge-method">GET</span>
                            <span class="node-route">/api/movies/search</span>
                            <span class="node-caption">Thenkiri Movie Search Engine & Direct Download Links Extractor.</span>
                        </div>
                        <span class="node-chevron">▶</span>
                    </div>
                    <div class="node-body">
                        <div class="body-title">Request Execution String</div>
                        <div class="interactive-box-group">
                            <div class="field-link" id="url-movsearch">/api/movies/search?q=batman&limit=5&apikey=MR_HASHUU_SECRET_123</div>
                            <div class="control-row">
                                <button class="btn-core btn-core-copy" onclick="copyLink('url-movsearch')">Copy Link</button>
                                <button class="btn-core btn-core-run" onclick="runEndpoint('url-movsearch', 'res-movsearch', this)">Test Stream</button>
                            </div>
                        </div>
                        <div class="body-title">Console Output Object</div>
                        <pre class="terminal-view" id="res-movsearch">// Awaiting initialization test command...</pre>
                    </div>
                </div>

                <!-- 🎬 THENKIRI LATEST MOVIES API -->
                <div class="premium-node" data-name="movies latest feed thenkiri international hollywood category">
                    <div class="node-trigger" onclick="toggleAccordion(this)">
                        <div class="node-identity">
                            <span class="node-badge-method">GET</span>
                            <span class="node-route">/api/movies/latest</span>
                            <span class="node-caption">Thenkiri Latest Catalog Updates Feed sorted by Categories.</span>
                        </div>
                        <span class="node-chevron">▶</span>
                    </div>
                    <div class="node-body">
                        <div class="body-title">Request Execution String</div>
                        <div class="interactive-box-group">
                            <div class="field-link" id="url-movlatest">/api/movies/latest?category=international&page=1&limit=10&apikey=MR_HASHUU_SECRET_123</div>
                            <div class="control-row">
                                <button class="btn-core btn-core-copy" onclick="copyLink('url-movlatest')">Copy Link</button>
                                <button class="btn-core btn-core-run" onclick="runEndpoint('url-movlatest', 'res-movlatest', this)">Test Stream</button>
                            </div>
                        </div>
                        <div class="body-title">Console Output Object</div>
                        <pre class="terminal-view" id="res-movlatest">// Awaiting initialization test command...</pre>
                    </div>
                </div>

                <!-- 🎬 FZMOVIES SEARCH API -->
                <div class="premium-node" data-name="fzmovies search avengers download mp4 cinema film database">
                    <div class="node-trigger" onclick="toggleAccordion(this)">
                        <div class="node-identity">
                            <span class="node-badge-method">GET</span>
                            <span class="node-route">/api/movies/fzmovies</span>
                            <span class="node-caption">FzMovies Global High-Definition MP4 Search Engine Database.</span>
                        </div>
                        <span class="node-chevron">▶</span>
                    </div>
                    <div class="node-body">
                        <div class="body-title">Request Execution String</div>
                        <div class="interactive-box-group">
                            <div class="field-link" id="url-fzsearch">/api/movies/fzmovies?q=avengers&limit=5&apikey=MR_HASHUU_SECRET_123</div>
                            <div class="control-row">
                                <button class="btn-core btn-core-copy" onclick="copyLink('url-fzsearch')">Copy Link</button>
                                <button class="btn-core btn-core-run" onclick="runEndpoint('url-fzsearch', 'res-fzsearch', this)">Test Stream</button>
                            </div>
                        </div>
                        <div class="body-title">Console Output Object</div>
                        <pre class="terminal-view" id="res-fzsearch">// Awaiting initialization test command...</pre>
                    </div>
                </div>

                <!-- 🎬 CINESUBZ SEARCH API -->
                <div class="premium-node" data-name="cinesubz search sinhala subtitles movie cinesub sl download film">
                    <div class="node-trigger" onclick="toggleAccordion(this)">
                        <div class="node-identity">
                            <span class="node-badge-method">GET</span>
                            <span class="node-route">/api/cinesubz</span>
                            <span class="node-caption">Cinesubz Movie Tracker integrated with Sinhala Subtitle Data blocks.</span>
                        </div>
                        <span class="node-chevron">▶</span>
                    </div>
                    <div class="node-body">
                        <div class="body-title">Request Execution String</div>
                        <div class="interactive-box-group">
                            <div class="field-link" id="url-cinesubz">/api/cinesubz?q=new&apikey=MR_HASHUU_SECRET_123</div>
                            <div class="control-row">
                                <button class="btn-core btn-core-copy" onclick="copyLink('url-cinesubz')">Copy Link</button>
                                <button class="btn-core btn-core-run" onclick="runEndpoint('url-cinesubz', 'res-cinesubz', this)">Test Stream</button>
                            </div>
                        </div>
                        <div class="body-title">Console Output Object</div>
                        <pre class="terminal-view" id="res-cinesubz">// Awaiting initialization test command...</pre>
                    </div>
                </div>

                <!-- 🎬 SUBDL SUBTITLE SEARCH API -->
                <div class="premium-node" data-name="subdl search global subtitle srt english multi translation avatar">
                    <div class="node-trigger" onclick="toggleAccordion(this)">
                        <div class="node-identity">
                            <span class="node-badge-method">GET</span>
                            <span class="node-route">/api/subdl</span>
                            <span class="node-caption">Subdl Global Repository Multilingual Subtitle Tracks Decoder.</span>
                        </div>
                        <span class="node-chevron">▶</span>
                    </div>
                    <div class="node-body">
                        <div class="body-title">Request Execution String</div>
                        <div class="interactive-box-group">
                            <div class="field-link" id="url-subdl">/api/subdl?q=avatar&apikey=MR_HASHUU_SECRET_123</div>
                            <div class="control-row">
                                <button class="btn-core btn-core-copy" onclick="copyLink('url-subdl')">Copy Link</button>
                                <button class="btn-core btn-core-run" onclick="runEndpoint('url-subdl', 'res-subdl', this)">Test Stream</button>
                            </div>
                        </div>
                        <div class="body-title">Console Output Object</div>
                        <pre class="terminal-view" id="res-subdl">// Awaiting initialization test command...</pre>
                    </div>
                </div>
                
                <!-- 🎬 MOVIE DATABASE API -->
                <div class="premium-node" data-name="movie database omdb cinema film guardians plot rating info tracker">
                    <div class="node-trigger" onclick="toggleAccordion(this)">
                        <div class="node-identity">
                            <span class="node-badge-method">GET</span>
                            <span class="node-route">/api/movie</span>
                            <span class="node-caption">OMDb System Cinema Plots & Cinematic Rating Index Mapping.</span>
                        </div>
                        <span class="node-chevron">▶</span>
                    </div>
                    <div class="node-body">
                        <div class="body-title">Request Execution String</div>
                        <div class="interactive-box-group">
                            <div class="field-link" id="url-movie">/api/movie?text=Guardians of the Galaxy&apikey=MR_HASHUU_SECRET_123</div>
                            <div class="control-row">
                                <button class="btn-core btn-core-copy" onclick="copyLink('url-movie')">Copy Link</button>
                                <button class="btn-core btn-core-run" onclick="runEndpoint('url-movie', 'res-movie', this)">Test Stream</button>
                            </div>
                        </div>
                        <div class="body-title">Console Output Object</div>
                        <pre class="terminal-view" id="res-movie">// Awaiting initialization test command...</pre>
                    </div>
                </div>

                <!-- 🤖 CHATGPT -->
                <div class="premium-node" data-name="chat ai chatgpt hashan gpt gpt4 smart intelligent chatbot response text">
                    <div class="node-trigger" onclick="toggleAccordion(this)">
                        <div class="node-identity">
                            <span class="node-badge-method">GET</span>
                            <span class="node-route">/api/chat</span>
                            <span class="node-caption">Hashan-md Cognitive ChatGPT-4o High-Intelligence Response Core.</span>
                        </div>
                        <span class="node-chevron">▶</span>
                    </div>
                    <div class="node-body">
                        <div class="body-title">Request Execution String</div>
                        <div class="interactive-box-group">
                            <div class="field-link" id="url-chat">/api/chat?prompt=Hi&apikey=MR_HASHUU_SECRET_123</div>
                            <div class="control-row">
                                <button class="btn-core btn-core-copy" onclick="copyLink('url-chat')">Copy Link</button>
                                <button class="btn-core btn-core-run" onclick="runEndpoint('url-chat', 'res-chat', this)">Test Stream</button>
                            </div>
                        </div>
                        <div class="body-title">Console Output Object</div>
                        <pre class="terminal-view" id="res-chat">// Awaiting initialization test command...</pre>
                    </div>
                </div>

                <!-- 🔗 LINK SHORTENER -->
                <div class="premium-node" data-name="cuttly shorten url link tinyurl link-shortener short">
                    <div class="node-trigger" onclick="toggleAccordion(this)">
                        <div class="node-identity">
                            <span class="node-badge-method">GET</span>
                            <span class="node-route">/api/url_shorten</span>
                            <span class="node-caption">Cuttly High-Performance Enterprise URL Minimizer System.</span>
                        </div>
                        <span class="node-chevron">▶</span>
                    </div>
                    <div class="node-body">
                        <div class="body-title">Request Execution String</div>
                        <div class="interactive-box-group">
                            <div class="field-link" id="url-shorten">/api/url_shorten?link=https://apis.davidcyril.name.ng&apikey=MR_HASHUU_SECRET_123</div>
                            <div class="control-row">
                                <button class="btn-core btn-core-copy" onclick="copyLink('url-shorten')">Copy Link</button>
                                <button class="btn-core btn-core-run" onclick="runEndpoint('url-shorten', 'res-shorten', this)">Test Stream</button>
                            </div>
                        </div>
                        <div class="body-title">Console Output Object</div>
                        <pre class="terminal-view" id="res-shorten">// Awaiting initialization test command...</pre>
                    </div>
                </div>

                <!-- ❌ XVIDEOS -->
                <div class="premium-node" data-name="xvideo xvideos adult downloader download mp4 hot clip video premium">
                    <div class="node-trigger" onclick="toggleAccordion(this)">
                        <div class="node-identity">
                            <span class="node-badge-method">GET</span>
                            <span class="node-route">/xvideo</span>
                            <span class="node-caption">XVideos Media Streams Resolution Engine & CDN Link Forge.</span>
                        </div>
                        <span class="node-chevron">▶</span>
                    </div>
                    <div class="node-body">
                        <div class="body-title">Request Execution String</div>
                        <div class="interactive-box-group">
                            <div class="field-link" id="url-xvideo">/xvideo?url=https://www.xvideos.com/video.hppakie6a79/mia_khalifa&apikey=MR_HASHUU_SECRET_123</div>
                            <div class="control-row">
                                <button class="btn-core btn-core-copy" onclick="copyLink('url-xvideo')">Copy Link</button>
                                <button class="btn-core btn-core-run" onclick="runEndpoint('url-xvideo', 'res-xvideo', this)">Test Stream</button>
                            </div>
                        </div>
                        <div class="body-title">Console Output Object</div>
                        <pre class="terminal-view" id="res-xvideo">// Awaiting initialization test command...</pre>
                    </div>
                </div>

                <!-- 📺 YTMP4 -->
                <div class="premium-node" data-name="ytmp4 youtube video downloader download mp4 high quality clip video">
                    <div class="node-trigger" onclick="toggleAccordion(this)">
                        <div class="node-identity">
                            <span class="node-badge-method">GET</span>
                            <span class="node-route">/ytmp4</span>
                            <span class="node-caption">YouTube Ultra-HD MP4 Direct Media Source Pack Transformer.</span>
                        </div>
                        <span class="node-chevron">▶</span>
                    </div>
                    <div class="node-body">
                        <div class="body-title">Request Execution String</div>
                        <div class="interactive-box-group">
                            <div class="field-link" id="url-ytmp4">/ytmp4?url=https://youtube.com/watch?v=MwpMEbgC7DA&apikey=MR_HASHUU_SECRET_123</div>
                            <div class="control-row">
                                <button class="btn-core btn-core-copy" onclick="copyLink('url-ytmp4')">Copy Link</button>
                                <button class="btn-core btn-core-run" onclick="runEndpoint('url-ytmp4', 'res-ytmp4', this)">Test Stream</button>
                            </div>
                        </div>
                        <div class="body-title">Console Output Object</div>
                        <pre class="terminal-view" id="res-ytmp4">// Awaiting initialization test command...</pre>
                    </div>
                </div>

                <!-- 📂 MEDIAFIRE -->
                <div class="premium-node" data-name="mediafire downloader direct storage parser">
                    <div class="node-trigger" onclick="toggleAccordion(this)">
                        <div class="node-identity">
                            <span class="node-badge-method">GET</span>
                            <span class="node-route">/mediafire</span>
                            <span class="node-caption">Mediafire Cloud Storage Object Structural Decoupler.</span>
                        </div>
                        <span class="node-chevron">▶</span>
                    </div>
                    <div class="node-body">
                        <div class="body-title">Request Execution String</div>
                        <div class="interactive-box-group">
                            <div class="field-link" id="url-mf">/mediafire?url=https://www.mediafire.com/file/n6tgcrktbnov1oy/Queen_Anita-V4.zip/file&apikey=MR_HASHUU_SECRET_123</div>
                            <div class="control-row">
                                <button class="btn-core btn-core-copy" onclick="copyLink('url-mf')">Copy Link</button>
                                <button class="btn-core btn-core-run" onclick="runEndpoint('url-mf', 'res-mf', this)">Test Stream</button>
                            </div>
                        </div>
                        <div class="body-title">Console Output Object</div>
                        <pre class="terminal-view" id="res-mf">// Awaiting initialization test command...</pre>
                    </div>
                </div>

                <!-- 🎵 SPOTIFY -->
                <div class="premium-node" data-name="spotify music hq audio downloader song">
                    <div class="node-trigger" onclick="toggleAccordion(this)">
                        <div class="node-identity">
                            <span class="node-badge-method">GET</span>
                            <span class="node-route">/spotify</span>
                            <span class="node-caption">Spotify Premium High-Fidelity Audio Link Provisioner.</span>
                        </div>
                        <span class="node-chevron">▶</span>
                    </div>
                    <div class="node-body">
                        <div class="body-title">Request Execution String</div>
                        <div class="interactive-box-group">
                            <div class="field-link" id="url-sf">/spotify?url=https://open.spotify.com/track/285pBltuF7vW8TeWk8hdRR&apikey=MR_HASHUU_SECRET_123</div>
                            <div class="control-row">
                                <button class="btn-core btn-core-copy" onclick="copyLink('url-sf')">Copy Link</button>
                                <button class="btn-core btn-core-run" onclick="runEndpoint('url-sf', 'res-sf', this)">Test Stream</button>
                            </div>
                        </div>
                        <div class="body-title">Console Output Object</div>
                        <pre class="terminal-view" id="res-sf">// Awaiting initialization test command...</pre>
                    </div>
                </div>

                <!-- 🐦 TWITTER -->
                <div class="premium-node" data-name="twitter x stream extractor multi video">
                    <div class="node-trigger" onclick="toggleAccordion(this)">
                        <div class="node-identity">
                            <span class="node-badge-method">GET</span>
                            <span class="node-route">/twitter</span>
                            <span class="node-caption">Twitter / X Multi-Quality Stream Architecture CDN Mapper.</span>
                        </div>
                        <span class="node-chevron">▶</span>
                    </div>
                    <div class="node-body">
                        <div class="body-title">Request Execution String</div>
                        <div class="interactive-box-group">
                            <div class="field-link" id="url-tw">/twitter?url=https://x.com/elonmusk/status/1870901510319833540&apikey=MR_HASHUU_SECRET_123</div>
                            <div class="control-row">
                                <button class="btn-core btn-core-copy" onclick="copyLink('url-tw')">Copy Link</button>
                                <button class="btn-core btn-core-run" onclick="runEndpoint('url-tw', 'res-tw', this)">Test Stream</button>
                            </div>
                        </div>
                        <div class="body-title">Console Output Object</div>
                        <pre class="terminal-view" id="res-tw">// Awaiting initialization test command...</pre>
                    </div>
                </div>

                <!-- 🎵 YOUTUBE PLAY -->
                <div class="premium-node" data-name="song youtube play mp3 audio music stream">
                    <div class="node-trigger" onclick="toggleAccordion(this)">
                        <div class="node-identity">
                            <span class="node-badge-method">GET</span>
                            <span class="node-route">/song</span>
                            <span class="node-caption">YouTube Music Database High-Speed Track Downloader.</span>
                        </div>
                        <span class="node-chevron">▶</span>
                    </div>
                    <div class="node-body">
                        <div class="body-title">Request Execution String</div>
                        <div class="interactive-box-group">
                            <div class="field-link" id="url-sg">/song?text=faded&apikey=MR_HASHUU_SECRET_123</div>
                            <div class="control-row">
                                <button class="btn-core btn-core-copy" onclick="copyLink('url-sg')">Copy Link</button>
                                <button class="btn-core btn-core-run" onclick="runEndpoint('url-sg', 'res-sg', this)">Test Stream</button>
                            </div>
                        </div>
                        <div class="body-title">Console Output Object</div>
                        <pre class="terminal-view" id="res-sg">// Awaiting initialization test command...</pre>
                    </div>
                </div>

                <!-- 🎵 TIKTOK -->
                <div class="premium-node" data-name="tiktok video downloader no watermark">
                    <div class="node-trigger" onclick="toggleAccordion(this)">
                        <div class="node-identity">
                            <span class="node-badge-method">GET</span>
                            <span class="node-route">/tiktok</span>
                            <span class="node-caption">TikTok Studio Resource Engine (Zero Watermark Blocks).</span>
                        </div>
                        <span class="node-chevron">▶</span>
                    </div>
                    <div class="node-body">
                        <div class="body-title">Request Execution String</div>
                        <div class="interactive-box-group">
                            <div class="field-link" id="url-tk">/tiktok?url=https://vm.tiktok.com/ZM6789/&apikey=MR_HASHUU_SECRET_123</div>
                            <div class="control-row">
                                <button class="btn-core btn-core-copy" onclick="copyLink('url-tk')">Copy Link</button>
                                <button class="btn-core btn-core-run" onclick="runEndpoint('url-tk', 'res-tk', this)">Test Stream</button>
                            </div>
                        </div>
                        <div class="body-title">Console Output Object</div>
                        <pre class="terminal-view" id="res-tk">// Awaiting initialization test command...</pre>
                    </div>
                </div>

                <!-- 📌 PINTEREST -->
                <div class="premium-node" data-name="pinterest image search visual hd download">
                    <div class="node-trigger" onclick="toggleAccordion(this)">
                        <div class="node-identity">
                            <span class="node-badge-method">GET</span>
                            <span class="node-route">/pinterest</span>
                            <span class="node-caption">Pinterest Ultra-HD Graphics Array & Media Asset Engine.</span>
                        </div>
                        <span class="node-chevron">▶</span>
                    </div>
                    <div class="node-body">
                        <div class="body-title">Request Execution String</div>
                        <div class="interactive-box-group">
                            <div class="field-link" id="url-pin">/pinterest?text=cyberpunk&apikey=MR_HASHUU_SECRET_123</div>
                            <div class="control-row">
                                <button class="btn-core btn-core-copy" onclick="copyLink('url-pin')">Copy Link</button>
                                <button class="btn-core btn-core-run" onclick="runEndpoint('url-pin', 'res-pin', this)">Test Stream</button>
                            </div>
                        </div>
                        <div class="body-title">Console Output Object</div>
                        <pre class="terminal-view" id="res-pin">// Awaiting initialization test command...</pre>
                    </div>
                </div>

                <!-- 🤖 APK -->
                <div class="premium-node" data-name="apk android package app mirror tool download">
                    <div class="node-trigger" onclick="toggleAccordion(this)">
                        <div class="node-identity">
                            <span class="node-badge-method">GET</span>
                            <span class="node-route">/apk</span>
                            <span class="node-caption">Android Application Package (.apk) Core Binary Fetcher.</span>
                        </div>
                        <span class="node-chevron">▶</span>
                    </div>
                    <div class="node-body">
                        <div class="body-title">Request Execution String</div>
                        <div class="interactive-box-group">
                            <div class="field-link" id="url-apk">/apk?text=whatsapp&apikey=MR_HASHUU_SECRET_123</div>
                            <div class="control-row">
                                <button class="btn-core btn-core-copy" onclick="copyLink('url-apk')">Copy Link</button>
                                <button class="btn-core btn-core-run" onclick="runEndpoint('url-apk', 'res-apk', this)">Test Stream</button>
                            </div>
                        </div>
                        <div class="body-title">Console Output Object</div>
                        <pre class="terminal-view" id="res-apk">// Awaiting initialization test command...</pre>
                    </div>
                </div>

                <!-- 👥 FACEBOOK -->
                <div class="premium-node" data-name="facebook fb video resolver cdn download">
                    <div class="node-trigger" onclick="toggleAccordion(this)">
                        <div class="node-identity">
                            <span class="node-badge-method">GET</span>
                            <span class="node-route">/facebook</span>
                            <span class="node-caption">Facebook Watch Media Structural Link Resolver.</span>
                        </div>
                        <span class="node-chevron">▶</span>
                    </div>
                    <div class="node-body">
                        <div class="body-title">Request Execution String</div>
                        <div class="interactive-box-group">
                            <div class="field-link" id="url-fb">/facebook?url=https://www.facebook.com/watch/?v=123&apikey=MR_HASHUU_SECRET_123</div>
                            <div class="control-row">
                                <button class="btn-core btn-core-copy" onclick="copyLink('url-fb')">Copy Link</button>
                                <button class="btn-core btn-core-run" onclick="runEndpoint('url-fb', 'res-fb', this)">Test Stream</button>
                            </div>
                        </div>
                        <div class="body-title">Console Output Object</div>
                        <pre class="terminal-view" id="res-fb">// Awaiting initialization test command...</pre>
                    </div>
                </div>

                <!-- 🌐 WEBSITE CLONER -->
                <div class="premium-node" data-name="webdl website clone html static site page download">
                    <div class="node-trigger" onclick="toggleAccordion(this)">
                        <div class="node-identity">
                            <span class="node-badge-method">GET</span>
                            <span class="node-route">/webdl</span>
                            <span class="node-caption">Static Production Web Structures Mapping & Storage Packager.</span>
                        </div>
                        <span class="node-chevron">▶</span>
                    </div>
                    <div class="node-body">
                        <div class="body-title">Request Execution String</div>
                        <div class="interactive-box-group">
                            <div class="field-link" id="url-wdl">/webdl?url=https://example.com&apikey=MR_HASHUU_SECRET_123</div>
                            <div class="control-row">
                                <button class="btn-core btn-core-copy" onclick="copyLink('url-wdl')">Copy Link</button>
                                <button class="btn-core btn-core-run" onclick="runEndpoint('url-wdl', 'res-wdl', this)">Test Stream</button>
                            </div>
                        </div>
                        <div class="body-title">Console Output Object</div>
                        <pre class="terminal-view" id="res-wdl">// Awaiting initialization test command...</pre>
                    </div>
                </div>

                <!-- 🔒 JAVASCRIPT OBFUSCATOR -->
                <div class="premium-node" data-name="obfuscate javascript security protection code hide encrypt">
                    <div class="node-trigger" onclick="toggleAccordion(this)">
                        <div class="node-identity">
                            <span class="node-badge-method">GET</span>
                            <span class="node-route">/obfuscate</span>
                            <span class="node-caption">Advanced Anti-Scrape Structural Logic Scrambler Protection.</span>
                        </div>
                        <span class="node-chevron">▶</span>
                    </div>
                    <div class="node-body">
                        <div class="body-title">Request Execution String</div>
                        <div class="interactive-box-group">
                            <div class="field-link" id="url-obf">/obfuscate?code=console.log('hashu')&apikey=MR_HASHUU_SECRET_123</div>
                            <div class="control-row">
                                <button class="btn-core btn-core-copy" onclick="copyLink('url-obf')">Copy Link</button>
                                <button class="btn-core btn-core-run" onclick="runEndpoint('url-obf', 'res-obf', this)">Test Stream</button>
                            </div>
                        </div>
                        <div class="body-title">Console Output Object</div>
                        <pre class="terminal-view" id="res-obf">// Awaiting initialization test command...</pre>
                    </div>
                </div>

                <!-- 🖼️ IMGBB POST -->
                <div class="premium-node" data-name="imgbb photo cloud cdn image host upload post">
                    <div class="node-trigger" onclick="toggleAccordion(this)">
                        <div class="node-identity">
                            <span class="node-badge-method" style="color:var(--neon-purple); border-color:rgba(123,44,191,0.3)">POST</span>
                            <span class="node-route">/imgbb</span>
                            <span class="node-caption">Multipart Binary Payload Array Uploader to ImgBB CDN Space.</span>
                        </div>
                        <span class="node-chevron">▶</span>
                    </div>
                    <div class="node-body">
                        <div class="body-title">Deployment Configuration</div>
                        <div class="field-link" style="color:var(--text-dim)">POST Target Gate (Requires Multipart Form-Data Stream)</div>
                        <div class="body-title">Console Log Output</div>
                        <pre class="terminal-view">// Form data multi-part payloads cannot be evaluated via GUI layout console.</pre>
                    </div>
                </div>

                <div id="no-results">// SEARCH FILTER CRITERIA EMPTY //</div>
            </div>
        </div>

        <div class="bottom-bar">
            <span>DEVELOPED & DEPLOYED BY <a href="#">MR HASHUU</a></span>
        </div>

        <script>
            window.addEventListener('DOMContentLoaded', () => {
                setTimeout(() => {
                    const loader = document.getElementById('cyber-loader');
                    const mainUI = document.getElementById('main-interface');
                    loader.style.opacity = '0';
                    loader.style.transform = 'scale(1.1)';
                    setTimeout(() => {
                        loader.remove();
                        mainUI.classList.add('loaded');
                    }, 500);
                }, 1000);
            });

            function toggleAccordion(element) {
                const parent = element.parentElement;
                const bodySection = parent.querySelector('.node-body');
                const isOpen = parent.classList.contains('expanded');

                const allNodes = document.getElementsByClassName('premium-node');
                for (let node of allNodes) {
                    node.classList.remove('expanded');
                    node.querySelector('.node-body').style.display = 'none';
                }

                if (!isOpen) {
                    parent.classList.add('expanded');
                    bodySection.style.display = 'block';
                }
            }

            function filterEndpoints() {
                const query = document.getElementById('apiSearch').value.toLowerCase().trim();
                const nodes = document.getElementsByClassName('premium-node');
                const noResults = document.getElementById('no-results');
                let found = false;

                for (let i = 0; i < nodes.length; i++) {
                    const dataTags = nodes[i].getAttribute('data-name');
                    if (dataTags.includes(query)) {
                        nodes[i].style.display = 'block';
                        found = true;
                    } else {
                        nodes[i].style.display = 'none';
                    }
                }
                noResults.style.display = found ? 'none' : 'block';
            }

            function copyLink(elementId) {
                const pathText = document.getElementById(elementId).textContent.trim();
                const fullUrl = window.location.origin + pathText;
                
                if (navigator.clipboard && window.isSecureContext) {
                    navigator.clipboard.writeText(fullUrl).then(() => {
                        triggerToast();
                    }).catch(() => fallbackCopyEngine(fullUrl));
                } else {
                    fallbackCopyEngine(fullUrl);
                }
            }

            function fallbackCopyEngine(textToCopy) {
                const textArea = document.createElement("textarea");
                textArea.value = textToCopy;
                textArea.style.position = "fixed"; 
                textArea.style.opacity = "0";
                document.body.appendChild(textArea);
                textArea.focus();
                textArea.select();
                try {
                    document.execCommand('copy');
                    triggerToast();
                } catch (err) {
                    console.error('Core failure to pipeline copy matrix', err);
                }
                document.body.removeChild(textArea);
            }

            function triggerToast() {
                const toast = document.getElementById('toast-alert');
                toast.classList.add('show');
                setTimeout(() => toast.classList.remove('show'), 2000);
            }

            async function runEndpoint(urlElementId, responseContainerId, buttonElement) {
                const pathText = document.getElementById(urlElementId).textContent.trim();
                const absoluteTargetUrl = window.location.origin + pathText;
                const outputConsole = document.getElementById(responseContainerId);

                buttonElement.innerText = "TUNNELING...";
                buttonElement.disabled = true;
                outputConsole.textContent = "// TRANSMITTING OVER CLOUD PIPELINE... //";
                outputConsole.style.color = "var(--neon-cyan)";

                try {
                    const webStreamResponse = await fetch(absoluteTargetUrl);
                    const systemJsonPayload = await webStreamResponse.json();
                    
                    outputConsole.textContent = JSON.stringify(systemJsonPayload, null, 2);
                    outputConsole.style.color = "#00FF87"; // Soft green code success
                } catch (serverException) {
                    outputConsole.textContent = JSON.stringify({
                        success: false,
                        error: "Data transmission stream broken",
                        exception_log: serverException.message
                    }, null, 2);
                    outputConsole.style.color = "#ff453a"; // Soft red error
                } finally {
                    buttonElement.innerText = "TEST STREAM";
                    buttonElement.disabled = false;
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

// TWITTER STREAM CDN
app.get('/twitter', strictAuthGate, async (req, res) => {
    try {
        const { url } = req.query;
        if (!url) return res.json({ success: false, message: "Twitter URL required!" });
        const { data } = await axios.get(`https://apis.davidcyriltech.my.id/twitterV2?url=${encodeURIComponent(url)}`);
        res.json({ creator: "MR HASHUU", status: "Authenticated", success: true, result: data });
    } catch (e) { res.json({ success: false, message: e.message }); }
});

// YOUTUBE AUDIO SONG
app.get('/song', strictAuthGate, async (req, res) => {
    try {
        const { text } = req.query;
        if (!text) return res.json({ success: false, message: "Song name required" });
        const { data } = await axios.get(`https://apis.davidcyriltech.my.id/play?query=${encodeURIComponent(text)}`);
        if (data.status && data.result) res.json({ creator: "MR HASHUU", status: "Authenticated", success: true, result: data.result });
        else res.json({ success: false, message: "Failed to fetch song." });
    } catch (e) { res.json({ success: false, message: e.message }); }
});

// TIKTOK NO-WATERMARK
app.get('/tiktok', strictAuthGate, async (req, res) => {
    try {
        const { url } = req.query;
        if (!url) return res.json({ success: false, message: "TikTok URL required!" });
        const { data } = await axios.get(`https://apis.davidcyriltech.my.id/download/tiktok?url=${encodeURIComponent(url)}`);
        if (data.success && data.result) res.json({ creator: "MR HASHUU", status: "Authenticated", success: true, result: data.result });
        else res.json({ success: false, message: "Invalid TikTok URL." });
    } catch (e) { res.json({ success: false, message: e.message }); }
});

// PINTEREST MEDIA IMAGE
app.get('/pinterest', strictAuthGate, async (req, res) => {
    try {
        const { text } = req.query;
        if (!text) return res.json({ success: false, message: "Query text required" });
        const { data } = await axios.get(`https://apis.davidcyriltech.my.id/search/pinterest?text=${encodeURIComponent(text)}`);
        res.json({ creator: "MR HASHUU", status: "Authenticated", success: true, result: data.result || [] });
    } catch (e) { res.json({ success: false, message: e.message }); }
});

// APK PACKAGE MIRROR
app.get('/apk', strictAuthGate, async (req, res) => {
    try {
        const { text } = req.query;
        if (!text) return res.json({ success: false, message: "App name required" });
        const { data } = await axios.get(`https://apis.davidcyriltech.my.id/download/apk?text=${encodeURIComponent(text)}`, { headers: { 'User-Agent': 'Mozilla/5.0' }, timeout: 8000 });
        res.json({ creator: "MR HASHUU", status: "Authenticated", success: true, result: data.apk || {} });
    } catch (e) { res.json({ success: false, message: e.message }); }
});

// FACEBOOK WATCH EXTRACTOR
app.get('/facebook', strictAuthGate, async (req, res) => {
    try {
        const { url } = req.query;
        if (!url) return res.json({ success: false, message: "URL parameter missing!" });
        const { data } = await axios.get(`https://apis.davidcyriltech.my.id/facebook2?url=${encodeURIComponent(url)}`);
        if (data.status) res.json({ creator: "MR HASHUU", status: "Authenticated", success: true, result: data.video });
        else res.json({ success: false, message: "Could not fetch video." });
    } catch (e) { res.json({ success: false, message: e.message }); }
});

// STATIC WEBPAGE CLONER
app.get('/webdl', strictAuthGate, async (req, res) => {
    try {
        const { url } = req.query;
        if (!url) return res.json({ success: false, message: "Website URL required!" });
        const { data } = await axios.get(`https://apis.davidcyriltech.my.id/tools/downloadweb?url=${encodeURIComponent(url)}`);
        if (data.response && (data.response.success === true || data.response.success === "true")) {
            res.json({ creator: "MR HASHUU", status: "Authenticated", success: true, result: { downloadUrl: data.response.downloadUrl, isFinished: data.response.isFinished } });
        } else res.json({ success: false, message: "Failed to clone website." });
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
