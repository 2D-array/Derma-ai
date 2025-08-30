import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Star, TrendingUp, Users, Search, Package } from "lucide-react";
import { ProductRecommendation, SkinProfile } from "@/types/skin";
import { useEffect, useState } from "react";

interface ProductResearchProps {
  skinProfile: SkinProfile;
}

export function ProductResearch({ skinProfile }: ProductResearchProps) {
  const [isResearching, setIsResearching] = useState(true);
  const [progress, setProgress] = useState(0);
  const [products, setProducts] = useState<ProductRecommendation[]>([]);

  useEffect(() => {
    // Simulate research progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsResearching(false);
          // Set mock products based on skin profile
          setProducts(getMockProducts(skinProfile));
          return 100;
        }
        return prev + 10;
      });
    }, 500);

    return () => clearInterval(interval);
  }, [skinProfile]);

  const getMockProducts = (profile: SkinProfile): ProductRecommendation[] => {
    const productsByCondition: Record<string, ProductRecommendation[]> = {
      acne: [
        {
          name: "Effaclar Duo+",
          brand: "La Roche-Posay",
          price: "$36",
          keyIngredients: ["Niacinamide", "Salicylic Acid", "Zinc"],
          benefits: ["Reduces acne", "Unclogs pores", "Reduces marks"],
          communityRating: 4.5,
          mentions: 342,
        },
        {
          name: "BHA Liquid Exfoliant",
          brand: "Paula's Choice",
          price: "$34",
          keyIngredients: ["2% Salicylic Acid", "Green Tea"],
          benefits: ["Exfoliates", "Reduces blackheads", "Smooths texture"],
          communityRating: 4.7,
          mentions: 567,
        },
        {
          name: "AHA/BHA Solution",
          brand: "The Ordinary",
          price: "$8",
          keyIngredients: ["Glycolic Acid", "Salicylic Acid"],
          benefits: ["Chemical exfoliation", "Brightens", "Unclogs pores"],
          communityRating: 4.3,
          mentions: 289,
        },
      ],
      aging: [
        {
          name: "Retinol 1% in Squalane",
          brand: "The Ordinary",
          price: "$8",
          keyIngredients: ["1% Retinol", "Squalane"],
          benefits: ["Reduces fine lines", "Improves texture", "Anti-aging"],
          communityRating: 4.4,
          mentions: 445,
        },
        {
          name: "C-Firma Day Serum",
          brand: "Drunk Elephant",
          price: "$78",
          keyIngredients: ["15% Vitamin C", "Vitamin E", "Ferulic Acid"],
          benefits: ["Brightens", "Antioxidant protection", "Firms skin"],
          communityRating: 4.6,
          mentions: 312,
        },
      ],
      hyperpigmentation: [
        {
          name: "Alpha Arbutin 2% + HA",
          brand: "The Ordinary",
          price: "$10",
          keyIngredients: ["Alpha Arbutin", "Hyaluronic Acid"],
          benefits: ["Reduces dark spots", "Evens skin tone", "Hydrates"],
          communityRating: 4.2,
          mentions: 234,
        },
        {
          name: "Discoloration Correcting Serum",
          brand: "Good Molecules",
          price: "$12",
          keyIngredients: ["Tranexamic Acid", "Niacinamide"],
          benefits: ["Fades dark spots", "Brightens", "Evens tone"],
          communityRating: 4.5,
          mentions: 189,
        },
      ],
    };

    return productsByCondition[profile.primaryConcern] || productsByCondition.acne;
  };

  if (isResearching) {
    return (
      <Card className="w-full shadow-medical">
        <CardHeader className="bg-gradient-soft">
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5 animate-pulse" />
            AI Research Agent Working
          </CardTitle>
          <CardDescription>
            Analyzing products and community experiences for your skin profile...
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <Progress value={progress} className="h-2" />
            <div className="text-sm text-muted-foreground space-y-2">
              {progress >= 20 && <p>✓ Searching dermatology databases...</p>}
              {progress >= 40 && <p>✓ Analyzing Reddit community discussions...</p>}
              {progress >= 60 && <p>✓ Reviewing product ingredients...</p>}
              {progress >= 80 && <p>✓ Compiling personalized recommendations...</p>}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full shadow-medical">
      <CardHeader className="bg-gradient-soft">
        <CardTitle className="flex items-center gap-2">
          <Package className="h-5 w-5" />
          Research-Based Product Recommendations
        </CardTitle>
        <CardDescription>
          Based on analysis of community experiences and ingredient research
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div className="bg-accent/50 rounded-lg p-4 mb-6">
            <p className="text-sm flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              <span className="font-medium">Community Insight:</span>
              Based on 500+ posts from users with similar profiles
            </p>
          </div>

          {products.map((product, idx) => (
            <div
              key={idx}
              className="border rounded-lg p-4 hover:shadow-soft transition-shadow"
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h4 className="font-semibold text-lg">{product.name}</h4>
                  <p className="text-sm text-muted-foreground">{product.brand}</p>
                </div>
                <Badge variant="secondary" className="text-lg font-semibold">
                  {product.price}
                </Badge>
              </div>

              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium mb-1">Key Ingredients:</p>
                  <div className="flex flex-wrap gap-1">
                    {product.keyIngredients.map((ingredient) => (
                      <Badge key={ingredient} variant="outline" className="text-xs">
                        {ingredient}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium mb-1">Benefits:</p>
                  <ul className="text-sm text-muted-foreground list-disc list-inside">
                    {product.benefits.map((benefit) => (
                      <li key={benefit}>{benefit}</li>
                    ))}
                  </ul>
                </div>

                <div className="flex items-center justify-between pt-2 border-t">
                  <div className="flex items-center gap-2">
                    <Star className="h-4 w-4 fill-primary text-primary" />
                    <span className="text-sm font-medium">
                      {product.communityRating}/5
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Users className="h-4 w-4" />
                    {product.mentions} mentions
                  </div>
                </div>
              </div>
            </div>
          ))}

          <div className="mt-6 p-4 bg-destructive/5 rounded-lg border border-destructive/20">
            <p className="text-sm text-destructive">
              <strong>Disclaimer:</strong> These recommendations are based on aggregated
              community experiences and are not medical advice. Always patch test new
              products and consult a dermatologist for persistent concerns.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}