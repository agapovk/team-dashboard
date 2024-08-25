import React from 'react'
import prisma from '@repo/db'

import ParticipationTable from './components/ParticipationTable'

export default async function page() {
  const players = await prisma.athlete.findMany({
    where: {
      isInTeam: true,
    },
    orderBy: {
      name: 'asc',
    },
    include: {
      injury: true,
      // athlete_games_fitness: {
      //   include: {
      //     game: true,
      //   },
      // },
      // athlete_games_ttd: {
      //   include: {
      //     game: true,
      //   },
      // },
      athlete_sessions: {
        include: {
          session: true,
        },
      },
    },
  })

  return (
    <div className="h-full flex-1 flex-col space-y-8 p-8 md:flex">
      <ParticipationTable players={players} />
    </div>
  )
}