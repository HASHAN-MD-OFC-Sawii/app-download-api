const express = require('express');
const axios = require('axios');
const app = express();

// උඹට කැමති Key එකක් මෙතන දාගනින්
const MY_SECRET_KEY = "MR_HASHUU_OFC2026"; 

app.get('/apk', async (req, res) => {
    // API Key එක චෙක් කරන කොටස
    const userKey = req.query.apikey;
    
    if (!userKey || userKey !== MY_SECRET_KEY) {
        return res.json({ 
            success: false, 
            message: "Invalid API Key! කරුණාකර නිවැරදි API Key එක ලබා දෙන්න." 
        });
    }

    const query = req.query.text;
    if (!query) return res.json({ success: false, message: "APK නමක් දෙන්න!" });

    try {
        const apiUrl = `https://apis.davidcyriltech.my.id/download/apk?text=${encodeURIComponent(query)}`;
        const response = await axios.get(apiUrl, {
            headers: { 'User-Agent': 'Mozilla/5.0' }
        });
        
        if (response.data && response.data.apk) {
            res.json({
                creator: "Mr Hashuu Bot",
                success: true,
                result: response.data.apk
            });
        } else {
            res.json({ success: false, message: "APK සොයාගත නොහැකි විය." });
        }
    } catch (e) {
        res.json({ success: false, message: "Error: " + e.message });
    }
});

module.exports = app;
