import { Metadata } from 'next'
import Link from 'next/link'
import prisma from '@repo/db'

import PlayerTabs from './components/PlayerTabs'
import { Button } from '@repo/ui'

export const metadata: Metadata = {
  title: 'Статистика игрока',
  description: 'Игроки команды и их данные',
}

type Props = {
  params: { id: number }
}

export default async function PlayerPage({ params }: Props) {
  const player = await prisma.athlete.findUnique({
    where: {
      id: Number(params.id),
    },
    include: {
      athlete_games_fitness: {
        include: {
          game: true,
        },
        orderBy: {
          game: {
            date: 'desc',
          },
        },
      },
      athlete_games_ttd: {
        include: {
          game: true,
        },
        orderBy: {
          game: {
            date: 'desc',
          },
        },
      },
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

  if (player) {
    return <PlayerTabs player={player} />
  } else {
    return (
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">
              Игрок не найден
            </h2>
            <p className="text-muted-foreground">Не нашли игрока {params.id}</p>
          </div>
        </div>
        <Button>
          <Link href="/players">Все игроки</Link>
        </Button>
      </div>
    )
  }
}
