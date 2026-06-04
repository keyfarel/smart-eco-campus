export interface Room {
  id: string       // Unique system ID
  code: string     // Human-readable Room Code (e.g. "A-101", "B-302")
  name: string     // Room Name (e.g. "Lab Jaringan")
  floor: number    // Floor level
  capacity: number // Student capacity
}

export interface Building {
  id: string
  code?: string
  name: string
  floorsCount: number
  roomsCount: number
  activeDevicesCount: number
  createdAt: number
  rooms?: Room[]
}
