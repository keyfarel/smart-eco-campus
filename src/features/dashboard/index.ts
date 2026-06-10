/**
 * Public API Gateway for Dashboard feature.
 * Adheres to rule #2: All feature imports must go through this gate.
 */

export { default as DashboardView } from "./views/dashboard-view";
export { SuperAdminView } from "./views/super-admin-view";
// Export other public components/hooks/constants here as needed
