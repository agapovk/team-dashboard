import React from 'react'
import Link from 'next/link'
import prisma from '@repo/db'
import { format } from 'date-fns'
import { ShieldX } from 'lucide-react'
import { IoShirt } from 'react-icons/io5'

import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
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
            <div className="flex items-center justify-between" key={inj.id}>
              <span className="relative">
                <IoShirt className="text-border h-10 w-10" />
                <span className="absolute inset-0 flex h-10 w-10 items-center justify-center font-mono text-sm font-semibold">
                  {inj.athlete.number}
                </span>
              </span>
              <div className="ml-4 flex-1 space-y-1">
                <p className="text-sm font-medium leading-none">
                  {inj.athlete.name}
                </p>
                <p className="text-muted-foreground overflow-clip truncate text-sm">
                  {inj.diagnosis}
                </p>
              </div>
              <div className="space-y-1">
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
      <CardFooter className="flex justify-end">
        <Link href="#">
          <Button>Смотреть все</Button>
        </Link>
      </CardFooter>
    </Card>
  )
}
