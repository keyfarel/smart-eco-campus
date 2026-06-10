"use client";

import React, { useEffect, useRef, useState } from "react";
import * as tf from "@tensorflow/tfjs";
import * as cocoSsd from "@tensorflow-models/coco-ssd";
import { rtdb } from "@/lib/firebase";
import { ref, onValue, update, push, set, get } from "firebase/database";
import { Camera, CameraOff, Brain, User, AlertTriangle } from "lucide-react";

const DAEMON_ID = "bld_sipil_001_f7_lpr1"; // Used by Next.js API to toggle camera
const NODE_ID = "ESP32-80F3DA62F3A8"; // Used by Dashboard telemetry for Person Count & Relays
const ROOM_ID = "bld_sipil_001_f7_lpr1"; // Used for Room Automation Auto/Manual
const ROOM_CODE = "LPR 1"; // Used for Next.js generic devices
const GRACE_PERIOD_MS = 10000;

export function GlobalAICamera() {
  const [cameraPower, setCameraPower] = useState(false);
  const [isModelLoading, setIsModelLoading] = useState(false);
  const [personCount, setPersonCount] = useState(0);
  const [error, setError] = useState<string | null>(null);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const modelRef = useRef<cocoSsd.ObjectDetection | null>(null);
  const animationRef = useRef<number | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  
  // State refs for async detection loop
  const lastPersonCountRef = useRef<number>(-1);
  const emptyRoomStartTimeRef = useRef<number | null>(null);
  const roomAutoRef = useRef<boolean>(false);
  const isUpdatingRef = useRef<boolean>(false);

  // 1. Listen to Camera Power & Room Auto from Firebase
  useEffect(() => {
    if (!rtdb) return;

    const powerRef = ref(rtdb, `nodes/${DAEMON_ID}/camera_power`);
    
    // Reset camera power to false on fresh load so it doesn't auto-start on refresh
    set(powerRef, false).catch(console.error);

    const unsubPower = onValue(powerRef, (snap) => {
      setCameraPower(!!snap.val());
    });

    const autoRef = ref(rtdb, `room_automation/${ROOM_ID}`);
    const unsubAuto = onValue(autoRef, (snap) => {
      roomAutoRef.current = !!snap.val();
    });

    return () => {
      unsubPower();
      unsubAuto();
    };
  }, []);

  // 2. Setup Camera and Model when Power Changes
  useEffect(() => {
    if (cameraPower) {
      startCamera();
      // Force room auto when AI is ON (as Python did)
      if (rtdb) {
        set(ref(rtdb, `room_automation/${ROOM_ID}`), true).catch(console.error);
      }
    } else {
      stopCamera(true); // Force graceful shutdown of relays
    }

    return () => {
      stopCamera(false); // Do not force relay shutdown on unmount
    };
  }, [cameraPower]);

  const startCamera = async () => {
    try {
      setError(null);
      setIsModelLoading(true);
      
      // Load TF Model
      await tf.ready();
      if (!modelRef.current) {
        modelRef.current = await cocoSsd.load();
      }

      // Load Webcam
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { width: 640, height: 480 } 
      });
      streamRef.current = stream;
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          videoRef.current?.play().catch((e) => {
            console.warn("Video auto-play blocked or failed:", e.message);
          });
          setIsModelLoading(false);
          detectFrame();
        };
      }
    } catch (err: any) {
      // Use console.warn to prevent Next.js dev overlay from catching console.error
      console.warn("Failed to start camera:", err.message);
      setError(err.name === "NotAllowedError" ? "Camera permission denied." : (err.message || "Failed to access webcam"));
      setIsModelLoading(false);
    }
  };

  const stopCamera = async (shutdownRelays: boolean = false) => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
    
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    setPersonCount(0);
    lastPersonCountRef.current = -1;
    emptyRoomStartTimeRef.current = null;

    // Run graceful shutdown logic deterministically
    if (rtdb && shutdownRelays) {
      try {
        const isoNow = new Date().toISOString();
        
        const updates: any = {};
        updates[`room_automation/${ROOM_ID}`] = false;
        updates[`devices/${ROOM_CODE}-lamp/isOn`] = false;
        updates[`devices/${ROOM_CODE}-lamp/lastUpdated`] = isoNow;
        updates[`devices/${ROOM_CODE}-acFan/isOn`] = false;
        updates[`devices/${ROOM_CODE}-acFan/lastUpdated`] = isoNow;
        updates[`nodes/${NODE_ID}/relays/relay_1_lampu/is_on`] = false;
        updates[`nodes/${NODE_ID}/relays/relay_2_kipas/is_on`] = false;
        
        await update(ref(rtdb), updates);
        
        await push(ref(rtdb, `logs/${NODE_ID}`), {
          relay_id: "bulk",
          action: "OFF",
          timestamp: Math.floor(Date.now() / 1000),
          triggered_by: "System Override",
          reason: "AI Camera Manual Shutdown"
        });
      } catch (err) {
        console.error("Error shutting down relays:", err);
      }
    }
  };

  const processAutomation = async (count: number) => {
    if (!rtdb || isUpdatingRef.current) return;
    
    const lastCount = lastPersonCountRef.current;
    const now = Date.now();

    // 1. Update if count changed
    if (count !== lastCount) {
      isUpdatingRef.current = true;
      try {
        const updates: any = {};
        updates[`nodes/${NODE_ID}/ai_vision/person_count`] = count;
        updates[`nodes/${NODE_ID}/ai_vision/grace_period_active`] = count === 0;

        let shouldPushLog = false;

        // Turn ON logic
        // Gunakan lastCount <= 0 agar saat baru pertama menyala (lastCount = -1) dan ada orang, lampu langsung hidup
        if (lastCount <= 0 && count > 0) {
          if (roomAutoRef.current) {
            const isoNow = new Date().toISOString();
            updates[`devices/${ROOM_CODE}-lamp/isOn`] = true;
            updates[`devices/${ROOM_CODE}-lamp/lastUpdated`] = isoNow;
            updates[`devices/${ROOM_CODE}-acFan/isOn`] = true;
            updates[`devices/${ROOM_CODE}-acFan/lastUpdated`] = isoNow;
            updates[`nodes/${NODE_ID}/relays/relay_1_lampu/is_on`] = true;
            updates[`nodes/${NODE_ID}/relays/relay_2_kipas/is_on`] = true;
            shouldPushLog = true;
          }
        }

        if (count === 0) {
          emptyRoomStartTimeRef.current = now;
        } else {
          emptyRoomStartTimeRef.current = null;
        }

        // Tembak sekaligus (Batch update) agar IoT merespon secara instan
        await update(ref(rtdb), updates);

        // Lempar log di background tanpa ditunggu
        if (shouldPushLog) {
          push(ref(rtdb, `logs/${NODE_ID}`), {
            relay_id: "bulk",
            action: "ON",
            timestamp: Math.floor(now / 1000),
            triggered_by: "AI Otonom (Web Vision)",
            reason: "Orang Terdeteksi Masuk"
          }).catch(console.error);
        }

      } catch (err) {
        console.error("Error updating firebase:", err);
      } finally {
        isUpdatingRef.current = false;
      }
      
      lastPersonCountRef.current = count;
    }

    // 2. Grace period check (Turn OFF)
    if (count === 0 && emptyRoomStartTimeRef.current !== null) {
      if (now - emptyRoomStartTimeRef.current >= GRACE_PERIOD_MS) {
        if (!isUpdatingRef.current && roomAutoRef.current) {
          isUpdatingRef.current = true;
          try {
            const isoNow = new Date().toISOString();
            const updates: any = {};
            updates[`devices/${ROOM_CODE}-lamp/isOn`] = false;
            updates[`devices/${ROOM_CODE}-lamp/lastUpdated`] = isoNow;
            updates[`devices/${ROOM_CODE}-acFan/isOn`] = false;
            updates[`devices/${ROOM_CODE}-acFan/lastUpdated`] = isoNow;
            updates[`nodes/${NODE_ID}/relays/relay_1_lampu/is_on`] = false;
            updates[`nodes/${NODE_ID}/relays/relay_2_kipas/is_on`] = false;
            
            await update(ref(rtdb), updates);
            
            push(ref(rtdb, `logs/${NODE_ID}`), {
              relay_id: "bulk",
              action: "OFF",
              timestamp: Math.floor(now / 1000),
              triggered_by: "AI Otonom (Web Vision)",
              reason: `Ruangan kosong melampaui ${GRACE_PERIOD_MS/1000} detik`
            }).catch(console.error);

            emptyRoomStartTimeRef.current = null;
          } catch (err) {
            console.error("Error shutting off:", err);
          } finally {
            isUpdatingRef.current = false;
          }
        }
      }
    }
  };

  const detectFrame = async () => {
    if (
      !modelRef.current || 
      !videoRef.current || 
      videoRef.current.readyState !== 4
    ) {
      animationRef.current = requestAnimationFrame(detectFrame);
      return;
    }

    try {
      // Create offscreen canvas for preprocessing (Night Vision)
      let inputElement: HTMLVideoElement | HTMLCanvasElement = videoRef.current;
      
      // Assume lights are OFF if count is 0 and grace period has finished
      const isNightVisionActive = lastPersonCountRef.current === 0 && emptyRoomStartTimeRef.current === null;
      
      if (isNightVisionActive) {
        let hiddenCanvas = document.getElementById("ai-hidden-canvas") as HTMLCanvasElement;
        if (!hiddenCanvas) {
          hiddenCanvas = document.createElement("canvas");
          hiddenCanvas.id = "ai-hidden-canvas";
          hiddenCanvas.width = 640;
          hiddenCanvas.height = 480;
          hiddenCanvas.style.display = "none";
          document.body.appendChild(hiddenCanvas);
        }
        
        const hiddenCtx = hiddenCanvas.getContext("2d", { willReadFrequently: true });
        if (hiddenCtx) {
          // Boost Brightness 350%, Contrast 200%, and Grayscale for Night Vision
          hiddenCtx.filter = "brightness(350%) contrast(200%) grayscale(100%)";
          hiddenCtx.drawImage(videoRef.current, 0, 0, 640, 480);
          inputElement = hiddenCanvas;
        }
      }

      // Detect using the pre-processed image (or raw video if lights are ON)
      const predictions = await modelRef.current.detect(inputElement);
      
      // Filter only persons
      const persons = predictions.filter(p => p.class === "person" && p.score > 0.45);
      setPersonCount(persons.length);

      // Process Logic
      processAutomation(persons.length);

      // Draw Bounding Boxes and UI Overlays
      if (canvasRef.current) {
        const ctx = canvasRef.current.getContext("2d");
        if (ctx) {
          ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
          
          if (isNightVisionActive) {
            ctx.fillStyle = "rgba(16, 185, 129, 0.15)"; // Green Night Vision Tint
            ctx.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);
            ctx.fillStyle = "#10B981";
            ctx.font = "bold 14px monospace";
            ctx.fillText("NIGHT VISION ENHANCEMENT ACTIVE", 15, 25);
          }

          persons.forEach(person => {
            const [x, y, width, height] = person.bbox;
            ctx.strokeStyle = "#00FF00";
            ctx.lineWidth = 3;
            ctx.strokeRect(x, y, width, height);
            
            ctx.fillStyle = "#00FF00";
            ctx.font = "16px Arial";
            ctx.fillText(`Person ${Math.round(person.score * 100)}%`, x, y > 20 ? y - 5 : 15);
          });
        }
      }
    } catch (err) {
      // Ignore prediction errors during unmounts
    }

    animationRef.current = requestAnimationFrame(detectFrame);
  };

  const [portalTarget, setPortalTarget] = useState<HTMLElement | null>(null);

  useEffect(() => {
    // 1. Create a persistent Ghost Target in the body if it doesn't exist
    let ghost = document.getElementById("ai-ghost-target");
    if (!ghost) {
      ghost = document.createElement("div");
      ghost.id = "ai-ghost-target";
      ghost.style.display = "none"; // Completely hidden from UI
      document.body.appendChild(ghost);
    }
    
    // 2. Poll for the Dashboard Portal target
    const interval = setInterval(() => {
      const dashboardPortal = document.getElementById("ai-camera-portal");
      // If dashboard exists, portal there. Otherwise, portal to ghost (background mode).
      setPortalTarget(dashboardPortal || ghost);
    }, 500);

    return () => clearInterval(interval);
  }, []);

  // Heartbeat Telemetry
  useEffect(() => {
    if (!rtdb) return;
    const interval = setInterval(() => {
      if (cameraPower) {
        update(ref(rtdb, `nodes/${NODE_ID}/telemetry`), {
          last_seen_timestamp: Math.floor(Date.now() / 1000)
        }).catch(() => {});
      }
    }, 10000);
    return () => clearInterval(interval);
  }, [cameraPower]);

  if (!cameraPower && !error) return null;
  if (!portalTarget) return null; // Wait for target

  const cameraContent = (
    <div className="relative w-full h-full bg-black flex items-center justify-center overflow-hidden">
      {error ? (
        <div className="text-xs text-red-400 px-4 text-center">{error}</div>
      ) : (
        <>
          <video 
            ref={videoRef} 
            autoPlay 
            playsInline 
            muted 
            className="absolute inset-0 w-full h-full object-cover opacity-80"
          />
          <canvas 
            ref={canvasRef} 
            width={640} 
            height={480}
            className="absolute inset-0 w-full h-full object-cover z-10"
          />
        </>
      )}
    </div>
  );

  // Magic Teleportation via React Portal
  return require("react-dom").createPortal(cameraContent, portalTarget);
}
