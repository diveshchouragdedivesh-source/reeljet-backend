console.log("🚀 Server starting...");
const express = require('express');
const cors = require('cors');
const ig = require('instagram-url-direct');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => res.send('✅ ReelJet Backend is Running!'));

app.get('/api/download', async (req, res) => {
  const url = req.query.url;
  if (!url) return res.status(400).json({ error: 'URL required' });
  try {
    const result = await ig.instagram(url);
    res.json({ url: result.url, thumbnail: result.thumbnail || null, quality: 'HD' });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`🚀 Running on port ${PORT}`));
