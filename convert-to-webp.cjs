// File: convert-to-webp.cjs
// يحوّل كل الصور داخل images/customers/* إلى WebP داخل thumbs/

const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const ROOT = path.resolve("images/customers");
const OUT_SUBDIR = "thumbs";     // مجلد الإخراج داخل كل فولدر
const MAX_WIDTH = 640;           // عرض الثمبنيل

async function processImage(inputPath, outputPath) {
  try {
    await sharp(inputPath)
      .resize({ width: MAX_WIDTH, withoutEnlargement: true })
      .webp({ quality: 80 })
      .toFile(outputPath);
    console.log("✔️", outputPath);
  } catch (err) {
    console.error("❌", inputPath, err.message);
  }
}

function walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(fullPath);
    } else if (/\.(png|jpe?g)$/i.test(entry.name)) {
      const folder = path.dirname(fullPath);
      const outFolder = path.join(folder, OUT_SUBDIR);
      fs.mkdirSync(outFolder, { recursive: true });
      const baseName = path.parse(entry.name).name + ".webp";
      const outPath = path.join(outFolder, baseName);
      processImage(fullPath, outPath);
    }
  }
}

// تأكد إن المسار موجود
if (!fs.existsSync(ROOT)) {
  console.error("لم يتم العثور على المجلد:", ROOT);
  process.exit(1);
}

walk(ROOT);
