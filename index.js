/**
 * ───────────────────────────────────────────────────────────────────────────────
 * 🚀 MR HASHUU API INTERACTIVE CENTRAL CONTROL MAINNET
 * ───────────────────────────────────────────────────────────────────────────────
 * Architecture  : Vercel / Apple Luxury Black Fluid Grid
 * Optimized For : Ultra High Performance & Dynamic Web Query Injection
 * No Emojis     : Pure Production Grade Vector Graphics (Inline SVG Embedded)
 * ───────────────────────────────────────────────────────────────────────────────
 */

const express = require('express');
const axios = require('axios');
const rateLimit = require('express-rate-limit');
const obfuscator = require('javascript-obfuscator');
const cors = require('cors');
const multer = require('multer');
const FormData = require('form-data');

const app = express();
const upload = multer();

// Global HTTP Core Middleware Protocols
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ─────────────────────────────────────────────────────────
// 🔑 SECURE AUTHORIZED API PRODUCTION CREDENTIALS
// ─────────────────────────────────────────────────────────
const PREMIUM_DATABASE = {
    "HASHUU_PRO_KING_99": { owner: "Kasun", plan: "PREMIUM", classification: "GOD_MODE" },
    "MR_HASHUU_SECRET_123": { owner: "MR HASHUU", plan: "PRO", classification: "DEVELOPER" },
    "VIP_DEV_KEY_777": { owner: "Nimal", plan: "PREMIUM", classification: "VIP_ACCESS" }
};

// ─────────────────────────────────────────────────────────
// 📊 METRICS & TRAFFIC TELEMETRY SYSTEM ARCHITECTURE
// ─────────────────────────────────────────────────────────
const usageStats = {};
const SERVER_START_TIME = Date.now();

function trackUsage(apikey) {
    const today = new Date().toISOString().split('T')[0];
    if (!usageStats[apikey]) usageStats[apikey] = {};
    if (!usageStats[apikey][today]) usageStats[apikey][today] = 0;
    usageStats[apikey][today]++;
}

function getTodayUsage(apikey) {
    const today = new Date().toISOString().split('T')[0];
    return (usageStats[apikey] && usageStats[apikey][today]) || 0;
}

function getTotalUsage(apikey) {
    if (!usageStats[apikey]) return 0;
    return Object.values(usageStats[apikey]).reduce((a, b) => a + b, 0);
}

// Global Firewall Limit Configuration 
const premiumLimiter = rateLimit({
    windowMs: 24 * 60 * 60 * 1000,
    max: 5000, 
    message: { 
        success: false, 
        creator: "MR HASHUU",
        status: 429,
        error_packet: "DAILY_LIMIT_EXCEEDED"
    }
});

// Dynamic Middleware Authentication Gate
const strictAuthGate = (req, res, next) => {
    const { apikey } = req.query;
    
    if (!apikey) {
        return res.status(401).json({
            success: false,
            creator: "MR HASHUU",
            status: "ACCESS_DENIED",
            message: "Authentication Token Missing. Append '?apikey=YOUR_KEY' to the routing path."
        });
    }
    
    if (!PREMIUM_DATABASE[apikey]) {
        return res.status(403).json({
            success: false,
            creator: "MR HASHUU",
            status: "INVALID_CREDENTIALS",
            message: "Unauthorized Signature. Request an active authorization token from MR HASHUU."
        });
    }
    
    req.planOwner = PREMIUM_DATABASE[apikey].owner;
    req.planType = PREMIUM_DATABASE[apikey].plan;
    req.apikey = apikey;
    
    trackUsage(apikey);
    return premiumLimiter(req, res, next);
};

// Internal Node Monitoring Statistics API Endpoint
app.get('/api/stats', (req, res) => {
    try {
        const { apikey } = req.query;
        const uptimeMs = Date.now() - SERVER_START_TIME;
        
        const hours = Math.floor(uptimeMs / 3600000);
        const minutes = Math.floor((uptimeMs % 3600000) / 60000);
        const seconds = Math.floor((uptimeMs % 60000) / 1000);
        const totalSystemTraffic = Object.keys(usageStats).reduce((sum, k) => sum + getTotalUsage(k), 0);

        if (apikey && PREMIUM_DATABASE[apikey]) {
            const nodeMeta = PREMIUM_DATABASE[apikey];
            const maxThreshold = nodeMeta.plan === 'PREMIUM' ? 5000 : 3000;
            const currentHits = getTodayUsage(apikey);

            return res.status(200).json({
                success: true,
                key_info: {
                    owner: nodeMeta.owner,
                    plan: nodeMeta.plan,
                    daily_limit: maxThreshold,
                    today_usage: currentHits,
                    remaining: Math.max(0, maxThreshold - currentHits),
                    usage_ratio: Math.min(100, Math.round((currentHits / maxThreshold) * 100)),
                    all_time_hits: getTotalUsage(apikey)
                },
                server: {
                    uptime: `${hours}h ${minutes}m ${seconds}s`,
                    global_traffic_load: totalSystemTraffic,
                    status: "OPERATIONAL"
                }
            });
        }

        return res.status(200).json({
            success: true,
            server: {
                uptime: `${hours}h ${minutes}m ${seconds}s`,
                global_traffic_load: totalSystemTraffic,
                status: "OPERATIONAL"
            }
        });
    } catch (err) {
        res.status(500).json({ success: false, error: "METRICS_CRASH", details: err.message });
    }
});

// ─────────────────────────────────────────────────────────
// 🌌 LUXURY BLACK APP INTUITIVE FRONTEND (ANTI-CRASH RAW STREAM)
// ─────────────────────────────────────────────────────────
app.get('/', (req, res) => {
    const rawHtmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <title>MR HASHUU - PRODUCTION MAINNET CONTROL</title>
    <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;700&family=JetBrains+Mono:wght@500;700&display=swap" rel="stylesheet">
    <style>
        :root {
            --dark-canvas: #030105;
            --surface-card: rgba(14, 9, 22, 0.75);
            --surface-border: rgba(255, 255, 255, 0.06);
            --accent-cyan: #00F5FF;
            --accent-purple: #8A2BE2;
            --neon-green: #00FF87;
            --neon-red: #FF3366;
            --text-high: #F5F2FA;
            --text-low: #8F8599;
        }

        * { box-sizing: border-box; margin: 0; padding: 0; font-family: 'Space Grotesk', sans-serif; letter-spacing: -0.01em; -webkit-font-smoothing: antialiased; }
        body, html { background-color: var(--dark-canvas); color: var(--text-high); width: 100%; min-height: 100vh; overflow-x: hidden; }

        /* SECURITY GATE ACCESS CONTROL WALL */
        #gate-curtain {
            position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
            background: radial-gradient(circle at center, #110724 0%, var(--dark-canvas) 100%);
            display: flex; justify-content: center; align-items: center; z-index: 99999; padding: 20px;
            transition: transform 0.8s cubic-bezier(0.77, 0, 0.175, 1), opacity 0.6s linear;
        }
        .gate-viewport {
            background: var(--surface-card); border: 1px solid rgba(138, 43, 226, 0.3);
            backdrop-filter: blur(40px); -webkit-backdrop-filter: blur(40px);
            padding: 40px 30px; border-radius: 24px; width: 100%; max-width: 420px; text-align: center;
            box-shadow: 0 30px 70px rgba(0,0,0,0.8), 0 0 50px rgba(138, 43, 226, 0.15);
            animation: floatGate 6s ease-in-out infinite;
        }
        @keyframes floatGate { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
        .gate-viewport.shake-alert { animation: bounceError 0.4s double ease-in-out; border-color: var(--neon-red); }
        @keyframes bounceError { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(-12px); } 75% { transform: translateX(12px); } }
        
        .vector-logo-box { width: 70px; height: 70px; background: rgba(0, 245, 255, 0.04); border: 1px dashed var(--accent-cyan); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 24px; position: relative; }
        .vector-logo-box::after { content: ''; position: absolute; width: 100%; height: 100%; border-radius: 50%; border: 1px solid transparent; border-top-color: var(--accent-cyan); animation: rotateRing 3s linear infinite; }
        @keyframes rotateRing { to { transform: rotate(360deg); } }
        .vector-svg { width: 28px; height: 28px; fill: var(--accent-cyan); filter: drop-shadow(0 0 8px var(--accent-cyan)); }
        
        .gate-header-text { font-size: 22px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 6px; background: linear-gradient(135deg, #FFF 30%, var(--text-low) 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        .gate-tagline { font-size: 11px; color: var(--text-low); text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 30px; }
        
        .input-lock-field {
            width: 100%; background: rgba(0, 0, 0, 0.4); border: 1px solid var(--surface-border);
            padding: 16px; border-radius: 14px; color: var(--accent-cyan); font-family: 'JetBrains Mono', monospace;
            font-size: 15px; text-align: center; outline: none; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .input-lock-field:focus { border-color: var(--accent-cyan); background: #000; box-shadow: 0 0 20px rgba(0,245,255,0.12); }
        
        .gate-submit-trigger {
            width: 100%; background: linear-gradient(135deg, var(--accent-purple) 0%, #A040FF 100%);
            border: none; padding: 16px; border-radius: 14px; color: #FFF; font-size: 14px; font-weight: 700;
            text-transform: uppercase; cursor: pointer; letter-spacing: 0.05em; margin-top: 20px;
            transition: all 0.3s; box-shadow: 0 8px 24px rgba(138, 43, 226, 0.3);
        }
        .gate-submit-trigger:hover { transform: translateY(-2px); box-shadow: 0 12px 30px rgba(138, 43, 226, 0.5); }

        /* CONSOLE APPLICATION WORKSPACE AREA */
        #panel-engine-workspace { display: none; flex-direction: column; min-height: 100vh; padding-bottom: 100px; opacity: 0; transition: opacity 0.5s ease-in; }
        
        .app-navbar-hull {
            background: rgba(14, 9, 22, 0.8); backdrop-filter: blur(25px); -webkit-backdrop-filter: blur(25px);
            border-bottom: 1px solid var(--surface-border); padding: 20px 24px;
            display: flex; justify-content: space-between; align-items: center; position: sticky; top: 0; z-index: 1000;
        }
        .brand-vector-node { display: flex; align-items: center; gap: 10px; font-size: 18px; font-weight: 700; text-transform: uppercase; color: #FFF; }
        .brand-vector-node svg { width: 22px; height: 22px; fill: var(--accent-purple); filter: drop-shadow(0 0 6px var(--accent-purple)); }
        .brand-vector-node span span { color: var(--accent-cyan); }

        .system-liquid-grid { max-width: 800px; width: 100%; margin: 0 auto; padding: 20px; display: flex; flex-direction: column; gap: 20px; }

        /* REALTIME COMPONENT PERFORMANCE CARD */
        .live-performance-board { background: linear-gradient(145deg, #0E071A 0%, #150C26 100%); border: 1px solid var(--surface-border); border-radius: 20px; padding: 20px; box-shadow: 0 10px 30px rgba(0,0,0,0.5); }
        .telemetry-layout { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
        .telemetry-unit { background: rgba(0,0,0,0.3); padding: 16px; border-radius: 14px; border: 1px solid rgba(255,255,255,0.02); }
        .telemetry-label { font-size: 10px; color: var(--text-low); text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 4px; }
        .telemetry-value { font-size: 18px; color: #FFF; font-weight: 700; }
        
        .quota-bar-shell { width: 100%; height: 6px; background: rgba(255,255,255,0.04); border-radius: 3px; margin-top: 10px; overflow: hidden; }
        .quota-bar-fill { height: 100%; width: 0%; background: linear-gradient(90deg, var(--accent-purple), var(--accent-cyan)); border-radius: 3px; transition: width 1s cubic-bezier(0.4, 0, 0.2, 1); }

        /* INTERACTIVE ROUTE GRID CLUSTER ARCHITECTURE */
        .cluster-section-indicator { font-size: 12px; color: var(--text-low); text-transform: uppercase; letter-spacing: 0.08em; margin-top: 10px; display: flex; align-items: center; gap: 6px; }
        .cluster-section-indicator svg { width: 14px; height: 14px; fill: currentColor; }
        
        .pipeline-stack { display: flex; flex-direction: column; gap: 12px; }
        .pipeline-element-box { background: var(--surface-card); border: 1px solid var(--surface-border); border-radius: 16px; overflow: hidden; transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1); }
        .pipeline-element-box:hover { border-color: rgba(0, 245, 255, 0.3); transform: translateY(-2px); box-shadow: 0 8px 20px rgba(0,0,0,0.4); }
        
        .pipeline-interaction-row { padding: 18px; display: flex; justify-content: space-between; align-items: center; cursor: pointer; user-select: none; }
        .pipeline-meta-wrapper { display: flex; flex-direction: column; gap: 4px; padding-right: 12px; }
        .tag-routing-path { font-family: 'JetBrains Mono', monospace; font-size: 14px; color: var(--accent-cyan); word-break: break-all; }
        .tag-routing-desc { font-size: 11px; color: var(--text-low); text-transform: uppercase; letter-spacing: 0.02em; }
        
        .arrow-dispatch-vector { width: 16px; height: 16px; fill: var(--text-low); transition: transform 0.3s cubic-bezier(0.25, 1, 0.5, 1); flex-shrink: 0; }
        
        /* EXPANDED PIPELINE INTERACTIVE CONTROLS */
        .pipeline-element-box.expanded-state { border-color: var(--accent-purple); background: rgba(18, 11, 28, 0.9); }
        .pipeline-element-box.expanded-state .arrow-dispatch-vector { transform: rotate(90deg); fill: var(--accent-cyan); filter: drop-shadow(0 0 4px var(--accent-cyan)); }
        
        .pipeline-dropdown-payload { display: none; padding: 20px; background: rgba(0, 0, 0, 0.3); border-top: 1px solid rgba(138, 43, 226, 0.2); animation: revealSlide 0.35s cubic-bezier(0.25, 1, 0.5, 1); }
        @keyframes revealSlide { from { opacity: 0; transform: translateY(-8px); } to { opacity: 1; transform: translateY(0); } }

        .param-group-box { display: flex; flex-direction: column; gap: 6px; margin-bottom: 14px; }
        .param-interactive-input {
            width: 100%; padding: 12px 14px; background: rgba(5, 2, 10, 0.6); border: 1px solid rgba(255, 255, 255, 0.08);
            border-radius: 10px; color: #FFF; font-family: 'JetBrains Mono', monospace; font-size: 13px; outline: none; transition: border-color 0.2s;
        }
        .param-interactive-input:focus { border-color: var(--accent-cyan); background: #000; }

        .live-url-map-preview {
            background: #020104; padding: 12px 14px; border-radius: 10px; font-family: 'JetBrains Mono', monospace;
            font-size: 11px; color: var(--accent-cyan); overflow-x: auto; white-space: nowrap; margin-bottom: 16px;
            border: 1px solid rgba(138, 43, 226, 0.1);
        }
        
        .execution-row-triggers { display: flex; gap: 8px; }
        .action-btn-node { padding: 12px 16px; border: none; border-radius: 10px; font-size: 11px; font-weight: 700; cursor: pointer; text-transform: uppercase; letter-spacing: 0.04em; transition: all 0.2s; display: flex; align-items: center; justify-content: center; gap: 6px; }
        .action-btn-node svg { width: 12px; height: 12px; fill: currentColor; }
        .btn-secondary-dim { background: rgba(255, 255, 255, 0.03); color: var(--text-high); border: 1px solid rgba(255, 255, 255, 0.06); }
        .btn-secondary-dim:hover { background: rgba(255, 255, 255, 0.08); border-color: var(--text-low); }
        .btn-primary-glow { background: linear-gradient(135deg, var(--accent-purple) 0%, #943CE6 100%); color: #FFF; flex-grow: 1; box-shadow: 0 4px 12px rgba(138, 43, 226, 0.2); }
        .btn-primary-glow:hover { opacity: 0.95; transform: translateY(-1px); box-shadow: 0 6px 16px rgba(138, 43, 226, 0.4); }

        /* SYSTEM TERMINAL LIVE GRAPH MONITOR */
        .live-terminal-stream {
            background: #020005; border: 1px solid rgba(138, 43, 226, 0.2); border-radius: 10px;
            padding: 14px; font-family: 'JetBrains Mono', monospace; font-size: 11px; color: var(--text-low);
            white-space: pre-wrap; overflow-x: auto; max-height: 250px; margin-top: 14px; display: none;
            box-shadow: inset 0 2px 10px rgba(0,0,0,0.8); line-height: 1.5;
        }

        /* RESPONSE SECURE NAVIGATION BAR COUPLING MOBILE VIEW DOCK */
        .mobile-hardware-dock {
            position: fixed; bottom: 0; left: 0; width: 100vw; height: 68px;
            background: rgba(11, 6, 18, 0.92); backdrop-filter: blur(30px); -webkit-backdrop-filter: blur(30px);
            border-top: 1px solid var(--surface-border); z-index: 9999;
            display: flex; justify-content: space-around; align-items: center; padding: 0 20px;
            box-shadow: 0 -8px 30px rgba(0,0,0,0.6);
        }
        .dock-navigation-element { display: flex; flex-direction: column; align-items: center; gap: 4px; color: var(--text-low); cursor: pointer; font-size: 9px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; width: 75px; transition: color 0.2s; user-select: none; }
        .dock-navigation-element svg { width: 18px; height: 18px; fill: currentColor; transition: transform 0.2s; }
        .dock-navigation-element:hover { color: #FFF; }
        .dock-navigation-element.active-dock-node { color: var(--accent-cyan); }
        .dock-navigation-element.active-dock-node svg { transform: translateY(-2px); filter: drop-shadow(0 0 6px var(--accent-cyan)); }

        @media(max-width: 768px) {
            .telemetry-layout { grid-template-columns: 1fr; gap: 12px; }
            .system-liquid-grid { padding: 14px; gap: 14px; }
            .live-performance-board { padding: 16px; border-radius: 16px; }
            .pipeline-interaction-row { padding: 15px; }
            .pipeline-dropdown-payload { padding: 16px; }
        }
    </style>
</head>
<body>

    <div id="gate-curtain">
        <div class="gate-viewport" id="curtain-card-frame">
            <div class="vector-logo-box">
                <svg class="vector-svg" viewBox="0 0 24 24"><path d="M12,1A5,5,0,0,0,7,6v4H6a3,3,0,0,0,-3,3v7a3,3,0,0,0,3,3h12a3,3,0,0,0,3,-3V13a3,3,0,0,0,-3,-3H17V6A5,5,0,0,0,12,1Zm3,9H9V6a3,3,0,0,1,6,0Z"/></svg>
            </div>
            <div class="gate-header-text">AUTHENTICATION MATRIX</div>
            <div class="gate-tagline">SECURE SYSTEM DEPLOYMENT PROTOCOL</div>
            <input type="password" id="gate-pass-token" class="input-lock-field" placeholder="ENTER MASTER SECURITY KEY">
            <button class="gate-submit-trigger" onclick="triggerGatewayHandshake()">INITIALIZE SYSTEM CORE</button>
        </div>
    </div>

    <div id="panel-engine-workspace">
        <nav class="app-navbar-hull">
            <div class="brand-vector-node">
                <svg viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
                <span>MR HASHUU <span>PRO_MAINNET</span></span>
            </div>
        </nav>

        <div class="system-liquid-grid">
            <div class="live-performance-board">
                <div class="telemetry-layout">
                    <div class="telemetry-unit">
                        <div class="telemetry-label">CORE INFRASTRUCTURE UPTIME</div>
                        <div class="telemetry-value" id="runtime-uptime-display">CALCULATING NETWORK TICK...</div>
                    </div>
                    <div class="telemetry-unit">
                        <div class="telemetry-label">BANDWIDTH THROTTLING METRIC</div>
                        <div class="telemetry-value" id="runtime-quota-display">0 / 0 TRANSMITS</div>
                        <div class="quota-bar-shell"><div class="quota-bar-fill" id="runtime-progress-node"></div></div>
                    </div>
                </div>
            </div>

            <div class="cluster-section-indicator">
                <svg viewBox="0 0 24 24"><path d="M4 15h16v-2H4v2zm0 4h16v-2H4v2zm0-8h16V9H4v2zm0-6v2h16V5H4z"/></svg>
                PREMIUM RESTRUCTURING GATEWAY ROUTINGS
            </div>

            <div class="pipeline-stack" id="pipeline-dom-injection-target"></div>
        </div>

        <div class="mobile-hardware-dock">
            <div class="dock-navigation-element active-dock-node" onclick="window.scrollTo({top:0, behavior:'smooth'})">
                <svg viewBox="0 0 24 24"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>
                <span>DASHBOARD</span>
            </div>
            <div class="dock-navigation-element" onclick="triggerSystemHardReset()">
                <svg viewBox="0 0 24 24"><path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z"/></svg>
                <span>TERMINATE</span>
            </div>
        </div>
    </div>

    <script>
        let SystemSecurityHash = "";

        // CENTRAL ROUTING ARCHITECTURE MAP ARRAY HOUSING 15 PRODUCTION ENDPOINTS
        const PIPELINE_SPECIFICATIONS = [
            { id: "movie", slug: "/api/movie", label: "OMDB GLOBAL CINEMA MATRIX SEARCH", parameterKey: "text", standardValue: "Inception" },
            { id: "chatgpt", slug: "/api/chat", label: "GPT-4O AI DEEP INTELLIGENCE DISPATCH", parameterKey: "prompt", standardValue: "Explain blockchain in simple terms" },
            { id: "url_shorten", slug: "/api/url_shorten", label: "CUTTLY MICRO INSTANT LINK REDUCER", parameterKey: "link", standardValue: "https://github.com/expressjs/express" },
            { id: "xvideos", slug: "/xvideo", label: "XVIDEOS LOSSLESS STREAM COMPILER", parameterKey: "url", standardValue: "https://www.xvideos.com/video12345/test_scene" },
            { id: "ytmp4", slug: "/ytmp4", label: "YOUTUBE VIDEO DATA STREAM DOWNLOAD", parameterKey: "url", standardValue: "https://youtube.com/watch?v=dQw4w9WgXcQ" },
            { id: "mediafire", slug: "/mediafire", label: "MEDIAFIRE REMOTE BINARY LINK EXTRACTION", parameterKey: "url", standardValue: "https://www.mediafire.com/file/sample_data" },
            { id: "spotify", slug: "/spotify", label: "SPOTIFY PREMIUM AUDIOPHILE HQ DOWNLINK", parameterKey: "url", standardValue: "https://open.spotify.com/track/4PTG3Z6ehGkBFm6T7YSpR4" },
            { id: "twitter", slug: "/twitter", label: "X PLATFORM MEDIA STREAM RECONSTRUCT", parameterKey: "url", standardValue: "https://x.twitter.com/status/123456789" },
            { id: "song", slug: "/song", label: "YT MUSIC VECTOR AUDIO BUFFER SCRAPER", parameterKey: "text", standardValue: "Shape of You" },
            { id: "tiktok", slug: "/tiktok", label: "TIKTOK STUDIO RAW NO-WATERMARK PACKAGER", parameterKey: "url", standardValue: "https://vt.tiktok.com/ZS2xLd8mB/" },
            { id: "pinterest", slug: "/pinterest", label: "PINTEREST UHD VISUAL SOURCE DISCOVERY", parameterKey: "text", standardValue: "Cyberpunk Aesthetic 4K" },
            { id: "apk", slug: "/apk", label: "APK MIRROR INTERCEPT DISTRIBUTION SYSTEM", parameterKey: "text", standardValue: "WhatsApp Messenger" },
            { id: "facebook", slug: "/facebook", label: "FACEBOOK SOCIAL WATCH EXTRACT ENGINE", parameterKey: "url", standardValue: "https://www.facebook.com/watch/?v=987654321" },
            { id: "webdl", slug: "/webdl", label: "STATIC INTERNET CLONER WEB ASSET SCRAPE", parameterKey: "url", standardValue: "https://example.com" },
            { id: "obfuscate", slug: "/api/obfuscate", label: "JAVASCRIPT CONTROL FLOW PROTECTION CORE", parameterKey: "code", standardValue: "function testCore() { console.log('MR HASHUU MAINNET ACTIVE'); }" }
        ];

        function pipelineGenerationEngine() {
            const domClusterTarget = document.getElementById('pipeline-dom-injection-target');
            domClusterTarget.innerHTML = PIPELINE_SPECIFICATIONS.map(spec => `
                <div class="pipeline-element-box" id="wrapper-node-${spec.id}">
                    <div class="pipeline-interaction-row" onclick="toggleDropdownPipelineViewState('${spec.id}')">
                        <div class="pipeline-meta-wrapper">
                            <span class="tag-routing-path">${spec.slug}</span>
                            <span class="tag-routing-desc">\\-- ${spec.label}</span>
                        </div>
                        <svg class="arrow-dispatch-vector" viewBox="0 0 24 24"><path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/></svg>
                    </div>
                    <div class="pipeline-dropdown-payload" id="dropdown-view-${spec.id}">
                        <div class="param-group-box">
                            <label class="telemetry-label">INJECT VALUE ARGUMENT (?${spec.parameterKey}=)</label>
                            <input type="text" class="param-interactive-input" id="field-input-${spec.id}" value="${spec.standardValue}" oninput="synchronizeUrlQueryStringMap('${spec.id}', '${spec.slug}', '${spec.parameterKey}')">
                        </div>
                        <div class="live-url-map-preview" id="url-preview-string-box-${spec.id}">building core dynamic routing path text...</div>
                        <div class="execution-row-triggers">
                            <button class="action-btn-node btn-secondary-dim" onclick="copyConfiguredRouteLinkToBuffer('${spec.id}')">
                                <svg viewBox="0 0 24 24"><path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/></svg>
                                COPY ROUTE
                            </button>
                            <button class="action-btn-node btn-primary-glow" onclick="executeLiveDynamicRouteQueryTransmission('${spec.id}', '${spec.slug}', '${spec.parameterKey}')">
                                <svg viewBox="0 0 24 24"><path d="M5 13h11.86l-5.43 5.43 1.42 1.42L21.14 12l-8.29-8.29-1.42 1.42L16.86 11H5v2z"/></svg>
                                DISPATCH REQUEST
                            </button>
                        </div>
                        <pre class="live-terminal-stream" id="terminal-stream-console-box-${spec.id}"></pre>
                    </div>
                </div>
            `).join('');
        }

        function triggerGatewayHandshake() {
            const currentSecretKeyInput = document.getElementById('gate-pass-token').value.trim();
            if (currentSecretKeyInput === "MR_HASHUU_SECRET_123" || PREMIUM_DATABASE[currentSecretKeyInput]) {
                SystemSecurityHash = currentSecretKeyInput;
                const curtainOverlayDom = document.getElementById('gate-curtain');
                const workSpaceMainNode = document.getElementById('panel-engine-workspace');
                
                curtainOverlayDom.style.opacity = '0';
                curtainOverlayDom.style.transform = 'translateY(-100vh)';
                
                setTimeout(() => {
                    curtainOverlayDom.style.display = 'none';
                    workSpaceMainNode.style.display = 'flex';
                    pipelineGenerationEngine();
                    PIPELINE_SPECIFICATIONS.forEach(s => synchronizeUrlQueryStringMap(s.id, s.slug, s.parameterKey));
                    executeHardwareStatisticsTrackUpdate();
                    setInterval(executeHardwareStatisticsTrackUpdate, 5000);
                    setTimeout(() => { workSpaceMainNode.style.opacity = '1'; }, 40);
                }, 600);
            } else {
                const shakeTargetDomFrame = document.getElementById('curtain-card-frame');
                shakeTargetDomFrame.classList.add('shake-alert');
                setTimeout(() => shakeTargetDomFrame.classList.remove('shake-alert'), 450);
            }
        }

        document.getElementById('gate-pass-token').addEventListener('keypress', function(e) {
            if (e.key === 'Enter') triggerGatewayHandshake();
        });

        function toggleDropdownPipelineViewState(nodeId) {
            const targetDropdownDomElement = document.getElementById('dropdown-view-' + nodeId);
            const masterNodeBoxHullElement = document.getElementById('wrapper-node-' + nodeId);
            const currentViewStateIsActive = masterNodeBoxHullElement.classList.contains('expanded-state');
            
            document.querySelectorAll('.pipeline-element-box').forEach(el => el.classList.remove('expanded-state'));
            document.querySelectorAll('.pipeline-dropdown-payload').forEach(view => view.style.display = 'none');

            if (!currentViewStateIsActive) {
                masterNodeBoxHullElement.classList.add('expanded-state');
                targetDropdownDomElement.style.display = 'block';
            }
        }

        function synchronizeUrlQueryStringMap(id, slug, paramKey) {
            const rawCurrentFieldDataString = encodeURIComponent(document.getElementById('field-input-' + id).value);
            document.getElementById('url-preview-string-box-' + id).innerText = `${slug}?${paramKey}=${rawCurrentFieldDataString}&apikey=${SystemSecurityHash}`;
        }

        function copyConfiguredRouteLinkToBuffer(id) {
            const targetInnerStringLink = document.getElementById('url-preview-string-box-' + id).innerText;
            navigator.clipboard.writeText(window.location.origin + targetInnerStringLink);
        }

        async function executeLiveDynamicRouteQueryTransmission(id, slug, paramKey) {
            const rawConfiguredFieldQueryInputData = document.getElementById('field-input-' + id).value;
            const targetOutputConsoleTerminalBoxLog = document.getElementById('terminal-stream-console-box-' + id);
            
            targetOutputConsoleTerminalBoxLog.style.display = "block";
            targetOutputConsoleTerminalBoxLog.innerText = ">>> ARGS CONTEXT INITIALIZED VIA EVENT HANDLER...\n>>> COUPLING TRANSACTION SECURITY MATRIX SIGNATURES...\n>>> EVALUATING SERVER NET HANDSHAKE PACKET TRANSIT...";
            targetOutputConsoleTerminalBoxLog.style.color = "var(--text-low)";

            try {
                // EXPLICIT SYSTEM CORRECTION REQUEST INTEGRATION LOOP -> Dynamic endpoint execution reading real values
                const compilationAbsoluteFetchUriLink = `${slug}?${paramKey}=${encodeURIComponent(rawConfiguredFieldQueryInputData)}&apikey=${SystemSecurityHash}`;
                const liveServerHttpResponseStream = await fetch(compilationAbsoluteFetchUriLink);
                const standardParsedPayloadDataJson = await liveServerHttpResponseStream.json();
                
                targetOutputConsoleTerminalBoxLog.innerText = ">>> TRANSMISSION PROTOCOL FLUID SUCCESS.\n\n" + JSON.stringify(standardParsedPayloadDataJson, null, 2);
                targetOutputConsoleTerminalBoxLog.style.color = standardParsedPayloadDataJson.success !== false ? "var(--neon-green)" : "var(--neon-red)";
                executeHardwareStatisticsTrackUpdate();
            } catch (networkFatalExceptionLogs) {
                targetOutputConsoleTerminalBoxLog.innerText = ">>> NETWORK CORE ERROR TRACE: PIPELINE INTERRUPT CRASH ENCOUNTERED.\n\n" + JSON.stringify({ error: "BUS_DISPATCH_FAILURE", message: networkFatalExceptionLogs.message }, null, 2);
                targetOutputConsoleTerminalBoxLog.style.color = "var(--neon-red)";
            }
        }

        async function executeHardwareStatisticsTrackUpdate() {
            try {
                const responseTelemetryMetricsStream = await fetch(`/api/stats?apikey=${SystemSecurityHash}`);
                const dataMetricsObjectJson = await responseTelemetryMetricsStream.json();
                if (dataMetricsObjectJson.success) {
                    document.getElementById('runtime-uptime-display').innerText = dataMetricsObjectJson.server.uptime.toUpperCase();
                    if (dataMetricsObjectJson.key_info) {
                        document.getElementById('runtime-quota-display').innerText = `${dataMetricsObjectJson.key_info.today_usage} / ${dataMetricsObjectJson.key_info.daily_limit} HITS`;
                        document.getElementById('runtime-progress-node').style.width = `${dataMetricsObjectJson.key_info.usage_ratio}%`;
                    }
                }
            } catch (e) {}
        }

        function triggerSystemHardReset() {
            location.reload();
        }
    </script>
</body>
</html>`;

    const secureBinaryResponseBuffer = Buffer.from(rawHtmlContent, 'utf-8');
    res.writeHead(200, {
        'Content-Type': 'text/html; charset=utf-8',
        'Content-Length': secureBinaryResponseBuffer.length
    });
    res.end(secureBinaryResponseBuffer);
});

// ─────────────────────────────────────────────────────────
// 🛠️ BACKEND WRAPPERS ARCHITECTURE LOGICS (ALL 15 CHANNELS)
// ─────────────────────────────────────────────────────────

// 1. [🎬 MOVIE DATABASE] OMDB SCANNER
app.get('/api/movie', strictAuthGate, async (req, res) => {
    try {
        const { text } = req.query;
        if (!text) return res.status(400).json({ success: false, message: "Required input query parameter (?text=) is missing." });
        const { data } = await axios.get(`http://www.omdbapi.com/?t=${encodeURIComponent(text)}&apikey=2634bb02`);
        if (data.Response === "True") return res.status(200).json({ creator: "MR HASHUU", status: "AUTHENTICATED", success: true, result: data });
        res.status(404).json({ success: false, message: data.Error || "Entity not found." });
    } catch (e) { res.status(500).json({ success: false, error: e.message }); }
});

// 2. [🤖 AI INTELLIGENCE] CHATGPT CORE
app.get('/api/chat', strictAuthGate, async (req, res) => {
    try {
        const { prompt } = req.query;
        if (!prompt) return res.status(400).json({ success: false, message: "Query parameter (?prompt=) is missing." });
        
        const matchingPhrase = prompt.toLowerCase().trim();
        if (matchingPhrase === 'hi') return res.json({ creator: "MR HASHUU", success: true, result: "HELLOW IM HASHUU AI SERVICE" });
        if (matchingPhrase === 'kawad bn') return res.json({ creator: "MR HASHUU", success: true, result: "huththak kwa" });

        const customSystemRules = "You are Hashan-md AI, a brilliant AI developed and owned by MR HASHUU.";
        const { data } = await axios.get(`https://apis.davidcyriltech.my.id/ai/chatgpt?prompt=${encodeURIComponent(prompt)}&model=gpt-4o&system=${encodeURIComponent(customSystemRules)}`);
        res.status(200).json({ creator: "MR HASHUU", status: "AUTHENTICATED", success: true, result: data?.data?.choices?.[0]?.message?.content || data });
    } catch (e) { res.status(500).json({ success: false, error: e.message }); }
});

// 3. [🔗 LINK SHORTENER] CUTTLY DISPATCHER
app.get('/api/url_shorten', strictAuthGate, async (req, res) => {
    try {
        const { link } = req.query;
        if (!link) return res.status(400).json({ success: false, message: "Target URL parameter (?link=) is missing." });
        const { data } = await axios.get(`https://apis.davidcyriltech.my.id/cuttly?link=${encodeURIComponent(link)}`);
        if (data.success) return res.status(200).json({ creator: "MR HASHUU", success: true, original_url: data.original_url, shortened_url: data.shortened_url });
        res.status(422).json({ success: false, message: "Link reduction operations failed." });
    } catch (e) { res.status(500).json({ success: false, error: e.message }); }
});

// 4. [🔞 ADULT RESOLVER] XVIDEOS ENGINE
app.get('/xvideo', strictAuthGate, async (req, res) => {
    try {
        const { url } = req.query;
        if (!url) return res.status(400).json({ success: false, message: "XVideo URL parameter (?url=) required." });
        const { data } = await axios.get(`https://apis.davidcyriltech.my.id/xvideo?url=${encodeURIComponent(url)}`);
        if (data.success) return res.status(200).json({ creator: "MR HASHUU", success: true, title: data.title, download_url: data.download_url });
        res.status(422).json({ success: false, message: "Media payload resolution breakdown failed." });
    } catch (e) { res.status(500).json({ success: false, error: e.message }); }
});

// 5. [🎥 YT VIDEO] STREAM GRABBER
app.get('/ytmp4', strictAuthGate, async (req, res) => {
    try {
        const { url } = req.query;
        if (!url) return res.status(400).json({ success: false, message: "YouTube link address (?url=) required." });
        const { data } = await axios.get(`https://apis.davidcyriltech.my.id/youtube/download?url=${encodeURIComponent(url)}`);
        res.status(200).json({ creator: "MR HASHUU", success: true, result: data.result || data });
    } catch (e) { res.status(500).json({ success: false, error: e.message }); }
});

// 6. [📁 MEDIAFIRE CLOUD] DOWNLOAD LINK EXTRACTOR
app.get('/mediafire', strictAuthGate, async (req, res) => {
    try {
        const { url } = req.query;
        if (!url) return res.status(400).json({ success: false, message: "Mediafire cloud path parameter (?url=) required." });
        const { data } = await axios.get(`https://apis.davidcyriltech.my.id/mediafire?url=${encodeURIComponent(url)}`);
        res.status(200).json({ creator: "MR HASHUU", success: true, result: data });
    } catch (e) { res.status(500).json({ success: false, error: e.message }); }
});

// 7. [🎵 SPOTIFY DOWNLINK] HQ EXTRACTION PIPELINE
app.get('/spotify', strictAuthGate, async (req, res) => {
    try {
        const { url } = req.query;
        if (!url) return res.status(400).json({ success: false, message: "Spotify address target link (?url=) required." });
        const { data } = await axios.get(`https://apis.davidcyriltech.my.id/spotifydl?url=${encodeURIComponent(url)}`);
        res.status(200).json({ creator: "MR HASHUU", success: true, result: data });
    } catch (e) { res.status(500).json({ success: false, error: e.message }); }
});

// 8. [🐦 TWITTER PIPELINE] X PLATFORM STREAM EXTRACTION
app.get('/twitter', strictAuthGate, async (req, res) => {
    try {
        const { url } = req.query;
        if (!url) return res.status(400).json({ success: false, message: "X Platform status link parameter (?url=) required." });
        const { data } = await axios.get(`https://apis.davidcyriltech.my.id/twitterV2?url=${encodeURIComponent(url)}`);
        res.status(200).json({ creator: "MR HASHUU", success: true, result: data });
    } catch (e) { res.status(500).json({ success: false, error: e.message }); }
});

// 9. [🎶 AUDIO EXPLORER] SONG MUSIC SCRAPER
app.get('/song', strictAuthGate, async (req, res) => {
    try {
        const { text } = req.query;
        if (!text) return res.status(400).json({ success: false, message: "Song tracking keyword text (?text=) required." });
        const { data } = await axios.get(`https://apis.davidcyriltech.my.id/play?query=${encodeURIComponent(text)}`);
        res.status(200).json({ creator: "MR HASHUU", success: true, result: data.result || data });
    } catch (e) { res.status(500).json({ success: false, error: e.message }); }
});

// 10. [📱 TIKTOK NO-WM] VIDEO RECONSTRUCTOR ENGINE
app.get('/tiktok', strictAuthGate, async (req, res) => {
    try {
        const { url } = req.query;
        if (!url) return res.status(400).json({ success: false, message: "TikTok share link string (?url=) required." });
        const { data } = await axios.get(`https://apis.davidcyriltech.my.id/tiktok?url=${encodeURIComponent(url)}`);
        res.status(200).json({ creator: "MR HASHUU", success: true, result: data.video_hd || data });
    } catch (e) { res.status(500).json({ success: false, error: e.message }); }
});

// 11. [📌 PINTEREST GRID] IMAGE SOURCE AUDITOR
app.get('/pinterest', strictAuthGate, async (req, res) => {
    try {
        const { text } = req.query;
        if (!text) return res.status(400).json({ success: false, message: "Search string context parameter (?text=) required." });
        const { data } = await axios.get(`https://apis.davidcyriltech.my.id/search/pinterest?text=${encodeURIComponent(text)}`);
        res.status(200).json({ creator: "MR HASHUU", success: true, result: data.result || data });
    } catch (e) { res.status(500).json({ success: false, error: e.message }); }
});

// 12. [🤖 APK STORAGE] BINARY PACKAGE EXTRACTOR
app.get('/apk', strictAuthGate, async (req, res) => {
    try {
        const { text } = req.query;
        if (!text) return res.status(400).json({ success: false, message: "Application target identification keyword (?text=) required." });
        const { data } = await axios.get(`https://apis.davidcyriltech.my.id/download/apk?text=${encodeURIComponent(text)}`);
        res.status(200).json({ creator: "MR HASHUU", success: true, result: data.apk || data });
    } catch (e) { res.status(500).json({ success: false, error: e.message }); }
});

// 13. [👥 FACEBOOK MONITOR] MULTI-CDN VIDEO TRACKER
app.get('/facebook', strictAuthGate, async (req, res) => {
    try {
        const { url } = req.query;
        if (!url) return res.status(400).json({ success: false, message: "Facebook resource video link (?url=) required." });
        const { data } = await axios.get(`https://apis.davidcyriltech.my.id/facebook?url=${encodeURIComponent(url)}`);
        res.status(200).json({ creator: "MR HASHUU", success: true, result: data.video_hd || data });
    } catch (e) { res.status(500).json({ success: false, error: e.message }); }
});

// 14. [🌐 WEB SITE CLONER] ASSET CODE SCRAPER
app.get('/webdl', strictAuthGate, async (req, res) => {
    try {
        const { url } = req.query;
        if (!url) return res.status(400).json({ success: false, message: "Target site asset URL parameter (?url=) required." });
        const { data } = await axios.get(`https://apis.davidcyriltech.my.id/tools/downloadweb?url=${encodeURIComponent(url)}`);
        res.status(200).json({ creator: "MR HASHUU", success: true, result: data.response || data });
    } catch (e) { res.status(500).json({ success: false, error: e.message }); }
});

// 15. [🔒 JAVASCRIPT OBFUSCATOR] SCRIPT ENCRYPTION PROTOCOL
app.get('/api/obfuscate', strictAuthGate, (req, res) => {
    try {
        const { code } = req.query;
        if (!code) return res.status(400).json({ success: false, message: "Source script string data block parameter (?code=) missing." });
        const obfuscatedResult = obfuscator.obfuscate(code, { compact: true, controlFlowFlattening: true, deadCodeInjection: true }).getObfuscatedCode();
        res.status(200).json({ creator: "MR HASHUU", success: true, result: obfuscatedResult });
    } catch (e) { res.status(500).json({ success: false, error: e.message }); }
});

// IMGBB POST DATA PIPELINE BINARY MULTIPART OVERLAY
app.post('/imgbb', strictAuthGate, upload.single('file'), async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ success: false, message: "Attachment multi-part data payload buffer missing." });
        const form = new FormData();
        form.append('file', req.file.buffer, { filename: req.file.originalname || 'image.jpg', contentType: req.file.mimetype });
        const { data } = await axios.post('https://apis.davidcyriltech.my.id/uploader/imgbb', form, { headers: { ...form.getHeaders() } });
        res.status(200).json({ creator: "MR HASHUU", success: true, result: data.data || data });
    } catch (e) { res.status(500).json({ success: false, error: e.message }); }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.clear();
    console.log(`>>> PLATFORM RUNNING HIGH-FIDELITY ROUTERS LIVE ON LOCALHOST PORT: ${PORT}`);
});

module.exports = app;
