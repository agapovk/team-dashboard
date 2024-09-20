import React from 'react'
import Link from 'next/link'
import prisma from '@repo/db'
import { subDays } from 'date-fns'
import { ArrowDownLeft } from 'lucide-react'

import { CurrentCalendar } from './components/CurrentCalendar'
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@repo/ui'

export default async function CurrentSchedule() {
  const sessions = await prisma.session.findMany({
    where: {
      OR: [
        {
          category_name: 'БЕЗ ДАТЧИКОВ',
        },
        {
          category_name: 'ТРЕНИРОВКА',
        },
      ],
      start_timestamp: {
        gte: subDays(Date.now(), 21),
      },
    },
    orderBy: {
      start_timestamp: 'asc',
    },
  })

  const games = await prisma.game.findMany({
    where: {
      date: {
        gte: subDays(Date.now(), 14),
      },
    },
  })

  return (
    <Card className="w-full space-y-4">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-md text-foreground font-normal">
          <Link href="/calendar">
            <Button variant="outline" size="sm">
              Текущий график команды
            </Button>
          </Link>
        </CardTitle>
        <CardDescription />
        <ArrowDownLeft className="text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <CurrentCalendar sessions={sessions} games={games} />
      </CardContent>
    </Card>
  )
}
