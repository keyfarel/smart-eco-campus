async function wipeTotal() {
  const baseUrl = "https://iot-kelompok-6-59aac-default-rtdb.asia-southeast1.firebasedatabase.app";

  const paths = [
    "devices.json",
    "room_automation.json",
    "nodes.json",
    "telemetry.json"
  ];

  console.log("--- STARTING TOTAL IOT WIPE ---");

  for (const path of paths) {
    console.log(`Wiping ${path}...`);
    const res = await fetch(`${baseUrl}/${path}`, { method: 'DELETE' });
    if (res.ok) {
      console.log(`✅ ${path} wiped.`);
    } else {
      console.error(`❌ Failed to wipe ${path}`);
    }
  }

  console.log("\n--- SYSTEM IS NOW 100% CLEAN ---");
  console.log("No more phantom devices or alerts.");
}

wipeTotal().catch(console.error);
