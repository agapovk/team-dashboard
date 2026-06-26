"use client";

import {
  ActivityIcon,
  CalendarIcon,
  GaugeIcon,
  type LucideIcon,
  UploadIcon,
  UsersIcon,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ComponentProps } from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";

interface NavItem {
  title: string;
  url: string;
  icon: LucideIcon;
}

// MVP-навигация (заглушки маршрутов). Расширяется по фазам ROADMAP.
const navItems: NavItem[] = [
  { title: "Trainings", url: "/trainings", icon: GaugeIcon },
  { title: "Players", url: "/players", icon: UsersIcon },
  { title: "Import", url: "/import", icon: UploadIcon },
  { title: "Calendar", url: "/calendar", icon: CalendarIcon },
];

export function AppSidebar(props: ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton render={<Link href="/" />} size="lg">
              <ActivityIcon className="size-5" />
              <span className="font-semibold">Team Dashboard</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Monitoring</SidebarGroupLabel>
          <SidebarMenu>
            {navItems.map((item) => (
              <SidebarMenuItem key={item.url}>
                <SidebarMenuButton
                  isActive={pathname.startsWith(item.url)}
                  render={<Link href={item.url} />}
                  tooltip={item.title}
                >
                  <item.icon />
                  <span>{item.title}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
