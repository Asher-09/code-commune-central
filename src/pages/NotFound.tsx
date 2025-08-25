import { Button } from "@/components/ui/button";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Home, AlertTriangle } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background cyber-grid">
      <div className="text-center max-w-md mx-auto px-4">
        <div className="mb-8 animate-float">
          <AlertTriangle className="h-24 w-24 mx-auto text-accent animate-pulse-glow" />
        </div>
        
        <h1 className="text-6xl font-bold mb-4 gradient-text">404</h1>
        <h2 className="text-2xl font-semibold mb-4 text-foreground">Page Not Found</h2>
        <p className="text-muted-foreground mb-8 leading-relaxed">
          Looks like you've ventured into uncharted digital territory. 
          The page you're looking for doesn't exist in our codebase.
        </p>
        
        <Button 
          asChild
          className="glow-button"
        >
          <a href="/" className="inline-flex items-center space-x-2">
            <Home className="h-4 w-4" />
            <span>Return to Home</span>
          </a>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
