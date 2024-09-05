import React from 'react'
import prisma from '@repo/db'
import { endOfMonth, fromUnixTime, startOfMonth } from 'date-fns'

import ParticipationTable from '../components/ParticipationTable'

type Props = {
  params: {
    date: string
  }
}

export default async function page({ params: { date } }: Props) {
  const currentDate = fromUnixTime(Number(date))
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
