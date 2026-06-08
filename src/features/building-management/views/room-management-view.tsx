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

export function RoomManagementView() {
  const state = useRoomManagement();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const activeBuildingCount = new Set(state.allRooms.map(r => r.buildingId)).size;

  return (
    <div className="flex flex-col gap-6">
      <ManagementHeader
        onAddRoom={state.handleOpenAddRoomFromHeader}
        isAddRoomDisabled={mounted ? state.buildingsList.length === 0 : false}
        viewType="rooms"
      />

      <RoomMetrics rooms={state.allRooms} buildingCount={activeBuildingCount} />

      <Card className="bg-background border-zinc-800">
        <CardHeader className="flex flex-col gap-4 pb-4 md:pb-2">
          {/* Mobile Header */}
          <div className="flex w-full items-center justify-between md:hidden">
            <div className="flex items-center gap-2">
              <CardTitle className="text-lg font-semibold text-zinc-100">
                Room List
              </CardTitle>
            </div>
            <Button 
              onClick={state.handleOpenAddRoomFromHeader}
              disabled={mounted ? state.buildingsList.length === 0 : false}
              className="h-9 px-3 sm:px-4 bg-zinc-100 hover:bg-white text-zinc-950 font-medium transition-all shrink-0"
            >
              <PlusCircle className="w-4 h-4 sm:mr-2" />
              <span className="hidden sm:inline">Add New Room</span>
            </Button>
          </div>

          <div className="flex w-full justify-end">
            <ManagementFilters
              viewType="rooms"
              searchQuery={state.searchQuery}
              onSearchChange={(val) => {
                state.setSearchQuery(val);
                state.setCurrentPage(1);
              }}
              roomBuildingFilter={state.roomBuildingFilter}
              onRoomBuildingFilterChange={(val) => {
                state.setRoomBuildingFilter(val);
                state.setCurrentPage(1);
              }}
              roomFloorFilter={state.roomFloorFilter}
              onRoomFloorFilterChange={(val) => {
                state.setRoomFloorFilter(val);
                state.setCurrentPage(1);
              }}
              buildingsList={state.buildingsList}
            />
          </div>
        </CardHeader>

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
