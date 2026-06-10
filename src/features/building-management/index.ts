// Public API Gateway untuk modul Building Management

// Views
export { BuildingManagementView } from "./views/building-management-view"
export { RoomManagementView } from "./views/room-management-view"

// Types
export * from "./types/building"

// Hooks
export { useBuildings } from "./hooks/use-buildings"
export { useBuildingManagement } from "./hooks/use-building-management"
export { useRoomManagement } from "./hooks/use-room-management"
