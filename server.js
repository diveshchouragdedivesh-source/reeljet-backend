const express = require('express');
const cors = require('cors');

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

  console.log('📥 Received URL:', videoUrl);

  // 🔥 PROXY KE ZARIYE API CALL
  const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent('https://socialdownloader.space/api/meta/download?url=' + encodeURIComponent(videoUrl))}`;

  try {
    console.log('⏳ Proxying via allorigins...');
    const response = await fetch(proxyUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();

    if (data && data.url) {
      console.log('✅ Video found!');
      return res.json({
        url: data.url,
        thumbnail: data.thumbnail || data.picture || null,
        quality: 'HD'
      });
    } else {
      throw new Error('No video URL in response');
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
    res.status(500).json({
      error: 'Failed to fetch video. Please try again.'
    });
  }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
