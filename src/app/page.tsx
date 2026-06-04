import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { authOptions } from "@/features/auth/services/auth-options"
import { LandingPageView } from "@/features/landing-page"

export default async function Home() {
  const session = await getServerSession(authOptions)

  if (!session) {
    return <LandingPageView />
  }

  const userRole = (session.user as any)?.role

  if (userRole === "SUPER_ADMIN") {
    redirect("/super-admin")
  } else if (userRole === "EXECUTIVE") {
    redirect("/executive")
  } else {
    redirect("/admin-gedung")
  }
}
