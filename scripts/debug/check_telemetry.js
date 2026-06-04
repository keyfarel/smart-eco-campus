const { initializeApp } = require('firebase/app');
const { getDatabase, ref, get } = require('firebase/database');

const app = initializeApp({ databaseURL: "https://iot-kelompok-6-59aac-default-rtdb.asia-southeast1.firebasedatabase.app" });
const rtdb = getDatabase(app);

async function check() {
  const tRef = ref(rtdb, "nodes/ESP32-80F3DA62F3A8/telemetry");
  const snap = await get(tRef);
  console.log("Telemetry:", snap.val());
  process.exit(0);
}
check();
