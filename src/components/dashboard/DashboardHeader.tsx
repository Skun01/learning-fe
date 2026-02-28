import { MagnifyingGlass as Search, Bell } from "@phosphor-icons/react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";

export function DashboardHeader() {
  return (
    <header className="flex items-center gap-4 h-14 px-4 border-b border-border bg-background/80 backdrop-blur-sm sticky top-0 z-30">
      {/* Sidebar toggle */}
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="h-4" />

      {/* Search bar — center */}
      <div className="flex-1 max-w-md mx-auto hidden sm:block">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Tìm kiếm bộ thẻ, từ vựng..."
            className="pl-10 h-9 bg-secondary/50 border-border focus-visible:bg-background"
          />
        </div>
      </div>

      {/* Right — notification + user */}
      <div className="flex items-center gap-1.5 ml-auto">
        <Button variant="ghost" size="icon" className="sm:hidden h-9 w-9">
          <Search className="h-4 w-4" />
        </Button>

        <Button variant="ghost" size="icon" className="relative h-9 w-9">
          <Bell className="h-4 w-4" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-primary" />
        </Button>

        <Button variant="ghost" className="flex items-center gap-2 px-2 h-9">
          <Avatar className="h-7 w-7">
            <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
              TT
            </AvatarFallback>
          </Avatar>
          <span className="hidden md:inline text-sm font-medium text-foreground">
            Thái Trường
          </span>
        </Button>
      </div>
    </header>
  );
}
