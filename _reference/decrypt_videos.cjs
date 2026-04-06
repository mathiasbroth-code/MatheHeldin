#!/usr/bin/env node
/**
 * Entschlüsselt alle 140 Fredo-4-Lernvideos aus dem Cornelsen-ZIP.
 * Liest /tmp/video_manifest.json für die Zuordnung.
 */
const crypto = require('crypto');
const StreamZip = require('/tmp/cornelsen_app/node_modules/node-stream-zip');
const fs = require('fs');
const path = require('path');

const ZIP_PATH = '/Applications/CornelsenOfflineLernen.app/Contents/Resources/uma/220055385_data.zip';
const OUT_DIR = path.join(__dirname, 'videos');
const MANIFEST_PATH = '/tmp/video_manifest.json';

// Entschlüsselungsparameter
const api = Buffer.from('YWVzLTEyOC1jYmN8RCtEeEpTRn0yQjtrLTtDfQ==', 'base64');
const params = api.toString('ascii').split('|');
const ALGO = params[0];
const KEY = params[1];
const IV = KEY.split('').reverse().join('');

async function main() {
  const manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf8'));

  if (!fs.existsSync(OUT_DIR)) {
    fs.mkdirSync(OUT_DIR, { recursive: true });
  }

  const zip = new StreamZip.async({ file: ZIP_PATH });
  const total = manifest.length;
  let done = 0;
  let skipped = 0;
  let errors = 0;

  for (const video of manifest) {
    const outPath = path.join(OUT_DIR, video.cleanName);

    // Skip if already decrypted
    if (fs.existsSync(outPath)) {
      done++;
      skipped++;
      process.stdout.write(`\r[${done}/${total}] Skipped (exists): ${video.cleanName}`);
      continue;
    }

    try {
      const decipher = crypto.createDecipheriv(ALGO, KEY, IV);
      const data = await zip.entryData(video.zipEntry);
      const decrypted = Buffer.concat([decipher.update(data), decipher.final()]);
      fs.writeFileSync(outPath, decrypted);
      done++;
      process.stdout.write(`\r[${done}/${total}] Decrypted: ${video.cleanName}                    `);
    } catch (err) {
      errors++;
      done++;
      console.error(`\n[ERROR] ${video.cleanName}: ${err.message}`);
    }
  }

  await zip.close();
  console.log(`\n\nDone! ${done - errors - skipped} decrypted, ${skipped} skipped, ${errors} errors.`);
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
