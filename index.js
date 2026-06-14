const express = require('express');
const axios = require('axios');
const app = express();

app.get('/apk', async (req, res) => {
    const query = req.query.text;
    if (!query) return res.json({ success: false, message: "APK නමක් දෙන්න!" });

    try {
        // බොහෝ විට URL එක මේ විදියට තියෙන්න ඕනේ
        const apiUrl = `https://apis.davidcyriltech.my.id/download/apk?text=${encodeURIComponent(query)}`;
        
        const response = await axios.get(apiUrl);
        
        // දත්ත එන හැටි බලන්න log එකක් දාගමු (Vercel logs වල පේනවා)
        console.log("API Response:", response.data);
        
        if (response.data && response.data.result) {
            res.json({
                creator: "Mr Hashuu Bot",
                success: true,
                result: response.data.result
            });
        } else {
            res.json({ success: false, message: "API එකෙන් දත්ත ලැබුණේ නැහැ." });
        }
    } catch (e) {
        res.json({ success: false, message: "Error: " + e.message });
    }
});

module.exports = app;
