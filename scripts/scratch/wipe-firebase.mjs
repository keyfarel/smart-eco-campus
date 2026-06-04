async function wipe() {
  const baseUrl = "https://iot-kelompok-6-59aac-default-rtdb.asia-southeast1.firebasedatabase.app";

  console.log("Wiping devices node...");
  const devRes = await fetch(`${baseUrl}/devices.json`, {
    method: 'DELETE'
  });
  
  if (devRes.ok) {
    console.log("✅ Devices wiped successfully.");
  } else {
    console.error("❌ Failed to wipe devices:", await devRes.text());
  }

  console.log("Wiping room automation node...");
  const autoRes = await fetch(`${baseUrl}/room_automation.json`, {
    method: 'DELETE'
  });

  if (autoRes.ok) {
    console.log("✅ Room automation wiped successfully.");
  } else {
    console.error("❌ Failed to wipe room automation:", await autoRes.text());
  }

  console.log("\n--- WIPE COMPLETE ---");
  console.log("Firebase RTDB is now clean.");
}

wipe().catch(console.error);
