import React from 'react'
import Link from 'next/link'
import prisma from '@repo/db'
import { subDays } from 'date-fns'
import { ArrowDownLeft } from 'lucide-react'

import { LastDaysSchedule } from './components/LastDaysSchedule'
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@repo/ui'

export default async function LastDays() {
  const sessions = await prisma.session.findMany({
    where: {
      start_timestamp: {
        gte: subDays(Date.now(), 14),
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
        lte: new Date(),
      },
    },
  })

  return (
    <Card className="w-full space-y-4">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-md text-foreground font-normal">
          <Link href="/calendar">
            <Button variant="outline" size="sm">
              Послдение тренировки
            </Button>
          </Link>
        </CardTitle>
        <CardDescription />
        <ArrowDownLeft className="text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <LastDaysSchedule sessions={sessions} games={games} />
      </CardContent>
    </Card>
  )
}
