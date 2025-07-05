// Tes ini memverifikasi bahwa paket dapat diimpor menggunakan ES Modules (import)

import assert from 'assert';

console.log('🧪 Running ES Modules (import) test...');

try {
  // Impor paket yang sudah di-build dari direktori dist
  // Kita menggunakan path lengkap untuk memastikan kita menguji file yang benar
  const { unaimytextHumanize, searchApk } from '../dist/index.mjs';

  // Verifikasi bahwa fungsi-fungsi tersebut ada
  assert.strictEqual(typeof unaimytextHumanize, 'function', 'unaimytextHumanize should be a function in ESM build');
  assert.strictEqual(typeof searchApk, 'function', 'searchApk should be a function in ESM build');

  console.log('✅ ES Modules test passed!');
  process.exit(0);
} catch (error) {
  console.error('❌ ES Modules test failed:', error);
  process.exit(1);
}