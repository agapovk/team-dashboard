'use client'

import React from 'react'
import Link from 'next/link'
import { NewBar } from '@components/Bars'
import { session } from '@repo/db'

import { cn } from '@repo/ui/lib/utils'

type Props = {
  day: Date
  sessions: session[]
}

const zones = {
  td(value: number) {
    if (value <= 3900) return 'green-300'
    if (value >= 6000) return 'red-300'
    return 'orange-300'
  },
  pd(value: number) {
    if (value <= 350) return 'green-300'
    if (value >= 950) return 'red-300'
    return 'orange-300'
  },
  sd(value: number) {
    if (value <= 50) return 'green-300'
    if (value >= 180) return 'red-300'
    return 'orange-300'
  },
}

export default function SessionCard({ day, sessions }: Props) {
  const currentDaySessions = sessions
    ?.filter(
      (session) =>
        session.category_name === 'ТРЕНИРОВКА' ||
        session.category_name === 'БЕЗ ДАТЧИКОВ' ||
        session.category_name?.includes('МАТЧ')
    )
    .filter(
      (session) =>
        session.start_timestamp.toLocaleDateString() ===
        day.toLocaleDateString()
    )
    .sort(
      (a, b) =>
        new Date(a.start_timestamp).getTime() -
        new Date(b.start_timestamp).getTime()
    )

  if (currentDaySessions.length === 0) return null

  return (
    <div className="flex flex-col gap-2">
      {currentDaySessions.map((session) => {
        const {
          id,
          total_distance,
          name,
          category_name,
          athletesessionpowerzone_distance_2,
          athletesessionpowerzone_distance_3,
          athletesessionspeedzone_distance_4,
          athletesessionspeedzone_distance_5,
        } = session

        const power_distance =
          (athletesessionpowerzone_distance_2 || 0) +
          (athletesessionpowerzone_distance_3 || 0)
        const speedzone_distance =
          (athletesessionspeedzone_distance_4 || 0) +
          (athletesessionspeedzone_distance_5 || 0)

        return (
          <Link
            href={`/performance/${id}`}
            className={cn(
              'text-accent-foreground mx-1 flex flex-col gap-2 overflow-auto truncate rounded-lg border border-sky-500 bg-sky-100 px-2 py-2 text-xs transition-all hover:bg-opacity-80 dark:bg-sky-900',
              {
                'bg-red-300 dark:bg-red-800': name && name.startsWith('[МАТЧ'),
              }
            )}
          >
            {category_name && category_name === 'БЕЗ ДАТЧИКОВ' ? (
              <div className="flex items-center justify-center py-2 md:py-6">
                {name}
              </div>
            ) : (
              <>
                <div className="flex items-center justify-center py-2 md:hidden">
                  УТЗ
                </div>
                <div className="hidden flex-col gap-2 md:flex">
                  <NewBar
                    value={total_distance || 0}
                    values={[total_distance ?? 0]}
                    max={8000}
                    color={zones.td(total_distance ?? 0)}
                  />
                  <NewBar
                    value={power_distance}
                    values={[power_distance]}
                    max={1500}
                    color={zones.pd(power_distance)}
                  />
                  <NewBar
                    value={speedzone_distance}
                    values={[speedzone_distance]}
                    max={600}
                    color={zones.sd(speedzone_distance)}
                  />
                </div>
              </>
            )}
          </Link>
        )
      })}
    </div>
  )
}
