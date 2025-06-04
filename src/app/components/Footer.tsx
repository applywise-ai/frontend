import Link from 'next/link';
import { Mail, HelpCircle, MessageCircle, Linkedin, Instagram } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-white">ApplyWise</h3>
            <p className="text-gray-400 text-sm">
              Your all-in-one platform for managing job applications and advancing your career.
            </p>
            <div className="flex space-x-4">
              <a href="https://www.tiktok.com/@applywise" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43V7.56a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.05z"/>
                </svg>
              </a>
              <a href="https://www.instagram.com/applywise" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="https://www.linkedin.com/company/applywise" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Help Center */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
              <HelpCircle className="h-4 w-4" />
              Help Center
            </h4>
            <ul className="space-y-3">
              <li>
                <Link href="/help" className="text-gray-400 hover:text-white transition-colors">
                  Getting Started
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Support */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
              <MessageCircle className="h-4 w-4" />
              Contact Support
            </h4>
            <ul className="space-y-3">
              <li>
                <a href="mailto:support@applywise.com" className="text-gray-400 hover:text-white transition-colors flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  support@applywise.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © {new Date().getFullYear()} ApplyWise. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link href="/privacy" className="text-gray-400 hover:text-white text-sm transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-gray-400 hover:text-white text-sm transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
} 