import React from 'react'
import Link from 'next/link'
import {
  CalendarDays,
  ChevronRight,
  Clock3,
  Trophy,
  UserPen,
} from 'lucide-react'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@repo/ui'

export default function NavCards() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Link href="/calendar">
        <Card className="hover:bg-accent space-y-4 transition hover:shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-md font-medium uppercase">
              Календарь
            </CardTitle>
            <CardDescription />
            <CalendarDays className="text-muted-foreground" />
          </CardHeader>
          <CardContent className="flex items-center justify-between gap-4">
            <p className="text-muted-foreground w-full text-left text-sm">
              Подробный график команды
            </p>
            <ChevronRight className="h-4 w-4" />
          </CardContent>
        </Card>
      </Link>
      <Link href="/players">
        <Card className="hover:bg-accent space-y-4 transition hover:shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-md font-medium uppercase">
              Игроки
            </CardTitle>
            <CardDescription />
            <UserPen className="text-muted-foreground" />
          </CardHeader>
          <CardContent className="flex items-center justify-between gap-4">
            <p className="text-muted-foreground w-full text-left text-sm">
              Профили игроков команды
            </p>
            <ChevronRight className="h-4 w-4" />
          </CardContent>
        </Card>
      </Link>
      <Link href="/participation">
        <Card className="hover:bg-accent space-y-4 transition hover:shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-md font-medium uppercase">
              Посещение
            </CardTitle>
            <CardDescription />
            <Clock3 className="text-muted-foreground" />
          </CardHeader>
          <CardContent className="flex items-center justify-between gap-4">
            <p className="text-muted-foreground w-full text-left text-sm">
              Учет посещения тренировок и игр
            </p>
            <ChevronRight className="h-4 w-4" />
          </CardContent>
        </Card>
      </Link>
      <Link href="/games">
        <Card className="hover:bg-accent space-y-4 transition hover:shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-md font-medium uppercase">
              Игры
            </CardTitle>
            <CardDescription />
            <Trophy className="text-muted-foreground" />
          </CardHeader>
          <CardContent className="flex items-center justify-between gap-4">
            <p className="text-muted-foreground w-full text-left text-sm">
              Последние игры команды
            </p>
            <ChevronRight className="h-4 w-4" />
          </CardContent>
        </Card>
      </Link>
    </div>
  )
}
