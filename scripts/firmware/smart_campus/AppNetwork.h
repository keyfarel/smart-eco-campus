#ifndef APPNETWORK_H
#define APPNETWORK_H
#include "Config.h"
#include "WebUI.h"
#include "Cloud.h"

inline void handleData() {
  String json = "{\"error\":false,\"node_id\":\"" + NODE_ID + "\",\"voltage\":" + String(lastVoltage, 1) + ",\"current\":" + String(lastCurrent, 3) + ",\"power\":" + String(lastPower, 1) + ",\"energy\":" + String(lastEnergy, 3) + ",\"r1_on\":" + String(relays[0].isOn ? "true" : "false") + ",\"r1_mode\":\"" + relays[0].mode + "\",\"r2_on\":" + String(relays[1].isOn ? "true" : "false") + ",\"r2_mode\":\"" + relays[1].mode + "\",\"r3_on\":" + String(relays[2].isOn ? "true" : "false") + ",\"r3_mode\":\"" + relays[2].mode + "\"}";
  server.send(200, "application/json", json);
}

inline void handleToggle() {
  if (server.hasArg("relay")) {
    String relay = server.arg("relay");
    int idx = (relay == "lampu") ? 0 : (relay == "kipas") ? 1 : (relay == "stopkontak") ? 2 : -1;
    if (idx >= 0) {
      relays[idx].isOn = !relays[idx].isOn;
      digitalWrite(relays[idx].pin, relays[idx].isOn ? LOW : HIGH);
      relays[idx].mode = "manual";
      if (isOnline) { pendingSync[idx] = true; pendingLog[idx] = true; }
    }
  }
  server.send(200, "text/plain", "OK");
}

inline void handleSaveWiFi() {
  if (server.hasArg("ssid") && server.hasArg("password")) {
    // Hapus cache bawaan ESP32 dulu agar benar-benar ganti WiFi
    WiFi.disconnect(true, true);
    
    preferences.begin("wifi_creds", false);
    preferences.putString("ssid_0", server.arg("ssid"));
    preferences.putString("password_0", server.arg("password"));
    preferences.end();
    server.send(200, "text/html", "<html><body style='background:#0a0a0a;color:#10b981;text-align:center;padding:50px;font-family:sans-serif;'><h2>Data Tersimpan! &#10004;</h2><p style='color:#a1a1aa;'>Rebooting...</p></body></html>");
    delay(3000); ESP.restart();
  } else { server.send(400, "text/plain", "Bad Request"); }
}

inline void handleResetWiFi() {
  server.send(200, "text/html", "<html><body style='background:#0a0a0a;color:#10b981;text-align:center;padding:50px;font-family:sans-serif;'><h2>WiFi Direset! &#10004;</h2><p style='color:#a1a1aa;'>Rebooting...</p></body></html>");
  delay(2000);
  preferences.begin("wifi_creds", false); preferences.clear(); preferences.end();
  WiFi.disconnect(true, true);
  ESP.restart();
}

inline void setupWebServerRoutes() {
  if (isSetupMode) {
    server.on("/", []() { server.send(200, "text/html", captive_portal_html); });
    server.on("/save", HTTP_POST, handleSaveWiFi);
    server.onNotFound([]() {
      server.sendHeader("Location", "http://192.168.4.1/", true); server.send(302, "text/plain", "");
    });
  } else {
    server.on("/", []() { server.send(200, "text/html", index_html); });
    server.on("/data", handleData);
    server.on("/toggle", handleToggle);
    server.on("/resetwifi", handleResetWiFi);
  }
  server.begin();
}
#endif