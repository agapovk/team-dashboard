import { Metadata } from 'next'
import InjuryCard from '@dashboard/homepage/InjuryCard'
import LastGames from '@dashboard/homepage/LastGames'

import CurrentSchedule from './homepage/CurrentSchedule'

export const metadata: Metadata = {
  title: 'Dashboard',
  description: 'Example dashboard app using the components.',
}

export const revalidate = 0

export default async function Home() {
  return (
    <div className="flex flex-col items-stretch gap-6 p-8 lg:flex-row lg:items-start">
      <div className="flex flex-1 flex-col items-start gap-6">
        <CurrentSchedule />
      </div>
      <div className="flex flex-col items-start gap-6">
        <InjuryCard />
        <LastGames />
      </div>
    </div>
  )
}
