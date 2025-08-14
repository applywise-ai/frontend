'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/contexts/AuthContext';
import Link from 'next/link';
import { 
  Zap,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Briefcase,
  Rocket,
  Bot,
  FileText,
  Calendar,
  Target,
  TrendingUp,
  Play,
  ChevronRight,
  Shield,
  Award,
  Globe,
  Brain,
  Lightbulb,
  Timer,
  Plus,
  Minus,
  HelpCircle
} from 'lucide-react';
import { Card, CardContent } from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';
import WelcomeModal from '@/app/components/WelcomeModal';

export default function Home() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();
  const [activeFeature, setActiveFeature] = useState(0);
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);

  useEffect(() => {
    // Redirect if user is already logged in
    if (!isLoading && isAuthenticated) {
          router.push('/jobs');
        }
  }, [isLoading, isAuthenticated, router]);

  const features = [
    {
      icon: Bot,
      title: "AI-Powered Applications",
      description: "Our AI analyzes job descriptions and crafts personalized responses that match exactly what employers are looking for.",
      demo: "Watch AI fill out a complex application in 30 seconds",
      color: "from-blue-500 to-indigo-600"
    },
    {
      icon: FileText,
      title: "Smart Cover Letters",
      description: "Generate compelling, personalized cover letters that highlight your relevant experience for each specific role.",
      demo: "See how AI creates unique cover letters for different industries",
      color: "from-teal-500 to-emerald-600"
    },
    {
      icon: Target,
      title: "Intelligent Job Matching",
      description: "Advanced algorithms find opportunities that perfectly match your skills, experience, and career goals.",
      demo: "Discover how we match you with 10K+ up-to-date jobs",
      color: "from-purple-500 to-pink-600"
    },
    {
      icon: Calendar,
      title: "Auto-Apply Scheduling",
      description: "Set it and forget it. Our system applies to your top matches automatically while you sleep.",
      demo: "Coming soon: Apply to 20+ jobs daily on autopilot",
      color: "from-orange-500 to-red-600"
    }
  ];

  const stats = [
    { number: "3.2x", label: "More Interviews", icon: TrendingUp },
    { number: "10K+", label: "Active Jobs", icon: Briefcase },
    { number: "85%", label: "Response Rate", icon: Target },
    { number: "30sec", label: "Application Time", icon: Timer }
  ];

  const faqs = [
    {
      question: "How does ApplyWise's AI actually work?",
      answer: "Our AI analyzes job descriptions to understand exactly what employers are looking for, then crafts personalized responses using your profile information. It matches your experience to job requirements and generates tailored applications that highlight your most relevant skills and achievements."
    },
    {
      question: "Is my personal information secure?",
      answer: "Absolutely. We use enterprise-grade encryption to protect your data. Your information is never shared with third parties without your explicit consent. We only use your data to improve your job applications and provide you with better matching opportunities."
    },
    {
      question: "How many applications can I send with the free plan?",
      answer: "The free plan includes 10 AI applications that refresh daily to let you experience the power of our platform. You can browse unlimited jobs and use our job matching features. Upgrade to Pro for unlimited AI applications and cover letter generation."
    },
    {
      question: "Can I customize the AI-generated applications?",
      answer: "Yes! While our AI creates highly personalized applications, you can always review and edit them before submitting. You have full control over what gets sent to employers, and you can adjust the tone and content to match your preferences."
    },
    {
      question: "What job platforms does ApplyWise support?",
      answer: "ApplyWise currently supports major job platforms including Greenhouse, Lever, Workable, and Ashby. We're continuously adding support for more platforms to ensure you can apply everywhere your dream job might be posted. More integrations coming soon!"
    },
    {
      question: "Do I need to create separate profiles for different job types?",
      answer: "No! ApplyWise automatically tailors your applications based on each job description. Our AI analyzes the specific requirements and highlights the most relevant parts of your experience, so one comprehensive profile works for all your applications across different roles and industries."
    }
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900" />
    );
  }

  return (
    <div className="bg-gray-900 text-white overflow-hidden">
      {/* Hero Section with Interactive Elements */}
      <section className="relative min-h-screen flex flex-col items-center justify-center p-8 md:p-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-900/20 to-gray-900 z-0"></div>
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
        
        {/* Floating Elements */}
        <div className="absolute top-20 left-10 animate-bounce delay-1000">
          <div className="bg-blue-500/20 p-3 rounded-full">
            <Sparkles className="h-6 w-6 text-blue-400" />
          </div>
        </div>
        <div className="absolute top-32 right-16 animate-bounce delay-2000">
          <div className="bg-teal-500/20 p-3 rounded-full">
            <Rocket className="h-6 w-6 text-teal-400" />
          </div>
        </div>
        
        <div className="relative z-10 text-center max-w-5xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 sm:px-6 sm:py-3 rounded-full bg-gradient-to-r from-blue-500/10 to-teal-500/10 text-blue-400 mb-6 sm:mb-8 border border-blue-500/20">
            <Sparkles className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="text-xs sm:text-sm font-medium">Make job searching easier</span>
            <Badge className="bg-teal-600 text-white text-xs">New Platform</Badge>
          </div>
          
          <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 sm:mb-8 leading-tight">
          Your Job Search on <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-teal-400 to-purple-400">
            Autopilot
            </span>
          </h1>
          
          <p className="mt-4 sm:mt-6 text-base sm:text-lg text-gray-300 max-w-3xl mx-auto mb-8 sm:mb-12 leading-relaxed px-4 sm:px-0">
          Our AI agent fills and personalizes applications so you can focus on landing offers.
          </p>
          
          {/* Interactive CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center mt-6 sm:mt-8 px-4 sm:px-0">
            <Link 
              href="/signup" 
              className="group relative px-6 py-4 sm:px-10 sm:py-5 bg-gradient-to-r from-blue-600 to-teal-600 text-white font-semibold rounded-2xl hover:from-blue-700 hover:to-teal-700 transition-all duration-300 flex items-center justify-center gap-2 sm:gap-3 shadow-2xl hover:shadow-blue-500/25 transform hover:scale-105 text-sm sm:text-base"
            >
              <Zap className="h-4 w-4 sm:h-5 sm:w-5" />
              Start Quick Applying
              <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 group-hover:translate-x-1 transition-transform" />
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-teal-400 rounded-2xl opacity-0 group-hover:opacity-20 transition-opacity"></div>
            </Link>
            <button className="group px-6 py-4 sm:px-10 sm:py-5 bg-gray-800/80 backdrop-blur-sm text-white font-semibold rounded-2xl hover:bg-gray-700/80 transition-all duration-300 flex items-center justify-center gap-2 sm:gap-3 border border-gray-700 hover:border-gray-600 text-sm sm:text-base" onClick={() => setIsDemoModalOpen(true)}>
              <Play className="h-4 w-4 sm:h-5 sm:w-5" />
              Watch 2-Min Demo
            </button>
          </div>

          {/* Trust Indicators */}
          <div className="mt-12 sm:mt-16 flex flex-wrap justify-center items-center gap-4 sm:gap-8 text-gray-400 px-4 sm:px-0">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 sm:h-5 sm:w-5 text-green-400" />
              <span className="text-xs sm:text-sm">Secure & Private</span>
            </div>
            <div className="flex items-center gap-2">
              <Award className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-400" />
              <span className="text-xs sm:text-sm">AI-Powered</span>
            </div>
            <div className="flex items-center gap-2">
              <Globe className="h-4 w-4 sm:h-5 sm:w-5 text-blue-400" />
              <span className="text-xs sm:text-sm">New Jobs Daily</span>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 sm:py-20 px-4 sm:px-8 md:px-24 bg-gray-800/30 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center group">
                <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-4 sm:p-6 rounded-2xl border border-gray-700 hover:border-blue-500/50 transition-all duration-300 group-hover:scale-105">
                  <stat.icon className="h-6 w-6 sm:h-8 sm:w-8 text-blue-400 mx-auto mb-3 sm:mb-4" />
                  <div className="text-2xl sm:text-3xl font-bold text-white mb-1 sm:mb-2">{stat.number}</div>
                  <div className="text-gray-400 text-xs sm:text-sm">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Features Showcase */}
      <section className="py-20 sm:py-32 px-4 sm:px-8 md:px-24 bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 sm:mb-20">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 sm:mb-6">
              See How AI Elevates Your{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-teal-400">
                Job Search
              </span>
            </h2>
            <p className="text-gray-400 text-base sm:text-lg max-w-3xl mx-auto px-4 sm:px-0">
              Watch our AI work its magic. From analyzing job descriptions to crafting perfect responses, 
              see how we make you stand out from the crowd.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-16 items-center">
            {/* Feature Navigation */}
            <div className="space-y-4 sm:space-y-6">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className={`p-4 sm:p-6 rounded-2xl border cursor-pointer transition-all duration-300 ${
                    activeFeature === index
                      ? 'bg-gradient-to-r from-gray-800 to-gray-700 border-blue-500 shadow-lg shadow-blue-500/20'
                      : 'bg-gray-800/50 border-gray-700 hover:border-gray-600'
                  }`}
                  onClick={() => setActiveFeature(index)}
                >
                  <div className="flex items-start gap-3 sm:gap-4">
                    <div className={`p-2 sm:p-3 rounded-xl bg-gradient-to-r ${feature.color}`}>
                      <feature.icon className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl sm:text-2xl font-semibold text-white mb-1 sm:mb-2">{feature.title}</h3>
                      <p className="text-gray-400 mb-2 sm:mb-3 text-sm sm:text-base">{feature.description}</p>
                      <div className="flex items-center gap-2 text-blue-400 text-xs sm:text-sm font-medium">
                        <Play className="h-3 w-3 sm:h-4 sm:w-4" />
                        {feature.demo}
                      </div>
                    </div>
                    <ChevronRight className={`h-4 w-4 sm:h-5 sm:w-5 text-gray-400 transition-transform ${
                      activeFeature === index ? 'rotate-90' : ''
                    }`} />
                  </div>
                </div>
              ))}
            </div>

            {/* Feature Demo Area */}
            <div className="relative">
              <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl p-4 sm:p-8 border border-gray-700 shadow-2xl">
                <div className="flex items-center gap-3 mb-4 sm:mb-6">
                  <div className="flex gap-2">
                    <div className="w-2 h-2 sm:w-3 sm:h-3 bg-red-500 rounded-full"></div>
                    <div className="w-2 h-2 sm:w-3 sm:h-3 bg-yellow-500 rounded-full"></div>
                    <div className="w-2 h-2 sm:w-3 sm:h-3 bg-green-500 rounded-full"></div>
                  </div>
                  <div className="text-gray-400 text-xs sm:text-sm">ApplyWise AI Demo</div>
                </div>

                {/* Dynamic Demo Content */}
                <div className="space-y-4">
                  {activeFeature === 0 && (
                    <div className="space-y-4">
                      <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                        <div className="text-blue-400 text-sm mb-2">Job Description Analysis</div>
                        <div className="text-white text-sm">✓ Required: React, TypeScript, 3+ years</div>
                        <div className="text-white text-sm">✓ Preferred: Next.js, GraphQL</div>
                      </div>
                      <div className="bg-teal-500/10 border border-teal-500/20 rounded-lg p-4">
                        <div className="text-teal-400 text-sm mb-2">AI Response Generation</div>
                        <div className="text-white text-sm">&ldquo;I have 4 years of React and TypeScript experience, with extensive Next.js and GraphQL expertise...&rdquo;</div>
                      </div>
                      <div className="flex items-center gap-2 text-green-400 text-sm">
                        <CheckCircle2 className="h-4 w-4" />
                        Application completed in 28 seconds
                      </div>
                    </div>
                  )}
                  
                  {activeFeature === 1 && (
                    <div className="space-y-4">
                      <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-4">
                        <div className="text-purple-400 text-sm mb-2">Cover Letter Preview</div>
                        <div className="text-white text-sm">&ldquo;Dear Hiring Manager,</div>
                        <div className="text-white text-sm">I am excited to apply for the Senior Developer position at TechCorp. My 5 years of experience in React and passion for innovative solutions make me an ideal candidate...&rdquo;</div>
                      </div>
                      <div className="flex items-center gap-2 text-green-400 text-sm">
                        <CheckCircle2 className="h-4 w-4" />
                        Personalized for company culture & role
                      </div>
                    </div>
                  )}
                  
                  {activeFeature === 2 && (
                    <div className="space-y-4">
                      <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-4">
                        <div className="text-orange-400 text-sm mb-2">Smart Matching Results</div>
                        <div className="space-y-2">
                          <div className="flex justify-between text-white text-sm">
                            <span>Senior React Developer - Netflix</span>
                            <span className="text-green-400">98% match</span>
                          </div>
                          <div className="flex justify-between text-white text-sm">
                            <span>Frontend Lead - Spotify</span>
                            <span className="text-green-400">95% match</span>
                          </div>
                          <div className="flex justify-between text-white text-sm">
                            <span>Full Stack Engineer - Airbnb</span>
                            <span className="text-yellow-400">87% match</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {activeFeature === 3 && (
                    <div className="space-y-4">
                      <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
                        <div className="text-red-400 text-sm mb-2">Auto-Apply Schedule</div>
                        <div className="space-y-2">
                          <div className="flex justify-between text-white text-sm">
                            <span>Daily Applications</span>
                            <span>20 jobs</span>
                          </div>
                          <div className="flex justify-between text-white text-sm">
                            <span>Best Time</span>
                            <span>9 AM - 11 AM</span>
                          </div>
                          <div className="flex justify-between text-white text-sm">
                            <span>Success Rate</span>
                            <span className="text-green-400">85%</span>
                          </div>
                        </div>
                      </div>
                      <Badge className="bg-amber-600 text-white">Coming Soon</Badge>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Carousel */}
      {/*
      <section className="py-20 sm:py-32 px-4 sm:px-8 md:px-24 bg-gradient-to-br from-gray-800 to-gray-900">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 sm:mb-6">
              Success Stories from Early Users
            </h2>
            <p className="text-gray-400 text-base sm:text-lg px-4 sm:px-0">
              See how ApplyWise is already transforming careers
            </p>
          </div>

          <div className="relative">
            <Card className="bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700 shadow-2xl">
              <CardContent className="p-6 sm:p-12">
                <div className="flex flex-col md:flex-row items-center gap-6 sm:gap-8">
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-blue-500 to-teal-500 rounded-full flex items-center justify-center text-white font-bold text-lg sm:text-xl">
                      {testimonials[currentTestimonial].avatar}
                    </div>
                  </div>
                  <div className="flex-1 text-center md:text-left">
                    <div className="flex justify-center md:justify-start mb-3 sm:mb-4">
                      {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-400 fill-current" />
                      ))}
                    </div>
                    <blockquote className="text-base sm:text-lg text-white mb-4 sm:mb-6 leading-relaxed">
                      &ldquo;{testimonials[currentTestimonial].content}&rdquo;
                    </blockquote>
                    <div>
                      <div className="font-semibold text-white text-base sm:text-lg">
                        {testimonials[currentTestimonial].name}
                      </div>
                      <div className="text-gray-400 text-sm sm:text-base">
                        {testimonials[currentTestimonial].role} at {testimonials[currentTestimonial].company}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
      
            <div className="flex justify-center mt-6 sm:mt-8 gap-3">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all duration-300 ${
                    currentTestimonial === index ? 'bg-blue-500' : 'bg-gray-600'
                  }`}
                  onClick={() => setCurrentTestimonial(index)}
                />
              ))}
            </div>
          </div>
        </div>
      </section> */}
      
      {/* FAQ Section */}
      <section className="py-20 sm:py-32 px-4 sm:px-8 md:px-24 bg-gradient-to-br from-gray-800/50 to-gray-900/80">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8 sm:mb-12 md:mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2 md:px-6 md:py-3 rounded-full bg-gradient-to-r from-blue-500/10 to-teal-500/10 text-blue-400 mb-4 sm:mb-6 md:mb-8 border border-blue-500/20">
              <HelpCircle className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="text-xs sm:text-sm font-medium">Got Questions?</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 sm:mb-6 px-4 sm:px-0">
              Frequently Asked{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-teal-400">
                Questions
              </span>
            </h2>
            <p className="text-base sm:text-lg text-gray-400 max-w-2xl mx-auto px-4 sm:px-0 leading-relaxed">
              Everything you need to know about ApplyWise and how it can transform your job search.
            </p>
          </div>

          <div className="space-y-4 sm:space-y-6">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="bg-gradient-to-r from-gray-800/50 to-gray-800/30 border border-gray-700 rounded-2xl overflow-hidden hover:border-blue-500/30 transition-all duration-300"
              >
                <button
                  className="w-full px-4 py-4 sm:px-6 sm:py-6 md:px-8 md:py-8 text-left flex items-start justify-between gap-3 sm:gap-4 hover:bg-gray-700/20 transition-colors duration-200"
                  onClick={() => setOpenFAQ(openFAQ === index ? null : index)}
                >
                  <h3 className="text-lg sm:text-xl font-semibold text-white pr-4">
                    {faq.question}
                  </h3>
                  <div className="flex-shrink-0">
                    {openFAQ === index ? (
                      <Minus className="h-5 w-5 sm:h-6 sm:w-6 text-blue-400 transition-transform duration-200" />
                    ) : (
                      <Plus className="h-5 w-5 sm:h-6 sm:w-6 text-gray-400 transition-transform duration-200" />
                    )}
                  </div>
                </button>
                
                <div 
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    openFAQ === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                  }`}
                >
                  <div className="px-4 pb-4 sm:px-6 sm:pb-6 md:px-8 md:pb-8">
                    <div className="border-t border-gray-700 pt-4 sm:pt-6">
                      <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Additional Help CTA */}
          <div className="text-center mt-8 sm:mt-12 md:mt-16 px-4 sm:px-0">
            <p className="text-gray-400 mb-4 sm:mb-6 text-sm sm:text-base">
              Still have questions? We&apos;re here to help.
            </p>
            <Link 
              href="/signup" 
              className="inline-flex items-center gap-2 px-4 py-2 sm:px-6 sm:py-3 md:px-8 md:py-4 bg-gradient-to-r from-blue-600/20 to-teal-600/20 text-blue-400 font-medium rounded-xl hover:from-blue-600/30 hover:to-teal-600/30 transition-all duration-300 border border-blue-500/30 hover:border-blue-500/50 text-sm sm:text-base"
            >
              <Brain className="h-4 w-4 sm:h-5 sm:w-5" />
              Get Started Free
            </Link>
          </div>
        </div>
      </section>

      {/* Pricing Teaser */}
      <section className="py-20 sm:py-32 px-4 sm:px-8 md:px-24 bg-gradient-to-br from-gray-800 to-gray-900">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 sm:mb-6">
            Start Free, Upgrade When Ready
          </h2>
          <p className="text-gray-400 text-base sm:text-lg mb-8 sm:mb-12 max-w-2xl mx-auto px-4 sm:px-0">
            Get started with some AI applications. See the results, then unlock unlimited power.
          </p>

          <div className="grid md:grid-cols-2 gap-6 sm:gap-8 mb-8 sm:mb-12">
            {/* Free Plan */}
            <Card className="bg-gray-800/50 border-gray-700">
              <CardContent className="p-6 sm:p-8">
                <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 sm:mb-4">Free</h3>
                <div className="text-3xl sm:text-4xl font-bold text-white mb-4 sm:mb-6">$0</div>
                <ul className="space-y-2 sm:space-y-3 text-left">
                  <li className="flex items-center gap-2 sm:gap-3 text-gray-300 text-sm sm:text-base">
                    <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5 text-green-400" />
                    Unlimited job browsing
                  </li>
                  <li className="flex items-center gap-2 sm:gap-3 text-gray-300 text-sm sm:text-base">
                    <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5 text-green-400" />
                    Advanced job matching
                  </li>
                  <li className="flex items-center gap-2 sm:gap-3 text-gray-300 text-sm sm:text-base">
                    <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5 text-green-400" />
                    Limited AI applications
                  </li>
                  <li className="flex items-center gap-2 sm:gap-3 text-gray-300 text-sm sm:text-base">
                    <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5 text-green-400" />
                    Basic application tracking
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Pro Plan */}
            <Card className="bg-gradient-to-br from-blue-500/10 to-teal-500/10 border-blue-500/50 relative">
              <div className="absolute -top-3 sm:-top-4 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-gradient-to-r from-blue-600 to-teal-600 text-white px-3 py-1 sm:px-4 text-xs sm:text-sm">
                  Most Popular
                </Badge>
              </div>
              <CardContent className="p-6 sm:p-8">
                <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 sm:mb-4">Pro</h3>
                <div className="flex items-baseline justify-center gap-2 mb-4 sm:mb-6">
                  <div className="text-3xl sm:text-4xl font-bold text-white">$6.25</div>
                  <div className="text-gray-400 text-sm sm:text-base">/week</div>
                </div>
                <ul className="space-y-2 sm:space-y-3 text-left">
                  <li className="flex items-center gap-2 sm:gap-3 text-gray-300 text-sm sm:text-base">
                    <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5 text-green-400" />
                    Unlimited AI applications
                  </li>
                  <li className="flex items-center gap-2 sm:gap-3 text-gray-300 text-sm sm:text-base">
                    <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5 text-green-400" />
                    AI cover letter generation
                  </li>
                  <li className="flex items-center gap-2 sm:gap-3 text-gray-300 text-sm sm:text-base">
                    <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5 text-green-400" />
                    Unlimited personalized responses
                  </li>
                  <li className="flex items-center gap-2 sm:gap-3 text-gray-300 text-sm sm:text-base">
                    <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5 text-green-400" />
                    Smarter AI-generated answers
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 sm:py-32 px-4 sm:px-8 md:px-24 bg-gradient-to-br from-blue-900/20 to-teal-900/20">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 sm:px-6 sm:py-3 rounded-full bg-gradient-to-r from-blue-500/10 to-teal-500/10 text-blue-400 mb-6 sm:mb-8 border border-blue-500/20">
            <Lightbulb className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="text-xs sm:text-sm font-medium">Get that job you deserve</span>
          </div>
          
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 sm:mb-6">
            Ready to 3x Your Interview Rate?
          </h2>
          <p className="text-gray-400 text-base sm:text-lg mb-8 sm:mb-12 max-w-2xl mx-auto px-4 sm:px-0">
            Be among the first to use AI to land your dream job faster than ever before.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center">
            <Link 
              href="/signup" 
              className="group px-8 py-4 sm:px-12 sm:py-6 bg-gradient-to-r from-blue-600 to-teal-600 text-white font-semibold rounded-2xl hover:from-blue-700 hover:to-teal-700 transition-all duration-300 flex items-center justify-center gap-2 sm:gap-3 shadow-2xl hover:shadow-blue-500/25 transform hover:scale-105 text-sm sm:text-base"
            >
              <Rocket className="h-5 w-5 sm:h-6 sm:w-6" />
              Get Started Free
              <ArrowRight className="h-5 w-5 sm:h-6 sm:w-6 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link 
              href="/login" 
              className="px-8 py-4 sm:px-12 sm:py-6 bg-gray-800/80 backdrop-blur-sm text-white font-semibold rounded-2xl hover:bg-gray-700/80 transition-all duration-300 border border-gray-700 hover:border-gray-600 text-sm sm:text-base"
            >
              Sign In
            </Link>
          </div>
          
          <div className="mt-8 sm:mt-12 text-gray-500 text-xs sm:text-sm">
            No credit card required • Limited AI applications • Upgrade anytime
          </div>
        </div>
      </section>

      {/* Welcome Modal */}
      <WelcomeModal 
        isOpen={isDemoModalOpen} 
        onClose={() => setIsDemoModalOpen(false)} 
        mode="demo"
      />
    </div>
  );
}