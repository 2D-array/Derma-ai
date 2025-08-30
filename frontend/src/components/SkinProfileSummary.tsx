import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SkinProfile } from "@/types/skin";
import { User, Target, AlertCircle, Droplets, Sun, DollarSign } from "lucide-react";

interface SkinProfileSummaryProps {
  profile: SkinProfile;
}

export function SkinProfileSummary({ profile }: SkinProfileSummaryProps) {
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "mild":
        return "bg-green-100 text-green-800";
      case "moderate":
        return "bg-yellow-100 text-yellow-800";
      case "severe":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getBudgetLabel = (budget: string) => {
    switch (budget) {
      case "low":
        return "$";
      case "medium":
        return "$$";
      case "high":
        return "$$$";
      case "premium":
        return "$$$$";
      default:
        return "$";
    }
  };

  return (
    <Card className="w-full shadow-medical">
      <CardHeader className="bg-gradient-soft">
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          Your Skin Profile
        </CardTitle>
        <CardDescription>
          Personalized analysis based on your questionnaire responses
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                Primary Concern
              </p>
              <p className="font-medium capitalize">{profile.primaryConcern.replace("-", " ")}</p>
              <Badge className={getSeverityColor(profile.severity)}>
                {profile.severity} severity
              </Badge>
            </div>

            <div className="space-y-1">
              <p className="text-sm text-muted-foreground flex items-center gap-1">
                <Droplets className="h-3 w-3" />
                Skin Type
              </p>
              <p className="font-medium capitalize">{profile.skinType}</p>
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-sm text-muted-foreground flex items-center gap-1">
              <Target className="h-3 w-3" />
              Your Goals
            </p>
            <div className="flex flex-wrap gap-2">
              {profile.goals.map((goal) => (
                <Badge key={goal} variant="secondary">
                  {goal.replace("-", " ")}
                </Badge>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Current Routine</p>
            <div className="flex flex-wrap gap-2">
              {profile.currentRoutine.map((product) => (
                <Badge key={product} variant="outline">
                  {product}
                </Badge>
              ))}
            </div>
          </div>

          {profile.allergies.length > 0 && profile.allergies[0] !== "none" && (
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground flex items-center gap-1">
                <AlertCircle className="h-3 w-3 text-destructive" />
                Sensitivities
              </p>
              <div className="flex flex-wrap gap-2">
                {profile.allergies.map((allergy) => (
                  <Badge key={allergy} variant="destructive">
                    {allergy.replace("-", " ")}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4 pt-2 border-t">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Age Range</p>
              <p className="font-medium">{profile.age}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground flex items-center gap-1">
                <DollarSign className="h-3 w-3" />
                Budget
              </p>
              <p className="font-medium">{getBudgetLabel(profile.budget)}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}