'use client'

import React from 'react'
import Link from 'next/link'
import { UTCDate } from '@date-fns/utc'
import { game } from '@repo/db'

import { cn } from '@repo/ui/lib/utils'

type Props = {
  day: Date
  games: game[]
}

export default function GameCard({ day, games }: Props) {
  const currentDayGames = games?.filter(
    (game) =>
      game.date &&
      new UTCDate(game.date).toLocaleDateString() === day.toLocaleDateString()
  )

  if (currentDayGames.length === 0) return null

  return (
    <div className="flex flex-col gap-2">
      {currentDayGames.map((game) => (
        <Link
          key={game.id}
          href={`/games/${game.id}`}
          className={cn(
            'text-accent-foreground border-muted-foreground hover:bg-accent mx-1 flex flex-col items-start overflow-auto truncate rounded-lg border px-2 py-1 text-xs transition-all md:py-2'
          )}
        >
          <div className="flex w-full flex-col items-center justify-between gap-1 md:gap-2">
            <span className="hidden md:flex">
              {game.date?.toLocaleTimeString('ru-RU', {
                hour: '2-digit',
                minute: '2-digit',
                timeZone: 'gmt',
              })}
            </span>
            <span className="text-muted-foreground">
              {game.home ? 'Дома' : 'Выезд'}
            </span>
            <div className="flex w-full items-center justify-center gap-2">
              <span className="font-semibold">{game.vs}</span>
              {game.result && (
                <span className="hidden font-semibold md:flex">
                  {game.result}
                </span>
              )}
            </div>
          </div>
        </Link>
      ))}
    </div>
  )
}
