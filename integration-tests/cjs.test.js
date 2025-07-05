// Tes ini memverifikasi bahwa paket dapat diimpor menggunakan CommonJS (require)

const assert = require('assert');

console.log('🧪 Running CommonJS (require) test...');

try {
  // --- PERBAIKAN ---
  // Arahkan ke file output CJS yang benar dari tsup
  const nbScraper = require('../dist/index.js');

  // Verifikasi bahwa salah satu fungsi ada dan merupakan sebuah fungsi
  assert.strictEqual(typeof nbScraper.unaimytextHumanize, 'function', 'unaimytextHumanize should be a function in CJS build');
  assert.strictEqual(typeof nbScraper.uploadImage, 'function', 'uploadImage should be a function in CJS build');
  assert.strictEqual(typeof nbScraper.translateEcommerceImageFromUrl, 'function', 'translateEcommerceImageFromUrl should be a function in CJS build');
  assert.strictEqual(typeof nbScraper.translateImage, 'function', 'translateImage should be a function in CJS build');
  assert.strictEqual(typeof nbScraper.translateManga, 'function', 'translateManga should be a function in CJS build');
  assert.strictEqual(typeof nbScraper.ffstalk, 'function', 'ffstalk should be a function in CJS build');
  assert.strictEqual(typeof nbScraper.ssyoutube, 'function', 'ssyoutube should be a function in CJS build')
  assert.strictEqual(typeof nbScraper.searchApk, 'function', 'searchApk should be a function in CJS build');
  
  console.log('✅ CommonJS test passed!');
  process.exit(0);
} catch (error) {
  console.error('❌ CommonJS test failed:', error);
  process.exit(1);
}