#ifndef HARDWARE_H
#define HARDWARE_H
#include "Config.h"

inline void initRelays() {
  relays[0] = {RELAY_LAMPU, SWITCH_LAMPU, "relay_1_lampu", "light", false,
               "auto",      HIGH};
  relays[1] = {RELAY_KIPAS, SWITCH_KIPAS, "relay_2_kipas", "fan", false,
               "auto",      HIGH};
  relays[2] = {RELAY_STOPKONTAK,
               SWITCH_STOPKONTAK,
               "relay_3_stopkontak",
               "socket",
               false,
               "manual",
               HIGH};

  for (int i = 0; i < 3; i++) {
    // URUTAN YANG BENAR UNTUK ESP32
    // Buka gerbang OUTPUT dulu, lalu tembak HIGH secepat kilat (mikrodetik)
    pinMode(relays[i].pin, OUTPUT);
    digitalWrite(relays[i].pin, HIGH); // HIGH = Relay Mati

    // Inisialisasi Switch Input
    if (relays[i].switchPin >= 34) {
      pinMode(relays[i].switchPin, INPUT);
    } else {
      pinMode(relays[i].switchPin, INPUT_PULLUP);
    }
    relays[i].lastSwitchState = digitalRead(relays[i].switchPin);
  }
  pinMode(BTN_NETWORK_RESET, INPUT);
}

inline void handlePhysicalButtons() {
  unsigned long currentTime = millis();

  // ------------------------------------------
  // 1. MONITOR SAKELAR RELAY (LAMPU, KIPAS, STOPKONTAK)
  // ------------------------------------------
  for (int i = 0; i < 3; i++) { // Loop diubah menjadi 3
    bool currentButtonState = digitalRead(relays[i].switchPin);
    if (currentButtonState != relays[i].lastSwitchState) {
      if ((currentTime - debounceTimes[i]) > 350) {
        if (currentButtonState == LOW) {
          delay(10);
          if (digitalRead(relays[i].switchPin) == LOW) {
            relays[i].isOn = !relays[i].isOn;
            digitalWrite(relays[i].pin, relays[i].isOn ? LOW : HIGH);
            relays[i].mode = "manual";
            debounceTimes[i] = currentTime;

            Serial.printf("[SWITCH] Tombol %s Ditekan! Status Relay: %s\n",
                          relays[i].relayId.c_str(),
                          relays[i].isOn ? "ON" : "OFF");

            if (isOnline) {
              pendingSync[i] = true;
              pendingLog[i] = true;
            }
          }
        }
        relays[i].lastSwitchState = currentButtonState;
      }
    }
  }

  // ------------------------------------------
  // 2. MONITOR TOMBOL RESET (GPIO 34)
  // ------------------------------------------
  bool currentResetButton = digitalRead(BTN_NETWORK_RESET);
  if (currentResetButton == LOW) {
    if (lastResetButtonState == HIGH) {
      // Tombol baru saja mulai ditekan
      lastResetDebounce = currentTime;
      lastResetButtonState = LOW;
    } else {
      // Tombol sedang ditahan, cek durasi penahanan
      if (currentTime - lastResetDebounce >= 5000) {
        Serial.println(
            "[RESET] Tombol Ditahan >5 Detik! Menghapus WiFi & Rebooting...");

        // Hapus credential WiFi dari NVS
        preferences.begin("wifi_creds", false);
        preferences.clear();
        preferences.end();

        delay(1000);   // Beri jeda sejenak sebelum restart
        ESP.restart(); // Restart Node
      }
    }
  } else {
    // Tombol dilepas / tidak ditekan
    lastResetButtonState = HIGH;
  }
}

inline void handleSensors() {
  unsigned long currentTime = millis();
  if (currentTime - previousMillis >= SENSOR_INTERVAL) {
    previousMillis = currentTime;
    float v = pzem.voltage();
    float i = pzem.current();
    float p = pzem.power();
    float e = pzem.energy();

    if (!isnan(v)) {
      lastVoltage = v;
      lastCurrent = i;
      lastPower = p;
      lastEnergy = e;
    }
  }
}

#endif