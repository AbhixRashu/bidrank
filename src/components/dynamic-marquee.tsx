"use client";

import { useState, useEffect } from "react";
import { Marquee } from "@/components/marquee";
import { formatINR } from "@/lib/utils";

export function DynamicMarquee() {
  const [items, setItems] = useState<string[]>([]);

  useEffect(() => {
    fetch("/api/activity")
      .then((r) => r.json())
      .then((data) => {
        const ticker = (data.activities ?? []).map(
          (a: { listing: string; action: string; amount: number }) =>
            `${a.listing} ${a.action} for ${formatINR(a.amount)}`
        );
        if (ticker.length > 0) {
          setItems(ticker);
        } else {
          setItems(["No bids yet — claim the #1 spot!"]);
        }
      })
      .catch(() => setItems(["No bids yet — claim the #1 spot!"]));
  }, []);

  return <Marquee items={items} speed={35} />;
}
