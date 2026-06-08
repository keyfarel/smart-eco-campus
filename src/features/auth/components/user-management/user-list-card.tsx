"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, Clock, Trash2, Building, Mail, Eye, Pencil, Search, Lock, RotateCcw, UserPlus } from "lucide-react"
import { UserRecord } from "../../types/user"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface UserListCardProps {
  loading: boolean
  usersList: UserRecord[]
  onDeleteUser: (uid: string) => void
  onViewUser: (user: UserRecord) => void
  onEditUser: (user: UserRecord) => void
  searchQuery: string
  onSearchQueryChange: (query: string) => void
  roleFilter: string
  onRoleFilterChange: (filter: string) => void
  currentPage: number
  onPageChange: (page: number) => void
  totalPages: number
  totalItems: number
  startIndex: number
  endIndex: number
  onAddNewUser: () => void
}

export function UserListCard({
  loading,
  usersList,
  onDeleteUser,
  onViewUser,
  onEditUser,
  searchQuery,
  onSearchQueryChange,
  roleFilter,
  onRoleFilterChange,
  currentPage,
  onPageChange,
  totalPages,
  totalItems,
  startIndex,
  endIndex,
  onAddNewUser,
}: UserListCardProps) {
  const [userToDelete, setUserToDelete] = useState<UserRecord | null>(null)

  const getPageNumbers = () => {
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, i) => i + 1)
    }

    if (currentPage <= 3) {
      return [1, 2, 3, 4, "...", totalPages]
    }

    if (currentPage >= totalPages - 2) {
      return [1, "...", totalPages - 3, totalPages - 2, totalPages - 1, totalPages]
    }

    return [1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages]
  }

  const pages = getPageNumbers()

  return (
    <Card className="bg-background border-zinc-800">
      <CardHeader className="flex flex-col gap-4 pb-4">
        {/* Top Row: Add Button and Title (Mobile Only) */}
        <div className="flex w-full items-center justify-between md:hidden">
          <div className="flex items-center gap-2">
            <CardTitle className="text-lg font-semibold text-zinc-100">User List</CardTitle>
          </div>
          <Button 
            onClick={onAddNewUser}
            className="h-9 px-3 sm:px-4 bg-zinc-100 hover:bg-white text-zinc-950 font-medium transition-all shrink-0"
          >
            <UserPlus className="w-4 h-4 sm:mr-2" />
            <span className="hidden sm:inline">Add New User</span>
          </Button>
        </div>

        {/* Bottom Row: Search Bar and Role Filter */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full">
          {/* Search bar */}
          <div className="relative flex-1 w-full sm:w-auto">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <Input
              placeholder="Search user name, email or ID..."
              value={searchQuery}
              onChange={(e) => onSearchQueryChange(e.target.value)}
              className="pl-9 h-9 w-full bg-zinc-950 border-zinc-800 text-xs text-zinc-300 placeholder:text-zinc-500"
            />
          </div>

          {/* Role Filter dropdown */}
          <div className="flex flex-col sm:flex-row sm:flex-wrap gap-2 w-full sm:w-auto">
            <Select value={roleFilter} onValueChange={onRoleFilterChange}>
              <SelectTrigger className="h-9 w-full sm:w-44 bg-zinc-950 border-zinc-800 text-xs text-zinc-300">
                <div className="flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
                  <SelectValue placeholder="All Roles" />
                </div>
              </SelectTrigger>
              <SelectContent className="bg-zinc-900 border-zinc-800 text-xs text-zinc-300">
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="super_admin">Super Admin</SelectItem>
                <SelectItem value="admin_gedung">Building Admin</SelectItem>
              </SelectContent>
            </Select>

            {/* Reset Filters */}
            {(searchQuery || roleFilter !== "all") && (
              <Button
                variant="ghost"
                onClick={() => {
                  onSearchQueryChange("")
                  onRoleFilterChange("all")
                }}
                className="h-9 px-3 text-xs text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 shrink-0 border border-transparent hover:border-zinc-700"
                title="Reset filter"
              >
                <RotateCcw className="w-3.5 h-3.5 mr-1.5" />
                <span className="hidden sm:inline">Reset</span>
              </Button>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {/* Mobile View (Cards) */}
        <div className="flex flex-col gap-3 md:hidden mb-4">
          {loading ? (
            Array.from({ length: 3 }).map((_, idx) => (
              <div key={`mobile-skeleton-${idx}`} className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 flex flex-col gap-3 animate-pulse">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-zinc-800/80 shrink-0" />
                  <div className="flex flex-col gap-1.5 flex-1">
                    <div className="h-4 bg-zinc-800/80 rounded w-2/3" />
                    <div className="h-3 bg-zinc-800/80 rounded w-1/2" />
                  </div>
                </div>
                <div className="bg-zinc-950/80 rounded-lg border border-zinc-800/80 p-3 flex flex-col gap-2">
                  <div className="h-3 bg-zinc-800/80 rounded w-1/3" />
                  <div className="h-3 bg-zinc-800/80 rounded w-1/2" />
                </div>
                <div className="flex justify-between items-center mt-1 pt-3 border-t border-zinc-800/60">
                  <div className="h-3 bg-zinc-800/80 rounded w-20" />
                  <div className="flex gap-2">
                    <div className="w-7 h-7 bg-zinc-800/80 rounded-md" />
                    <div className="w-7 h-7 bg-zinc-800/80 rounded-md" />
                    <div className="w-7 h-7 bg-zinc-800/80 rounded-md" />
                  </div>
                </div>
              </div>
            ))
          ) : usersList.length === 0 ? (
            <div className="h-28 flex items-center justify-center border border-zinc-800 rounded-lg text-muted-foreground font-mono text-xs bg-zinc-900/50">
              Tidak ada operator sistem yang cocok.
            </div>
          ) : (
            usersList.map((user) => (
              <div key={`mobile-${user.uid}`} className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 flex flex-col gap-3 shadow-sm">
                {/* Main Profile Info */}
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-zinc-950 border border-zinc-800 flex items-center justify-center font-bold text-sm shrink-0 shadow-inner text-zinc-300">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-sm font-semibold text-zinc-100 truncate">{user.name}</span>
                    <span className="font-mono text-[10px] text-zinc-500 flex items-center gap-1.5 mt-0.5 truncate">
                      <Mail className="w-3 h-3 shrink-0 text-zinc-600" /> {user.email}
                    </span>
                  </div>
                </div>

                {/* Role & Building (Recessed Card) */}
                <div className="bg-zinc-950/80 rounded-lg border border-zinc-800/80 p-3 flex flex-col gap-1.5">
                  <div className="flex items-center gap-2">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${
                      user.role === "super_admin"
                        ? "bg-red-500/10 border border-red-500/30 text-red-400"
                        : "bg-emerald-500/10 border border-emerald-500/30 text-emerald-400"
                    }`}>
                      <Shield className="w-3 h-3" />
                    </div>
                    <span className={`text-[11px] font-semibold tracking-wide uppercase ${
                      user.role === "super_admin"
                        ? "text-red-400"
                        : "text-emerald-400"
                    }`}>
                      {user.role.replace("_", " ")}
                    </span>
                  </div>
                  {user.role === "admin_gedung" && user.assigned_gedung && (
                    <div className="pl-7">
                      <span className="text-[11px] text-zinc-400 leading-snug block font-mono">
                        {user.assigned_gedung.replace("_", " ").toUpperCase()}
                      </span>
                    </div>
                  )}
                </div>

                {/* Footer: Date + Actions */}
                <div className="flex justify-between items-center mt-1 pt-3 border-t border-zinc-800/60">
                  <span className="text-[11px] text-zinc-500 font-mono tracking-tight flex items-center gap-1.5">
                    <Clock className="w-3 h-3 text-zinc-600" />
                    {new Date(user.created_at * 1000).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" })}
                  </span>
                  <div className="flex items-center justify-end gap-1.5">
                    <button
                      onClick={() => onViewUser(user)}
                      className="p-1.5 rounded-md bg-zinc-900 border border-zinc-800 text-zinc-400"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onEditUser(user)}
                      className="p-1.5 rounded-md bg-zinc-900 border border-zinc-800 text-zinc-400"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    {user.uid !== "uid_superadmin_1" ? (
                      <button
                        onClick={() => setUserToDelete(user)}
                        className="p-1.5 rounded-md bg-zinc-900 border border-zinc-800 text-red-400"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    ) : (
                      <button disabled className="p-1.5 rounded-md bg-zinc-950 border border-zinc-900 text-zinc-700">
                        <Lock className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Desktop View (Table) exactly like LogTable */}
        <div className="hidden md:block rounded-lg border border-zinc-800 overflow-hidden bg-background">
          <Table>
            <TableHeader className="bg-zinc-900/80 border-b border-zinc-800">
              <TableRow className="border-zinc-800 hover:bg-transparent">
                <TableHead className="text-zinc-300 font-semibold h-11 px-6 text-center">Name</TableHead>
                <TableHead className="text-zinc-300 font-semibold h-11 px-6 text-center">Email</TableHead>
                <TableHead className="text-zinc-300 font-semibold h-11 px-6 text-center">RBAC Role</TableHead>
                <TableHead className="text-zinc-300 font-semibold h-11 px-6 text-center">Building Assignment</TableHead>
                <TableHead className="text-zinc-300 font-semibold h-11 px-6 hidden md:table-cell text-center">Created Date</TableHead>
                <TableHead className="text-zinc-300 font-semibold h-11 px-6 text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
              <TableBody>
                {loading ? (
                  Array.from({ length: 5 }).map((_, idx) => (
                    <TableRow key={`skeleton-${idx}`} className="border-zinc-800 animate-pulse">
                      {/* NAME SKELETON */}
                      <TableCell className="px-6 py-3.5">
                        <div className="flex items-center justify-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-zinc-800/80 shrink-0 animate-pulse" />
                          <div className="h-4 bg-zinc-800/80 rounded w-32 animate-pulse" />
                        </div>
                      </TableCell>

                      {/* EMAIL SKELETON */}
                      <TableCell className="px-6 py-3.5">
                        <div className="h-4 bg-zinc-800/80 rounded w-40 animate-pulse mx-auto" />
                      </TableCell>

                      {/* ROLE SKELETON */}
                      <TableCell className="px-6 py-3.5">
                        <div className="h-6 bg-zinc-800/80 rounded-md w-24 animate-pulse mx-auto" />
                      </TableCell>

                      {/* BUILDING SKELETON */}
                      <TableCell className="px-6 py-3.5">
                        <div className="h-6 bg-zinc-800/80 rounded-md w-28 animate-pulse mx-auto" />
                      </TableCell>

                      {/* CREATED DATE SKELETON */}
                      <TableCell className="px-6 py-3.5 hidden md:table-cell text-center">
                        <div className="h-4 bg-zinc-800/80 rounded w-20 animate-pulse mx-auto" />
                      </TableCell>

                      {/* ACTIONS SKELETON */}
                      <TableCell className="px-6 py-3.5 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <div className="w-7 h-7 bg-zinc-800/80 rounded-md animate-pulse" />
                          <div className="w-7 h-7 bg-zinc-800/80 rounded-md animate-pulse" />
                          <div className="w-7 h-7 bg-zinc-800/80 rounded-md animate-pulse" />
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : usersList.length === 0 ? (
                  <TableRow className="border-zinc-800">
                    <TableCell colSpan={6} className="h-28 text-center text-zinc-550 font-medium italic">
                      Tidak ada operator sistem yang cocok dengan pencarian Anda.
                    </TableCell>
                  </TableRow>
                ) : (
                  usersList.map((user) => (
                    <TableRow
                      key={user.uid}
                      className="border-zinc-800 hover:bg-zinc-800/20 transition-colors group"
                    >
                      {/* NAME */}
                      <TableCell className="px-6 py-3.5">
                        <div className="flex items-center justify-center gap-3 text-center">
                          <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm shrink-0 select-none ${user.role === "super_admin"
                              ? "bg-red-500/10 border border-red-500/20 text-red-400"
                              : "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400"
                            }`}>
                            {user.name.charAt(0).toUpperCase()}
                          </div>
                          <span className="font-semibold text-zinc-200 truncate group-hover:text-emerald-400 transition-colors">{user.name}</span>
                        </div>
                      </TableCell>

                      {/* EMAIL */}
                      <TableCell className="px-6 py-3.5">
                        <span className="text-xs text-zinc-400 font-mono flex items-center justify-center gap-2 truncate">
                          <Mail className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
                          <span className="truncate">{user.email}</span>
                        </span>
                      </TableCell>

                      {/* ROLE */}
                      <TableCell className="px-6 py-3.5 text-center">
                        <span
                          className={`text-xs font-medium px-2 py-0.5 rounded-full border whitespace-nowrap ${
                            user.role === "super_admin"
                              ? "bg-red-500/10 text-red-400 border-red-500/20"
                              : "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                          }`}
                        >
                          {user.role === "super_admin"
                            ? "Super Admin"
                            : "Building Admin"}
                        </span>
                      </TableCell>

                      {/* BUILDING */}
                      <TableCell className="px-6 py-3.5 text-center">
                        {user.role === "admin_gedung" && user.assigned_gedung ? (
                          <span className="inline-flex items-center justify-center gap-1.5 px-2.5 py-1 rounded bg-zinc-900 border border-zinc-800 text-xs font-mono font-medium text-zinc-400">
                            <Building className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
                            <span>{user.assigned_gedung.replace("_", " ").toUpperCase()}</span>
                          </span>
                        ) : (
                          <span className="text-zinc-600 font-mono select-none flex justify-center">—</span>
                        )}
                      </TableCell>

                      {/* CREATED DATE */}
                      <TableCell className="px-6 py-3.5 hidden md:table-cell text-center">
                        <div className="flex items-center justify-center gap-1.5 text-xs text-zinc-500 font-mono">
                          <Clock className="w-3.5 h-3.5 text-zinc-650 shrink-0" />
                          <span>{new Date(user.created_at * 1000).toLocaleDateString("id-ID")}</span>
                        </div>
                      </TableCell>

                      {/* ACTIONS */}
                      <TableCell className="px-6 py-3.5 text-center">
                        <div className="flex items-center justify-center gap-2">
                          {/* View details */}
                          <button
                            onClick={() => onViewUser(user)}
                            className="p-1.5 rounded-md bg-zinc-900 border border-zinc-800 hover:border-emerald-500/50 hover:bg-emerald-500/10 text-zinc-400 hover:text-emerald-400 opacity-80 group-hover:opacity-100 transition-all cursor-pointer"
                            title="View Details"
                          >
                            <Eye className="w-3.5 h-3.5 shrink-0" />
                          </button>

                          {/* Edit Credentials */}
                          <button
                            onClick={() => onEditUser(user)}
                            className="p-1.5 rounded-md bg-zinc-900 border border-zinc-800 hover:border-blue-500/50 hover:bg-blue-500/10 text-zinc-400 hover:text-blue-400 opacity-80 group-hover:opacity-100 transition-all cursor-pointer"
                            title="Edit Credentials"
                          >
                            <Pencil className="w-3.5 h-3.5 shrink-0" />
                          </button>

                          {/* Delete (Avoid self-deletion) */}
                          {user.uid !== "uid_superadmin_1" ? (
                            <button
                              onClick={() => setUserToDelete(user)}
                              className="p-1.5 rounded-md bg-zinc-900 border border-zinc-800 hover:border-red-500/50 hover:bg-red-500/10 text-zinc-400 hover:text-red-400 opacity-80 group-hover:opacity-100 transition-all cursor-pointer"
                              title="Remove User"
                            >
                              <Trash2 className="w-3.5 h-3.5 shrink-0" />
                            </button>
                          ) : (
                            <button
                              disabled
                              className="p-1.5 rounded-md bg-zinc-950 border border-zinc-900 text-zinc-700 cursor-not-allowed select-none"
                              title="Protected System Account"
                            >
                              <Lock className="w-3.5 h-3.5 shrink-0 text-zinc-600" />
                            </button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

        {/* Pagination Footer matches LogPagination structure */}
        {!loading && totalItems > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 border-t border-zinc-800/60 pt-4">
            <p className="text-sm text-zinc-500 font-mono">
              Showing {usersList.length} of {totalItems} users
            </p>

            <Pagination className="mx-0 w-auto">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
                    className={`cursor-pointer h-7 px-2 sm:h-9 sm:px-3 text-[10px] sm:text-sm ${currentPage === 1 ? "pointer-events-none opacity-50" : "bg-zinc-900 border border-zinc-800 hover:bg-zinc-800"}`}
                  />
                </PaginationItem>
                
                {pages.map((page, index) => {
                  return (
                    <PaginationItem key={index}>
                      {page === "..." ? (
                        <PaginationEllipsis className="text-zinc-500 w-6 sm:w-9" />
                      ) : (
                        <PaginationLink
                          isActive={page === currentPage}
                          onClick={() => onPageChange(page as number)}
                          className={`cursor-pointer w-7 h-7 sm:w-9 sm:h-9 text-[10px] sm:text-sm ${page === currentPage ? "bg-zinc-800 text-zinc-200 border border-zinc-700" : "text-zinc-400 hover:bg-zinc-900 hover:text-zinc-300 border border-transparent"}`}
                        >
                          {page}
                        </PaginationLink>
                      )}
                    </PaginationItem>
                  );
                })}

                <PaginationItem>
                  <PaginationNext
                    onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
                    className={`cursor-pointer h-7 px-2 sm:h-9 sm:px-3 text-[10px] sm:text-sm ${currentPage === totalPages || totalPages === 0 ? "pointer-events-none opacity-50" : "bg-zinc-900 border border-zinc-800 hover:bg-zinc-800"}`}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </CardContent>

      {/* Dialog Hapus Pengguna yang Mewah, Estetis & Sangat Detil */}
      <AlertDialog open={!!userToDelete} onOpenChange={(open) => !open && setUserToDelete(null)}>
        <AlertDialogContent className="bg-zinc-950 border border-zinc-800 text-foreground max-w-md p-6 rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.85)]">

          {/* Garis aksen merah menyala di bagian paling atas dialog (Visual Hazard Indicator) */}
          <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-red-600 via-red-500 to-red-600 shadow-[0_2px_12px_rgba(239,68,68,0.6)]" />

          <AlertDialogHeader className="flex flex-col items-center text-center gap-3.5 mt-2">
            {/* Icon warning dengan efek glowing red dan micro-animation bounce lembut */}
            <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center animate-[bounce_2.5s_infinite]">
              <Trash2 className="w-5 h-5 text-red-500" />
            </div>
            <div className="space-y-1.5">
              <AlertDialogTitle className="text-xl font-extrabold text-zinc-150 tracking-tight">
                Hapus Operator Sistem?
              </AlertDialogTitle>
              <AlertDialogDescription className="text-xs text-zinc-450 leading-relaxed max-w-[290px] mx-auto">
                Tindakan ini permanen dan tidak dapat dibatalkan. Kredensial operator akan dihapus sepenuhnya dari server Cloud Firestore.
              </AlertDialogDescription>
            </div>
          </AlertDialogHeader>

          {/* Kartu Profil Detail Operator Komprehensif */}
          {userToDelete && (
            <div className="mt-5 rounded-xl border border-zinc-850 bg-zinc-900/40 p-4 space-y-4 shadow-inner">
              {/* Header Kartu: Avatar & Identitas Inti */}
              <div className="flex items-center gap-3 border-b border-zinc-850/80 pb-3">
                <div className={`w-11 h-11 rounded-full flex items-center justify-center font-bold text-base shrink-0 select-none ${userToDelete.role === "super_admin"
                    ? "bg-red-500/10 border border-red-500/20 text-red-400"
                    : "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400"
                  }`}>
                  {userToDelete.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex flex-col min-w-0 text-left">
                  <span className="font-bold text-zinc-200 text-sm truncate">{userToDelete.name}</span>
                  <span className="text-xs text-zinc-500 font-mono truncate">{userToDelete.email}</span>
                </div>
              </div>

              {/* Grid Atribut User */}
              <div className="grid grid-cols-2 gap-x-4 gap-y-3 text-xs text-left">
                {/* ID Pengguna */}
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] text-zinc-550 font-bold tracking-wider uppercase">User ID</span>
                  <span className="font-mono text-zinc-300 select-all truncate bg-zinc-950 px-2 py-0.5 rounded border border-zinc-900" title={userToDelete.uid}>
                    {userToDelete.uid}
                  </span>
                </div>

                {/* Peran Sistem (RBAC) */}
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] text-zinc-550 font-bold tracking-wider uppercase">Role Aktif</span>
                  <div className="flex">
                    <span className={`text-xs font-medium capitalize ${
                      userToDelete.role === "super_admin"
                        ? "text-red-400"
                        : "text-emerald-400"
                    }`}>
                      <span>{userToDelete.role.replace("_", " ")}</span>
                    </span>
                  </div>
                </div>

                {/* Penugasan Area */}
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] text-zinc-550 font-bold tracking-wider uppercase">Area Penugasan</span>
                  <span className="font-semibold text-zinc-300 flex items-center gap-1">
                    {userToDelete.role === "admin_gedung" && userToDelete.assigned_gedung ? (
                      <>
                        <Building className="w-3.5 h-3.5 text-zinc-550 shrink-0" />
                        <span className="font-mono">{userToDelete.assigned_gedung.replace("_", " ").toUpperCase()}</span>
                      </>
                    ) : (
                      <span className="text-zinc-500 font-medium italic">Global (Seluruh Kampus)</span>
                    )}
                  </span>
                </div>

                {/* Tanggal Terdaftar */}
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] text-zinc-550 font-bold tracking-wider uppercase">Terdaftar Sejak</span>
                  <span className="font-medium text-zinc-300 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-zinc-550 shrink-0" />
                    <span>{new Date(userToDelete.created_at * 1000).toLocaleDateString("id-ID", { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                  </span>
                </div>
              </div>
            </div>
          )}

          <AlertDialogFooter className="mt-6 flex flex-col-reverse sm:flex-row gap-2 sm:justify-end">
            <AlertDialogCancel className="bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-350 font-semibold px-5 h-10 cursor-pointer">
              Batalkan
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (userToDelete) {
                  onDeleteUser(userToDelete.uid)
                  setUserToDelete(null)
                }
              }}
              className="bg-red-500 hover:bg-red-600 text-zinc-950 font-bold px-5 h-10 cursor-pointer shadow-[0_0_15px_rgba(239,68,68,0.2)] hover:shadow-[0_0_25px_rgba(239,68,68,0.4)] transition-all"
            >
              Ya, Hapus Permanen
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  )
}
