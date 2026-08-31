"use client";

import { useEffect, useRef, useState } from "react";

interface UpiQrCodeProps {
  upiUrl: string;
  size?: number;
}

/**
 * Renders a UPI QR code entirely client-side using the `qrcode` npm package.
 * No external API calls — works fully offline.
 */
export function UpiQrCode({ upiUrl, size = 180 }: UpiQrCodeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [error, setError] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!upiUrl) return;
    let cancelled = false;

    // Dynamically import qrcode so it's only loaded when needed (client-side)
    import("qrcode").then((QRCode) => {
      if (cancelled || !canvasRef.current) return;
      QRCode.toCanvas(canvasRef.current, upiUrl, {
        width: size,
        margin: 2,
        color: {
          dark: "#101114",
          light: "#FFFFFF",
        },
        errorCorrectionLevel: "M",
      })
        .then(() => {
          if (!cancelled) setReady(true);
        })
        .catch(() => {
          if (!cancelled) setError(true);
        });
    }).catch(() => {
      if (!cancelled) setError(true);
    });

    return () => {
      cancelled = true;
    };
  }, [upiUrl, size]);

  if (error) {
    return (
      <div
        style={{ width: size, height: size }}
        className="flex flex-col items-center justify-center rounded-xl border border-red-200 bg-red-50 text-red-500 text-xs text-center p-3"
      >
        QR load nahi hua. UPI ID copy karke manually pay karein.
      </div>
    );
  }

  return (
    <div className="relative" style={{ width: size, height: size }}>
      {/* Loading skeleton */}
      {!ready && (
        <div
          style={{ width: size, height: size }}
          className="absolute inset-0 rounded-xl border border-[#E6E4DF] bg-[#F8F7F3] animate-pulse"
        />
      )}
      <canvas
        ref={canvasRef}
        className={`rounded-xl border border-[#E6E4DF] transition-opacity duration-300 ${
          ready ? "opacity-100" : "opacity-0"
        }`}
        style={{ width: size, height: size }}
      />
    </div>
  );
}
