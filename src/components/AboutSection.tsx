import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, Users, Globe, Lightbulb } from "lucide-react";

const AboutSection = () => {
  const stats = [
    { number: "500K+", label: "Assessments Created", icon: CheckCircle },
    { number: "50K+", label: "Active Educators", icon: Users },
    { number: "100+", label: "Countries Reached", icon: Globe },
    { number: "99.9%", label: "Platform Uptime", icon: Lightbulb },
  ];

  return (
    <section id="about" className="py-20 bg-gradient-secondary">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="animate-slide-up">
            <h2 className="text-3xl sm:text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-6">
              Revolutionizing Assessment with AI Innovation
            </h2>
            <div className="space-y-4 text-muted-foreground">
              <p className="text-lg leading-relaxed">
                At Assess AI Wizard, we believe that learning should be personalized, engaging, and data-driven. 
                Our mission is to empower educators with intelligent assessment tools that transform how knowledge is evaluated and skills are developed.
              </p>
              <p className="leading-relaxed">
                Founded by a team of education technology experts and AI researchers, we've built a platform 
                that combines cutting-edge artificial intelligence with proven pedagogical principles to create 
                assessments that truly adapt to each learner's needs.
              </p>
              <p className="leading-relaxed">
                From schools and universities to corporate training programs, our platform serves diverse 
                learning environments with tools that make assessment creation effortless and learning outcomes measurable.
              </p>
            </div>

            {/* Key Points */}
            <div className="mt-8 space-y-4">
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold">AI-Driven Personalization</h4>
                  <p className="text-sm text-muted-foreground">Adaptive algorithms that customize learning paths for each individual.</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold">Data-Powered Insights</h4>
                  <p className="text-sm text-muted-foreground">Advanced analytics that reveal learning patterns and improvement opportunities.</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold">Seamless Integration</h4>
                  <p className="text-sm text-muted-foreground">Works with your existing LMS and educational technology stack.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Stats */}
          <div className="animate-fade-in" style={{animationDelay: '0.3s'}}>
            <div className="grid grid-cols-2 gap-6">
              {stats.map((stat, index) => {
                const IconComponent = stat.icon;
                return (
                  <Card 
                    key={index} 
                    className="text-center hover-lift group border-0 shadow-card bg-card/80 backdrop-blur-sm animate-slide-up"
                    style={{animationDelay: `${(index + 1) * 0.1}s`}}
                  >
                    <CardContent className="pt-6">
                      <div className="w-12 h-12 mx-auto rounded-lg bg-gradient-primary flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <IconComponent className="w-6 h-6 text-white" />
                      </div>
                      <div className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-1">
                        {stat.number}
                      </div>
                      <div className="text-sm text-muted-foreground font-medium">
                        {stat.label}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Vision Statement */}
            <div className="mt-8 p-6 bg-card/60 backdrop-blur-sm rounded-xl border border-border/50">
              <h3 className="text-lg font-semibold mb-3 text-center">Our Vision</h3>
              <p className="text-muted-foreground text-center leading-relaxed">
                "To make personalized, intelligent assessment accessible to every educator and learner, 
                fostering a world where education adapts to individual needs and potential."
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;