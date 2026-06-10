import { PlusCircle } from "lucide-react";
import { CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ManagementFilters } from "../shared/management-filters";

interface RoomListHeaderProps {
  onAdd: () => void;
  isAddDisabled: boolean;
  state: any;
}

export function RoomListHeader({ onAdd, isAddDisabled, state }: RoomListHeaderProps) {
  return (
    <CardHeader className="flex flex-col gap-4 pb-4 md:pb-2">
      {/* Mobile Header */}
      <div className="flex w-full items-center justify-between md:hidden">
        <div className="flex items-center gap-2">
          <CardTitle className="text-lg font-semibold text-zinc-100">
            Room List
          </CardTitle>
        </div>
        <Button 
          onClick={onAdd}
          disabled={isAddDisabled}
          className="h-9 px-3 sm:px-4 bg-zinc-100 hover:bg-white text-zinc-950 font-medium transition-all shrink-0"
        >
          <PlusCircle className="w-4 h-4 sm:mr-2" />
          <span className="hidden sm:inline">Add New Room</span>
        </Button>
      </div>

      <div className="flex w-full justify-end">
        <ManagementFilters
          viewType="rooms"
          searchQuery={state.searchQuery}
          onSearchChange={(val: string) => {
            state.setSearchQuery(val);
            state.setCurrentPage(1);
          }}
          roomBuildingFilter={state.roomBuildingFilter}
          onRoomBuildingFilterChange={(val: string) => {
            state.setRoomBuildingFilter(val);
            state.setCurrentPage(1);
          }}
          roomFloorFilter={state.roomFloorFilter}
          onRoomFloorFilterChange={(val: string) => {
            state.setRoomFloorFilter(val);
            state.setCurrentPage(1);
          }}
          buildingsList={state.buildingsList}
        />
      </div>
    </CardHeader>
  );
}
