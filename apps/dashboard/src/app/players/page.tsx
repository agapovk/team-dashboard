import { Metadata } from 'next'
import prisma from '@repo/db'

import { columns } from './columns'
import Constructor from './components/Constructor'
import { DataTable } from './data-table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@repo/ui'

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

  return (
    <Tabs defaultValue="constructor">
      <div className="h-full flex-1 flex-col space-y-4 p-8 md:flex">
        <div className="flex flex-col justify-start space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">
              Состав команды
            </h2>
            <p className="text-muted-foreground">
              Список игроков команды и их данные
            </p>
          </div>
          <TabsList className="grid grid-cols-2">
            <TabsTrigger value="squad">Состав</TabsTrigger>
            <TabsTrigger value="constructor">К тренировке</TabsTrigger>
          </TabsList>
        </div>
        <TabsContent value="squad">
          <DataTable columns={columns} data={players} />
        </TabsContent>
        <TabsContent value="constructor">
          <Constructor players={players} />
        </TabsContent>
      </div>
    </Tabs>
  )
}
