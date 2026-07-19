const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('✅ ReelJet Proxy is Running!');
});

app.get('/api/download', async (req, res) => {
  const videoUrl = req.query.url;

  if (!videoUrl) {
    return res.status(400).json({ error: 'URL parameter is required' });
  }

  try {
    const targetUrl = `https://snapsave.app/api/ajaxSearch?q=${encodeURIComponent(videoUrl)}&lang=en&type=reel`;
    console.log('⏳ Proxying to:', targetUrl);

    const response = await fetch(targetUrl);
    const data = await response.json();

    if (data && data.links && data.links.length > 0) {
      res.json({
        url: data.links[0].download,
        thumbnail: data.thumbnail || null,
        quality: data.links[0].quality || 'HD'
      });
    } else {
      throw new Error('No media found.');
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
    res.status(500).json({
      error: error.message || 'Failed to fetch media.'
    });
  }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`🚀 Proxy running on port ${PORT}`);
});
