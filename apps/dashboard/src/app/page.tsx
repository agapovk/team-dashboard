import { Metadata } from 'next'
import { PrismaClient } from '@repo/db'
import { Schedule } from '@components/Calendar/Schedule'
export const revalidate = 0
const prisma = new PrismaClient()

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
