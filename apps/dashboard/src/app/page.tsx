import { Metadata } from 'next'
import prisma from '@repo/db'
import { subDays } from 'date-fns'

import Homepage from './homepage/page'

export const metadata: Metadata = {
  title: 'Dashboard',
  description: 'Example dashboard app using the components.',
}

export const revalidate = 0

export default async function Home() {
  const sessions = await prisma.session.findMany({
    where: {
      OR: [
        {
          category_name: 'БЕЗ ДАТЧИКОВ',
        },
        {
          category_name: 'ТРЕНИРОВКА',
        },
      ],
      start_timestamp: {
        gte: subDays(Date.now(), 21),
      },
    },
    orderBy: {
      start_timestamp: 'asc',
    },
  })

  const games = await prisma.game.findMany({
    where: {
      date: {
        gte: subDays(Date.now(), 14),
      },
    },
  })

  const injuries = await prisma.injury.findMany({
    orderBy: {
      start_date: 'desc',
    },
    include: {
      athlete: true,
    },
  })

  return <Homepage sessions={sessions} games={games} injuries={injuries} />
}
