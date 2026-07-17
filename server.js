const express = require('express');
const cors = require('cors');
const { igdl } = require('instagram-url-direct');

const app = express();

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type']
}));

app.get('/api/download', async (req, res) => {
    const videoUrl = req.query.url;
    if (!videoUrl) return res.status(400).json({ error: 'URL is required' });

    try {
        const result = await igdl(videoUrl);
        if (result && result.length > 0) {
            res.json({
                url: result[0].download_link,
                type: 'video'
            });
        } else {
            res.status(404).json({ error: 'No media found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

