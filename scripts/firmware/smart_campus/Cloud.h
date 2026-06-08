#ifndef CLOUD_H
#define CLOUD_H

#include "Config.h"
#include "Hardware.h"
#include <WiFiClientSecure.h>
#include <HTTPClient.h>

extern Preferences preferences;

// ==========================================
// KONEKSI FIREBASE (RAW HTTP - BULLETPROOF)
// ==========================================

// Helper function untuk generate URL
inline String fbUrl(String path) {
  String url = String("https://iot-kelompok-6-59aac-default-rtdb.asia-southeast1.firebasedatabase.app");
  if (!path.startsWith("/")) url += "/";
  url += path;
  if (!url.endsWith(".json")) url += ".json";
  return url;
}

// Helper: GET Request
inline String getFirebaseValue(String path) {
  WiFiClientSecure client; client.setInsecure(); HTTPClient http;
  String payload = "";
  if (http.begin(client, fbUrl(path))) {
    if (http.GET() == HTTP_CODE_OK) {
      payload = http.getString();
      payload.trim();
      // Hilangkan tanda kutip jika itu adalah string JSON
      if (payload.startsWith("\"") && payload.endsWith("\"")) {
        payload = payload.substring(1, payload.length() - 1);
      }
    }
    http.end();
  }
  return payload;
}

// Helper: PUT/PATCH Request
inline void sendFirebaseHTTP(String path, String payload, const char* method = "PUT") {
  WiFiClientSecure client; client.setInsecure(); HTTPClient http;
  if (http.begin(client, fbUrl(path))) {
    http.addHeader("Content-Type", "application/json");
    http.sendRequest(method, payload);
    http.end();
  }
}

// ==========================================
// FUNGSI SINKRONISASI
// ==========================================

inline void pushWiFiSlotsToFirebase() {
  preferences.begin("wifi_creds", true);
  String jsonStr = "{";
  for (int i = 0; i < 3; i++) {
    String slotKey = "slot_" + String(i);
    String ssid = preferences.getString((slotKey + "_s").c_str(), "");
    jsonStr += "\"" + slotKey + "\":{\"ssid\":\"" + ssid + "\"}";
    if (i < 2) jsonStr += ",";
  }
  jsonStr += "}";
  preferences.end();
  
  sendFirebaseHTTP("/nodes/" + NODE_ID + "/wifi_slots", jsonStr, "PUT");
}

inline void pushRelayStateToFirebase(int idx) {
  String is_on_str = relays[idx].isOn ? "true" : "false";
  String json = "{\"type\":\"" + relays[idx].type + "\",\"is_on\":" + is_on_str + ",\"mode\":\"" + relays[idx].mode + "\"}";
  sendFirebaseHTTP("/nodes/" + NODE_ID + "/relays/" + relays[idx].relayId, json, "PATCH");
}

inline void pushLogToFirebase(String relayId, String action, String triggeredBy, String reason) {
  unsigned long ts = time(nullptr);
  if (ts < 1000000000) ts = millis(); // Fallback jika NTP gagal
  
  String logKey = "log_" + String(ts);
  String json = "{\"timestamp\":" + String(ts) + 
                ",\"relay_id\":\"" + relayId + "\"" + 
                ",\"action\":\"" + action + "\"" + 
                ",\"triggered_by\":\"" + triggeredBy + "\"" + 
                ",\"reason\":\"" + reason + "\"}";
                
  sendFirebaseHTTP("/logs/" + NODE_ID + "/" + logKey, json, "PUT");
}

inline void pushTelemetryToFirebase() {
  String json = "{\"voltage\":" + String(lastVoltage) + 
                ",\"current\":" + String(lastCurrent) + 
                ",\"power\":" + String(lastPower) + 
                ",\"energy\":" + String(lastEnergy) + 
                ",\"connected_ssid\":\"" + WiFi.SSID() + "\"" + 
                ",\"last_seen_timestamp\":" + String(time(nullptr)) + "}";
                
  sendFirebaseHTTP("/nodes/" + NODE_ID + "/telemetry", json, "PATCH");
}

inline void pullConfigCommandsFromFirebase() {
  String action = getFirebaseValue("/nodes/" + NODE_ID + "/wifi_command/action");
  if (action != "" && action != "null") {
    Serial.println("[FIREBASE] Ada perintah ganti jaringan dari Dashboard!");
    String targetSlot = getFirebaseValue("/nodes/" + NODE_ID + "/wifi_command/slot");
    String newSsid = getFirebaseValue("/nodes/" + NODE_ID + "/wifi_command/ssid");
    String newPass = getFirebaseValue("/nodes/" + NODE_ID + "/wifi_command/password");

    if (targetSlot != "" && targetSlot != "null") {
      preferences.begin("wifi_creds", false);
      preferences.putString((targetSlot + "_s").c_str(), newSsid);
      preferences.putString((targetSlot + "_p").c_str(), newPass);
      preferences.end();
      
      // Hapus node wifi_command setelah dieksekusi (Gunakan DELETE method)
      WiFiClientSecure client; client.setInsecure(); HTTPClient http;
      if (http.begin(client, fbUrl("/nodes/" + NODE_ID + "/wifi_command"))) {
        http.sendRequest("DELETE", "");
        http.end();
      }
      
      pushWiFiSlotsToFirebase();
      Serial.println("[SYSTEM] Konfigurasi jaringan baru diterapkan. Rebooting...");
      delay(2000); ESP.restart();
    }
  }
}

inline void pullRelayCommandsFromFirebase() {
  WiFiClientSecure client; 
  client.setInsecure(); 
  HTTPClient http;
  
  for (int i = 0; i < 3; i++) {
    if (pendingSync[i]) continue;
    
    String url = fbUrl("/nodes/" + NODE_ID + "/relays/" + relays[i].relayId + "/is_on");
    if (http.begin(client, url)) {
      if (http.GET() == HTTP_CODE_OK) {
        String payload = http.getString(); 
        payload.trim();
        if (payload != "null" && payload != "") {
          bool cloudIsOn = (payload == "true");
          if (cloudIsOn != relays[i].isOn) {
            relays[i].isOn = cloudIsOn;
            digitalWrite(relays[i].pin, relays[i].isOn ? LOW : HIGH);
            Serial.printf("[HTTP] Relay %s disinkronisasi ke %s\n", relays[i].relayId.c_str(), cloudIsOn ? "ON" : "OFF");
          }
        }
      }
      http.end();
    }
  }
}

inline void pushAutoDiscovery() {
  String isRegStr = getFirebaseValue("/nodes/" + NODE_ID + "/is_registered");
  if (isRegStr == "true") {
    Serial.println("[FIREBASE] Node terdaftar."); 
    return;
  }
  
  Serial.println("[FIREBASE] Node baru! Auto-Discovery...");
  sendFirebaseHTTP("/nodes/" + NODE_ID + "/is_registered", "false", "PUT");
  sendFirebaseHTTP("/nodes/" + NODE_ID + "/display_name", "\"Unregistered Node\"", "PUT");
  pushWiFiSlotsToFirebase();
  for (int i = 0; i < 3; i++) pushRelayStateToFirebase(i);
}

inline void staggeredBootRecovery() {
  delay(5000); if (!isOnline) return;
  pushWiFiSlotsToFirebase();
  for (int i = 0; i < 3; i++) pushRelayStateToFirebase(i);
  
  // Sinkronisasi status riil
  for (int i = 0; i < 3; i++) digitalWrite(relays[i].pin, HIGH);
  for (int i = 0; i < 3; i++) {
    if (relays[i].isOn) { delay(2000); digitalWrite(relays[i].pin, LOW); }
  }
}

// Background Task
inline void FirebaseTask(void * pvParameters) {
  unsigned long lastFirebaseRoutine = 0;
  for(;;) {
    // 1. Tangani Koneksi WiFi di Background (Core 0) agar tidak nge-block Core 1
    if (wifiMulti.run() == WL_CONNECTED) {
      if (!isOnline) {
        isOnline = true;
        wasOffline = true;
        Serial.println("[WIFI] Terkoneksi ulang otomatis (Background)!");
        pushWiFiSlotsToFirebase();
        for (int i = 0; i < 3; i++) pushRelayStateToFirebase(i);
        pushTelemetryToFirebase();
        wasOffline = false;
      }

      // 2. Rutinitas Firebase Normal
      for (int i = 0; i < 3; i++) {
        if (pendingSync[i]) { 
          pushRelayStateToFirebase(i); 
          pendingSync[i] = false; 
          vTaskDelay(10 / portTICK_PERIOD_MS); // Feed WDT
        }
        if (pendingLog[i]) { 
          pushLogToFirebase(relays[i].relayId, relays[i].isOn ? "ON" : "OFF", "LOCAL_SWITCH", "Tombol fisik"); 
          pendingLog[i] = false; 
          vTaskDelay(10 / portTICK_PERIOD_MS); // Feed WDT
        }
      }
      
      if (millis() - lastFirebaseRoutine >= FIREBASE_INTERVAL) {
        lastFirebaseRoutine = millis();
        pushTelemetryToFirebase();
        vTaskDelay(10 / portTICK_PERIOD_MS);
        pullConfigCommandsFromFirebase();
        vTaskDelay(10 / portTICK_PERIOD_MS);
        pullRelayCommandsFromFirebase();
        vTaskDelay(10 / portTICK_PERIOD_MS);
      }
    } else {
      if (isOnline) {
        isOnline = false;
        wasOffline = true;
        Serial.println("[WIFI] Terputus. Mencari jaringan di background...");
      }
    }
    vTaskDelay(50 / portTICK_PERIOD_MS); 
  }
}
#endif