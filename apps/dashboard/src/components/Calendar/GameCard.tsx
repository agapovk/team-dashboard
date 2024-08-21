'use client'

import Link from 'next/link'
import React from 'react'
import { cn } from '@repo/ui/lib/utils'
import { game } from '@repo/db'
import { PlaneIcon } from 'lucide-react'

type Props = {
  day: Date
  games: game[]
}

export default function GameCard({ day, games }: Props) {
  const currentDayGames = games?.filter(
    (game) => game.date?.toLocaleDateString() === day.toLocaleDateString()
  )

  if (currentDayGames.length === 0) return null

  return (
    <div className="flex flex-col gap-2">
      {currentDayGames.map((game) => (
        <Link
          key={game.id}
          href={`/games/${game.id}`}
          className={cn(
            'text-accent-foreground mx-1 flex flex-col items-start gap-1 overflow-auto truncate rounded-lg bg-red-300 px-2 py-1 text-xs transition-all hover:bg-opacity-80 dark:bg-red-800'
          )}
        >
          <div className="flex w-full items-center justify-between">
            {game.date?.toLocaleTimeString('ru-RU', {
              hour: '2-digit',
              minute: '2-digit',
              timeZone: 'gmt',
            })}
            <div className="font-semibold">
              {game.vs} {game.result}
            </div>
            <span>{game.home ? 'EKB' : <PlaneIcon className="h-4 w-4" />}</span>
          </div>
          <div className="flex flex-col items-end">
            <span>
              {game.total_distance &&
                Number(game.total_distance?.toFixed(0)).toLocaleString()}
            </span>
            <span>
              {game.speedzone4_distance &&
                Number(game.speedzone4_distance?.toFixed(0)).toLocaleString()}
            </span>
            <span>
              {game.speedzone5_distance &&
                Number(game.speedzone5_distance?.toFixed(0)).toLocaleString()}
            </span>
          </div>
        </Link>
      ))}
    </div>
  )
}
