import { Code, Heart, Github, Linkedin, Twitter, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [email, setEmail] = useState("");
  const [isSubscribing, setIsSubscribing] = useState(false);
  const { toast } = useToast();

  const footerLinks = {
    club: [
      { name: "About Us", href: "#about" },
      { name: "Gallery", href: "#gallery" },
      { name: "Admins", href: "#admins" },
      { name: "Contact", href: "#contact" },
    ],
    resources: [
      { name: "Coding Challenges", href: "#" },
      { name: "Project Ideas", href: "#" },
      { name: "Learning Materials", href: "#" },
      { name: "Workshop Notes", href: "#" },
    ],
    community: [
      { name: "Discord Server", href: "#" },
      { name: "GitHub Org", href: "#" },
      { name: "Alumni Network", href: "#" },
      { name: "Mentorship", href: "#" },
    ],
  };

  const socialLinks = [
    { icon: Github, href: "#", label: "GitHub" },
    { icon: Linkedin, href: "#", label: "LinkedIn" },
    { icon: Twitter, href: "#", label: "Twitter" },
    { icon: Mail, href: "#", label: "Email" },
  ];

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubscribing(true);
    
    try {
      const { error } = await supabase
        .from('newsletter_subscriptions')
        .insert([{ email }]);

      if (error) {
        if (error.code === '23505') {
          toast({
            title: "Already subscribed!",
            description: "This email is already subscribed to our newsletter.",
            variant: "destructive",
          });
        } else {
          throw error;
        }
      } else {
        toast({
          title: "Success!",
          description: "You've been subscribed to our newsletter!",
        });
        setEmail("");
      }
    } catch (error) {
      console.error('Newsletter subscription error:', error);
      toast({
        title: "Error",
        description: "Failed to subscribe to newsletter. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubscribing(false);
    }
  };

  return (
    <footer className="bg-card border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <Code className="h-8 w-8 text-primary" />
              <span className="text-xl font-bold gradient-text">CodeClub</span>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed mb-4">
              Empowering the next generation of developers through collaboration, 
              learning, and innovation in the world of technology.
            </p>
            <div className="flex space-x-3">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <Button
                    key={social.label}
                    variant="outline"
                    size="sm"
                    className="p-2 hover:scale-110 transition-transform duration-200"
                    aria-label={social.label}
                  >
                    <Icon className="h-4 w-4" />
                  </Button>
                );
              })}
            </div>
          </div>

          {/* Links Sections */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Club</h3>
            <ul className="space-y-2">
              {footerLinks.club.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-muted-foreground hover:text-primary transition-colors text-sm"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-foreground mb-4">Resources</h3>
            <ul className="space-y-2">
              {footerLinks.resources.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-muted-foreground hover:text-primary transition-colors text-sm"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-foreground mb-4">Community</h3>
            <ul className="space-y-2">
              {footerLinks.community.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-muted-foreground hover:text-primary transition-colors text-sm"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Newsletter Signup */}
        <div className="border-t border-border pt-8 mb-8">
          <div className="max-w-md mx-auto text-center">
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Stay Updated
            </h3>
            <p className="text-muted-foreground text-sm mb-4">
              Get notified about upcoming events, workshops, and competitions.
            </p>
            <form onSubmit={handleNewsletterSubmit} className="flex space-x-2">
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="flex-1 bg-background border-border focus:border-primary"
              />
              <Button 
                type="submit" 
                size="sm" 
                className="px-4"
                disabled={isSubscribing}
              >
                {isSubscribing ? "..." : "Subscribe"}
              </Button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-border pt-6 flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-1 text-sm text-muted-foreground">
            <span>© {currentYear} CodeClub. Made with</span>
            <Heart className="h-4 w-4 text-red-500" />
            <span>by our amazing team.</span>
          </div>
          
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              Terms of Service
            </a>
            <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              Code of Conduct
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;