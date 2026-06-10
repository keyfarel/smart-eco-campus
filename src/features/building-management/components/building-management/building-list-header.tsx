import { PlusCircle } from "lucide-react";
import { CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ManagementFilters } from "../shared/management-filters";

interface BuildingListHeaderProps {
  onAdd: () => void;
  state: any;
}

export function BuildingListHeader({ onAdd, state }: BuildingListHeaderProps) {
  return (
    <CardHeader className="flex flex-col gap-4 pb-4 md:pb-2">
      {/* Mobile Header */}
      <div className="flex w-full items-center justify-between md:hidden">
        <div className="flex items-center gap-2">
          <CardTitle className="text-lg font-semibold text-zinc-100">
            Building List
          </CardTitle>
        </div>
        <Button 
          onClick={onAdd}
          className="h-9 px-3 sm:px-4 bg-zinc-100 hover:bg-white text-zinc-950 font-medium transition-all shrink-0"
        >
          <PlusCircle className="w-4 h-4 sm:mr-2" />
          <span className="hidden sm:inline">Add New Building</span>
        </Button>
      </div>

      <div className="flex w-full justify-end">
        <ManagementFilters
          viewType="buildings"
          searchQuery={state.searchQuery}
          onSearchChange={(val: string) => {
            state.setSearchQuery(val);
            state.setCurrentPage(1);
          }}
          floorFilter={state.floorFilter}
          onFloorFilterChange={(val: string) => {
            state.setFloorFilter(val);
            state.setCurrentPage(1);
          }}
          buildingStatusFilter={state.buildingStatusFilter}
          onBuildingStatusFilterChange={(val: string) => {
            state.setBuildingStatusFilter(val);
            state.setCurrentPage(1);
          }}
        />
      </div>
    </CardHeader>
  );
}
