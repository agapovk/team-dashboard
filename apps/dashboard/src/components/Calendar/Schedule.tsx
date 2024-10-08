'use client'

import React from 'react'
import { athlete, game } from '@repo/db'
import { dateFromSlug } from '@utils'
import { ru } from 'date-fns/locale'
import { ChevronLeft, ChevronRight } from 'lucide-react'

import DialogWithForms from './DialogWithForms'
import GameCard from './GameCard'
import IndividualSessionCard, {
  SessionWithAthleteSessionWithAthlete,
} from './IndividualSessionCard'
import SessionCard from './SessionCard'
import { cn } from '@repo/ui/lib/utils'
import { buttonVariants, Calendar } from '@repo/ui'

export type CalendarProps = React.ComponentProps<typeof Calendar>
export type CalendarPropsWithEvents = CalendarProps & {
  sessions: SessionWithAthleteSessionWithAthlete[]
  games: game[]
  players: athlete[]
  date: string
}

export function Schedule({
  className,
  classNames,
  showOutsideDays = true,
  sessions,
  games,
  players,
  date,
  ...props
}: CalendarPropsWithEvents) {
  const currentDate = dateFromSlug(date)

  return (
    <Calendar
      locale={ru}
      ISOWeek
      defaultMonth={currentDate}
      showOutsideDays={showOutsideDays}
      disableNavigation
      className={cn('p-0', className)}
      classNames={{
        months: 'flex flex-col space-y-4 sm:space-x-4 sm:space-y-0',
        month: 'space-y-4',
        caption:
          'flex w-64 justify-center relative items-center mx-auto hidden',
        caption_label: 'uppercase text-sm',
        nav: 'space-x-1 flex items-center',
        nav_button: cn(
          buttonVariants({ variant: 'outline' }),
          'h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100'
        ),
        nav_button_previous: 'absolute left-1',
        nav_button_next: 'absolute right-1',
        table: 'w-full border-collapse space-y-1',
        head_row: 'flex',
        head_cell:
          'text-muted-foreground rounded-md flex-1 font-semibold text-[0.8rem]',

        row: 'grid grid-cols-7 w-full divide-x',
        tbody: 'grid grid-cols-1 auto-rows-fr border rounded-lg divide-y',
        cell: 'flex-1 text-center text-sm p-0 relative first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20',
        day: cn('h-full w-full p-0 font-normal aria-selected:opacity-100'),
        day_selected: 'bg-primary text-primary-foreground',
        day_today: 'bg-accent text-accent-foreground',
        day_outside: 'text-muted-foreground opacity-50',
        day_disabled: 'text-muted-foreground opacity-50',
        day_range_middle:
          'aria-selected:bg-accent aria-selected:text-accent-foreground',
        day_hidden: 'invisible',
        ...classNames,
      }}
      components={{
        DayContent: ({ date }) => {
          return (
            <div className="flex h-full w-full flex-col gap-1 border-none bg-transparent p-2">
              <div className="flex items-center justify-between">
                <span className="mx-2 text-lg font-medium">
                  {date.getDate()}
                </span>
                <DialogWithForms date={date} players={players} />
              </div>
              <GameCard day={date} games={games} />
              <SessionCard day={date} sessions={sessions} />
              <IndividualSessionCard day={date} sessions={sessions} />
            </div>
          )
        },
        IconLeft: () => <ChevronLeft className="h-4 w-4" />,
        IconRight: () => <ChevronRight className="h-4 w-4" />,
      }}
      {...props}
    />
  )
}
