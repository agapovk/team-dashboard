'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { cn } from '@repo/ui/lib/utils'

const menuItems = [
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
      className={cn('flex items-center space-x-4 lg:space-x-6', className)}
      {...props}
    >
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
