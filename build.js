
const fs = require('node:fs');
const path = require('node:path');

const dir = path.join(__dirname, 'posts');
const items = [];

if (fs.existsSync(dir)) {
  for (const filename of fs.readdirSync(dir).filter(x => x.endsWith('.json') || x.endsWith('.md'))) {
    try {
      const content = fs.readFileSync(path.join(dir, filename), 'utf8');
      let post;

      if (filename.endsWith('.json')) {
        post = JSON.parse(content);
      } else {
        const match = content.match(/^---\s*\r?\n([\s\S]*?)\r?\n---\s*\r?\n?/);
        if (!match) continue;

        const metadata = match[1];
        post = {};

        for (const line of metadata.split(/\r?\n/)) {
          const field = line.match(/^([a-zA-Z_]+):\s*(.*)$/);
          if (field) {
            let value = field[2].trim();
            if ((value.startsWith('"') && value.endsWith('"')) ||
                (value.startsWith("'") && value.endsWith("'"))) {
              value = value.slice(1, -1);
            }
            post[field[1]] = value;
          }
        }

        post.body = content.slice(match[0].length).trim();
      }

      if (post.title) items.push(post);
    } catch (e) {
      console.warn('Publicação ignorada:', filename, e.message);
    }
  }
}

fs.writeFileSync(
  path.join(__dirname, 'posts-data.json'),
  JSON.stringify(items)
);

console.log(`${items.length} publicações do painel preparadas.`);
