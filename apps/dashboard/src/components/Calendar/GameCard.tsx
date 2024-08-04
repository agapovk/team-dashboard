"use client";

import Link from "next/link";
import React from "react";
import { cn } from "@repo/ui/lib/utils";
import { game } from "@repo/db";

type Props = {
  day: Date;
  games: game[];
};

export default function GameCard({ day, games }: Props) {
  const currentDayGames = games?.filter(
    (game) => game.date?.toLocaleDateString() === day.toLocaleDateString(),
  );

  if (currentDayGames.length === 0) return null;

  return (
    <div className="flex flex-col gap-2">
      {currentDayGames.map((game) => (
        <Link
          key={game.id}
          href={`/games/${game.id}`}
          className={cn(
            "text-accent-foreground mx-1 flex items-start gap-1 overflow-auto truncate rounded-lg bg-orange-300 px-2 py-1 text-xs transition-all hover:bg-opacity-80 dark:bg-orange-800",
          )}
        >
          <span className="font-semibold">
            {game.date?.toLocaleTimeString("ru-RU", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
          {game.vs}
        </Link>
      ))}
    </div>
  );
}
