"use client";

import { useEffect, useState } from "react";
import { PlusCircle } from "lucide-react";
import { useRoomManagement } from "../hooks/use-room-management";
import { RoomListTable } from "../components/room-management/room-list-table";
import { RoomMetrics } from "../components/room-management/room-metrics";
import { ManagementHeader } from "../components/shared/management-header";
import { ManagementFilters } from "../components/shared/management-filters";
import { ManagementPagination } from "../components/shared/management-pagination";
import { RoomDialogs } from "../components/room-management/room-dialogs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import { RoomListHeader } from "../components/room-management/room-list-header";

export function RoomManagementView() {
  const state = useRoomManagement();

  return (
    <div className="flex flex-col gap-6">
      <ManagementHeader
        onAddRoom={state.handleOpenAddRoomFromHeader}
        isAddRoomDisabled={state.isAddRoomDisabled}
        viewType="rooms"
      />

      <RoomMetrics rooms={state.allRooms} buildingCount={state.activeBuildingCount} />

      <Card className="bg-background border-zinc-800">
        <RoomListHeader 
          onAdd={state.handleOpenAddRoomFromHeader} 
          isAddDisabled={state.isAddRoomDisabled} 
          state={state} 
        />

        <CardContent>
          <RoomListTable
            loading={state.loading}
            rooms={state.paginatedRooms}
            onViewRoom={state.handleViewRoomDetail}
            onEditRoom={state.handleEditRoomFromDirectory}
            onDeleteRoom={state.handleDeleteRoom}
          />

          <ManagementPagination
            startIndex={state.startIndex}
            endIndex={state.endIndex}
            totalItems={state.totalItems}
            currentPage={state.currentPage}
            totalPages={state.totalPages}
            onPageChange={state.setCurrentPage}
          />
        </CardContent>
      </Card>

      <RoomDialogs state={state as any} />
    </div>
  );
}
