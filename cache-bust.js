// cache-bust.js
// Usage: node cache-bust.js
const fs = require('fs').promises;
const fg = require('fast-glob');

async function main() {
  const ts = Date.now(); // رقم جديد مع كل تشغيل
  const files = await fg(['**/*.{html,css,js}'], { ignore: ['node_modules/**'] });

  for (const file of files) {
    let content = await fs.readFile(file, 'utf8');
    let changed = false;

    // عدل روابط الصور <img src="...">
    content = content.replace(/(src=["'][^"']+\.(?:png|jpg|jpeg|webp|gif|svg))(["'])/gi, (m, p1, p2) => {
      changed = true;
      return p1 + `?v=${ts}` + p2;
    });

    // عدل روابط الصور داخل CSS background-image
    content = content.replace(/(url\([^)]*\.(?:png|jpg|jpeg|webp|gif|svg))(.*?\))/gi, (m, p1, p2) => {
      changed = true;
      return p1 + `?v=${ts}` + p2;
    });

    if (changed) {
      await fs.writeFile(file, content, 'utf8');
      console.log(`✔ Updated cache-busting in ${file}`);
    }
  }
  console.log('Done. Cache bust applied.');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
