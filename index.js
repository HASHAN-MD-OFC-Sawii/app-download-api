const express = require('express');
const axios = require('axios');
const app = express();

app.get('/apk', async (req, res) => {
    const query = req.query.text;
    if (!query) return res.json({ success: false, message: "APK නමක් දෙන්න!" });

    try {
        const apiUrl = `https://apis.davidcyriltech.my.id/download/apk?text=${encodeURIComponent(query)}`;
        
        const response = await axios.get(apiUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36'
            }
        });
        
        // මෙතන තමයි වෙනස: response.data.apk කියන එක තමයි අපි ගන්න ඕනේ
        if (response.data && response.data.apk) {
            res.json({
                creator: "Mr Hashuu Bot",
                success: true,
                result: response.data.apk // අපි apk එකේ විස්තර ටික result එකට දානවා
            });
        } else {
            res.json({ success: false, message: "APK සොයාගත නොහැකි විය." });
        }
    } catch (e) {
        res.json({ success: false, message: "Error: " + e.message });
    }
});

module.exports = app;
