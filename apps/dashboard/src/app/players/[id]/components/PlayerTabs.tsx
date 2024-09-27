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
import { dayTitle } from '~/src/utils'
import { differenceInDays, format } from 'date-fns'
import { Info } from 'lucide-react'

import { cn } from '@repo/ui/lib/utils'
// import { DataTable } from '../data-table'
// import { game_fitness_columns } from '../game_fitness_columns'
// import { game_ttd_columns } from '../game_ttd_columns'
// import { session_columns } from '../session_columns'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@repo/ui'

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
          <TabsContent value="injuries">
            <Card className="flex flex-col justify-between space-y-2">
              <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-4">
                <CardTitle className="text-md text-foreground font-semibold">
                  История травм
                </CardTitle>
                <CardDescription />
                <Info className="text-muted-foreground" />
              </CardHeader>
              <CardContent className="flex-1">
                <div className="divide-y">
                  {player.injury.map((inj) => (
                    <div
                      className="flex flex-col justify-between gap-2 space-y-2 py-2 sm:flex-row sm:items-center sm:space-y-0"
                      key={inj.id}
                    >
                      <div className="flex-1 space-y-1">
                        <p
                          className={cn(
                            'text-sm font-medium',
                            !inj.end_date && 'text-red-500'
                          )}
                        >
                          {inj.place}
                        </p>
                        <p className="text-muted-foreground text-sm">
                          {inj.diagnosis}
                        </p>
                      </div>
                      <div className="flex w-full flex-row items-center justify-between sm:w-fit sm:flex-col sm:items-end sm:space-y-1">
                        <p className="text-sm font-medium">
                          {format(inj.start_date, 'dd.MM.yy')}
                        </p>
                        <p
                          className={cn(
                            'text-muted-foreground text-sm',
                            !inj.end_date && 'text-red-500'
                          )}
                        >
                          {inj.end_date
                            ? `Пропустил: ${differenceInDays(inj.end_date, inj.start_date)} ${dayTitle(differenceInDays(inj.end_date, inj.start_date))}`
                            : `Прогноз: ${inj.estimated_recovery}`}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
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
