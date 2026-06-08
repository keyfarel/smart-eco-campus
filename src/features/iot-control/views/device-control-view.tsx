"use client"

import { useDeviceControl } from "../hooks/use-device-control"
import { DeviceControlHeader } from "../components/device-control/device-control-header"
import { DeviceControlTab } from "../components/device-control/device-control-tab"
import { DeviceSkeleton } from "../components/device-control/device-skeleton"

export function DeviceControlView() {
  const {
    loading,
    isReadOnly,
    isBuildingAdmin,
    assignedBuildingName,
    devices,
    connected,
    toggling,
    toggleDevice,
    setAllDevices,
    roomAutomation,
    toggleRoomAutomation,
    isFirebaseReady,
    initializeFirebaseData,
  } = useDeviceControl()

  if (loading) return <DeviceSkeleton />

  return (
    <div className="space-y-6 animate-fadeIn">
      <DeviceControlHeader
        currentTab="control"
        isReadOnly={isReadOnly}
        isBuildingAdmin={isBuildingAdmin}
        assignedBuildingName={assignedBuildingName}
      />

      <div className="animate-[fadeIn_0.3s_ease-out]">
        <DeviceControlTab
          devices={devices}
          connected={connected}
          toggling={toggling}
          toggleDevice={toggleDevice}
          setAllDevices={setAllDevices}
          isReadOnly={isReadOnly}
          roomAutomation={roomAutomation}
          toggleRoomAutomation={toggleRoomAutomation}
          isFirebaseReady={isFirebaseReady}
          initializeFirebaseData={initializeFirebaseData}
        />
      </div>
    </div>
  )
}
