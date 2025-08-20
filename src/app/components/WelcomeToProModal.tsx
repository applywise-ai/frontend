'use client';

import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogTitle } from '@/app/components/ui/dialog';
import { Button } from '@/app/components/ui/button';
import { Card, CardContent } from '@/app/components/ui/card';
import { 
  Crown, 
  Zap, 
  Target, 
  FileText, 
  CheckCircle, 
  ArrowRight,
  Sparkles,
  TrendingUp,
  X
} from 'lucide-react';

interface WelcomeToProModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface FeatureStep {
  id: number;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  benefit: string;
  color: string;
  bgColor: string;
  animation: string;
}

const features: FeatureStep[] = [
  {
    id: 1,
    icon: FileText,
    title: "One-Click Cover Letters",
    description: "Generate personalized cover letters instantly for any job application",
    benefit: "Save 30+ minutes per application",
    color: "text-blue-600",
    bgColor: "from-blue-50 to-blue-100",
    animation: "bounce"
  },
  {
    id: 2,
    icon: Target,
    title: "Custom AI-Generated Answers",
    description: "Get tailored responses for application questions based on your profile",
    benefit: "3x higher response rates",
    color: "text-emerald-600", 
    bgColor: "from-emerald-50 to-emerald-100",
    animation: "pulse"
  },
  {
    id: 3,
    icon: TrendingUp,
    title: "High Accuracy Responses",
    description: "Advanced AI ensures your applications match job requirements perfectly",
    benefit: "95% accuracy guarantee",
    color: "text-purple-600",
    bgColor: "from-purple-50 to-purple-100", 
    animation: "ping"
  }
];

export default function WelcomeToProModal({ isOpen, onClose }: WelcomeToProModalProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  // Auto-cycle through steps
  useEffect(() => {
    if (!isOpen) return;

    const interval = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentStep((prev) => (prev + 1) % features.length);
        setIsAnimating(false);
      }, 300);
    }, 3000);

    return () => clearInterval(interval);
  }, [isOpen]);

  // Reset to first step when modal opens
  useEffect(() => {
    if (isOpen) {
      setCurrentStep(0);
      setIsAnimating(false);
    }
  }, [isOpen]);

  const currentFeature = features[currentStep];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-full h-full sm:max-w-4xl sm:w-[calc(100vw-2rem)] sm:mx-auto sm:h-auto p-0 overflow-hidden bg-gradient-to-br from-teal-50 via-white to-emerald-50 sm:max-h-[90vh] overflow-y-auto sm:rounded-lg">
        {/* Hidden DialogTitle for accessibility */}
        <DialogTitle className="sr-only">
          Welcome to Pro - Access Your Premium Features
        </DialogTitle>
        
        {/* Header */}
        <div className="relative px-4 sm:px-8 pt-4 sm:pt-6 pb-3 sm:pb-4 text-center">
          {/* Animated background elements */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-teal-200/30 to-emerald-200/30 rounded-full animate-pulse"></div>
            <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-gradient-to-br from-blue-200/20 to-purple-200/20 rounded-full animate-bounce"></div>
          </div>
          
          <div className="relative z-10">
            <div className="inline-flex items-center justify-center w-10 h-10 sm:w-14 sm:h-14 bg-gradient-to-br from-teal-500 to-emerald-600 rounded-full mb-2 sm:mb-3 shadow-lg">
              <Crown className="w-5 h-5 sm:w-7 sm:h-7 text-white" />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1 sm:mb-2">
              Welcome to Pro! 🎉
            </h1>
            <p className="text-sm sm:text-base text-gray-600">
              You now have access to our most powerful AI features
            </p>
          </div>
        </div>

        {/* Feature Showcase */}
        <div className="px-4 sm:px-8 pb-3 sm:pb-4">
          <Card className={`relative overflow-hidden border-2 transition-all duration-500 ${
            isAnimating ? 'scale-95 opacity-80' : 'scale-100 opacity-100'
          }`}>
            <div className={`absolute inset-0 bg-gradient-to-br ${currentFeature.bgColor} opacity-50`}></div>
            
            <CardContent className="relative p-3 sm:p-4 lg:p-6">
              {/* Step indicator */}
              <div className="flex justify-center mb-3 sm:mb-4">
                <div className="flex space-x-2">
                  {features.map((_, index) => (
                    <div
                      key={index}
                      className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full transition-all duration-300 ${
                        index === currentStep 
                          ? 'bg-teal-500 scale-125' 
                          : index < currentStep 
                            ? 'bg-teal-300' 
                            : 'bg-gray-300'
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Desktop Layout - Side by side */}
              <div className="lg:flex lg:items-center lg:gap-8">
                {/* Icon section */}
                <div className="flex-shrink-0 text-center lg:text-left mb-3 lg:mb-0">
                  <div className={`inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 lg:w-20 lg:h-20 rounded-full mb-3 lg:mb-0 ${
                    currentFeature.animation === 'bounce' ? 'animate-bounce' :
                    currentFeature.animation === 'pulse' ? 'animate-pulse' :
                    'animate-ping'
                  } bg-white shadow-lg`}>
                    <currentFeature.icon className={`w-7 h-7 sm:w-8 sm:h-8 lg:w-10 lg:h-10 ${currentFeature.color}`} />
                  </div>
                </div>

                {/* Content section */}
                <div className="flex-1 text-center lg:text-left">
                  <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-1 sm:mb-2">
                    {currentFeature.title}
                  </h3>
                  <p className="text-gray-600 mb-2 sm:mb-3 text-sm sm:text-base leading-relaxed">
                    {currentFeature.description}
                  </p>
                  
                  {/* Benefit badge */}
                  <div className="inline-flex items-center px-3 sm:px-4 py-1 sm:py-1.5 bg-white rounded-full shadow-md border-2 border-teal-200">
                    <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-teal-500 mr-2" />
                    <span className="font-semibold text-teal-700 text-xs sm:text-sm">
                      {currentFeature.benefit}
                    </span>
                  </div>
                </div>
              </div>

              {/* Progress visualization */}
              <div className="mt-4 sm:mt-5">
                <div className="flex items-center justify-between text-xs text-gray-500 mb-1.5">
                  <span>Feature {currentStep + 1} of {features.length}</span>
                  <span className="hidden sm:inline">Auto-cycling</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1.5">
                  <div 
                    className="bg-gradient-to-r from-teal-500 to-emerald-500 h-1.5 rounded-full transition-all duration-300"
                    style={{ width: `${((currentStep + 1) / features.length) * 100}%` }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Feature list preview */}
        <div className="px-4 sm:px-8 pb-3 sm:pb-4">
          <div className="grid grid-cols-3 gap-2 sm:gap-4">
            {features.map((feature, index) => (
              <div
                key={feature.id}
                className={`p-2 sm:p-4 rounded-lg border-2 transition-all duration-300 cursor-pointer ${
                  index === currentStep 
                    ? 'border-teal-300 bg-teal-50 scale-105' 
                    : 'border-gray-200 bg-white hover:border-teal-200'
                }`}
                onClick={() => setCurrentStep(index)}
              >
                <feature.icon className={`w-4 h-4 sm:w-6 sm:h-6 ${feature.color} mx-auto mb-1 sm:mb-2`} />
                <p className="text-xs sm:text-sm font-medium text-gray-700 text-center leading-tight">
                  {feature.title}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Action buttons */}
        <div className="px-4 sm:px-8 pb-4 sm:pb-6">
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <Button
              variant="outline"
              className="flex-1 order-2 sm:order-1"
              onClick={onClose}
            >
              <X className="w-4 h-4 mr-2" />
              Close
            </Button>
            <Button
              className="flex-1 order-1 sm:order-2 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700"
              onClick={onClose}
            >
              <Zap className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Start Using Pro</span>
              <span className="sm:hidden">Get Started</span>
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
          
          <p className="text-center text-xs text-gray-500 mt-2 sm:mt-3">
            Your Pro features are now active and ready to use!
          </p>
        </div>

        {/* Floating success indicators */}
        <div className="absolute top-3 left-3 sm:top-4 sm:left-4">
          <div className="flex items-center space-x-1">
            <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-500" />
            <span className="text-xs sm:text-sm font-medium text-emerald-600">Active</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
