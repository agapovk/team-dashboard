import React from 'react'
import Link from 'next/link'
import { athlete, injury } from '@repo/db'
import { dayTitle } from '@utils'
import { addDays, differenceInDays, format, isWithinInterval } from 'date-fns'
import { Accessibility } from 'lucide-react'

import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@repo/ui'

type Props = {
  injuries: (injury & { athlete: athlete })[]
}

export default async function InjuryCard({ injuries }: Props) {
  const currentInjuries = injuries.filter((injury) => !injury.end_date)

  const afterInjuries = injuries
    .filter((injury) =>
      injury.end_date
        ? isWithinInterval(Date.now(), {
            start: injury.end_date,
            end: addDays(injury.end_date, 10),
          })
        : false
    )
    .sort((a, b) =>
      a.end_date !== null && b.end_date !== null
        ? a.end_date.getTime() - b.end_date.getTime()
        : 0
    )

  return (
    <Card className="flex w-full flex-col justify-between space-y-2">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-md text-foreground font-normal">
          <Link href="/injury">
            <Button variant="outline" size="sm">
              Информация по травмам
            </Button>
          </Link>
        </CardTitle>
        <CardDescription />
        <Accessibility className="text-muted-foreground" />
      </CardHeader>
      <CardContent className="flex-1">
        <Badge variant="destructive" className="mb-2 font-semibold">
          Текущие
        </Badge>
        <div className="divide-y">
          {currentInjuries.map((inj) => (
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
        <Badge variant="default" className="my-2 font-semibold">
          Под наблюдением
        </Badge>
        <div className="divide-y">
          {afterInjuries.map((inj) => (
            <div
              className="flex flex-col items-start justify-between gap-2 space-y-2 py-2 sm:flex-row sm:space-y-0"
              key={inj.id}
            >
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium">{inj.athlete.name}</p>
                <p className="text-muted-foreground text-sm">{inj.diagnosis}</p>
              </div>
              <div className="flex w-full flex-row items-center justify-between sm:w-fit sm:flex-col sm:items-end sm:space-y-1">
                <p className="text-muted-foreground text-right text-sm text-emerald-500">
                  {inj.end_date &&
                    `В общей группе: ${differenceInDays(Date.now(), inj.end_date)} 
													${dayTitle(differenceInDays(Date.now(), inj.end_date))}
															`}
                </p>
                <p className="text-muted-foreground text-right text-sm">
                  {inj.end_date &&
                    `Пропустил: ${differenceInDays(inj.end_date, inj.start_date)} ${dayTitle(differenceInDays(inj.end_date, inj.start_date))}`}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
