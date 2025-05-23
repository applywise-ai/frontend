'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/app/utils/firebase';
import Link from 'next/link';
import { 
  Zap,
  BarChart2, 
  Users, 
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Briefcase,
  Rocket
} from 'lucide-react';
import Image from 'next/image';

export default function Home() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    const checkAuth = async () => {
      try {
        const user = await authService.isLoggedIn();
        if (user) {
          // Redirect to jobs page if already authenticated
          router.push('/jobs');
        }
      } catch (error) {
        console.error('Error checking authentication status:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900" />
    );
  }

  return (
    <div className="bg-gray-900 text-white">
      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col items-center justify-center p-8 md:p-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-900/20 to-gray-900 z-0"></div>
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
        
        <div className="relative z-10 text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 text-blue-400 mb-8">
            <Sparkles className="h-4 w-4" />
            <span className="text-sm font-medium">Apply to Jobs in One Click</span>
          </div>
          
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
            Land Your Dream Job with{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-teal-400">
              Smart Job Matching
            </span>
          </h1>
          
          <p className="mt-4 text-lg sm:text-xl text-gray-300 max-w-2xl mx-auto mb-8 leading-relaxed">
            Find the perfect opportunities and apply to multiple jobs with just one click. Save time and focus on what matters.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-6">
            <Link 
              href="/signup" 
              className="group px-8 py-4 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-all duration-300 flex items-center justify-center gap-2"
            >
              Get Started Free
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link 
              href="/login" 
              className="px-8 py-4 bg-gray-800 text-white font-medium rounded-xl hover:bg-gray-700 transition-all duration-300"
            >
              Log In
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-8 md:px-24 bg-gray-800/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Everything You Need to Succeed
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Powerful features designed to streamline your job search and boost your chances of landing interviews.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-900/50 p-8 rounded-2xl border border-gray-800 hover:border-blue-500/50 transition-all duration-300">
              <div className="bg-blue-500/10 p-3 rounded-xl w-fit mb-6">
                <Briefcase className="h-6 w-6 text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Smart Job Matching</h3>
              <p className="text-gray-400 leading-relaxed">
                Find the perfect opportunities that match your skills and experience.
              </p>
            </div>

            <div className="bg-gray-900/50 p-8 rounded-2xl border border-gray-800 hover:border-blue-500/50 transition-all duration-300">
              <div className="bg-blue-500/10 p-3 rounded-xl w-fit mb-6">
                <Zap className="h-6 w-6 text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold mb-4">One-Click Applications</h3>
              <p className="text-gray-400 leading-relaxed">
                Apply to multiple jobs simultaneously with our intelligent auto-fill technology.
              </p>
            </div>

            <div className="bg-gray-900/50 p-8 rounded-2xl border border-gray-800 hover:border-blue-500/50 transition-all duration-300">
              <div className="bg-blue-500/10 p-3 rounded-xl w-fit mb-6">
                <Rocket className="h-6 w-6 text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Smart Tracking</h3>
              <p className="text-gray-400 leading-relaxed">
                Track your applications and get insights to optimize your job search strategy.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-24 px-8 md:px-24 bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
                Why Choose ApplyWise?
              </h2>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="bg-blue-500/10 p-2 rounded-lg">
                    <BarChart2 className="h-5 w-5 text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">AI-Powered Applications</h3>
                    <p className="text-gray-400">
                      Personalize your job applications with AI making you 5x more likely to land interviews.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="bg-blue-500/10 p-2 rounded-lg">
                    <CheckCircle2 className="h-5 w-5 text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Smart Matching</h3>
                    <p className="text-gray-400">
                      Find the best job matches based on your profile, saving you hours of searching.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="bg-blue-500/10 p-2 rounded-lg">
                    <Users className="h-5 w-5 text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Community Insights</h3>
                    <p className="text-gray-400">
                      Learn from the success patterns of other job seekers in your industry.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative h-[400px] rounded-2xl overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-teal-500/20"></div>
              <Image
                src="/images/dashboard-preview.png"
                alt="ApplyWise Dashboard Preview"
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-8 md:px-24 bg-gray-800/50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
            Ready to Transform Your Job Search?
          </h2>
          <p className="text-gray-400 text-lg mb-8 max-w-2xl mx-auto">
            Join thousands of job seekers who have streamlined their application process with ApplyWise&apos;s smart platform.
          </p>
          <Link 
            href="/signup" 
            className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-all duration-300"
          >
            Get Started Free
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
