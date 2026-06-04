smart-eco-campus/
├── public/                         # Aset statis (Logo, Icon, Gambar, Favicon)
├── src/
│   ├── app/                        # [ROUTING & ORCHESTRATION LAYER]
│   │   ├── layout.tsx              # Root Layout (NextAuth, Query/Theme Providers)
│   │   ├── page.tsx                # Landing Page Utama (Opsional)
│   │   ├── (auth)/                 # Route Group: Otentikasi
│   │   │   └── login/
│   │   │       └── page.tsx        # Halaman Login Gateway
│   │   ├── (dashboard)/            # Route Group: Panel Utama (UI Shell)
│   │   │   ├── layout.tsx          # Wrapper Sidebar, Navbar, & Role Guard
│   │   │   ├── super-admin/
│   │   │   │   └── page.tsx        # Dashboard Manajemen User & Perangkat Baru
│   │   │   ├── admin-gedung/
│   │   │   │   └── page.tsx        # Dashboard Kontrol Relay & Live Stream YOLOv8
│   │   │   └── executive/
│   │   │       └── page.tsx        # Dashboard Analitik Finansial & Trendline
│   │   └── api/                    # Next.js Route Handlers (BFF / API Bridges)
│   │
│   ├── features/                   # [BUSINESS LOGIC LAYER] (Inti Aplikasi per Modul PRD)
│   │   ├── auth/                   # Modul 1: RBAC & Login
│   │   │   ├── components/         # LoginForm, RoleGuard
│   │   │   ├── hooks/              # useAuth, useSessionRole
│   │   │   ├── services/           # auth-api.ts
│   │   │   └── index.ts            # <--- PUBLIC API GATEWAY (Ekspor resmi untuk luar)
│   │   │
│   │   ├── iot-control/            # Modul 2 & 3: Telemetri PZEM & Sakelar Relay
│   │   │   ├── components/         # DeviceCard, ManualSwitch, PZEMGauge
│   │   │   ├── hooks/              # useLiveMetrics, useManualOverride
│   │   │   ├── services/           # firebase-iot-service.ts
│   │   │   ├── constants/          # (FEATURE CONSTANTS) Status Alat, Batas Delay
│   │   │   │   └── iot-config.ts   
│   │   │   ├── types/              # iot-types.ts
│   │   │   └── index.ts            # <--- PUBLIC API GATEWAY
│   │   │
│   │   ├── ai-vision/              # Modul 2: YOLOv8 Stream & Occupancy Counting
│   │   │   ├── components/         # CameraFeed, DetectionStatus
│   │   │   ├── hooks/              # useYoloStream
│   │   │   └── index.ts            # <--- PUBLIC API GATEWAY
│   │   │
│   │   ├── analytics/              # Modul 4: Agregasi Data Hadoop Big Data
│   │   │   ├── components/         # FinancialBarChart, TrendlineChart
│   │   │   ├── services/           # hadoop-analytics-api.ts
│   │   │   ├── utils/              # format-currency.ts (Konversi kWh -> IDR)
│   │   │   └── index.ts            # <--- PUBLIC API GATEWAY
│   │   │
│   │   └── audit-logs/             # Modul 4: Riwayat Sistem (AI vs Manual)
│   │       ├── components/         # LogTable, ActivityFeed
│   │       ├── services/           # audit-api.ts
│   │       └── index.ts            # <--- PUBLIC API GATEWAY
│   │
│   ├── components/                 # [SHARED UI LAYER] (Generic Component / Reusable)
│   │   ├── ui/                     # Shadcn Atoms (Button, Input, Card, Badge, Dialog)
│   │   └── shared/                 # Molecules Shell (Sidebar, Navbar, MobileNav)
│   │
│   ├── constants/                  # [GLOBAL CONSTANTS]
│   │   ├── roles.ts                # Variabel Baku: SUPER_ADMIN, ADMIN_GEDUNG, EXECUTIVE
│   │   ├── routes.ts               # Pemetaan path URL untuk navigasi statis
│   │   └── env.ts                  # Pembacaan dan validasi environment variables
│   │
│   ├── lib/                        # [INFRASTRUCTURE CONFIG & UTILS]
│   │   ├── firebase.ts             # Inisialisasi Firebase Client / Admin SDK
│   │   ├── hadoop-client.ts        # Konfigurasi Akses WebHDFS Hadoop API
│   │   └── utils.ts                # Helper cn() bawaan Shadcn untuk Tailwind Merge
│   │
│   ├── store/                      # [GLOBAL STATE MANAGEMENT]
│   │   └── use-global-store.ts     # Zustand untuk sinkronisasi state lintas-fitur
│   │
│   ├── hooks/                      # [GENERIC GLOBAL HOOKS]
│   │   ├── use-toast.ts            # Hook pemicu notifikasi pop-up
│   │   └── use-debounce.ts         # Hook penunda input (optimasi performa)
│   │
│   └── types/                      # [GLOBAL TYPES DEFINITIONS]
│       └── next-auth.d.ts          # Ekstensi tipe data session untuk menyertakan Role
│
├── tailwind.config.ts              # Custom tema Cyber Eco-Dark
├── next.config.ts                  # Konfigurasi Next.js (optimasi image domain, dll)
└── package.json                    # Daftar Dependencies (Shadcn, Zustand, Firebase, dll)