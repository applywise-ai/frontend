'use client';

import Link from 'next/link';
import { ArrowLeft, Scale, Users, AlertCircle } from 'lucide-react';

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-800 to-gray-900 border-b border-gray-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors mb-6"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
          
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-blue-500/20 rounded-full">
              <Scale className="h-6 w-6 text-blue-400" />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-white">Terms of Service</h1>
              <p className="text-gray-400 mt-1">Last updated: August 2025</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="prose prose-invert max-w-none">
          
          {/* Introduction */}
          <section className="mb-12">
            <div className="bg-gradient-to-r from-blue-500/10 to-teal-500/10 border border-blue-500/20 rounded-lg p-6 mb-8">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-blue-400 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Agreement to Terms</h3>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    By accessing and using ApplyWise, you accept and agree to be bound by the terms and provision of this agreement.
                  </p>
                </div>
              </div>
            </div>

            <p className="text-gray-300 leading-relaxed mb-6">
              Welcome to ApplyWise! These Terms of Service (&ldquo;Terms&rdquo;, &ldquo;Agreement&rdquo;) govern your use of our AI-powered job application platform 
              operated by ApplyWise Corp. (&ldquo;us&rdquo;, &ldquo;we&rdquo;, or &ldquo;our&rdquo;), a Canadian corporation. By accessing or using our service, you agree to be bound by these Terms.
            </p>
          </section>

          {/* Definitions */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <Users className="h-6 w-6 text-blue-400" />
              1. Definitions
            </h2>
            
            <div className="bg-gray-800/50 rounded-lg p-6 space-y-4">
              <div>
                <h4 className="font-semibold text-white">Service</h4>
                <p className="text-gray-300 text-sm">The ApplyWise platform, including all AI-powered job application tools, matching algorithms, and related services.</p>
              </div>
              <div>
                <h4 className="font-semibold text-white">User/You</h4>
                <p className="text-gray-300 text-sm">Any individual who accesses or uses our Service.</p>
              </div>
              <div>
                <h4 className="font-semibold text-white">Content</h4>
                <p className="text-gray-300 text-sm">All information, data, text, software, music, sound, photographs, graphics, video, messages, or other materials.</p>
              </div>
              <div>
                <h4 className="font-semibold text-white">AI Agent</h4>
                <p className="text-gray-300 text-sm">Our artificial intelligence system that analyzes job descriptions and generates personalized applications.</p>
              </div>
            </div>
          </section>

          {/* Account Terms */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-6">2. Account Terms</h2>
            
            <div className="space-y-4 text-gray-300">
              <p>• You must be at least 18 years old to use this Service.</p>
              <p>• You must provide accurate and complete information when creating your account.</p>
              <p>• You are responsible for maintaining the security of your account and password.</p>
              <p>• You may not use our Service for any illegal or unauthorized purpose.</p>
              <p>• You must not transmit any malicious code, viruses, or other harmful content.</p>
              <p>• One person or legal entity may maintain no more than one free account.</p>
            </div>
          </section>

          {/* Service Description */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-6">3. Service Description</h2>
            
            <div className="space-y-6 text-gray-300">
              <div>
                <h4 className="font-semibold text-white mb-2">AI-Powered Applications</h4>
                <p>Our AI agent analyzes job descriptions and generates personalized application responses. While we strive for accuracy, you are responsible for reviewing and approving all applications before submission.</p>
              </div>
              
              <div>
                <h4 className="font-semibold text-white mb-2">Job Matching</h4>
                <p>We provide intelligent job matching based on your profile and preferences. Job listings are sourced from various platforms and may not always be current or available.</p>
              </div>
              
              <div>
                <h4 className="font-semibold text-white mb-2">Platform Integration</h4>
                <p>We integrate with job platforms including Greenhouse, Lever, Workable, and Ashby. Additional integrations may be added or removed at our discretion.</p>
              </div>
            </div>
          </section>

          {/* User Responsibilities */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-6">4. User Responsibilities</h2>
            
            <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-6 mb-6">
              <h4 className="font-semibold text-yellow-400 mb-2">Important Notice</h4>
              <p className="text-gray-300 text-sm">You are ultimately responsible for all job applications submitted through our platform. Always review applications before submission.</p>
            </div>
            
            <div className="space-y-4 text-gray-300">
              <p>• Provide accurate and truthful information in your profile</p>
              <p>• Review all AI-generated content before submitting applications</p>
              <p>• Comply with the terms of service of job platforms you apply through</p>
              <p>• Respect intellectual property rights and confidential information</p>
              <p>• Use the Service only for legitimate job search purposes</p>
              <p>• Report any bugs, security vulnerabilities, or inappropriate content</p>
            </div>
          </section>

          {/* Payment Terms */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-6">5. Payment Terms</h2>
            
            <div className="space-y-6 text-gray-300">
              <div>
                <h4 className="font-semibold text-white mb-2">Free Plan</h4>
                <p>Our free plan includes limited AI applications and basic features. No payment information is required.</p>
              </div>
              
              <div>
                <h4 className="font-semibold text-white mb-2">Pro Plan</h4>
                <p>The Pro plan is billed weekly at $6.25/week. Billing occurs automatically unless you cancel your subscription.</p>
              </div>
              
              <div>
                <h4 className="font-semibold text-white mb-2">Cancellation</h4>
                <p>You may cancel your subscription at any time. Cancellation takes effect at the end of your current billing period. No refunds are provided for partial periods.</p>
              </div>
              
              <div>
                <h4 className="font-semibold text-white mb-2">Price Changes</h4>
                <p>We reserve the right to modify our pricing with 30 days notice to existing subscribers.</p>
              </div>
            </div>
          </section>

          {/* Intellectual Property */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-6">6. Intellectual Property</h2>
            
            <div className="space-y-4 text-gray-300">
              <p>• The ApplyWise platform, including all AI algorithms, software, and design, is owned by ApplyWise Inc.</p>
              <p>• You retain ownership of your personal information and profile data.</p>
              <p>• AI-generated content is provided as-is and may be used by you for job applications.</p>
              <p>• You may not reverse engineer, copy, or redistribute our software or algorithms.</p>
              <p>• Any feedback or suggestions you provide may be used by us without compensation.</p>
            </div>
          </section>

          {/* Privacy and Data */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-6">7. Privacy and Data Protection</h2>
            
            <div className="bg-gray-800/50 rounded-lg p-6">
              <p className="text-gray-300 mb-4">
                Your privacy is important to us. Our collection and use of personal information is governed by our 
                <Link href="/privacy" className="text-blue-400 hover:text-blue-300 transition-colors ml-1">
                  Privacy Policy
                </Link>, which is incorporated into these Terms by reference.
              </p>
              
              <div className="space-y-3 text-gray-300 text-sm">
                <p>• We use your data to provide and improve our AI services</p>
                <p>• Your personal information is encrypted and securely stored</p>
                <p>• We do not sell your personal information to third parties</p>
                <p>• You may request data deletion at any time</p>
              </div>
            </div>
          </section>

          {/* Disclaimers */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-6">8. Disclaimers and Limitations</h2>
            
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-6 mb-6">
              <h4 className="font-semibold text-red-400 mb-2">No Employment Guarantee</h4>
              <p className="text-gray-300 text-sm">ApplyWise does not guarantee job interviews, offers, or employment. Results may vary based on individual circumstances, market conditions, and other factors.</p>
            </div>
            
            <div className="space-y-4 text-gray-300 text-sm">
              <p>• The Service is provided &ldquo;as is&rdquo; without warranties of any kind</p>
              <p>• We do not guarantee the accuracy of AI-generated content</p>
              <p>• Job listings may be outdated or no longer available</p>
              <p>• We are not responsible for actions taken by third-party job platforms</p>
              <p>• Our liability is limited to the amount you paid for the Service in the past 12 months</p>
            </div>
          </section>

          {/* Termination */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-6">9. Termination</h2>
            
            <div className="space-y-4 text-gray-300">
              <p>• Either party may terminate this agreement at any time</p>
              <p>• We may suspend or terminate accounts that violate these Terms</p>
              <p>• Upon termination, your right to use the Service ceases immediately</p>
              <p>• We may retain certain data as required by law or for legitimate business purposes</p>
              <p>• Provisions regarding intellectual property, disclaimers, and limitations survive termination</p>
            </div>
          </section>

          {/* Governing Law */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-6">10. Governing Law</h2>
            
            <div className="text-gray-300">
              <p className="mb-4">
                These Terms are governed by the laws of the Province of Ontario, Canada, without regard to conflict of law principles.
              </p>
              <p>
                Any disputes arising from these Terms or your use of the Service will be resolved through binding arbitration in accordance with the Arbitration Act of Ontario or through the courts of Ontario, Canada.
              </p>
            </div>
          </section>

          {/* Changes to Terms */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-6">11. Changes to Terms</h2>
            
            <div className="text-gray-300 space-y-4">
              <p>
                We reserve the right to modify these Terms at any time. We will notify users of material changes via email or through the Service.
              </p>
              <p>
                Continued use of the Service after changes constitutes acceptance of the new Terms.
              </p>
            </div>
          </section>

          {/* Contact Information */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-6">12. Contact Information</h2>
            
            <div className="bg-gray-800/50 rounded-lg p-6">
              <p className="text-gray-300 mb-4">
                If you have questions about these Terms of Service, please contact us:
              </p>
              
              <div className="space-y-2 text-gray-300 text-sm">
                <p>Email: applywise.help@gmail.com</p>
                <p>Phone: +1 (416) 878-4499</p>
              </div>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}
