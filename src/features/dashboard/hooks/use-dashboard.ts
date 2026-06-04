"use client";

import { useState } from "react";

/**
 * Custom hook for dashboard logic.
 * Adheres to rule #10: Mandatory "use client" on hooks.
 */
export const useDashboard = () => {
  const [lastUpdate] = useState(new Date().toLocaleTimeString());

  return {
    lastUpdate,
  };
};
