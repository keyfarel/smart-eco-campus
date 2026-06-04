"use client";

import { Building2, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { BuildingFormFields } from "./building-form";

interface AddBuildingDialogProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  code: string;
  setCode: (val: string) => void;
  name: string;
  setName: (val: string) => void;
  floorsCount: string;
  setFloorsCount: (val: string) => void;
  isSubmitting: boolean;
  isFormValid: boolean;
  showNameError: boolean;
  showNameSuccess: boolean;
  showFloorsError: boolean;
  showFloorsSuccess: boolean;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  serverError?: string | null;
}

export function AddBuildingDialog({
  isOpen,
  setIsOpen,
  code,
  setCode,
  name,
  setName,
  floorsCount,
  setFloorsCount,
  isSubmitting,
  isFormValid,
  showNameError,
  showNameSuccess,
  showFloorsError,
  showFloorsSuccess,
  onSubmit,
  onCancel,
  serverError,
}: AddBuildingDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="bg-zinc-950 border-zinc-800 text-foreground max-w-md p-0 overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)]">
        <div className="p-6 pb-4 border-b border-zinc-855 bg-zinc-950">
          <DialogHeader>
            <DialogTitle className="text-lg flex items-center gap-2">
              <Building2 className="w-5 h-5 text-emerald-500" />
              <span>Register New Building</span>
            </DialogTitle>
            <DialogDescription>
              Tambahkan identitas fisik gedung ke dalam sistem topologi terpadu.
            </DialogDescription>
          </DialogHeader>
        </div>

        <form onSubmit={onSubmit} className="bg-zinc-950">
          <BuildingFormFields
            code={code}
            onCodeChange={setCode}
            name={name}
            onNameChange={setName}
            floorsCount={floorsCount}
            onFloorsCountChange={setFloorsCount}
            isSubmitting={isSubmitting}
            showCodeError={code.length > 0 && code.trim().length < 2}
            showCodeSuccess={code.trim().length >= 2}
            showNameError={name.length > 0 && name.trim().length < 3}
            showNameSuccess={showNameSuccess}
            showFloorsError={showFloorsError}
            showFloorsSuccess={showFloorsSuccess}
            serverError={serverError}
            accentColor="emerald"
          />

          <div className="p-6 pt-4 border-t border-zinc-850 flex justify-end gap-2 bg-zinc-950">
            <Button
              type="button"
              onClick={onCancel}
              className="bg-zinc-850 hover:bg-zinc-800 text-zinc-300 font-bold border border-zinc-750"
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || !isFormValid}
              className="bg-emerald-500 hover:bg-emerald-600 text-zinc-955 font-bold shadow-[0_0_15px_rgba(16,185,129,0.3)] disabled:bg-zinc-800 disabled:text-zinc-550 disabled:shadow-none"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-1">
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Saving...</span>
                </span>
              ) : (
                "Save Building"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
