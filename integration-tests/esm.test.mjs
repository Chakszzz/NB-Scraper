// Tes ini memverifikasi bahwa paket dapat diimpor menggunakan ES Modules (import)

import assert from 'assert';

console.log('🧪 Running ES Modules (import) test...');

try {
  // --- PERBAIKAN ---
  // Arahkan ke file output ESM yang benar dari tsup
  const nbScraper = await import('../dist/index.mjs');

  // Verifikasi bahwa fungsi-fungsi tersebut ada sebagai properti dari objek modul
  assert.strictEqual(typeof nbScraper.unaimytextHumanize, 'function', 'unaimytextHumanize should be a function in ESM build');
  assert.strictEqual(typeof nbScraper.ffstalk, 'function', 'ffstalk should be a function in ESM build')
  assert.strictEqual(typeof nbScraper.ssyoutube, 'function', 'ssyoutube should be a function in ESM build')
  assert.strictEqual(typeof nbScraper.searchApk, 'function', 'searchApk should be a function in ESM build');
  assert.strictEqual(typeof nbScraper.uploadImage, 'function', 'uploadImage should be a function in ESM build');
  assert.strictEqual(typeof nbScraper.translateEcommerceImageFromUrl, 'function', 'translateEcommerceImageFromUrl should be a function in ESM build');
  assert.strictEqual(typeof nbScraper.translateImage, 'function', 'translateImage should be a function in ESM build');
  assert.strictEqual(typeof nbScraper.translateManga, 'function', 'translateManga should be a function in ESM build');
  console.log('✅ ES Modules test passed!');
  process.exit(0);
} catch (error) {
  console.error('❌ ES Modules test failed:', error);
  process.exit(1);
}