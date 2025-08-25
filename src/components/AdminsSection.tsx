import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Github, Linkedin, Mail, Star } from "lucide-react";

const AdminsSection = () => {
  const admins = [
    {
      id: 1,
      name: "Alex Rodriguez",
      role: "Club President",
      expertise: ["Full Stack Development", "AI/ML", "Cloud Computing"],
      description: "Leading the club with passion for innovation and mentoring aspiring developers. Expert in modern web technologies and machine learning applications.",
      achievements: ["Google Summer of Code", "Microsoft MVP", "ACM ICPC Finalist"],
      social: {
        github: "alex-dev",
        linkedin: "alex-rodriguez-dev",
        email: "alex@codeclub.com",
      },
    },
    {
      id: 2,
      name: "Sarah Chen",
      role: "Vice President",
      expertise: ["Mobile Development", "UI/UX Design", "DevOps"],
      description: "Passionate about creating beautiful user experiences and efficient development workflows. Specializes in React Native and Flutter development.",
      achievements: ["Google Developer Expert", "Hackathon Winner", "Open Source Contributor"],
      social: {
        github: "sarahc-dev",
        linkedin: "sarah-chen-dev",
        email: "sarah@codeclub.com",
      },
    },
    {
      id: 3,
      name: "David Kim",
      role: "Technical Lead",
      expertise: ["Backend Development", "Microservices", "Database Design"],
      description: "Architect of scalable systems and mentor for backend development. Leads technical workshops and system design sessions.",
      achievements: ["AWS Certified", "Tech Conference Speaker", "Startup CTO Experience"],
      social: {
        github: "david-backend",
        linkedin: "david-kim-tech",
        email: "david@codeclub.com",
      },
    },
    {
      id: 4,
      name: "Emily Watson",
      role: "Events Coordinator",
      expertise: ["Project Management", "Community Building", "Content Creation"],
      description: "Orchestrates amazing events and builds strong community connections. Expert in bringing people together for learning and collaboration.",
      achievements: ["Event Management Certified", "Community Leader Award", "Public Speaker"],
      social: {
        github: "emily-events",
        linkedin: "emily-watson-pm",
        email: "emily@codeclub.com",
      },
    },
  ];

  return (
    <section id="admins" className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 gradient-text">
            Meet Our Admins
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Our dedicated leadership team brings together diverse expertise and passion 
            for technology to guide and inspire the club community.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {admins.map((admin, index) => (
            <Card
              key={admin.id}
              className="p-8 glass-card hover:scale-105 transition-all duration-300 group"
            >
              <div className="flex items-start space-x-6">
                {/* Avatar */}
                <div className="w-20 h-20 bg-gradient-to-br from-primary via-secondary to-accent rounded-full flex items-center justify-center text-2xl font-bold text-background group-hover:animate-pulse-glow">
                  {admin.name.split(' ').map(n => n[0]).join('')}
                </div>

                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-2xl font-bold text-foreground">
                      {admin.name}
                    </h3>
                    <Star className="h-5 w-5 text-accent" />
                  </div>
                  
                  <p className="text-primary font-semibold mb-3">{admin.role}</p>
                  
                  <p className="text-muted-foreground text-sm mb-4 leading-relaxed">
                    {admin.description}
                  </p>

                  {/* Expertise Tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {admin.expertise.map((skill) => (
                      <Badge key={skill} variant="secondary" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                  </div>

                  {/* Achievements */}
                  <div className="mb-4">
                    <h4 className="font-semibold text-sm text-foreground mb-2">Key Achievements:</h4>
                    <ul className="space-y-1">
                      {admin.achievements.map((achievement) => (
                        <li key={achievement} className="text-xs text-muted-foreground flex items-center">
                          <div className="w-1 h-1 bg-primary rounded-full mr-2" />
                          {achievement}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Social Links */}
                  <div className="flex space-x-3">
                    <Button variant="outline" size="sm" className="p-2">
                      <Github className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" className="p-2">
                      <Linkedin className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" className="p-2">
                      <Mail className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <Card className="p-8 glass-card max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold mb-4 gradient-text">
              Want to Join the Leadership Team?
            </h3>
            <p className="text-muted-foreground mb-6">
              We're always looking for passionate individuals to help lead our community. 
              Apply for leadership positions and make a difference!
            </p>
            <Button className="glow-button">
              Apply for Leadership
            </Button>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default AdminsSection;