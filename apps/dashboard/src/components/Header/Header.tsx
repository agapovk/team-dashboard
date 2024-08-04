import { ModeToggle } from '../Theme/ModeToggle';
import { MainNav } from './MainNav';
import TeamSwitcher from './TeamSwitcher';
import { UserNav } from './UserNav';

export default function Header() {
  return (
    <div className="border-b">
      <div className="flex h-16 items-center px-4">
        <TeamSwitcher />
        <MainNav className="mx-6" />
        <div className="ml-auto flex items-center space-x-4">
          {/* <Search /> */}
          <ModeToggle />
          <UserNav />
        </div>
      </div>
    </div>
  );
}
