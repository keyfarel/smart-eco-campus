// Public API Gateway
// Export components, hooks, services from here

// Components
export { DeviceCard } from "./components/device-control/device-card"
export { DeviceSkeleton } from "./components/device-control/device-skeleton"
export { DeviceStats } from "./components/device-control/device-stats"
export { DeviceQuickActions } from "./components/device-control/device-quick-actions"
export { LiveCameraFeed } from "./components/admin-gedung/live-camera-feed"
export { OccupancyCard } from "./components/admin-gedung/occupancy-card"
export { SystemStatusCard } from "./components/admin-gedung/system-status-card"
export { TelemetryGauges } from "./components/admin-gedung/telemetry-gauges"

// Views
export { AdminGedungView } from "./views/admin-gedung-view"
export { DeviceControlView } from "./views/device-control-view"
export { default as BuildingInventoryView } from "./views/building-inventory-view"
export { GlobalDeviceManagementView } from "./views/global-device-management-view"

// Hooks
export { useDevices } from "./hooks/use-devices"
export { useBuildingTelemetry } from "./hooks/use-building-telemetry"
export { useAdminGedung } from "./hooks/use-admin-gedung"
export { useBuildingInventory } from "./hooks/use-building-inventory"
export { useDeviceControl } from "./hooks/use-device-control"
export { useDeviceRegistration } from "./hooks/use-device-registration"

// Types
export type { Device } from "./types/device"
export * from "./types/device-registration"
