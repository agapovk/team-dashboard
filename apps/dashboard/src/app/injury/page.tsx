import React from 'react'
import prisma from '@repo/db'
import { dayTitle } from '~/src/utils'
import { addDays, differenceInDays, format, isWithinInterval } from 'date-fns'
import { Info, ShieldAlert, ShieldX } from 'lucide-react'

import { InjuryForm } from './components/injury-form'
import { cn } from '@repo/ui/lib/utils'
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@repo/ui'

export const revalidate = 0

export default async function page() {
  const injuries = await prisma.injury.findMany({
    orderBy: {
      start_date: 'desc',
    },
    include: {
      athlete: true,
    },
  })

  const historyInjuries = injuries.sort((a) => (a.end_date ? 1 : -1))
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
    <div className="h-full flex-1 flex-col space-y-4 p-8 md:flex">
      <div className="flex flex-col justify-start space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Контроль травм</h2>
          <p className="text-muted-foreground">
            Информация по травмированным игрокам
          </p>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card className="flex flex-col justify-between space-y-2">
          <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-4">
            <CardTitle className="text-md text-foreground font-semibold">
              История травм
            </CardTitle>
            <CardDescription />
            <Info className="text-muted-foreground" />
          </CardHeader>
          <CardContent className="flex-1">
            <div className="divide-y">
              {historyInjuries.map((inj) => (
                <div
                  className="flex flex-col justify-between gap-2 space-y-2 py-2 sm:flex-row sm:items-center sm:space-y-0"
                  key={inj.id}
                >
                  <div className="flex-1 space-y-1">
                    <p
                      className={cn(
                        'text-sm font-medium',
                        !inj.end_date && 'text-red-500'
                      )}
                    >
                      {inj.athlete.name}
                    </p>
                    <p className="text-muted-foreground text-sm">
                      {inj.diagnosis}
                    </p>
                  </div>
                  <div className="flex w-full flex-row items-center justify-between sm:w-fit sm:flex-col sm:items-end sm:space-y-1">
                    <p className="text-sm font-medium">
                      {format(inj.start_date, 'dd.MM.yy')}
                    </p>
                    <p
                      className={cn(
                        'text-muted-foreground text-sm',
                        !inj.end_date && 'text-red-500'
                      )}
                    >
                      {inj.end_date
                        ? `Пропустил: ${differenceInDays(inj.end_date, inj.start_date)} ${dayTitle(differenceInDays(inj.end_date, inj.start_date))}`
                        : `Прогноз: ${inj.estimated_recovery}`}
                    </p>
                  </div>

                  <InjuryForm data={inj} />
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter className="flex justify-end gap-4"></CardFooter>
        </Card>
        <div className="flex flex-col gap-4">
          <Card className="col-span-6 flex flex-1 flex-col justify-between space-y-2 border-red-500 lg:col-span-2">
            <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-4">
              <CardTitle className="text-md text-foreground font-semibold">
                Текущие травмы
              </CardTitle>
              <CardDescription />
              <ShieldX className="text-muted-foreground" />
            </CardHeader>
            <CardContent className="flex-1">
              <div className="divide-y">
                {currentInjuries.map((inj) => (
                  <div
                    className="flex flex-col items-start justify-between gap-2 space-y-2 py-2 sm:flex-row sm:space-y-0"
                    key={inj.id}
                  >
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium">{inj.athlete.name}</p>
                      <p className="text-muted-foreground text-sm">
                        {inj.diagnosis}
                      </p>
                      <p className="text-muted-foreground text-sm">
                        {inj.place}
                      </p>
                    </div>
                    <div className="flex w-full flex-row items-center justify-between sm:w-fit sm:flex-col sm:items-end sm:space-y-1">
                      <p className="text-right text-sm font-medium">
                        {format(inj.start_date, 'dd.MM.yy')}
                      </p>
                      <p className="text-muted-foreground text-right text-sm text-red-500">
                        {`Прогноз: ${inj.estimated_recovery}`}
                      </p>
                      <p className="text-muted-foreground text-right text-sm">
                        {`Пропустил: ${differenceInDays(Date.now(), inj.start_date)} ${dayTitle(differenceInDays(Date.now(), inj.start_date))}`}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter className="flex justify-end gap-4">
              <Button variant="destructive">Добавить</Button>
            </CardFooter>
          </Card>
          <Card className="col-span-6 flex flex-1 flex-col justify-between space-y-2 border-emerald-500 lg:col-span-2">
            <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-4">
              <CardTitle className="text-md text-foreground font-semibold">
                Под наблюдением
              </CardTitle>
              <CardDescription />
              <ShieldAlert className="text-muted-foreground" />
            </CardHeader>
            <CardContent className="flex-1">
              <div className="divide-y">
                {afterInjuries.map((inj) => (
                  <div
                    className="flex flex-col items-start justify-between gap-2 space-y-2 py-2 sm:flex-row sm:space-y-0"
                    key={inj.id}
                  >
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium">{inj.athlete.name}</p>
                      <p className="text-muted-foreground text-sm">
                        {inj.diagnosis}
                      </p>
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
            <CardFooter className="flex justify-end gap-4"></CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}
