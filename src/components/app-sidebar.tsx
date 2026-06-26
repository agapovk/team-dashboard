"use client";

import {
  CalendarIcon,
  GaugeIcon,
  LayoutDashboardIcon,
  type LucideIcon,
  Ratio,
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
} from "@/components/ui/sidebar";

interface NavItem {
  title: string;
  url: string;
  icon: LucideIcon;
}

// MVP-навигация (заглушки маршрутов). Расширяется по фазам ROADMAP.
const navItems: NavItem[] = [
  { title: "Dashboard", url: "/", icon: LayoutDashboardIcon },
  { title: "Trainings", url: "/trainings", icon: GaugeIcon },
  { title: "Players", url: "/players", icon: UsersIcon },
  { title: "Import", url: "/import", icon: UploadIcon },
  { title: "Calendar", url: "/calendar", icon: CalendarIcon },
];

export function AppSidebar(props: ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader className="h-12 justify-center py-0">
        <SidebarMenu>
          <SidebarMenuItem>
            <div className="flex items-center gap-2 px-2 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0">
              <Ratio className="size-4 shrink-0" />
              <span className="font-semibold text-lg group-data-[collapsible=icon]:hidden">
                team
              </span>
            </div>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Monitoring</SidebarGroupLabel>
          <SidebarMenu className="gap-1">
            {navItems.map((item) => (
              <SidebarMenuItem key={item.url}>
                <SidebarMenuButton
                  isActive={
                    item.url === "/"
                      ? pathname === "/"
                      : pathname.startsWith(item.url)
                  }
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
    </Sidebar>
  );
}
