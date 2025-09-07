import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { 
  Calendar, 
  User, 
  LogOut,
  MapPin,
  Clock,
  Users,
  UserPlus,
  UserMinus
} from "lucide-react";
import Navigation from "@/components/Navigation";

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

interface EventRegistration {
  event_id: string;
}

const MemberDashboard = () => {
  const { profile, signOut, updateProfile } = useAuth();
  const { toast } = useToast();
  const [events, setEvents] = useState<Event[]>([]);
  const [registrations, setRegistrations] = useState<EventRegistration[]>([]);
  const [loading, setLoading] = useState(true);
  const [profileForm, setProfileForm] = useState({
    full_name: profile?.full_name || '',
    bio: profile?.bio || '',
    skills: profile?.skills?.join(', ') || '',
    github_username: profile?.github_username || '',
    linkedin_username: profile?.linkedin_username || ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (profile) {
      setProfileForm({
        full_name: profile.full_name || '',
        bio: profile.bio || '',
        skills: profile.skills?.join(', ') || '',
        github_username: profile.github_username || '',
        linkedin_username: profile.linkedin_username || ''
      });
    }
  }, [profile]);

  const fetchData = async () => {
    try {
      // Fetch events
      const { data: eventsData } = await supabase
        .from('events')
        .select('*')
        .eq('status', 'upcoming')
        .order('event_date', { ascending: true });

      // Fetch user's registrations
      const { data: registrationsData } = await supabase
        .from('event_registrations')
        .select('event_id')
        .eq('user_id', profile?.id);

      setEvents(eventsData || []);
      setRegistrations(registrationsData || []);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        title: "Error",
        description: "Failed to load dashboard data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const updates = {
      full_name: profileForm.full_name,
      bio: profileForm.bio,
      skills: profileForm.skills.split(',').map(s => s.trim()).filter(s => s),
      github_username: profileForm.github_username,
      linkedin_username: profileForm.linkedin_username
    };

    const { error } = await updateProfile(updates);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Profile updated successfully",
      });
    }
  };

  const handleEventRegistration = async (eventId: string, isRegistered: boolean) => {
    try {
      if (isRegistered) {
        // Unregister
        const { error } = await supabase
          .from('event_registrations')
          .delete()
          .eq('event_id', eventId)
          .eq('user_id', profile?.id);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Unregistered from event",
        });
      } else {
        // Register
        const { error } = await supabase
          .from('event_registrations')
          .insert({
            event_id: eventId,
            user_id: profile?.id
          });

        if (error) throw error;

        toast({
          title: "Success",
          description: "Registered for event successfully",
        });
      }

      fetchData();
    } catch (error) {
      console.error('Error with registration:', error);
      toast({
        title: "Error",
        description: "Failed to update registration",
        variant: "destructive",
      });
    }
  };

  const isRegisteredForEvent = (eventId: string) => {
    return registrations.some(reg => reg.event_id === eventId);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="p-8 glass-card">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-300 rounded w-3/4"></div>
            <div className="h-4 bg-gray-300 rounded w-1/2"></div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-background pt-20">
        <div className="max-w-7xl mx-auto p-6">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold gradient-text">
                Member Dashboard
              </h1>
              <p className="text-muted-foreground">
                Welcome back, {profile?.full_name}
              </p>
            </div>
            <Button
              variant="outline"
              onClick={() => signOut()}
              className="border-red-500 text-red-500 hover:bg-red-50"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="p-6 glass-card">
              <div className="flex items-center space-x-3">
                <Calendar className="h-8 w-8 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Upcoming Events</p>
                  <p className="text-2xl font-bold">{events.length}</p>
                </div>
              </div>
            </Card>
            
            <Card className="p-6 glass-card">
              <div className="flex items-center space-x-3">
                <UserPlus className="h-8 w-8 text-secondary" />
                <div>
                  <p className="text-sm text-muted-foreground">Registered Events</p>
                  <p className="text-2xl font-bold">{registrations.length}</p>
                </div>
              </div>
            </Card>
            
            <Card className="p-6 glass-card">
              <div className="flex items-center space-x-3">
                <User className="h-8 w-8 text-accent" />
                <div>
                  <p className="text-sm text-muted-foreground">Member Status</p>
                  <Badge className="bg-green-100 text-green-800">
                    {profile?.status}
                  </Badge>
                </div>
              </div>
            </Card>
          </div>

          <Tabs defaultValue="events" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="events">Events</TabsTrigger>
              <TabsTrigger value="profile">Profile</TabsTrigger>
            </TabsList>

            <TabsContent value="events" className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Upcoming Events</h2>
              </div>
              
              <div className="grid gap-4">
                {events.map((event) => {
                  const isRegistered = isRegisteredForEvent(event.id);
                  const isFull = event.max_participants && event.current_participants >= event.max_participants;
                  
                  return (
                    <Card key={event.id} className="p-6 glass-card">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="font-semibold text-lg">{event.title}</h3>
                          <p className="text-muted-foreground mb-3">{event.description}</p>
                          
                          <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-3">
                            <div className="flex items-center">
                              <Clock className="h-4 w-4 mr-1" />
                              {new Date(event.event_date).toLocaleDateString()} at{' '}
                              {new Date(event.event_date).toLocaleTimeString()}
                            </div>
                            {event.location && (
                              <div className="flex items-center">
                                <MapPin className="h-4 w-4 mr-1" />
                                {event.location}
                              </div>
                            )}
                            <div className="flex items-center">
                              <Users className="h-4 w-4 mr-1" />
                              {event.current_participants}/{event.max_participants || '∞'}
                            </div>
                          </div>
                        </div>
                        <Badge className="bg-blue-100 text-blue-800">
                          {event.status}
                        </Badge>
                      </div>
                      
                      <div className="flex justify-end">
                        {isRegistered ? (
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleEventRegistration(event.id, true)}
                          >
                            <UserMinus className="h-4 w-4 mr-2" />
                            Unregister
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            onClick={() => handleEventRegistration(event.id, false)}
                            disabled={isFull}
                            className="glow-button"
                          >
                            <UserPlus className="h-4 w-4 mr-2" />
                            {isFull ? 'Event Full' : 'Register'}
                          </Button>
                        )}
                      </div>
                    </Card>
                  );
                })}
                
                {events.length === 0 && (
                  <Card className="p-8 glass-card text-center">
                    <p className="text-muted-foreground">No upcoming events</p>
                  </Card>
                )}
              </div>
            </TabsContent>

            <TabsContent value="profile" className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">My Profile</h2>
              </div>
              
              <Card className="p-6 glass-card">
                <form onSubmit={handleProfileUpdate} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="full_name">Full Name</Label>
                      <Input
                        id="full_name"
                        value={profileForm.full_name}
                        onChange={(e) => setProfileForm({...profileForm, full_name: e.target.value})}
                        placeholder="Your full name"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="skills">Skills (comma-separated)</Label>
                      <Input
                        id="skills"
                        value={profileForm.skills}
                        onChange={(e) => setProfileForm({...profileForm, skills: e.target.value})}
                        placeholder="JavaScript, React, Python..."
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      value={profileForm.bio}
                      onChange={(e) => setProfileForm({...profileForm, bio: e.target.value})}
                      placeholder="Tell us about yourself..."
                      rows={3}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="github_username">GitHub Username</Label>
                      <Input
                        id="github_username"
                        value={profileForm.github_username}
                        onChange={(e) => setProfileForm({...profileForm, github_username: e.target.value})}
                        placeholder="your-github-username"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="linkedin_username">LinkedIn Username</Label>
                      <Input
                        id="linkedin_username"
                        value={profileForm.linkedin_username}
                        onChange={(e) => setProfileForm({...profileForm, linkedin_username: e.target.value})}
                        placeholder="your-linkedin-username"
                      />
                    </div>
                  </div>
                  
                  <Button type="submit" className="glow-button">
                    Update Profile
                  </Button>
                </form>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
};

export default MemberDashboard;