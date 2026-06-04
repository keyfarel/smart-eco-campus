"use client";

import { AlertTriangle, Building2 } from "lucide-react";
import { AddBuildingDialog } from "../building/add-building-dialog";
import { EditBuildingDialog } from "../building/edit-building-dialog";
import { AddRoomDialog } from "../room/add-room-dialog";
import { EditRoomDialog } from "../room/edit-room-dialog";
import { RoomDetailDialog } from "../room/room-detail-dialog";
import { BuildingDetailDialog } from "../building/building-detail-dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useBuildingManagementState } from "@/features/building-management/hooks/use-building-management-state";

interface ManagementDialogsProps {
  state: ReturnType<typeof useBuildingManagementState>;
}

export function ManagementDialogs({ state }: ManagementDialogsProps) {
  return (
    <>
      <AddBuildingDialog
        isOpen={state.isAddDialogOpen}
        setIsOpen={state.setIsAddDialogOpen}
        code={state.code}
        setCode={state.setCode}
        name={state.name}
        setName={state.setName}
        floorsCount={state.floorsCount}
        setFloorsCount={state.setFloorsCount}
        isSubmitting={state.isSubmitting}
        isFormValid={!!state.isFormValid}
        showNameError={false} // Simplification for brief update
        showNameSuccess={false}
        showFloorsError={false}
        showFloorsSuccess={false}
        onSubmit={state.handleAddSubmit}
        onCancel={() => {
          state.handleCancelEdit();
          state.setIsAddDialogOpen(false);
        }}
        serverError={state.serverError}
      />

      <EditBuildingDialog
        editedBuilding={state.editedBuilding}
        setEditedBuilding={state.setEditedBuilding}
        editCode={state.editCode}
        setEditCode={state.setEditCode}
        editName={state.editName}
        setEditName={state.setEditName}
        editFloorsCount={state.editFloorsCount}
        setEditFloorsCount={state.setEditFloorsCount}
        editSubmitting={state.editSubmitting}
        isEditFormValid={!!state.isEditFormValid}
        showEditNameError={false}
        showEditFloorsError={false}
        onSubmit={state.handleEditSubmit}
        onCancel={() => {
          state.handleCancelEdit();
          state.setEditedBuilding(null);
        }}
        serverError={state.serverError}
      />

      <AddRoomDialog
        isOpen={state.isAddRoomOpen}
        setIsOpen={state.setIsAddRoomOpen}
        isAddingFromHeader={state.isAddingFromHeader}
        viewedBuilding={state.viewedBuilding}
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
        viewedBuilding={state.viewedBuilding}
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

      <BuildingDetailDialog
        viewedBuilding={state.viewedBuilding}
        setViewedBuilding={state.setViewedBuilding}
        onOpenAddRoom={state.handleOpenAddRoomFromBlueprint}
        onEditRoom={state.handleTriggerEditRoom}
        onDeleteRoom={state.handleDeleteRoom}
        onClose={() => {
          state.setViewedBuilding(null);
        }}
      />

      <AlertDialog
        open={!!state.buildingToDelete}
        onOpenChange={(open) => !open && state.setBuildingToDelete(null)}
      >
        <AlertDialogContent className="bg-zinc-950 border border-zinc-800 text-foreground max-w-md p-0 overflow-hidden rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.85)]">
          {/* Header with Background Accent */}
          <div className="bg-red-500/5 p-6 border-b border-zinc-850/50">
            <AlertDialogHeader className="flex flex-col items-center text-center gap-3">
              <div className="w-14 h-14 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-500 shadow-[0_0_20px_rgba(239,68,68,0.1)]">
                <AlertTriangle className="w-7 h-7 animate-pulse" />
              </div>
              <div>
                <AlertDialogTitle className="text-xl font-extrabold text-zinc-100 tracking-tight">
                  Hapus Topologi Gedung?
                </AlertDialogTitle>
                <AlertDialogDescription className="text-xs text-zinc-500 mt-1 max-w-[280px]">
                  Tindakan ini permanen dan tidak dapat dibatalkan dari database.
                </AlertDialogDescription>
              </div>
            </AlertDialogHeader>
          </div>

          {/* Detailed Info Section */}
          <div className="p-6 space-y-4">
            {state.buildingToDelete && (() => {
              const target = state.buildingsList.find(b => b.id === state.buildingToDelete);
              return (
                <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4 space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-zinc-800 flex items-center justify-center text-zinc-400">
                      <Building2 className="w-5 h-5" />
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Gedung Target</span>
                      <span className="text-sm font-bold text-zinc-200 truncate">{target?.name || "Memuat..."}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <div className="bg-zinc-950/50 border border-zinc-850 p-2.5 rounded-lg flex flex-col">
                      <span className="text-[9px] text-zinc-500 font-medium">Segment ID</span>
                      <span className="text-[11px] text-zinc-300 font-mono truncate">{target?.id || "—"}</span>
                    </div>
                    <div className="bg-zinc-950/50 border border-zinc-850 p-2.5 rounded-lg flex flex-col">
                      <span className="text-[9px] text-zinc-500 font-medium">Jumlah Ruangan</span>
                      <span className="text-[11px] text-zinc-300 font-mono">{(target?.rooms || []).length} Terdaftar</span>
                    </div>
                  </div>
                </div>
              );
            })()}

            <div className="p-3.5 bg-red-500/10 border border-red-500/20 rounded-xl">
              <p className="text-[11px] text-zinc-400 leading-relaxed text-center">
                <span className="text-red-500 font-extrabold mr-1">PERINGATAN:</span>
                Menghapus gedung ini akan memutuskan semua pemetaan sensor ESP32 dan riwayat telemetri yang terikat pada ID segmen ini.
              </p>
            </div>
          </div>

          <AlertDialogFooter className="p-6 pt-0 flex flex-col-reverse sm:flex-row gap-2 sm:justify-end">
            <AlertDialogCancel className="bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-300 font-bold px-6 h-11 rounded-xl cursor-pointer">
              Batal
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={state.handleConfirmDelete}
              className="bg-red-600 hover:bg-red-700 text-white font-bold px-6 h-11 rounded-xl border-none shadow-[0_4px_20px_rgba(220,38,38,0.3)] hover:shadow-[0_4px_30px_rgba(220,38,38,0.5)] transition-all cursor-pointer"
            >
              Ya, Hapus Permanen
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

