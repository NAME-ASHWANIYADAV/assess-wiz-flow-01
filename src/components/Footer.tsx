import { Button } from "@/components/ui/button";
import { Sparkles, Mail, Phone, MapPin, Twitter, Linkedin, Github } from "lucide-react";

const Footer = () => {
  const footerSections = {
    product: {
      title: "Product",
      links: [
        { name: "Features", href: "#features" },
        { name: "Pricing", href: "#pricing" },
        { name: "API Documentation", href: "/docs" },
        { name: "Integrations", href: "/integrations" }
      ]
    },
    company: {
      title: "Company", 
      links: [
        { name: "About Us", href: "#about" },
        { name: "Careers", href: "/careers" },
        { name: "Blog", href: "/blog" },
        { name: "Press", href: "/press" }
      ]
    },
    support: {
      title: "Support",
      links: [
        { name: "Help Center", href: "/help" },
        { name: "Contact Us", href: "#contact" },
        { name: "Status", href: "/status" },
        { name: "Community", href: "/community" }
      ]
    },
    legal: {
      title: "Legal",
      links: [
        { name: "Privacy Policy", href: "/privacy" },
        { name: "Terms of Service", href: "/terms" },
        { name: "Cookie Policy", href: "/cookies" },
        { name: "GDPR", href: "/gdpr" }
      ]
    }
  };

  const socialLinks = [
    { icon: Twitter, href: "https://twitter.com/assessaiwizard", label: "Twitter" },
    { icon: Linkedin, href: "https://linkedin.com/company/assessaiwizard", label: "LinkedIn" },
    { icon: Github, href: "https://github.com/assessaiwizard", label: "GitHub" }
  ];

  return (
    <footer id="contact" className="bg-foreground text-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-16">
          <div className="grid lg:grid-cols-5 gap-8">
            {/* Brand Section */}
            <div className="lg:col-span-2">
              <div className="flex items-center space-x-2 mb-6">
                <div className="w-8 h-8 gradient-primary rounded-lg flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold">Assess AI Wizard</span>
              </div>
              
              <p className="text-background/70 mb-6 max-w-md leading-relaxed">
                Empowering educators with AI-driven assessment tools that transform learning experiences 
                and unlock student potential through personalized, intelligent evaluation.
              </p>

              {/* Contact Info */}
              <div className="space-y-3 mb-6">
                <div className="flex items-center space-x-3 text-background/70">
                  <Mail className="w-4 h-4" />
                  <span className="text-sm">hello@assessaiwizard.com</span>
                </div>
                <div className="flex items-center space-x-3 text-background/70">
                  <Phone className="w-4 h-4" />
                  <span className="text-sm">+1 (555) 123-4567</span>
                </div>
                <div className="flex items-center space-x-3 text-background/70">
                  <MapPin className="w-4 h-4" />
                  <span className="text-sm">San Francisco, CA</span>
                </div>
              </div>

              {/* Social Links */}
              <div className="flex items-center space-x-4">
                {socialLinks.map((social, index) => {
                  const IconComponent = social.icon;
                  return (
                    <Button
                      key={index}
                      variant="ghost"
                      size="icon"
                      className="text-background/70 hover:text-background hover:bg-background/10"
                      asChild
                    >
                      <a href={social.href} aria-label={social.label} target="_blank" rel="noopener noreferrer">
                        <IconComponent className="w-5 h-5" />
                      </a>
                    </Button>
                  );
                })}
              </div>
            </div>

            {/* Footer Links */}
            {Object.entries(footerSections).map(([key, section]) => (
              <div key={key}>
                <h3 className="font-semibold text-background mb-4">{section.title}</h3>
                <ul className="space-y-3">
                  {section.links.map((link, index) => (
                    <li key={index}>
                      <a 
                        href={link.href}
                        className="text-background/70 hover:text-background transition-colors text-sm"
                      >
                        {link.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Newsletter Section */}
        <div className="py-8 border-t border-background/20">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            <div>
              <h3 className="font-semibold text-background mb-1">Stay updated</h3>
              <p className="text-background/70 text-sm">
                Get the latest features, updates, and educational insights.
              </p>
            </div>
            <div className="flex space-x-3 w-full md:w-auto max-w-md">
              <input 
                type="email" 
                placeholder="Enter your email"
                className="flex-1 px-4 py-2 bg-background/10 border border-background/20 rounded-md text-background placeholder:text-background/50 focus:outline-none focus:ring-2 focus:ring-primary text-sm"
              />
              <Button variant="gradient" size="sm">
                Subscribe
              </Button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="py-6 border-t border-background/20">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            <div className="text-background/70 text-sm">
              © 2024 Assess AI Wizard. All rights reserved.
            </div>
            <div className="flex items-center space-x-6 text-background/70 text-sm">
              <a href="/security" className="hover:text-background transition-colors">Security</a>
              <a href="/accessibility" className="hover:text-background transition-colors">Accessibility</a>
              <a href="/sitemap" className="hover:text-background transition-colors">Sitemap</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;