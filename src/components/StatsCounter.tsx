import { useState, useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Shield, Users, GraduationCap } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const StatsCounter = () => {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.3 });
  const [counts, setCounts] = useState({ admins: 0, members: 0, teachers: 0 });

  const targetCounts = {
    admins: 8,
    members: 156,
    teachers: 12,
  };

  const stats = [
    {
      icon: Shield,
      label: "Active Admins",
      count: counts.admins,
      color: "text-accent",
      bgColor: "bg-accent/10",
    },
    {
      icon: Users,
      label: "Club Members",
      count: counts.members,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      icon: GraduationCap,
      label: "Faculty Mentors",
      count: counts.teachers,
      color: "text-secondary",
      bgColor: "bg-secondary/10",
    },
  ];

  useEffect(() => {
    if (!isVisible) return;

    const duration = 2000; // 2 seconds
    const steps = 60;
    const stepDuration = duration / steps;

    const incrementCounts = () => {
      const increment = (current: number, target: number, step: number) => {
        return Math.min(target, Math.floor((target / steps) * (step + 1)));
      };

      let step = 0;
      const timer = setInterval(() => {
        setCounts({
          admins: increment(0, targetCounts.admins, step),
          members: increment(0, targetCounts.members, step),
          teachers: increment(0, targetCounts.teachers, step),
        });

        step++;
        if (step >= steps) {
          clearInterval(timer);
          setCounts(targetCounts);
        }
      }, stepDuration);

      return () => clearInterval(timer);
    };

    const cleanup = incrementCounts();
    return cleanup;
  }, [isVisible]);

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

        <div className={`grid grid-cols-1 md:grid-cols-3 gap-8 stagger-children ${isVisible ? 'visible' : ''}`}>
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card
                key={stat.label}
                className="p-8 text-center glass-card hover:scale-105 transition-all duration-300"
              >
                <div
                  className={`w-16 h-16 ${stat.bgColor} rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse-glow`}
                >
                  <Icon className={`h-8 w-8 ${stat.color}`} />
                </div>
                
                <div className={`text-5xl font-bold mb-2 ${stat.color} font-mono`}>
                  {stat.count.toLocaleString()}
                </div>
                
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  {stat.label}
                </h3>
                
                <div className="w-16 h-1 bg-gradient-to-r from-primary via-secondary to-accent mx-auto rounded-full" />
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default StatsCounter;