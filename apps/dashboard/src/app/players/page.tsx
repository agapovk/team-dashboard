import { Metadata } from 'next'
import prisma from '@repo/db'

import { columns } from './columns'
// import PlayersTable from './components/PlayersTable'
import { DataTable } from './data-table'

export const metadata: Metadata = {
  title: 'Состав команды',
  description: 'Игроки команды и их данные',
}

export default async function PlayersPage() {
  const players = await prisma.athlete.findMany({
    where: {
      isInTeam: true,
    },
    include: {
      position: true,
    },
    orderBy: {
      name: 'asc',
    },
  })

  // const positions = await prisma.position.findMany()

  return (
    <div className="h-full flex-1 flex-col space-y-4 p-8 md:flex">
      <div className="flex flex-col justify-start space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Состав команды</h2>
          <p className="text-muted-foreground">
            Список игроков команды и их данные
          </p>
        </div>
      </div>
      <div>
        <DataTable columns={columns} data={players} />
        {/* <PlayersTable players={players} positions={positions} /> */}
      </div>
    </div>
  )
}
