import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, Monitor, Smartphone, Users, Brain, BarChart3, Award } from "lucide-react";

const DemoSection = () => {
  const [activeDemo, setActiveDemo] = useState('assessment');

  const demoFeatures = [
    {
      id: 'assessment',
      title: 'AI Assessment Builder',
      icon: Brain,
      description: 'See how our AI creates personalized assessments in seconds',
      preview: 'Interactive assessment creation with real-time question generation'
    },
    {
      id: 'analytics', 
      title: 'Real-time Analytics',
      icon: BarChart3,
      description: 'Explore detailed insights and performance tracking',
      preview: 'Live dashboard showing learner progress and engagement metrics'
    },
    {
      id: 'gamification',
      title: 'Gamification Engine',
      icon: Award,
      description: 'Experience our engaging reward and achievement system',
      preview: 'Interactive leaderboards, badges, and progress tracking'
    }
  ];

  const testimonialVideos = [
    { name: 'Sarah Chen', role: 'Education Director', company: 'TechEdu', thumbnail: '👩‍🏫' },
    { name: 'Michael Rodriguez', role: 'Training Manager', company: 'GlobalCorp', thumbnail: '👨‍💼' },
    { name: 'Dr. Emily Watson', role: 'Professor', company: 'State University', thumbnail: '👩‍🔬' }
  ];

  return (
    <section id="demo" className="py-20 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 animate-slide-up">
          <h2 className="text-3xl sm:text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-4">
            See It in Action
          </h2>
          <p className="text-lg text-muted-foreground">
            Explore our platform with interactive demos and real user success stories
          </p>
        </div>

        {/* Demo Selection */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            {demoFeatures.map((feature) => {
              const IconComponent = feature.icon;
              return (
                <Button
                  key={feature.id}
                  variant={activeDemo === feature.id ? "gradient" : "outline"}
                  size="lg"
                  onClick={() => setActiveDemo(feature.id)}
                  className="flex items-center gap-2 animate-fade-in"
                >
                  <IconComponent className="w-4 h-4" />
                  {feature.title}
                </Button>
              );
            })}
          </div>

          {/* Active Demo Display */}
          <Card className="hover-lift shadow-card animate-fade-in bg-card/80 backdrop-blur-sm">
            <CardContent className="p-8">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <h3 className="text-2xl font-bold mb-4">
                    {demoFeatures.find(f => f.id === activeDemo)?.title}
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    {demoFeatures.find(f => f.id === activeDemo)?.description}
                  </p>
                  <div className="space-y-4 mb-6">
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                      <p className="text-sm">
                        {demoFeatures.find(f => f.id === activeDemo)?.preview}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <Button variant="gradient" size="lg" className="group">
                      <Play className="w-4 h-4 mr-2" />
                      Start Interactive Demo
                    </Button>
                    <Button variant="outline" size="lg">
                      Schedule Live Demo
                    </Button>
                  </div>
                </div>
                
                <div className="relative">
                  <div className="aspect-video bg-gradient-primary/10 rounded-xl flex items-center justify-center border-2 border-dashed border-primary/30">
                    <div className="text-center">
                      <Monitor className="w-16 h-16 text-primary/50 mx-auto mb-4" />
                      <p className="text-muted-foreground">Interactive Demo Preview</p>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="mt-2"
                      >
                        <Play className="w-4 h-4 mr-1" />
                        Play Demo
                      </Button>
                    </div>
                  </div>
                  
                  {/* Device Frame Decorations */}
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-secondary/20 rounded-full flex items-center justify-center">
                    <Smartphone className="w-4 h-4 text-secondary" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Customer Success Videos */}
        <div className="max-w-5xl mx-auto">
          <h3 className="text-2xl font-bold text-center mb-8">Customer Success Stories</h3>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonialVideos.map((video, index) => (
              <Card 
                key={index} 
                className="group cursor-pointer hover-lift animate-fade-in bg-card/50 backdrop-blur-sm"
                style={{animationDelay: `${index * 0.1}s`}}
              >
                <CardContent className="p-6 text-center">
                  <div className="relative mb-4">
                    <div className="w-24 h-16 bg-gradient-secondary/20 rounded-lg mx-auto flex items-center justify-center mb-3">
                      <div className="text-2xl">{video.thumbnail}</div>
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="w-12 h-12 bg-primary/90 rounded-full flex items-center justify-center">
                        <Play className="w-6 h-6 text-white ml-1" />
                      </div>
                    </div>
                  </div>
                  <h4 className="font-semibold text-foreground mb-1">{video.name}</h4>
                  <p className="text-sm text-muted-foreground mb-1">{video.role}</p>
                  <p className="text-xs text-muted-foreground">{video.company}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-12 animate-fade-in" style={{animationDelay: '0.6s'}}>
          <div className="bg-gradient-primary/5 rounded-2xl p-8 max-w-2xl mx-auto border border-primary/10">
            <Users className="w-12 h-12 text-primary mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-4">Ready to Transform Your Learning?</h3>
            <p className="text-muted-foreground mb-6">
              Join over 10,000+ educators and organizations already using Assess AI Wizard
            </p>
            <Button variant="gradient" size="lg" className="group">
              Start Your Free Trial Today
              <Play className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DemoSection;