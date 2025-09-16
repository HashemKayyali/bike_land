// convert-to-webp.js
const fs = require('fs').promises;
const path = require('path');
const sharp = require('sharp');

const DIR = path.resolve(process.argv[2] || 'images/events');
const QUALITY = parseInt(process.argv[3] || '85', 10);

const exts = new Set(['.jpg','.jpeg','.png','.gif','.tiff','.bmp','.webp']);

(async () => {
  try {
    const files = await fs.readdir(DIR);
    for (const f of files) {
      const full = path.join(DIR, f);
      const stat = await fs.stat(full);
      if (!stat.isFile()) continue;

      const ext = path.extname(f).toLowerCase();
      if (!exts.has(ext) || ext === '.webp') continue; // تجاهل ملفات webp الحالية

      console.log('Processing', f);
      try {
        // special: if GIF animated, sharp will read first frame only (not animated).
        // For animated GIF -> animated WebP you'd need gif2webp (libwebp) or gifsicle+webpmux.
        await sharp(full)
          .webp({ quality: QUALITY })
          .toFile(full + '.webp.tmp');

        // حذّف الأصلي وغيّر الإسم
        await fs.unlink(full);
        await fs.rename(full + '.webp.tmp', path.join(DIR, path.basename(f, ext) + '.webp'));
      } catch (err) {
        console.error('Failed converting', f, err.message);
        // clean up tmp if exists
        try { await fs.unlink(full + '.webp.tmp'); } catch {}
      }
    }
    console.log('Done.');
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
