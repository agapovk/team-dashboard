import { Metadata } from 'next'
import prisma from '@repo/db'
import { columns } from './columns'
import { DataTable } from './data-table'

export const metadata: Metadata = {
  title: 'Список тренировок',
  description: 'A task and issue tracker build using Tanstack Table.',
}

export default async function LoadingPage() {
  const sessions = await prisma.session.findMany({
    where: {
      name: {
        startsWith: '[ТРЕНИРОВКА]',
      },
    },
    orderBy: {
      start_timestamp: 'desc',
    },
  })

  return (
    <div className="h-full flex-1 flex-col space-y-8 p-8 md:flex">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Нагрузка</h2>
          <p className="text-muted-foreground">Анализ динамики нагрузки</p>
        </div>
      </div>
      <div className="space-y-4">
        <DataTable data={sessions} columns={columns} />
      </div>
    </div>
  )
}
