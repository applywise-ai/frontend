'use client';

import { BookOpen, Bug, Lightbulb, ArrowRight, Sparkles, HelpCircle } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import React, { useState } from 'react';
import ProtectedPage from '@/app/components/auth/ProtectedPage';
import ModernHelpModal from '@/app/components/help/ModernHelpModal';

function HelpPageContent() {
  const [bugModalOpen, setBugModalOpen] = useState(false);
  const [featureModalOpen, setFeatureModalOpen] = useState(false);

  return (
    <div className="bg-gray-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-teal-600 to-teal-700 py-12 sm:py-16">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-10"></div>
        <div className="absolute top-6 right-6 opacity-20">
          <Sparkles className="h-6 w-6 text-white animate-pulse" />
        </div>
        <div className="absolute bottom-6 left-6 opacity-20">
          <HelpCircle className="h-5 w-5 text-white animate-bounce" />
        </div>
        
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl mb-4">
              <HelpCircle className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 tracking-tight">
              How can we{' '}
              <span className="text-teal-200">
                help you?
              </span>
            </h1>
            <p className="text-lg sm:text-xl text-teal-100 max-w-2xl mx-auto leading-relaxed">
              Find answers, report issues, or suggest improvements to make Applywise better for everyone
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative -mt-8 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-0">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Help Center Card */}
          <a
            href="https://applywise.notion.site/Applywise-Help-Center-2e2e2e2e2e2e2e2e2e2e2e2e2e2e2e2e"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 overflow-hidden"
          >
            {/* Subtle Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-teal-50/50 to-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            
            <div className="relative z-10 flex flex-col h-full">
              <div className="flex-shrink-0">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-teal-600 rounded-xl mb-4 group-hover:scale-105 transition-transform duration-300">
                  <BookOpen className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-teal-700 transition-colors">
                  Help Center
                </h3>
              </div>
              
              <div className="flex-grow">
                <p className="text-gray-600 leading-relaxed mb-4 text-sm sm:text-base">
                  Browse FAQs, guides, and get answers to common questions about Applywise.
                </p>
              </div>
              
              <div className="flex items-center text-teal-600 font-semibold group-hover:text-teal-700 transition-colors text-sm">
                <span>Visit Help Center</span>
                <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </a>

          {/* Feature Suggestion Card */}
          <div
            className="group relative bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 cursor-pointer overflow-hidden md:col-span-1 lg:col-span-1"
            onClick={() => setFeatureModalOpen(true)}
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                setFeatureModalOpen(true);
              }
            }}
          >
            {/* Subtle Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-yellow-50/50 to-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            
            <div className="relative z-10 flex flex-col h-full">
              <div className="flex-shrink-0">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-yellow-500 rounded-xl mb-4 group-hover:scale-105 transition-transform duration-300">
                  <Lightbulb className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-yellow-700 transition-colors">
                  Suggest a Feature
                </h3>
              </div>
              
              <div className="flex-grow">
                <p className="text-gray-600 leading-relaxed mb-4 text-sm sm:text-base">
                  Have an idea to make Applywise better? Share your feature suggestions with us.
                </p>
              </div>
              
              <div className="flex items-center text-yellow-600 font-semibold group-hover:text-yellow-700 transition-colors text-sm">
                <span>Share Your Idea</span>
                <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>

          {/* Bug Report Card */}
          <div
            className="group relative bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 cursor-pointer overflow-hidden md:col-span-2 lg:col-span-1"
            onClick={() => setBugModalOpen(true)}
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                setBugModalOpen(true);
              }
            }}
          >
            {/* Subtle Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-red-50/50 to-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            
            <div className="relative z-10 flex flex-col h-full">
              <div className="flex-shrink-0">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-red-500 rounded-xl mb-4 group-hover:scale-105 transition-transform duration-300">
                  <Bug className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-red-700 transition-colors">
                  Report a Bug
                </h3>
              </div>
              
              <div className="flex-grow">
                <p className="text-gray-600 leading-relaxed mb-4 text-sm sm:text-base">
                  Found something not working? Let us know about any bugs or issues.
                </p>
              </div>
              
              <div className="flex items-center text-red-600 font-semibold group-hover:text-red-700 transition-colors text-sm">
                <span>Report Issue</span>
                <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>
        </div>

        {/* Bottom CTA Section */}
        <div className="mt-12 mb-6 text-center">
          <div className="inline-flex items-center justify-center w-10 h-10 bg-teal-600 rounded-lg mb-3">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
            Still need help?
          </h2>
          <p className="text-gray-600 mb-6 max-w-md mx-auto text-sm sm:text-base">
            Our support team is here to help you get the most out of Applywise
          </p>
          <Button 
            className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-2.5 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5"
            onClick={() => window.open('mailto:support@applywise.com', '_blank')}
          >
            Contact Support
          </Button>
        </div>
      </div>

      {/* Modern Feature Suggestion Modal */}
      <ModernHelpModal
        open={featureModalOpen}
        onOpenChange={setFeatureModalOpen}
        type="feature_suggestion"
      />

      {/* Modern Bug Report Modal */}
      <ModernHelpModal
        open={bugModalOpen}
        onOpenChange={setBugModalOpen}
        type="bug_report"
      />
    </div>
  );
}

export default function HelpPage() {
  return (
    <ProtectedPage>
      <HelpPageContent />
    </ProtectedPage>
  );
} 