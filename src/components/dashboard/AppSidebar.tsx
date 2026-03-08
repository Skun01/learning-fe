import { Link, useLocation } from "react-router";
import { House, Stack, SignOut } from "@phosphor-icons/react";
import { AppLogo } from "@/components/illustrations/AppLogo";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { useAuthStore } from "@/stores/authStore";

const NAV_ITEMS = [
  { title: "Trang chủ", icon: House, to: "/dashboard" },
  { title: "Các thẻ của tôi", icon: Stack, to: "/dashboard/decks" },
];

function SidebarLogo() {
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

  return (
    <SidebarHeader className="h-14 px-3 border-b border-border flex items-center">
      <Link
        to="/dashboard"
        className={`flex items-center rounded-lg hover:bg-secondary/60 transition-colors duration-200 ${
          isCollapsed ? "justify-center p-2" : "gap-3 px-2 py-1.5"
        }`}
      >
        <AppLogo className="h-8 w-8 shrink-0 rounded-lg" />
        {!isCollapsed && (
          <span className="text-base font-semibold text-foreground truncate">
            LearningApp
          </span>
        )}
      </Link>
    </SidebarHeader>
  );
}

export function AppSidebar() {
  const location = useLocation();
  const logout = useAuthStore((s) => s.logout);

  return (
    <Sidebar collapsible="icon">
      <SidebarLogo />

      {/* Navigation */}
      <SidebarContent className="pt-2">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {NAV_ITEMS.map((item) => (
                <SidebarMenuItem key={item.to}>
                  <SidebarMenuButton
                    asChild
                    isActive={location.pathname === item.to}
                    tooltip={item.title}
                  >
                    <Link to={item.to}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Footer — logout */}
      <SidebarFooter className="p-2">
        <Separator className="mb-2 mx-1 w-auto" />
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              tooltip="Đăng xuất"
              onClick={() => logout()}
              className="text-destructive hover:text-destructive"
            >
              <SignOut className="h-4 w-4" />
              <span>Đăng xuất</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
