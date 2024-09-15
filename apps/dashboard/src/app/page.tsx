import { Metadata } from 'next'
import FutureDays from '@dashboard/homepage/FutureDays'
import InjuryCard from '@dashboard/homepage/InjuryCard'
import LastDays from '@dashboard/homepage/LastDays'
import LastGames from '@dashboard/homepage/LastGames'

export const metadata: Metadata = {
  title: 'Dashboard',
  description: 'Example dashboard app using the components.',
}

export const revalidate = 0

export default async function Home() {
  return (
    <div className="flex flex-col items-stretch gap-6 p-8 lg:flex-row lg:items-start">
      <div className="flex flex-1 flex-col items-start gap-6">
        <LastDays />
        <FutureDays />
      </div>
      <div className="flex flex-col items-start gap-6">
        <InjuryCard />
        <LastGames />
      </div>
    </div>
  )
}
