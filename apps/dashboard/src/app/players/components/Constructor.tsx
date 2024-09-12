'use client'

import React from 'react'
import { athlete } from '@repo/db'

import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@repo/ui'

type Props = {
  players: athlete[]
}

type PlayerButtonProps = {
  player: athlete
  variant: 'default' | 'secondary' | 'destructive' | 'outline'
}

type PlayersWithGroup = {
  player: athlete
  group: 'training' | 'injured' | 'individual' | 'recovery'
}

export default function Constructor({ players }: Props) {
  const playersWithGroup: PlayersWithGroup[] = players
    .filter(
      (player) => player.position_id !== 'ea846ca7-40dd-40b5-97fa-b2155ff4c50c'
    )
    .map((player) => {
      return {
        player,
        group: player.isInjured ? 'injured' : 'training',
      }
    })

  const [playerGroups, setPlayerGroups] =
    React.useState<PlayersWithGroup[]>(playersWithGroup)
  const training = playerGroups.filter((p) => p.group === 'training')
  const recovery = playerGroups.filter((p) => p.group === 'recovery')
  const individual = playerGroups.filter((p) => p.group === 'individual')
  const injured = playerGroups.filter((p) => p.group === 'injured')

  function PlayerButton({ player, variant }: PlayerButtonProps) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant={variant || 'primary'}
            className="flex h-fit cursor-pointer gap-2 text-sm"
          >
            <span>{player.number}</span>
            <span className="">{player.last_name}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem
            onClick={() =>
              setPlayerGroups((old) =>
                old.map((p) => {
                  if (p.player.id === player.id && p.group !== 'training')
                    return { player: p.player, group: 'training' }
                  else return p
                })
              )
            }
          >
            Тренировка
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() =>
              setPlayerGroups((old) =>
                old.map((p) => {
                  if (p.player.id === player.id && p.group !== 'recovery')
                    return { player: p.player, group: 'recovery' }
                  else return p
                })
              )
            }
          >
            Восстановление
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() =>
              setPlayerGroups((old) =>
                old.map((p) => {
                  if (p.player.id === player.id && p.group !== 'individual')
                    return { player: p.player, group: 'individual' }
                  else return p
                })
              )
            }
          >
            Индивидуально
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() =>
              setPlayerGroups((old) =>
                old.map((p) => {
                  if (p.player.id === player.id && p.group !== 'injured')
                    return { player: p.player, group: 'injured' }
                  else return p
                })
              )
            }
          >
            Травмирован
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

  return (
    <div className="flex gap-4">
      <Card className="flex flex-1 flex-col space-y-2">
        <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-4">
          <CardTitle className="text-md text-foreground font-semibold">
            Тренируются
          </CardTitle>
          <CardDescription>{training.length}</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap items-start gap-2">
          {training.map(({ player }) => (
            <PlayerButton player={player} variant="outline" key={player.id} />
          ))}
        </CardContent>
        <CardFooter className="flex justify-end gap-4"></CardFooter>
      </Card>
      <div className="flex flex-1 flex-col justify-between gap-4">
        <Card className="flex flex-1 flex-col justify-between space-y-2">
          <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-4">
            <CardTitle className="text-md text-foreground font-semibold">
              Восстановление
            </CardTitle>
            <CardDescription>{recovery.length}</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-1 flex-wrap gap-2">
            {recovery.map(({ player }) => (
              <PlayerButton
                player={player}
                variant="secondary"
                key={player.id}
              />
            ))}
          </CardContent>
          <CardFooter className="flex justify-end gap-4"></CardFooter>
        </Card>
        <Card className="flex flex-1 flex-col justify-between space-y-2">
          <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-4">
            <CardTitle className="text-md text-foreground font-semibold">
              Индивидуально
            </CardTitle>
            <CardDescription>{individual.length}</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-1 flex-wrap gap-2">
            {individual.map(({ player }) => (
              <PlayerButton player={player} variant="default" key={player.id} />
            ))}
          </CardContent>
          <CardFooter className="flex justify-end gap-4"></CardFooter>
        </Card>
        <Card className="flex flex-1 flex-col justify-between space-y-2">
          <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-4">
            <CardTitle className="text-md text-foreground font-semibold">
              Травмированы
            </CardTitle>
            <CardDescription>{injured.length}</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-1 flex-wrap gap-2">
            {injured.map(({ player }) => (
              <PlayerButton
                player={player}
                variant="destructive"
                key={player.id}
              />
            ))}
          </CardContent>
          <CardFooter className="flex justify-end gap-4"></CardFooter>
        </Card>
      </div>
    </div>
  )
}
