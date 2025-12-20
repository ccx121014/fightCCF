/*
  migrate.js
  Simple migration script that registers chapters by reading server/data/chapters
  For the prototype this script will list the available chapter files and create
  a chapters-index.json in server/data which aggregates basic metadata.
*/

const fs = require('fs');
const path = require('path');

const chaptersDir = path.join(__dirname, 'data', 'chapters');
const outFile = path.join(__dirname, 'data', 'chapters-index.json');

function migrate() {
  if (!fs.existsSync(chaptersDir)) {
    console.error('Chapters directory not found:', chaptersDir);
    process.exit(1);
  }

  const files = fs.readdirSync(chaptersDir).filter(f => f.endsWith('.json'));
  const index = files.map(f => {
    try {
      const content = JSON.parse(fs.readFileSync(path.join(chaptersDir, f), 'utf8'));
      return {
        id: content.id || f.replace('.json',''),
        title: content.title || 'Untitled',
        description: content.description || '',
        levels: Array.isArray(content.levels) ? content.levels.length : 0,
        file: f
      };
    } catch (e) {
      return { file: f, error: e.message };
    }
  });

  fs.writeFileSync(outFile, JSON.stringify(index, null, 2));
  console.log('Wrote', outFile);
}

migrate();
