"use server"

import { revalidatePath } from "next/cache"

/**
 * 🧹 SERVER ACTION: SIMULASI PEMBERSIHAN DATA ANALITIK
 */
export async function handleClearAnalytics() {
  // Simulasi keterlambatan operasi server (800ms)
  await new Promise((resolve) => setTimeout(resolve, 800))

  // Revalidasi cache halaman Next.js agar server me-render ulang data kosong
  revalidatePath("/executive/analytics")
  revalidatePath("/super-admin")
  return true
}

/**
 * 🌱 SERVER ACTION: SIMULASI SEEDING DATA DUMMY
 */
export async function handleSeedAnalytics() {
  // Simulasi keterlambatan operasi server (800ms)
  await new Promise((resolve) => setTimeout(resolve, 800))

  // Revalidasi cache halaman Next.js
  revalidatePath("/executive/analytics")
  revalidatePath("/super-admin")
  return 168 // 7 hari * 24 jam = 168 record historis
}
