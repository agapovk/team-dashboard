import { UTCDate } from '@date-fns/utc'
import { injury } from '@repo/db'
import { differenceInDays, isSameDay } from 'date-fns'

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@repo/ui'

type Props = {
  currentDayInjury: injury | undefined
  day: Date
}

export default function InjuryInfo({ currentDayInjury, day }: Props) {
  const today = new UTCDate()

  // For today
  if (currentDayInjury && isSameDay(today, day))
    return (
      <TooltipProvider delayDuration={100}>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="cursor-pointer text-center font-bold text-red-700">
              {differenceInDays(
                today,
                new UTCDate(currentDayInjury.start_date)
              )}
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <div className="text-xs">{currentDayInjury.place}</div>
            <div className="text-xs">{currentDayInjury.diagnosis}</div>
            <div className="text-xs">{currentDayInjury.estimated_recovery}</div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )

  // For injuery end date
  if (
    currentDayInjury?.end_date &&
    isSameDay(new Date(currentDayInjury.end_date), new Date(day))
  )
    return (
      <TooltipProvider delayDuration={100}>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="cursor-pointer text-center font-bold text-red-700">
              {differenceInDays(
                new UTCDate(currentDayInjury.end_date),
                new UTCDate(currentDayInjury.start_date)
              )}
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <div className="text-xs">{currentDayInjury.place}</div>
            <div className="text-xs">{currentDayInjury.diagnosis}</div>
            <div className="text-xs">{currentDayInjury.estimated_recovery}</div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )
}
