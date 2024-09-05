import React from 'react'
import prisma from '@repo/db'
import { dateFromSlug, getMonthsArray } from '@utils'
import { endOfMonth, startOfMonth } from 'date-fns'

import ParticipationTable from '../components/ParticipationTable'

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

export default async function page({ params: { date } }: Props) {
  const currentDate = dateFromSlug(date)

  const players = await prisma.athlete.findMany({
    where: {
      isInTeam: true,
    },
    orderBy: {
      name: 'asc',
    },
    include: {
      injury: true,
      athlete_sessions: {
        where: {
          start_timestamp: {
            gte: startOfMonth(new Date(currentDate)),
            lte: endOfMonth(new Date(currentDate)),
          },
        },
        include: {
          session: true,
        },
      },
    },
  })
  const games = await prisma.game.findMany()

  return (
    <div className="h-full flex-1 flex-col space-y-8 p-8 md:flex">
      <ParticipationTable date={date} players={players} games={games} />
    </div>
  )
}
