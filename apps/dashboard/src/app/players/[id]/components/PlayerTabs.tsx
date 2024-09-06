'use client'

import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import {
  AthleteSessionWithTeamSession,
  PlayerSchedule,
} from '@components/PlayerCalendar/PlayerCalendar'
import { athlete, athlete_game_fitness, athlete_game_ttd, game } from '@repo/db'

import { DataTable } from '../data-table'
import { game_fitness_columns } from '../game_fitness_columns'
import { game_ttd_columns } from '../game_ttd_columns'
import { session_columns } from '../session_columns'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@repo/ui'

type Props = {
  player: athlete & {
    athlete_sessions: AthleteSessionWithTeamSession[]
    athlete_games_fitness: (athlete_game_fitness & { game: game })[]
    athlete_games_ttd: (athlete_game_ttd & { game: game })[]
  }
}

export default function PlayerTabs({ player }: Props) {
  const searchParams = useSearchParams()
  const defaultTab = searchParams.get('tab')
  const { athlete_games_fitness, athlete_games_ttd, athlete_sessions } = player

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Tabs defaultValue={defaultTab || 'calendar'}>
        <div className="h-full flex-1 flex-col space-y-2 p-8 md:flex">
          <div className="flex items-center justify-between space-y-2">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">
                {player.name}
              </h2>
              <p className="text-muted-foreground">Данные по игроку</p>
            </div>
            <TabsList className="grid grid-cols-4">
              <TabsTrigger value="calendar">Календарь</TabsTrigger>
              <TabsTrigger value="sessions">Тренировки</TabsTrigger>
              <TabsTrigger value="games-fitness">Игры - Фитнесс</TabsTrigger>
              <TabsTrigger value="games-ttd">Игры - ТТД</TabsTrigger>
            </TabsList>
          </div>
          <div className="space-y-4">
            <TabsContent value="calendar">
              <PlayerSchedule athlete_sessions={athlete_sessions} />
            </TabsContent>
            <TabsContent value="sessions">
              <DataTable data={athlete_sessions} columns={session_columns} />
            </TabsContent>
            <TabsContent value="games-fitness">
              <DataTable
                data={athlete_games_fitness}
                columns={game_fitness_columns}
              />
            </TabsContent>
            <TabsContent value="games-ttd">
              <DataTable data={athlete_games_ttd} columns={game_ttd_columns} />
            </TabsContent>
          </div>
        </div>
      </Tabs>
    </Suspense>
  )
}
