/**
 * Script ini digunakan HANYA untuk pengetesan lokal (Local Development).
 * Script ini mensimulasikan AWS EventBridge yang mengirim HTTP request
 * ke endpoint Cron secara periodik.
 * 
 * Cara menjalankan:
 * node scripts/local-scheduler.js
 */

const http = require('http');

const PORT = 3000; // Pastikan ini sesuai dengan port pnpm dev Anda
const ENDPOINT = '/api/cron/auto-revert';
const CRON_SECRET = process.env.AWS_CRON_SECRET || 'smartcampus-secret-key-123';

// Fungsi untuk mengeksekusi trigger API
function triggerCronJob() {
  console.log(`\n[${new Date().toLocaleTimeString()}] Men-trigger simulasi AWS EventBridge...`);
  
  const options = {
    hostname: 'localhost',
    port: PORT,
    path: ENDPOINT,
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${CRON_SECRET}`
    }
  };

  const req = http.request(options, (res) => {
    let data = '';

    res.on('data', (chunk) => {
      data += chunk;
    });

    res.on('end', () => {
      console.log(`Status Code: ${res.statusCode}`);
      console.log(`Response: ${data}`);
      console.log('--------------------------------------------------');
    });
  });

  req.on('error', (error) => {
    console.error(`[Error] Gagal mengakses lokal server: ${error.message}`);
    console.log('Pastikan "pnpm dev" sedang berjalan di tab terminal lain!');
  });

  req.end();
}

console.log('==================================================');
console.log(' AWS EventBridge Local Simulator Berjalan');
console.log('==================================================');
console.log(`- Endpoint : http://localhost:${PORT}${ENDPOINT}`);
console.log('- Interval : 1 Menit (Untuk keperluan testing)');
console.log('- Tekan Ctrl+C untuk menghentikan script');
console.log('--------------------------------------------------');

// Trigger pertama kali secara langsung saat dijalankan
triggerCronJob();

// Set interval per 1 menit (60000 ms) untuk simulasi
// Dalam produksi sebenarnya (AWS), ini diatur ke 1 hari sekali (00:00 WIB)
setInterval(triggerCronJob, 60000);
