import React from 'react'
import Link from 'next/link'
import prisma from '@repo/db'
import { addDays } from 'date-fns'
import { WrapText } from 'lucide-react'

import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@repo/ui'

export default async function LastGames() {
  const games = await prisma.game.findMany({
    where: {
      date: {
        lte: addDays(Date.now(), 1),
      },
    },
    orderBy: {
      date: 'desc',
    },
    take: 5,
  })

  return (
    <Card className="flex w-full flex-col justify-between space-y-2">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-md text-foreground font-normal">
          <Link href="/games">
            <Button variant="outline" size="sm">
              Прошлые игры
            </Button>
          </Link>
        </CardTitle>
        <CardDescription />
        <WrapText className="text-muted-foreground" />
      </CardHeader>
      <CardContent className="flex-1">
        <div className="divide-y">
          {games.map((game) => (
            <div
              className="flex flex-col items-start justify-between gap-2 space-y-2 py-2 sm:flex-row sm:space-y-0"
              key={game.id}
            >
              <div className="flex-1 space-y-1">
                <p className="text-muted-foreground text-sm">
                  {game.date?.toLocaleDateString()}
                </p>
                <p className="text-sm font-medium">{game.vs}</p>
              </div>
              <div className="flex w-full flex-row items-center justify-between sm:w-fit sm:flex-col sm:items-end sm:space-y-1">
                <p className="text-sm font-medium">{game.result}</p>
                <p className="text-muted-foreground text-sm font-medium">
                  {game.home ? 'Дома' : 'Выезд'}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
