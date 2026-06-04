const { initializeApp } = require('firebase/app');
const { getDatabase, ref, onValue } = require('firebase/database');

const app = initializeApp({ databaseURL: "https://iot-kelompok-6-59aac-default-rtdb.asia-southeast1.firebasedatabase.app" });
const rtdb = getDatabase(app);

console.log("Listening to Firebase RTDB for relay_1_lampu...");

const is_on_ref = ref(rtdb, "nodes/ESP32-80F3DA62F3A8/relays/relay_1_lampu/is_on");
onValue(is_on_ref, (snapshot) => {
  console.log("[FIREBASE] relay_1_lampu is_on =", snapshot.val());
});

// Keep process alive
setInterval(() => {}, 1000);
