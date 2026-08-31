"use client";

import { useRef, useCallback, useState } from "react";
import { Download, CheckCircle } from "lucide-react";
import { formatINR } from "@/lib/utils";

interface BragCardProps {
  productName: string;
  bidAmount: number;
  rank?: number;
  claimedAt?: string;
  category?: string;
}

export function BragCard({ productName, bidAmount, rank = 1, claimedAt, category }: BragCardProps) {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [downloading, setDownloading] = useState(false);

  const dateStr = claimedAt
    ? new Date(claimedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
    : new Date().toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });

  const handleDownload = useCallback(async () => {
    if (!canvasRef.current) return;
    setDownloading(true);

    try {
      const { default: htmlToImage } = await import("html-to-image");
      const dataUrl = await htmlToImage.toPng(canvasRef.current, {
        pixelRatio: 2,
        backgroundColor: "#0a0a0f",
      });

      const link = document.createElement("a");
      link.download = `indbid-rank-${rank}-${productName.toLowerCase().replace(/\s+/g, "-")}.png`;
      link.href = dataUrl;
      link.click();
    } catch {
      try {
        const canvas = document.createElement("canvas");
        canvas.width = 800;
        canvas.height = 420;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const gradient = ctx.createLinearGradient(0, 0, 800, 420);
        gradient.addColorStop(0, "#0a0a0f");
        gradient.addColorStop(0.5, "#1a1a2e");
        gradient.addColorStop(1, "#0a0a0f");
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 800, 420);

        ctx.fillStyle = "#FF8A00";
        ctx.beginPath();
        ctx.arc(400, 80, 30, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "#fff";
        ctx.font = "bold 24px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("\u{1F451}", 400, 88);

        ctx.fillStyle = "#FF8A00";
        ctx.font = "bold 14px sans-serif";
        ctx.fillText(`RANK #${rank} CLAIMED ON INDBID`, 400, 140);

        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 36px sans-serif";
        ctx.fillText(productName, 400, 200);

        ctx.fillStyle = "#FF8A00";
        ctx.font = "bold 48px sans-serif";
        ctx.fillText(formatINR(bidAmount), 400, 280);

        ctx.fillStyle = "#888888";
        ctx.font = "14px sans-serif";
        ctx.fillText(`${dateStr} \u2022 Verified \u2713`, 400, 340);

        ctx.fillStyle = "#FF8A00";
        ctx.font = "12px sans-serif";
        ctx.fillText("indbid.in", 400, 390);

        canvas.toBlob((blob) => {
          if (!blob) return;
          const url = URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.download = `indbid-rank-${rank}-${productName.toLowerCase().replace(/\s+/g, "-")}.png`;
          link.href = url;
          link.click();
          URL.revokeObjectURL(url);
        });
      } catch {
        // Download failed silently
      }
    } finally {
      setDownloading(false);
    }
  }, [productName, bidAmount, rank, dateStr]);

  const shareText = encodeURIComponent(
    `\u{1F680} We just claimed Rank #${rank} on @IndBid for ${productName}! Can you outbid us? Check the live leaderboard \u{1F447}`
  );
  const shareUrl = encodeURIComponent("https://indbid.in");

  return (
    <div className="space-y-4">
      <div
        ref={canvasRef}
        className="relative overflow-hidden rounded-2xl p-8 text-center"
        style={{
          background: "linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 50%, #0a0a0f 100%)",
          minWidth: "100%",
        }}
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#FF8A00] to-transparent" />
        <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#FF8A00] to-transparent" />

        <div className="relative z-10">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-[#FF8A00] mb-4 shadow-[0_0_30px_rgba(255,138,0,0.5)]">
            <span className="text-2xl">{"\u{1F451}"}</span>
          </div>

          <p className="text-[11px] tracking-[0.2em] text-[#FF8A00] font-bold uppercase mb-3">
            RANK #{rank} CLAIMED ON INDBID
          </p>

          <h3 className="text-3xl font-black text-white mb-3 tracking-tight">
            {productName}
          </h3>

          <p className="text-4xl font-black text-[#FF8A00] mb-4 tracking-tight">
            {formatINR(bidAmount)}
          </p>

          <div className="flex items-center justify-center gap-3 text-xs text-gray-400">
            <span>{dateStr}</span>
            <span className="text-gray-600">{"\u2022"}</span>
            <span className="flex items-center gap-1 text-[#138A4B]">
              <CheckCircle className="h-3 w-3" />
              Verified
            </span>
            {category && (
              <>
                <span className="text-gray-600">{"\u2022"}</span>
                <span>{category}</span>
              </>
            )}
          </div>

          <p className="text-[10px] text-[#FF8A00]/50 mt-4 tracking-wider uppercase">
            indbid.in
          </p>
        </div>
      </div>

      <div className="flex gap-2">
        <button
          onClick={handleDownload}
          disabled={downloading}
          className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-[#101114] text-white text-xs font-semibold hover:bg-black transition-colors disabled:opacity-50"
        >
          <Download className="h-3.5 w-3.5" />
          {downloading ? "Downloading..." : "Download Image"}
        </button>
        <a
          href={`https://twitter.com/intent/tweet?text=${shareText}&url=${shareUrl}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-[#101114] text-white text-xs font-semibold hover:bg-black transition-colors"
        >
          <svg className="h-3.5 w-3.5 fill-current" viewBox="0 0 24 24">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 24.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
          Share on X
        </a>
      </div>
    </div>
  );
}
