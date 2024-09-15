import React from 'react'
import prisma from '@repo/db'
import { ArrowUpRight } from 'lucide-react'

import { FutureDaysSchedule } from './components/FutureDaysSchedule'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@repo/ui'

export default async function FutureDays() {
  const games = await prisma.game.findMany({
    where: {
      date: {
        gte: new Date(),
      },
    },
  })

  return (
    <Card className="w-full space-y-4">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-md text-foreground font-normal">
          Ближайшие игры
        </CardTitle>
        <CardDescription />
        <ArrowUpRight className="text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <FutureDaysSchedule games={games} />
      </CardContent>
    </Card>
  )
}
