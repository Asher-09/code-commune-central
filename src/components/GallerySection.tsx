import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X, ZoomIn } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import gallery1 from "@/assets/gallery-1.jpg";
import gallery2 from "@/assets/gallery-2.jpg";
import gallery3 from "@/assets/gallery-3.jpg";

const GallerySection = () => {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.2 });
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const galleryItems = [
    {
      id: 1,
      image: gallery1,
      title: "Collaborative Coding Sessions",
      description: "Weekly coding sessions where members work together on exciting projects and share knowledge.",
      category: "Workshop",
    },
    {
      id: 2,
      image: gallery2,
      title: "Hackathon 2024",
      description: "Our annual 48-hour hackathon bringing together the brightest minds to solve real-world problems.",
      category: "Competition",
    },
    {
      id: 3,
      image: gallery3,
      title: "Tech Workshops",
      description: "Expert-led workshops covering the latest technologies and industry best practices.",
      category: "Learning",
    },
    {
      id: 4,
      image: gallery1,
      title: "Project Showcases",
      description: "Quarterly events where members demonstrate their innovative projects and achievements.",
      category: "Event",
    },
    {
      id: 5,
      image: gallery2,
      title: "Industry Meetups",
      description: "Networking sessions with industry professionals and alumni sharing career insights.",
      category: "Networking",
    },
    {
      id: 6,
      image: gallery3,
      title: "Study Groups",
      description: "Peer-to-peer learning sessions focused on exam preparation and concept reinforcement.",
      category: "Study",
    },
  ];

  return (
    <section ref={ref} id="gallery" className="py-20 px-4 bg-muted/20">
      <div className="max-w-7xl mx-auto">
        <div className={`text-center mb-16 scroll-reveal ${isVisible ? 'visible' : ''}`}>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 gradient-text">
            Club Gallery
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Explore moments from our workshops, hackathons, competitions, and community events 
            that showcase the vibrant spirit of our IT club.
          </p>
        </div>

        <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 stagger-children ${isVisible ? 'visible' : ''}`}>
          {galleryItems.map((item) => (
            <Card
              key={item.id}
              className="group overflow-hidden glass-card hover:scale-105 transition-all duration-300 cursor-pointer"
              onClick={() => setSelectedImage(item.image)}
            >
              <div className="relative overflow-hidden">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <ZoomIn className="h-6 w-6 text-white" />
                </div>
                <div className="absolute bottom-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="bg-primary text-primary-foreground px-2 py-1 rounded text-xs font-medium">
                    {item.category}
                  </span>
                </div>
              </div>
              
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2 text-foreground">
                  {item.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {item.description}
                </p>
              </div>
            </Card>
          ))}
        </div>

        {/* Modal for enlarged image */}
        {selectedImage && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="relative max-w-4xl max-h-[90vh]">
              <img
                src={selectedImage}
                alt="Enlarged gallery item"
                className="w-full h-auto object-contain rounded-lg"
              />
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSelectedImage(null)}
                className="absolute top-4 right-4 text-white hover:bg-white/20"
              >
                <X className="h-6 w-6" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default GallerySection;