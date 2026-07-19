const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('✅ ReelJet Proxy (SnapSave) is LIVE!');
});

app.get('/api/download', async (req, res) => {
  const videoUrl = req.query.url;

  if (!videoUrl) {
    return res.status(400).json({ error: 'URL parameter is required' });
  }

  try {
    // 🔥 SnapSave API (Option 1) - Direct Call
    const targetUrl = `https://snapsave.app/api/ajaxSearch?q=${encodeURIComponent(videoUrl)}&lang=en&type=reel`;
    console.log('⏳ Proxying to SnapSave:', targetUrl);

    const response = await fetch(targetUrl);
    const data = await response.json();

    // SnapSave ka response format
    if (data && data.links && data.links.length > 0) {
      res.json({
        url: data.links[0].download,    // Video download link
        thumbnail: data.thumbnail || null,
        quality: data.links[0].quality || 'HD'
      });
    } else {
      throw new Error('No media found from SnapSave.');
    }

  } catch (error) {
    console.error('❌ SnapSave Proxy Error:', error.message);
    res.status(500).json({
      error: error.message || 'Failed to fetch media. Please check the URL.'
    });
  }
});

// Railway ka default PORT use karo
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`🚀 Proxy server running on port ${PORT}`);
});
