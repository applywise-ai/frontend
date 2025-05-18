'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/app/utils/firebase';
import Link from 'next/link';

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
        } else {
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Error checking authentication status:', error);
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 text-white">
      <section className="flex min-h-screen flex-col items-center justify-center p-8 md:p-24">
        <h1 className="text-3xl md:text-4xl text-center font-bold text-white mb-6">
          Welcome to ApplyWise
        </h1>
        <p className="mt-4 text-lg md:text-xl text-gray-300 max-w-2xl text-center mb-8">
          Your all-in-one platform for managing job applications and tracking your career journey.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 mt-6">
          <Link 
            href="/signup" 
            className="px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors"
          >
            Get Started
          </Link>
          <Link 
            href="/login" 
            className="px-6 py-3 bg-gray-800 text-white font-medium rounded-md hover:bg-gray-700 transition-colors"
          >
            Log In
          </Link>
        </div>
      </section>
      
      <section className="min-h-screen bg-gray-800 p-8 md:p-24 flex flex-col items-center justify-center">
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-8">Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl">
          <div className="bg-gray-900 p-6 rounded-lg">
            <h3 className="text-xl font-semibold mb-4">Track Applications</h3>
            <p>Keep all your job applications organized in one place with status updates and deadlines.</p>
          </div>
          <div className="bg-gray-900 p-6 rounded-lg">
            <h3 className="text-xl font-semibold mb-4">Resume Management</h3>
            <p>Store different versions of your resume and match them to the right opportunities.</p>
          </div>
          <div className="bg-gray-900 p-6 rounded-lg">
            <h3 className="text-xl font-semibold mb-4">Interview Preparation</h3>
            <p>Prepare for interviews with tools and resources tailored to your industry.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
