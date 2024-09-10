import { ModeToggle } from '../Theme/ModeToggle'
import { MainNav } from './MainNav'
import { MobileNav } from './MobileNav'
import { UserNav } from './UserNav'

export default function Header() {
  return (
    <div className="border-b">
      <div className="flex h-16 items-center px-4">
        <MainNav className="mx-6" />
        <MobileNav />
        <div className="ml-auto flex items-center space-x-4">
          <ModeToggle />
          <UserNav />
        </div>
      </div>
    </div>
  )
}
