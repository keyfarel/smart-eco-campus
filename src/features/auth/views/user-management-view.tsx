"use client"

import { useUserManagementState } from "../hooks/use-user-management-state"
import { UserManagementHeader } from "../components/user-management/user-management-header"
import { UserListCard } from "../components/user-management/user-list-card"
import { UserMetrics } from "../components/user-management/user-metrics"
import { UserDialogs } from "../components/user-management/user-dialogs"
import { useBuildings } from "@/features/building-management"

export function UserManagementView() {
  const state = useUserManagementState()
  const { buildingsList } = useBuildings()

  return (
    <div className="flex flex-col gap-6">
      <UserManagementHeader onAddUser={() => state.setIsDialogOpen(true)} />

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

      <UserDialogs state={state} buildingsList={buildingsList} />
    </div>
  )
}

