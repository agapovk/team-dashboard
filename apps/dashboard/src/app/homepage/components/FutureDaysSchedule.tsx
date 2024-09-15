'use client'

import React from 'react'
import { game } from '@repo/db'
import { createDateArrayFromXToY } from '~/src/utils'
import { addDays, endOfWeek, format, startOfWeek } from 'date-fns'
import { ru } from 'date-fns/locale'

import GameCard from './GameCard'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@repo/ui'

type Props = {
  games: game[]
}

export function FutureDaysSchedule({ games }: Props) {
  const currentDate = new Date()

  const showDays: Date[] = createDateArrayFromXToY(
    startOfWeek(addDays(currentDate, 7), { locale: ru }),
    endOfWeek(addDays(currentDate, 14), { locale: ru })
  )

  const days = ['пн', 'вт', 'ср', 'чт', 'пт', 'сб', 'вс']

  return (
    <Table>
      <TableHeader>
        <TableRow className="grid grid-cols-7 hover:bg-inherit">
          {days.map((d, i) => (
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
        <TableRow className="grid grid-cols-7 divide-x hover:bg-inherit">
          {showDays.slice(0, 7).map((day) => (
            <TableCell
              key={day.getTime()}
              className="flex flex-col gap-1 p-1 md:p-3"
            >
              <span className="text-center text-xs font-semibold">
                {format(day, 'dd.MM', { locale: ru })}
              </span>
              <GameCard day={day} games={games} />
            </TableCell>
          ))}
        </TableRow>
        <TableRow className="grid grid-cols-7 divide-x hover:bg-inherit">
          {showDays.slice(7, 14).map((day) => (
            <TableCell
              key={day.getTime()}
              className="flex flex-col gap-1 p-1 md:p-3"
            >
              <span className="text-center text-xs font-semibold">
                {format(day, 'dd.MM', { locale: ru })}
              </span>
              <GameCard day={day} games={games} />
            </TableCell>
          ))}
        </TableRow>
      </TableBody>
    </Table>
  )
}