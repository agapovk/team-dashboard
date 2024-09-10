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

export default function Constructor({ players }: Props) {
  const [squad, setSquad] = React.useState(players.filter((p) => !p.isInjured))
  const [recovery, setRecovery] = React.useState<athlete[]>([])
  const [individual, setIndividual] = React.useState<athlete[]>([])
  const [injured, setInjured] = React.useState(
    players.filter((p) => p.isInjured)
  )

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
              setSquad((old) =>
                old.findIndex((p) => p.id === player.id)
                  ? [...old, player]
                  : old.filter((p) => p.id === player.id)
              )
            }
          >
            Тренировка
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() =>
              setRecovery((old) =>
                old.findIndex((p) => p.id === player.id)
                  ? [...old, player]
                  : old.filter((p) => p.id === player.id)
              )
            }
          >
            Восстановление
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() =>
              setIndividual((old) =>
                old.findIndex((p) => p.id === player.id)
                  ? [...old, player]
                  : old.filter((p) => p.id === player.id)
              )
            }
          >
            Индивидуально
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() =>
              setInjured((old) =>
                old.findIndex((p) => p.id === player.id)
                  ? [...old, player]
                  : old.filter((p) => p.id === player.id)
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
          <CardDescription>{squad.length}</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap items-start gap-2">
          {squad.map((player) => (
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
            {recovery.map((player) => (
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
            {individual.map((player) => (
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
            {injured.map((player) => (
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
