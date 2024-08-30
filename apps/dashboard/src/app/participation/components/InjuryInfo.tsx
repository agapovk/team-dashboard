import { UTCDate } from '@date-fns/utc'
import { injury } from '@repo/db'
import { differenceInDays } from 'date-fns'

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@repo/ui'

type Props = {
  currentDayInjury: injury | undefined
  currentDate: Date
  day: number
}

export default function InjuryInfo({
  currentDayInjury,
  currentDate,
  day,
}: Props) {
  const today = new UTCDate(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    new UTCDate().getDate()
  )

  if (currentDayInjury && today.getDate() === day)
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

  if (currentDayInjury && currentDayInjury.end_date?.getDate() === day)
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
