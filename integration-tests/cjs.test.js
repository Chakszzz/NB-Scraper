// Tes ini memverifikasi bahwa paket dapat diimpor menggunakan CommonJS (require)

const assert = require('assert');

console.log('🧪 Running CommonJS (require) test...');

try {
  // Impor paket yang sudah di-build dari direktori dist
  const nbScraper = require('../dist/cjs/index.js');

  // Verifikasi bahwa salah satu fungsi ada dan merupakan sebuah fungsi
  assert.strictEqual(typeof nbScraper.unaimytextHumanize, 'function', 'unaimytextHumanize should be a function in CJS build');
  assert.strictEqual(typeof nbScraper.searchApk, 'function', 'searchApk should be a function in CJS build');
  
  console.log('✅ CommonJS test passed!');
  process.exit(0);
} catch (error) {
  console.error('❌ CommonJS test failed:', error);
  process.exit(1);
}