'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

import TeamSwitcher from './TeamSwitcher'
import { cn } from '@repo/ui/lib/utils'

export const menuItems = [
  {
    title: 'Календарь',
    href: '/calendar',
  },
  {
    title: 'Игроки',
    href: '/players',
  },
  {
    title: 'Посещение',
    href: '/participation',
  },
  {
    title: 'Игры',
    href: '/games',
  },
  {
    title: 'Травмы',
    href: '/injury',
  },
  // {
  //   title: 'Тренировки',
  //   href: '/performance',
  // },
]

export function MainNav({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  const pathname = usePathname()
  return (
    <nav
      className={cn(
        'hidden items-center space-x-4 md:flex lg:space-x-6',
        className
      )}
      {...props}
    >
      <TeamSwitcher />
      {menuItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            pathname === item.href
              ? 'hover:text-primary text-sm font-medium transition-colors'
              : 'text-muted-foreground hover:text-primary text-sm font-medium transition-colors',
            'justify-start'
          )}
        >
          {item.title}
        </Link>
      ))}
    </nav>
  )
}
