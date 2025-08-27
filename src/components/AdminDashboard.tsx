import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { 
  Users, 
  Calendar, 
  FileText, 
  Settings, 
  LogOut,
  CheckCircle,
  XCircle,
  Clock,
  Plus
} from "lucide-react";
import CreateEventModal from "@/components/CreateEventModal";
import Navigation from "@/components/Navigation";

interface MemberApplication {
  id: string;
  full_name: string;
  email: string;
  motivation: string;
  experience: string;
  skills: string[];
  status: string;
  created_at: string;
  user_id: string;
}

interface Profile {
  id: string;
  email: string;
  full_name: string;
  role: string;
  status: string;
  created_at: string;
}

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

const AdminDashboard = () => {
  const { profile, signOut } = useAuth();
  const { toast } = useToast();
  const [applications, setApplications] = useState<MemberApplication[]>([]);
  const [members, setMembers] = useState<Profile[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateEvent, setShowCreateEvent] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Fetch member applications
      const { data: applicationsData } = await supabase
        .from('member_applications')
        .select('*')
        .order('created_at', { ascending: false });

      // Fetch all members
      const { data: membersData } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      // Fetch events
      const { data: eventsData } = await supabase
        .from('events')
        .select('*')
        .order('event_date', { ascending: true });

      setApplications(applicationsData || []);
      setMembers(membersData || []);
      setEvents(eventsData || []);
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

  const handleApplicationReview = async (applicationId: string, status: 'approved' | 'rejected', userId: string) => {
    try {
      // Update application status
      const { error: appError } = await supabase
        .from('member_applications')
        .update({ 
          status, 
          reviewed_at: new Date().toISOString(),
          reviewed_by: profile?.id 
        })
        .eq('id', applicationId);

      if (appError) throw appError;

      // Update user profile status
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ status })
        .eq('id', userId);

      if (profileError) throw profileError;

      toast({
        title: "Success",
        description: `Application ${status} successfully`,
      });

      fetchData();
    } catch (error) {
      console.error('Error updating application:', error);
      toast({
        title: "Error",
        description: "Failed to update application",
        variant: "destructive",
      });
    }
  };

  const handleRemoveMember = async (userId: string) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ status: 'rejected' })
        .eq('id', userId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Member removed successfully",
      });

      fetchData();
    } catch (error) {
      console.error('Error removing member:', error);
      toast({
        title: "Error",
        description: "Failed to remove member",
        variant: "destructive",
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
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
                Admin Dashboard
              </h1>
              <p className="text-muted-foreground">
                Welcome back, {profile?.full_name || profile?.email}
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
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="p-6 glass-card">
              <div className="flex items-center space-x-3">
                <Users className="h-8 w-8 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Total Members</p>
                  <p className="text-2xl font-bold">{members.filter(m => m.status === 'approved').length}</p>
                </div>
              </div>
            </Card>
            
            <Card className="p-6 glass-card">
              <div className="flex items-center space-x-3">
                <Clock className="h-8 w-8 text-yellow-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Pending Applications</p>
                  <p className="text-2xl font-bold">{applications.filter(a => a.status === 'pending').length}</p>
                </div>
              </div>
            </Card>
            
            <Card className="p-6 glass-card">
              <div className="flex items-center space-x-3">
                <Calendar className="h-8 w-8 text-secondary" />
                <div>
                  <p className="text-sm text-muted-foreground">Upcoming Events</p>
                  <p className="text-2xl font-bold">{events.filter(e => e.status === 'upcoming').length}</p>
                </div>
              </div>
            </Card>
            
            <Card className="p-6 glass-card">
              <div className="flex items-center space-x-3">
                <FileText className="h-8 w-8 text-accent" />
                <div>
                  <p className="text-sm text-muted-foreground">Total Events</p>
                  <p className="text-2xl font-bold">{events.length}</p>
                </div>
              </div>
            </Card>
          </div>

          <Tabs defaultValue="applications" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="applications">Applications</TabsTrigger>
              <TabsTrigger value="members">Members</TabsTrigger>
              <TabsTrigger value="events">Events</TabsTrigger>
            </TabsList>

            <TabsContent value="applications" className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Member Applications</h2>
              </div>
              
              <div className="grid gap-4">
                {applications.map((application) => (
                  <Card key={application.id} className="p-6 glass-card">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="font-semibold text-lg">{application.full_name}</h3>
                        <p className="text-muted-foreground">{application.email}</p>
                        <Badge className={getStatusColor(application.status)}>
                          {application.status}
                        </Badge>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {new Date(application.created_at).toLocaleDateString()}
                      </div>
                    </div>
                    
                    <div className="space-y-3 mb-4">
                      <div>
                        <p className="text-sm font-medium mb-1">Motivation:</p>
                        <p className="text-sm text-muted-foreground">{application.motivation}</p>
                      </div>
                      
                      {application.experience && (
                        <div>
                          <p className="text-sm font-medium mb-1">Experience:</p>
                          <p className="text-sm text-muted-foreground">{application.experience}</p>
                        </div>
                      )}
                      
                      {application.skills && application.skills.length > 0 && (
                        <div>
                          <p className="text-sm font-medium mb-1">Skills:</p>
                          <div className="flex flex-wrap gap-1">
                            {application.skills.map((skill) => (
                              <Badge key={skill} variant="secondary" className="text-xs">
                                {skill}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                    
                    {application.status === 'pending' && (
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          onClick={() => handleApplicationReview(application.id, 'approved', application.user_id)}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleApplicationReview(application.id, 'rejected', application.user_id)}
                        >
                          <XCircle className="h-4 w-4 mr-1" />
                          Reject
                        </Button>
                      </div>
                    )}
                  </Card>
                ))}
                
                {applications.length === 0 && (
                  <Card className="p-8 glass-card text-center">
                    <p className="text-muted-foreground">No applications found</p>
                  </Card>
                )}
              </div>
            </TabsContent>

            <TabsContent value="members" className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Club Members</h2>
              </div>
              
              <div className="grid gap-4">
                {members.filter(member => member.status === 'approved').map((member) => (
                  <Card key={member.id} className="p-6 glass-card">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-semibold text-lg">{member.full_name || 'No name'}</h3>
                        <p className="text-muted-foreground">{member.email}</p>
                        <div className="flex space-x-2 mt-2">
                          <Badge variant={member.role === 'admin' ? 'default' : 'secondary'}>
                            {member.role}
                          </Badge>
                          <Badge className={getStatusColor(member.status)}>
                            {member.status}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <p className="text-sm text-muted-foreground">
                          Joined: {new Date(member.created_at).toLocaleDateString()}
                        </p>
                        {member.role !== 'admin' && (
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleRemoveMember(member.id)}
                          >
                            Remove
                          </Button>
                        )}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="events" className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Events Management</h2>
                <Button onClick={() => setShowCreateEvent(true)} className="glow-button">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Event
                </Button>
              </div>
              
              <div className="grid gap-4">
                {events.map((event) => (
                  <Card key={event.id} className="p-6 glass-card">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-lg">{event.title}</h3>
                        <p className="text-muted-foreground mb-2">{event.description}</p>
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                          <span>📅 {new Date(event.event_date).toLocaleDateString()}</span>
                          {event.location && <span>📍 {event.location}</span>}
                          <span>👥 {event.current_participants}/{event.max_participants || '∞'}</span>
                        </div>
                      </div>
                      <Badge className={getStatusColor(event.status)}>
                        {event.status}
                      </Badge>
                    </div>
                  </Card>
                ))}
                
                {events.length === 0 && (
                  <Card className="p-8 glass-card text-center">
                    <p className="text-muted-foreground">No events found</p>
                  </Card>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <CreateEventModal 
        open={showCreateEvent} 
        onClose={() => setShowCreateEvent(false)}
        onEventCreated={fetchData}
      />
    </>
  );
};

export default AdminDashboard;