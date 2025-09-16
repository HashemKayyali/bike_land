// bump-version.js
const fs = require('fs');
const fg = require('fast-glob');

const NEW_VERSION = 3; // غيّر الرقم عند كل تحديث

(async () => {
  const files = await fg(['**/*.html'], { ignore: ['node_modules'] });
  for (const file of files) {
    let content = fs.readFileSync(file, 'utf8');
    const updated = content.replace(/\?v=\d+/g, `?v=${NEW_VERSION}`);
    if (updated !== content) {
      fs.writeFileSync(file, updated, 'utf8');
      console.log(`✔ Updated ${file}`);
    }
  }
})();
