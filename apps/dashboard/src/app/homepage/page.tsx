'use client'

import React from 'react'
import Image from 'next/image'
import InjuryCard from '@dashboard/homepage/InjuryCard'
import LastGames from '@dashboard/homepage/LastGames'
import { athlete, game, injury, session } from '@repo/db'
import { format } from 'date-fns'
import { ru } from 'date-fns/locale'
import { useReactToPrint } from 'react-to-print'

import CurrentSchedule from './CurrentSchedule'
import { Button, Card, CardDescription, CardHeader, CardTitle } from '@repo/ui'

export const revalidate = 0

type Props = {
  sessions: session[]
  games: game[]
  injuries: (injury & { athlete: athlete })[]
}

export default function Homepage({ sessions, games, injuries }: Props) {
  const printRef = React.useRef<HTMLDivElement>(null)
  const handlePrint = useReactToPrint({
    content: () => printRef.current,
  })
  return (
    <div ref={printRef} className="flex flex-col gap-6 p-8">
      <Card>
        <CardHeader className="flex flex-row items-center justify-start gap-4 py-4">
          <Image src="/bw-ural.png" alt="FC Ural" width={48} height={48} />
          <div>
            <CardTitle className="text-md text-foreground font-semibold">
              {format(Date.now(), 'dd MMMM yyyy', { locale: ru })}
            </CardTitle>
            <CardDescription>ФК Урал</CardDescription>
          </div>
          <div className="ml-auto">
            <Button variant="default" onClick={handlePrint}>
              Печать
            </Button>
          </div>
        </CardHeader>
      </Card>
      <div className="flex flex-col items-stretch gap-6 lg:flex-row lg:items-start">
        <div className="flex flex-1 flex-col items-start gap-6">
          <CurrentSchedule sessions={sessions} games={games} />
        </div>
        <div className="flex flex-col items-start gap-6">
          <InjuryCard injuries={injuries} />
          <LastGames games={games} />
        </div>
      </div>
    </div>
  )
}
