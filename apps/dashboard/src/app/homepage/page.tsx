import { Metadata } from 'next'
import InjuryCard from '@dashboard/homepage/InjuryCard'
import LastGames from '@dashboard/homepage/LastGames'
import { athlete, game, injury, session } from '@repo/db'

import CurrentSchedule from './CurrentSchedule'

export const metadata: Metadata = {
  title: 'Dashboard',
  description: 'Example dashboard app using the components.',
}

export const revalidate = 0

type Props = {
  sessions: session[]
  games: game[]
  injuries: (injury & { athlete: athlete })[]
}

export default async function Homepage({ sessions, games, injuries }: Props) {
  return (
    <div className="flex flex-col items-stretch gap-6 p-8 lg:flex-row lg:items-start">
      <div className="flex flex-1 flex-col items-start gap-6">
        <CurrentSchedule sessions={sessions} games={games} />
      </div>
      <div className="flex flex-col items-start gap-6">
        <InjuryCard injuries={injuries} />
        <LastGames games={games} />
      </div>
    </div>
  )
}
