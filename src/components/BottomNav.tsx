import { Home, BarChart3, Gift, User } from "lucide-react";
import { NavLink } from "react-router-dom";

const navItems = [
  { title: "Home", url: "/", icon: Home },
  { title: "Analytics", url: "/analytics", icon: BarChart3 },
  { title: "Rewards", url: "/rewards", icon: Gift },
  { title: "Profile", url: "/profile", icon: User },
];

export function BottomNav() {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border backdrop-blur-sm">
      <div className="flex items-center justify-around h-16 px-2">
        {navItems.map((item) => (
          <NavLink
            key={item.title}
            to={item.url}
            end
            className={({ isActive }) =>
              `flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-lg transition-all ${
                isActive
                  ? "text-primary font-medium"
                  : "text-muted-foreground hover:text-foreground"
              }`
            }
          >
            <item.icon className="h-5 w-5" />
            <span className="text-xs">{item.title}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
