const fs = require('node:fs');
const path = require('node:path');
const dir = path.join(__dirname, 'posts');
const items = [];
if (fs.existsSync(dir)) {
  for (const filename of fs.readdirSync(dir).filter(x => x.endsWith('.json'))) {
    try {
      const post = JSON.parse(fs.readFileSync(path.join(dir, filename), 'utf8'));
      if (post.title) items.push(post);
    } catch (e) { console.warn('Publicação ignorada:', filename, e.message); }
  }
}
fs.writeFileSync(path.join(__dirname, 'posts-data.json'), JSON.stringify(items));
console.log(`${items.length} publicações do painel preparadas.`);
