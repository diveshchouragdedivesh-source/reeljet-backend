const express = require('express');
const cors = require('cors');
const { igdl } = require('xfarr-api');

const app = express();
app.use(cors());

app.get('/api/download', async (req, res) => {
    const videoUrl = req.query.url;
    try {
        let resData = await igdl(videoUrl);
        res.json({ url: resData.medias[0].url });
    } catch (e) {
        res.status(500).json({ error: "Failed to fetch" });
    }
});

app.listen(process.env.PORT || 3000);
