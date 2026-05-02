// components/store/flash-sale-countdown.tsx
// Client component for displaying a real-time countdown for a flash sale

"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Timer } from "lucide-react";

interface FlashSaleCountdownProps {
  endTime: string | Date;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isExpired: boolean;
}

export function FlashSaleCountdown({ endTime }: FlashSaleCountdownProps) {
  const calculateTimeLeft = useCallback((): TimeLeft => {
    const difference = +new Date(endTime) - +new Date();
    
    if (difference <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true };
    }

    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
      isExpired: false,
    };
  }, [endTime]);

  const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft());
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const timer = setInterval(() => {
      const updated = calculateTimeLeft();
      setTimeLeft(updated);
      
      if (updated.isExpired) {
        clearInterval(timer);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [calculateTimeLeft]);

  if (!mounted) {
    return (
      <div className="space-y-2">
        <p className="text-xs font-semibold text-primary uppercase tracking-wider flex items-center gap-2">
          <Timer className="h-3 w-3" />
          Ends in:
        </p>
        <div className="flex items-center gap-2 opacity-50">
          <TimeUnit value={0} label="h" />
          <TimeUnit value={0} label="m" />
          <TimeUnit value={0} label="s" />
        </div>
      </div>
    );
  }

  if (timeLeft.isExpired) {
    return (
      <div className="flex items-center gap-2 text-muted-foreground bg-muted/50 rounded-full px-4 py-2 text-sm font-medium">
        <Timer className="h-4 w-4" />
        Sale has ended
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <p className="text-xs font-semibold text-primary uppercase tracking-wider flex items-center gap-2">
        <Timer className="h-3 w-3 animate-pulse" />
        Ends in:
      </p>
      <div className="flex items-center gap-2">
        {timeLeft.days > 0 && (
          <TimeUnit value={timeLeft.days} label="d" />
        )}
        <TimeUnit value={timeLeft.hours} label="h" />
        <TimeUnit value={timeLeft.minutes} label="m" />
        <TimeUnit value={timeLeft.seconds} label="s" />
      </div>
    </div>
  );
}

function TimeUnit({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex items-baseline gap-0.5 bg-primary/10 text-primary rounded-full px-3 py-1 font-mono text-sm font-bold border border-primary/20">
      <span>{value.toString().padStart(2, "0")}</span>
      <span className="text-[10px] uppercase font-sans font-medium text-primary/70">{label}</span>
    </div>
  );
}
