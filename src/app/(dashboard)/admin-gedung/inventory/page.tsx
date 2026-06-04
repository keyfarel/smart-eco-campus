import { Suspense } from "react";
import { BuildingInventoryView } from "@/features/iot-control";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Building Inventory | Eco-Campus",
  description: "Operational room inventory and IoT status",
};

export default function BuildingInventoryPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-zinc-500">Loading inventory...</div>}>
      <BuildingInventoryView />
    </Suspense>
  );
}
