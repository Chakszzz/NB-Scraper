// Tes ini memverifikasi bahwa paket dapat diimpor menggunakan ES Modules (import)

import assert from 'assert';

console.log('🧪 Running ES Modules (import) test...');

try {
  // --- PERBAIKAN ---
  // Gunakan namespace import (*) untuk menangkap semua ekspor ke dalam satu objek.
  // Ini lebih robust daripada named import jika ada masalah dengan bundling.
  const nbScraper = await import('../dist/index.mjs');

  // Verifikasi bahwa fungsi-fungsi tersebut ada sebagai properti dari objek modul
  assert.strictEqual(typeof nbScraper.unaimytextHumanize, 'function', 'unaimytextHumanize should be a function in ESM build');
  assert.strictEqual(typeof nbScraper.searchApk, 'function', 'searchApk should be a function in ESM build');

  console.log('✅ ES Modules test passed!');
  process.exit(0);
} catch (error) {
  console.error('❌ ES Modules test failed:', error);
  process.exit(1);
}