"use client"

import { Pencil, AlertCircle, EyeOff, Eye, Loader2 } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { UserRecord } from "../../types/user"
import { Building } from "@/features/building-management/types/building"

interface EditUserDialogProps {
  editedUser: UserRecord | null
  setEditedUser: (user: UserRecord | null) => void
  editName: string
  setEditName: (val: string) => void
  editEmail: string
  setEditEmail: (val: string) => void
  editRole: "super_admin" | "admin_gedung"
  setEditRole: (val: "super_admin" | "admin_gedung") => void
  editAssignedGedung: string
  setEditAssignedGedung: (val: string) => void
  editPassword: string
  setEditPassword: (val: string) => void
  editConfirmPassword: string
  setEditConfirmPassword: (val: string) => void
  editShowPassword: boolean
  setEditShowPassword: (val: boolean) => void
  editShowConfirmPassword: boolean
  setEditShowConfirmPassword: (val: boolean) => void
  editSubmitting: boolean
  isEditFormValid: boolean
  showEditNameError: boolean
  showEditEmailError: boolean
  showEditPasswordError: boolean
  showEditConfirmPasswordError: boolean
  onSubmit: (e: React.FormEvent) => void
  buildingsList: Building[]
}

export function EditUserDialog({
  editedUser,
  setEditedUser,
  editName,
  setEditName,
  editEmail,
  setEditEmail,
  editRole,
  setEditRole,
  editAssignedGedung,
  setEditAssignedGedung,
  editPassword,
  setEditPassword,
  editConfirmPassword,
  setEditConfirmPassword,
  editShowPassword,
  setEditShowPassword,
  editShowConfirmPassword,
  setEditShowConfirmPassword,
  editSubmitting,
  isEditFormValid,
  showEditNameError,
  showEditEmailError,
  showEditPasswordError,
  showEditConfirmPasswordError,
  onSubmit,
  buildingsList,
}: EditUserDialogProps) {
  const hasEditPassword = editPassword.length > 0

  return (
    <Dialog open={editedUser !== null} onOpenChange={(open) => !open && setEditedUser(null)}>
      <DialogContent className="bg-zinc-900 border-zinc-800 text-foreground max-w-md p-0 overflow-hidden">
        <div className="p-6 pb-4 border-b border-zinc-855 bg-zinc-900">
          <DialogHeader>
            <DialogTitle className="text-lg flex items-center gap-2">
              <Pencil className="w-5 h-5 text-blue-500" />
              <span>Edit Credentials</span>
            </DialogTitle>
            <DialogDescription>
              Modify active system operator name, email, role or security credentials.
            </DialogDescription>
          </DialogHeader>
        </div>

        {editedUser && (
          <form onSubmit={onSubmit}>
            <div className="p-6 pt-4 pb-4 space-y-4 max-h-[50vh] overflow-y-auto pr-3 scrollbar-thin scrollbar-thumb-zinc-855 scrollbar-track-transparent">
              {/* 1. Name */}
              <div className="space-y-1.5">
                <Label htmlFor="editName" className="text-zinc-300 font-medium text-xs">Full Name</Label>
                <div className="relative">
                  <Input
                    id="editName"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="bg-zinc-950 border-zinc-800 focus-visible:border-blue-500 focus-visible:ring-blue-500 text-xs"
                    required
                    disabled={editSubmitting}
                  />
                </div>
                {showEditNameError && (
                  <p className="text-[10px] text-red-400 font-medium flex items-center gap-1 mt-1">
                    <AlertCircle className="w-3 h-3 text-red-500" />
                    <span>Nama minimal 3 karakter.</span>
                  </p>
                )}
              </div>

              {/* 2. Email */}
              <div className="space-y-1.5">
                <Label htmlFor="editEmail" className="text-zinc-300 font-medium text-xs">Email Address</Label>
                <Input
                  id="editEmail"
                  type="email"
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                  className="bg-zinc-950 border-zinc-800 focus-visible:border-blue-500 focus-visible:ring-blue-500 text-xs"
                  required
                  disabled={editSubmitting}
                />
                {showEditEmailError && (
                  <p className="text-[10px] text-red-400 font-medium flex items-center gap-1 mt-1">
                    <AlertCircle className="w-3 h-3 text-red-500" />
                    <span>Alamat email tidak valid.</span>
                  </p>
                )}
              </div>

              {/* 3. Role Selection */}
              <div className="space-y-1.5">
                <Label htmlFor="editRole" className="text-zinc-300 font-medium text-xs">Security Role</Label>
                <Select
                  value={editRole}
                  onValueChange={(val: any) => setEditRole(val)}
                  disabled={editSubmitting || editedUser.uid === "uid_superadmin_1"}
                >
                  <SelectTrigger className="bg-zinc-955 border-zinc-800 text-xs text-zinc-300">
                    <SelectValue placeholder="Pilih Peran..." />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-900 border-zinc-800 text-xs text-zinc-300">
                    <SelectItem value="super_admin">Super Admin (System Infrastructure)</SelectItem>
                    <SelectItem value="admin_gedung">Building Admin (Field Operations)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* 4. Assigned Location */}
              {editRole === "admin_gedung" && (
                <div className="space-y-1.5 animate-fadeIn">
                  <Label htmlFor="editGedung" className="text-zinc-300 font-medium text-xs">Assigned Location</Label>
                  <Select
                    value={editAssignedGedung}
                    onValueChange={setEditAssignedGedung}
                    disabled={editSubmitting}
                  >
                    <SelectTrigger className="bg-zinc-955 border-zinc-800 text-xs text-zinc-300">
                      <SelectValue placeholder="Pilih Gedung..." />
                    </SelectTrigger>
                    <SelectContent className="bg-zinc-900 border-zinc-800 text-xs text-zinc-300">
                      {buildingsList.map((b) => (
                        <SelectItem key={b.id} value={b.id}>
                          {b.name}
                        </SelectItem>
                      ))}
                      {buildingsList.length === 0 && (
                        <SelectItem value="none" disabled>Belum ada gedung terdaftar</SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* 5. Password Reset (Optional) */}
              <div className="space-y-1.5 pt-2 border-t border-zinc-850">
                <Label htmlFor="editPass" className="text-zinc-300 font-medium text-xs">
                  Reset Password <span className="text-zinc-550 font-normal">(Optional - biarkan kosong untuk abaikan)</span>
                </Label>
                <div className="relative">
                  <Input
                    id="editPass"
                    type={editShowPassword ? "text" : "password"}
                    value={editPassword}
                    onChange={(e) => setEditPassword(e.target.value)}
                    placeholder="Minimal 6 karakter"
                    className="bg-zinc-950 border-zinc-800 focus-visible:border-blue-500 focus-visible:ring-blue-500 text-xs pr-10"
                    disabled={editSubmitting}
                  />
                  <button
                    type="button"
                    onClick={() => setEditShowPassword(!editShowPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300"
                  >
                    {editShowPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {showEditPasswordError && (
                  <p className="text-[10px] text-red-400 font-medium flex items-center gap-1 mt-1">
                    <AlertCircle className="w-3 h-3 text-red-500" />
                    <span>Kata sandi minimal 6 karakter.</span>
                  </p>
                )}
              </div>

              {/* 6. Confirm Password */}
              {hasEditPassword && (
                <div className="space-y-1.5 animate-fadeIn">
                  <Label htmlFor="editConfirmPass" className="text-zinc-300 font-medium text-xs">Confirm New Password</Label>
                  <div className="relative">
                    <Input
                      id="editConfirmPass"
                      type={editShowConfirmPassword ? "text" : "password"}
                      value={editConfirmPassword}
                      onChange={(e) => setEditConfirmPassword(e.target.value)}
                      placeholder="Ulangi kata sandi baru"
                      className="bg-zinc-950 border-zinc-800 focus-visible:border-blue-500 focus-visible:ring-blue-500 text-xs pr-10"
                      disabled={editSubmitting}
                    />
                    <button
                      type="button"
                      onClick={() => setEditShowConfirmPassword(!editShowConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300"
                    >
                      {editShowConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {showEditConfirmPasswordError && (
                    <p className="text-[10px] text-red-400 font-medium flex items-center gap-1 mt-1">
                      <AlertCircle className="w-3 h-3 text-red-500" />
                      <span>Konfirmasi sandi baru tidak cocok.</span>
                    </p>
                  )}
                </div>
              )}
            </div>

            <div className="p-6 pt-4 border-t border-zinc-850 flex justify-end gap-2 bg-zinc-900">
              <Button
                type="button"
                onClick={() => setEditedUser(null)}
                className="bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-bold border border-zinc-750"
                disabled={editSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={editSubmitting || !isEditFormValid}
                className="bg-blue-500 hover:bg-blue-600 text-zinc-955 font-bold shadow-[0_0_15px_rgba(59,130,246,0.3)] disabled:bg-zinc-800 disabled:text-zinc-550 disabled:shadow-none"
              >
                {editSubmitting ? (
                  <span className="flex items-center gap-1">
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Saving...</span>
                  </span>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
