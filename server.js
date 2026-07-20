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

  // 🎯 3 DIFFERENT APIs - EK NA EK CHALEGA
  const apis = [
    {
      name: 'SnapSave',
      url: `https://snapsave.app/api/ajaxSearch?q=${encodeURIComponent(videoUrl)}&lang=en&type=reel`,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'application/json',
        'Referer': 'https://snapsave.app/',
        'Origin': 'https://snapsave.app'
      },
      parse: (data) => ({
        url: data.links?.[0]?.download || null,
        thumbnail: data.thumbnail || null,
        quality: data.links?.[0]?.quality || 'HD'
      })
    },
    {
      name: 'SocialDownloader',
      url: `https://socialdownloader.space/api/meta/download?url=${encodeURIComponent(videoUrl)}`,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'application/json'
      },
      parse: (data) => ({
        url: data.url || null,
        thumbnail: data.thumbnail || data.picture || null,
        quality: 'HD'
      })
    },
    {
      name: 'SaveInsta',
      url: `https://saveinsta.app/api/ajaxSearch?q=${encodeURIComponent(videoUrl)}&lang=en&type=reel`,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'application/json',
        'Referer': 'https://saveinsta.app/',
        'Origin': 'https://saveinsta.app'
      },
      parse: (data) => ({
        url: data.links?.[0]?.download || data.url || null,
        thumbnail: data.thumbnail || null,
        quality: data.links?.[0]?.quality || 'HD'
      })
    }
  ];

  // Try each API one by one
  for (const api of apis) {
    try {
      console.log(`⏳ Trying ${api.name}...`);
      
      const response = await fetch(api.url, {
        headers: api.headers,
        timeout: 10000
      });

      if (!response.ok) {
        console.log(`❌ ${api.name} failed: HTTP ${response.status}`);
        continue;
      }

      const data = await response.json();
      const result = api.parse(data);

      if (result.url) {
        console.log(`✅ ${api.name} worked!`);
        return res.json({
          url: result.url,
          thumbnail: result.thumbnail,
          quality: result.quality
        });
      } else {
        console.log(`❌ ${api.name} returned no URL`);
      }
    } catch (error) {
      console.log(`❌ ${api.name} error:`, error.message);
    }
  }

  // ❌ ALL APIs failed
  console.error('❌ All APIs failed for:', videoUrl);
  res.status(500).json({
    error: 'Unable to fetch video. Please try again or check if the URL is public.'
  });
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
