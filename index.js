const express = require('express');
const axios = require('axios');
const rateLimit = require('express-rate-limit');
const app = express();

const MY_SECRET_KEY = "MR_HASHUU_SECRET_123";

// Rate Limiter
const apiLimiter = rateLimit({
    windowMs: 24 * 60 * 60 * 1000,
    max: 100,
    skip: (req) => req.query.apikey === MY_SECRET_KEY,
    message: { success: false, message: "Free limit reached. Get Premium!" }
});

app.use(apiLimiter);

// Pinterest Route
app.get('/pinterest', async (req, res) => {
    try {
        const { text } = req.query;
        if (!text) return res.json({ success: false, message: "Query required" });
        const { data } = await axios.get(`https://apis.davidcyriltech.my.id/search/pinterest?text=${encodeURIComponent(text)}`);
        res.json({ creator: "Mr Hashuu Bot", success: true, result: data.result || [] });
    } catch (e) { res.json({ success: false, message: e.message }); }
});

// APK Route
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

// Song Route (Fix කරපු එක)
app.get('/song', async (req, res) => {
    try {
        const { text } = req.query;
        if (!text) return res.json({ success: false, message: "Song name or URL required" });

        let videoUrl = text;
        if (!text.includes('youtube.com') && !text.includes('youtu.be')) {
            const search = await axios.get(`https://apis.davidcyriltech.my.id/search/youtube?text=${encodeURIComponent(text)}`);
            if (search.data.result && search.data.result.length > 0) {
                videoUrl = search.data.result[0].url;
            } else {
                return res.json({ success: false, message: "Song not found" });
            }
        }

        const { data } = await axios.get(`https://vajira-official-apis.vercel.app/api/ytmp3?apikey=vajira-VajiraOfficial2003&url=${encodeURIComponent(videoUrl)}`, { 
            headers: { 'User-Agent': 'Mozilla/5.0' }, timeout: 15000 
        });

        res.json({ creator: "Mr Hashuu Bot", success: true, result: data.data || {} });
    } catch (e) { res.json({ success: false, message: e.message }); }
});

module.exports = app;
