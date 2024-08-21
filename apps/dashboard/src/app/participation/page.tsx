import React from 'react'
import ParticipationTable from './components/ParticipationTable'
import prisma from '@repo/db'

export default async function page() {
  const players = await prisma.athlete.findMany({
    where: {
      isInTeam: true,
    },
    orderBy: {
      name: 'asc',
    },
    include: {
      // athlete_games_fitness: {
      //   include: {
      //     game: true,
      //   },
      //   orderBy: {
      //     game: {
      //       date: 'desc',
      //     },
      //   },
      // },
      // athlete_games_ttd: {
      //   include: {
      //     game: true,
      //   },
      //   orderBy: {
      //     game: {
      //       date: 'desc',
      //     },
      //   },
      // },
      athlete_sessions: {
        include: {
          session: true,
        },
        orderBy: {
          session: {
            start_timestamp: 'desc',
          },
        },
      },
    },
  })

  return (
    <div className="h-full flex-1 flex-col space-y-8 p-8 md:flex">
      <div className="grid grid-cols-2 items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            Дневник посещения
          </h2>
          <p className="text-muted-foreground">
            Анализ участия игроков в УТЗ и матчах
          </p>
        </div>
        <ParticipationTable players={players} />
      </div>
    </div>
  )
}
