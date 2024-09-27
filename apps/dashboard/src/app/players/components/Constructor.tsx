'use client'

import React from 'react'
import Image from 'next/image'
import { athlete, injury } from '@repo/db'
import { dayTitle } from '~/src/utils'
import { addDays, differenceInDays, format, isWithinInterval } from 'date-fns'
import { ru } from 'date-fns/locale'
import { useReactToPrint } from 'react-to-print'

import { cn } from '@repo/ui/lib/utils'
import {
  Badge,
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
  players: (athlete & { injury: injury[] })[]
}
type PlayerGroup = 'training' | 'recovery' | 'individual' | 'injured'

type PlayerButtonProps = {
  player: athlete
  variant: 'default' | 'secondary' | 'destructive' | 'outline'
}

type PlayersWithGroup = {
  player: athlete & { injury: injury[] }
  group: PlayerGroup
}

export default function Constructor({ players }: Props) {
  const initialGroups: PlayersWithGroup[] = players
    .filter(
      // Filter without Goalkeepres
      (player) => player.position_id !== 'ea846ca7-40dd-40b5-97fa-b2155ff4c50c'
    )
    .map((player) => {
      return {
        player,
        group: player.isInjured ? 'injured' : 'training',
      }
    })

  const [playerGroups, setPlayerGroups] =
    React.useState<PlayersWithGroup[]>(initialGroups)

  const training = playerGroups.filter((p) => p.group === 'training')
  const recovery = playerGroups.filter((p) => p.group === 'recovery')
  const individual = playerGroups.filter((p) => p.group === 'individual')
  const injured = playerGroups.filter((p) => p.group === 'injured')

  // Check saved local data
  React.useEffect(() => {
    const savedGroups = localStorage.getItem('playerGroups')
    if (savedGroups) {
      setPlayerGroups(JSON.parse(savedGroups))
    }
  }, [])

  const printRef = React.useRef<HTMLDivElement>(null)
  const handlePrint = useReactToPrint({
    pageStyle: `@media print {
				@page {
					size: 297mm 210mm;
					margin: 0;
					}
					}`,
    content: () => printRef.current,
  })

  const handleClear = () => {
    setPlayerGroups(initialGroups)
    localStorage.removeItem('playerGroups')
  }

  function PlayerButton({ player, variant }: PlayerButtonProps) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant={variant || 'primary'}
            className={cn(
              'flex h-fit cursor-pointer gap-2 px-2 text-xs md:px-4 md:text-sm'
            )}
          >
            <span>{player.number}</span>
            <span className="">{player.last_name}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem
            onClick={() => {
              setPlayerGroups((old) => {
                const newGroup: PlayersWithGroup[] = old.map((p) => {
                  if (p.player.id === player.id && p.group !== 'training')
                    return { player: p.player, group: 'training' }
                  else return p
                })
                localStorage.setItem('playerGroups', JSON.stringify(newGroup))
                return newGroup
              })
            }}
          >
            Тренировка
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              setPlayerGroups((old) => {
                const newGroup: PlayersWithGroup[] = old.map((p) => {
                  if (p.player.id === player.id && p.group !== 'recovery')
                    return { player: p.player, group: 'recovery' }
                  else return p
                })
                localStorage.setItem('playerGroups', JSON.stringify(newGroup))
                return newGroup
              })
            }}
          >
            Восстановление
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              setPlayerGroups((old) => {
                const newGroup: PlayersWithGroup[] = old.map((p) => {
                  if (p.player.id === player.id && p.group !== 'individual')
                    return { player: p.player, group: 'individual' }
                  else return p
                })
                localStorage.setItem('playerGroups', JSON.stringify(newGroup))
                return newGroup
              })
            }}
          >
            Индивидуально
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              setPlayerGroups((old) => {
                const newGroup: PlayersWithGroup[] = old.map((p) => {
                  if (p.player.id === player.id && p.group !== 'injured')
                    return { player: p.player, group: 'injured' }
                  else return p
                })
                localStorage.setItem('playerGroups', JSON.stringify(newGroup))
                return newGroup
              })
            }}
          >
            Травмирован
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

  function lastInjuryInfo(injuries: injury[]) {
    const lastInjury = injuries.find((injury) =>
      injury.end_date
        ? isWithinInterval(Date.now(), {
            start: injury.end_date,
            end: addDays(injury.end_date, 10),
          })
        : false
    )

    let daysFromLastInjury = 0
    if (lastInjury?.end_date) {
      daysFromLastInjury = differenceInDays(Date.now(), lastInjury.end_date)
    }

    return daysFromLastInjury ? (
      <Badge variant="outline" className="text-muted-foreground font-light">
        {`${daysFromLastInjury} ${dayTitle(daysFromLastInjury)} после травмы`}
      </Badge>
    ) : null
  }

  return (
    <>
      <div>
        <div className="flex flex-col gap-4">
          <div>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between py-4">
                <div>
                  <CardTitle className="text-md text-foreground font-semibold">
                    {format(Date.now(), 'dd MMMM yyyy', { locale: ru })}
                  </CardTitle>
                  <CardDescription>Список игроков к тренировке</CardDescription>
                </div>
                <div className="flex gap-4">
                  <Button variant="outline" onClick={handleClear}>
                    Сбросить
                  </Button>
                  <Button variant="default" onClick={handlePrint}>
                    Печать
                  </Button>
                </div>
              </CardHeader>
            </Card>
          </div>
          <div className="flex flex-col gap-4 md:flex-row">
            <Card className="flex flex-1 flex-col space-y-2">
              <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-4">
                <CardTitle className="text-md text-foreground font-semibold">
                  Тренируются
                </CardTitle>
                <CardDescription>{training.length}</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-wrap items-start gap-2">
                {training.map(({ player }) => (
                  <PlayerButton
                    player={player}
                    variant="outline"
                    key={player.id}
                  />
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
                    <PlayerButton
                      player={player}
                      variant="default"
                      key={player.id}
                    />
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
        </div>
      </div>
      <div className="hidden">
        <div ref={printRef} className="flex w-full flex-col gap-2 p-8">
          <Card className="aspect-[290/200] divide-y overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between py-4">
              <div>
                <CardTitle className="text-foreground text-lg font-semibold">
                  {format(Date.now(), 'dd MMMM yyyy', { locale: ru })}
                </CardTitle>
                <CardDescription>Список игроков к тренировке</CardDescription>
              </div>
              <Image src="/bw-ural.png" alt="FC Ural" width={48} height={48} />
            </CardHeader>
            <CardContent className="h-full p-0">
              <div className="flex h-full divide-x">
                <div className="flex w-fit flex-col">
                  <div className="flex flex-col items-start gap-2 px-6 py-4">
                    {training.length > 0 && (
                      <div className="w-full space-y-2">
                        <div className="flex w-full items-center justify-between">
                          <h3 className="text-foreground text-lg font-semibold">
                            Тренируются
                          </h3>
                          <span>{training.length}</span>
                        </div>
                        <ul className="space-y-1 text-xl">
                          {training.map(({ player }) => (
                            <li
                              key={player.id}
                              className="flex items-center gap-4"
                            >
                              <span className="text-muted-foreground w-6">
                                {player.number}
                              </span>
                              {player.last_name}
                              {lastInjuryInfo(player.injury)}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {recovery.length > 0 && (
                      <div className="w-full space-y-2">
                        <div className="flex w-full items-center justify-between">
                          <h3 className="text-foreground text-lg font-semibold">
                            Восстановление
                          </h3>
                          <span>{recovery.length}</span>
                        </div>
                        <ul className="space-y-1 text-xl">
                          {recovery.map(({ player }) => (
                            <li
                              key={player.id}
                              className="flex items-center gap-4"
                            >
                              <span className="text-muted-foreground w-6">
                                {player.number}
                              </span>
                              {player.last_name}
                              {lastInjuryInfo(player.injury)}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {individual.length > 0 && (
                      <div className="w-full space-y-2">
                        <div className="flex w-full items-center justify-between">
                          <h3 className="text-foreground text-lg font-semibold">
                            Индивидуально
                          </h3>
                          <span>{individual.length}</span>
                        </div>
                        <ul className="space-y-1 text-xl">
                          {individual.map(({ player }) => (
                            <li
                              key={player.id}
                              className="flex items-center gap-4"
                            >
                              <span className="text-muted-foreground w-6">
                                {player.number}
                              </span>
                              {player.last_name}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {injured.length > 0 && (
                      <div className="w-full space-y-2">
                        <div className="flex w-full items-center justify-between">
                          <h3 className="text-foreground text-lg font-semibold">
                            Травмирован
                          </h3>
                          <span>{injured.length}</span>
                        </div>
                        <ul className="space-y-1 text-xl">
                          {injured.map(({ player }) => (
                            <li
                              key={player.id}
                              className="flex items-center gap-4"
                            >
                              <span className="text-muted-foreground w-6">
                                {player.number}
                              </span>
                              {player.last_name}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex h-full flex-1 items-start justify-end p-4">
                  <Image
                    src="/field.svg"
                    alt="Field"
                    width={100}
                    height={200}
                    className="w-1/2"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  )
}
