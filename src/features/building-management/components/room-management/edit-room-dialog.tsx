"use client";

import { Pencil, Loader2, Info, Building2, ChevronRight } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Building, Room } from "@/features/building-management";
import { RoomForm } from "./room-form";

interface EditRoomDialogProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  viewedBuilding: Building | null;
  roomContextBuilding: Building | null;
  editingRoom: Room | null;
  editRoomFloor: string;
  setEditRoomFloor: (val: string) => void;
  editRoomCode: string;
  setEditRoomCode: (val: string) => void;
  editRoomName: string;
  setEditRoomName: (val: string) => void;
  editRoomCapacity: string;
  setEditRoomCapacity: (val: string) => void;
  isSubmitting: boolean;
  formMaxFloors: number;
  isFormValid: boolean;
  showRoomCodeError: boolean;
  showRoomCodeSuccess: boolean;
  showRoomNameError: boolean;
  showRoomNameSuccess: boolean;
  showRoomCapacityError: boolean;
  showRoomCapacitySuccess: boolean;
  onSubmit: (e: React.FormEvent) => void;
  serverError: string | null;
}

export function EditRoomDialog({
  isOpen,
  setIsOpen,
  viewedBuilding,
  roomContextBuilding,
  editingRoom,
  editRoomFloor,
  setEditRoomFloor,
  editRoomCode,
  setEditRoomCode,
  editRoomName,
  setEditRoomName,
  editRoomCapacity,
  setEditRoomCapacity,
  isSubmitting,
  formMaxFloors,
  isFormValid,
  showRoomCodeError,
  showRoomCodeSuccess,
  showRoomNameError,
  showRoomNameSuccess,
  showRoomCapacityError,
  showRoomCapacitySuccess,
  onSubmit,
  serverError,
}: EditRoomDialogProps) {
  const currentBuilding = viewedBuilding || roomContextBuilding;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="bg-zinc-900 border-zinc-800 text-foreground max-w-md p-0 overflow-hidden shadow-[0_0_50px_rgba(59,130,246,0.15)]">
        <div className="p-6 pb-4 border-b border-zinc-855 bg-zinc-900/50">
          <DialogHeader>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                <Building2 className="w-3 h-3" />
                <span>{currentBuilding?.name || "Unknown Building"}</span>
                <ChevronRight className="w-3 h-3" />
                <span className="text-blue-500">Lantai {editRoomFloor}</span>
              </div>
              <span className="text-[9px] font-mono bg-blue-500/10 text-blue-400 border border-blue-500/20 px-1.5 py-0.5 rounded uppercase">
                Room ID: {editingRoom?.id.slice(0, 8)}...
              </span>
            </div>
            <DialogTitle className="text-xl font-extrabold flex items-center gap-2.5 tracking-tight">
              <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/30 flex items-center justify-center">
                <Pencil className="w-4 h-4 text-blue-500" />
              </div>
              <span>Edit Room Details</span>
            </DialogTitle>
            <DialogDescription className="text-xs text-zinc-400 mt-1">
              Perbarui cetak biru fisik dan kapasitas operasional ruangan.
            </DialogDescription>
          </DialogHeader>
        </div>

        <form onSubmit={onSubmit}>
          <RoomForm
            roomFormBuildingId={currentBuilding?.id || ""}
            roomFloor={editRoomFloor}
            setRoomFloor={setEditRoomFloor}
            roomCode={editRoomCode}
            setRoomCode={setEditRoomCode}
            roomName={editRoomName}
            setRoomName={setEditRoomName}
            roomCapacity={editRoomCapacity}
            setRoomCapacity={setEditRoomCapacity}
            isSubmitting={isSubmitting}
            formMaxFloors={formMaxFloors}
            showRoomCodeError={showRoomCodeError}
            showRoomCodeSuccess={showRoomCodeSuccess}
            showRoomNameError={showRoomNameError}
            showRoomNameSuccess={showRoomNameSuccess}
            showRoomCapacityError={showRoomCapacityError}
            showRoomCapacitySuccess={showRoomCapacitySuccess}
            serverError={serverError}
            accentColor="blue"
          />

          <div className="p-6 pt-4 border-t border-zinc-850 flex items-center justify-between bg-zinc-900/80">
            <div className="flex items-center gap-2 text-zinc-500">
              <Info className="w-3.5 h-3.5" />
              <span className="text-[10px] font-medium italic">Changes are permanent</span>
            </div>
            
            <div className="flex gap-2">
              <Button
                type="button"
                onClick={() => setIsOpen(false)}
                className="bg-zinc-850 hover:bg-zinc-800 text-zinc-300 font-bold border border-zinc-750 h-9 px-4 text-xs cursor-pointer"
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting || !isFormValid}
                className="bg-blue-500 hover:bg-blue-600 text-zinc-955 font-bold shadow-[0_0_20px_rgba(59,130,246,0.3)] disabled:bg-zinc-800 disabled:text-zinc-550 disabled:shadow-none h-9 px-5 text-xs transition-all cursor-pointer"
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-1.5">
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Saving...</span>
                  </span>
                ) : (
                  "Update Room"
                )}
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

