import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import AdminDashboard from "@/components/AdminDashboard";
import MemberDashboard from "@/components/MemberDashboard";
import { Card } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

const Dashboard = () => {
  const { user, profile, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="p-8 glass-card text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading your dashboard...</p>
        </Card>
      </div>
    );
  }

  if (!user || !profile) {
    return null;
  }

  if (profile.status === 'pending') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="p-8 glass-card text-center max-w-md">
          <h2 className="text-2xl font-bold mb-4 text-foreground">
            Application Pending
          </h2>
          <p className="text-muted-foreground mb-6">
            Your membership application is currently being reviewed by our admins. 
            You'll receive an email notification once it's been processed.
          </p>
          <p className="text-sm text-muted-foreground">
            Thank you for your patience!
          </p>
        </Card>
      </div>
    );
  }

  if (profile.status === 'rejected') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="p-8 glass-card text-center max-w-md">
          <h2 className="text-2xl font-bold mb-4 text-foreground">
            Application Not Approved
          </h2>
          <p className="text-muted-foreground mb-6">
            Unfortunately, your membership application was not approved at this time. 
            If you have questions, please contact our administrators.
          </p>
        </Card>
      </div>
    );
  }

  return profile.role === 'admin' ? <AdminDashboard /> : <MemberDashboard />;
};

export default Dashboard;