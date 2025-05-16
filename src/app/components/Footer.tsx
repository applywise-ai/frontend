'use client';

import Link from 'next/link';
import { Facebook, Twitter, Instagram, Linkedin, Github } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="col-span-1">
            <h3 className="text-xl font-bold mb-4">ApplyWise</h3>
            <p className="text-gray-400 mb-4">
              Making your job search smarter and more efficient with AI-powered tools and insights.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-teal-500 transition-colors">
                <Facebook className="h-5 w-5" />
                <span className="sr-only">Facebook</span>
              </a>
              <a href="#" className="text-gray-400 hover:text-teal-500 transition-colors">
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </a>
              <a href="#" className="text-gray-400 hover:text-teal-500 transition-colors">
                <Instagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </a>
              <a href="#" className="text-gray-400 hover:text-teal-500 transition-colors">
                <Linkedin className="h-5 w-5" />
                <span className="sr-only">LinkedIn</span>
              </a>
              <a href="#" className="text-gray-400 hover:text-teal-500 transition-colors">
                <Github className="h-5 w-5" />
                <span className="sr-only">GitHub</span>
              </a>
            </div>
          </div>

          {/* For Job Seekers */}
          <div className="col-span-1">
            <h3 className="text-lg font-semibold mb-4">For Job Seekers</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/dashboard" className="text-gray-400 hover:text-teal-500 transition-colors">
                  Browse Jobs
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-400 hover:text-teal-500 transition-colors">
                  Career Resources
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-400 hover:text-teal-500 transition-colors">
                  Resume Builder
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-400 hover:text-teal-500 transition-colors">
                  Salary Guide
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-400 hover:text-teal-500 transition-colors">
                  Interview Prep
                </Link>
              </li>
            </ul>
          </div>

          {/* For Employers */}
          <div className="col-span-1">
            <h3 className="text-lg font-semibold mb-4">For Employers</h3>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="text-gray-400 hover:text-teal-500 transition-colors">
                  Post a Job
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-400 hover:text-teal-500 transition-colors">
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-400 hover:text-teal-500 transition-colors">
                  Recruiting Solutions
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-400 hover:text-teal-500 transition-colors">
                  Candidate Screening
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-400 hover:text-teal-500 transition-colors">
                  Employer Resources
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div className="col-span-1">
            <h3 className="text-lg font-semibold mb-4">Company</h3>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="text-gray-400 hover:text-teal-500 transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-400 hover:text-teal-500 transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-400 hover:text-teal-500 transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-400 hover:text-teal-500 transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-400 hover:text-teal-500 transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            &copy; {currentYear} ApplyWise. All rights reserved.
          </p>
          <div className="mt-4 md:mt-0 flex space-x-6">
            <Link href="#" className="text-gray-400 hover:text-teal-500 text-sm transition-colors">
              Privacy
            </Link>
            <Link href="#" className="text-gray-400 hover:text-teal-500 text-sm transition-colors">
              Terms
            </Link>
            <Link href="#" className="text-gray-400 hover:text-teal-500 text-sm transition-colors">
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
} 