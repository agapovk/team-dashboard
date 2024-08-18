import { Metadata } from 'next'
import { Schedule } from '@components/Calendar/Schedule'
import prisma from '@repo/db'
export const revalidate = 0

export const metadata: Metadata = {
  title: 'Dashboard',
  description: 'Example dashboard app using the components.',
}

export default async function Home() {
  const sessions = await prisma.session.findMany({
    where: {
      OR: [
        {
          name: {
            startsWith: '[ТРЕНИРОВКА]',
          },
        },
        {
          category_name: {
            equals: 'БЕЗ ДАТЧИКОВ',
          },
        },
        {
          name: {
            startsWith: '[МАТЧ]',
          },
        },
      ],
    },
  })
  const games = await prisma.game.findMany()

  return <Schedule sessions={sessions} games={games} />
}
