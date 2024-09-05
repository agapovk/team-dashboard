import React from 'react'
import prisma from '@repo/db'
import { endOfMonth, getUnixTime, startOfMonth } from 'date-fns'

import ParticipationTable from './components/ParticipationTable'

export default async function page() {
  const currentMonth = new Date().getMonth()
  const currentYear = new Date().getFullYear()
  const currnetUnixDate = getUnixTime(
    new Date(Number(currentYear), Number(currentMonth), 1)
  )

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
            gte: startOfMonth(new Date()),
            lte: endOfMonth(new Date()),
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
      <ParticipationTable
        date={currnetUnixDate.toString()}
        players={players}
        games={games}
      />
    </div>
  )
}
