"use client";

import { useEffect, useState } from "react";
import { Building2, DoorOpen } from "lucide-react";
import { useBuildingManagementState } from "../hooks/use-building-management-state";
import { BuildingListTable } from "../components/building/building-list-table";
import { BuildingMetrics } from "../components/building/building-metrics";
import { RoomListTable } from "../components/room/room-list-table";
import { ManagementHeader } from "../components/layout/management-header";
import { ManagementFilters } from "../components/layout/management-filters";
import { ManagementPagination } from "../components/layout/management-pagination";
import { ManagementDialogs } from "../components/layout/management-dialogs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function BuildingManagementView() {
  const state = useBuildingManagementState();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="flex flex-col gap-6">
      <ManagementHeader
        onAddRoom={state.handleOpenAddRoomFromHeader}
        onAddBuilding={() => state.setIsAddDialogOpen(true)}
        isAddRoomDisabled={mounted ? state.buildingsList.length === 0 : false}
      />

      <BuildingMetrics buildingsList={state.buildingsList} />

      <Card className="bg-zinc-900 border-zinc-800 overflow-hidden shadow-2xl">
        <Tabs 
          value={state.activeTab} 
          onValueChange={(val) => {
            state.setActiveTab(val);
            state.setCurrentPage(1);
          }} 
          className="w-full"
        >
          <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-4 border-b border-zinc-800 bg-zinc-900/40">
            <div className="flex flex-col gap-3">
              <div>
                <CardTitle className="text-lg font-semibold text-zinc-200">Registered Topology</CardTitle>
                <CardDescription className="text-xs text-zinc-500 mt-0.5">Daftar master data fisik, denah ruangan, dan segmen IP IoT gateway.</CardDescription>
              </div>

              <TabsList className="bg-zinc-950 border border-zinc-855 h-9 p-1 w-fit">
                <TabsTrigger value="buildings" className="text-[10px] font-bold px-4 data-[state=active]:bg-emerald-500 data-[state=active]:text-zinc-955 transition-all">
                  <Building2 className="w-3.5 h-3.5 mr-1.5" />
                  Buildings Topology
                </TabsTrigger>
                <TabsTrigger value="rooms" className="text-[10px] font-bold px-4 data-[state=active]:bg-blue-500 data-[state=active]:text-zinc-955 transition-all">
                  <DoorOpen className="w-3.5 h-3.5 mr-1.5" />
                  Rooms Directory
                </TabsTrigger>
              </TabsList>
            </div>

            <ManagementFilters
              activeTab={state.activeTab}
              searchQuery={state.searchQuery}
              onSearchChange={(val) => {
                state.setSearchQuery(val);
                state.setCurrentPage(1);
              }}
              floorFilter={state.floorFilter}
              onFloorFilterChange={(val) => {
                state.setFloorFilter(val);
                state.setCurrentPage(1);
              }}
              buildingStatusFilter={state.buildingStatusFilter}
              onBuildingStatusFilterChange={(val) => {
                state.setBuildingStatusFilter(val);
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
          </CardHeader>

          <CardContent className="pt-0 px-0 pb-0 bg-background">
            <TabsContent value="buildings" className="mt-0">
              <BuildingListTable
                loading={state.loading}
                buildingsList={state.paginatedBuildings}
                onViewBuilding={state.setViewedBuilding}
                onEditBuilding={state.handleTriggerEdit}
                onDeleteBuilding={state.handleDeleteWrapper}
              />
            </TabsContent>

            <TabsContent value="rooms" className="mt-0">
              <RoomListTable
                loading={state.loading}
                rooms={state.allRooms}
                onViewRoom={state.handleViewRoomDetail}
                onEditRoom={state.handleEditRoomFromDirectory}
                onDeleteRoom={state.handleDeleteRoom}
              />
            </TabsContent>

            <ManagementPagination
              startIndex={state.startIndex}
              endIndex={state.endIndex}
              totalItems={state.totalItems}
              currentPage={state.currentPage}
              totalPages={state.totalPages}
              onPageChange={state.setCurrentPage}
            />
          </CardContent>
        </Tabs>
      </Card>

      <ManagementDialogs state={state} />
    </div>
  );
}
