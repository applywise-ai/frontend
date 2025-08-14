'use client';

import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/app/components/ui/dialog';
import { Button } from '@/app/components/ui/button';
import { Card, CardContent } from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';
import { Check, Zap, Target, FileText, Calendar, Bot, Loader2, AlertCircle, X, Star, User } from 'lucide-react';

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Feature {
  text: string;
  icon: React.ComponentType<{ className?: string }>;
  highlight?: boolean;
  muted?: boolean;
  comingSoon?: boolean;
}

interface PlanConfig {
  id: 'weekly' | 'monthly' | 'quarterly';
  name: string;
  weeklyPrice: number;
  totalPrice: number;
  priceId: string;
  popular?: boolean;
  savings?: string;
}

interface Review {
  id: number;
  name: string;
  role: string;
  company: string;
  rating: number;
  text: string;
  avatar: string;
  verified: boolean;
}

// Sample reviews data
const reviews: Review[] = [
  {
    id: 1,
    name: "Sarah Chen",
    role: "Software Engineer",
    company: "Google",
    rating: 5,
    text: "ApplyWise helped me land my dream job at Google! The AI-generated cover letters were spot-on and saved me hours of work.",
    avatar: "SC",
    verified: true
  },
  {
    id: 2,
    name: "Marcus Johnson",
    role: "Product Manager",
    company: "Microsoft",
    rating: 5,
    text: "I got 3x more interviews after using ApplyWise Pro. The personalized applications really make a difference.",
    avatar: "MJ",
    verified: true
  },
  {
    id: 3,
    name: "Emily Rodriguez",
    role: "Data Scientist",
    company: "Netflix",
    rating: 5,
    text: "The auto-apply feature is a game changer. I applied to 50+ jobs in a week and got multiple offers!",
    avatar: "ER",
    verified: true
  },
  {
    id: 4,
    name: "David Kim",
    role: "UX Designer",
    company: "Airbnb",
    rating: 5,
    text: "Finally found a tool that understands my career goals. The AI applications are incredibly personalized.",
    avatar: "DK",
    verified: true
  },
  {
    id: 5,
    name: "Jessica Taylor",
    role: "Marketing Manager",
    company: "Spotify",
    rating: 5,
    text: "ApplyWise Pro transformed my job search. I went from 0 responses to 15 interviews in just 2 weeks!",
    avatar: "JT",
    verified: true
  },
  {
    id: 6,
    name: "Alex Thompson",
    role: "DevOps Engineer",
    company: "Amazon",
    rating: 5,
    text: "The quality of AI-generated applications is impressive. Recruiters actually complimented my cover letters!",
    avatar: "AT",
    verified: true
  },
  {
    id: 7,
    name: "Priya Patel",
    role: "Frontend Developer",
    company: "Meta",
    rating: 5,
    text: "I was skeptical at first, but ApplyWise delivered. Got my current role at Meta thanks to their platform!",
    avatar: "PP",
    verified: true
  },
  {
    id: 8,
    name: "Ryan Mitchell",
    role: "Sales Director",
    company: "Salesforce",
    rating: 5,
    text: "The time I saved with ApplyWise allowed me to focus on interview prep. Best investment in my career!",
    avatar: "RM",
    verified: true
  }
];

// Secure plan configurations with environment variables for price IDs
const plans: PlanConfig[] = [
  {
    id: 'weekly',
    name: 'Weekly',
    weeklyPrice: 7,
    totalPrice: 7,
    priceId: process.env.NEXT_PUBLIC_STRIPE_WEEKLY_PRICE_ID || '',
  },
  {
    id: 'monthly',
    name: 'Monthly',
    weeklyPrice: 6.25,
    totalPrice: 25,
    priceId: process.env.NEXT_PUBLIC_STRIPE_MONTHLY_PRICE_ID || '',
    popular: true,
    savings: 'Save 11%',
  },
  {
    id: 'quarterly',
    name: '3 months',
    weeklyPrice: 4.62,
    totalPrice: 60,
    priceId: process.env.NEXT_PUBLIC_STRIPE_QUARTERLY_PRICE_ID || '',
    savings: 'Save 34%',
  },
];

const freeFeatures: Feature[] = [
  { text: 'Access to all jobs', icon: Target },
  { text: '10 AI applications per day', icon: Bot },
  { text: 'Advanced job matching', icon: Target },
  { text: 'Unlimited application tracking', icon: FileText },
  { text: 'Basic application management', icon: Target },
];

const proFeatures: Feature[] = [
  { text: 'Everything in Free', icon: Check },
  { text: 'Unlimited AI applications', icon: Bot, highlight: true },
  { text: 'Smarter AI-generated answers', icon: Target, highlight: true },
  { text: 'Unlimited personalized cover letters', icon: FileText, highlight: true },
  { text: 'Unlimited tailored resumes', icon: User, comingSoon: true },
];

// Reviews Carousel Component
function ReviewsCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % reviews.length);
    }, 5000); // Change review every 5 seconds

    return () => clearInterval(interval);
  }, []);

  // Create a continuous loop by duplicating reviews
  const extendedReviews = [...reviews, ...reviews, ...reviews];

  return (
    <div className="mb-6 relative">
      {/* Light blue fade background */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-50/30 via-blue-100/20 to-blue-50/30 rounded-2xl -z-10"></div>
      <div className="py-2 md:py-4 px-3">
        <div className="relative overflow-hidden rounded-xl">
          <div 
            className="flex transition-transform duration-1000 ease-in-out"
            style={{ 
              transform: `translateX(-${currentIndex * 100}%)`,
            }}
          >
            {extendedReviews.map((review, index) => (
              <div key={`${review.id}-${Math.floor(index / reviews.length)}`} className="w-full flex-shrink-0">
                <Card className="h-auto border-gray-200/60 hover:border-blue-200 transition-all duration-300 bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md w-full">
                  <CardContent className="p-3 md:p-4 h-full flex flex-col">
                    <div className="flex items-center mb-1 md:mb-2">
                      <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm mr-2 md:mr-3 flex-shrink-0">
                        {review.avatar}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1 md:gap-2 mb-0.5 md:mb-1">
                          <div className="flex items-center gap-1 md:gap-2 min-w-0">
                            <h4 className="font-bold text-gray-900 text-sm md:text-base truncate">{review.name}</h4>
                            {review.verified && (
                              <div className="w-3 h-3 md:w-4 md:h-4 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                                <Check className="h-1.5 w-1.5 md:h-2 md:w-2 text-white" />
                              </div>
                            )}
                          </div>
                          <div className="flex items-center gap-0.5 md:gap-1 flex-shrink-0 ml-1 md:ml-2">
                            {[...Array(5)].map((_, i) => (
                              <Star 
                                key={i} 
                                className={`h-3 w-3 md:h-4 md:w-4 ${i < review.rating ? 'fill-yellow-300 text-yellow-300' : 'text-gray-300'}`} 
                              />
                            ))}
                          </div>
                        </div>
                        <p className="text-sm md:text-base text-gray-600 truncate font-medium">{review.role} at {review.company}</p>
                      </div>
                    </div>
                    
                    <div className="flex-1 pl-2 md:pl-3">
                      <p className="text-sm sm:text-base text-gray-800 leading-relaxed font-medium hyphens-auto" style={{
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden'
                      }}>
                        &ldquo;{review.text}&rdquo;
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SubscriptionModal({ isOpen, onClose }: SubscriptionModalProps) {
  const [selectedPlan, setSelectedPlan] = useState<'weekly' | 'monthly' | 'quarterly'>('monthly');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubscribe = async () => {
    const plan = plans.find(p => p.id === selectedPlan);
    if (!plan) {
      setError('Invalid plan selected');
      return;
    }

    // Validate that price ID is configured
    if (!plan.priceId) {
      setError('Payment configuration error. Please contact support.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Call our secure API endpoint
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId: plan.priceId,
          planId: plan.id,
          planName: plan.name,
          amount: plan.totalPrice,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create checkout session');
      }

      if (!data.url) {
        throw new Error('No checkout URL received');
      }

      // Redirect to Stripe Checkout
      window.location.href = data.url;

    } catch (err) {
      console.error('Subscription error:', err);
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePlanSelect = (planId: 'weekly' | 'monthly' | 'quarterly') => {
    setSelectedPlan(planId);
    setError(null); // Clear any previous errors
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] p-0 overflow-hidden flex flex-col">
        {/* Fixed Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-3 z-10 flex-shrink-0">
          <DialogHeader className="space-y-1 relative">
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="absolute -top-1 -right-2 h-8 w-8 p-0 hover:bg-gray-100"
            >
              <X className="h-4 w-4" />
            </Button>
            <DialogTitle className="text-xl font-bold text-center">
              Supercharge Your Job Search
            </DialogTitle>
            <div className="text-center">
              <div className="inline-flex items-center gap-2 bg-teal-50 text-teal-700 px-3 py-1 rounded-full text-sm font-medium">
                <Zap className="h-4 w-4" />
                Pro members get 3.2x more interviews
              </div>
            </div>
          </DialogHeader>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-6 pb-4 min-h-0">
          {/* Error Alert */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700">
              <AlertCircle className="h-4 w-4" />
              <span>{error}</span>
            </div>
          )}

          {/* Feature Cards */}
          <div className="grid md:grid-cols-2 gap-4 mb-6">
            {/* Free Plan Features */}
            <Card className="border-gray-300 bg-gray-50">
              <CardContent className="p-4">
                <h3 className="text-base font-medium mb-3 text-gray-700">Free Plan</h3>
                <ul className="space-y-3">
                  {freeFeatures.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <feature.icon className="h-3.5 w-3.5 text-gray-500" />
                      <span className="text-sm text-gray-600">
                        {feature.text}
                      </span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Pro Plan Features */}
            <Card className="border-teal-300 bg-gradient-to-br from-teal-50 to-emerald-50 ring-2 ring-teal-100">
              <CardContent className="p-4">
                <h3 className="text-base font-bold mb-3 text-teal-900 flex items-center">
                  <Zap className="h-4 w-4 mr-2 text-teal-600" />
                  Pro Plan
                </h3>
                <ul className="space-y-3">
                  {proFeatures.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <feature.icon className={`h-3.5 w-3.5 ${feature.highlight ? 'text-teal-600' : 'text-teal-500'}`} />
                      <span className={`text-sm ${feature.highlight ? 'text-teal-800 font-bold' : 'text-teal-700 font-semibold'}`}>
                        {feature.text}
                        {feature.comingSoon && (
                          <Badge 
                            variant="secondary" 
                            className="ml-2 text-xs bg-gradient-to-r from-teal-100 to-teal-200 text-teal-700 border-teal-300 pointer-events-none font-medium"
                          >
                            Coming Soon
                          </Badge>
                        )}
                      </span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Reviews Carousel Section */}
          {/* <ReviewsCarousel /> */}

          {/* Pricing Cards */}
          <div className="grid md:grid-cols-3 gap-10 md:gap-4 md:pt-3">
            {plans.map((plan) => (
              <Card 
                key={plan.id}
                className={`relative cursor-pointer transition-all duration-300 group ${
                  selectedPlan === plan.id 
                    ? 'border-teal-500 ring-2 ring-teal-200/50 shadow-xl scale-105 bg-gradient-to-br from-teal-50/50 to-white' 
                    : 'border-gray-200/60 hover:border-teal-300 hover:shadow-lg hover:scale-102 bg-white'
                } rounded-2xl`}
                onClick={() => handlePlanSelect(plan.id)}
              >
                {plan.popular && (
                  <div className="absolute -top-5 left-1/2 transform -translate-x-1/2 z-[100]">
                    <Badge className="bg-gradient-to-r from-teal-600 to-teal-700 text-white px-3 py-1.5 text-xs font-medium shadow-lg">
                      Most Popular
                    </Badge>
                  </div>
                )}
                
                {/* Subtle gradient overlay */}
                <div className={`absolute inset-0 bg-gradient-to-br ${
                  selectedPlan === plan.id 
                    ? 'from-teal-500/5 to-teal-600/10' 
                    : 'from-gray-50/50 to-transparent'
                } pointer-events-none`}></div>
                
                <CardContent className="p-5 flex flex-col h-full relative z-10">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-semibold text-gray-900">{plan.name}</h3>
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                      selectedPlan === plan.id 
                        ? 'border-teal-500 bg-teal-500 shadow-md' 
                        : 'border-gray-300 group-hover:border-teal-400'
                    }`}>
                      {selectedPlan === plan.id && (
                        <div className="w-2.5 h-2.5 bg-white rounded-full" />
                      )}
                    </div>
                  </div>
                  
                  <div className="mb-3">
                    <div className="flex items-baseline mb-1">
                      <span className="text-3xl font-bold text-gray-900">
                        ${plan.weeklyPrice.toFixed(2)}
                      </span>
                      <span className="text-base font-normal text-gray-500 ml-1">/week</span>
                    </div>
                    <div className="text-sm text-gray-600 mb-2">
                      ${plan.totalPrice} billed {plan.id === 'weekly' ? 'weekly' : plan.id === 'monthly' ? 'monthly' : 'quarterly'}
                    </div>
                    {plan.savings && (
                      <Badge variant="secondary" className="bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 border-green-200/60 font-medium px-2 py-0.5 text-xs">
                        {plan.savings}
                      </Badge>
                    )}
                  </div>

                  {/* Value proposition */}
                  <div className="mt-auto">
                    <div className="text-xs text-gray-500 text-center font-normal">
                      {plan.id === 'weekly' && 'Perfect for testing'}
                      {plan.id === 'monthly' && 'Best value for most users'}
                      {plan.id === 'quarterly' && 'Maximum savings'}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Fixed Footer */}
        <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-3">
          <Button 
            onClick={handleSubscribe}
            disabled={isLoading}
            className="w-full bg-teal-600 hover:bg-teal-700 text-white py-2.5 text-base font-semibold"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              `Upgrade to Pro - $${plans.find(p => p.id === selectedPlan)?.weeklyPrice.toFixed(2)}/week`
            )}
          </Button>
          <p className="text-xs text-gray-500 text-center mt-1">
            Secure payment powered by Stripe. Cancel anytime.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
} 