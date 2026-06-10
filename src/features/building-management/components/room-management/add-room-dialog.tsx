"use client";

import { DoorOpen, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Building } from "@/features/building-management";
import { RoomForm } from "./room-form";

interface AddRoomDialogProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  isAddingFromHeader: boolean;
  viewedBuilding: Building | null;
  buildingsList: Building[];
  roomFormBuildingId: string;
  setRoomFormBuildingId: (val: string) => void;
  newRoomFloor: string;
  setNewRoomFloor: (val: string) => void;
  newRoomCode: string;
  setNewRoomCode: (val: string) => void;
  newRoomName: string;
  setNewRoomName: (val: string) => void;
  newRoomCapacity: string;
  setNewRoomCapacity: (val: string) => void;
  isAddingRoom: boolean;
  formMaxFloors: number;
  isRoomFormValid: boolean;
  showRoomCodeError: boolean;
  showRoomCodeSuccess: boolean;
  showRoomNameError: boolean;
  showRoomNameSuccess: boolean;
  showRoomCapacityError: boolean;
  showRoomCapacitySuccess: boolean;
  onSubmit: (e: React.FormEvent) => void;
}

export function AddRoomDialog({
  isOpen,
  setIsOpen,
  isAddingFromHeader,
  viewedBuilding,
  buildingsList,
  roomFormBuildingId,
  setRoomFormBuildingId,
  newRoomFloor,
  setNewRoomFloor,
  newRoomCode,
  setNewRoomCode,
  newRoomName,
  setNewRoomName,
  newRoomCapacity,
  setNewRoomCapacity,
  isAddingRoom,
  formMaxFloors,
  isRoomFormValid,
  showRoomCodeError,
  showRoomCodeSuccess,
  showRoomNameError,
  showRoomNameSuccess,
  showRoomCapacityError,
  showRoomCapacitySuccess,
  onSubmit,
}: AddRoomDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="bg-zinc-900 border-zinc-800 text-foreground max-w-md p-0 overflow-hidden">
        <div className="p-6 pb-4 border-b border-zinc-855 bg-zinc-900">
          <DialogHeader>
            <DialogTitle className="text-lg flex items-center gap-2">
              <DoorOpen className="w-5 h-5 text-emerald-500" />
              <span>Register Physical Room</span>
            </DialogTitle>
            <DialogDescription>
              {isAddingFromHeader
                ? "Daftarkan ruangan baru di salah satu master data gedung kampus."
                : `Daftarkan ruangan fisik permanen baru di ${viewedBuilding?.name}.`}
            </DialogDescription>
          </DialogHeader>
        </div>

        <form onSubmit={onSubmit}>
          <RoomForm
            isAddingFromHeader={isAddingFromHeader}
            buildingsList={buildingsList}
            roomFormBuildingId={roomFormBuildingId}
            setRoomFormBuildingId={setRoomFormBuildingId}
            roomFloor={newRoomFloor}
            setRoomFloor={setNewRoomFloor}
            roomCode={newRoomCode}
            setRoomCode={setNewRoomCode}
            roomName={newRoomName}
            setRoomName={setNewRoomName}
            roomCapacity={newRoomCapacity}
            setRoomCapacity={setNewRoomCapacity}
            isSubmitting={isAddingRoom}
            formMaxFloors={formMaxFloors}
            showRoomCodeError={showRoomCodeError}
            showRoomCodeSuccess={showRoomCodeSuccess}
            showRoomNameError={showRoomNameError}
            showRoomNameSuccess={showRoomNameSuccess}
            showRoomCapacityError={showRoomCapacityError}
            showRoomCapacitySuccess={showRoomCapacitySuccess}
            accentColor="emerald"
          />

          <div className="p-6 pt-4 border-t border-zinc-850 flex justify-end gap-2 bg-zinc-900">
            <Button
              type="button"
              onClick={() => setIsOpen(false)}
              className="bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-bold border border-zinc-750"
              disabled={isAddingRoom}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isAddingRoom || !isRoomFormValid}
              className="bg-emerald-500 hover:bg-emerald-600 text-zinc-955 font-bold shadow-[0_0_15px_rgba(16,185,129,0.3)] disabled:bg-zinc-800 disabled:text-zinc-550 disabled:shadow-none"
            >
              {isAddingRoom ? (
                <span className="flex items-center gap-1">
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Saving...</span>
                </span>
              ) : (
                "Register Room"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

