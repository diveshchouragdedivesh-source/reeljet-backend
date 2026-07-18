const express = require('express');
const cors = require('cors');
const { instagram } = require('nexo-aio-downloader');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('✅ ReelJet Backend is Running!');
});

app.get('/api/download', async (req, res) => {
  const videoUrl = req.query.url;

  if (!videoUrl) {
    return res.status(400).json({ error: 'URL parameter is required' });
  }

  try {
    console.log(`⏳ Fetching: ${videoUrl}`);
    const result = await instagram(videoUrl);

    if (!result || result.length === 0) {
      throw new Error('No media found. Make sure the link is public.');
    }

    const media = result[0];
    res.json({
      url: media.url,
      thumbnail: media.thumbnail || null,
      quality: 'HD'
    });

  } catch (error) {
    console.error('❌ Error:', error.message);
    res.status(500).json({
      error: error.message || 'Failed to fetch media. Please check the URL.'
    });
  }
});

const PORT = process.env.PORT || 8081;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
