'use client'

import React from 'react'
import { athlete } from '@repo/db'

import { AthleteSelect } from './session-form'
import { cn } from '@repo/ui/lib/utils'
import { Badge, Card, CardContent } from '@repo/ui'

type Props = {
  players: athlete[]
  selected: AthleteSelect[]
  setSelected: React.Dispatch<React.SetStateAction<AthleteSelect[]>>
}

export default function SelectPlayers({
  players,
  selected,
  setSelected,
}: Props) {
  function badgeVariant(id: string) {
    return selected.find((p) => p.athlete_id === id) ? 'outline' : 'default'
  }

  function badgeStyle(id: string) {
    return selected.find((p) => p.athlete_id === id)
      ? ''
      : 'line-through decoration-2'
  }

  function clickHandler(player: athlete) {
    setSelected((prev) => {
      return prev.find((p) => p.athlete_id === player.id)
        ? prev.filter((p) => p.athlete_id !== player.id)
        : [
            ...prev,
            {
              athlete_id: player.id,
            },
          ]
    })
  }
  return (
    <Card className="w-full">
      <CardContent className="p-4">
        <div className="flex flex-wrap gap-2">
          {players.map((player) => (
            <Badge
              variant={badgeVariant(player.id)}
              key={player.id}
              className={cn(
                'cursor-pointer text-sm font-medium',
                badgeStyle(player.id)
              )}
              onClick={() => clickHandler(player)}
            >
              {player.last_name}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
