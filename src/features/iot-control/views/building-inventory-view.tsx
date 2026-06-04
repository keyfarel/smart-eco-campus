"use client";

import { useBuildingInventory } from "../hooks/use-building-inventory";
import { InventoryHeader } from "../components/building-inventory/inventory-header";
import { InventoryStats } from "../components/building-inventory/inventory-stats";
import { InventoryTable } from "../components/building-inventory/inventory-table-paginated";

export default function BuildingInventoryView() {
  const {
    inventoryData,
    stats,
    loading,
    searchQuery,
    setSearchQuery,
    floorFilter,
    setFloorFilter,
    statusFilter,
    setStatusFilter,
    currentPage,
    setCurrentPage,
    totalPages,
    totalItems,
    startIndex,
    endIndex,
    buildingName,
    floors,
  } = useBuildingInventory();

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-20 bg-zinc-900 rounded-xl" />
        <div className="grid grid-cols-4 gap-4">
          <div className="h-24 bg-zinc-900 rounded-xl" />
          <div className="h-24 bg-zinc-900 rounded-xl" />
          <div className="h-24 bg-zinc-900 rounded-xl" />
          <div className="h-24 bg-zinc-900 rounded-xl" />
        </div>
        <div className="h-96 bg-zinc-900 rounded-xl" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fadeIn pb-10">
      <InventoryHeader
        buildingName={buildingName}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        floorFilter={floorFilter}
        setFloorFilter={setFloorFilter}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        floors={floors}
      />

      <InventoryStats stats={stats} />

      {/* Inventory Table with Pagination */}
      <InventoryTable 
        rooms={inventoryData} 
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        totalItems={totalItems}
        startIndex={startIndex}
        endIndex={endIndex}
      />
    </div>
  );
}
