import { Metadata } from 'next'
import InjuryCard from '@dashboard/homepage/InjuryCard'
import LastDays from '@dashboard/homepage/LastDays'
import NavCards from '@dashboard/homepage/NavCards'

export const metadata: Metadata = {
  title: 'Dashboard',
  description: 'Example dashboard app using the components.',
}

export default async function Home() {
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <NavCards />
      <div className="grid gap-4 md:grid-cols-4 lg:grid-cols-8">
        <LastDays />
        <InjuryCard />
      </div>
    </div>
  )
}
