console.log("🚀 1. Node chal raha hai!");

const express = require('express');
console.log("🚀 2. Express load ho gaya");

const app = express();
console.log("🚀 3. App ban gaya");

app.get('/', (req, res) => {
  res.send('✅ Server OK!');
});

const PORT = process.env.PORT || 3000;
console.log(`🚀 4. Port ${PORT} par listen kar raha hoon`);

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
