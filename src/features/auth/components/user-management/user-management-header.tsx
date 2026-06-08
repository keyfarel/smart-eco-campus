"use client";

import { Users, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface UserManagementHeaderProps {
  onAddUser?: () => void;
}

export function UserManagementHeader({ onAddUser }: UserManagementHeaderProps) {
  return (
    <div className="flex flex-row items-center justify-between gap-4">
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-8 h-8 md:w-10 md:h-10 shrink-0 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
          <Users className="w-4 h-4 md:w-5 md:h-5 text-emerald-500" />
        </div>
        <div className="min-w-0">
          <h1 className="text-xl md:text-2xl font-bold text-foreground truncate">User Management</h1>
          <p className="text-[11px] md:text-sm text-muted-foreground truncate md:whitespace-normal">
            Manage user accounts, credentials and RBAC roles
          </p>
        </div>
      </div>

      {onAddUser && (
        <Button 
          onClick={onAddUser}
          className="hidden md:flex h-9 px-4 bg-zinc-100 hover:bg-white text-zinc-950 font-medium transition-all shrink-0"
        >
          <UserPlus className="w-4 h-4 mr-2" />
          <span>Add New User</span>
        </Button>
      )}
    </div>
  );
}
