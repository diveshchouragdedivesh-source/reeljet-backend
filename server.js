const express = require('express');
const cors = require('cors');
const { instagram } = require('nexo-aio-downloader');

const app = express();
app.use(cors());
app.use(express.json());

// Health check (jaan hai toh ye chalega)
app.get('/', (req, res) => {
  res.send('✅ ReelJet Backend is Running!');
});

// 🔥 YAHI TUMHARA DOWNLOAD ENDPOINT HAI
app.get('/api/download', async (req, res) => {
  const videoUrl = req.query.url;

  // Agar URL nahi aaya toh error bhejo
  if (!videoUrl) {
    return res.status(400).json({ error: 'URL parameter is required' });
  }

  try {
    console.log(`⏳ Fetching: ${videoUrl}`);
    
    // 🔥 MAGIC LINE - Direct Instagram se video laayega
    const result = await instagram(videoUrl);

    // Agar result khali aaya toh
    if (!result || result.length === 0) {
      throw new Error('No media found. Make sure the link is public.');
    }

    // Pehla media item lo (video ya image)
    const media = result[0];
    const downloadUrl = media.url;
    const thumbnail = media.thumbnail || null;

    // Format jo teri website samajhti hai
    res.json({
      url: downloadUrl,
      thumbnail: thumbnail,
      quality: 'HD'
    });

  } catch (error) {
    console.error('❌ Error:', error.message);
    res.status(500).json({
      error: error.message || 'Failed to fetch media. Please check the URL.'
    });
  }
});

// Server start karo
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
