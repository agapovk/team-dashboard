'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@repo/ui';
import { DataTable } from '../data-table';
import { game } from '@repo/db';
import { useSearchParams } from 'next/navigation';
import { fitness_columns } from '../fitness-columns';
import { ttd_columns } from '../ttd_columns';
import { Suspense } from 'react';

type Props = {
  games: game[];
};

export default function GamesTabs({ games }: Props) {
  const searchParams = useSearchParams();
  const defaultTab = searchParams.get('tab');

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Tabs defaultValue={defaultTab || 'fitness'}>
        <div className="h-full flex-1 flex-col space-y-8 p-8 md:flex">
          <div className="flex items-center justify-between space-y-2">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">
                Последние игры
              </h2>
              <p className="text-muted-foreground">Анализ игровых данных </p>
            </div>
            <TabsList className="grid grid-cols-2">
              <TabsTrigger value="fitness">Фитнесс</TabsTrigger>
              <TabsTrigger value="ttd">ТТД</TabsTrigger>
            </TabsList>
          </div>
          <div className="space-y-4">
            <TabsContent value="fitness">
              <DataTable data={games} columns={fitness_columns} />
            </TabsContent>
            <TabsContent value="ttd">
              <DataTable data={games} columns={ttd_columns} />
            </TabsContent>
          </div>
        </div>
      </Tabs>
    </Suspense>
  );
}
