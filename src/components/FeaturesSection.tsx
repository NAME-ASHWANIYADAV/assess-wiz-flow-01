import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Brain, 
  BarChart3, 
  Users, 
  Zap, 
  Target, 
  Shield, 
  Clock, 
  Award,
  ArrowRight 
} from "lucide-react";
import { Button } from "@/components/ui/button";

const FeaturesSection = () => {
  const features = [
    {
      icon: Brain,
      title: "AI-Powered Question Generation",
      description: "Automatically create diverse, contextual questions that adapt to learning objectives and difficulty levels.",
      color: "text-purple-500"
    },
    {
      icon: BarChart3,
      title: "Real-Time Analytics",
      description: "Get instant insights into learner performance, progress tracking, and detailed assessment analytics.",
      color: "text-blue-500"
    },
    {
      icon: Target,
      title: "Adaptive Assessment",
      description: "Questions dynamically adjust based on learner responses, providing personalized learning paths.",
      color: "text-green-500"
    },
    {
      icon: Zap,
      title: "Instant Feedback",
      description: "Provide immediate, detailed feedback to learners with explanations and improvement suggestions.",
      color: "text-yellow-500"
    },
    {
      icon: Users,
      title: "Collaborative Learning",
      description: "Enable group assessments, peer reviews, and team-based learning experiences.",
      color: "text-pink-500"
    },
    {
      icon: Shield,
      title: "Advanced Security",
      description: "Enterprise-grade security with encrypted data, secure access controls, and privacy compliance.",
      color: "text-red-500"
    },
    {
      icon: Clock,
      title: "Time Management",
      description: "Smart scheduling, automated reminders, and flexible timing options for all assessment types.",
      color: "text-indigo-500"
    },
    {
      icon: Award,
      title: "Gamification",
      description: "Boost engagement with badges, leaderboards, achievements, and interactive learning rewards.",
      color: "text-orange-500"
    }
  ];

  return (
    <section id="features" className="py-20 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 animate-slide-up">
          <h2 className="text-3xl sm:text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-4">
            Powerful Features for Modern Learning
          </h2>
          <p className="text-lg text-muted-foreground">
            Discover how our AI-driven platform revolutionizes assessments with intelligent features 
            designed for educators, learners, and organizations.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-16">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <Card 
                key={index} 
                className="group hover-lift hover:shadow-primary/10 border-0 shadow-card bg-card/50 backdrop-blur-sm animate-fade-in"
                style={{animationDelay: `${index * 0.1}s`}}
              >
                <CardHeader className="text-center pb-3">
                  <div className={`w-12 h-12 mx-auto rounded-lg bg-gradient-primary/10 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                    <IconComponent className={`w-6 h-6 ${feature.color}`} />
                  </div>
                  <CardTitle className="text-lg font-semibold group-hover:text-primary transition-colors">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-sm leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* CTA Section */}
        <div className="text-center animate-fade-in">
          <div className="bg-gradient-secondary rounded-2xl p-8 md:p-12">
            <h3 className="text-2xl md:text-3xl font-bold mb-4">
              Ready to Transform Your Assessments?
            </h3>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Join thousands of educators and organizations who trust Assess AI Wizard 
              to deliver exceptional learning experiences.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="gradient" size="lg" className="group">
                Start Your Free Trial
                <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
              </Button>
              <Button variant="outline" size="lg">
                Schedule a Demo
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;