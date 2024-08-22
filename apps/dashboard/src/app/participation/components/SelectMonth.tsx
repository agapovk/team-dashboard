'use client'

import React from 'react'
import { addMonths, format, isAfter, isSameMonth } from 'date-fns'
import { ru } from 'date-fns/locale'
import { ChevronLeft, ChevronRight } from 'lucide-react'

import { Button } from '@repo/ui'

type Props = {
  currentMonth: Date
  setMonth: React.Dispatch<React.SetStateAction<Date>>
}

export default function SelectMonth({ currentMonth, setMonth }: Props) {
  return (
    <div className="flex items-center gap-2">
      <Button
        variant="ghost"
        className="px-3"
        disabled={isAfter(new Date('2023-02-01'), currentMonth)}
        onClick={() => setMonth((current) => addMonths(current, -1))}
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      <span className="w-[160px] text-center text-sm font-medium">
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
