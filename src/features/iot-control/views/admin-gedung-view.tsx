"use client"

import { useAdminGedung } from "../hooks/use-admin-gedung"
import { AdminGedungHeader } from "../components/admin-gedung/admin-gedung-header"
import { RoomNavigationSection } from "../components/admin-gedung/room-navigation-section"
import { MonitoringGridSection } from "../components/admin-gedung/monitoring-grid-section"
import { TelemetryGauges } from "../components/admin-gedung/telemetry-gauges"

export function AdminGedungView() {
  const {
    activeRoom,
    activeRoomId,
    setActiveRoom,
    metrics,
    systemStatus,
    roomAutomation,
    showCamera,
    setShowCamera,
    showRoomCards,
    setShowRoomCards,
    cinemaMode,
    setCinemaMode,
    activeFloor,
    setActiveFloor,
    isPatrolling,
    setIsPatrolling,
    patrolCountdown,
    filteredRooms,
    activeRoomData,
    floorName,
    activeDevices,
    allRoomsData,
    currentBuildingName,
  } = useAdminGedung()

  return (
    <div className="space-y-6 w-full min-w-0">
      <AdminGedungHeader
        currentBuildingName={currentBuildingName}
        showCamera={showCamera}
        setShowCamera={setShowCamera}
        showRoomCards={showRoomCards}
        setShowRoomCards={setShowRoomCards}
        cinemaMode={cinemaMode}
        setCinemaMode={setCinemaMode}
        isPatrolling={isPatrolling}
        setIsPatrolling={setIsPatrolling}
      />

      <RoomNavigationSection
        showRoomCards={showRoomCards}
        activeFloor={activeFloor}
        setActiveFloor={setActiveFloor}
        filteredRooms={filteredRooms}
        activeRoom={activeRoom}
        setActiveRoom={setActiveRoom}
        setIsPatrolling={setIsPatrolling}
        allRoomsData={allRoomsData}
      />

      <MonitoringGridSection
        showCamera={showCamera}
        cinemaMode={cinemaMode}
        systemStatus={systemStatus}
        activeRoom={activeRoom}
        activeRoomId={activeRoomId}
        isPatrolling={isPatrolling}
        patrolCountdown={patrolCountdown}
        floorName={floorName}
        activeRoomData={activeRoomData}
        activeDevices={activeDevices}
        roomAutomation={roomAutomation}
        metrics={metrics}
      />

      <TelemetryGauges metrics={metrics} />
    </div>
  )
}
