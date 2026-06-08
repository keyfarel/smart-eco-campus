"use client" // Wajib ditambahkan agar bisa mengambil data session (useSession)

import { useSession, signOut } from "next-auth/react"
import Image from "next/image"
import { useState } from "react"
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { DashboardSidebar } from "@/components/layout/dashboard-sidebar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { LogOut, User as UserIcon, Cloud, ChevronRight, Home } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Mengambil data user yang sedang login
  const { data: session } = useSession()
  const pathname = usePathname()

  // Generate breadcrumbs from pathname
  const pathSegments = pathname.split("/").filter(Boolean)
  const breadcrumbs = pathSegments.map((segment, index) => {
    const href = `/${pathSegments.slice(0, index + 1).join("/")}`
    const label = segment
      .replace(/-/g, " ")
      .replace(/\b\w/g, (l) => l.toUpperCase())
    return { label, href, active: index === pathSegments.length - 1 }
  })

  return (
    <SidebarProvider>
      <DashboardSidebar />
      <SidebarInset>
        <header className="sticky top-0 z-40 flex h-14 items-center gap-4 border-b border-zinc-800/50 bg-background/95 backdrop-blur px-4 md:px-6">
          <SidebarTrigger className="-ml-1 md:ml-0 text-muted-foreground hover:text-foreground hover:bg-zinc-800/50" />
          
          <div className="h-4 w-[1px] bg-zinc-800 mx-2 hidden md:block" />
          
          {/* Breadcrumbs */}
          <nav className="hidden md:flex items-center gap-2 text-xs font-medium">
            <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">
              <Home className="w-3.5 h-3.5" />
            </Link>
            {breadcrumbs.map((crumb, i) => (
              <div key={crumb.href} className="flex items-center gap-2">
                <ChevronRight className="w-3 h-3 text-zinc-600" />
                <Link 
                  href={crumb.href}
                  className={crumb.active ? "text-emerald-500" : "text-muted-foreground hover:text-foreground transition-colors"}
                >
                  {crumb.label}
                </Link>
              </div>
            ))}
          </nav>

          <div className="flex-1" />
          
          <div className="flex items-center gap-3 mr-4 border-r border-zinc-800 pr-4 hidden sm:flex">
            <Cloud className="w-4 h-4 text-emerald-500" />
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs text-muted-foreground font-medium">Cloud Synced</span>
            </div>
          </div>
          
          {/* === BAGIAN PROFIL USER === */}
          {session?.user && (
            <DropdownMenu>
              <DropdownMenuTrigger className="focus:outline-none">
                <div className="flex items-center gap-3 cursor-pointer group">
                  <span className="hidden sm:inline-block text-sm font-medium text-zinc-200 group-hover:text-emerald-400 transition-colors">
                    {session.user.name || session.user.email?.split('@')[0]}
                  </span>
                  
                  {session.user.image ? (
                    <Image
                      src={session.user.image}
                      alt={session.user.name || "Profile"}
                      width={32}
                      height={32}
                      className="w-8 h-8 sm:w-9 sm:h-9 rounded-full object-cover border-2 border-emerald-500/50 group-hover:border-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.2)] transition-all duration-300 group-hover:scale-110 group-hover:shadow-[0_0_15px_rgba(16,185,129,0.6)]"
                    />
                  ) : (
                    <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-emerald-500/10 border-2 border-emerald-500/50 group-hover:border-emerald-500 flex items-center justify-center text-emerald-500 font-bold shadow-[0_0_10px_rgba(16,185,129,0.2)] group-hover:shadow-[0_0_15px_rgba(16,185,129,0.6)] transition-all duration-300 group-hover:scale-110">
                      {session.user.name?.charAt(0).toUpperCase() || session.user.email?.charAt(0).toUpperCase() || "A"}
                    </div>
                  )}
                </div>
              </DropdownMenuTrigger>
              
              <DropdownMenuContent align="end" className="w-56 bg-zinc-950 border-zinc-800 text-zinc-300">
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium text-zinc-100 leading-none">{session.user.name}</p>
                    <p className="text-xs text-zinc-500 leading-none mt-1">{session.user.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-zinc-800" />
                <Link href="/account" className="w-full block">
                  <DropdownMenuItem 
                    className="cursor-pointer hover:bg-zinc-800 focus:bg-zinc-800 focus:text-zinc-100"
                  >
                    <UserIcon className="mr-2 h-4 w-4" />
                    <span>Account Settings</span>
                  </DropdownMenuItem>
                </Link>
                <DropdownMenuItem 
                  className="cursor-pointer text-rose-500 hover:bg-rose-500/10 hover:text-rose-400 focus:bg-rose-500/10 focus:text-rose-400"
                  onClick={async () => { await signOut({ redirect: false }); window.location.href = "/login"; }}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
          {/* === END BAGIAN PROFIL USER === */}

        </header>
        <main className="flex-1 p-4 md:p-6">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}