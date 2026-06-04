import { BuildingInventoryView } from "@/features/iot-control";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Building Inventory | Eco-Campus",
  description: "Operational room inventory and IoT status",
};

export default function BuildingInventoryPage() {
  return <BuildingInventoryView />;
}
