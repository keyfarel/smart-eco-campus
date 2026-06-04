import { AccountSettingsView } from "@/features/auth"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/features/auth/services/auth-options"
import { redirect } from "next/navigation"

export default async function AccountPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    redirect("/login")
  }

  return (
    <AccountSettingsView 
      currentName={session.user.name || ""} 
      currentEmail={session.user.email || ""} 
      role={(session.user as any).role || ""}
    />
  )
}
