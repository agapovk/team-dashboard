'use client'

import React from 'react'
import Link from 'next/link'
import { AthleteSessionWithTeamSession } from '@components/PlayerCalendar/PlayerCalendar'
import { athlete, injury } from '@repo/db'
import { daysArray } from '@utils'
import { isSameDay, isWithinInterval } from 'date-fns'

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
} from '@repo/ui'

type AthleteWithAthSesAndTeamSes = athlete & {
  athlete_sessions: AthleteSessionWithTeamSession[]
  injury: injury[]
}

type Props = {
  players: AthleteWithAthSesAndTeamSes[]
}

export default function ParticipationTable({ players }: Props) {
  const [currentMonth, setCurrentMonth] = React.useState(new Date())

  return (
    <>
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            Дневник посещения
          </h2>
          <p className="text-muted-foreground">
            Анализ участия игроков в УТЗ и матчах
          </p>
        </div>
        <SelectMonth currentMonth={currentMonth} setMonth={setCurrentMonth} />
      </div>

      <Table className="text-xs">
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px] p-2">Игрок</TableHead>
            {daysArray(currentMonth).map((day) => (
              <TableHead key={day} className="p-2 text-center">
                {day}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody className="border-b">
          {players.map((player) => (
            <TableRow key={player.id}>
              <TableCell className="border-x p-2 font-medium">
                <Link href={`/players/${player.id}`} className="underline">
                  {player.last_name}
                </Link>
              </TableCell>
              {daysArray(currentMonth).map((day) => {
                const date = new Date(
                  Date.UTC(
                    currentMonth.getFullYear(),
                    currentMonth.getMonth(),
                    day
                  )
                )
                const currentAthleteSession = player.athlete_sessions.filter(
                  (athses) =>
                    isSameDay(new Date(athses.session.start_timestamp), date) &&
                    (athses.session.category_name?.includes('ТРЕНИРОВКА') ||
                      athses.session.category_name?.includes('МАТЧ'))
                )
                const currentDayInjury = player.injury?.find((inj) =>
                  isWithinInterval(date, {
                    start: inj.start_date,
                    end: inj.end_date ? inj.end_date : new Date(),
                  })
                )
                return (
                  <TableCell
                    key={day}
                    className={cn(
                      'border-r p-2',
                      currentDayInjury && 'bg-red-300'
                    )}
                  >
                    <Marker data={currentAthleteSession} />
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
