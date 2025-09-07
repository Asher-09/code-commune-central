import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Calendar, Trophy, Code } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { supabase } from "@/integrations/supabase/client";

interface Stat {
  id: string;
  stat_name: string;
  stat_value: number;
  updated_at: string;
}

interface CountState {
  [key: string]: number;
}

const getIconComponent = (iconName?: string) => {
  switch (iconName) {
    case 'calendar':
      return Calendar;
    case 'trophy':
      return Trophy;
    case 'code':
      return Code;
    default:
      return Calendar;
  }
};

const StatsCounter = () => {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.3 });
  const [stats, setStats] = useState<Stat[]>([]);
  const [counts, setCounts] = useState<CountState>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data, error } = await supabase
          .from('stats')
          .select('*')
          .order('stat_name', { ascending: true });

        if (error) {
          throw error;
        }

        setStats(data || []);
        
        // Initialize counts to 0
        const initialCounts: CountState = {};
        data?.forEach((stat) => {
          initialCounts[stat.id] = 0;
        });
        setCounts(initialCounts);
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  useEffect(() => {
    if (isVisible && stats.length > 0) {
      const duration = 2000; // 2 seconds
      const steps = 60;
      const stepTime = duration / steps;

      stats.forEach((stat) => {
        const finalValue = stat.stat_value;
        const increment = finalValue / steps;
        let currentStep = 0;

        const interval = setInterval(() => {
          currentStep++;
          const currentValue = Math.min(Math.floor(increment * currentStep), finalValue);
          
          setCounts(prev => ({
            ...prev,
            [stat.id]: currentValue
          }));

          if (currentStep >= steps) {
            clearInterval(interval);
          }
        }, stepTime);

        return () => clearInterval(interval);
      });
    }
  }, [isVisible, stats]);

  return (
    <section ref={ref} className="py-20 px-4 bg-muted/30">
      <div className="max-w-7xl mx-auto">
        <div className={`text-center mb-12 scroll-reveal ${isVisible ? 'visible' : ''}`}>
          <h2 className="text-3xl md:text-4xl font-bold mb-4 gradient-text">
            Our Growing Community
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Join hundreds of passionate developers, supportive faculty, and dedicated admins
            working together to shape the future of technology.
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="p-8 text-center glass-card animate-pulse">
                <div className="w-16 h-16 bg-gray-300 rounded-full mx-auto mb-4"></div>
                <div className="h-12 bg-gray-300 rounded mb-2"></div>
                <div className="h-6 bg-gray-300 rounded mb-2"></div>
                <div className="w-16 h-1 bg-gray-300 rounded mx-auto"></div>
              </Card>
            ))}
          </div>
        ) : (
          <div className={`grid grid-cols-1 md:grid-cols-3 gap-8 stagger-children ${isVisible ? 'visible' : ''}`}>
            {stats.map((stat) => {
              const Icon = getIconComponent(stat.stat_name);
              
              return (
                <Card
                  key={stat.id}
                  className="p-8 text-center glass-card hover:scale-105 transition-all duration-300"
                >
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse-glow">
                    <Icon className="h-8 w-8 text-primary" />
                  </div>
                  
                  <div className="text-5xl font-bold mb-2 text-primary font-mono">
                    {counts[stat.id] || 0}
                    {stat.stat_name.includes('events') && '+'}
                  </div>
                  
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    {stat.stat_name.charAt(0).toUpperCase() + stat.stat_name.slice(1)}
                  </h3>
                  
                  <div className="w-16 h-1 bg-gradient-to-r from-primary via-secondary to-accent mx-auto rounded-full" />
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default StatsCounter;