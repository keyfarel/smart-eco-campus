export interface UserRecord {
  uid: string
  name: string
  email: string
  role: "super_admin" | "admin_gedung" | "executive"
  assigned_gedung?: string
  password?: string // Menyimpan kata sandi untuk otentikasi dinamis Next-Auth
  created_at: number
}
