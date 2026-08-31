"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import type { RealtimeBidEvent } from "@/types";

interface UseRealtimeBidsOptions {
  onNewBid?: (event: RealtimeBidEvent) => void;
  onOutbid?: (event: RealtimeBidEvent) => void;
  onRankChanged?: (event: RealtimeBidEvent) => void;
  onLeaderboardUpdate?: (event: RealtimeBidEvent) => void;
  enabled?: boolean;
}

export function useRealtimeBids(options: UseRealtimeBidsOptions = {}) {
  const {
    onNewBid,
    onOutbid,
    onRankChanged,
    onLeaderboardUpdate,
    enabled = true,
  } = options;

  const [isConnected, setIsConnected] = useState(false);
  const [lastEvent, setLastEvent] = useState<RealtimeBidEvent | null>(null);
  const eventSourceRef = useRef<EventSource | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const reconnectAttempts = useRef(0);
  const callbacksRef = useRef({
    onNewBid,
    onOutbid,
    onRankChanged,
    onLeaderboardUpdate,
  });

  callbacksRef.current = {
    onNewBid,
    onOutbid,
    onRankChanged,
    onLeaderboardUpdate,
  };

  const connect = useCallback(() => {
    if (!enabled || eventSourceRef.current) return;

    const es = new EventSource("/api/realtime/bids");

    es.addEventListener("connected", () => {
      setIsConnected(true);
      reconnectAttempts.current = 0;
    });

    es.addEventListener("bid:new", ((e: MessageEvent) => {
      const data = JSON.parse(e.data) as RealtimeBidEvent;
      data.type = "bid:new";
      setLastEvent(data);
      callbacksRef.current.onNewBid?.(data);
    }) as EventListener);

    es.addEventListener("bid:outbid", ((e: MessageEvent) => {
      const data = JSON.parse(e.data) as RealtimeBidEvent;
      data.type = "bid:outbid";
      setLastEvent(data);
      callbacksRef.current.onOutbid?.(data);
    }) as EventListener);

    es.addEventListener("rank:changed", ((e: MessageEvent) => {
      const data = JSON.parse(e.data) as RealtimeBidEvent;
      data.type = "rank:changed";
      setLastEvent(data);
      callbacksRef.current.onRankChanged?.(data);
    }) as EventListener);

    es.addEventListener("leaderboard:update", ((e: MessageEvent) => {
      const data = JSON.parse(e.data) as RealtimeBidEvent;
      data.type = "leaderboard:update";
      setLastEvent(data);
      callbacksRef.current.onLeaderboardUpdate?.(data);
    }) as EventListener);

    es.onerror = () => {
      setIsConnected(false);
      es.close();
      eventSourceRef.current = null;

      const delay = Math.min(1000 * 2 ** reconnectAttempts.current, 30000);
      reconnectAttempts.current++;
      reconnectTimeoutRef.current = setTimeout(connect, delay);
    };

    eventSourceRef.current = es;
  }, [enabled]);

  useEffect(() => {
    if (enabled) {
      connect();

      // Background fallback polling every 10s
      const pollInterval = setInterval(async () => {
        try {
          const res = await fetch("/api/leaderboard?limit=200");
          if (res.ok) {
            const data = await res.json();
            if (data.leaderboard) {
              callbacksRef.current.onLeaderboardUpdate?.({
                type: "leaderboard:update",
                timestamp: new Date().toISOString(),
                data: { leaderboard: data.leaderboard },
              });
            }
          }
        } catch {
          // ignore background poll errors
        }
      }, 10000);

      return () => {
        clearInterval(pollInterval);
        if (reconnectTimeoutRef.current) {
          clearTimeout(reconnectTimeoutRef.current);
        }
        if (eventSourceRef.current) {
          eventSourceRef.current.close();
          eventSourceRef.current = null;
        }
        setIsConnected(false);
      };
    }
  }, [enabled, connect]);

  return { isConnected, lastEvent };
}
