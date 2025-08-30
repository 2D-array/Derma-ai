import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Shield, Brain, Search } from "lucide-react";
import heroBackground from "@/assets/hero-background.jpg";

interface HeroProps {
  onStart: () => void;
}

export function Hero({ onStart }: HeroProps) {
  return (
    <section className="relative overflow-hidden py-20 lg:py-32">
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-10"
        style={{ backgroundImage: `url(${heroBackground})` }}
      />
      <div className="absolute inset-0 bg-gradient-soft opacity-50" />
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
            AI-Powered Skin Care Intelligence
          </Badge>
          
          <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in-up">
            Your Personal{" "}
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              AI Skin Care Advisor
            </span>
          </h1>
          
          <p className="text-xl text-muted-foreground mb-8 animate-fade-in-up animation-delay-200">
            Get personalized skin care recommendations based on advanced AI analysis,
            dermatological research, and real community experiences.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12 animate-fade-in-up animation-delay-400">
            <Button
              size="lg"
              onClick={onStart}
              className="bg-gradient-primary text-primary-foreground hover:opacity-90 text-lg px-8"
            >
              Start Free Consultation
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => document.getElementById("how-it-works")?.scrollIntoView({ behavior: "smooth" })}
            >
              Learn How It Works
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
            <div className="flex flex-col items-center p-4 rounded-lg bg-card/50 backdrop-blur-sm border">
              <Shield className="h-10 w-10 text-primary mb-2" />
              <h3 className="font-semibold mb-1">Evidence-Based</h3>
              <p className="text-sm text-muted-foreground text-center">
                Backed by dermatological research
              </p>
            </div>
            <div className="flex flex-col items-center p-4 rounded-lg bg-card/50 backdrop-blur-sm border">
              <Brain className="h-10 w-10 text-primary mb-2" />
              <h3 className="font-semibold mb-1">AI-Powered</h3>
              <p className="text-sm text-muted-foreground text-center">
                Advanced RAG technology for accuracy
              </p>
            </div>
            <div className="flex flex-col items-center p-4 rounded-lg bg-card/50 backdrop-blur-sm border">
              <Search className="h-10 w-10 text-primary mb-2" />
              <h3 className="font-semibold mb-1">Real Research</h3>
              <p className="text-sm text-muted-foreground text-center">
                Analyzes community experiences
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}