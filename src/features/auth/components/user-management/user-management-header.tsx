"use client";

import { Users, UserPlus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { RegisterUserForm } from "./register-user-form";

interface UserManagementHeaderProps {
  isDialogOpen: boolean;
  setIsDialogOpen: (val: boolean) => void;
  state: any;
  buildingsList: any[];
}

export function UserManagementHeader({
  isDialogOpen,
  setIsDialogOpen,
  state,
  buildingsList,
}: UserManagementHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
          <Users className="w-5 h-5 text-emerald-500" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">User Management</h1>
          <p className="text-sm text-muted-foreground">
            Manage user accounts, credentials and RBAC roles
          </p>
        </div>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button className="bg-emerald-500 hover:bg-emerald-600 text-zinc-955 font-bold flex items-center gap-2 shadow-[0_0_15px_rgba(16,185,129,0.2)] hover:shadow-[0_0_20px_rgba(16,185,129,0.4)] transition-all">
            <UserPlus className="w-4 h-4 text-zinc-955" />
            <span>Add New User</span>
          </Button>
        </DialogTrigger>
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
    </div>
  );
}
