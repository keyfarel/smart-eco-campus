"use client";

import { useEffect, useState } from "react";
import { PlusCircle } from "lucide-react";
import { useBuildingManagement } from "../hooks/use-building-management";
import { BuildingListTable } from "../components/building-management/building-list-table";
import { BuildingMetrics } from "../components/building-management/building-metrics";
import { ManagementHeader } from "../components/shared/management-header";
import { ManagementFilters } from "../components/shared/management-filters";
import { ManagementPagination } from "../components/shared/management-pagination";
import { BuildingDialogs } from "../components/building-management/building-dialogs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import { BuildingListHeader } from "../components/building-management/building-list-header";

export function BuildingManagementView() {
  const state = useBuildingManagement();

  return (
    <div className="flex flex-col gap-6">
      <ManagementHeader
        onAddBuilding={() => state.setIsAddDialogOpen(true)}
        viewType="buildings"
      />

      <BuildingMetrics buildingsList={state.buildingsList} />

      <Card className="bg-background border-zinc-800">
        <BuildingListHeader onAdd={() => state.setIsAddDialogOpen(true)} state={state} />

        <CardContent>
          <BuildingListTable
            loading={state.loading}
            buildingsList={state.paginatedBuildings}
            onViewBuilding={state.setViewedBuilding}
            onEditBuilding={state.handleTriggerEdit}
            onDeleteBuilding={state.handleDeleteWrapper}
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

      <BuildingDialogs state={state as any} />
    </div>
  );
}
