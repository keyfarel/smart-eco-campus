import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog"
import { RegisterUserForm } from "./register-user-form"
import { EditUserDialog } from "./edit-user-dialog"
import { UserDetailDialog } from "./user-detail-dialog"
import { Building } from "@/features/building-management"

interface UserDialogsProps {
  state: any
  buildingsList: Building[]
}

export function UserDialogs({ state, buildingsList }: UserDialogsProps) {
  return (
    <>
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
    </>
  )
}
