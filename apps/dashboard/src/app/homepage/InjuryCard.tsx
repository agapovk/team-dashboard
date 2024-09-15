import React from 'react'
import Link from 'next/link'
import prisma from '@repo/db'
import { dayTitle } from '@utils'
import { differenceInDays, format } from 'date-fns'
import { Accessibility } from 'lucide-react'

import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@repo/ui'

export default async function InjuryCard() {
  const injuries = await prisma.injury.findMany({
    where: {
      end_date: null,
    },
    orderBy: {
      start_date: 'desc',
    },
    include: {
      athlete: true,
    },
    take: 5,
  })

  return (
    <Card className="flex w-full flex-col justify-between space-y-2">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-md text-foreground font-normal">
          <Link href="/injury">
            <Button variant="outline" size="sm">
              Текущие травмы
            </Button>
          </Link>
        </CardTitle>
        <CardDescription />
        <Accessibility className="text-muted-foreground" />
      </CardHeader>
      <CardContent className="flex-1">
        <div className="divide-y">
          {injuries.map((inj) => (
            <div
              className="flex flex-col items-start justify-between gap-2 space-y-2 py-2 sm:flex-row sm:space-y-0"
              key={inj.id}
            >
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium">{inj.athlete.name}</p>
                <p className="text-muted-foreground text-sm text-red-500">
                  {inj.place}
                </p>
                <p className="text-muted-foreground text-sm">{inj.diagnosis}</p>
              </div>
              <div className="flex w-full flex-row items-center justify-between sm:w-fit sm:flex-col sm:items-end sm:space-y-1">
                <p className="text-right text-sm font-medium">
                  {format(inj.start_date, 'dd.MM.yy')}
                </p>
                <p className="text-muted-foreground text-right text-sm text-red-500">
                  {`Прогноз: ${inj.estimated_recovery}`}
                </p>
                <p className="text-muted-foreground text-right text-sm">
                  {`Прошло: ${differenceInDays(Date.now(), inj.start_date)} ${dayTitle(differenceInDays(Date.now(), inj.start_date))}`}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
