import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle, Sparkles } from "lucide-react";

const CTASection = () => {
  const benefits = [
    "Start with a 14-day free trial",
    "No credit card required",
    "Setup in under 5 minutes",
    "Cancel anytime"
  ];

  return (
    <section className="py-20 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-hero"></div>
      
      {/* Animated Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-10 left-10 w-20 h-20 bg-white/5 rounded-full animate-float"></div>
        <div className="absolute top-20 right-20 w-32 h-32 bg-white/5 rounded-full animate-float" style={{animationDelay: '2s'}}></div>
        <div className="absolute bottom-10 left-1/4 w-16 h-16 bg-white/5 rounded-full animate-float" style={{animationDelay: '4s'}}></div>
        <div className="absolute bottom-20 right-1/3 w-24 h-24 bg-white/5 rounded-full animate-float" style={{animationDelay: '1s'}}></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-4xl mx-auto text-center animate-slide-up">
          {/* Badge */}
          <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 text-white border border-white/20 mb-6">
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-medium">Join 50,000+ Educators</span>
          </div>

          {/* Main Headline */}
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
            Ready to Transform Your
            <span className="block text-yellow-300">Assessment Experience?</span>
          </h2>

          {/* Subtitle */}
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto leading-relaxed">
            Join thousands of educators who have revolutionized their teaching with AI-powered assessments. 
            Start your journey to better learning outcomes today.
          </p>

          {/* Benefits */}
          <div className="flex flex-wrap justify-center gap-6 mb-10">
            {benefits.map((benefit, index) => (
              <div 
                key={index} 
                className="flex items-center space-x-2 text-white/90 animate-fade-in"
                style={{animationDelay: `${index * 0.1}s`}}
              >
                <CheckCircle className="w-5 h-5 text-green-400" />
                <span className="text-sm font-medium">{benefit}</span>
              </div>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Button 
              variant="glass" 
              size="lg" 
              className="group text-lg px-8 py-4 h-auto animate-pulse-glow"
            >
              Start Free Trial
              <ArrowRight className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" />
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="bg-white/10 border-white/30 text-white hover:bg-white/20 backdrop-blur-sm text-lg px-8 py-4 h-auto"
            >
              Schedule Demo
            </Button>
          </div>

          {/* Social Proof */}
          <div className="flex items-center justify-center space-x-8 text-white/70 text-sm">
            <div className="flex items-center space-x-2">
              <div className="flex -space-x-2">
                <img className="w-8 h-8 rounded-full border-2 border-white/20" src="https://images.unsplash.com/photo-1494790108755-2616b612b786?w=32&h=32&fit=crop&crop=face" alt="User" />
                <img className="w-8 h-8 rounded-full border-2 border-white/20" src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face" alt="User" />
                <img className="w-8 h-8 rounded-full border-2 border-white/20" src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=32&h=32&fit=crop&crop=face" alt="User" />
                <img className="w-8 h-8 rounded-full border-2 border-white/20" src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop&crop=face" alt="User" />
              </div>
              <span>Trusted by 50,000+ users</span>
            </div>
            <div className="hidden sm:block w-px h-6 bg-white/20"></div>
            <div className="hidden sm:flex items-center space-x-1">
              <span>4.9/5 rating</span>
              <div className="flex space-x-1 ml-1">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                ))}
              </div>
            </div>
          </div>

          {/* Trust Indicators */}
          <div className="mt-12 pt-8 border-t border-white/20">
            <p className="text-white/60 text-sm mb-4">Trusted by institutions worldwide</p>
            <div className="flex items-center justify-center space-x-8 opacity-60">
              <div className="text-white font-semibold">Stanford</div>
              <div className="text-white font-semibold">MIT</div>
              <div className="text-white font-semibold">Harvard</div>
              <div className="text-white font-semibold">Oxford</div>
              <div className="text-white font-semibold">Cambridge</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;