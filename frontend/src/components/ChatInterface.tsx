import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Bot, User, ExternalLink } from "lucide-react";
import { Message, SkinProfile } from "@/types/skin";
import { Badge } from "@/components/ui/badge";

interface ChatInterfaceProps {
  skinProfile: SkinProfile;
}

export function ChatInterface({ skinProfile }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: `Hello! I'm your AI skin care advisor. Based on your profile, I can see you're dealing with ${skinProfile.primaryConcern} and have ${skinProfile.skinType} skin. I'm here to provide evidence-based guidance and answer any questions you have about your skin care routine.

What would you like to know more about?`,
      timestamp: new Date(),
      citations: [
        {
          source: "American Academy of Dermatology",
          url: "https://www.aad.org",
          text: "Skin type classification guide"
        }
      ]
    }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    };

    setMessages([...messages, userMessage]);
    setInput("");
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: generateAIResponse(input, skinProfile),
        timestamp: new Date(),
        citations: [
          {
            source: "Journal of Clinical and Aesthetic Dermatology",
            text: "Evidence-based skincare recommendations",
            url: "#"
          }
        ]
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 2000);
  };

  const generateAIResponse = (query: string, profile: SkinProfile): string => {
    // This is a placeholder. In production, this would call your RAG system
    const responses: Record<string, string> = {
      benzoyl: "Benzoyl peroxide can indeed cause initial irritation, including redness and peeling. These are common side effects, especially in the first few weeks of use. To minimize irritation, try: 1) Starting with every other day application, 2) Using a gentle, fragrance-free moisturizer as a buffer, 3) Applying sunscreen daily as BP increases photosensitivity. If irritation persists or worsens after 2-3 weeks, consult your dermatologist for alternatives.",
      retinol: "For beginners with sensitive skin, start with a low concentration retinol (0.025-0.05%) once or twice a week at night. Apply to clean, dry skin and follow with a moisturizer. Gradually increase frequency as your skin builds tolerance. Always use sunscreen during the day, as retinoids increase photosensitivity.",
      routine: `Based on your ${profile.skinType} skin and ${profile.primaryConcern} concerns, here's a suggested routine: Morning: 1) Gentle cleanser, 2) Hydrating toner, 3) Treatment serum for ${profile.primaryConcern}, 4) Moisturizer, 5) SPF 30+. Evening: 1) Double cleanse if wearing makeup/sunscreen, 2) Treatment (alternate between actives), 3) Moisturizer, 4) Optional: facial oil for extra hydration.`,
    };

    const lowerQuery = query.toLowerCase();
    for (const [key, response] of Object.entries(responses)) {
      if (lowerQuery.includes(key)) {
        return response;
      }
    }

    return `That's a great question about ${profile.primaryConcern}. Based on current dermatological research, I recommend focusing on gentle, consistent care. Would you like specific product recommendations or more information about ingredients that could help with your concerns?`;
  };

  return (
    <Card className="w-full h-[600px] flex flex-col shadow-medical">
      <CardHeader className="bg-gradient-soft">
        <CardTitle className="flex items-center gap-2">
          <Bot className="h-5 w-5" />
          AI Skin Care Advisor
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col p-0">
        <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${
                  message.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`flex gap-3 max-w-[80%] ${
                    message.role === "user" ? "flex-row-reverse" : "flex-row"
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      message.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary text-secondary-foreground"
                    }`}
                  >
                    {message.role === "user" ? (
                      <User className="h-4 w-4" />
                    ) : (
                      <Bot className="h-4 w-4" />
                    )}
                  </div>
                  <div className="space-y-2">
                    <div
                      className={`rounded-lg p-3 ${
                        message.role === "user"
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted"
                      }`}
                    >
                      <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                    </div>
                    {message.citations && message.citations.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {message.citations.map((citation, idx) => (
                          <Badge
                            key={idx}
                            variant="outline"
                            className="text-xs cursor-pointer hover:bg-accent"
                          >
                            <ExternalLink className="h-3 w-3 mr-1" />
                            {citation.source}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
                  <Bot className="h-4 w-4" />
                </div>
                <div className="bg-muted rounded-lg p-3">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-primary rounded-full animate-bounce" />
                    <span className="w-2 h-2 bg-primary rounded-full animate-bounce delay-100" />
                    <span className="w-2 h-2 bg-primary rounded-full animate-bounce delay-200" />
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
        <div className="p-4 border-t">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex gap-2"
          >
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about your skin concerns..."
              className="flex-1"
            />
            <Button
              type="submit"
              disabled={!input.trim() || isTyping}
              className="bg-gradient-primary text-primary-foreground hover:opacity-90"
            >
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </CardContent>
    </Card>
  );
}