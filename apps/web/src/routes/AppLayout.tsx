import { Outlet, NavLink, useNavigate } from "react-router-dom";
import {
  Gift,
  LayoutDashboard,
  Users,
  Tags,
  Settings,
  LogOut,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from "@/auth/AuthContext";

const navItems = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/contacts", label: "Contacts", icon: Users },
  { to: "/categories", label: "Categories", icon: Tags },
  { to: "/settings", label: "Settings", icon: Settings },
];

export function AppLayout() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="flex min-h-svh">
      <aside className="w-56 border-r bg-background flex flex-col">
        <div className="flex items-center gap-2 px-4 py-5 text-orange-500 font-semibold">
          <Gift className="h-5 w-5" />
          Birthday Tracker
        </div>
        <nav className="flex flex-col gap-1 px-2">
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === "/"}
              className={({ isActive }) =>
                `flex items-center gap-2 rounded-md px-3 py-2 text-sm ${
                  isActive
                    ? "bg-orange-50 text-orange-600 font-medium"
                    : "text-muted-foreground hover:bg-muted"
                }`
              }
            >
              <Icon className="h-4 w-4" />
              {label}
            </NavLink>
          ))}
        </nav>
      </aside>

      <div className="flex-1 flex flex-col">
        <header className="flex justify-end items-center gap-3 border-b px-6 py-3">
          <DropdownMenu>
            <DropdownMenuTrigger>
              <button>
                <Avatar className="h-8 w-8 cursor-pointer">
                  <AvatarFallback>U</AvatarFallback>
                </Avatar>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>

        <main className="flex-1 p-6 bg-muted/30">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
