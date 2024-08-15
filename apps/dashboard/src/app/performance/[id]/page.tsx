import React from 'react'
import { PrismaClient } from '@repo/db'
import { DataTable } from './data-table'
import { columns } from './columns'
import { Metadata } from 'next'

const prisma = new PrismaClient()

export const metadata: Metadata = {
  title: 'Статистика тренировки',
  description: 'A task and issue tracker build using Tanstack Table.',
}

type Props = {
  params: {
    id: number
  }
}

export default async function page({ params: { id } }: Props) {
  const session = await prisma.session.findUnique({
    where: {
      id: Number(id),
    },
    include: {
      athlete_sessions: {
        include: {
          athlete: true,
        },
        orderBy: {
          athlete: {
            name: 'asc',
          },
        },
      },
    },
  })

  const athlete_sessions = session?.athlete_sessions

  if (athlete_sessions) {
    const distances = athlete_sessions.flatMap((s) => Number(s.total_distance))
    const maxD = Math.max.apply(Math, distances)
    const minD = Math.min.apply(Math, distances)

    const power = athlete_sessions.flatMap(
      (s) =>
        Number(s.athletesessionpowerzone_distance_2) +
        Number(s.athletesessionpowerzone_distance_3)
    )
    const maxP = Math.max.apply(Math, power)
    const minP = Math.min.apply(Math, power)

    const speed = athlete_sessions.flatMap(
      (s) =>
        Number(s.athletesessionspeedzone_distance_4) +
        Number(s.athletesessionspeedzone_distance_5)
    )
    const maxS = Math.max.apply(Math, speed)
    const minS = Math.min.apply(Math, speed)

    const data =
      athlete_sessions?.map((s) => ({
        ...s,
        maxD,
        minD,
        maxP,
        minP,
        maxS,
        minS,
      })) ?? []

    return (
      <div className="h-full flex-1 flex-col space-y-8 p-8 md:flex">
        <div className="flex items-center justify-between space-y-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">УТЗ</h2>
            <p className="text-muted-foreground">
              Отчет о тренировке {session?.start_timestamp.toLocaleDateString()}
            </p>
          </div>
        </div>
        <div className="space-y-4">
          <DataTable data={data} columns={columns} />
        </div>
      </div>
    )
  }
}
