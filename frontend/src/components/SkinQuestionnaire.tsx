import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { SkinProfile } from "@/types/skin";
import { toast } from "@/components/ui/use-toast";

interface SkinQuestionnaireProps {
  onComplete: (profile: SkinProfile) => void;
}

const questions = [
  {
    id: "primaryConcern",
    title: "What's your primary skin concern?",
    type: "single",
    options: [
      { value: "acne", label: "Acne & Breakouts" },
      { value: "aging", label: "Fine Lines & Aging" },
      { value: "hyperpigmentation", label: "Dark Spots & Uneven Tone" },
      { value: "dryness", label: "Dryness & Dehydration" },
      { value: "oiliness", label: "Excess Oil & Shine" },
      { value: "sensitivity", label: "Redness & Sensitivity" },
      { value: "texture", label: "Texture & Pores" },
    ],
  },
  {
    id: "skinType",
    title: "How would you describe your skin type?",
    type: "single",
    options: [
      { value: "oily", label: "Oily - Shiny all over" },
      { value: "dry", label: "Dry - Tight and flaky" },
      { value: "combination", label: "Combination - Oily T-zone, dry cheeks" },
      { value: "normal", label: "Normal - Balanced" },
      { value: "sensitive", label: "Sensitive - Easily irritated" },
    ],
  },
  {
    id: "severity",
    title: "How severe is your primary concern?",
    type: "single",
    options: [
      { value: "mild", label: "Mild - Occasional issues" },
      { value: "moderate", label: "Moderate - Regular concerns" },
      { value: "severe", label: "Severe - Persistent problems" },
    ],
  },
  {
    id: "goals",
    title: "What are your skin goals? (Select all that apply)",
    type: "multiple",
    options: [
      { value: "clear", label: "Clear skin" },
      { value: "hydrated", label: "Better hydration" },
      { value: "even-tone", label: "Even skin tone" },
      { value: "anti-aging", label: "Reduce signs of aging" },
      { value: "minimize-pores", label: "Minimize pores" },
      { value: "glow", label: "Healthy glow" },
      { value: "reduce-oil", label: "Control oil" },
    ],
  },
  {
    id: "currentRoutine",
    title: "Which products do you currently use? (Select all that apply)",
    type: "multiple",
    options: [
      { value: "cleanser", label: "Cleanser" },
      { value: "toner", label: "Toner" },
      { value: "serum", label: "Serum" },
      { value: "moisturizer", label: "Moisturizer" },
      { value: "sunscreen", label: "Sunscreen" },
      { value: "retinol", label: "Retinol/Retinoid" },
      { value: "exfoliant", label: "Exfoliant (AHA/BHA)" },
      { value: "mask", label: "Face Masks" },
    ],
  },
  {
    id: "allergies",
    title: "Do you have any known allergies or sensitivities? (Select all that apply)",
    type: "multiple",
    options: [
      { value: "fragrance", label: "Fragrance" },
      { value: "alcohol", label: "Alcohol" },
      { value: "essential-oils", label: "Essential Oils" },
      { value: "sulfates", label: "Sulfates" },
      { value: "parabens", label: "Parabens" },
      { value: "none", label: "None that I know of" },
    ],
  },
  {
    id: "age",
    title: "What's your age range?",
    type: "single",
    options: [
      { value: "under-20", label: "Under 20" },
      { value: "20-30", label: "20-30" },
      { value: "30-40", label: "30-40" },
      { value: "40-50", label: "40-50" },
      { value: "50-60", label: "50-60" },
      { value: "over-60", label: "Over 60" },
    ],
  },
  {
    id: "budget",
    title: "What's your budget for skincare products?",
    type: "single",
    options: [
      { value: "low", label: "Budget-friendly (Under $20/product)" },
      { value: "medium", label: "Moderate ($20-50/product)" },
      { value: "high", label: "Premium ($50-100/product)" },
      { value: "premium", label: "Luxury ($100+/product)" },
    ],
  },
];

export function SkinQuestionnaire({ onComplete }: SkinQuestionnaireProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const progress = ((currentStep + 1) / questions.length) * 100;

  const handleSingleAnswer = (questionId: string, value: string) => {
    setAnswers({ ...answers, [questionId]: value });
  };

  const handleMultipleAnswer = (questionId: string, value: string, checked: boolean) => {
    const current = answers[questionId] || [];
    if (checked) {
      setAnswers({ ...answers, [questionId]: [...current, value] });
    } else {
      setAnswers({ ...answers, [questionId]: current.filter((v: string) => v !== value) });
    }
  };

  const handleNext = () => {
    const currentQuestion = questions[currentStep];
    if (!answers[currentQuestion.id] || (Array.isArray(answers[currentQuestion.id]) && answers[currentQuestion.id].length === 0)) {
      toast({
        title: "Please select an option",
        description: "You need to answer this question to continue.",
        variant: "destructive",
      });
      return;
    }
    
    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Complete the questionnaire
      const profile: SkinProfile = {
        primaryConcern: answers.primaryConcern,
        skinType: answers.skinType,
        severity: answers.severity,
        goals: answers.goals || [],
        currentRoutine: answers.currentRoutine || [],
        allergies: answers.allergies || [],
        age: answers.age,
        budget: answers.budget,
        environmental: {
          climate: "temperate", // Could add these as questions
          sunExposure: "moderate",
        },
      };
      onComplete(profile);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const currentQuestion = questions[currentStep];

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-medical">
      <CardHeader className="bg-gradient-soft">
        <div className="mb-4">
          <Progress value={progress} className="h-2" />
          <p className="text-sm text-muted-foreground mt-2">
            Question {currentStep + 1} of {questions.length}
          </p>
        </div>
        <CardTitle className="text-2xl">{currentQuestion.title}</CardTitle>
        <CardDescription>
          {currentQuestion.type === "multiple" 
            ? "You can select multiple options"
            : "Please select one option"}
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        {currentQuestion.type === "single" ? (
          <RadioGroup
            value={answers[currentQuestion.id]}
            onValueChange={(value) => handleSingleAnswer(currentQuestion.id, value)}
          >
            <div className="space-y-3">
              {currentQuestion.options.map((option) => (
                <div
                  key={option.value}
                  className="flex items-center space-x-3 p-3 rounded-lg hover:bg-accent transition-colors"
                >
                  <RadioGroupItem value={option.value} id={option.value} />
                  <Label
                    htmlFor={option.value}
                    className="flex-1 cursor-pointer text-base"
                  >
                    {option.label}
                  </Label>
                </div>
              ))}
            </div>
          </RadioGroup>
        ) : (
          <div className="space-y-3">
            {currentQuestion.options.map((option) => (
              <div
                key={option.value}
                className="flex items-center space-x-3 p-3 rounded-lg hover:bg-accent transition-colors"
              >
                <Checkbox
                  id={option.value}
                  checked={answers[currentQuestion.id]?.includes(option.value)}
                  onCheckedChange={(checked) =>
                    handleMultipleAnswer(currentQuestion.id, option.value, checked as boolean)
                  }
                />
                <Label
                  htmlFor={option.value}
                  className="flex-1 cursor-pointer text-base"
                >
                  {option.label}
                </Label>
              </div>
            ))}
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button
          variant="outline"
          onClick={handleBack}
          disabled={currentStep === 0}
        >
          <ChevronLeft className="mr-2 h-4 w-4" />
          Previous
        </Button>
        <Button
          onClick={handleNext}
          className="bg-gradient-primary text-primary-foreground hover:opacity-90"
        >
          {currentStep === questions.length - 1 ? "Complete" : "Next"}
          <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
}