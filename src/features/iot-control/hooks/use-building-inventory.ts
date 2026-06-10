"use client";

import { useMemo, useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useBuildings } from "@/features/building-management";
import { useBuildingTelemetry } from "./use-building-telemetry";

export type RoomStatus = "online" | "offline" | "passive";

export interface InventoryRoom {
  id: string;
  code: string;
  name: string;
  floor: number;
  capacity: number;
  status: RoomStatus;
  telemetry?: {
    watt: number;
    occupancy: number;
    lastSeen?: string;
  };
}

export function useBuildingInventory() {
  const { data: session } = useSession();
  const { buildingsList, loading: buildingsLoading } = useBuildings();
  const { allRoomsData, loading: telemetryLoading } = useBuildingTelemetry();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [floorFilter, setFloorFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const assignedGedungId = session?.user?.assignedGedung;
  const currentBuilding = buildingsList.find(b => b.id === assignedGedungId);

  const inventoryData = useMemo(() => {
    if (!currentBuilding) return [];

    const masterRooms = currentBuilding.rooms || [];
    
    return masterRooms.map((room): InventoryRoom => {
      const telemetry = allRoomsData[room.name];
      
      let status: RoomStatus = "passive";
      if (telemetry) {
        status = telemetry.status === "Online" ? "online" : "offline";
      }

      return {
        id: room.id,
        code: room.code,
        name: room.name,
        floor: room.floor,
        capacity: room.capacity,
        status,
        telemetry: telemetry ? {
          watt: telemetry.watt,
          occupancy: telemetry.occupancy,
        } : undefined
      };
    });
  }, [currentBuilding, allRoomsData]);

  const filteredInventory = useMemo(() => {
    return inventoryData.filter(room => {
      const matchesSearch = room.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           room.code.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFloor = floorFilter === "all" || `Lantai ${room.floor}` === floorFilter;
      const matchesStatus = statusFilter === "all" || room.status === statusFilter;
      
      return matchesSearch && matchesFloor && matchesStatus;
    });
  }, [inventoryData, searchQuery, floorFilter, statusFilter]);

  // Pagination logic
  const totalItems = filteredInventory.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
  const paginatedInventory = filteredInventory.slice(startIndex, endIndex);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, floorFilter, statusFilter]);

  const stats = useMemo(() => {
    const total = inventoryData.length;
    const online = inventoryData.filter(r => r.status === "online").length;
    const offline = inventoryData.filter(r => r.status === "offline").length;
    const passive = inventoryData.filter(r => r.status === "passive").length;

    return { total, online, offline, passive };
  }, [inventoryData]);

  return {
    inventoryData: paginatedInventory,
    stats,
    loading: buildingsLoading || telemetryLoading,
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
    buildingName: currentBuilding?.name || "Gedung Penugasan",
    floors: Array.from(new Set(inventoryData.map(r => `Lantai ${r.floor}`))).sort()
  };
}
