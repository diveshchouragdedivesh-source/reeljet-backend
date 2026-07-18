// SABSE PEHLE YE LINE AAYEGI - AGAR YE NA DIKHE TOH NODE HI NAHI CHAL RAHA
console.log("🚀 SERVER FILE CHAL GAYI");

const express = require('express');
console.log("✅ Express loaded");

const cors = require('cors');
console.log("✅ Cors loaded");

// INSTAGRAM PACKAGE LOAD KARO (AGAR YE FAIL HOGA TOH ERROR DIKHEGA)
const ig = require('instagram-url-direct');
console.log("✅ Instagram package loaded");

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

    if (!result || !result.url) {
      throw new Error('No media found. Make sure the link is public.');
    }

    res.json({
      url: result.url,
      thumbnail: result.thumbnail || null,
      quality: 'HD'
    });

  } catch (error) {
    console.error('❌ Error:', error.message);
    res.status(500).json({
      error: error.message || 'Failed to fetch media. Please check the URL.'
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
