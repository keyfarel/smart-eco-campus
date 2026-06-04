#ifndef CONFIG_H
#define CONFIG_H

#include <Arduino.h>
#include <WiFi.h>
#include <WiFiMulti.h>
#include <WebServer.h>
#include <DNSServer.h>
#include <Preferences.h>
#include <PZEM004Tv30.h>
#include <WiFiClientSecure.h>
#include <HTTPClient.h>

// ==========================================
// CONFIGURATION & PINS
// ==========================================
extern const char* FIREBASE_HOST;
extern String NODE_ID;

#define PZEM_RX_PIN 16
#define PZEM_TX_PIN 17
#define RELAY_LAMPU 26
#define RELAY_KIPAS 27
#define RELAY_STOPKONTAK 25
#define SWITCH_LAMPU 33
#define SWITCH_KIPAS 32
#define SWITCH_STOPKONTAK 35
#define BTN_NETWORK_RESET 34

const byte DNS_PORT = 53;
const long SENSOR_INTERVAL = 2000;
const long FIREBASE_INTERVAL = 3000;

// ==========================================
// DATA STRUCTURES
// ==========================================
struct RelayState {
  uint8_t pin;
  uint8_t switchPin;
  String relayId;
  String type;
  bool isOn;
  String mode;
  bool lastSwitchState;
};

// ==========================================
// GLOBAL EXTERN VARIABLES
// ==========================================
extern WebServer server;
extern DNSServer dnsServer;
extern Preferences preferences;
extern WiFiMulti wifiMulti;
extern PZEM004Tv30 pzem;
extern TaskHandle_t FirebaseTaskHandle;

extern RelayState relays[3];
extern unsigned long debounceTimes[3];

extern bool pendingSync[3];
extern bool pendingLog[3];

extern bool isOnline;
extern bool wasOffline;
extern bool isSetupMode;
extern unsigned long lastSeenTimestamp;

extern float lastVoltage, lastCurrent, lastPower, lastEnergy;
extern unsigned long previousMillis;

// Tambahan untuk tracker tombol Reset
extern bool lastResetButtonState;
extern unsigned long lastResetDebounce;

#endif