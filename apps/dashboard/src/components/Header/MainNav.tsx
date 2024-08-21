'use client'

import Link from 'next/link'
import { cn } from '@repo/ui/lib/utils'
import { usePathname } from 'next/navigation'

const menuItems = [
  {
    title: 'Игроки',
    href: '/players',
  },
  {
    title: 'Тренировки',
    href: '/performance',
  },
  {
    title: 'Посещение',
    href: '/participation',
  },
  {
    title: 'Игры',
    href: '/games',
  },
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
