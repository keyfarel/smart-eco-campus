"use client";

import { AddRoomDialog } from "./add-room-dialog";
import { EditRoomDialog } from "./edit-room-dialog";
import { RoomDetailDialog } from "./room-detail-dialog";
import { useRoomManagement } from "../../hooks/use-room-management";

interface RoomDialogsProps {
  state: ReturnType<typeof useRoomManagement>;
}

export function RoomDialogs({ state }: RoomDialogsProps) {
  return (
    <>
      <AddRoomDialog
        isOpen={state.isAddRoomOpen}
        setIsOpen={state.setIsAddRoomOpen}
        isAddingFromHeader={true}
        viewedBuilding={null}
        buildingsList={state.buildingsList}
        roomFormBuildingId={state.roomFormBuildingId}
        setRoomFormBuildingId={state.setRoomFormBuildingId}
        newRoomFloor={state.newRoomFloor}
        setNewRoomFloor={state.setNewRoomFloor}
        newRoomCode={state.newRoomCode}
        setNewRoomCode={state.setNewRoomCode}
        newRoomName={state.newRoomName}
        setNewRoomName={state.setNewRoomName}
        newRoomCapacity={state.newRoomCapacity}
        setNewRoomCapacity={state.setNewRoomCapacity}
        isAddingRoom={state.isAddingRoom}
        formMaxFloors={state.formMaxFloors}
        isRoomFormValid={state.isRoomFormValid}
        showRoomCodeError={false}
        showRoomCodeSuccess={false}
        showRoomNameError={false}
        showRoomNameSuccess={false}
        showRoomCapacityError={false}
        showRoomCapacitySuccess={false}
        onSubmit={state.handleAddRoomSubmit}
      />

      <EditRoomDialog
        isOpen={state.isEditRoomOpen}
        setIsOpen={state.setIsEditRoomOpen}
        viewedBuilding={null}
        roomContextBuilding={state.roomContextBuilding}
        editingRoom={state.editingRoom}
        editRoomFloor={state.editRoomFloor}
        setEditRoomFloor={state.setEditRoomFloor}
        editRoomCode={state.editRoomCode}
        setEditRoomCode={state.setEditRoomCode}
        editRoomName={state.editRoomName}
        setEditRoomName={state.setEditRoomName}
        editRoomCapacity={state.editRoomCapacity}
        setEditRoomCapacity={state.setEditRoomCapacity}
        isSubmitting={state.isEditingRoom}
        formMaxFloors={state.formMaxFloors}
        isFormValid={state.isEditRoomFormValid}
        showRoomCodeError={false}
        showRoomCodeSuccess={false}
        showRoomNameError={false}
        showRoomNameSuccess={false}
        showRoomCapacityError={false}
        showRoomCapacitySuccess={false}
        onSubmit={state.handleEditRoomSubmit}
        serverError={state.serverError}
      />

      <RoomDetailDialog 
        room={state.viewedRoom} 
        onClose={() => state.setViewedRoom(null)} 
      />
    </>
  );
}
