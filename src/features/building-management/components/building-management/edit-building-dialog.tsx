"use client";

import { Pencil, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Building } from "@/features/building-management";
import { BuildingFormFields } from "./building-form";

interface EditBuildingDialogProps {
  editedBuilding: Building | null;
  setEditedBuilding: (building: Building | null) => void;
  editCode: string;
  setEditCode: (val: string) => void;
  editName: string;
  setEditName: (val: string) => void;
  editFloorsCount: string;
  setEditFloorsCount: (val: string) => void;
  editSubmitting: boolean;
  isEditFormValid: boolean;
  showEditNameError: boolean;
  showEditFloorsError: boolean;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  serverError: string | null;
}

export function EditBuildingDialog({
  editedBuilding,
  setEditedBuilding,
  editCode,
  setEditCode,
  editName,
  setEditName,
  editFloorsCount,
  setEditFloorsCount,
  editSubmitting,
  isEditFormValid,
  showEditNameError,
  showEditFloorsError,
  onSubmit,
  onCancel,
  serverError,
}: EditBuildingDialogProps) {
  return (
    <Dialog open={editedBuilding !== null} onOpenChange={(open) => !open && setEditedBuilding(null)}>
      <DialogContent className="bg-zinc-950 border-zinc-800 text-foreground max-w-md p-0 overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)]">
        <div className="p-6 pb-4 border-b border-zinc-855 bg-zinc-950">
          <DialogHeader>
            <DialogTitle className="text-lg flex items-center gap-2">
              <Pencil className="w-5 h-5 text-blue-500" />
              <span>Edit Building Details</span>
            </DialogTitle>
            <DialogDescription>
              Perbarui metadata nama atau jumlah lantai fisik gedung kampus Anda.
            </DialogDescription>
          </DialogHeader>
        </div>

        {editedBuilding && (
          <form onSubmit={onSubmit} className="bg-zinc-950">
            <BuildingFormFields
              code={editCode}
              onCodeChange={setEditCode}
              name={editName}
              onNameChange={setEditName}
              floorsCount={editFloorsCount}
              onFloorsCountChange={setEditFloorsCount}
              isSubmitting={editSubmitting}
              showCodeError={editCode.length > 0 && editCode.trim().length < 2}
              showCodeSuccess={editCode.trim().length >= 2}
              showNameError={showEditNameError}
              showNameSuccess={!showEditNameError && editName.length >= 3}
              showFloorsError={showEditFloorsError}
              showFloorsSuccess={!showEditFloorsError && editFloorsCount.length >= 1}
              serverError={serverError}
              accentColor="blue"
            />

            <div className="p-6 pt-4 border-t border-zinc-850 flex justify-end gap-2 bg-zinc-950">
              <Button
                type="button"
                onClick={onCancel}
                className="bg-zinc-850 hover:bg-zinc-700 text-zinc-300 font-bold border border-zinc-750"
                disabled={editSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={editSubmitting || !isEditFormValid}
                className="bg-blue-500 hover:bg-blue-600 text-zinc-955 font-bold shadow-[0_0_15px_rgba(59,130,246,0.3)] disabled:bg-zinc-800 disabled:text-zinc-550 disabled:shadow-none"
              >
                {editSubmitting ? (
                  <span className="flex items-center gap-1">
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Saving...</span>
                  </span>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}

