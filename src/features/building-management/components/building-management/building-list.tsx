import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Building2, Layers, DoorOpen, Zap, Pencil, Trash2 } from "lucide-react"
import { Building } from "@/features/building-management"

interface BuildingListProps {
  loading: boolean
  buildingsList: Building[]
  onStartEdit: (building: Building) => void
  onDeleteBuilding: (id: string) => void
}

export function BuildingList({
  loading,
  buildingsList,
  onStartEdit,
  onDeleteBuilding,
}: BuildingListProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[1, 2].map((i) => (
          <Card key={i} className="bg-zinc-900/50 border-zinc-800 animate-pulse">
            <CardHeader className="h-20" />
            <CardContent className="h-24" />
          </Card>
        ))}
      </div>
    )
  }

  if (buildingsList.length === 0) {
    return (
      <Card className="bg-zinc-900/30 border-dashed border-zinc-800 py-12 flex flex-col items-center justify-center text-center">
        <Building2 className="w-12 h-12 text-zinc-600 mb-3" />
        <p className="text-zinc-400 font-medium">Belum Ada Gedung Terdaftar</p>
        <p className="text-sm text-zinc-500 max-w-xs mt-1">
          Gunakan panel formulir di samping untuk mendaftarkan gedung kampus Anda.
        </p>
      </Card>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {buildingsList.map((building) => (
        <Card
          key={building.id}
          className="bg-zinc-900 border-zinc-800/80 hover:border-emerald-500/30 transition-all duration-300 group hover:shadow-lg hover:shadow-emerald-500/5 flex flex-col justify-between"
        >
          <CardHeader className="pb-3 border-b border-zinc-850 flex flex-row items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-500 shrink-0 group-hover:bg-emerald-500/20 transition-colors">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <CardTitle className="text-base text-foreground font-bold tracking-tight">
                  {building.name}
                </CardTitle>
                <CardDescription className="text-xs text-zinc-500 uppercase tracking-wider font-mono mt-0.5">
                  {building.id}
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent className="pt-4 pb-4">
            <div className="grid grid-cols-3 gap-2 text-center">
              {/* Floors */}
              <div className="bg-background/40 rounded-lg py-2.5 border border-zinc-850/50">
                <Layers className="w-4 h-4 text-emerald-500 mx-auto mb-1.5" />
                <span className="text-xs text-zinc-400 block">Lantai</span>
                <span className="text-sm font-semibold text-foreground font-mono">{building.floorsCount}</span>
              </div>

              {/* Rooms */}
              <div className="bg-background/40 rounded-lg py-2.5 border border-zinc-850/50">
                <DoorOpen className="w-4 h-4 text-emerald-500 mx-auto mb-1.5" />
                <span className="text-xs text-zinc-400 block">Ruangan</span>
                <span className="text-sm font-semibold text-foreground font-mono">{building.roomsCount}</span>
              </div>

              {/* Devices */}
              <div className="bg-background/40 rounded-lg py-2.5 border border-zinc-850/50">
                <Zap className="w-4 h-4 text-emerald-500 mx-auto mb-1.5" />
                <span className="text-xs text-zinc-400 block">Alat Aktif</span>
                <span className="text-sm font-semibold text-foreground font-mono">{building.activeDevicesCount}</span>
              </div>
            </div>
          </CardContent>

          {/* Action buttons */}
          <div className="border-t border-zinc-850 px-4 py-3 flex items-center justify-end gap-2 bg-background/20 rounded-b-lg">
            <Button
              size="sm"
              variant="outline"
              onClick={() => onStartEdit(building)}
              className="h-8 border-zinc-800 text-zinc-400 hover:text-emerald-400 hover:border-emerald-500/30 hover:bg-emerald-500/10 transition-all duration-200"
            >
              <Pencil className="w-3.5 h-3.5 mr-1.5" />
              <span>Edit</span>
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => onDeleteBuilding(building.id)}
              className="h-8 border-zinc-800 text-zinc-400 hover:text-red-400 hover:border-red-500/30 hover:bg-red-500/10 transition-all duration-200"
            >
              <Trash2 className="w-3.5 h-3.5 mr-1.5" />
              <span>Hapus</span>
            </Button>
          </div>
        </Card>
      ))}
    </div>
  )
}

