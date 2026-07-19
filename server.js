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
    // 🔥 SNAP SAVE API (WORKING)
    const targetUrl = `https://snapsave.app/api/ajaxSearch?q=${encodeURIComponent(videoUrl)}&lang=en&type=reel`;
    console.log('⏳ Fetching from SnapSave:', targetUrl);

    const response = await fetch(targetUrl);
    const data = await response.json();

    console.log('📦 SnapSave Response:', JSON.stringify(data).substring(0, 200));

    // SnapSave ka response format check
    if (data && data.links && data.links.length > 0) {
      // Pehla link lo (HD quality)
      const bestLink = data.links.find(link => link.quality === 'HD') || data.links[0];
      res.json({
        url: bestLink.download,
        thumbnail: data.thumbnail || null,
        quality: bestLink.quality || 'HD'
      });
    } else {
      // Agar SnapSave fail ho, toh dusra API try karo
      console.log('⚠️ SnapSave failed, trying backup...');
      const backupUrl = `https://socialdownloader.space/api/meta/download?url=${encodeURIComponent(videoUrl)}`;
      const backupResponse = await fetch(backupUrl);
      const backupData = await backupResponse.json();

      if (backupData && backupData.url) {
        res.json({
          url: backupData.url,
          thumbnail: backupData.thumbnail || null,
          quality: 'HD'
        });
      } else {
        throw new Error('No media found from any source.');
      }
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
  console.log(`🚀 Proxy server running on port ${PORT}`);
});
