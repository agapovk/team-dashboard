'use client'

import Link from 'next/link'
import React from 'react'
import { cn } from '@repo/ui/lib/utils'
import { BarWithAvg } from '@components/Bars'
import { AthleteSessionWithTeamSession } from './PlayerCalendar'
import { convertSecToMin, roundToNearest5 } from '@utils'

type Props = {
  day: Date
  athlete_sessions: AthleteSessionWithTeamSession[]
}

const zones = {
  td(value: number) {
    if (value <= 3900) return 'green-500'
    if (value >= 6000) return 'red-500'
    return 'orange-300'
  },
  pd(value: number) {
    if (value <= 350) return 'green-500'
    if (value >= 950) return 'red-500'
    return 'orange-300'
  },
  sd(value: number) {
    if (value <= 50) return 'green-500'
    if (value >= 180) return 'red-500'
    return 'orange-300'
  },
}

export default function PlayerSessionCard({ day, athlete_sessions }: Props) {
  const currentDaySessions = athlete_sessions?.filter(
    (athlete_session) =>
      athlete_session.session.start_timestamp.toLocaleDateString() ===
      day.toLocaleDateString()
  )

  // Sorting sessions by timestamp
  currentDaySessions.sort(
    (a, b) =>
      new Date(a.session.start_timestamp).getTime() -
      new Date(b.session.start_timestamp).getTime()
  )

  return (
    <div className="flex flex-col gap-2">
      {currentDaySessions.map((athlete_session) => {
        const {
          id,
          session,
          total_distance,
          athletesessionpowerzone_distance_2,
          athletesessionpowerzone_distance_3,
          athletesessionspeedzone_distance_4,
          athletesessionspeedzone_distance_5,
        } = athlete_session

        const power_distance =
          (athletesessionpowerzone_distance_2 ?? 0) +
          (athletesessionpowerzone_distance_3 ?? 0)
        const speedzone_distance =
          (athletesessionspeedzone_distance_4 ?? 0) +
          (athletesessionspeedzone_distance_5 ?? 0)

        return (
          <Link
            key={id}
            href={`/performance/${session.id}`}
            className={cn(
              'text-accent-foreground mx-1 flex bg-sky-300 dark:bg-sky-800 flex-col gap-2 overflow-auto truncate rounded-lg px-2 py-1 text-xs transition-all hover:bg-opacity-80',
              {
                'bg-red-300 dark:bg-red-800':
                  session.category_name && session.category_name === 'МАТЧ',
              }
            )}
          >
            <div className="flex justify-between">
              <span className="font-semibold">
                {roundToNearest5(session.start_timestamp).toLocaleTimeString(
                  'ru-RU',
                  {
                    hour: '2-digit',
                    minute: '2-digit',
                  }
                )}
              </span>
              <span className="font-semibold">
                {convertSecToMin(session.total_time).toFixed(0)}&apos;
              </span>
            </div>

            {session.category_name &&
            session.category_name === 'БЕЗ ДАТЧИКОВ' ? (
              <span className="py-4">{session.name}</span>
            ) : (
              <div className="grid grid-cols-[min-content_1fr] items-center justify-items-end gap-x-2">
                <span className="">
                  {Number(total_distance?.toFixed(0)).toLocaleString()}
                </span>
                <BarWithAvg
                  // height={6}
                  max={13000}
                  values={[total_distance ?? 0]}
                  team_avg={session.total_distance ?? 0}
                  color={zones.td(total_distance ?? 0)}
                />
                <span className="">
                  {Number(power_distance?.toFixed(0)).toLocaleString()}
                </span>
                <BarWithAvg
                  // height={8}
                  max={2500}
                  values={[power_distance]}
                  team_avg={
                    (session.athletesessionpowerzone_distance_2 ?? 0) +
                    (session.athletesessionpowerzone_distance_3 ?? 0)
                  }
                  color={zones.pd(power_distance)}
                />
                <span className="">
                  {Number(speedzone_distance?.toFixed(0)).toLocaleString()}
                </span>
                <BarWithAvg
                  // height={8}
                  max={600}
                  values={[speedzone_distance]}
                  color={zones.sd(speedzone_distance)}
                  team_avg={
                    (session.athletesessionspeedzone_distance_4 ?? 0) +
                    (session.athletesessionspeedzone_distance_5 ?? 0)
                  }
                />
              </div>
            )}
          </Link>
        )
      })}
    </div>
  )
}
