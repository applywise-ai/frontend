'use client';

import Link from 'next/link';

export default function DashboardFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="w-full px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex flex-col sm:flex-row justify-between items-center text-sm">
          <p className="text-gray-500">
            &copy; {currentYear} ApplyWise
          </p>
          <div className="mt-1 sm:mt-0 flex space-x-6">
            <Link href="/help" className="text-gray-500 hover:text-teal-600 transition-colors">
              Help
            </Link>
            <Link href="/privacy" className="text-gray-500 hover:text-teal-600 transition-colors">
              Privacy
            </Link>
            <Link href="/terms" className="text-gray-500 hover:text-teal-600 transition-colors">
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
} 