
import { useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import { User, LogOut } from "lucide-react";
import { useIsMobile } from '@/hooks/use-mobile';

const NavBar = () => {
  const isMobile = useIsMobile();

  // Navigation items
  const navItems = [
    { 
      path: '/encore', 
      label: 'EnCore',
    },
    { 
      path: '/endocs', 
      label: 'EnDocs', 
    },
    { 
      path: '/ensights', 
      label: 'EnSights',
    },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 py-3">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <span className="text-2xl font-bold text-primary">enplify</span>
            <span className="text-sm text-muted-foreground">.ai</span>
          </Link>
          
          {/* Main Navigation */}
          {!isMobile && (
            <nav className="flex items-center justify-center flex-1 mx-8">
              <div className="flex items-center gap-8">
                {navItems.map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    className={({ isActive }) => cn(
                      "font-medium text-base transition-colors",
                      isActive 
                        ? "text-gray-900 dark:text-white" 
                        : "text-gray-500 hover:text-gray-900 dark:hover:text-white"
                    )}
                  >
                    {item.label}
                  </NavLink>
                ))}
              </div>
            </nav>
          )}

          {/* User Menu */}
          <div className="flex items-center">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full py-1 px-2 transition-colors">
                  <Avatar className="h-8 w-8 bg-gray-200">
                    <AvatarFallback className="text-primary">
                      J
                    </AvatarFallback>
                  </Avatar>
                  {!isMobile && (
                    <span className="text-sm font-medium">
                      My Account
                    </span>
                  )}
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem asChild>
                  <Link to="/profile" className="flex items-center">
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile Settings</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
      
      {/* Mobile Navigation */}
      {isMobile && (
        <div className="container mx-auto px-4 mt-3">
          <nav className="overflow-x-auto pb-2">
            <div className="flex items-center gap-6 min-w-max">
              {navItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) => cn(
                    "font-medium text-sm whitespace-nowrap transition-colors",
                    isActive 
                      ? "text-primary border-b-2 border-primary pb-1" 
                      : "text-gray-500 hover:text-primary"
                  )}
                >
                  {item.label}
                </NavLink>
              ))}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default NavBar;
