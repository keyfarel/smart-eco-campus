const { initializeApp } = require('firebase/app');
const { getDatabase, ref, get, set } = require('firebase/database');

const app = initializeApp({ databaseURL: "https://iot-kelompok-6-59aac-default-rtdb.asia-southeast1.firebasedatabase.app" });
const rtdb = getDatabase(app);

async function testToggle() {
  console.log("Starting test toggle...");
  const deviceId = "bld_sipil_001_f7_lpr1-lamp";
  const currentState = true;
  const baseType = "lamp";
  const roomName = "Lab. Pemrograman 1";

  try {
    const nodesSnapshot = await get(ref(rtdb, "nodes"));
    if (nodesSnapshot.exists()) {
      console.log("nodes exist");
      const nodesData = nodesSnapshot.val();
      
      for (const mac of Object.keys(nodesData)) {
        const nodeMeta = nodesData[mac].metadata || nodesData[mac];
        console.log("Checking MAC:", mac, "display_name:", nodeMeta?.display_name);
        
        if (nodeMeta && nodeMeta.display_name === roomName) {
          console.log("Matched room!");
          let relayKey = "relay_1_lampu";
          
          console.log("Setting relay:", relayKey, "to", !currentState);
          await set(ref(rtdb, `nodes/${mac}/relays/${relayKey}/is_on`), !currentState);
          await set(ref(rtdb, `nodes/${mac}/relays/${relayKey}/mode`), "manual");
          console.log("Hardware sync done!");
        }
      }
    } else {
      console.log("no nodes");
    }
  } catch (err) {
    console.error("Hardware sync failed", err);
  }
  process.exit(0);
}

testToggle();
