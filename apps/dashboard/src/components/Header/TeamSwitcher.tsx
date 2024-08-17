'use client'

import * as React from 'react'

import { cn } from '@repo/ui/lib/utils'
import { Avatar, AvatarFallback, AvatarImage, buttonVariants } from '@repo/ui'
import Link from 'next/link'

export default function TeamSwitcher() {
  return (
    <Link
      href="/"
      role="combobox"
      aria-label="Select a team"
      className={cn(
        'w-fit justify-between',
        buttonVariants({ variant: 'outline' })
      )}
    >
      <Avatar className="mr-2 h-5 w-5">
        <AvatarImage src="/avatars/01.png" alt="FC Ural" />
        <AvatarFallback>УЕ</AvatarFallback>
      </Avatar>
      ФК Урал
    </Link>
  )
}
