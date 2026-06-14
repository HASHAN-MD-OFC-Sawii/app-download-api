const express = require('express');
const axios = require('axios');
const app = express();
const PORT = process.env.PORT || 3000;

app.get('/apk', async (req, res) => {
    const query = req.query.text;
    if (!query) return res.json({ success: false, message: "APK නමක් දෙන්න!" });

    try {
        // David Cyril ගේ API එකට රික්වෙස්ට් එක යවනවා
        const response = await axios.get(`https://apis.davidcyriltech.my.id/download/apk?text=${encodeURIComponent(query)}`);
        
        // දත්ත ආවොත් අපි ඒක අපේම විදියට හදනවා
        if (response.data && response.data.success) {
            res.json({
                creator: "Mr Hashuu Bot", // මෙතනට උඹේ නම දාගනින්
                success: true,
                result: response.data.result // මෙතන දත්ත ටික එනවා
            });
        } else {
            res.json({ success: false, message: "APK සොයාගත නොහැකි විය." });
        }
    } catch (e) {
        res.json({ success: false, message: "Error: " + e.message });
    }
});

app.listen(PORT, () => console.log(`APK API Active on ${PORT}`));
