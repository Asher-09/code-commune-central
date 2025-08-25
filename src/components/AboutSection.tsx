import { Card } from "@/components/ui/card";
import { Code2, Lightbulb, Trophy, Rocket } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const AboutSection = () => {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.2 });
  const features = [
    {
      icon: Code2,
      title: "Learn & Code",
      description: "Master programming languages, frameworks, and tools through hands-on workshops and peer learning sessions.",
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      icon: Lightbulb,
      title: "Innovation Hub",
      description: "Transform ideas into reality with access to cutting-edge technology and mentorship from industry experts.",
      color: "text-accent",
      bgColor: "bg-accent/10",
    },
    {
      icon: Trophy,
      title: "Competitions",
      description: "Participate in hackathons, coding contests, and tech challenges to showcase your skills and win exciting prizes.",
      color: "text-secondary",
      bgColor: "bg-secondary/10",
    },
    {
      icon: Rocket,
      title: "Career Growth",
      description: "Build your portfolio, network with professionals, and land internships and job opportunities in top tech companies.",
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
  ];

  return (
    <section ref={ref} id="about" className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className={`text-center mb-16 scroll-reveal ${isVisible ? 'visible' : ''}`}>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 gradient-text">
            About CodeClub
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
            We are a dynamic community of tech enthusiasts, developers, and innovators dedicated to 
            fostering learning, collaboration, and excellence in the field of Information Technology. 
            Our club serves as a bridge between academic knowledge and real-world application.
          </p>
        </div>

        <div className={`grid grid-cols-1 md:grid-cols-2 gap-8 mb-16 stagger-children ${isVisible ? 'visible' : ''}`}>
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card
                key={feature.title}
                className="p-8 glass-card hover:scale-105 transition-all duration-300 group"
              >
                <div className="flex items-start space-x-4">
                  <div
                    className={`w-12 h-12 ${feature.bgColor} rounded-lg flex items-center justify-center group-hover:animate-pulse-glow`}
                  >
                    <Icon className={`h-6 w-6 ${feature.color}`} />
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold mb-3 text-foreground">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Mission Statement */}
        <Card className={`p-12 glass-card text-center scroll-reveal ${isVisible ? 'visible' : ''}`}>
          <h3 className="text-2xl md:text-3xl font-bold mb-6 gradient-text">
            Our Mission
          </h3>
          <p className="text-lg text-muted-foreground max-w-4xl mx-auto leading-relaxed">
            To create an inclusive environment where students can explore technology, develop practical skills, 
            collaborate on innovative projects, and prepare for successful careers in the ever-evolving IT industry. 
            We believe in learning by doing, sharing knowledge, and building lasting connections that extend beyond 
            the classroom.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">5+</div>
              <div className="text-sm text-muted-foreground">Years Active</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-secondary mb-2">50+</div>
              <div className="text-sm text-muted-foreground">Events Organized</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-accent mb-2">100+</div>
              <div className="text-sm text-muted-foreground">Projects Completed</div>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
};

export default AboutSection;