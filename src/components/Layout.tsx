import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { BottomNav } from "./BottomNav";
import { SearchDialog } from "./SearchDialog";
import { Bell, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-gradient-to-br from-background via-background to-muted">
        <AppSidebar />

        <div className="flex-1 flex flex-col w-full">
          {/* Top Header */}
          <header className="h-16 border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-40 flex items-center px-4 gap-4">
            <SidebarTrigger className="shrink-0 hidden md:block" />

            {/* Search Bar */}
            <div className="flex-1 max-w-md hidden sm:block">
              <button
                onClick={() => setSearchOpen(true)}
                className="relative w-full h-10 px-3 py-2 text-sm text-left text-muted-foreground bg-background border border-input rounded-md hover:bg-accent transition-colors"
              >
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" />
                <span className="pl-6">Search questions, insights...</span>
                <kbd className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100">
                  <span className="text-xs">⌘</span>K
                </kbd>
              </button>
            </div>

            <SearchDialog open={searchOpen} onOpenChange={setSearchOpen} />

            {/* Right Actions */}
            <div className="ml-auto flex items-center gap-2">
              <Button variant="ghost" size="icon" className="relative" aria-label="Notifications">
                <Bell className="h-5 w-5" />
                <span className="absolute top-1 right-1 h-2 w-2 bg-accent rounded-full" />
              </Button>

              <div className="h-9 w-9 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-primary-foreground font-semibold text-sm shadow-md">
                JD
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 overflow-auto pb-16 md:pb-0">
            {children}
          </main>
          
          <BottomNav />
        </div>
      </div>
    </SidebarProvider>
  );
}
