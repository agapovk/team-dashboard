import React from 'react'
import { AthleteSessionWithTeamSession } from '@components/PlayerCalendar/PlayerCalendar'

import { cn } from '@repo/ui/lib/utils'

type Props = {
  data: AthleteSessionWithTeamSession[]
}

export default function Marker({ data }: Props) {
  if (data.length === 0) return null
  return (
    <div>
      {data.length !== 0 &&
        data.map((athses) => (
          <span
            key={athses.id}
            className={`${cn(
              'flex h-3 w-3 rounded-full bg-green-400',
              athses.session.category_name?.includes('ИНДИВИДУАЛЬНАЯ') &&
                'bg-sky-400',
              athses.session.category_name?.includes('МАТЧ') && 'bg-yellow-500'
            )}`}
          />
        ))}
    </div>
  )
}
