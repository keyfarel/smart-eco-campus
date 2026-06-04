import fs from "fs"
import path from "path"
import { Building } from "@/features/building-management/types/building"
import { isFirebaseReady, db } from "@/lib/firebase"
import { collection, getDocs, doc, setDoc, deleteDoc, writeBatch } from "firebase/firestore"

const dbPath = path.join(process.cwd(), "src/features/building-management/data/buildings.json")

// Inisialisasi data bawaan dengan Standar Technical UID (Building & Room)
const DEFAULT_BUILDINGS: Building[] = [
  {
    id: "bld_sipil_001",
    code: "GS",
    name: "Gedung Sipil",
    floorsCount: 8,
    roomsCount: 32,
    activeDevicesCount: 96,
    createdAt: 1779005000,
    rooms: [
      // Lantai 5
      { id: "bld_sipil_001_f5_rt1", code: "RT 1", name: "R. Kelas Teori 1", floor: 5, capacity: 40 },
      { id: "bld_sipil_001_f5_rt2", code: "RT 2", name: "R. Kelas Teori 2", floor: 5, capacity: 40 },
      { id: "bld_sipil_001_f5_rt3", code: "RT 3", name: "R. Kelas Teori 3", floor: 5, capacity: 40 },
      { id: "bld_sipil_001_f5_rt4", code: "RT 4", name: "R. Kelas Teori 4", floor: 5, capacity: 40 },
      { id: "bld_sipil_001_f5_rt5", code: "RT 5", name: "R. Kelas Teori 5", floor: 5, capacity: 40 },
      { id: "bld_sipil_001_f5_rt6", code: "RT 6", name: "R. Kelas Teori 6", floor: 5, capacity: 40 },
      { id: "bld_sipil_001_f5_rt7", code: "RT 7", name: "R. Kelas Teori 7", floor: 5, capacity: 40 },
      { id: "bld_sipil_001_f5_lpy1", code: "LPY 1", name: "Lab. Proyek 1", floor: 5, capacity: 40 },
      // Lantai 6
      { id: "bld_sipil_001_f6_lsi1", code: "LSI 1", name: "Lab. Sistem Informasi 1", floor: 6, capacity: 40 },
      { id: "bld_sipil_001_f6_lsi2", code: "LSI 2", name: "Lab. Sistem Informasi 2", floor: 6, capacity: 40 },
      { id: "bld_sipil_001_f6_lsi3", code: "LSI 3", name: "Lab. Sistem Informasi 3", floor: 6, capacity: 40 },
      { id: "bld_sipil_001_f6_lpy2", code: "LPY 2", name: "Lab. Proyek 2", floor: 6, capacity: 40 },
      { id: "bld_sipil_001_f6_lpy3", code: "LPY 3", name: "Lab. Proyek 3", floor: 6, capacity: 40 },
      // Lantai 7
      { id: "bld_sipil_001_f7_lpr1", code: "LPR 1", name: "Lab. Pemrograman 1", floor: 7, capacity: 40 },
      { id: "bld_sipil_001_f7_lpr2", code: "LPR 2", name: "Lab. Pemrograman 2", floor: 7, capacity: 40 },
      { id: "bld_sipil_001_f7_lpr3", code: "LPR 3", name: "Lab. Pemrograman 3", floor: 7, capacity: 40 },
      { id: "bld_sipil_001_f7_lpr4", code: "LPR 4", name: "Lab. Pemrograman 4", floor: 7, capacity: 40 },
      { id: "bld_sipil_001_f7_lpr5", code: "LPR 5", name: "Lab. Pemrograman 5", floor: 7, capacity: 40 },
      { id: "bld_sipil_001_f7_lpr6", code: "LPR 6", name: "Lab. Pemrograman 6", floor: 7, capacity: 40 },
      { id: "bld_sipil_001_f7_lpr7", code: "LPR 7", name: "Lab. Pemrograman 7", floor: 7, capacity: 40 },
      { id: "bld_sipil_001_f7_lpr8", code: "LPR 8", name: "Lab. Pemrograman 8", floor: 7, capacity: 40 },
      { id: "bld_sipil_001_f7_lkj2", code: "LKJ 2", name: "Lab. Komputasi Jaringan 2", floor: 7, capacity: 40 },
      { id: "bld_sipil_001_f7_lkj1", code: "LKJ 1", name: "Lab. Komputasi Jaringan 1", floor: 7, capacity: 40 },
      { id: "bld_sipil_001_f7_lkj3", code: "LKJ 3", name: "Lab. Komputasi Jaringan 3", floor: 7, capacity: 40 },
      { id: "bld_sipil_001_f7_lvk1", code: "LVK 1*", name: "Lab. Visual Komputer 1", floor: 7, capacity: 40 },
      { id: "bld_sipil_001_f7_rt8", code: "RT 8", name: "R. Kelas Teori 8", floor: 7, capacity: 40 },
      { id: "bld_sipil_001_f7_lvk2", code: "LVK 2*", name: "Lab. Visual Komputer 2", floor: 7, capacity: 40 },
      { id: "bld_sipil_001_f7_lpy4", code: "LPY 4", name: "Lab. Proyek 4", floor: 7, capacity: 40 },
      { id: "bld_sipil_001_f7_lai1", code: "LAI 1", name: "Lab. Kecerdasan Buatan 1", floor: 7, capacity: 40 },
      // Lantai 8
      { id: "bld_sipil_001_f8_rt", code: "RT", name: "R. Kelas Teori", floor: 8, capacity: 40 },
      { id: "bld_sipil_001_f8_rt9", code: "RT 9", name: "R. Kelas Teori 9", floor: 8, capacity: 40 },
      { id: "bld_sipil_001_f8_rt10", code: "RT 10", name: "R. Kelas Teori 10", floor: 8, capacity: 40 },
    ],
  },
]

export function getBuildings(): Building[] {
  try {
    if (!fs.existsSync(dbPath)) {
      const dir = path.dirname(dbPath)
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true })
      }
      fs.writeFileSync(dbPath, JSON.stringify(DEFAULT_BUILDINGS, null, 2), "utf-8")
      return DEFAULT_BUILDINGS
    }
    const data = fs.readFileSync(dbPath, "utf-8")
    const parsed = JSON.parse(data) as Building[]

    // Pastikan array rooms terinisialisasi
    let dirty = false
    const sanitized = parsed.map(b => {
      if (!b.rooms) {
        const foundDefault = DEFAULT_BUILDINGS.find(df => df.id === b.id)
        b.rooms = foundDefault?.rooms || []
        b.roomsCount = b.rooms.length
        dirty = true
      }
      return b
    })

    if (dirty) {
      fs.writeFileSync(dbPath, JSON.stringify(sanitized, null, 2), "utf-8")
    }

    return sanitized
  } catch (err) {
    console.error("[buildings-db] Error reading buildings database:", err)
    return DEFAULT_BUILDINGS
  }
}

export function saveBuildings(buildings: Building[]): boolean {
  try {
    const dir = path.dirname(dbPath)
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true })
    }

    const synchronized = buildings.map(b => ({
      ...b,
      rooms: b.rooms || [],
      roomsCount: (b.rooms || []).length
    }))

    fs.writeFileSync(dbPath, JSON.stringify(synchronized, null, 2), "utf-8")
    return true
  } catch (err) {
    console.error("[buildings-db] Error saving buildings database:", err)
    return false
  }
}

// Helper untuk membatasi durasi operasi promise (mencegah koneksi Firebase yang menggantung)
function withTimeout<T>(promise: Promise<T>, ms: number, errorMessage: string): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error(errorMessage))
    }, ms)

    promise
      .then((value) => {
        clearTimeout(timer)
        resolve(value)
      })
      .catch((err) => {
        clearTimeout(timer)
        reject(err)
      })
  })
}

// Membaca daftar gedung secara Hybrid Asynchronous (Firestore Utama, JSON Cadangan)
export async function getBuildingsAsync(): Promise<Building[]> {
  if (isFirebaseReady && db) {
    try {
      const buildingsCol = collection(db, "buildings")
      const snapshot = await withTimeout(
        getDocs(buildingsCol),
        2000,
        "Koneksi Firebase Cloud Firestore mengalami timeout saat membaca data gedung"
      )

      if (!snapshot.empty) {
        const list: Building[] = []
        snapshot.forEach((docVal) => {
          const b = docVal.data() as Building
          if (b) {
            list.push({
              ...b,
              rooms: b.rooms || [],
              roomsCount: (b.rooms || []).length
            })
          }
        })

        // 🚨 FORCED SYNC LOGIC: Jika ID baru belum ada di Firestore, paksa timpa dengan data lokal
        const hasNewId = list.some(b => b.id === "bld_sipil_001")
        if (!hasNewId) {
          console.log("[buildings-db] Technical UID missing in Firestore. Triggering forced sync...")
          const localBuildings = getBuildings()
          await saveBuildingsAsync(localBuildings)
          return localBuildings
        }

        // Urutkan berdasarkan tanggal pembuatan (terbaru di atas)
        return list.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0))
      } else {
        // Seeding awal collection /buildings di Firestore jika kosong
        const localBuildings = getBuildings()
        const batch = writeBatch(db)
        localBuildings.forEach((b) => {
          const docRef = doc(db, "buildings", b.id)
          batch.set(docRef, b)
        })
        await withTimeout(
          batch.commit(),
          2000,
          "Koneksi Firebase Cloud Firestore mengalami timeout saat seeding awal data gedung"
        )
        return localBuildings
      }
    } catch (error) {
      console.error("[buildings-db] Firebase getBuildingsAsync failed, using local fallback:", error)
      return getBuildings()
    }
  }
  return getBuildings()
}

// Menulis daftar gedung secara Hybrid Asynchronous (Firestore Utama, JSON Cadangan)
export async function saveBuildingsAsync(buildings: Building[]): Promise<boolean> {
  const localSaved = saveBuildings(buildings)

  if (isFirebaseReady && db) {
    try {
      const buildingsCol = collection(db, "buildings")
      const snapshot = await withTimeout(
        getDocs(buildingsCol),
        2000,
        "Koneksi Firebase Cloud Firestore mengalami timeout saat sinkronisasi data gedung"
      )

      const existingIds = new Set<string>()
      snapshot.forEach((docVal) => {
        existingIds.add(docVal.id)
      })

      const newIds = new Set(buildings.map((b) => b.id))
      const batch = writeBatch(db)

      // Set/update buildings
      buildings.forEach((b) => {
        const docRef = doc(db, "buildings", b.id)
        batch.set(docRef, {
          ...b,
          rooms: b.rooms || [],
          roomsCount: (b.rooms || []).length
        })
      })

      // Hapus gedung yang tidak ada di data baru (untuk mendukung penghapusan gedung)
      existingIds.forEach((id) => {
        if (!newIds.has(id)) {
          const docRef = doc(db, "buildings", id)
          batch.delete(docRef)
        }
      })

      await withTimeout(
        batch.commit(),
        2000,
        "Koneksi Firebase Cloud Firestore mengalami timeout saat menulis data gedung"
      )
      return true
    } catch (error) {
      console.error("[buildings-db] Firebase saveBuildingsAsync failed:", error)
      return false
    }
  }
  return localSaved
}
