import React from 'react'
import prisma from '@repo/db'
import { subDays } from 'date-fns'
import { ChartNoAxesColumn } from 'lucide-react'

import { LastDaysChart } from './LastDaysChart'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@repo/ui'

export default async function LastDays() {
  const sessions = await prisma.session.findMany({
    where: {
      category_name: 'ТРЕНИРОВКА',
      start_timestamp: {
        gte: new Date(subDays(new Date(), 14)),
      },
    },
    orderBy: {
      start_timestamp: 'asc',
    },
  })

  return (
    <Card className="col-span-4 space-y-4 lg:col-span-5">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-md text-foreground font-normal">
          Послдение 7 дней
        </CardTitle>
        <CardDescription />
        <ChartNoAxesColumn className="text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <LastDaysChart sessions={sessions} />
      </CardContent>
    </Card>
  )
}
