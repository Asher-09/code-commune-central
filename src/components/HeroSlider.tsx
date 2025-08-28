import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Play, Users, Award } from "lucide-react";
import heroImage from "@/assets/hero-image.jpg";
import JoinClubModal from "@/components/JoinClubModal";

const HeroSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      title: "Welcome to CodeClub",
      subtitle: "Where Innovation Meets Collaboration",
      description: "Join our vibrant community of developers, designers, and tech enthusiasts pushing the boundaries of technology.",
      cta: "Join Our Community",
      icon: Users,
    },
    {
      title: "Learn. Build. Excel.",
      subtitle: "Master the Latest Technologies",
      description: "From web development to AI/ML, participate in workshops, hackathons, and coding competitions.",
      cta: "Explore Events",
      icon: Play,
    },
    {
      title: "Achieve Excellence",
      subtitle: "Recognition & Growth",
      description: "Showcase your skills, win competitions, and build a portfolio that stands out in the industry.",
      cta: "View Achievements",
      icon: Award,
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 cyber-grid">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
          style={{ backgroundImage: `url(${heroImage})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-background/80 via-background/60 to-background/80" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="animate-slide-up">
          {slides.map((slide, index) => {
            const Icon = slide.icon;
            return (
              <div
                key={index}
                className={`transition-all duration-1000 ${
                  index === currentSlide
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 absolute inset-0 translate-y-8"
                }`}
              >
                <div className="mb-6 animate-float">
                  <Icon className="h-16 w-16 mx-auto text-primary animate-pulse-glow" />
                </div>
                
                <h1 className="text-5xl md:text-7xl font-bold mb-4 gradient-text">
                  {slide.title}
                </h1>
                
                <h2 className="text-2xl md:text-3xl font-semibold text-secondary mb-6">
                  {slide.subtitle}
                </h2>
                
                <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
                  {slide.description}
                </p>
                
                {index === 0 ? (
                  <JoinClubModal 
                    trigger={
                      <Button size="lg" className="glow-button text-lg px-8 py-3">
                        {slide.cta}
                      </Button>
                    }
                  />
                ) : (
                  <Button size="lg" className="glow-button text-lg px-8 py-3">
                    {slide.cta}
                  </Button>
                )}
              </div>
            );
          })}
        </div>

        {/* Navigation Dots */}
        <div className="flex justify-center space-x-2 mt-12">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentSlide
                  ? "bg-primary shadow-glow"
                  : "bg-muted hover:bg-primary/50"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Navigation Arrows */}
      <Button
        variant="ghost"
        size="icon"
        onClick={prevSlide}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 z-20 hover:bg-primary/20"
      >
        <ChevronLeft className="h-8 w-8" />
      </Button>
      
      <Button
        variant="ghost"
        size="icon"
        onClick={nextSlide}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 z-20 hover:bg-primary/20"
      >
        <ChevronRight className="h-8 w-8" />
      </Button>
    </section>
  );
};

export default HeroSlider;