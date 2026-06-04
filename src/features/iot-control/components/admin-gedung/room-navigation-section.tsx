"use client";

import { FloorSelectorBar } from "./floor-selector-bar";
import { RoomsCarousel } from "./rooms-carousel";

interface RoomNavigationSectionProps {
  showRoomCards: boolean;
  activeFloor: string;
  setActiveFloor: (val: string) => void;
  filteredRooms: any[];
  activeRoom: string;
  setActiveRoom: (val: string) => void;
  setIsPatrolling: (val: boolean) => void;
  allRoomsData: Record<string, any>;
}

export function RoomNavigationSection({
  showRoomCards,
  activeFloor,
  setActiveFloor,
  filteredRooms,
  activeRoom,
  setActiveRoom,
  setIsPatrolling,
  allRoomsData,
}: RoomNavigationSectionProps) {
  if (!showRoomCards) return null;

  return (
    <>
      <FloorSelectorBar activeFloor={activeFloor} setActiveFloor={setActiveFloor} />
      
      {filteredRooms.length === 0 ? (
        <div className="bg-zinc-900/50 border border-zinc-800/60 rounded-xl p-8 text-center flex flex-col items-center">
          <div className="w-12 h-12 rounded-full bg-zinc-800/50 flex items-center justify-center mb-3">
            <svg className="w-6 h-6 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-sm font-bold text-zinc-300 mb-1">Tidak ada ruangan dengan perangkat aktif</h3>
          <p className="text-xs text-zinc-500 max-w-md mx-auto">
            Belum ada ruangan berstatus IoT terhubung pada {activeFloor === "Semua" ? "gedung" : activeFloor} ini. Silakan hubungi teknisi untuk menambahkan perangkat atau ganti filter lantai.
          </p>
        </div>
      ) : (
        <RoomsCarousel
          filteredRooms={filteredRooms}
          activeRoom={activeRoom}
          setActiveRoom={setActiveRoom}
          setIsPatrolling={setIsPatrolling}
          allRoomsData={allRoomsData}
        />
      )}
    </>
  );
}
