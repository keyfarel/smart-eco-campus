"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useDevices } from "./use-devices";
import { useBuildings } from "@/features/building-management";

export const useDeviceControl = () => {
  const { data: session } = useSession();
  const userRole = session?.user?.role || "ADMIN_GEDUNG";
  const isReadOnly = false;
  const isSuperAdmin = userRole === "SUPER_ADMIN";
  const isBuildingAdmin = userRole === "ADMIN_GEDUNG";
  const assignedGedungId = session?.user?.assignedGedung;

  const { buildingsList } = useBuildings();
  const assignedBuildingName = buildingsList.find(b => b.id === assignedGedungId)?.name || assignedGedungId;

  const [activeTab, setActiveTab] = useState<"control" | "registration">("control");

  const deviceData = useDevices();

  const showTabs = isBuildingAdmin;

  return {
    userRole,
    isReadOnly,
    isSuperAdmin,
    isBuildingAdmin,
    assignedBuildingName,
    activeTab,
    setActiveTab,
    showTabs,
    ...deviceData,
  };
};

