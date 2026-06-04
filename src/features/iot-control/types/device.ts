import { Lightbulb, Fan, Plug } from "lucide-react"

export interface Device {
  id: string
  title: string
  description: string
  powerUsage: number
  location: string
  isOn: boolean
  lastUpdated: string
}

export const SEED_DEVICES: Omit<Device, "lastUpdated">[] = [
  {
    id: "lamp",
    title: "Classroom Lamp",
    description: "Main lighting system for the classroom area",
    powerUsage: 120,
    location: "Room 101",
    isOn: true,
  },
  {
    id: "acFan",
    title: "AC / Fan System",
    description: "Climate control and ventilation unit",
    powerUsage: 850,
    location: "Room 101",
    isOn: false,
  },
  {
    id: "pcProjector",
    title: "PC / Projector Socket",
    description: "Power outlet for computing equipment",
    powerUsage: 450,
    location: "Room 101",
    isOn: true,
  },
]

export const ICON_MAP: Record<string, React.ElementType> = {
  lamp: Lightbulb,
  acFan: Fan,
  pcProjector: Plug,
}
