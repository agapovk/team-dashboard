import { Metadata } from 'next'
import { Schedule } from '@components/Calendar/Schedule'
import prisma from '@repo/db'
import { endOfMonth, getUnixTime, startOfMonth } from 'date-fns'

import SelectMonth from './components/SelectMonth'

export const metadata: Metadata = {
  title: 'Calendar',
  description: 'Example dashboard app using the components.',
}

export default async function CalendarPage() {
  const currentMonth = new Date().getMonth()
  const currentYear = new Date().getFullYear()
  const currnetUnixDate = getUnixTime(
    new Date(Number(currentYear), Number(currentMonth), 1)
  )

  const sessions = await prisma.session.findMany({
    where: {
      start_timestamp: {
        gte: startOfMonth(new Date()),
        lte: endOfMonth(new Date()),
      },
    },
    include: {
      athlete_sessions: {
        include: {
          athlete: {
            select: {
              last_name: true,
            },
          },
        },
      },
    },
  })

  const players = await prisma.athlete.findMany({
    where: {
      isInTeam: true,
    },
    orderBy: {
      name: 'asc',
    },
  })

  const games = await prisma.game.findMany({
    where: {
      date: {
        gte: startOfMonth(new Date()),
        lte: endOfMonth(new Date()),
      },
    },
  })

  return (
    <div className="h-full flex-1 flex-col space-y-2 p-8 md:flex">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            Календарь команды
          </h2>
          <p className="text-muted-foreground">Отслеживание графика команды</p>
        </div>
        <SelectMonth currentDate={new Date()} />
      </div>
      <Schedule
        unixDate={currnetUnixDate.toString()}
        sessions={sessions}
        games={games}
        players={players}
      />
    </div>
  )
}
