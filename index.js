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
// 🌌 VAJIRA STYLED PREMIUM WEB INTERACTION UI (NO EMOJIS)
// ─────────────────────────────────────────────────────────
app.get('/', (req, res) => {
    res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
        <title>MR HASHUU OFFICIAL API GATEWAY</title>
        
        <!-- FONTS & OFFICIAL BRAND LOGO ICONS (FONT AWESOME & DEV ICONS) -->
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@700;900&family=Plus+Jakarta+Sans:wght@700;800;900&display=swap" rel="stylesheet">
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
        
        <style>
            :root {
                --brand-dark: #06070d;
                --brand-card: #0d0f1a;
                --brand-border: rgba(255, 255, 255, 0.08);
                --brand-cyan: #00F5FF;
                --brand-purple: #7B2CBF;
                --brand-green: #00FF87;
                --brand-red: #ff453a;
                --text-main: #ffffff;
                --text-muted: #8e92a6;
            }
            
            * { box-sizing: border-box; margin: 0; padding: 0; -webkit-tap-highlight-color: transparent; }
            
            body {
                background-color: var(--brand-dark);
                color: var(--text-main);
                font-family: 'Plus Jakarta Sans', sans-serif;
                min-height: 100vh;
                display: flex;
                justify-content: center;
                align-items: flex-start;
                padding: 40px 0;
                position: relative;
                overflow-x: hidden;
            }

            /* ANIMATED METEOR EFFECT BACKGROUND */
            .bg-glow {
                position: fixed; top: -10%; left: 50%; transform: translateX(-50%); width: 100vw; height: 50vh;
                background: radial-gradient(circle, rgba(0, 245, 255, 0.1) 0%, rgba(123, 44, 191, 0.05) 50%, transparent 100%);
                z-index: 1; pointer-events: none; filter: blur(80px);
            }

            /* MASTER WEB CONTAINER (VAJIRA STYLE STRUCTURE) */
            .main-panel {
                width: 92%; max-width: 750px;
                background: var(--brand-card);
                border: 1px solid var(--brand-border); border-radius: 20px;
                padding: 35px; z-index: 2; position: relative;
                box-shadow: 0 40px 80px rgba(0, 0, 0, 0.7);
                animation: panelFade 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
            }
            @keyframes panelFade { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }

            header { display: flex; justify-content: space-between; align-items: center; padding-bottom: 25px; border-bottom: 1px solid var(--brand-border); flex-wrap: wrap; gap: 15px; }
            header h1 { font-family: 'Space Grotesk', sans-serif; font-size: 2.2rem; font-weight: 900; letter-spacing: -1px; color: #ffffff; text-transform: uppercase; }
            header h1 span { color: var(--brand-cyan); }

            .status-tag {
                display: inline-flex; align-items: center; gap: 8px;
                font-size: 0.8rem; font-weight: 900; letter-spacing: 0.5px;
                color: var(--brand-green); background: rgba(0, 255, 135, 0.08);
                padding: 8px 16px; border-radius: 8px; border: 1px solid rgba(0, 255, 135, 0.2);
            }
            .pulse-circle { width: 8px; height: 8px; background: var(--brand-green); border-radius: 50%; box-shadow: 0 0 10px var(--brand-green); animation: pulseAnim 1.5s infinite; }
            @keyframes pulseAnim { 0%, 100% { opacity: 0.6; } 50% { opacity: 1; } }

            /* ANALYTICS GRID */
            .dashboard-stats { display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px; margin-top: 25px; }
            .stat-node { background: rgba(255, 255, 255, 0.02); border: 1px solid var(--brand-border); border-radius: 12px; padding: 18px 15px; text-align: center; transition: all 0.25s; }
            .stat-node:hover { border-color: rgba(0, 245, 255, 0.3); background: rgba(255, 255, 255, 0.04); }
            .stat-heading { font-size: 0.75rem; font-weight: 900; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.8px; }
            .stat-data { font-size: 1.3rem; font-weight: 900; color: #ffffff; margin-top: 6px; font-family: 'Space Grotesk', sans-serif; }

            /* SEARCH ARCHITECTURE */
            .search-wrapper { position: relative; margin-top: 25px; }
            .search-wrapper i { position: absolute; left: 20px; top: 50%; transform: translateY(-50%); color: var(--text-muted); font-size: 1.1rem; }
            .search-bar {
                width: 100%; padding: 18px 22px 18px 52px; background: #07080e;
                border: 1px solid var(--brand-border); border-radius: 14px;
                color: #ffffff; font-size: 1rem; font-weight: 900; outline: none; transition: all 0.3s;
            }
            .search-bar:focus { border-color: var(--brand-cyan); box-shadow: 0 0 20px rgba(0, 245, 255, 0.15); }
            ::placeholder { color: #4b4f63; font-weight: 800; }

            /* API CARDS ARCHITECTURE (ACCORDION STYLING WITH SMOOTH SLIDE) */
            .api-stream-list { margin-top: 25px; display: flex; flex-direction: column; gap: 14px; }
            .api-card { background: rgba(255, 255, 255, 0.01); border: 1px solid var(--brand-border); border-radius: 14px; overflow: hidden; transition: all 0.25s ease-out; }
            .api-card:hover { border-color: rgba(255, 255, 255, 0.15); background: rgba(255, 255, 255, 0.02); }
            
            .api-head { padding: 22px; display: flex; justify-content: space-between; align-items: center; cursor: pointer; }
            .api-identity { display: flex; align-items: center; gap: 16px; max-width: 85%; }
            .api-icon-container {
                width: 45px; height: 45px; background: rgba(255, 255, 255, 0.03); border: 1px solid var(--brand-border); 
                border-radius: 10px; display: flex; justify-content: center; align-items: center; font-size: 1.2rem; color: var(--brand-cyan);
                transition: all 0.3s;
            }
            .api-card:hover .api-icon-container { background: var(--brand-cyan); color: #000; box-shadow: 0 0 15px var(--brand-cyan); border-color: var(--brand-cyan); }
            
            .api-meta-strings { display: flex; flex-direction: column; gap: 4px; }
            .route-path { font-size: 1.15rem; font-weight: 900; color: #ffffff; font-family: monospace; letter-spacing: -0.3px; }
            .route-summary { font-size: 0.85rem; font-weight: 800; color: var(--text-muted); }
            .action-angle { font-size: 0.9rem; color: var(--text-muted); font-weight: 900; transition: transform 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
            
            /* ACTIVE ACCORDION STATE */
            .api-card.active { border-color: var(--brand-purple); background: #080a12; }
            .api-card.active .action-angle { transform: rotate(90deg); color: var(--brand-cyan); }

            /* API BODY PANEL */
            .api-body { display: none; padding: 0 22px 22px 22px; border-top: 1px solid rgba(255, 255, 255, 0.04); background: rgba(0,0,0,0.2); }
            .meta-section-header { font-size: 0.75rem; font-weight: 900; color: var(--text-muted); text-transform: uppercase; margin: 18px 0 8px 0; letter-spacing: 0.8px; }
            
            .uri-input-box { display: flex; gap: 10px; margin-top: 6px; }
            .uri-string-view {
                flex-grow: 1; background: #030408; border: 1px solid var(--brand-border); padding: 16px;
                border-radius: 10px; font-family: monospace; font-size: 0.85rem; font-weight: 800; color: var(--brand-cyan);
                overflow-x: auto; white-space: nowrap;
            }
            .uri-string-view::-webkit-scrollbar { height: 4px; }
            .uri-string-view::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.15); border-radius: 10px; }

            .btn-trigger {
                border: none; font-size: 0.8rem; font-weight: 900; padding: 0 20px; border-radius: 10px; cursor: pointer; text-transform: uppercase; transition: all 0.2s; min-height: 48px;
                display: inline-flex; align-items: center; gap: 8px;
            }
            .btn-clipboard { background: #ffffff; color: #000000; }
            .btn-clipboard:hover { opacity: 0.88; }
            .btn-execute { background: linear-gradient(135deg, var(--brand-purple), #531cb3); color: #ffffff; }
            .btn-execute:hover { box-shadow: 0 0 15px rgba(123, 44, 191, 0.6); }

            /* CONSOLE NODE SCREEN */
            .terminal-node-view {
                background: #030408; border: 1px solid var(--brand-border); border-radius: 10px;
                padding: 16px; font-family: monospace; font-size: 0.82rem; font-weight: 800; color: #4e536b;
                white-space: pre-wrap; overflow-x: auto; max-height: 220px; line-height: 1.5;
            }
            .terminal-node-view::-webkit-scrollbar { width: 4px; height: 4px; }
            .terminal-node-view::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.1); }

            /* REAL BRAND LOGOS FOR REPLIES */
            .method-get-tag { font-size: 0.65rem; font-weight: 900; background: rgba(0, 245, 255, 0.1); color: var(--brand-cyan); padding: 3px 6px; border-radius: 4px; margin-right: 5px; }
            .method-post-tag { font-size: 0.65rem; font-weight: 900; background: rgba(123, 44, 191, 0.15); color: #b76eff; padding: 3px 6px; border-radius: 4px; margin-right: 5px; }

            /* INTERACTIVE TOAST POPUP */
            #floating-toast {
                position: fixed; bottom: 35px; background: #ffffff; color: #000000;
                font-weight: 900; font-size: 0.85rem; padding: 15px 30px; border-radius: 12px;
                z-index: 10000; opacity: 0; transform: translateY(15px); pointer-events: none;
                box-shadow: 0 20px 40px rgba(0,0,0,0.5);
                transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
                display: flex; align-items: center; gap: 10px;
            }
            #floating-toast.visible { opacity: 1; transform: translateY(0); }

            #no-results { display: none; text-align: center; padding: 50px; font-size: 0.9rem; font-weight: 900; color: var(--text-muted); font-family: monospace; border: 1px dashed var(--brand-border); border-radius: 14px; }
            footer { display: flex; justify-content: space-between; align-items: center; font-size: 0.8rem; font-weight: 900; color: var(--text-muted); border-top: 1px solid var(--brand-border); padding-top: 25px; margin-top: 30px; flex-wrap: wrap; gap: 10px; }
            .req-key-anchor { color: var(--brand-cyan); text-decoration: none; font-weight: 900; transition: color 0.2s; }
            .req-key-anchor:hover { color: #ffffff; }

            /* 📱 STAGE-PERFECT MOBILE RESPONSIVE ENGINE (100% SCREEN FIT) */
            @media (max-width: 650px) {
                body { padding: 15px 0; }
                .main-panel { padding: 25px 16px; border-radius: 16px; width: 94%; }
                header h1 { font-size: 1.7rem; }
                .status-tag { padding: 6px 12px; font-size: 0.75rem; }
                .dashboard-stats { grid-template-columns: 1fr; gap: 10px; margin-top: 20px; }
                .stat-node { padding: 14px; display: flex; justify-content: space-between; align-items: center; text-align: left; }
                .stat-data { margin-top: 0; font-size: 1.1rem; }
                .uri-input-box { flex-direction: column; gap: 8px; }
                .btn-trigger { width: 100%; justify-content: center; }
                .route-path { font-size: 1rem; }
                .route-summary { font-size: 0.8rem; }
                .api-head { padding: 16px; }
                .api-icon-container { width: 38px; height: 38px; font-size: 1rem; }
                .terminal-node-view { max-height: 180px; font-size: 0.78rem; }
                #floating-toast { width: 90%; left: 5%; right: 5%; justify-content: center; bottom: 20px; }
            }
        </style>
    </head>
    <body>

        <div class="bg-glow"></div>
        <div id="floating-toast"><i class="fa-solid fa-circle-check"></i> REQUEST PATH SECURED TO CLIPBOARD</div>

        <div class="main-panel">
            
            <header>
                <h1>HASHU <span>APIS</span></h1>
                <div class="status-tag">
                    <div class="pulse-circle"></div>
                    <span>SYSTEM ONLINE</span>
                </div>
            </header>

            <!-- STATS ENGINE PANEL -->
            <div class="dashboard-stats">
                <div class="stat-node">
                    <div class="stat-heading">Total Secure Requests</div>
                    <div class="stat-data">245.8K</div>
                </div>
                <div class="stat-node">
                    <div class="stat-heading">Node Server Latency</div>
                    <div class="stat-data">99.99%</div>
                </div>
                <div class="stat-node">
                    <div class="stat-heading">Main Developer</div>
                    <div class="stat-data" style="color: var(--brand-cyan);">MR HASHUU</div>
                </div>
            </div>

            <!-- SEARCH ENGINE HUB -->
            <div class="search-wrapper">
                <i class="fa-solid fa-magnifying-glass"></i>
                <input type="text" id="apiSearch" class="search-bar" placeholder="Search developer operational secure endpoints..." onkeyup="filterEndpoints()">
            </div>

            <!-- CORE APIS GRID LIST (ALL 15 ENDPOINTS ATTACHED) -->
            <div class="api-stream-list" id="listWrapper">
                
                <!-- 1. MOVIE DATABASE API -->
                <div class="api-card" data-name="movie database omdb cinema film guardians plot rating info tracker">
                    <div class="api-head" onclick="toggleAccordion(this)">
                        <div class="api-identity">
                            <div class="api-icon-container"><i class="fa-solid fa-clapperboard"></i></div>
                            <div class="api-meta-strings">
                                <span class="route-path"><span class="method-get-tag">GET</span>/api/movie</span>
                                <span class="route-summary">OMDb Cinema & Film Data Information Tracking Engine</span>
                            </div>
                        </div>
                        <span class="action-angle"><i class="fa-solid fa-chevron-right"></i></span>
                    </div>
                    <div class="api-body">
                        <div class="meta-section-header">Execution Gateway Endpoint</div>
                        <div class="uri-input-box">
                            <div class="uri-string-view" id="url-movie">/api/movie?text=Guardians of the Galaxy&apikey=MR_HASHUU_SECRET_123</div>
                            <button class="btn-trigger btn-clipboard" onclick="copyLink('url-movie')"><i class="fa-solid fa-copy"></i> Copy</button>
                            <button class="btn-trigger btn-execute" onclick="runEndpoint('url-movie', 'res-movie', this)"><i class="fa-solid fa-play"></i> Run API</button>
                        </div>
                        <div class="meta-section-header">Live Server Response Output</div>
                        <pre class="terminal-node-view" id="res-movie">{ "status": "idle", "message": "Click Run API to view live server stream data." }</pre>
                    </div>
                </div>

                <!-- 2. CHAT AI INTERFACE -->
                <div class="api-card" data-name="chat ai chatgpt hashan gpt gpt4 smart intelligent chatbot response text">
                    <div class="api-head" onclick="toggleAccordion(this)">
                        <div class="api-identity">
                            <div class="api-icon-container"><i class="fa-solid fa-robot"></i></div>
                            <div class="api-meta-strings">
                                <span class="route-path"><span class="method-get-tag">GET</span>/api/chat</span>
                                <span class="route-summary">Hashan-md AI / ChatGPT-4o Smart Interface</span>
                            </div>
                        </div>
                        <span class="action-angle"><i class="fa-solid fa-chevron-right"></i></span>
                    </div>
                    <div class="api-body">
                        <div class="meta-section-header">Execution Gateway Endpoint</div>
                        <div class="uri-input-box">
                            <div class="uri-string-view" id="url-chat">/api/chat?prompt=Hi&apikey=MR_HASHUU_SECRET_123</div>
                            <button class="btn-trigger btn-clipboard" onclick="copyLink('url-chat')"><i class="fa-solid fa-copy"></i> Copy</button>
                            <button class="btn-trigger btn-execute" onclick="runEndpoint('url-chat', 'res-chat', this)"><i class="fa-solid fa-play"></i> Run API</button>
                        </div>
                        <div class="meta-section-header">Live Server Response Output</div>
                        <pre class="terminal-node-view" id="res-chat">{ "status": "idle", "message": "Click Run API to view live server stream data." }</pre>
                    </div>
                </div>

                <!-- 3. LINK SHORTENER -->
                <div class="api-card" data-name="cuttly shorten url link tinyurl link-shortener short">
                    <div class="api-head" onclick="toggleAccordion(this)">
                        <div class="api-identity">
                            <div class="api-icon-container"><i class="fa-solid fa-link"></i></div>
                            <div class="api-meta-strings">
                                <span class="route-path"><span class="method-get-tag">GET</span>/api/url_shorten</span>
                                <span class="route-summary">Cuttly Professional Link Shortener Engine</span>
                            </div>
                        </div>
                        <span class="action-angle"><i class="fa-solid fa-chevron-right"></i></span>
                    </div>
                    <div class="api-body">
                        <div class="meta-section-header">Execution Gateway Endpoint</div>
                        <div class="uri-input-box">
                            <div class="uri-string-view" id="url-shorten">/api/url_shorten?link=https://apis.davidcyril.name.ng&apikey=MR_HASHUU_SECRET_123</div>
                            <button class="btn-trigger btn-clipboard" onclick="copyLink('url-shorten')"><i class="fa-solid fa-copy"></i> Copy</button>
                            <button class="btn-trigger btn-execute" onclick="runEndpoint('url-shorten', 'res-shorten', this)"><i class="fa-solid fa-play"></i> Run API</button>
                        </div>
                        <div class="meta-section-header">Live Server Response Output</div>
                        <pre class="terminal-node-view" id="res-shorten">{ "status": "idle", "message": "Click Run API to view live server stream data." }</pre>
                    </div>
                </div>

                <!-- 4. XVIDEOS DOWNLOADER -->
                <div class="api-card" data-name="xvideo xvideos adult downloader download mp4 hot clip video premium">
                    <div class="api-head" onclick="toggleAccordion(this)">
                        <div class="api-identity">
                            <div class="api-icon-container"><i class="fa-solid fa-video"></i></div>
                            <div class="api-meta-strings">
                                <span class="route-path"><span class="method-get-tag">GET</span>/xvideo</span>
                                <span class="route-summary">XVideos Video MP4 Direct CDN Resolver</span>
                            </div>
                        </div>
                        <span class="action-angle"><i class="fa-solid fa-chevron-right"></i></span>
                    </div>
                    <div class="api-body">
                        <div class="meta-section-header">Execution Gateway Endpoint</div>
                        <div class="uri-input-box">
                            <div class="uri-string-view" id="url-xvideo">/xvideo?url=https://www.xvideos.com/video.hppakie6a79/mia_khalifa&apikey=MR_HASHUU_SECRET_123</div>
                            <button class="btn-trigger btn-clipboard" onclick="copyLink('url-xvideo')"><i class="fa-solid fa-copy"></i> Copy</button>
                            <button class="btn-trigger btn-execute" onclick="runEndpoint('url-xvideo', 'res-xvideo', this)"><i class="fa-solid fa-play"></i> Run API</button>
                        </div>
                        <div class="meta-section-header">Live Server Response Output</div>
                        <pre class="terminal-node-view" id="res-xvideo">{ "status": "idle", "message": "Click Run API to view live server stream data." }</pre>
                    </div>
                </div>

                <!-- 5. YOUTUBE MP4 DOWNLOADER -->
                <div class="api-card" data-name="ytmp4 youtube video downloader download mp4 high quality clip video">
                    <div class="api-head" onclick="toggleAccordion(this)">
                        <div class="api-identity">
                            <div class="api-icon-container"><i class="fa-brands fa-youtube"></i></div>
                            <div class="api-meta-strings">
                                <span class="route-path"><span class="method-get-tag">GET</span>/ytmp4</span>
                                <span class="route-summary">YouTube HD Video MP4 High-Speed Extractor</span>
                            </div>
                        </div>
                        <span class="action-angle"><i class="fa-solid fa-chevron-right"></i></span>
                    </div>
                    <div class="api-body">
                        <div class="meta-section-header">Execution Gateway Endpoint</div>
                        <div class="uri-input-box">
                            <div class="uri-string-view" id="url-ytmp4">/ytmp4?url=https://youtube.com/watch?v=MwpMEbgC7DA&apikey=MR_HASHUU_SECRET_123</div>
                            <button class="btn-trigger btn-clipboard" onclick="copyLink('url-ytmp4')"><i class="fa-solid fa-copy"></i> Copy</button>
                            <button class="btn-trigger btn-execute" onclick="runEndpoint('url-ytmp4', 'res-ytmp4', this)"><i class="fa-solid fa-play"></i> Run API</button>
                        </div>
                        <div class="meta-section-header">Live Server Response Output</div>
                        <pre class="terminal-node-view" id="res-ytmp4">{ "status": "idle", "message": "Click Run API to view live server stream data." }</pre>
                    </div>
                </div>

                <!-- 6. MEDIAFIRE PARSER -->
                <div class="api-card" data-name="mediafire downloader direct storage parser">
                    <div class="api-head" onclick="toggleAccordion(this)">
                        <div class="api-identity">
                            <div class="api-icon-container"><i class="fa-solid fa-fire-flame-simple"></i></div>
                            <div class="api-meta-strings">
                                <span class="route-path"><span class="method-get-tag">GET</span>/mediafire</span>
                                <span class="route-summary">Mediafire Direct Link Storage Parser Engine</span>
                            </div>
                        </div>
                        <span class="action-angle"><i class="fa-solid fa-chevron-right"></i></span>
                    </div>
                    <div class="api-body">
                        <div class="meta-section-header">Execution Gateway Endpoint</div>
                        <div class="uri-input-box">
                            <div class="uri-string-view" id="url-mf">/mediafire?url=https://www.mediafire.com/file/n6tgcrktbnov1oy/Queen_Anita-V4.zip/file&apikey=MR_HASHUU_SECRET_123</div>
                            <button class="btn-trigger btn-clipboard" onclick="copyLink('url-mf')"><i class="fa-solid fa-copy"></i> Copy</button>
                            <button class="btn-trigger btn-execute" onclick="runEndpoint('url-mf', 'res-mf', this)"><i class="fa-solid fa-play"></i> Run API</button>
                        </div>
                        <div class="meta-section-header">Live Server Response Output</div>
                        <pre class="terminal-node-view" id="res-mf">{ "status": "idle", "message": "Click Run API to view live server stream data." }</pre>
                    </div>
                </div>

                <!-- 7. SPOTIFY EXTRACTOR -->
                <div class="api-card" data-name="spotify music hq audio downloader song">
                    <div class="api-head" onclick="toggleAccordion(this)">
                        <div class="api-identity">
                            <div class="api-icon-container"><i class="fa-brands fa-spotify"></i></div>
                            <div class="api-meta-strings">
                                <span class="route-path"><span class="method-get-tag">GET</span>/spotify</span>
                                <span class="route-summary">Spotify Premium Lossless Audio Extractor</span>
                            </div>
                        </div>
                        <span class="action-angle"><i class="fa-solid fa-chevron-right"></i></span>
                    </div>
                    <div class="api-body">
                        <div class="meta-section-header">Execution Gateway Endpoint</div>
                        <div class="uri-input-box">
                            <div class="uri-string-view" id="url-sf">/spotify?url=https://open.spotify.com/track/285pBltuF7vW8TeWk8hdRR&apikey=MR_HASHUU_SECRET_123</div>
                            <button class="btn-trigger btn-clipboard" onclick="copyLink('url-sf')"><i class="fa-solid fa-copy"></i> Copy</button>
                            <button class="btn-trigger btn-execute" onclick="runEndpoint('url-sf', 'res-sf', this)"><i class="fa-solid fa-play"></i> Run API</button>
                        </div>
                        <div class="meta-section-header">Live Server Response Output</div>
                        <pre class="terminal-node-view" id="res-sf">{ "status": "idle", "message": "Click Run API to view live server stream data." }</pre>
                    </div>
                </div>

                <!-- 8. TWITTER STREAM CDN -->
                <div class="api-card" data-name="twitter x stream extractor multi video">
                    <div class="api-head" onclick="toggleAccordion(this)">
                        <div class="api-identity">
                            <div class="api-icon-container"><i class="fa-brands fa-x-twitter"></i></div>
                            <div class="api-meta-strings">
                                <span class="route-path"><span class="method-get-tag">GET</span>/twitter</span>
                                <span class="route-summary">Twitter / X Multi-Quality Stream CDN Resolver</span>
                            </div>
                        </div>
                        <span class="action-angle"><i class="fa-solid fa-chevron-right"></i></span>
                    </div>
                    <div class="api-body">
                        <div class="meta-section-header">Execution Gateway Endpoint</div>
                        <div class="uri-input-box">
                            <div class="uri-string-view" id="url-tw">/twitter?url=https://x.com/elonmusk/status/1870901510319833540&apikey=MR_HASHUU_SECRET_123</div>
                            <button class="btn-trigger btn-clipboard" onclick="copyLink('url-tw')"><i class="fa-solid fa-copy"></i> Copy</button>
                            <button class="btn-trigger btn-execute" onclick="runEndpoint('url-tw', 'res-tw', this)"><i class="fa-solid fa-play"></i> Run API</button>
                        </div>
                        <div class="meta-section-header">Live Server Response Output</div>
                        <pre class="terminal-node-view" id="res-tw">{ "status": "idle", "message": "Click Run API to view live server stream data." }</pre>
                    </div>
                </div>

                <!-- 9. YOUTUBE AUDIO SONG -->
                <div class="api-card" data-name="song youtube play mp3 audio music stream">
                    <div class="api-head" onclick="toggleAccordion(this)">
                        <div class="api-identity">
                            <div class="api-icon-container"><i class="fa-solid fa-music"></i></div>
                            <div class="api-meta-strings">
                                <span class="route-path"><span class="method-get-tag">GET</span>/song</span>
                                <span class="route-summary">YouTube High-Fidelity Audio Stream Grabber</span>
                            </div>
                        </div>
                        <span class="action-angle"><i class="fa-solid fa-chevron-right"></i></span>
                    </div>
                    <div class="api-body">
                        <div class="meta-section-header">Execution Gateway Endpoint</div>
                        <div class="uri-input-box">
                            <div class="uri-string-view" id="url-sg">/song?text=faded&apikey=MR_HASHUU_SECRET_123</div>
                            <button class="btn-trigger btn-clipboard" onclick="copyLink('url-sg')"><i class="fa-solid fa-copy"></i> Copy</button>
                            <button class="btn-trigger btn-execute" onclick="runEndpoint('url-sg', 'res-sg', this)"><i class="fa-solid fa-play"></i> Run API</button>
                        </div>
                        <div class="meta-section-header">Live Server Response Output</div>
                        <pre class="terminal-node-view" id="res-sg">{ "status": "idle", "message": "Click Run API to view live server stream data." }</pre>
                    </div>
                </div>

                <!-- 10. TIKTOK NO-WATERMARK -->
                <div class="api-card" data-name="tiktok video downloader no watermark">
                    <div class="api-head" onclick="toggleAccordion(this)">
                        <div class="api-identity">
                            <div class="api-icon-container"><i class="fa-brands fa-tiktok"></i></div>
                            <div class="api-meta-strings">
                                <span class="route-path"><span class="method-get-tag">GET</span>/tiktok</span>
                                <span class="route-summary">TikTok Studio Source No-Watermark Downloader</span>
                            </div>
                        </div>
                        <span class="action-angle"><i class="fa-solid fa-chevron-right"></i></span>
                    </div>
                    <div class="api-body">
                        <div class="meta-section-header">Execution Gateway Endpoint</div>
                        <div class="uri-input-box">
                            <div class="uri-string-view" id="url-tk">/tiktok?url=https://vm.tiktok.com/ZM6789/&apikey=MR_HASHUU_SECRET_123</div>
                            <button class="btn-trigger btn-clipboard" onclick="copyLink('url-tk')"><i class="fa-solid fa-copy"></i> Copy</button>
                            <button class="btn-trigger btn-execute" onclick="runEndpoint('url-tk', 'res-tk', this)"><i class="fa-solid fa-play"></i> Run API</button>
                        </div>
                        <div class="meta-section-header">Live Server Response Output</div>
                        <pre class="terminal-node-view" id="res-tk">{ "status": "idle", "message": "Click Run API to view live server stream data." }</pre>
                    </div>
                </div>

                <!-- 11. PINTEREST MEDIA IMAGE -->
                <div class="api-card" data-name="pinterest image search visual hd download">
                    <div class="api-head" onclick="toggleAccordion(this)">
                        <div class="api-identity">
                            <div class="api-icon-container"><i class="fa-brands fa-pinterest"></i></div>
                            <div class="api-meta-strings">
                                <span class="route-path"><span class="method-get-tag">GET</span>/pinterest</span>
                                <span class="route-summary">Pinterest Ultra-HD Media Image Source Finder</span>
                            </div>
                        </div>
                        <span class="action-angle"><i class="fa-solid fa-chevron-right"></i></span>
                    </div>
                    <div class="api-body">
                        <div class="meta-section-header">Execution Gateway Endpoint</div>
                        <div class="uri-input-box">
                            <div class="uri-string-view" id="url-pin">/pinterest?text=cyberpunk&apikey=MR_HASHUU_SECRET_123</div>
                            <button class="btn-trigger btn-clipboard" onclick="copyLink('url-pin')"><i class="fa-solid fa-copy"></i> Copy</button>
                            <button class="btn-trigger btn-execute" onclick="runEndpoint('url-pin', 'res-pin', this)"><i class="fa-solid fa-play"></i> Run API</button>
                        </div>
                        <div class="meta-section-header">Live Server Response Output</div>
                        <pre class="terminal-node-view" id="res-pin">{ "status": "idle", "message": "Click Run API to view live server stream data." }</pre>
                    </div>
                </div>

                <!-- 12. APK PACKAGE MIRROR -->
                <div class="api-card" data-name="apk android package app mirror tool download">
                    <div class="api-head" onclick="toggleAccordion(this)">
                        <div class="api-identity">
                            <div class="api-icon-container"><i class="fa-solid fa-android"></i></div>
                            <div class="api-meta-strings">
                                <span class="route-path"><span class="method-get-tag">GET</span>/apk</span>
                                <span class="route-summary">Android App Core Binary Package Mirror Fetcher</span>
                            </div>
                        </div>
                        <span class="action-angle"><i class="fa-solid fa-chevron-right"></i></span>
                    </div>
                    <div class="api-body">
                        <div class="meta-section-header">Execution Gateway Endpoint</div>
                        <div class="uri-input-box">
                            <div class="uri-string-view" id="url-apk">/apk?text=whatsapp&apikey=MR_HASHUU_SECRET_123</div>
                            <button class="btn-trigger btn-clipboard" onclick="copyLink('url-apk')"><i class="fa-solid fa-copy"></i> Copy</button>
                            <button class="btn-trigger btn-execute" onclick="runEndpoint('url-apk', 'res-apk', this)"><i class="fa-solid fa-play"></i> Run API</button>
                        </div>
                        <div class="meta-section-header">Live Server Response Output</div>
                        <pre class="terminal-node-view" id="res-apk">{ "status": "idle", "message": "Click Run API to view live server stream data." }</pre>
                    </div>
                </div>

                <!-- 13. FACEBOOK WATCH EXTRACTOR -->
                <div class="api-card" data-name="facebook fb video resolver cdn download">
                    <div class="api-head" onclick="toggleAccordion(this)">
                        <div class="api-identity">
                            <div class="api-icon-container"><i class="fa-brands fa-facebook"></i></div>
                            <div class="api-meta-strings">
                                <span class="route-path"><span class="method-get-tag">GET</span>/facebook</span>
                                <span class="route-summary">Facebook Architecture Video Stream Extractor</span>
                            </div>
                        </div>
                        <span class="action-angle"><i class="fa-solid fa-chevron-right"></i></span>
                    </div>
                    <div class="api-body">
                        <div class="meta-section-header">Execution Gateway Endpoint</div>
                        <div class="uri-input-box">
                            <div class="uri-string-view" id="url-fb">/facebook?url=https://www.facebook.com/watch/?v=123&apikey=MR_HASHUU_SECRET_123</div>
                            <button class="btn-trigger btn-clipboard" onclick="copyLink('url-fb')"><i class="fa-solid fa-copy"></i> Copy</button>
                            <button class="btn-trigger btn-execute" onclick="runEndpoint('url-fb', 'res-fb', this)"><i class="fa-solid fa-play"></i> Run API</button>
                        </div>
                        <div class="meta-section-header">Live Server Response Output</div>
                        <pre class="terminal-node-view" id="res-fb">{ "status": "idle", "message": "Click Run API to view live server stream data." }</pre>
                    </div>
                </div>

                <!-- 14. STATIC WEBPAGE CLONER -->
                <div class="api-card" data-name="webdl website clone html static site page download">
                    <div class="api-head" onclick="toggleAccordion(this)">
                        <div class="api-identity">
                            <div class="api-icon-container"><i class="fa-solid fa-globe"></i></div>
                            <div class="api-meta-strings">
                                <span class="route-path"><span class="method-get-tag">GET</span>/webdl</span>
                                <span class="route-summary">Static Production Webpage Structural Pack Cloner</span>
                            </div>
                        </div>
                        <span class="action-angle"><i class="fa-solid fa-chevron-right"></i></span>
                    </div>
                    <div class="api-body">
                        <div class="meta-section-header">Execution Gateway Endpoint</div>
                        <div class="uri-input-box">
                            <div class="uri-string-view" id="url-wdl">/webdl?url=https://example.com&apikey=MR_HASHUU_SECRET_123</div>
                            <button class="btn-trigger btn-clipboard" onclick="copyLink('url-wdl')"><i class="fa-solid fa-copy"></i> Copy</button>
                            <button class="btn-trigger btn-execute" onclick="runEndpoint('url-wdl', 'res-wdl', this)"><i class="fa-solid fa-play"></i> Run API</button>
                        </div>
                        <div class="meta-section-header">Live Server Response Output</div>
                        <pre class="terminal-node-view" id="res-wdl">{ "status": "idle", "message": "Click Run API to view live server stream data." }</pre>
                    </div>
                </div>

                <!-- 15. JS ANTI-SCRAPE OBFUSCATOR -->
                <div class="api-card" data-name="obfuscate javascript security protection code hide encrypt">
                    <div class="api-head" onclick="toggleAccordion(this)">
                        <div class="api-identity">
                            <div class="api-icon-container"><i class="fa-solid fa-user-shield"></i></div>
                            <div class="api-meta-strings">
                                <span class="route-path"><span class="method-get-tag">GET</span>/obfuscate</span>
                                <span class="route-summary">Dynamic Structural JavaScript Anti-Scrape Guardian</span>
                            </div>
                        </div>
                        <span class="action-angle"><i class="fa-solid fa-chevron-right"></i></span>
                    </div>
                    <div class="api-body">
                        <div class="meta-section-header">Execution Gateway Endpoint</div>
                        <div class="uri-input-box">
                            <div class="uri-string-view" id="url-obf">/obfuscate?code=console.log('hashu')&apikey=MR_HASHUU_SECRET_123</div>
                            <button class="btn-trigger btn-clipboard" onclick="copyLink('url-obf')"><i class="fa-solid fa-copy"></i> Copy</button>
                            <button class="btn-trigger btn-execute" onclick="runEndpoint('url-obf', 'res-obf', this)"><i class="fa-solid fa-play"></i> Run API</button>
                        </div>
                        <div class="meta-section-header">Live Server Response Output</div>
                        <pre class="terminal-node-view" id="res-obf">{ "status": "idle", "message": "Click Run API to view live server stream data." }</pre>
                    </div>
                </div>

                <!-- 16. IMGBB IMAGE CLOUD POST -->
                <div class="api-card" data-name="imgbb photo cloud cdn image host upload post">
                    <div class="api-head" onclick="toggleAccordion(this)">
                        <div class="api-identity">
                            <div class="api-icon-container"><i class="fa-solid fa-cloud-arrow-up"></i></div>
                            <div class="api-meta-strings">
                                <span class="route-path"><span class="method-post-tag">POST</span>/imgbb</span>
                                <span class="route-summary">Multipart Binary Object Cloud Image CDN Interface</span>
                            </div>
                        </div>
                        <span class="action-angle"><i class="fa-solid fa-chevron-right"></i></span>
                    </div>
                    <div class="api-body">
                        <div class="meta-section-header">HTTP METHOD COMPONENT</div>
                        <div class="uri-string-view" style="color:var(--brand-purple)">POST DIRECT ACCESS (Multipart Form-Data)</div>
                        <div class="meta-section-header">Live Server Response Output</div>
                        <pre class="terminal-node-view">{ "info": "Requires file attachment. Real-time REST testing disabled in UI dashboard console." }</pre>
                    </div>
                </div>

                <div id="no-results">// SEARCH ATTRIBUTE MISMATCHED //</div>
            </div>

            <footer>
                <span>© 2026 MR HASHUU API WORKSPACE</span>
                <a href="#" class="req-key-anchor">REQUEST CORE ACCESS KEYS</a>
            </footer>
        </div>

        <script>
            function toggleAccordion(element) {
                const parent = element.parentElement;
                const bodySection = parent.querySelector('.api-body');
                const isOpen = parent.classList.contains('active');

                const allCards = document.getElementsByClassName('api-card');
                for (let card of allCards) {
                    card.classList.remove('active');
                    card.querySelector('.api-body').style.display = 'none';
                }

                if (!isOpen) {
                    parent.classList.add('active');
                    bodySection.style.display = 'block';
                }
            }

            function filterEndpoints() {
                const query = document.getElementById('apiSearch').value.toLowerCase().trim();
                const cards = document.getElementsByClassName('api-card');
                const noResults = document.getElementById('no-results');
                let found = false;

                for (let i = 0; i < cards.length; i++) {
                    const dataTags = cards[i].getAttribute('data-name');
                    if (dataTags.includes(query)) {
                        cards[i].style.display = 'block';
                        found = true;
                    } else {
                        cards[i].style.display = 'none';
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
                    console.error('Fallback copy engine error', err);
                }
                document.body.removeChild(textArea);
            }

            function triggerToast() {
                const toast = document.getElementById('floating-toast');
                toast.classList.add('visible');
                setTimeout(() => toast.classList.remove('visible'), 2000);
            }

            async function runEndpoint(urlElementId, responseContainerId, buttonElement) {
                const pathText = document.getElementById(urlElementId).textContent.trim();
                const absoluteTargetUrl = window.location.origin + pathText;
                const outputConsole = document.getElementById(responseContainerId);

                buttonElement.innerHTML = "<i class='fa-solid fa-spinner fa-spin'></i> RUNNING...";
                buttonElement.disabled = true;
                outputConsole.textContent = "// TRANSMITTING SECURE SIGNAL TO HOST... //";
                outputConsole.style.color = "var(--brand-cyan)";

                try {
                    const webStreamResponse = await fetch(absoluteTargetUrl);
                    const systemJsonPayload = await webStreamResponse.json();
                    
                    outputConsole.textContent = JSON.stringify(systemJsonPayload, null, 2);
                    outputConsole.style.color = "var(--brand-green)";
                } catch (serverException) {
                    outputConsole.textContent = JSON.stringify({
                        success: false,
                        error: "Network stream deployment interrupted",
                        exception_log: serverException.message
                    }, null, 2);
                    outputConsole.style.color = "var(--brand-red)";
                } finally {
                    buttonElement.innerHTML = "<i class='fa-solid fa-play'></i> Run API";
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

// 🎬 NEW OMDb MOVIE CONTROLLER
app.get('/api/movie', strictAuthGate, async (req, res) => {
    try {
        const { text } = req.query;
        if (!text) return res.json({ success: false, message: "Movie title parameter (?text=) missing!" });

        const movieUrl = `http://www.omdbapi.com/?t=${encodeURIComponent(text)}&apikey=2634bb02`;
        const { data } = await axios.get(movieUrl);

        if (data.Response === "True") {
            res.json({
                creator: "MR HASHUU",
                status: "Authenticated",
                success: true,
                result: data
            });
        } else {
            res.json({ success: false, message: data.Error || "Movie not found!" });
        }
    } catch (e) {
        res.json({ success: false, message: e.message });
    }
});

// 0. CHATGPT-4o SMART INTERFACE
app.get('/api/chat', strictAuthGate, async (req, res) => {
    try {
        const { prompt } = req.query;
        if (!prompt) return res.json({ success: false, message: "Prompt parameter missing!" });

        const cleanPrompt = prompt.toLowerCase().trim();

        if (cleanPrompt === 'hi') {
            return res.json({ creator: "MR HASHUU", status: "Authenticated", success: true, result: "Hellow Im Hashuu Ai Service" });
        }
        if (cleanPrompt === 'kawad bn') {
            return res.json({ creator: "MR HASHUU", status: "Authenticated", success: true, result: "huththak kwa" });
        }

        const customSystemPrompt = "You are Hashan-md AI, a brilliant, helpful AI assistant developed and owned by MR HASHUU. Always respond in an intelligent and smart manner.";
        const targetUrl = `https://apis.davidcyriltech.my.id/ai/chatgpt?prompt=${encodeURIComponent(prompt)}&model=gpt-4o&system=${encodeURIComponent(customSystemPrompt)}`;
        
        const { data } = await axios.get(targetUrl);
        const aiReply = data?.data?.choices?.[0]?.message?.content || "AI Server experienced a temporary structural break. Retry.";

        res.json({ creator: "MR HASHUU", status: "Authenticated", success: true, result: aiReply });
    } catch (e) { res.json({ success: false, message: e.message }); }
});

// 1. CUTTLY URL SHORTENER
app.get('/api/url_shorten', strictAuthGate, async (req, res) => {
    try {
        const { link } = req.query;
        if (!link) return res.json({ success: false, message: "Link parameter missing!" });
        const { data } = await axios.get(`https://apis.davidcyriltech.my.id/cuttly?link=${encodeURIComponent(link)}`);
        if (data.success) {
            res.json({ creator: "MR HASHUU", status: "Authenticated", success: true, original_url: data.original_url, shortened_url: data.shortened_url });
        } else { res.json({ success: false, message: "URL shortening failed." }); }
    } catch (e) { res.json({ success: false, message: e.message }); }
});

// 2. XVIDEOS DOWNLOADER
app.get('/xvideo', strictAuthGate, async (req, res) => {
    try {
        const { url } = req.query;
        if (!url) return res.json({ success: false, message: "XVideo URL required!" });
        const { data } = await axios.get(`https://apis.davidcyriltech.my.id/xvideo?url=${encodeURIComponent(url)}`);
        if (data.success) {
            res.json({ creator: "MR HASHUU", status: "Authenticated", success: true, title: data.title, thumbnail: data.thumbnail, download_url: data.download_url });
        } else { res.json({ success: false, message: "Conversion failed." }); }
    } catch (e) { res.json({ success: false, message: e.message }); }
});

// 3. YOUTUBE MP4 DOWNLOADER
app.get('/ytmp4', strictAuthGate, async (req, res) => {
    try {
        const { url } = req.query;
        if (!url) return res.json({ success: false, message: "YouTube URL required!" });
        const { data } = await axios.get(`https://apis.davidcyriltech.my.id/download/ytmp4?url=${encodeURIComponent(url)}`);
        if (data.success && data.result) {
            res.json({ creator: "MR HASHUU", status: "Authenticated", success: true, result: data.result });
        } else { res.json({ success: false, message: "Media conversion failed." }); }
    } catch (e) { res.json({ success: false, message: e.message }); }
});

// 4. MEDIAFIRE PARSER
app.get('/mediafire', strictAuthGate, async (req, res) => {
    try {
        const { url } = req.query;
        if (!url) return res.json({ success: false, message: "Mediafire URL required!" });
        const { data } = await axios.get(`https://apis.davidcyriltech.my.id/mediafire?url=${encodeURIComponent(url)}`);
        res.json({ creator: "MR HASHUU", status: "Authenticated", success: true, result: data });
    } catch (e) { res.json({ success: false, message: e.message }); }
});

// 5. SPOTIFY EXTRACTOR
app.get('/spotify', strictAuthGate, async (req, res) => {
    try {
        const { url } = req.query;
        if (!url) return res.json({ success: false, message: "Spotify URL required!" });
        const { data } = await axios.get(`https://apis.davidcyriltech.my.id/spotifydl?url=${encodeURIComponent(url)}`);
        res.json({ creator: "MR HASHUU", status: "Authenticated", success: true, result: data });
    } catch (e) { res.json({ success: false, message: e.message }); }
});

// 6. TWITTER STREAM CDN
app.get('/twitter', strictAuthGate, async (req, res) => {
    try {
        const { url } = req.query;
        if (!url) return res.json({ success: false, message: "Twitter URL required!" });
        const { data } = await axios.get(`https://apis.davidcyriltech.my.id/twitterV2?url=${encodeURIComponent(url)}`);
        res.json({ creator: "MR HASHUU", status: "Authenticated", success: true, result: data });
    } catch (e) { res.json({ success: false, message: e.message }); }
});

// 7. YOUTUBE AUDIO SONG
app.get('/song', strictAuthGate, async (req, res) => {
    try {
        const { text } = req.query;
        if (!text) return res.json({ success: false, message: "Song name required" });
        const { data } = await axios.get(`https://apis.davidcyriltech.my.id/play?query=${encodeURIComponent(text)}`);
        if (data.status && data.result) {
            res.json({ creator: "MR HASHUU", status: "Authenticated", success: true, result: data.result });
        } else { res.json({ success: false, message: "Failed to fetch song." }); }
    } catch (e) { res.json({ success: false, message: e.message }); }
});

// 8. TIKTOK NO-WATERMARK
app.get('/tiktok', strictAuthGate, async (req, res) => {
    try {
        const { url } = req.query;
        if (!url) return res.json({ success: false, message: "TikTok URL required!" });
        const { data } = await axios.get(`https://apis.davidcyriltech.my.id/download/tiktok?url=${encodeURIComponent(url)}`);
        if (data.success && data.result) {
            res.json({ creator: "MR HASHUU", status: "Authenticated", success: true, result: data.result });
        } else { res.json({ success: false, message: "Invalid TikTok URL." }); }
    } catch (e) { res.json({ success: false, message: e.message }); }
});

// 9. PINTEREST MEDIA IMAGE
app.get('/pinterest', strictAuthGate, async (req, res) => {
    try {
        const { text } = req.query;
        if (!text) return res.json({ success: false, message: "Query text required" });
        const { data } = await axios.get(`https://apis.davidcyriltech.my.id/search/pinterest?text=${encodeURIComponent(text)}`);
        res.json({ creator: "MR HASHUU", status: "Authenticated", success: true, result: data.result || [] });
    } catch (e) { res.json({ success: false, message: e.message }); }
});

// 10. APK PACKAGE MIRROR
app.get('/apk', strictAuthGate, async (req, res) => {
    try {
        const { text } = req.query;
        if (!text) return res.json({ success: false, message: "App name required" });
        const { data } = await axios.get(`https://apis.davidcyriltech.my.id/download/apk?text=${encodeURIComponent(text)}`, { headers: { 'User-Agent': 'Mozilla/5.0' }, timeout: 8000 });
        res.json({ creator: "MR HASHUU", status: "Authenticated", success: true, result: data.apk || {} });
    } catch (e) { res.json({ success: false, message: e.message }); }
});

// 11. FACEBOOK WATCH EXTRACTOR
app.get('/facebook', strictAuthGate, async (req, res) => {
    try {
        const { url } = req.query;
        if (!url) return res.json({ success: false, message: "URL parameter missing!" });
        const { data } = await axios.get(`https://apis.davidcyriltech.my.id/facebook2?url=${encodeURIComponent(url)}`);
        if (data.status) {
            res.json({ creator: "MR HASHUU", status: "Authenticated", success: true, result: data.video });
        } else { res.json({ success: false, message: "Could not fetch video." }); }
    } catch (e) { res.json({ success: false, message: e.message }); }
});

// 12. STATIC WEBPAGE CLONER
app.get('/webdl', strictAuthGate, async (req, res) => {
    try {
        const { url } = req.query;
        if (!url) return res.json({ success: false, message: "Website URL required!" });
        const { data } = await axios.get(`https://apis.davidcyriltech.my.id/tools/downloadweb?url=${encodeURIComponent(url)}`);
        if (data.response && (data.response.success === true || data.response.success === "true")) {
            res.json({ creator: "MR HASHUU", status: "Authenticated", success: true, result: { downloadUrl: data.response.downloadUrl, isFinished: data.response.isFinished } });
        } else { res.json({ success: false, message: "Failed to clone website." }); }
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
        if (data.success) { res.json({ creator: "MR HASHUU", status: "Authenticated", success: true, result: data.data }); }
        else { res.json({ success: false, message: "Upload failed." }); }
    } catch (e) { res.json({ success: false, message: e.message }); }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Apple Matrix HASHU-API Engine Running on port ${PORT}`));

module.exports = app;
