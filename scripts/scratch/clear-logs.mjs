import { initializeApp } from "firebase/app";
import { getDatabase, ref, remove } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyB9vr7k01duQLrPw6MDn0MVauMGgVbAs4A",
  databaseURL: "https://iot-kelompok-6-59aac-default-rtdb.asia-southeast1.firebasedatabase.app",
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

async function clearLogs() {
  try {
    console.log("Memulai penghapusan logs di Firebase RTDB...");
    await remove(ref(db, "logs"));
    console.log("✅ Semua data logs berhasil dihapus.");
    process.exit(0);
  } catch (error) {
    console.error("❌ Gagal menghapus logs:", error);
    process.exit(1);
  }
}

clearLogs();
