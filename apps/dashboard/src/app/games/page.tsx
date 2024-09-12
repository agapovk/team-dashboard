import { Metadata } from 'next'
import prisma from '@repo/db'

import GamesTabs from './components/GamesTabs'

export const metadata: Metadata = {
  title: 'Список игр',
  description: 'A task and issue tracker build using Tanstack Table.',
}

export const revalidate = 0

export default async function GamesPage() {
  const games = await prisma.game.findMany({
    orderBy: {
      date: 'desc',
    },
  })

  return <GamesTabs games={games} />
}
