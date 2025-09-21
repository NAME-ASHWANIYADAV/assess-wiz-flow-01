import { Card, CardContent } from "@/components/ui/card";
import { Star, Quote } from "lucide-react";
import { useState, useEffect } from "react";

const TestimonialsSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const testimonials = [
    {
      name: "Dr. Sarah Mitchell",
      role: "Professor of Computer Science",
      institution: "Stanford University",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=64&h=64&fit=crop&crop=face",
      content: "Assess AI Wizard has completely transformed how I create and manage assessments. The AI-generated questions are incredibly relevant and the analytics help me understand my students' learning patterns like never before.",
      rating: 5
    },
    {
      name: "Marcus Thompson",
      role: "Learning & Development Manager",
      institution: "TechCorp Solutions",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=64&h=64&fit=crop&crop=face",
      content: "The adaptive assessment feature is a game-changer for our corporate training programs. We've seen a 40% improvement in completion rates and much better learning outcomes across all departments.",
      rating: 5
    },
    {
      name: "Elena Rodriguez",
      role: "High School Math Teacher",
      institution: "Lincoln High School",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=64&h=64&fit=crop&crop=face",
      content: "My students are more engaged than ever! The instant feedback and gamification elements make assessments feel less like tests and more like interactive learning experiences. Parent feedback has been overwhelmingly positive.",
      rating: 5
    },
    {
      name: "Dr. James Park",
      role: "Dean of Online Learning",
      institution: "Global Education Network",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=64&h=64&fit=crop&crop=face",
      content: "The platform's scalability is impressive. We're managing assessments for over 10,000 students across multiple programs, and the AI insights help us continuously improve our curriculum design.",
      rating: 5
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [testimonials.length]);

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 animate-slide-up">
          <h2 className="text-3xl sm:text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-4">
            Trusted by Educators Worldwide
          </h2>
          <p className="text-lg text-muted-foreground">
            Discover what educators and institutions are saying about their experience with Assess AI Wizard.
          </p>
        </div>

        {/* Main Testimonial Carousel */}
        <div className="max-w-4xl mx-auto mb-16">
          <Card className="border-0 shadow-card bg-gradient-secondary backdrop-blur-sm overflow-hidden animate-fade-in">
            <CardContent className="p-8 md:p-12">
              <div className="relative">
                <Quote className="absolute -top-2 -left-2 w-8 h-8 text-primary/20" />
                
                {/* Current Testimonial */}
                <div className="text-center space-y-6">
                  <div className="text-xl md:text-2xl font-medium leading-relaxed text-foreground">
                    "{testimonials[currentIndex].content}"
                  </div>
                  
                  {/* Rating */}
                  <div className="flex justify-center space-x-1">
                    {[...Array(testimonials[currentIndex].rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>

                  {/* Author */}
                  <div className="flex items-center justify-center space-x-4">
                    <img 
                      src={testimonials[currentIndex].avatar} 
                      alt={testimonials[currentIndex].name}
                      className="w-12 h-12 rounded-full object-cover shadow-lg"
                    />
                    <div className="text-left">
                      <div className="font-semibold text-foreground">{testimonials[currentIndex].name}</div>
                      <div className="text-sm text-muted-foreground">{testimonials[currentIndex].role}</div>
                      <div className="text-sm text-primary font-medium">{testimonials[currentIndex].institution}</div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Carousel Indicators */}
          <div className="flex justify-center space-x-2 mt-6">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentIndex 
                    ? 'bg-primary w-8' 
                    : 'bg-muted hover:bg-primary/50'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Testimonial Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.slice(0, 3).map((testimonial, index) => (
            <Card 
              key={index} 
              className="hover-lift border-0 shadow-card bg-card/50 backdrop-blur-sm animate-slide-up"
              style={{animationDelay: `${index * 0.1}s`}}
            >
              <CardContent className="p-6">
                <div className="flex items-center space-x-1 mb-3">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                  "{testimonial.content.substring(0, 120)}..."
                </p>
                <div className="flex items-center space-x-3">
                  <img 
                    src={testimonial.avatar} 
                    alt={testimonial.name}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <div>
                    <div className="text-sm font-medium">{testimonial.name}</div>
                    <div className="text-xs text-muted-foreground">{testimonial.role}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;