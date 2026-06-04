"use client";

import React from "react";
import { SessionProvider } from "next-auth/react";
import { Toaster } from "sonner";

interface ProvidersProps {
  children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <SessionProvider>
      {children}
      <Toaster 
        position="bottom-right" 
        expand={false} 
        richColors
        theme="dark"
        toastOptions={{
          style: {
            padding: "12px 16px",
            borderRadius: "12px",
            border: "1px solid #27272a",
            background: "#09090b", // Base background fallback
            // Override Sonner Internal Variables
            "--success-bg": "rgba(6, 78, 59, 0.9)",
            "--success-border": "rgba(6, 95, 70, 0.5)",
            "--success-text": "#34d399",
            "--error-bg": "rgba(127, 29, 29, 0.9)",
            "--error-border": "rgba(153, 27, 27, 0.5)",
            "--error-text": "#f87171",
            "--info-bg": "rgba(30, 58, 138, 0.9)",
            "--info-border": "rgba(30, 64, 175, 0.5)",
            "--info-text": "#60a5fa",
            "--warning-bg": "rgba(120, 53, 15, 0.9)",
            "--warning-border": "rgba(146, 64, 14, 0.5)",
            "--warning-text": "#fbbf24",
          } as React.CSSProperties,
        }}
      />
    </SessionProvider>
  );
}
