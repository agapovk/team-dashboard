import { Metadata } from 'next'
import { Schedule } from '@components/Calendar/Schedule'
import prisma from '@repo/db'
import { endOfMonth, fromUnixTime, startOfMonth } from 'date-fns'

import SelectMonth from '../components/SelectMonth'

export const metadata: Metadata = {
  title: 'Calendar',
  description: 'Example dashboard app using the components.',
}

type Props = {
  params: {
    date: string
  }
}

export default async function CalendarPage({ params: { date } }: Props) {
  const currentDate = fromUnixTime(Number(date))

  const sessions = await prisma.session.findMany({
    where: {
      start_timestamp: {
        gte: startOfMonth(currentDate),
        lte: endOfMonth(currentDate),
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
        gte: startOfMonth(currentDate),
        lte: endOfMonth(currentDate),
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
        <SelectMonth currentDate={currentDate} />
      </div>
      <Schedule
        unixDate={date}
        sessions={sessions}
        games={games}
        players={players}
      />
    </div>
  )
}
