'use client'

import React from 'react'
import Link from 'next/link'
import {
  addMonths,
  format,
  getUnixTime,
  isAfter,
  isSameMonth,
  subMonths,
} from 'date-fns'
import { ru } from 'date-fns/locale'
import { ChevronLeft, ChevronRight } from 'lucide-react'

import { Button } from '@repo/ui'

type Props = {
  currentDate: Date
}

export default function SelectMonth({ currentDate }: Props) {
  return (
    <div className="flex items-center gap-2">
      {!isAfter(new Date('2023-01-01'), currentDate) ? (
        <Link href={`/participation/${getUnixTime(subMonths(currentDate, 1))}`}>
          <Button
            variant="ghost"
            className="px-3"
            disabled={isAfter(new Date('2023-02-01'), currentDate)}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
        </Link>
      ) : (
        <Button
          variant="ghost"
          className="px-3"
          disabled={isAfter(new Date('2023-02-01'), currentDate)}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
      )}
      <span className="w-[160px] text-center text-sm font-medium">
        {format(currentDate, 'LLLL yyyy', { locale: ru }).toUpperCase()}
      </span>
      {!isSameMonth(currentDate, new Date()) ? (
        <Link href={`/participation/${getUnixTime(addMonths(currentDate, 1))}`}>
          <Button
            variant="ghost"
            className="px-3"
            disabled={isSameMonth(currentDate, new Date())}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </Link>
      ) : (
        <Button
          variant="ghost"
          className="px-3"
          disabled={isSameMonth(currentDate, new Date())}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      )}
    </div>
  )
}
