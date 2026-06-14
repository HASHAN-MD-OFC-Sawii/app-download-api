const express = require('express');
const axios = require('axios');
const rateLimit = require('express-rate-limit');
const app = express();

const MY_SECRET_KEY = "MR_HASHUU_SECRET_123";

const apiLimiter = rateLimit({
    windowMs: 24 * 60 * 60 * 1000,
    max: 100,
    skip: (req) => req.query.apikey === MY_SECRET_KEY,
    message: { success: false, message: "Free limit reached. Get Premium!" }
});

app.use(apiLimiter);

// 1. Pinterest
app.get('/pinterest', async (req, res) => {
    const { text } = req.query;
    if (!text) return res.json({ success: false, message: "Query required" });
    try {
        const { data } = await axios.get(`https://apis.davidcyriltech.my.id/search/pinterest?text=${encodeURIComponent(text)}`);
        res.json({ creator: "Mr Hashuu Bot", success: true, result: data.result || [] });
    } catch (e) { res.json({ success: false, message: e.message }); }
});

// 2. APK
app.get('/apk', async (req, res) => {
    const { text } = req.query;
    if (!text) return res.json({ success: false, message: "Query required" });
    try {
        const { data } = await axios.get(`https://apis.davidcyriltech.my.id/download/apk?text=${encodeURIComponent(text)}`, { headers: { 'User-Agent': 'Mozilla/5.0' }});
        res.json({ creator: "Mr Hashuu Bot", success: true, result: data.apk || {} });
    } catch (e) { res.json({ success: false, message: e.message }); }
});

// 3. Song (Search & Download)
app.get('/song', async (req, res) => {
    const { text } = req.query; // මෙතන URL එක වගේම නමත් ගන්න පුළුවන්
    if (!text) return res.json({ success: false, message: "Song name or URL required" });

    try {
        let videoUrl = text;
        // ඉන්පුට් එක URL එකක් නෙවෙයි නම් search කරන්න
        if (!text.includes('youtube.com') && !text.includes('youtu.be')) {
            const search = await axios.get(`https://apis.davidcyriltech.my.id/search/youtube?text=${encodeURIComponent(text)}`);
            if (search.data.result && search.data.result.length > 0) {
                videoUrl = search.data.result[0].url;
            } else {
                return res.json({ success: false, message: "Song not found" });
            }
        }

        // ඒ URL එකෙන් MP3 එක ගන්න
        const { data } = await axios.get(`https://vajira-official-apis.vercel.app/api/ytmp3?apikey=vajira-VajiraOfficial2003&url=${encodeURIComponent(videoUrl)}`);
        
        res.json({ creator: "Mr Hashuu Bot", success: true, result: data.result });
    } catch (e) { res.json({ success: false, message: e.message }); }
});

module.exports = app;
