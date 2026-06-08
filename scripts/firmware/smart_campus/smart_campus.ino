/**
 * Smart Eco-Campus Efficiency System - Edge Controller Firmware
 * Board    : ESP32 DevKit v1
 * Feature  : Modular Architecture & FreeRTOS
 * Team     : It Faazt
 */

#include "Config.h"
#include "Hardware.h"
#include "Cloud.h"
#include "AppNetwork.h"

// ==========================================
// INSTANTIATE GLOBAL EXTERN VARIABLES
// ==========================================
const char* FIREBASE_HOST = "https://iot-kelompok-6-59aac-default-rtdb.asia-southeast1.firebasedatabase.app";
String NODE_ID = "";

WebServer server(80);
DNSServer dnsServer;
Preferences preferences;
WiFiMulti wifiMulti;
PZEM004Tv30 pzem(Serial2, PZEM_RX_PIN, PZEM_TX_PIN);

TaskHandle_t FirebaseTaskHandle;
RelayState relays[3];
unsigned long debounceTimes[3] = {0, 0, 0};

bool pendingSync[3] = {false, false, false};
bool pendingLog[3]  = {false, false, false};

bool isOnline = false;
bool wasOffline = false;
bool isSetupMode = false;
unsigned long lastSeenTimestamp = 0;

float lastVoltage = 0, lastCurrent = 0, lastPower = 0, lastEnergy = 0;
unsigned long previousMillis = 0;

// Instansiasi variabel tombol Reset
bool lastResetButtonState = HIGH;
unsigned long lastResetDebounce = 0;



// ==========================================
// SETUP (CORE 1)
// ==========================================
void setup() {
  Serial.begin(115200);

  WiFi.mode(WIFI_STA);
  delay(100);

  NODE_ID = "ESP32-" + WiFi.macAddress();
  NODE_ID.replace(":", "");
  Serial.println("[SYSTEM] NODE ID: " + NODE_ID);

  initRelays();

  // NVS Firmware Check
  String currentBuild = String(__DATE__) + " " + String(__TIME__);
  preferences.begin("sys_info", false);
  if (preferences.getString("build_time", "") != currentBuild) {
    Serial.println("[SYSTEM] Firmware baru! Reset NVS...");
    preferences.end();
    preferences.begin("wifi_creds", false); preferences.clear(); preferences.end();
    preferences.begin("sys_info", false); preferences.putString("build_time", currentBuild);
  }
  preferences.end();

  // Load WiFi Credentials
  preferences.begin("wifi_creds", true);
  bool hasSavedWiFi = false;
  for (int i = 0; i < 5; i++) {
    String s = preferences.getString(("ssid_" + String(i)).c_str(), "");
    String p = preferences.getString(("password_" + String(i)).c_str(), "");
    if (s != "") { wifiMulti.addAP(s.c_str(), p.c_str()); hasSavedWiFi = true; }
  }
  preferences.end();

  // Start Network
  if (!hasSavedWiFi) {
    isSetupMode = true;
    String apName = "SmartCampus-SETUP-" + NODE_ID.substring(NODE_ID.length() - 4);
    WiFi.mode(WIFI_AP); WiFi.softAP(apName.c_str(), "");
    dnsServer.start(DNS_PORT, "*", WiFi.softAPIP());
    Serial.println("[WIFI] Mode AP Aktif: " + apName);
  } else {
    isSetupMode = false;
    Serial.print("[WIFI] Mencari jaringan.");
    unsigned long wifiStart = millis();
    while (wifiMulti.run() != WL_CONNECTED && millis() - wifiStart < 30000) { 
      handlePhysicalButtons(); // TETAP BACA SAKELAR SAAT MENCARI WIFI
      delay(100); 
      Serial.print("."); 
    }
    Serial.println();

    if (WiFi.status() == WL_CONNECTED) {
      isOnline = true;
      Serial.printf("[SYSTEM] Konek IP: %s\n", WiFi.localIP().toString().c_str());
      
      // Auto-discovery via HTTP mentah
      pushAutoDiscovery();
      staggeredBootRecovery();
    } else {
      Serial.println("[WIFI] Gagal terhubung. Melanjutkan ke Offline Mode.");
    }
    
    // Start Background Task for Internet
    xTaskCreatePinnedToCore(FirebaseTask, "FirebaseTask", 10000, NULL, 1, &FirebaseTaskHandle, 0);
  }
  
  setupWebServerRoutes();
}

// ==========================================
// LOOP (CORE 1)
// ==========================================
void loop() {
  // Sakelar fisik dan sensor HARUS selalu berjalan terlepas dari status jaringan
  handlePhysicalButtons();
  handleSensors();

  if (isSetupMode) {
    dnsServer.processNextRequest();
    server.handleClient();
    return; // Berhenti di sini khusus untuk mode Setup
  }

  server.handleClient();
}