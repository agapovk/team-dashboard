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
    include: {
      athlete_sessions: {
        include: {
          athlete: {
            select: {
              last_name: true,
            },
          },
        },
      },
    },
  })

  const players = await prisma.athlete.findMany({
    where: {
      isInTeam: true,
    },
    orderBy: {
      name: 'asc',
    },
  })

  const games = await prisma.game.findMany()

  return <Schedule sessions={sessions} games={games} players={players} />
}
