"use client"

import { useUserManagementState } from "../hooks/use-user-management-state"
import { UserManagementHeader } from "../components/user-management/user-management-header"
import { UserListCard } from "../components/user-management/user-list-card"
import { UserMetrics } from "../components/user-management/user-metrics"
import { UserDetailDialog } from "../components/user-management/user-detail-dialog"
import { EditUserDialog } from "../components/user-management/edit-user-dialog"
import { RegisterUserForm } from "../components/user-management/register-user-form"
import { useBuildings } from "@/features/building-management/hooks/use-buildings"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog"

export function UserManagementView() {
  const state = useUserManagementState()
  const { buildingsList } = useBuildings()

  return (
    <div className="flex flex-col gap-6">
      <UserManagementHeader onAddUser={() => state.setIsDialogOpen(true)} />

      <Dialog open={state.isDialogOpen} onOpenChange={state.setIsDialogOpen}>
        <DialogContent className="bg-zinc-900 border-zinc-800 text-foreground max-w-md p-0 overflow-hidden">
          <DialogTitle className="sr-only">Register New User</DialogTitle>
          <DialogDescription className="sr-only">
            Create a new role-restricted user credential.
          </DialogDescription>
          <RegisterUserForm
            name={state.name}
            onNameChange={state.setName}
            email={state.email}
            onEmailChange={state.setEmail}
            password={state.password}
            onPasswordChange={state.setPassword}
            confirmPassword={state.confirmPassword}
            onConfirmPasswordChange={state.setConfirmPassword}
            role={state.role}
            onRoleChange={state.setRole}
            assignedGedung={state.assignedGedung}
            onAssignedGedungChange={state.setAssignedGedung}
            isSubmitting={state.isSubmitting}
            onSubmit={state.handleFormSubmit}
            buildingsList={buildingsList}
          />
        </DialogContent>
      </Dialog>

      <UserMetrics usersList={state.usersList} />

      <div className="w-full">
        <UserListCard
          loading={state.loading}
          usersList={state.paginatedUsers}
          onDeleteUser={state.handleDeleteUser}
          onViewUser={state.setViewedUser}
          onEditUser={state.handleTriggerEdit}
          searchQuery={state.searchQuery}
          onSearchQueryChange={state.handleSearchQueryChange}
          roleFilter={state.roleFilter}
          onRoleFilterChange={state.handleRoleFilterChange}
          currentPage={state.currentPage}
          onPageChange={state.setCurrentPage}
          totalPages={state.totalPages}
          totalItems={state.totalItems}
          startIndex={state.startIndex}
          endIndex={state.endIndex}
          onAddNewUser={() => state.setIsDialogOpen(true)}
        />
      </div>

      <UserDetailDialog viewedUser={state.viewedUser} setViewedUser={state.setViewedUser} />

      <EditUserDialog
        editedUser={state.editedUser}
        setEditedUser={state.setEditedUser}
        editName={state.editName}
        setEditName={state.setEditName}
        editEmail={state.editEmail}
        setEditEmail={state.setEditEmail}
        editRole={state.editRole}
        setEditRole={state.setEditRole}
        editAssignedGedung={state.editAssignedGedung}
        setEditAssignedGedung={state.setEditAssignedGedung}
        editPassword={state.editPassword}
        setEditPassword={state.setEditPassword}
        editConfirmPassword={state.editConfirmPassword}
        setEditConfirmPassword={state.setEditConfirmPassword}
        editShowPassword={state.editShowPassword}
        setEditShowPassword={state.setEditShowPassword}
        editShowConfirmPassword={state.editShowConfirmPassword}
        setEditShowConfirmPassword={state.setEditShowConfirmPassword}
        editSubmitting={state.editSubmitting}
        isEditFormValid={state.isEditFormValid}
        showEditNameError={state.showEditNameError}
        showEditEmailError={state.showEditEmailError}
        showEditPasswordError={state.showEditPasswordError}
        showEditConfirmPasswordError={state.showEditConfirmPasswordError}
        onSubmit={state.handleEditSubmit}
        buildingsList={buildingsList}
      />
    </div>
  )
}

