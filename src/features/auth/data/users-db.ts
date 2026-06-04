import fs from "fs"
import path from "path"
import { UserRecord } from "../types/user"
import { isFirebaseReady, db } from "@/lib/firebase"
import { collection, getDocs, doc, setDoc, deleteDoc, writeBatch } from "firebase/firestore"
import { INITIAL_DEMO_USERS } from "./initial-users"
import { getBuildings } from "@/features/building-management/data/buildings-db"

// Tentukan path ke users.json di dalam workspace project
const DB_PATH = path.join(process.cwd(), "src/features/auth/data/users.json")


// Membaca daftar pengguna dari file JSON (Lokal)
export function getUsers(): UserRecord[] {
  try {
    if (!fs.existsSync(DB_PATH)) {
      const dir = path.dirname(DB_PATH)
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true })
      }
      
      // 🏗️ SEEDING ORCHESTRATION: Ambil daftar gedung terlebih dahulu untuk sinkronisasi relasi data
      const defaultBuildings = getBuildings()
      const firstBuildingId = defaultBuildings.length > 0 ? defaultBuildings[0].id : "gedung_a"
      
      const seededUsers = INITIAL_DEMO_USERS.map(user => {
        // Jika user adalah Admin Gedung, tugaskan ke gedung pertama yang di-seed (bukan hardcoded gedung_a)
        if (user.role === "admin_gedung" && (!user.assigned_gedung || user.assigned_gedung === "gedung_a")) {
          return { ...user, assigned_gedung: firstBuildingId }
        }
        return user
      })

      fs.writeFileSync(DB_PATH, JSON.stringify(seededUsers, null, 2))
      return seededUsers
    }
    const data = fs.readFileSync(DB_PATH, "utf8")
    return JSON.parse(data)
  } catch (e) {
    console.error("[users-db] Failed to read users database", e)
    return INITIAL_DEMO_USERS
  }
}

// Menulis daftar pengguna ke file JSON (Lokal)
export function saveUsers(users: UserRecord[]): boolean {
  try {
    const dir = path.dirname(DB_PATH)
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true })
    }
    fs.writeFileSync(DB_PATH, JSON.stringify(users, null, 2))
    return true
  } catch (e) {
    console.error("[users-db] Failed to write to users database", e)
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

// Membaca daftar pengguna secara Hybrid Asynchronous (Firebase Utama, JSON Cadangan)
export async function getUsersAsync(): Promise<UserRecord[]> {
  if (isFirebaseReady && db) {
    try {
      const usersCol = collection(db, "users")
      const snapshot = await withTimeout(
        getDocs(usersCol),
        2000,
        "Koneksi Firebase Cloud Firestore mengalami timeout saat membaca data"
      )
      
      if (!snapshot.empty) {
        const list: UserRecord[] = []
        snapshot.forEach((docVal) => {
          const u = docVal.data() as UserRecord
          if (u) list.push(u)
        })
        // Urutkan berdasarkan tanggal pembuatan (terbaru di atas)
        const sortedList = list.sort((a, b) => (b.created_at || 0) - (a.created_at || 0))

        // 🚨 FORCED SYNC LOGIC: Pastikan penugasan gedung sinkron dengan Technical UID baru
        const adminUser = sortedList.find(u => u.email === "admingedung@ecocampus.id")
        if (adminUser && adminUser.assigned_gedung !== "bld_sipil_001") {
          console.log("[users-db] User assignment out of sync. Triggering forced sync...")
          const localUsers = getUsers()
          await saveUsersAsync(localUsers)
          return localUsers
        }

        return sortedList
      } else {
        // Seeding awal collection /users di Firestore jika kosong
        const localUsers = getUsers()
        const batch = writeBatch(db)
        localUsers.forEach((u) => {
          const docRef = doc(db, "users", u.uid)
          batch.set(docRef, u)
        })
        await withTimeout(
          batch.commit(),
          2000,
          "Koneksi Firebase Cloud Firestore mengalami timeout saat seeding awal"
        )
        return localUsers
      }
    } catch (error) {
      console.error("[users-db] Firebase getUsersAsync failed, using local fallback:", error)
      return getUsers()
    }
  }
  return getUsers()
}

// Menulis daftar pengguna secara Hybrid Asynchronous (Firebase Utama, JSON Cadangan)
export async function saveUsersAsync(users: UserRecord[]): Promise<boolean> {
  const localSaved = saveUsers(users)

  if (isFirebaseReady && db) {
    try {
      const usersCol = collection(db, "users")
      const snapshot = await withTimeout(
        getDocs(usersCol),
        2000,
        "Koneksi Firebase Cloud Firestore mengalami timeout saat sinkronisasi data"
      )
      
      const existingIds = new Set<string>()
      snapshot.forEach((docVal) => {
        existingIds.add(docVal.id)
      })
      
      const newIds = new Set(users.map((u) => u.uid))
      const batch = writeBatch(db)
      
      // Set/update users
      users.forEach((u) => {
        const docRef = doc(db, "users", u.uid)
        batch.set(docRef, u)
      })
      
      // Hapus users yang tidak ada di data baru (untuk mendukung penghapusan user)
      existingIds.forEach((id) => {
        if (!newIds.has(id)) {
          const docRef = doc(db, "users", id)
          batch.delete(docRef)
        }
      })
      
      await withTimeout(
        batch.commit(),
        2000,
        "Koneksi Firebase Cloud Firestore mengalami timeout saat menulis data"
      )
      return true
    } catch (error) {
      console.error("[users-db] Firebase saveUsersAsync failed:", error)
      return false
    }
  }
  return localSaved
}
