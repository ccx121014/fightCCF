/*
  Minimal Express server for prototype.
  Serves static files from ../public and provides a small API to list/serve chapters.
*/

const express = require('express');
const path = require('path');
const fs = require('fs');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Serve frontend
app.use('/', express.static(path.join(__dirname, '..', 'public')));

// Simple API: list chapters (reads files from server/data/chapters)
const chaptersDir = path.join(__dirname, 'data', 'chapters');

app.get('/api/chapters', (req, res) => {
  try {
    const files = fs.readdirSync(chaptersDir).filter(f => f.endsWith('.json'));
    const chapters = files.map(f => JSON.parse(fs.readFileSync(path.join(chaptersDir, f), 'utf8')));
    res.json(chapters);
  } catch (err) {
    console.error('Error reading chapters:', err);
    res.status(500).json({ error: 'Could not load chapters' });
  }
});

app.get('/api/chapters/:id', (req, res) => {
  const id = req.params.id;
  const file = path.join(chaptersDir, `${id}.json`);
  if (!fs.existsSync(file)) return res.status(404).json({ error: 'Chapter not found' });
  try {
    const data = JSON.parse(fs.readFileSync(file, 'utf8'));
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Bad chapter file' });
  }
});

app.listen(PORT, () => console.log(`Server listening on http://localhost:${PORT}`));

module.exports = app;
