import { Schedule } from '@components/Calendar/Schedule'
import prisma from '@repo/db'
import { dateFromSlug, getMonthsArray } from '@utils'
import { addDays, endOfMonth, startOfMonth, subDays } from 'date-fns'

import SelectMonth from '../components/SelectMonth'

type Props = {
  params: {
    date: string
  }
}

export async function generateStaticParams() {
  const start = startOfMonth('2023-01-01')
  const end = endOfMonth(new Date())
  const months = getMonthsArray(start, end)

  return months.map((post) => ({
    date: post,
  }))
}

export default async function CalendarPage({ params: { date } }: Props) {
  const currentDate = dateFromSlug(date)

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
        date={date}
        sessions={sessions}
        games={games}
        players={players}
      />
    </div>
  )
}
