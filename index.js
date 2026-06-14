const express = require('express');
const axios = require('axios');
const rateLimit = require('express-rate-limit');
const app = express();

const MY_SECRET_KEY = "MR_HASHUU_SECRET_123"; 

const apiLimiter = rateLimit({
    windowMs: 24 * 60 * 60 * 1000,
    max: 100,
    skip: (req) => req.query.apikey === MY_SECRET_KEY, 
    message: { success: false, message: "ඔයාගේ නොමිලේ ලැබෙන රික්වෙස්ට් 100 ඉවරයි! Premium API Key එකක් ගන්න." }
});

app.use(apiLimiter);

// 1. Pinterest Route
app.get('/pinterest', async (req, res) => {
    const query = req.query.text;
    if (!query) return res.json({ success: false, message: "සෙවුම් පදයක් දෙන්න!" });
    try {
        const response = await axios.get(`https://apis.davidcyriltech.my.id/search/pinterest?text=${encodeURIComponent(query)}`);
        res.json({ creator: "Mr Hashuu Bot", success: true, result: response.data.result });
    } catch (e) { res.json({ success: false, message: e.message }); }
});

// 2. APK Route
app.get('/apk', async (req, res) => {
    const query = req.query.text;
    if (!query) return res.json({ success: false, message: "APK නමක් දෙන්න!" });
    try {
        const response = await axios.get(`https://apis.davidcyriltech.my.id/download/apk?text=${encodeURIComponent(query)}`, { headers: { 'User-Agent': 'Mozilla/5.0' }});
        res.json({ creator: "Mr Hashuu Bot", success: true, result: response.data.apk });
    } catch (e) { res.json({ success: false, message: e.message }); }
});

// 3. Song Downloader Route (YouTube MP3)
app.get('/song', async (req, res) => {
    const url = req.query.url;
    if (!url) return res.json({ success: false, message: "YouTube URL එකක් දෙන්න!" });
    try {
        // උඹ දුන්න API එකට රික්වෙස්ට් එක යවනවා
        const response = await axios.get(`https://vajira-official-apis.vercel.app/api/ytmp3?apikey=vajira-VajiraOfficial2003&url=${encodeURIComponent(url)}`);
        
        // දත්ත ටික උඹේම විදියට ෆෝමැට් කරනවා
        if (response.data && response.data.result) {
            res.json({
                creator: "Mr Hashuu Bot",
                success: true,
                result: response.data.result
            });
        } else {
            res.json({ success: false, message: "Song එක ලබාගත නොහැකි විය." });
        }
    } catch (e) { res.json({ success: false, message: e.message }); }
});

module.exports = app;
