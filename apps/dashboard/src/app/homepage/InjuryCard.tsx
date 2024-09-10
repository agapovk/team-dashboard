import React from 'react'
import Link from 'next/link'
import prisma from '@repo/db'
import { format } from 'date-fns'
import { ShieldX } from 'lucide-react'

import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
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
    <Card className="col-span-4 flex flex-col justify-between space-y-2 lg:col-span-3">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-md text-foreground font-normal">
          Текущие травмы
        </CardTitle>
        <CardDescription />
        <ShieldX className="text-muted-foreground" />
      </CardHeader>
      <CardContent className="flex-1">
        <div className="space-y-8">
          {injuries.map((inj) => (
            <div
              className="flex flex-col items-start justify-between space-y-2 sm:flex-row sm:space-y-0"
              key={inj.id}
            >
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium leading-none">
                  {inj.athlete.name}
                </p>
                <p className="text-muted-foreground overflow-clip truncate text-sm">
                  {inj.diagnosis}
                </p>
              </div>
              <div className="flex w-full flex-row items-center justify-between sm:w-fit sm:flex-col sm:items-end sm:space-y-1">
                <p className="text-right text-sm font-medium leading-none">
                  {format(inj.start_date, 'dd.MM.yy')}
                </p>
                <p className="text-muted-foreground text-sm">
                  {inj.estimated_recovery}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter className="flex justify-end gap-4">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline">Добавить</Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Are you absolutely sure?</SheetTitle>
              <SheetDescription>
                This action cannot be undone. This will permanently delete your
                account and remove your data from our servers.
              </SheetDescription>
            </SheetHeader>
          </SheetContent>
        </Sheet>
        <Link href="/injury">
          <Button>Подробнее</Button>
        </Link>
      </CardFooter>
    </Card>
  )
}
