"use client";

import React, { useEffect, useState } from "react";
import { eventConfig } from "@/lib/config";
import { Sparkles, Flame } from "lucide-react";

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export default function Countdown() {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isLive, setIsLive] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const target = new Date(eventConfig.targetIsoDate).getTime();

    const calculate = () => {
      const now = new Date().getTime();
      const difference = target - now;

      if (difference <= 0) {
        setIsLive(true);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      } else {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((difference / 1000 / 60) % 60);
        const seconds = Math.floor((difference / 1000) % 60);
        setTimeLeft({ days, hours, minutes, seconds });
      }
    };

    calculate();
    const interval = setInterval(calculate, 1000);
    return () => clearInterval(interval);
  }, []);

  const timeUnits = [
    { label: "DAYS", value: timeLeft.days },
    { label: "HOURS", value: timeLeft.hours },
    { label: "MINUTES", value: timeLeft.minutes },
    { label: "SECONDS", value: timeLeft.seconds },
  ];

  return (
    <div className="w-full rounded-2xl bg-[#F5EBE1]/90 border border-[#292524]/15 p-5 sm:p-7 shadow-parchment-card">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-4">
        <div className="flex items-center gap-2 text-[#E65100] text-xs font-black uppercase tracking-wider">
          <Flame className="w-4 h-4 fill-[#E65100]" />
          <span>COUNTDOWN TO SANGAM</span>
        </div>
        <div className="text-[11px] font-bold text-[#57534E]">
          {eventConfig.dateDisplay} • {eventConfig.timeDisplay}
        </div>
      </div>

      <div className="grid grid-cols-4 gap-2.5 sm:gap-4 text-center">
        {timeUnits.map((unit) => (
          <div
            key={unit.label}
            className="p-3 sm:p-4 rounded-xl bg-[#FAF4EC] border border-[#292524]/10 shadow-sm"
          >
            <span className="font-display font-black text-2xl sm:text-4xl text-[#1C1917] block leading-none">
              {isMounted ? String(unit.value).padStart(2, "0") : "--"}
            </span>
            <span className="text-[9px] sm:text-[10px] font-extrabold uppercase tracking-widest text-[#E65100] block mt-1.5">
              {unit.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
