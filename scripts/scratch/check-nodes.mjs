import { initializeApp } from "firebase/app";
import { getDatabase, ref, get } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyB9vr7k01duQLrPw6MDn0MVauMGgVbAs4A",
  databaseURL: "https://iot-kelompok-6-59aac-default-rtdb.asia-southeast1.firebasedatabase.app",
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

async function checkNodes() {
  try {
    const snap = await get(ref(db, "nodes"));
    console.log(JSON.stringify(snap.val(), null, 2));
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}
checkNodes();
