import React from 'react'
import Link from 'next/link'
import { game, session } from '@repo/db'
import { ArrowDownLeft } from 'lucide-react'

import { CurrentCalendar } from './components/CurrentCalendar'
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@repo/ui'

type Props = {
  sessions: session[]
  games: game[]
}
export default async function CurrentSchedule({ sessions, games }: Props) {
  return (
    <Card className="w-full space-y-4">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-md text-foreground font-normal">
          <Link href="/calendar">
            <Button variant="outline" size="sm">
              Текущий график команды
            </Button>
          </Link>
        </CardTitle>
        <CardDescription />
        <ArrowDownLeft className="text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <CurrentCalendar sessions={sessions} games={games} />
      </CardContent>
    </Card>
  )
}
