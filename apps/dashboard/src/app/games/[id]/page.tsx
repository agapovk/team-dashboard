import React from 'react'
import { PrismaClient } from '@repo/db'
import GameTabs from './components/GameTabs'
import { Metadata } from 'next'
const prisma = new PrismaClient()

export const metadata: Metadata = {
  title: 'Статистика игры',
  description: 'A task and issue tracker build using Tanstack Table.',
}

type Props = {
  params: {
    id: string
  }
}

export default async function page({ params: { id } }: Props) {
  const game = await prisma.game.findUnique({
    where: {
      id: id,
    },
    include: {
      athlete_ttd: {
        include: {
          athlete: true,
        },
      },
      athlete_fitness: {
        include: {
          athlete: true,
        },
      },
    },
  })

  if (game) return <GameTabs game={game} />
}
