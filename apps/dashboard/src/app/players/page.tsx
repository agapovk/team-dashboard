import { DataTable } from './data-table';
import { columns } from './columns';
import { PrismaClient } from '@repo/db';
import { Metadata } from 'next';

const prisma = new PrismaClient();

export const metadata: Metadata = {
  title: 'Состав команды',
  description: 'Игроки команды и их данные',
};

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
  });

  return (
    <div className="h-full flex-1 flex-col space-y-8 p-8 md:flex">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Состав команды</h2>
          <p className="text-muted-foreground">
            Список игроков команды и их данные
          </p>
        </div>
      </div>
      <div className="space-y-4">
        <DataTable columns={columns} data={players} />
      </div>
    </div>
  );
}
