'use client'

import * as React from 'react'
import Image from 'next/image'
import Link from 'next/link'

import { cn } from '@repo/ui/lib/utils'
import { buttonVariants } from '@repo/ui'

export default function TeamSwitcher() {
  return (
    <Link
      href="/"
      role="combobox"
      aria-label="Select a team"
      className={cn(
        'flex w-fit justify-between gap-2',
        buttonVariants({ variant: 'outline' })
      )}
    >
      <Image src="/avatars/01.png" alt="FC Ural" width={16} height={16} />
      ФК Урал
    </Link>
  )
}
