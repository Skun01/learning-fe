import { Link, useLocation } from "react-router";
import { GraduationCap, Home, Layers, LogOut } from "lucide-react";
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
  { title: "Trang chủ", icon: Home, to: "/dashboard" },
  { title: "Các thẻ của tôi", icon: Layers, to: "/dashboard/decks" },
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
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <GraduationCap className="h-4.5 w-4.5" />
        </div>
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
              <LogOut className="h-4 w-4" />
              <span>Đăng xuất</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
