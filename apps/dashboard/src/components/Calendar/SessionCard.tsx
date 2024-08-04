"use client";

import Link from "next/link";
import React from "react";
import { cn } from "@repo/ui/lib/utils";
import { session } from "@repo/db";
import Bar from "@components/bar";

type Props = {
  day: Date;
  sessions: session[];
};

const zones = {
  td(value: number) {
    if (value <= 3500) return "green-500";
    if (value >= 5500) return "red-500";
    return "orange-300";
  },
  pd(value: number) {
    if (value <= 350) return "green-500";
    if (value >= 650) return "red-500";
    return "orange-300";
  },
  sd(value: number) {
    if (value <= 100) return "green-500";
    if (value >= 180) return "red-500";
    return "orange-300";
  },
};

export default function SessionCard({ day, sessions }: Props) {
  const currentDaySessions = sessions?.filter(
    (session) =>
      session.start_timestamp.toLocaleDateString() === day.toLocaleDateString(),
  );
  function roundToNearest5(date = new Date()) {
    const minutes = 5;
    const ms = 1000 * 60 * minutes;

    // 👇️ replace Math.round with Math.ceil to always round UP
    return new Date(Math.round(date.getTime() / ms) * ms);
  }
  if (currentDaySessions.length === 0) return null;

  function convertSecToMin(duration: number | null) {
    if (!duration) return 0;
    return duration / 60;
  }

  return (
    <div className="flex flex-col gap-2">
      {currentDaySessions.map((session) => {
        const {
          id,
          start_timestamp,
          total_distance,
          total_time,
          name,
          athletesessionpowerzone_distance_2,
          athletesessionpowerzone_distance_3,
          athletesessionspeedzone_distance_4,
          athletesessionspeedzone_distance_5,
        } = session;

        const power_distance =
          (athletesessionpowerzone_distance_2 || 0) +
          (athletesessionpowerzone_distance_3 || 0);
        const speedzone_distance =
          (athletesessionspeedzone_distance_4 || 0) +
          (athletesessionspeedzone_distance_5 || 0);
        return (
          <Link
            key={id}
            href={`/performance/${id}`}
            className={cn(
              "text-accent-foreground mx-1 flex flex-col gap-2 overflow-auto truncate rounded-lg px-2 py-1 text-xs transition-all hover:bg-opacity-80",
              {
                "bg-sky-300 dark:bg-sky-800":
                  name && name.startsWith("[ТРЕНИРОВКА"),
              },
              {
                "bg-red-300 dark:bg-red-800": name && name.startsWith("[МАТЧ"),
              },
            )}
          >
            <div className="flex justify-between">
              <span className="font-semibold">
                {roundToNearest5(start_timestamp).toLocaleTimeString("ru-RU", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
              <span className="font-semibold">
                {convertSecToMin(total_time).toFixed(0)}&apos;
              </span>
            </div>
            <div className="grid grid-cols-[min-content_1fr] items-center justify-items-end gap-x-2">
              <span className="">
                {Number(total_distance?.toFixed(0)).toLocaleString()}
              </span>
              <Bar
                // height={6}
                max={10000}
                values={[total_distance ?? 0]}
                color={zones.td(total_distance ?? 0)}
              />
              <span className="">
                {Number(power_distance?.toFixed(0)).toLocaleString()}
              </span>
              <Bar
                // height={8}
                values={[power_distance]}
                max={1200}
                color={zones.pd(power_distance)}
              />
              <span className="">
                {Number(speedzone_distance?.toFixed(0)).toLocaleString()}
              </span>
              <Bar
                // height={8}
                values={[speedzone_distance]}
                max={500}
                color={zones.sd(speedzone_distance)}
              />
            </div>
          </Link>
        );
      })}
    </div>
  );
}
