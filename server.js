const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('✅ ReelJet Proxy is LIVE!');
});

app.get('/api/download', async (req, res) => {
  const videoUrl = req.query.url;

  if (!videoUrl) {
    return res.status(400).json({ error: 'URL parameter is required' });
  }

  try {
    // 🔥 YEH WORKING PROXY API HAI
    const targetUrl = `https://socialdownloader.space/api/meta/download?url=${encodeURIComponent(videoUrl)}`;
    console.log('⏳ Proxying to:', targetUrl);

    const response = await fetch(targetUrl);
    const data = await response.json();

    if (data && data.url) {
      res.json({
        url: data.url,
        thumbnail: data.thumbnail || data.picture || null,
        quality: 'HD'
      });
    } else {
      throw new Error('No media found from proxy.');
    }

  } catch (error) {
    console.error('❌ Proxy Error:', error.message);
    res.status(500).json({
      error: error.message || 'Failed to fetch media. Please check the URL.'
    });
  }
});

// 🔥 PORT 0 = Railway automatically allocate karega free port
const PORT = process.env.PORT || 0;
const server = app.listen(PORT, () => {
  console.log(`🚀 Proxy running on port ${server.address().port}`);
});
