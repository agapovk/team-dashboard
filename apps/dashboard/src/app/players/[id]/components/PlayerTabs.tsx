'use client'

import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import {
  AthleteSessionWithTeamSession,
  PlayerSchedule,
} from '@components/PlayerCalendar/PlayerCalendar'
import {
  athlete,
  athlete_game_fitness,
  athlete_game_ttd,
  game,
  injury,
} from '@repo/db'

// import { DataTable } from '../data-table'
// import { game_fitness_columns } from '../game_fitness_columns'
// import { game_ttd_columns } from '../game_ttd_columns'
// import { session_columns } from '../session_columns'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@repo/ui'

type Props = {
  player: athlete & {
    injury: injury[]
    athlete_sessions: AthleteSessionWithTeamSession[]
    athlete_games_fitness: (athlete_game_fitness & { game: game })[]
    athlete_games_ttd: (athlete_game_ttd & { game: game })[]
  }
}

export default function PlayerTabs({ player }: Props) {
  const searchParams = useSearchParams()
  const defaultTab = searchParams.get('tab')
  const {
    // athlete_games_fitness, athlete_games_ttd,
    athlete_sessions,
  } = player

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Tabs
        defaultValue={defaultTab || 'calendar'}
        className="col-span-4 md:col-span-3"
      >
        <div className="flex items-center justify-between space-y-2">
          <TabsList className="grid grid-cols-2">
            <TabsTrigger value="calendar">График</TabsTrigger>
            <TabsTrigger value="injuries">История травм</TabsTrigger>
            {/* <TabsTrigger value="sessions">Тренировки</TabsTrigger>
            <TabsTrigger value="games-fitness">Игры - Фитнесс</TabsTrigger>
            <TabsTrigger value="games-ttd">Игры - ТТД</TabsTrigger> */}
          </TabsList>
        </div>
        <div>
          <TabsContent value="calendar">
            <PlayerSchedule
              injury={player.injury}
              athlete_sessions={athlete_sessions}
            />
          </TabsContent>
          <TabsContent value="injuries">Injuries history</TabsContent>
          {/* <TabsContent value="sessions">
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
          </TabsContent> */}
        </div>
      </Tabs>
    </Suspense>
  )
}
