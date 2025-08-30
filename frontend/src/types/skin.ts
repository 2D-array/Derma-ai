export interface SkinProfile {
  primaryConcern: string;
  skinType: string;
  severity: 'mild' | 'moderate' | 'severe';
  currentRoutine: string[];
  goals: string[];
  allergies: string[];
  environmental: {
    climate: string;
    sunExposure: string;
  };
  budget: 'low' | 'medium' | 'high' | 'premium';
  age: string;
  gender?: string;
}

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  citations?: Citation[];
  timestamp: Date;
}

export interface Citation {
  source: string;
  url?: string;
  text: string;
}

export interface ProductRecommendation {
  name: string;
  brand: string;
  price: string;
  keyIngredients: string[];
  benefits: string[];
  communityRating?: number;
  mentions?: number;
}