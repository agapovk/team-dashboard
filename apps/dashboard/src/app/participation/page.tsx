import React from 'react'
import { Metadata } from 'next'
import prisma from '@repo/db'
import { slugFromDate } from '@utils'
import { endOfMonth, startOfMonth } from 'date-fns'

import ParticipationTable from './components/ParticipationTable'

export const metadata: Metadata = {
  title: 'Participation',
  description: 'Example dashboard app using the components.',
}

export const revalidate = 0

export default async function page() {
  const currentDate = startOfMonth(new Date())
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
    <div className="h-full flex-1 flex-col space-y-4 p-8 md:flex">
      <ParticipationTable
        date={slugFromDate(currentDate)}
        players={players}
        games={games}
      />
    </div>
  )
}
