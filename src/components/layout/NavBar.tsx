
import { useState, useEffect } from 'react';
import { NavLink, useLocation, Link } from 'react-router-dom';
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { motion } from 'framer-motion';
import {
  LayoutPanelLeft,
  FileText,
  MessageSquare,
  Bell,
  Menu,
  X,
  BarChart3,
  User,
  ChevronDown
} from "lucide-react";
import { useIsMobile } from '@/hooks/use-mobile';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';

const NavBar = () => {
  const location = useLocation();
  const isMobile = useIsMobile();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when location changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  // Animation variants
  const logoAnimation = {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
  };

  const navLinkAnimation = {
    initial: { opacity: 0, y: -10 },
    animate: (i: number) => ({
      opacity: 1, 
      y: 0, 
      transition: { 
        duration: 0.3, 
        delay: 0.1 + (i * 0.1), 
        ease: [0.16, 1, 0.3, 1] 
      }
    }),
  };

  const mobileMenuAnimation = {
    closed: { opacity: 0, x: '100%', transition: { duration: 0.3 } },
    open: { opacity: 1, x: 0, transition: { duration: 0.4 } },
  };

  // Nav items with better icons and descriptions
  const navItems = [
    { 
      path: '/encore', 
      label: 'EnCore', 
      icon: <MessageSquare className="w-5 h-5" />,
      description: 'General AI Assistant'
    },
    { 
      path: '/endocs', 
      label: 'EnDocs', 
      icon: <FileText className="w-5 h-5" />,
      description: 'Document Analysis'
    },
    { 
      path: '/ensights', 
      label: 'EnSights', 
      icon: <BarChart3 className="w-5 h-5" />,
      description: 'Data Visualization'
    },
  ];

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-4 md:px-8",
        isScrolled 
          ? "bg-white/80 dark:bg-gray-900/80 backdrop-blur-md py-2 shadow-sm" 
          : "bg-background/95 backdrop-blur-sm shadow-sm py-4"
      )}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <motion.div 
          className="flex items-center" 
          initial="initial" 
          animate="animate" 
          variants={logoAnimation}
        >
          <NavLink to="/" className="flex items-center">
            <span className="text-2xl font-bold text-gradient">enplify</span>
            <span className="text-sm text-muted-foreground">.ai</span>
          </NavLink>
        </motion.div>

        {/* Desktop Navigation - Enhanced for visibility */}
        {!isMobile && (
          <nav className="flex items-center space-x-2">
            <div className="px-4 py-2 bg-muted/60 rounded-full flex items-center gap-2 shadow-sm border border-border/40">
              {navItems.map((item, i) => (
                <motion.div
                  key={item.path}
                  custom={i}
                  initial="initial"
                  animate="animate"
                  variants={navLinkAnimation}
                >
                  <Tooltip delayDuration={300}>
                    <TooltipTrigger asChild>
                      <NavLink
                        to={item.path}
                        className={({ isActive }) => cn(
                          "flex items-center justify-center gap-2 px-4 py-2 rounded-full transition-colors text-sm font-medium",
                          isActive 
                            ? "bg-primary text-primary-foreground shadow-sm" 
                            : "hover:bg-muted text-foreground hover:text-primary"
                        )}
                      >
                        {item.icon}
                        <span>{item.label}</span>
                      </NavLink>
                    </TooltipTrigger>
                    <TooltipContent>{item.description}</TooltipContent>
                  </Tooltip>
                </motion.div>
              ))}
            </div>
          </nav>
        )}

        {/* User Menu */}
        <div className="flex items-center space-x-2">
          {!isMobile && (
            <button 
              className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 transition-colors hover:bg-gray-200 dark:hover:bg-gray-700"
              aria-label="Notifications"
            >
              <Bell className="w-4 h-4 text-muted-foreground" />
            </button>
          )}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="flex items-center cursor-pointer">
                <Avatar className="w-8 h-8 border border-border">
                  <AvatarFallback className="bg-primary/10 text-primary text-sm">
                    A
                  </AvatarFallback>
                </Avatar>
                {!isMobile && (
                  <div className="ml-2 flex items-center">
                    <span className="text-sm font-medium">
                      My Account
                    </span>
                    <ChevronDown className="ml-1 h-4 w-4 text-muted-foreground" />
                  </div>
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
                <Bell className="mr-2 h-4 w-4" />
                <span>Notifications</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Mobile Menu Toggle - Made more visible */}
          {isMobile && (
            <button
              className="p-2 ml-2 rounded-full bg-primary/10 text-primary transition-colors hover:bg-primary/20"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          )}
        </div>
      </div>

      {/* Mobile Menu - Enhanced for better visibility */}
      {isMobile && (
        <motion.div
          className={cn(
            "fixed top-16 right-0 bottom-0 w-3/4 bg-background shadow-xl z-50 p-6",
            "border-l border-border flex flex-col"
          )}
          initial="closed"
          animate={mobileMenuOpen ? "open" : "closed"}
          variants={mobileMenuAnimation}
        >
          <nav className="flex flex-col space-y-2">
            {navItems.map((item, i) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) => cn(
                  "py-3 px-4 rounded-lg flex items-center transition-colors",
                  isActive 
                    ? "bg-primary/10 text-primary font-medium" 
                    : "text-foreground hover:bg-muted"
                )}
              >
                {item.icon}
                <div className="ml-3">
                  <div className="font-medium">{item.label}</div>
                  <div className="text-xs text-muted-foreground">{item.description}</div>
                </div>
              </NavLink>
            ))}
            
            <NavLink
              to="/profile"
              className={({ isActive }) => cn(
                "py-3 px-4 rounded-lg flex items-center transition-colors",
                isActive 
                  ? "bg-primary/10 text-primary font-medium" 
                  : "text-foreground hover:bg-muted"
              )}
            >
              <User className="w-5 h-5" />
              <div className="ml-3">
                <div className="font-medium">Profile Settings</div>
                <div className="text-xs text-muted-foreground">Manage your account</div>
              </div>
            </NavLink>
          </nav>

          <div className="mt-auto pt-6 border-t border-border">
            <button 
              className="w-full py-2 px-4 rounded-lg flex items-center text-muted-foreground hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <Bell className="w-5 h-5 mr-3" />
              Notifications
            </button>
          </div>
        </motion.div>
      )}
    </header>
  );
};

export default NavBar;
