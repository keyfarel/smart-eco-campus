"use client";

import { useBuildingInventory } from "../hooks/use-building-inventory";
import { InventoryHeader } from "../components/building-inventory/inventory-header";
import { InventoryStats } from "../components/building-inventory/inventory-stats";
import { InventoryFilters } from "../components/building-inventory/inventory-filters";
import { InventoryTable } from "../components/building-inventory/inventory-table-paginated";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

import { InventorySkeleton } from "../components/building-inventory/inventory-skeleton";

export default function BuildingInventoryView() {
  const inventoryState = useBuildingInventory();

  if (inventoryState.loading) {
    return <InventorySkeleton />;
  }

  return (
    <div className="space-y-6 animate-fadeIn pb-10">
      <InventoryHeader
        buildingName={inventoryState.buildingName}
        searchQuery={inventoryState.searchQuery}
        setSearchQuery={inventoryState.setSearchQuery}
        floorFilter={inventoryState.floorFilter}
        setFloorFilter={inventoryState.setFloorFilter}
        statusFilter={inventoryState.statusFilter}
        setStatusFilter={inventoryState.setStatusFilter}
        floors={inventoryState.floors}
      />

      <InventoryStats stats={inventoryState.stats} />

      {/* Inventory Table Card */}
      <Card className="bg-background border-zinc-800">
        <CardHeader className="flex flex-col md:flex-row md:items-center justify-end gap-4 md:gap-0 pb-4 md:pb-2">
          <InventoryFilters
            searchQuery={inventoryState.searchQuery}
            setSearchQuery={inventoryState.setSearchQuery}
            floorFilter={inventoryState.floorFilter}
            setFloorFilter={inventoryState.setFloorFilter}
            statusFilter={inventoryState.statusFilter}
            setStatusFilter={inventoryState.setStatusFilter}
            floors={inventoryState.floors}
          />
        </CardHeader>
        <CardContent>
          <InventoryTable 
            rooms={inventoryState.inventoryData} 
            currentPage={inventoryState.currentPage}
            totalPages={inventoryState.totalPages}
            onPageChange={inventoryState.setCurrentPage}
            totalItems={inventoryState.totalItems}
            startIndex={inventoryState.startIndex}
            endIndex={inventoryState.endIndex}
          />
        </CardContent>
      </Card>
    </div>
  );
}
