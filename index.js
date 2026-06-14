const express = require('express');
const axios = require('axios');
const app = express();

app.get('/apk', async (req, res) => {
    const query = req.query.text;
    if (!query) return res.json({ success: false, message: "APK නමක් දෙන්න!" });

    try {
        const apiUrl = `https://apis.davidcyriltech.my.id/download/apk?text=${encodeURIComponent(query)}`;
        
        // User-Agent එකක් දාලා රික්වෙස්ට් කරනවා
        const response = await axios.get(apiUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36'
            }
        });
        
        // API එකෙන් එන දත්ත log කරලා බලමු Vercel logs වල
        console.log("Raw Response Data:", response.data);
        
        if (response.data && (response.data.result || response.data.data)) {
            res.json({
                creator: "Mr Hashuu Bot",
                success: true,
                result: response.data.result || response.data.data
            });
        } else {
            res.json({ success: false, message: "API එකෙන් දත්ත ආවා, හැබැයි result එකක් නැහැ.", raw: response.data });
        }
    } catch (e) {
        res.json({ success: false, message: "Error: " + e.message });
    }
});

module.exports = app;
