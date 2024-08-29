'use client'

import React from 'react'
import Link from 'next/link'
import { athlete_session, session } from '@repo/db'

import { cn } from '@repo/ui/lib/utils'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@repo/ui'

export type SessionWithAthleteSession = session & {
  athlete_sessions: athlete_session[]
}

type Props = {
  day: Date
  sessions: SessionWithAthleteSession[]
}

export default function IndividualSessionCard({ day, sessions }: Props) {
  const currentDaySessions = sessions
    ?.filter((session) => session.category_name === 'ИНДИВИДУАЛЬНАЯ ТРЕНИРОВКА')
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
      <TooltipProvider delayDuration={100}>
        <Tooltip>
          <TooltipTrigger asChild>
            <Link
              href={`/performance`}
              className={cn(
                'text-accent-foreground mx-1 flex flex-col gap-2 overflow-auto truncate rounded-lg bg-emerald-300 px-2 py-1 text-xs transition-all hover:bg-opacity-80 dark:bg-emerald-800'
              )}
            >
              <div className="flex justify-between">
                <span className="font-semibold">Индивидуально</span>
                <span className="font-semibold">
                  {currentDaySessions.length}
                </span>
              </div>
            </Link>
          </TooltipTrigger>
          <TooltipContent className={cn()}>
            {currentDaySessions.map((s) => {
              return s.athlete_sessions.map((session) => (
                <div>{session.athlete_id}</div>
              ))
            })}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  )
}
