import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Users, Clock } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";

interface Event {
  id: string;
  title: string;
  description: string;
  event_date: string;
  location: string;
  status: string;
  current_participants: number;
  max_participants: number;
}

const EventsSection = () => {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.2 });
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('status', 'upcoming')
        .order('event_date', { ascending: true })
        .limit(6);

      if (error) {
        throw error;
      }

      setEvents(data || []);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleJoinEvent = () => {
    if (user) {
      navigate('/dashboard');
    } else {
      navigate('/auth');
    }
  };

  return (
    <section ref={ref} id="events" className="py-20 px-4 bg-muted/20">
      <div className="max-w-7xl mx-auto">
        <div className={`text-center mb-16 scroll-reveal ${isVisible ? 'visible' : ''}`}>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 gradient-text">
            Upcoming Events
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Join our exciting events, workshops, and networking sessions. 
            Connect with fellow developers and expand your skills.
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className="p-6 glass-card animate-pulse">
                <div className="h-6 bg-gray-300 rounded mb-4"></div>
                <div className="h-4 bg-gray-300 rounded mb-2"></div>
                <div className="h-4 bg-gray-300 rounded mb-4 w-3/4"></div>
                <div className="flex justify-between items-center">
                  <div className="h-4 bg-gray-300 rounded w-1/3"></div>
                  <div className="h-8 bg-gray-300 rounded w-20"></div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <>
            <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 stagger-children ${isVisible ? 'visible' : ''}`}>
              {events.map((event) => (
                <Card
                  key={event.id}
                  className="p-6 glass-card hover:scale-105 transition-all duration-300 group"
                >
                  <div className="flex justify-between items-start mb-4">
                    <Badge className="bg-primary/10 text-primary">
                      {event.status}
                    </Badge>
                    <Calendar className="h-5 w-5 text-primary" />
                  </div>

                  <h3 className="text-xl font-bold mb-3 text-foreground group-hover:text-primary transition-colors">
                    {event.title}
                  </h3>

                  <p className="text-muted-foreground text-sm mb-4 leading-relaxed line-clamp-3">
                    {event.description}
                  </p>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Clock className="h-4 w-4 mr-2 text-primary" />
                      {new Date(event.event_date).toLocaleDateString()} at{' '}
                      {new Date(event.event_date).toLocaleTimeString([], { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </div>
                    
                    {event.location && (
                      <div className="flex items-center text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4 mr-2 text-secondary" />
                        {event.location}
                      </div>
                    )}

                    <div className="flex items-center text-sm text-muted-foreground">
                      <Users className="h-4 w-4 mr-2 text-accent" />
                      {event.current_participants} / {event.max_participants || '∞'} participants
                    </div>
                  </div>

                  <Button 
                    onClick={handleJoinEvent}
                    className="w-full glow-button"
                    disabled={event.max_participants && event.current_participants >= event.max_participants}
                  >
                    {event.max_participants && event.current_participants >= event.max_participants 
                      ? 'Event Full' 
                      : user ? 'Join Event' : 'Sign Up to Join'
                    }
                  </Button>
                </Card>
              ))}
            </div>

            {events.length === 0 && (
              <Card className={`p-12 glass-card text-center scroll-reveal ${isVisible ? 'visible' : ''}`}>
                <Calendar className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2 text-foreground">
                  No Upcoming Events
                </h3>
                <p className="text-muted-foreground">
                  Check back soon for exciting upcoming events and workshops!
                </p>
              </Card>
            )}

            {events.length > 0 && (
              <div className={`text-center mt-12 scroll-reveal ${isVisible ? 'visible' : ''}`}>
                <Button 
                  onClick={handleJoinEvent}
                  className="glow-button"
                >
                  {user ? 'View All Events' : 'Join Club to See More'}
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
};

export default EventsSection;