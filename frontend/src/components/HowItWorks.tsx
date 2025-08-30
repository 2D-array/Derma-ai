import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ClipboardList, MessageSquare, Search, FileText } from "lucide-react";

export function HowItWorks() {
  const steps = [
    {
      icon: ClipboardList,
      title: "Complete Questionnaire",
      description: "Answer questions about your skin type, concerns, and goals to create your personalized profile.",
    },
    {
      icon: MessageSquare,
      title: "Chat with AI Advisor",
      description: "Get instant, evidence-based answers to your skin care questions with cited sources.",
    },
    {
      icon: Search,
      title: "AI Research Agent",
      description: "Our AI autonomously researches products and analyzes community experiences for you.",
    },
    {
      icon: FileText,
      title: "Personalized Report",
      description: "Receive comprehensive recommendations tailored to your unique skin profile and budget.",
    },
  ];

  return (
    <section id="how-it-works" className="py-20 bg-gradient-soft">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            How DermAI Advisor Works
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Our intelligent system combines multiple AI technologies to provide you with
            the most accurate and personalized skin care guidance.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, index) => (
            <Card key={index} className="relative overflow-hidden hover:shadow-medical transition-shadow">
              <div className="absolute top-0 right-0 text-6xl font-bold text-primary/10">
                {index + 1}
              </div>
              <CardHeader>
                <div className="w-12 h-12 rounded-full bg-gradient-primary flex items-center justify-center mb-4">
                  <step.icon className="h-6 w-6 text-primary-foreground" />
                </div>
                <CardTitle className="text-xl">{step.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>{step.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}