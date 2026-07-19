const express = require('express');
const cors = require('cors');

// Try to load instagram-url-direct, but if it fails, we'll use fetch
let ig;
try {
  ig = require('instagram-url-direct');
  console.log('✅ instagram-url-direct loaded');
} catch (e) {
  console.log('⚠️ instagram-url-direct not available, using fetch only');
}

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

  // METHOD 1: Try instagram-url-direct first
  if (ig) {
    try {
      console.log('⏳ Method 1: Using instagram-url-direct for:', videoUrl);
      const result = await ig.instagram(videoUrl);
      
      // Check for different response formats
      let videoData = null;
      if (result && result.url) {
        videoData = result;
      } else if (Array.isArray(result) && result.length > 0 && result[0].url) {
        videoData = result[0];
      } else if (result && result.media && result.media.length > 0) {
        videoData = result.media[0];
      }

      if (videoData && videoData.url) {
        console.log('✅ Method 1 succeeded');
        return res.json({
          url: videoData.url,
          thumbnail: videoData.thumbnail || null,
          quality: 'HD'
        });
      }
    } catch (error) {
      console.log('⚠️ Method 1 failed:', error.message);
    }
  }

  // METHOD 2: Fallback to SnapSave API
  try {
    console.log('⏳ Method 2: Using SnapSave for:', videoUrl);
    const targetUrl = `https://snapsave.app/api/ajaxSearch?q=${encodeURIComponent(videoUrl)}&lang=en&type=reel`;
    const response = await fetch(targetUrl);
    const data = await response.json();

    if (data && data.links && data.links.length > 0) {
      console.log('✅ Method 2 succeeded');
      return res.json({
        url: data.links[0].download,
        thumbnail: data.thumbnail || null,
        quality: data.links[0].quality || 'HD'
      });
    } else {
      throw new Error('No links in SnapSave response');
    }
  } catch (error) {
    console.error('❌ Both methods failed:', error.message);
    return res.status(500).json({
      error: 'Failed to fetch media. Please check the URL or try again later.'
    });
  }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
