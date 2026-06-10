# Smart Eco Campus

🔗 **Live Deployment:** [https://smarteco-app.my.id/](https://smarteco-app.my.id/)

**Smart Eco Campus** adalah sebuah platform sistem cerdas terintegrasi yang dirancang untuk mendigitalisasi, memantau, dan mengelola konsumsi energi serta fasilitas gedung di lingkungan kampus secara real-time. Sistem ini memadukan teknologi Internet of Things (IoT) dengan Artificial Intelligence (AI) untuk menciptakan ekosistem kampus yang hemat energi, efisien, dan modern.

## 🚀 Fitur Utama

- **Real-Time IoT Telemetry & Control:** Pemantauan langsung (tegangan, arus, daya, kWh) menggunakan sensor PZEM-004T. Pengendalian jarak jauh untuk berbagai alat elektronik (Lampu, AC, Kipas, Stopkontak PC) melalui *relay* cerdas berbasis ESP32.
- **AI-Powered Occupancy Detection (YOLOv8):** Integrasi *live camera feed* berbasis *machine learning* untuk menghitung jumlah orang (okupansi) di dalam ruangan secara *real-time*.
- **Smart Energy Auto-Cutoff:** Fitur otomatisasi pintar yang akan memutuskan aliran listrik secara otomatis jika ruangan terdeteksi kosong oleh AI selama durasi tertentu, sehingga mencegah pemborosan energi.
- **Multi-Tier Role-Based Access Control (RBAC):** Sistem otentikasi aman berlapis untuk berbagai tingkat pengguna:
  - **Super Admin:** Mengelola infrastruktur secara keseluruhan (Gedung, User, Perangkat).
  - **Admin Gedung:** Mengontrol dan memantau ruangan serta perangkat IoT khusus pada gedung yang ditugaskan.
  - **Executive (Pimpinan):** Memantau analitik makro, tren penggunaan, serta efisiensi anggaran listrik secara keseluruhan.
- **Audit & Activity Logs:** Perekaman aktivitas secara detail. Seluruh intervensi manual maupun aksi otomatis dari AI tercatat dengan transparan untuk kebutuhan audit keamanan dan evaluasi sistem.
- **Dynamic Topology Management:** Registrasi perangkat cerdas (ESP32) baru secara instan dengan satu klik saat terhubung ke jaringan kampus.

## 🛠️ Teknologi yang Digunakan

Aplikasi ini dibangun di atas *stack* modern untuk memastikan skalabilitas, kecepatan, serta keamanan:
- **Framework Utama:** [Next.js](https://nextjs.org/) (App Router) dengan TypeScript.
- **Styling & UI Components:** [Tailwind CSS](https://tailwindcss.com/) & [Shadcn UI](https://ui.shadcn.com/) dengan tema kustom *Cyber Eco-Dark*.
- **Database & Realtime Backend:** [Firebase Realtime Database](https://firebase.google.com/) (Telemetri IoT sekejap mata) & Cloud Firestore (Database Relasional).
- **Authentication:** NextAuth.js.
- **State Management:** Zustand & React Hooks teroptimasi.