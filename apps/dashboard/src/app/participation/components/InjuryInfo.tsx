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
  currentMonth: Date
  day: number
}

export default function InjuryInfo({
  currentDayInjury,
  currentMonth,
  day,
}: Props) {
  const today = new Date(
    Date.UTC(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      new Date().getDate()
    )
  )

  if (currentDayInjury && today.getDate() === day)
    return (
      <TooltipProvider delayDuration={100}>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="w-full cursor-pointer text-center text-red-700">
              {differenceInDays(today, currentDayInjury.start_date) + 1}
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p className="text-xs">{currentDayInjury.place}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )

  if (currentDayInjury && currentDayInjury.end_date?.getDate() === day)
    return (
      <TooltipProvider delayDuration={100}>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="w-full cursor-pointer text-center text-red-700">
              {differenceInDays(
                currentDayInjury.end_date,
                currentDayInjury.start_date
              ) + 1}
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p className="text-xs">{currentDayInjury.place}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )
}
