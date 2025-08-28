import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { UserPlus, X } from "lucide-react";

interface JoinClubModalProps {
  trigger?: React.ReactNode;
}

const JoinClubModal = ({ trigger }: JoinClubModalProps) => {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    email: "",
    fullName: "",
    motivation: "",
    experience: "",
    skills: "",
    githubUsername: "",
    linkedinUsername: ""
  });

  const [skillsList, setSkillsList] = useState<string[]>([]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSkillAdd = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && formData.skills.trim()) {
      e.preventDefault();
      if (!skillsList.includes(formData.skills.trim())) {
        setSkillsList([...skillsList, formData.skills.trim()]);
        setFormData({ ...formData, skills: "" });
      }
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setSkillsList(skillsList.filter(skill => skill !== skillToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { data, error } = await supabase.rpc('submit_club_application', {
        applicant_email: formData.email,
        applicant_name: formData.fullName,
        motivation_text: formData.motivation,
        experience_text: formData.experience || null,
        skills_list: skillsList.length > 0 ? skillsList : null,
        github_user: formData.githubUsername || null,
        linkedin_user: formData.linkedinUsername || null
      });

      if (error) throw error;

      const result = data as { success: boolean; message: string };

      if (result.success) {
        toast({
          title: "Application Submitted!",
          description: result.message,
        });
        
        // Reset form
        setFormData({
          email: "",
          fullName: "",
          motivation: "",
          experience: "",
          skills: "",
          githubUsername: "",
          linkedinUsername: ""
        });
        setSkillsList([]);
        setOpen(false);
      } else {
        toast({
          title: "Application Error",
          description: result.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Application submission error:', error);
      toast({
        title: "Error",
        description: "Failed to submit application. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const defaultTrigger = (
    <Button className="glow-button">
      <UserPlus className="h-4 w-4 mr-2" />
      Join Our Club
    </Button>
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || defaultTrigger}
      </DialogTrigger>
      
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl gradient-text">
            Join CodeClub
          </DialogTitle>
        </DialogHeader>

        <Card className="p-6 glass-card">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="your.email@example.com"
                  required
                  className="bg-background/50 border-border/50 focus:border-primary"
                />
              </div>
              
              <div>
                <Label htmlFor="fullName">Full Name *</Label>
                <Input
                  id="fullName"
                  name="fullName"
                  type="text"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  placeholder="Your full name"
                  required
                  className="bg-background/50 border-border/50 focus:border-primary"
                />
              </div>
            </div>

            {/* Motivation */}
            <div>
              <Label htmlFor="motivation">Why do you want to join CodeClub? *</Label>
              <Textarea
                id="motivation"
                name="motivation"
                value={formData.motivation}
                onChange={handleInputChange}
                placeholder="Tell us about your motivation to join our community..."
                rows={3}
                required
                className="bg-background/50 border-border/50 focus:border-primary resize-none"
              />
            </div>

            {/* Experience */}
            <div>
              <Label htmlFor="experience">Programming Experience (Optional)</Label>
              <Textarea
                id="experience"
                name="experience"
                value={formData.experience}
                onChange={handleInputChange}
                placeholder="Describe your programming background, projects you've worked on, etc."
                rows={3}
                className="bg-background/50 border-border/50 focus:border-primary resize-none"
              />
            </div>

            {/* Skills */}
            <div>
              <Label htmlFor="skills">Technical Skills</Label>
              <Input
                id="skills"
                name="skills"
                type="text"
                value={formData.skills}
                onChange={handleInputChange}
                onKeyDown={handleSkillAdd}
                placeholder="Type a skill and press Enter (e.g., JavaScript, Python, React)"
                className="bg-background/50 border-border/50 focus:border-primary"
              />
              
              {skillsList.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {skillsList.map((skill) => (
                    <Badge key={skill} variant="secondary" className="text-xs">
                      {skill}
                      <button
                        type="button"
                        onClick={() => removeSkill(skill)}
                        className="ml-1 hover:text-red-500"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            {/* Social Links */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="githubUsername">GitHub Username</Label>
                <Input
                  id="githubUsername"
                  name="githubUsername"
                  type="text"
                  value={formData.githubUsername}
                  onChange={handleInputChange}
                  placeholder="your-github-username"
                  className="bg-background/50 border-border/50 focus:border-primary"
                />
              </div>
              
              <div>
                <Label htmlFor="linkedinUsername">LinkedIn Username</Label>
                <Input
                  id="linkedinUsername"
                  name="linkedinUsername"
                  type="text"
                  value={formData.linkedinUsername}
                  onChange={handleInputChange}
                  placeholder="your-linkedin-username"
                  className="bg-background/50 border-border/50 focus:border-primary"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="glow-button"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Submitting..." : "Submit Application"}
              </Button>
            </div>
          </form>
        </Card>
      </DialogContent>
    </Dialog>
  );
};

export default JoinClubModal;