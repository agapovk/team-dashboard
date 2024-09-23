'use client'

import React from 'react'
import Link from 'next/link'
import { ProgressBar } from '@components/Bars'
import { convertSecToMin, roundToNearest5 } from '@utils'
import { compareAsc, isSameDay } from 'date-fns'

import { AthleteSessionWithTeamSession } from './PlayerCalendar'
import { cn } from '@repo/ui/lib/utils'

type Props = {
  day: Date
  athlete_sessions: AthleteSessionWithTeamSession[]
}

const zones = {
  td(value: number) {
    if (value <= 3900) return 'bg-green-500'
    if (value >= 6000) return 'bg-red-400'
    return 'bg-orange-300'
  },
  pd(value: number) {
    if (value <= 350) return 'bg-green-500'
    if (value >= 950) return 'bg-red-400'
    return 'bg-orange-300'
  },
  sd(value: number) {
    if (value <= 50) return 'bg-green-500'
    if (value >= 180) return 'bg-red-400'
    return 'bg-orange-300'
  },
}

export default function PlayerSessionCard({ day, athlete_sessions }: Props) {
  const currentDaySessions = athlete_sessions?.filter((athlete_session) =>
    isSameDay(athlete_session.session.start_timestamp, day)
  )

  // Sorting sessions by timestamp
  currentDaySessions.sort((a, b) =>
    compareAsc(a.start_timestamp, b.start_timestamp)
  )

  if (!currentDaySessions) return null

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
              'text-accent-foreground mx-1 flex flex-col gap-2 overflow-auto truncate rounded-lg bg-sky-300 px-2 py-1 text-xs transition-all hover:bg-opacity-80 dark:bg-sky-800',
              {
                'bg-red-300 dark:bg-red-800':
                  session.category_name && session.category_name === 'МАТЧ',
              },
              {
                'bg-emerald-300 dark:bg-emerald-800':
                  session.category_name &&
                  session.category_name === 'ИНДИВИДУАЛЬНАЯ ТРЕНИРОВКА',
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
              <div className="flex flex-col gap-2">
                <ProgressBar
                  value={total_distance || 0}
                  minValue={0}
                  maxValue={12000}
                  backgroundColor={zones.td(total_distance ?? 0)}
                  average={session.total_distance ?? 0}
                />
                <ProgressBar
                  value={power_distance}
                  minValue={0}
                  maxValue={12000}
                  backgroundColor={zones.pd(power_distance)}
                  average={
                    (session.athletesessionpowerzone_distance_2 ?? 0) +
                    (session.athletesessionpowerzone_distance_3 ?? 0)
                  }
                />
                <ProgressBar
                  value={speedzone_distance}
                  minValue={0}
                  maxValue={12000}
                  backgroundColor={zones.sd(speedzone_distance)}
                  average={
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
