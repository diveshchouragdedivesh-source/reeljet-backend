const express = require('express');
const cors = require('cors');
const instagramGetUrl = require('instagram-url-direct').default;
const app = express();
app.use(cors());
app.use(express.json());

app.get('/api/download', async (req, res) => {
    const videoUrl = req.query.url;
    if (!videoUrl) return res.status(400).json({ error: 'URL is required' });

    try {
        let links = await instagramGetUrl(videoUrl);
        
        if (links && links.url_list && links.url_list.length > 0) {
            return res.json({
                url: links.url_list[0],
                audio_url: links.url_list.find(link => link.includes('.mp3')) || null,
                thumbnail: links.url_list[0],
                type: videoUrl.includes('/p/') ? 'image' : 'video'
            });
        } else {
            return res.status(404).json({ error: 'No media found or private account' });
        }
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

