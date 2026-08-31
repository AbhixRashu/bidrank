import { ImageResponse } from "next/og";

export const alt = "BidRank \u2014 Live Bid-to-Rank Leaderboard for Products";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "space-between",
          backgroundColor: "#0D0E11",
          backgroundImage:
            "radial-gradient(circle at 25px 25px, #20222a 2%, transparent 0%), radial-gradient(circle at 75px 75px, #16171d 2%, transparent 0%)",
          backgroundSize: "100px 100px",
          padding: "60px 80px",
          fontFamily: "sans-serif",
          color: "white",
        }}
      >
        {/* Top bar with Badge */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
            }}
          >
            <div
              style={{
                width: "48px",
                height: "48px",
                borderRadius: "12px",
                backgroundColor: "#FF8A00",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: "900",
                fontSize: "28px",
                color: "#FFFFFF",
              }}
            >
              B
            </div>
            <span
              style={{
                fontSize: "36px",
                fontWeight: "800",
                letterSpacing: "-0.5px",
              }}
            >
              Bid<span style={{ color: "#FF8A00" }}>Rank</span>
            </span>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              backgroundColor: "rgba(255, 138, 0, 0.12)",
              border: "1px solid rgba(255, 138, 0, 0.3)",
              borderRadius: "9999px",
              padding: "8px 20px",
              fontSize: "18px",
              fontWeight: "600",
              color: "#FF8A00",
            }}
          >
            🇮🇳 India&apos;s Live Attention Leaderboard
          </div>
        </div>

        {/* Main headline */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div
            style={{
              fontSize: "58px",
              fontWeight: "900",
              lineHeight: 1.1,
              letterSpacing: "-1px",
              color: "#FFFFFF",
              maxWidth: "950px",
            }}
          >
            Get Discovered by Thousands of Customers & Investors.
          </div>
          <div
            style={{
              fontSize: "24px",
              color: "#9CA3AF",
              maxWidth: "850px",
              lineHeight: 1.4,
            }}
          >
            The fair, verified live product leaderboard. Higher verified bid claims the top rank instantly.
          </div>
        </div>

        {/* Footer features */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "32px",
            borderTop: "1px solid #27272A",
            paddingTop: "28px",
            width: "100%",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "20px", color: "#E5E7EB" }}>
            <span style={{ color: "#10B981", fontSize: "22px" }}>•</span> Instant UPI & Cards
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "20px", color: "#E5E7EB" }}>
            <span style={{ color: "#10B981", fontSize: "22px" }}>•</span> Verified Real-time Bids
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "20px", color: "#E5E7EB" }}>
            <span style={{ color: "#10B981", fontSize: "22px" }}>•</span> Direct DoFollow Traffic
          </div>
          <div
            style={{
              marginLeft: "auto",
              fontSize: "20px",
              fontWeight: "700",
              color: "#FF8A00",
            }}
          >
            bidrank.online
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
