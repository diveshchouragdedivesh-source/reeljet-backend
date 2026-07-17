const express = require('express');
const cors = require('cors');
const instatouch = require('instatouch');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('ReelJet Backend is running perfectly!');
});

// Instagram download route
app.get('/download', async (req, res) => {
    const url = req.query.url;
    if (!url) return res.status(400).send('URL is required');

    try {
        // Instatouch ka sahi tarika
        const data = await instatouch.getPostMeta(url, { session: ' ' });
        res.json(data);
    } catch (error) {
        res.status(500).send('Error fetching data: ' + error.message);
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
