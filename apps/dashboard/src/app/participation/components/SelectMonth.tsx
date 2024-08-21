'use client'

import React from 'react'
import { Button } from '@repo/ui'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { addMonths, format, isAfter, isSameMonth } from 'date-fns'
import { ru } from 'date-fns/locale'

type Props = {
  currentMonth: Date
  setMonth: React.Dispatch<React.SetStateAction<Date>>
}

export default function SelectMonth({ currentMonth, setMonth }: Props) {
  return (
    <div className="flex gap-2 items-center place-self-end">
      <Button
        variant="ghost"
        className="px-3"
        disabled={isAfter(new Date('2023-02-01'), currentMonth)}
        onClick={() => setMonth((current) => addMonths(current, -1))}
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      <span className="font-medium text-sm w-[160px] text-center">
        {format(currentMonth, 'LLLL yyyy', { locale: ru }).toUpperCase()}
      </span>
      <Button
        variant="ghost"
        className="px-3"
        disabled={isSameMonth(currentMonth, new Date())}
        onClick={() => setMonth((current) => addMonths(current, 1))}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  )
}
