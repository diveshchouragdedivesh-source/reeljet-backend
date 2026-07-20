const express = require('express');
const cors = require('cors');
const ig = require('instagram-url-direct');

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
    console.log('⏳ Fetching:', videoUrl);
    const result = await ig.instagram(videoUrl);

    // Handle both array and object responses
    let mediaUrl = null;
    let thumbnail = null;

    if (Array.isArray(result) && result.length > 0) {
      mediaUrl = result[0].url;
      thumbnail = result[0].thumbnail || null;
    } else if (result && result.url) {
      mediaUrl = result.url;
      thumbnail = result.thumbnail || null;
    } else if (result && result.media && result.media.length > 0) {
      mediaUrl = result.media[0].url;
      thumbnail = result.media[0].thumbnail || null;
    }

    if (mediaUrl) {
      res.json({
        url: mediaUrl,
        thumbnail: thumbnail,
        quality: 'HD'
      });
    } else {
      throw new Error('No media found. Make sure the link is public.');
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
    res.status(500).json({
      error: error.message || 'Failed to fetch media. Please check the URL.'
    });
  }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
