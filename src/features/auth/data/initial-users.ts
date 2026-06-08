import { UserRecord } from "../types/user"

// 3 Akun Demo Resmi dengan password bawaan (Kepatuhan RBAC)
export const INITIAL_DEMO_USERS: UserRecord[] = [
  {
    uid: "uid_superadmin_1",
    name: "Alfan SuperAdmin",
    email: "superadmin@ecocampus.id",
    role: "super_admin",
    password: "superadmin123",
    created_at: 1779000000,
  },
  {
    uid: "uid_admin_1",
    name: "Budi Teknisi",
    email: "admingedung@ecocampus.id",
    role: "admin_gedung",
    assigned_gedung: "gedung_a",
    password: "admingedung123",
    created_at: 177905000,
  },
]
