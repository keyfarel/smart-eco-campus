"use client";

import { Building2, CheckCircle2, AlertCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface BuildingFormFieldsProps {
  code: string;
  onCodeChange: (val: string) => void;
  name: string;
  onNameChange: (val: string) => void;
  floorsCount: string;
  onFloorsCountChange: (val: string) => void;
  isSubmitting: boolean;
  showCodeError: boolean;
  showCodeSuccess: boolean;
  showNameError: boolean;
  showNameSuccess: boolean;
  showFloorsError: boolean;
  showFloorsSuccess: boolean;
  serverError?: string | null;
  accentColor?: "emerald" | "blue";
}

export function BuildingFormFields({
  code,
  onCodeChange,
  name,
  onNameChange,
  floorsCount,
  onFloorsCountChange,
  isSubmitting,
  showCodeError,
  showCodeSuccess,
  showNameError,
  showNameSuccess,
  showFloorsError,
  showFloorsSuccess,
  serverError,
  accentColor = "emerald",
}: BuildingFormFieldsProps) {
  const focusRingClass = accentColor === "emerald" ? "focus-visible:ring-emerald-500 focus-visible:border-emerald-500" : "focus-visible:ring-blue-500 focus-visible:border-blue-500";
  const borderSuccessClass = accentColor === "emerald" ? "border-emerald-500" : "border-blue-500";
  const textAccentClass = accentColor === "emerald" ? "text-emerald-500" : "text-blue-500";

  return (
    <div className="p-6 pt-4 pb-4 space-y-4 max-h-[50vh] overflow-y-auto pr-3 scrollbar-thin scrollbar-thumb-zinc-855 scrollbar-track-transparent">
      {/* Kode Gedung */}
      <div className="space-y-1.5">
        <Label htmlFor="buildingCode" className="text-zinc-300 font-medium text-xs">Kode Gedung</Label>
        <div className="relative">
          <Input
            id="buildingCode"
            placeholder="e.g. GIK"
            value={code}
            onChange={(e) => onCodeChange(e.target.value.toUpperCase())}
            className={`bg-zinc-950 border-zinc-800 ${focusRingClass} text-xs transition-all ${
              showCodeError ? "border-red-500 border-2 focus-visible:border-red-500 focus-visible:ring-red-500" : ""
            } ${showCodeSuccess ? `${borderSuccessClass} pr-10` : ""}`}
            required
            disabled={isSubmitting}
          />
          {showCodeSuccess && (
            <CheckCircle2 className={`absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 ${textAccentClass}`} />
          )}
        </div>
        {showCodeError && (
          <p className="text-[10px] text-red-400 font-medium flex items-center gap-1 mt-1">
            <AlertCircle className="w-3 h-3 text-red-500" />
            <span>Kode gedung minimal 2 karakter.</span>
          </p>
        )}
      </div>

      {/* Nama Gedung */}
      <div className="space-y-1.5">
        <Label htmlFor="buildingName" className="text-zinc-300 font-medium text-xs">Nama Gedung</Label>
        <div className="relative">
          <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-500" />
          <Input
            id="buildingName"
            placeholder="e.g. Gedung Sipil"
            value={name}
            onChange={(e) => onNameChange(e.target.value)}
            className={`pl-9 bg-zinc-950 border-zinc-800 ${focusRingClass} text-xs transition-all ${
              showNameError ? "border-red-500 border-2 focus-visible:border-red-500 focus-visible:ring-red-500" : ""
            } ${showNameSuccess ? `${borderSuccessClass} pr-10` : ""}`}
            required
            disabled={isSubmitting}
          />
          {showNameSuccess && (
            <CheckCircle2 className={`absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 ${textAccentClass}`} />
          )}
        </div>
        {showNameError && (
          <p className="text-[10px] text-red-400 font-medium flex items-center gap-1 mt-1">
            <AlertCircle className="w-3 h-3 text-red-500" />
            <span>{serverError || "Nama gedung minimal 3 karakter."}</span>
          </p>
        )}
      </div>

      {/* Jumlah Lantai */}
      <div className="space-y-1.5">
        <Label htmlFor="floorsCount" className="text-zinc-300 font-medium text-xs">Jumlah Lantai</Label>
        <div className="relative">
          <Input
            id="floorsCount"
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            placeholder="e.g. 4"
            value={floorsCount}
            onChange={(e) => onFloorsCountChange(e.target.value.replace(/\D/g, ""))}
            className={`bg-zinc-950 border-zinc-800 ${focusRingClass} text-xs transition-all ${
              showFloorsError ? "border-red-500 border-2 focus-visible:border-red-500 focus-visible:ring-red-500" : ""
            } ${showFloorsSuccess ? `${borderSuccessClass} pr-10` : ""}`}
            required
            disabled={isSubmitting}
          />
          {showFloorsSuccess && (
            <CheckCircle2 className={`absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 ${textAccentClass}`} />
          )}
        </div>
        {showFloorsError && (
          <p className="text-[10px] text-red-400 font-medium flex items-center gap-1 mt-1">
            <AlertCircle className="w-3 h-3 text-red-500" />
            <span>Jumlah lantai minimal 1 lantai.</span>
          </p>
        )}
      </div>
    </div>
  );
}
