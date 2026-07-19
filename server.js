const express = require('express');
const cors = require('cors');
const ig = require('instagram-url-direct');
const axios = require('axios');

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
    // Pehle instagram-url-direct try karo
    console.log('⏳ Trying instagram-url-direct...');
    const result = await ig.instagram(videoUrl);
    
    if (result && result.url) {
      return res.json({
        url: result.url,
        thumbnail: result.thumbnail || null,
        quality: 'HD'
      });
    }
  } catch (error) {
    console.log('❌ instagram-url-direct failed:', error.message);
  }

  // Agar upar fail ho, toh fallback API use karo
  try {
    console.log('⏳ Trying fallback API...');
    const response = await axios.get('https://api.obtaindown.com/obApi/api/analysis', {
      params: { url: videoUrl },
      headers: { 'Content-Type': 'application/json' }
    });

    if (response.data && response.data.url) {
      return res.json({
        url: response.data.url,
        thumbnail: response.data.thumbnail || null,
        quality: 'HD'
      });
    }
  } catch (error) {
    console.log('❌ Fallback API also failed:', error.message);
  }

  // Dono fail ho gaye
  res.status(500).json({
    error: 'Failed to fetch media. Please check the URL or try again later.'
  });
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
