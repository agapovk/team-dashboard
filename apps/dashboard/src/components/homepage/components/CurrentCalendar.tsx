'use client'

import React from 'react'
import { game, session } from '@repo/db'
import { createDateArrayFromXToY } from '~/src/utils'
import {
  addDays,
  endOfWeek,
  format,
  isSameDay,
  startOfWeek,
  subDays,
} from 'date-fns'
import { ru } from 'date-fns/locale'

import GameCard from './GameCard'
import SessionCard from './SessionCard'
import { cn } from '@repo/ui/lib/utils'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@repo/ui'

type Props = {
  sessions: session[]
  games: game[]
}

export function CurrentCalendar({ sessions, games }: Props) {
  const currentDate = new Date()

  function createWeekArray(date: Date): Date[] {
    return createDateArrayFromXToY(
      startOfWeek(date, { locale: ru }),
      endOfWeek(date, { locale: ru })
    )
  }

  const daysToShow = {
    beforeLast: createWeekArray(subDays(currentDate, 14)),
    last: createWeekArray(subDays(currentDate, 7)),
    current: createWeekArray(currentDate),
    next: createWeekArray(addDays(currentDate, 7)),
    afterNext: createWeekArray(addDays(currentDate, 14)),
  }

  const weekDays = ['пн', 'вт', 'ср', 'чт', 'пт', 'сб', 'вс']

  return (
    <Table>
      <TableHeader>
        <TableRow className="grid grid-cols-7 hover:bg-inherit">
          {weekDays.map((d, i) => (
            <TableHead
              key={i}
              className="text-muted-foreground flex h-7 justify-center"
            >
              {d}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody className="border-x border-b">
        {Object.entries(daysToShow).map(([week, dates]) => (
          <TableRow
            key={week}
            className="grid grid-cols-7 divide-x hover:bg-inherit"
          >
            {dates.map((day) => (
              <TableCell
                key={day.getTime()}
                className={cn(
                  'flex aspect-square flex-col gap-1 p-1 md:p-3',
                  isSameDay(day, Date.now()) && 'bg-yellow-100'
                )}
              >
                <span className="text-center text-xs font-semibold">
                  {format(day, 'dd.MM', { locale: ru })}
                </span>
                <SessionCard day={day} sessions={sessions} />
                <GameCard day={day} games={games} />
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
