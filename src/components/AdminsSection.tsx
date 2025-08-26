import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Github, Linkedin, Mail, Star } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface Admin {
  id: string;
  name: string;
  role: string;
  avatar_url?: string;
  expertise: string[];
  description?: string;
  achievements: string[];
  social_links: any; // Using any to handle Json type from Supabase
}

const AdminsSection = () => {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.2 });
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        const { data, error } = await supabase
          .from('admins')
          .select('*')
          .eq('is_active', true)
          .order('display_order', { ascending: true });

        if (error) {
          throw error;
        }

        setAdmins(data || []);
      } catch (error) {
        console.error('Error fetching admins:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAdmins();
  }, []);

  return (
    <section ref={ref} id="admins" className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className={`text-center mb-16 scroll-reveal ${isVisible ? 'visible' : ''}`}>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 gradient-text">
            Meet Our Admins
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Our dedicated leadership team brings together diverse expertise and passion 
            for technology to guide and inspire the club community.
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i} className="p-8 glass-card animate-pulse">
                <div className="flex items-start space-x-6">
                  <div className="w-20 h-20 bg-gray-300 rounded-full"></div>
                  <div className="flex-1">
                    <div className="h-6 bg-gray-300 rounded mb-2"></div>
                    <div className="h-4 bg-gray-300 rounded mb-3 w-1/2"></div>
                    <div className="h-4 bg-gray-300 rounded mb-4"></div>
                    <div className="flex gap-2 mb-4">
                      <div className="h-6 bg-gray-300 rounded w-16"></div>
                      <div className="h-6 bg-gray-300 rounded w-20"></div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className={`grid grid-cols-1 lg:grid-cols-2 gap-8 stagger-children ${isVisible ? 'visible' : ''}`}>
            {admins.map((admin) => (
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
                      {admin.social_links.github && (
                        <Button variant="outline" size="sm" className="p-2">
                          <Github className="h-4 w-4" />
                        </Button>
                      )}
                      {admin.social_links.linkedin && (
                        <Button variant="outline" size="sm" className="p-2">
                          <Linkedin className="h-4 w-4" />
                        </Button>
                      )}
                      <Button variant="outline" size="sm" className="p-2">
                        <Mail className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Call to Action */}
        <div className={`text-center mt-16 scroll-reveal ${isVisible ? 'visible' : ''}`}>
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