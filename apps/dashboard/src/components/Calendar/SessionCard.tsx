'use client'

import React from 'react'
import Link from 'next/link'
import { Bar } from '@components/Bars'
import { deleteSession } from '@dashboard/actions/session'
import { CrossCircledIcon } from '@radix-ui/react-icons'
import { session } from '@repo/db'
import { convertSecToMin, roundToNearest5 } from '@utils'

import { Spinner } from '../Spinner'
import { cn } from '@repo/ui/lib/utils'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@repo/ui'

type Props = {
  day: Date
  sessions: session[]
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

export default function SessionCard({ day, sessions }: Props) {
  const [loading, setLoading] = React.useState(false)

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
          start_timestamp,
          total_distance,
          total_time,
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
          <TooltipProvider delayDuration={100} key={id}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  href={`/performance/${id}`}
                  className={cn(
                    'text-accent-foreground mx-1 flex flex-col gap-2 overflow-auto truncate rounded-lg bg-sky-300 px-2 py-1 text-xs transition-all hover:bg-opacity-80 dark:bg-sky-800',
                    {
                      'bg-red-300 dark:bg-red-800':
                        name && name.startsWith('[МАТЧ'),
                    }
                  )}
                >
                  {!category_name?.includes('МАТЧ') && (
                    <div className="flex justify-between">
                      <span className="font-semibold">
                        {roundToNearest5(start_timestamp).toLocaleTimeString(
                          'ru-RU',
                          {
                            hour: '2-digit',
                            minute: '2-digit',
                          }
                        )}
                      </span>
                      <span className="font-semibold">
                        {convertSecToMin(total_time).toFixed(0)}&apos;
                      </span>
                    </div>
                  )}

                  {category_name && category_name === 'БЕЗ ДАТЧИКОВ' ? (
                    <div className="py-4">{name}</div>
                  ) : (
                    <div className="grid grid-cols-[min-content_1fr] items-center justify-items-end gap-x-2">
                      <span className="">
                        {Number(total_distance?.toFixed(0)).toLocaleString()}
                      </span>
                      <Bar
                        // height={6}
                        max={13000}
                        values={[total_distance ?? 0]}
                        color={zones.td(total_distance ?? 0)}
                      />
                      <span className="">
                        {Number(power_distance?.toFixed(0)).toLocaleString()}
                      </span>
                      <Bar
                        // height={8}
                        values={[power_distance]}
                        max={2500}
                        color={zones.pd(power_distance)}
                      />
                      <span className="">
                        {Number(
                          speedzone_distance?.toFixed(0)
                        ).toLocaleString()}
                      </span>
                      <Bar
                        // height={8}
                        values={[speedzone_distance]}
                        max={850}
                        color={zones.sd(speedzone_distance)}
                      />
                    </div>
                  )}
                </Link>
              </TooltipTrigger>
              <TooltipContent
                className={cn(
                  'sr-only',
                  category_name &&
                    category_name === 'БЕЗ ДАТЧИКОВ' &&
                    'not-sr-only p-1'
                )}
              >
                {loading ? (
                  <Spinner />
                ) : (
                  <CrossCircledIcon
                    className="cursor-pointer"
                    onClick={() => {
                      setLoading(true)
                      deleteSession(session.id)
                    }}
                  />
                )}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )
      })}
    </div>
  )
}
