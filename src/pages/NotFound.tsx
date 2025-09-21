import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Home, ArrowLeft, Sparkles } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    // Log 404 error silently (can be enabled for debugging)
    // console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-hero relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-20 h-20 bg-white/10 rounded-full animate-float"></div>
        <div className="absolute top-40 right-20 w-32 h-32 bg-white/5 rounded-full animate-float" style={{animationDelay: '2s'}}></div>
        <div className="absolute bottom-20 left-20 w-16 h-16 bg-white/10 rounded-full animate-float" style={{animationDelay: '4s'}}></div>
      </div>

      <div className="text-center relative animate-slide-up max-w-2xl mx-auto px-4">
        {/* Logo */}
        <div className="flex items-center justify-center space-x-2 mb-8">
          <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center animate-pulse-glow">
            <Sparkles className="w-7 h-7 text-white" />
          </div>
          <span className="text-2xl font-bold text-white">Assess AI Wizard</span>
        </div>

        {/* 404 Content */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 md:p-12 border border-white/20">
          <h1 className="text-8xl md:text-9xl font-bold text-white mb-4 animate-pulse-glow">404</h1>
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">Page Not Found</h2>
          <p className="text-lg text-white/90 mb-8 leading-relaxed">
            Oops! The page you're looking for doesn't exist. It might have been moved, 
            deleted, or you entered the wrong URL.
          </p>
          
          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              variant="glass" 
              size="lg" 
              className="group"
              asChild
            >
              <a href="/">
                <Home className="w-5 h-5 mr-2" />
                Return to Home
                <ArrowLeft className="w-4 h-4 ml-2 transition-transform group-hover:-translate-x-1" />
              </a>
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              className="bg-white/10 border-white/30 text-white hover:bg-white/20 backdrop-blur-sm"
              onClick={() => window.history.back()}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Go Back
            </Button>
          </div>

          {/* Helpful Links */}
          <div className="mt-8 pt-6 border-t border-white/20">
            <p className="text-white/70 text-sm mb-4">You might be looking for:</p>
            <div className="flex flex-wrap gap-3 justify-center">
              <a href="#features" className="text-white/80 hover:text-white text-sm underline underline-offset-4 hover:no-underline transition-all">Features</a>
              <a href="#about" className="text-white/80 hover:text-white text-sm underline underline-offset-4 hover:no-underline transition-all">About</a>
              <a href="#leaderboard" className="text-white/80 hover:text-white text-sm underline underline-offset-4 hover:no-underline transition-all">Leaderboard</a>
              <a href="#contact" className="text-white/80 hover:text-white text-sm underline underline-offset-4 hover:no-underline transition-all">Contact</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;