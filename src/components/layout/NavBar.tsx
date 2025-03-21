
import { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { motion } from 'framer-motion';
import { LayoutPanelLeft, FileText, MessageSquare, Bell, Menu, X } from "lucide-react";
import { useIsMobile } from '@/hooks/use-mobile';

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

  // Detect active route for animations
  const getRouteIndex = (path: string): number => {
    switch (path) {
      case '/encore': return 0;
      case '/endocs': return 1;
      case '/ensights': return 2;
      default: return -1;
    }
  };

  const activeIndex = getRouteIndex(location.pathname);

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

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-4 md:px-8",
        isScrolled 
          ? "bg-white/80 dark:bg-gray-900/80 backdrop-blur-md py-2 shadow-sm" 
          : "bg-transparent py-4"
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

        {/* Desktop Navigation */}
        {!isMobile && (
          <nav className="flex items-center space-x-1">
            {[
              { path: '/encore', label: 'EnCore', icon: <MessageSquare className="w-4 h-4 mr-2" /> },
              { path: '/endocs', label: 'EnDocs', icon: <FileText className="w-4 h-4 mr-2" /> },
              { path: '/ensights', label: 'EnSights', icon: <LayoutPanelLeft className="w-4 h-4 mr-2" /> },
            ].map((item, i) => (
              <motion.div
                key={item.path}
                custom={i}
                initial="initial"
                animate="animate"
                variants={navLinkAnimation}
              >
                <NavLink
                  to={item.path}
                  className={({ isActive }) => cn(
                    "nav-link flex items-center",
                    isActive ? "nav-link-active" : "nav-link-inactive"
                  )}
                >
                  {item.icon}
                  {item.label}
                </NavLink>
              </motion.div>
            ))}
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

          <div className="flex items-center">
            <Avatar className="w-8 h-8 border border-border">
              <AvatarFallback className="bg-primary/10 text-primary text-sm">
                J
              </AvatarFallback>
            </Avatar>
            {!isMobile && (
              <span className="ml-2 text-sm font-medium">
                My Account
              </span>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          {isMobile && (
            <button
              className="p-2 ml-2 rounded-full bg-gray-100 dark:bg-gray-800 transition-colors hover:bg-gray-200 dark:hover:bg-gray-700"
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

      {/* Mobile Menu */}
      {isMobile && (
        <motion.div
          className={cn(
            "fixed top-16 right-0 bottom-0 w-3/4 bg-white dark:bg-gray-900 shadow-xl z-50 p-6",
            "border-l border-border flex flex-col"
          )}
          initial="closed"
          animate={mobileMenuOpen ? "open" : "closed"}
          variants={mobileMenuAnimation}
        >
          <nav className="flex flex-col space-y-4">
            {[
              { path: '/encore', label: 'EnCore', icon: <MessageSquare className="w-5 h-5 mr-3" /> },
              { path: '/endocs', label: 'EnDocs', icon: <FileText className="w-5 h-5 mr-3" /> },
              { path: '/ensights', label: 'EnSights', icon: <LayoutPanelLeft className="w-5 h-5 mr-3" /> },
            ].map((item, i) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) => cn(
                  "py-2 px-4 rounded-lg flex items-center transition-colors",
                  isActive 
                    ? "bg-primary/10 text-primary font-medium" 
                    : "text-muted-foreground hover:bg-gray-100 dark:hover:bg-gray-800"
                )}
              >
                {item.icon}
                {item.label}
              </NavLink>
            ))}
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
