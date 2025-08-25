import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, Code, Users, Shield, Eye } from "lucide-react";

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { name: "Home", href: "#home" },
    { name: "About", href: "#about" },
    { name: "Gallery", href: "#gallery" },
    { name: "Admins", href: "#admins" },
    { name: "Contact", href: "#contact" },
  ];

  const panels = [
    { name: "Admin Panel", icon: Shield, variant: "admin" as const },
    { name: "Member Panel", icon: Users, variant: "member" as const },
    { name: "Visitor Panel", icon: Eye, variant: "visitor" as const },
  ];

  return (
    <nav className="fixed top-0 w-full z-50 glass-card border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <Code className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold gradient-text">CodeClub</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {navItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="text-muted-foreground hover:text-primary px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  {item.name}
                </a>
              ))}
            </div>
          </div>

          {/* Panel Buttons */}
          <div className="hidden lg:flex items-center space-x-2">
            {panels.map((panel) => (
              <Button
                key={panel.name}
                variant="outline"
                size="sm"
                className="text-xs glow-button"
              >
                <panel.icon className="h-3 w-3 mr-1" />
                {panel.name}
              </Button>
            ))}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden glass-card border-t">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="text-muted-foreground hover:text-primary block px-3 py-2 rounded-md text-base font-medium transition-colors"
                onClick={() => setIsOpen(false)}
              >
                {item.name}
              </a>
            ))}
            <div className="pt-4 space-y-2">
              {panels.map((panel) => (
                <Button
                  key={panel.name}
                  variant="outline"
                  size="sm"
                  className="w-full justify-start"
                >
                  <panel.icon className="h-4 w-4 mr-2" />
                  {panel.name}
                </Button>
              ))}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navigation;