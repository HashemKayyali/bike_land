// convert-all-customers-replace.js
// Usage: node convert-all-customers-replace.js [QUALITY=85]
const fs = require('fs').promises;
const path = require('path');
const sharp = require('sharp');

const ROOT = path.resolve('images/customers');   // مكان مجلد customers
const QUALITY = parseInt(process.argv[2] || '85', 10);
const ALLOWED = new Set(['.jpg','.jpeg','.png']);
const WEBP = '.webp';

async function *walk(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) yield* walk(full);
    else if (e.isFile()) yield full;
  }
}

async function convertAndReplace(file) {
  const ext = path.extname(file).toLowerCase();
  if (!ALLOWED.has(ext)) return;

  const out = path.join(path.dirname(file), path.basename(file, ext) + WEBP);

  // إذا webp موجود وأحدث من الأصل → تخطّي
  try {
    const [s, d] = await Promise.all([fs.stat(file), fs.stat(out)]);
    if (d.mtimeMs >= s.mtimeMs) {
      await fs.unlink(file); // احذف الـ JPG لأنه صار عندك webp أحدث
      return;
    }
  } catch {}

  console.log('تحويل:', file, '→', out);
  const tmp = out + '.tmp';

  try {
    await sharp(file)
      .rotate()
      .webp({ quality: QUALITY, effort: 6 })
      .toFile(tmp);

    // استبدل الأصل بالـ webp
    await fs.rename(tmp, out);
    await fs.unlink(file);
  } catch (err) {
    console.error('خطأ في التحويل:', file, err.message);
    try { await fs.unlink(tmp); } catch {}
  }
}

(async () => {
  console.log(`جاري التحويل داخل: ${ROOT}, بجودة ${QUALITY}, مع حذف الأصل`);
  let count = 0;
  for await (const f of walk(ROOT)) {
    try {
      await convertAndReplace(f);
      count++;
    } catch (err) {
      console.error('خطأ في', f, err.message);
    }
  }
  console.log(`تم. عدد الملفات المعالجة: ${count}`);
})();
