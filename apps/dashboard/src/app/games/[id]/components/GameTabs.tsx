'use client'

import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { game } from '@repo/db'

import { DataTable } from '../data-table'
import {
  athleteGameFitnessWithAthlete,
  fitness_columns,
} from '../fitness-columns'
import { athleteGameTtdWithAthlete, ttd_columns } from '../ttd_columns'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@repo/ui'

type Props = {
  game: game & {
    athlete_ttd: athleteGameTtdWithAthlete[]
    athlete_fitness: athleteGameFitnessWithAthlete[]
  }
}

export default function GameTabs({ game }: Props) {
  const searchParams = useSearchParams()
  const defaultTab = searchParams.get('tab')

  const athlete_fitnees_data = game?.athlete_fitness
  const athlete_ttd_data = game?.athlete_ttd

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Tabs defaultValue={defaultTab || 'fitness'}>
        <div className="h-full flex-1 flex-col space-y-8 p-8 md:flex">
          <div className="flex items-center justify-between space-y-2">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">
                {game.home ? `УРАЛ - ${game.vs}` : `${game.vs} - УРАЛ`}
              </h2>
              <p className="text-muted-foreground">
                Отчет о матче
                {game.date ? game.date.toLocaleDateString() : ''}
              </p>
            </div>
            <TabsList className="grid grid-cols-2">
              <TabsTrigger value="fitness">Фитнес</TabsTrigger>
              <TabsTrigger value="ttd">ТТД</TabsTrigger>
            </TabsList>
          </div>
          <div className="space-y-4">
            <TabsContent value="fitness">
              <DataTable
                data={athlete_fitnees_data}
                columns={fitness_columns}
              />
            </TabsContent>
            <TabsContent value="ttd">
              <DataTable data={athlete_ttd_data} columns={ttd_columns} />
            </TabsContent>
          </div>
        </div>
      </Tabs>
    </Suspense>
  )
}
