import { Suspense } from 'react'
import { Metadata } from 'next'
import Link from 'next/link'
import prisma from '@repo/db'

import { columns } from './columns'
import { DataTable } from './data-table'
import { Button } from '@repo/ui'

export const metadata: Metadata = {
  title: 'Статистика тренировки',
  description: 'A task and issue tracker build using Tanstack Table.',
}

type Props = {
  params: { id: string }
}

export default async function SessionPage({ params }: Props) {
  const session = await prisma.session.findUnique({
    where: {
      id: params.id,
    },
    include: {
      athlete_sessions: {
        include: {
          athlete: true,
        },
      },
    },
  })

  if (!session) {
    return (
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">
              Сессия не найдена
            </h2>
            <p className="text-muted-foreground">Не нашли сессию {params.id}</p>
          </div>
        </div>
        <Button>
          <Link href="/performance">Все тренировки</Link>
        </Button>
      </div>
    )
  } else {
    const athlete_sessions = session?.athlete_sessions
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
      <Suspense
        fallback={
          <div className="flex h-full items-center justify-center">
            Загузка данных...
          </div>
        }
      >
        <div className="h-full flex-1 flex-col space-y-2 p-8 md:flex">
          <div className="flex items-center justify-between space-y-2">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">УТЗ</h2>
              <p className="text-muted-foreground">
                {`Отчет о тренировке ${session.start_timestamp.toLocaleDateString()}`}
              </p>
            </div>
          </div>
          <div className="space-y-4">
            <DataTable data={data} columns={columns} />
          </div>
        </div>
      </Suspense>
    )
  }
}
// }
