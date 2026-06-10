import fs from "fs"
import path from "path"
import { Building } from "@/features/building-management/types/building"
import { isFirebaseReady, db } from "@/lib/firebase"
import { collection, getDocs, doc, setDoc, deleteDoc, writeBatch } from "firebase/firestore"

const dbPath = path.join(process.cwd(), "src/features/building-management/data/buildings.json")

// Inisialisasi data bawaan dengan Standar Technical UID (Building & Room)
const DEFAULT_BUILDINGS: Building[] = []

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

        // Tidak lagi memaksa sinkronisasi dengan data dummy

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
