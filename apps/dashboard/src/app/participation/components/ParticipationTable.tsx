'use client'

import React from 'react'
import Link from 'next/link'
import { AthleteSessionWithTeamSession } from '@components/PlayerCalendar/PlayerCalendar'
import { athlete } from '@repo/db'
import { getDaysInMonth, isSameDay } from 'date-fns'

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

function createArrayFromOneToX(X: number): number[] {
  return Array.from({ length: X }, (_, index) => index + 1)
}

function daysArray(date: Date): number[] {
  return createArrayFromOneToX(getDaysInMonth(date))
}

type AthleteWithAthSesAndTeamSes = athlete & {
  athlete_sessions: AthleteSessionWithTeamSession[]
}

type Props = {
  players: AthleteWithAthSesAndTeamSes[]
}

export default function ParticipationTable({ players }: Props) {
  const [currentMonth, setCurrentMonth] = React.useState(new Date())

  return (
    <>
      <SelectMonth currentMonth={currentMonth} setMonth={setCurrentMonth} />
      <div className="col-span-2">
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
                    currentMonth.getFullYear(),
                    currentMonth.getMonth(),
                    day
                  )
                  const currentAthleteSession = player.athlete_sessions.filter(
                    (athses) =>
                      isSameDay(
                        new Date(athses.session.start_timestamp),
                        date
                      ) &&
                      (athses.session.category_name?.includes('ТРЕНИРОВКА') ||
                        athses.session.category_name?.includes('МАТЧ'))
                  )

                  return (
                    <TableCell key={day} className="border-r p-2">
                      <div className="flex w-full justify-center">
                        {currentAthleteSession.length !== 0 &&
                          currentAthleteSession.map((athses) => (
                            <span
                              key={athses.id}
                              className={`${cn(
                                'flex h-3 w-3 rounded-full',
                                athses.session.category_name?.includes(
                                  'ИНДИВИДУАЛЬНАЯ'
                                ) && 'bg-sky-400',
                                athses.session.category_name?.includes(
                                  'МАТЧ'
                                ) && 'bg-yellow-400',
                                athses.session.category_name === 'ТРЕНИРОВКА' &&
                                  'bg-green-400'
                              )}`}
                            />
                          ))}
                      </div>
                    </TableCell>
                  )
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  )
}
