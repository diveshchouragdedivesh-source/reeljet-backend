const express = require('express');
const cors = require('cors');
const { instagramdl } = require('instagram-dl');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('ReelJet Backend is running smoothly!');
});

// Instagram download route
app.get('/download', async (req, res) => {
    const url = req.query.url;
    if (!url) return res.status(400).send('URL is required');

    try {
        const data = await instagramdl(url);
        res.json(data);
    } catch (error) {
        res.status(500).send('Error fetching video: ' + error.message);
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
