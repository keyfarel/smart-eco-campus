"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
} from "@/components/ui/sidebar";

import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@/components/ui/collapsible";

import {
  LayoutDashboard,
  Zap,
  LogOut,
  Leaf,
  Power,
  FileText,
  BarChart3,
  Users,
  Building2,
  ChevronRight,
  LayoutGrid,
  DoorOpen,
} from "lucide-react";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { useBuildings } from "@/features/building-management/hooks/use-buildings";

// Struktur antarmuka menu untuk fleksibilitas modular
interface SubMenuItem {
  title: string;
  href: string;
}

interface NavItem {
  title: string;
  icon: React.ComponentType<any>;
  href?: string; // Untuk item datar (flat)
  items?: SubMenuItem[]; // Untuk item bersarang (collapsible)
}

export function DashboardSidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const { buildingsList } = useBuildings();
  
  // Ambil role aktif pengguna (kepatuhan RBAC)
  const userRole = session?.user?.role || "ADMIN_GEDUNG";

  // Identify assigned building for visual context
  const currentBuilding = buildingsList.find(b => b.id === session?.user?.assignedGedung);
  const buildingLabel = currentBuilding?.name || "Global Campus";

  // Generate menu dinamis berdasarkan role aktif (Kepatuhan PRD & SDD)
  const navItems: NavItem[] = [];
  
  if (userRole === "SUPER_ADMIN") {
    navItems.push(
      {
        title: "Dashboard Utama",
        icon: LayoutDashboard,
        href: "/super-admin"
      },
      {
        title: "Manajemen Sistem",
        icon: Building2,
        items: [
          { title: "Building Management", href: "/super-admin/buildings" },
          { title: "Manajemen Perangkat IoT", href: "/super-admin/devices" },
          { title: "User Management", href: "/super-admin/users" },
        ]
      },
      {
        title: "System Audit Logs",
        icon: FileText,
        href: "/super-admin/logs"
      }
    );
  } else if (userRole === "EXECUTIVE") {
    navItems.push(
      { title: "Macro Dashboard", icon: LayoutDashboard, href: "/executive" },
      { title: "Financial Analytics", icon: BarChart3, href: "/executive/analytics" }
    );
  } else {
    // ADMIN_GEDUNG
    navItems.push(
      { title: "Live Dashboard", icon: LayoutDashboard, href: "/admin-gedung" },
      { title: "Daftar Ruangan", icon: DoorOpen, href: "/admin-gedung/inventory" },
      { title: "Perangkat IoT", icon: Power, href: "/admin-gedung/devices" },
      { title: "Activity Logs", icon: FileText, href: "/admin-gedung/logs" }
    );
  }

  // Label Kategori Visual Berbasis Peran Aktif (Kepatuhan UX)
  const getGroupLabel = () => {
    switch (userRole) {
      case "SUPER_ADMIN":
        return "Sistem Kampus";
      case "EXECUTIVE":
        return "Monitoring Eksekutif";
      default:
        return "Operasional Gedung";
    }
  };

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/" });
  };

  return (
    <Sidebar className="border-r border-zinc-800/50">
      {/* HEADER */}
      <SidebarHeader className="border-b border-zinc-800/50 px-4 py-4">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center group-hover:bg-emerald-500/20 transition-colors duration-300">
            <Leaf className="w-5 h-5 text-emerald-500" />
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-foreground text-sm">
              Eco-Campus
            </span>
            <span className="text-xs text-muted-foreground">
              Control Center
            </span>
          </div>
        </Link>
      </SidebarHeader>

      {/* MENU */}
      <SidebarContent className="px-2 py-4">
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs text-muted-foreground uppercase tracking-wider px-3 mb-2 flex items-center justify-between">
            <span>{getGroupLabel()}</span>
            <span className="text-[10px] bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 px-1.5 py-0.5 rounded font-mono uppercase tracking-normal">
              {userRole.replace("_", " ")}
            </span>
          </SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => {
                const hasChildren = item.items && item.items.length > 0;
                
                // Cek apakah salah satu sub-item sedang aktif untuk defaultOpen
                const isSubItemActive = hasChildren && item.items!.some((sub) => pathname === sub.href);
                const isRootActive = pathname === item.href;

                if (hasChildren) {
                  return (
                    <Collapsible
                      key={item.title}
                      asChild
                      defaultOpen={isSubItemActive}
                      className="group/collapsible"
                    >
                      <SidebarMenuItem>
                        <CollapsibleTrigger asChild>
                          <SidebarMenuButton
                            className="h-10 px-3 hover:bg-zinc-800/50 text-zinc-300 data-[state=open]:text-emerald-500 transition-all"
                            tooltip={item.title}
                          >
                            <item.icon className="w-4 h-4 shrink-0" />
                            <span className="font-medium text-sm">{item.title}</span>
                            <ChevronRight className="ml-auto w-4 h-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90 text-zinc-500" />
                          </SidebarMenuButton>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                          <SidebarMenuSub className="border-zinc-800/80 ml-5 pl-3 py-1 flex flex-col gap-1">
                            {item.items!.map((subItem) => {
                              const isSubActive = pathname === subItem.href;
                              return (
                                <SidebarMenuSubItem key={subItem.title}>
                                  <SidebarMenuSubButton
                                    asChild
                                    isActive={isSubActive}
                                    className="h-8 text-xs font-normal text-zinc-400 hover:text-zinc-200 data-[active=true]:text-emerald-500 data-[active=true]:bg-emerald-500/10 data-[active=true]:font-medium transition-colors"
                                  >
                                    <Link href={subItem.href}>
                                      <span>{subItem.title}</span>
                                    </Link>
                                  </SidebarMenuSubButton>
                                </SidebarMenuSubItem>
                              );
                            })}
                          </SidebarMenuSub>
                        </CollapsibleContent>
                      </SidebarMenuItem>
                    </Collapsible>
                  );
                }

                // Render Item Datar (Flat Item)
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={isRootActive}
                      className="h-10 px-3 data-[active=true]:bg-emerald-500/10 data-[active=true]:text-emerald-500 data-[active=true]:border-emerald-500/30 hover:bg-zinc-800/50 transition-colors"
                    >
                      <Link href={item.href || "#"}>
                        <item.icon className="w-4 h-4 shrink-0" />
                        <span className="font-medium text-sm">{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* FOOTER */}
      <SidebarFooter className="border-t border-zinc-800/50 px-2 py-4 gap-2">
        <SidebarMenu>
          {/* STATUS & CONTEXT */}
          <SidebarMenuItem>
            <div className="flex items-center gap-3 h-10 px-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center shrink-0">
                {userRole === "ADMIN_GEDUNG" ? (
                  <Building2 className="w-4 h-4 text-emerald-500" />
                ) : (
                  <Zap className="w-4 h-4 text-emerald-500" />
                )}
              </div>
              <div className="flex flex-col overflow-hidden">
                <span className="text-[11px] font-bold text-zinc-100 truncate leading-tight">
                  {userRole === "ADMIN_GEDUNG" ? "Assigned Building" : "System Status"}
                </span>
                <span className="text-[10px] text-emerald-500 truncate font-medium">
                  {userRole === "ADMIN_GEDUNG" ? buildingLabel : "All Systems Online"}
                </span>
              </div>
            </div>
          </SidebarMenuItem>

          {/* LOGOUT */}
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="h-10 px-3 hover:bg-red-500/10 text-muted-foreground hover:text-red-400 transition-colors cursor-pointer"
            >
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 w-full text-left bg-transparent border-0"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}

