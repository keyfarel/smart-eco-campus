import fs from 'fs';
import path from 'path';

async function seed() {
  const dbPath = path.join(process.cwd(), 'src/features/building-management/data/buildings.json');
  const buildings = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
  
  const generatedDevices = {};
  const automation = {};

  buildings.forEach(building => {
    (building.rooms || []).forEach(room => {
      const roomName = room.name;
      const roomId = room.id; // bld_sipil_001_f5_rt1

      // Lamp
      const lampId = `${roomId}-lamp`;
      generatedDevices[lampId] = {
        id: lampId,
        title: "Classroom Lamp",
        description: "Main lighting system for the classroom area",
        powerUsage: 120,
        location: roomName,
        isOn: false,
        lastUpdated: new Date().toISOString()
      };

      // AC
      const acId = `${roomId}-acFan`;
      generatedDevices[acId] = {
        id: acId,
        title: "AC / Fan System",
        description: "Climate control and ventilation unit",
        powerUsage: 850,
        location: roomName,
        isOn: false,
        lastUpdated: new Date().toISOString()
      };

      // Plug
      const plugId = `${roomId}-pcProjector`;
      generatedDevices[plugId] = {
        id: plugId,
        title: "PC / Projector Socket",
        description: "Power outlet for computing equipment",
        powerUsage: 450,
        location: roomName,
        isOn: false,
        lastUpdated: new Date().toISOString()
      };

      automation[roomId] = true;
    });
  });

  const baseUrl = "https://iot-kelompok-6-59aac-default-rtdb.asia-southeast1.firebasedatabase.app";

  console.log("Seeding devices...");
  const devRes = await fetch(`${baseUrl}/devices.json`, {
    method: 'PUT',
    body: JSON.stringify(generatedDevices)
  });
  
  if (devRes.ok) {
    console.log("✅ Devices seeded successfully.");
  } else {
    console.error("❌ Failed to seed devices:", await devRes.text());
  }

  console.log("Seeding room automation...");
  const autoRes = await fetch(`${baseUrl}/room_automation.json`, {
    method: 'PUT',
    body: JSON.stringify(automation)
  });

  if (autoRes.ok) {
    console.log("✅ Room automation seeded successfully.");
  } else {
    console.error("❌ Failed to seed room automation:", await autoRes.text());
  }

  console.log("\n--- SEEDING COMPLETE ---");
  console.log("Technical UIDs deployed to Cloud.");
}

seed().catch(console.error);
