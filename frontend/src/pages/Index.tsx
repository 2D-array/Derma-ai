import { useState } from "react";
import { MedicalDisclaimer } from "@/components/MedicalDisclaimer";
import { SkinQuestionnaire } from "@/components/SkinQuestionnaire";
import { ChatInterface } from "@/components/ChatInterface";
import { ProductResearch } from "@/components/ProductResearch";
import { SkinProfileSummary } from "@/components/SkinProfileSummary";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { HowItWorks } from "@/components/HowItWorks";
import { SkinProfile } from "@/types/skin";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Index = () => {
  const [disclaimerAccepted, setDisclaimerAccepted] = useState(false);
  const [started, setStarted] = useState(false);
  const [skinProfile, setSkinProfile] = useState<SkinProfile | null>(null);

  const handleStart = () => {
    setStarted(true);
  };

  const handleNewConsultation = () => {
    setSkinProfile(null);
    setStarted(true);
  };

  const handleQuestionnaireComplete = (profile: SkinProfile) => {
    setSkinProfile(profile);
  };

  if (!disclaimerAccepted) {
    return <MedicalDisclaimer onAccept={() => setDisclaimerAccepted(true)} />;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header showDashboard={!!skinProfile} onNewConsultation={handleNewConsultation} />
      
      {!started ? (
        <>
          <Hero onStart={handleStart} />
          <HowItWorks />
        </>
      ) : !skinProfile ? (
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-4">
                Let's Start Your Skin Analysis
              </h2>
              <p className="text-lg text-muted-foreground">
                Take 2-3 minutes to answer questions about your skin
              </p>
            </div>
            <SkinQuestionnaire onComplete={handleQuestionnaireComplete} />
          </div>
        </div>
      ) : (
        <div className="container mx-auto px-4 py-12">
          <div className="mb-8">
            <h2 className="text-3xl font-bold mb-2">Your Personalized Dashboard</h2>
            <p className="text-muted-foreground">
              Based on your skin profile, here are your personalized recommendations
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <SkinProfileSummary profile={skinProfile} />
            </div>

            <div className="lg:col-span-2">
              <Tabs defaultValue="chat" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="chat">AI Advisor Chat</TabsTrigger>
                  <TabsTrigger value="research">Product Research</TabsTrigger>
                </TabsList>
                <TabsContent value="chat" className="mt-4">
                  <ChatInterface skinProfile={skinProfile} />
                </TabsContent>
                <TabsContent value="research" className="mt-4">
                  <ProductResearch skinProfile={skinProfile} />
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Index;