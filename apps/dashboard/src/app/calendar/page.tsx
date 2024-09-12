import { Metadata } from 'next'
import { Schedule } from '@components/Calendar/Schedule'
import prisma from '@repo/db'
import { slugFromDate } from '@utils'
import { addDays, endOfMonth, startOfMonth, subDays } from 'date-fns'

import SelectMonth from './components/SelectMonth'

export const metadata: Metadata = {
  title: 'Calendar',
  description: 'Example dashboard app using the components.',
}

export const revalidate = 0

export default async function CalendarPage() {
  const currentDate = startOfMonth(new Date())
  const sessions = await prisma.session.findMany({
    where: {
      start_timestamp: {
        gte: subDays(startOfMonth(currentDate), 6),
        lte: addDays(endOfMonth(currentDate), 6),
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
      OR: [{ position: { title: { not: 'Вратарь' } } }, { position_id: null }],
    },
    orderBy: {
      name: 'asc',
    },
  })

  const games = await prisma.game.findMany({
    where: {
      date: {
        gte: subDays(startOfMonth(currentDate), 6),
        lte: addDays(endOfMonth(currentDate), 6),
      },
    },
  })

  return (
    <div className="h-full flex-1 flex-col space-y-2 p-8 md:flex">
      <div className="flex flex-col justify-start space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            Календарь команды
          </h2>
          <p className="text-muted-foreground">Отслеживание графика команды</p>
        </div>
        <SelectMonth currentDate={new Date()} />
      </div>
      <Schedule
        date={slugFromDate(currentDate)}
        sessions={sessions}
        games={games}
        players={players}
      />
    </div>
  )
}
