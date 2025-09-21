import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Star, ArrowRight } from "lucide-react";

const PricingSection = () => {
  const plans = [
    {
      name: "Free",
      price: "0",
      period: "forever",
      description: "Perfect for getting started",
      features: [
        "Up to 5 assessments per month",
        "Basic AI question generation",
        "Standard analytics",
        "Email support",
        "Community access"
      ],
      popular: false,
      buttonText: "Get Started Free",
      buttonVariant: "outline" as const
    },
    {
      name: "Pro",
      price: "29",
      period: "month",
      description: "Best for educators and small teams",
      features: [
        "Unlimited assessments",
        "Advanced AI features", 
        "Real-time analytics & insights",
        "Priority support",
        "Custom branding",
        "API access",
        "Advanced gamification"
      ],
      popular: true,
      buttonText: "Start Pro Trial",
      buttonVariant: "gradient" as const
    },
    {
      name: "Enterprise",
      price: "Custom",
      period: "contact us",
      description: "For large organizations",
      features: [
        "Everything in Pro",
        "Custom integrations",
        "White-label solution",
        "Dedicated account manager",
        "Custom AI model training",
        "Advanced security & compliance",
        "On-premise deployment"
      ],
      popular: false,
      buttonText: "Contact Sales",
      buttonVariant: "outline" as const
    }
  ];

  return (
    <section id="pricing" className="py-20 bg-gradient-secondary">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 animate-slide-up">
          <h2 className="text-3xl sm:text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-lg text-muted-foreground">
            Choose the perfect plan for your needs. No hidden fees, no surprise charges.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <Card 
              key={index}
              className={`relative hover-lift animate-fade-in ${
                plan.popular 
                  ? 'border-primary shadow-primary/20 scale-105 bg-card' 
                  : 'border-border bg-card/50'
              } backdrop-blur-sm`}
              style={{animationDelay: `${index * 0.1}s`}}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-gradient-primary text-white px-4 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                    <Star className="w-3 h-3" />
                    Most Popular
                  </div>
                </div>
              )}
              
              <CardHeader className="text-center pb-4">
                <CardTitle className="text-xl font-bold mb-2">{plan.name}</CardTitle>
                <div className="mb-2">
                  <span className="text-4xl font-bold text-foreground">
                    {plan.price === "Custom" ? "" : "$"}{plan.price}
                  </span>
                  {plan.price !== "Custom" && (
                    <span className="text-muted-foreground">/{plan.period}</span>
                  )}
                </div>
                <CardDescription>{plan.description}</CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-primary mt-1 flex-shrink-0" />
                      <span className="text-sm text-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <Button 
                  variant={plan.buttonVariant} 
                  size="lg" 
                  className="w-full group"
                >
                  {plan.buttonText}
                  <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Additional Info */}
        <div className="text-center mt-12 animate-fade-in" style={{animationDelay: '0.4s'}}>
          <p className="text-muted-foreground mb-4">
            All plans include 24/7 support and a 30-day money-back guarantee
          </p>
          <div className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
            <span>✓ No setup fees</span>
            <span>✓ Cancel anytime</span>
            <span>✓ Secure payments</span>
            <span>✓ Free migration</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;