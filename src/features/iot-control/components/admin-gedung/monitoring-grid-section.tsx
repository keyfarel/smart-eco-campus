"use client";

import { LiveCameraFeed } from "./live-camera-feed";
import { OccupancyCard } from "./occupancy-card";
import { SystemStatusCard } from "./system-status-card";

interface MonitoringGridSectionProps {
  showCamera: boolean;
  cinemaMode: boolean;
  systemStatus: any;
  activeRoom: string;
  activeRoomId: string;
  isPatrolling: boolean;
  patrolCountdown: number;
  floorName: string;
  activeRoomData: any;
  activeDevices: any[];
  roomAutomation: Record<string, boolean>;
  metrics: any;
}

export function MonitoringGridSection({
  showCamera,
  cinemaMode,
  systemStatus,
  activeRoom,
  activeRoomId,
  isPatrolling,
  patrolCountdown,
  floorName,
  activeRoomData,
  activeDevices,
  roomAutomation,
  metrics,
}: MonitoringGridSectionProps) {
  return (
    <div className={`grid gap-6 ${showCamera ? "lg:grid-cols-3" : "lg:grid-cols-2"}`}>
      {showCamera && (
        <LiveCameraFeed
          status={systemStatus.iotSensors}
          roomName={activeRoom}
          isPatrolling={isPatrolling}
          patrolCountdown={patrolCountdown}
          floorName={floorName}
          wattLoad={activeRoomData?.watt}
          occupancy={activeRoomData?.occupancy}
          activeDevices={activeDevices}
          roomMode={roomAutomation[activeRoomId] !== false ? "AUTO" : "OVERRIDE"}
          className={cinemaMode ? "lg:col-span-3" : "lg:col-span-2"}
        />
      )}

      {(!showCamera || !cinemaMode) && (
        <div className={`space-y-6 ${!showCamera ? "lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6 space-y-0" : ""}`}>
          <OccupancyCard occupancy={metrics.occupancy} />
          <SystemStatusCard status={systemStatus} />
        </div>
      )}
    </div>
  );
}
