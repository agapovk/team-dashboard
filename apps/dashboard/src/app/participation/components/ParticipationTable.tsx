'use client'

import React from 'react'
import Link from 'next/link'
import { AthleteSessionWithTeamSession } from '@components/PlayerCalendar/PlayerCalendar'
import { UTCDate } from '@date-fns/utc'
import { athlete, game, injury } from '@repo/db'
import { dateFromSlug, daysArray } from '@utils'
import { isSameDay, isWithinInterval } from 'date-fns'

import InjuryInfo from './InjuryInfo'
import Marker from './Marker'
import SelectMonth from './SelectMonth'
import { cn } from '@repo/ui/lib/utils'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@repo/ui'

type AthleteWithAthSesAndTeamSes = athlete & {
  athlete_sessions: AthleteSessionWithTeamSession[]
  injury: injury[]
}

type Props = {
  players: AthleteWithAthSesAndTeamSes[]
  games: game[]
  date: string
}

export const revalidate = 0

export default function ParticipationTable({ players, games, date }: Props) {
  const currentDate = dateFromSlug(date)

  const fieldPlayers = players.filter(
    (player) => player.position_id !== 'ea846ca7-40dd-40b5-97fa-b2155ff4c50c'
  )
  const goalkeepers = players.filter(
    (player) => player.position_id === 'ea846ca7-40dd-40b5-97fa-b2155ff4c50c'
  )

  return (
    <>
      <div className="flex flex-col justify-start space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            Дневник посещения
          </h2>
          <p className="text-muted-foreground">
            Анализ участия игроков в УТЗ и матчах
          </p>
        </div>
        <SelectMonth currentDate={currentDate} />
      </div>
      <Table className="border-collapse text-xs">
        <TableHeader>
          <TableRow>
            <TableHead className="h-10 w-[100px] p-2">Игрок</TableHead>
            {daysArray(currentDate).map((day) => {
              const date = new UTCDate(
                currentDate.getFullYear(),
                currentDate.getMonth(),
                day
              )
              const currentDayGame = games.find(
                (game) => game.date && isSameDay(new UTCDate(game.date), date)
              )
              return (
                <TableHead
                  key={day}
                  className={cn(
                    'h-10 p-2 text-center',
                    currentDayGame && 'border-x border-t bg-yellow-200',
                    isSameDay(new UTCDate(), date) &&
                      'border-muted-foreground bg-muted border'
                  )}
                >
                  {currentDayGame ? (
                    <TooltipProvider delayDuration={100}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <span className="w-full cursor-pointer text-center font-bold">
                            {date.getDate()}
                          </span>
                        </TooltipTrigger>
                        <TooltipContent>
                          <div className="text-xs">{currentDayGame.vs}</div>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  ) : (
                    <span>{date.getDate()}</span>
                  )}
                </TableHead>
              )
            })}
          </TableRow>
        </TableHeader>
        <TableBody className="border-b">
          {fieldPlayers.map((player) => (
            <TableRow key={player.id}>
              <TableCell className="border-x p-2 font-medium">
                <Link href={`/players/${player.id}`} className="underline">
                  {player.last_name}
                </Link>
              </TableCell>
              {daysArray(currentDate).map((day) => {
                const date = new UTCDate(
                  currentDate.getFullYear(),
                  currentDate.getMonth(),
                  day
                )
                const currentDayAthleteSession = player.athlete_sessions.filter(
                  (athses) =>
                    isSameDay(
                      new UTCDate(athses.session.start_timestamp),
                      date
                    ) &&
                    (athses.session.category_name?.includes('ТРЕНИРОВКА') ||
                      athses.session.category_name?.includes('МАТЧ') ||
                      athses.session.category_name?.includes('БЕЗ ДАТЧИКОВ'))
                )
                const currentDayInjury = player.injury?.find((inj) =>
                  isWithinInterval(date, {
                    start: new UTCDate(inj.start_date),
                    end: inj.end_date
                      ? new UTCDate(inj.end_date)
                      : new UTCDate(),
                  })
                )
                const currentDayGame = games.find(
                  (game) => game.date && isSameDay(new UTCDate(game.date), date)
                )

                return (
                  <TableCell
                    key={day}
                    className={cn(
                      'border-r p-2',
                      currentDayGame && 'bg-yellow-100',
                      currentDayInjury && 'bg-red-200'
                    )}
                  >
                    <div className="flex items-center justify-center gap-1">
                      <Marker data={currentDayAthleteSession} />
                      <InjuryInfo
                        currentDayInjury={currentDayInjury}
                        day={date}
                      />
                    </div>
                  </TableCell>
                )
              })}
            </TableRow>
          ))}
          {goalkeepers.map((player) => (
            <TableRow key={player.id}>
              <TableCell className={cn('border-x p-2 font-medium')}>
                <Link href={`/players/${player.id}`} className="underline">
                  {player.last_name}
                </Link>
              </TableCell>
              {daysArray(currentDate).map((day) => {
                const date = new UTCDate(
                  currentDate.getFullYear(),
                  currentDate.getMonth(),
                  day
                )
                const currentDayAthleteSession = player.athlete_sessions.filter(
                  (athses) =>
                    isSameDay(
                      new UTCDate(athses.session.start_timestamp),
                      date
                    ) &&
                    (athses.session.category_name?.includes('ТРЕНИРОВКА') ||
                      athses.session.category_name?.includes('МАТЧ') ||
                      athses.session.category_name?.includes('БЕЗ ДАТЧИКОВ'))
                )
                const currentDayInjury = player.injury?.find((inj) =>
                  isWithinInterval(date, {
                    start: new UTCDate(inj.start_date),
                    end: inj.end_date
                      ? new UTCDate(inj.end_date)
                      : new UTCDate(),
                  })
                )
                const currentDayGame = games.find(
                  (game) => game.date && isSameDay(new UTCDate(game.date), date)
                )

                return (
                  <TableCell
                    key={day}
                    className={cn(
                      'border-r p-2',
                      currentDayGame && 'bg-yellow-100',
                      currentDayInjury && 'bg-red-200'
                    )}
                  >
                    <div className="flex items-center justify-center gap-1">
                      <Marker data={currentDayAthleteSession} />
                      <InjuryInfo
                        currentDayInjury={currentDayInjury}
                        day={date}
                      />
                    </div>
                  </TableCell>
                )
              })}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  )
}
