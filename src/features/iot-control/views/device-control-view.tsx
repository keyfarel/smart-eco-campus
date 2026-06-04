"use client"

import { useDeviceControl } from "../hooks/use-device-control"
import { DeviceControlHeader } from "../components/device-control/device-control-header"
import { DeviceTabSwitcher } from "../components/device-control/device-tab-switcher"
import { DeviceControlTab } from "../components/device-control/device-control-tab"
import { DeviceRegistrationTab } from "../components/device-control/device-registration-tab"
import { DeviceSkeleton } from "../components/device-control/device-skeleton"

export function DeviceControlView() {
  const {
    loading,
    activeTab,
    setActiveTab,
    showTabs,
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
        currentTab={activeTab}
        isReadOnly={isReadOnly}
        isBuildingAdmin={isBuildingAdmin}
        assignedBuildingName={assignedBuildingName}
      />

      <DeviceTabSwitcher
        showTabs={showTabs}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      <div className="animate-[fadeIn_0.3s_ease-out]">
        {activeTab === "control" ? (
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
        ) : (
          <DeviceRegistrationTab />
        )}
      </div>
    </div>
  )
}
