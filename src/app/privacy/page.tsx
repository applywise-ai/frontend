'use client';

import Link from 'next/link';
import { ArrowLeft, Shield, Eye, Lock, Database, Users, Globe, AlertTriangle } from 'lucide-react';

export default function PrivacyPolicy() {
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
            <div className="p-3 bg-green-500/20 rounded-full">
              <Shield className="h-6 w-6 text-green-400" />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-white">Privacy Policy</h1>
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
            <div className="bg-gradient-to-r from-green-500/10 to-blue-500/10 border border-green-500/20 rounded-lg p-6 mb-8">
              <div className="flex items-start gap-3">
                <Lock className="h-5 w-5 text-green-400 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Your Privacy Matters</h3>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    We are committed to protecting your personal information and being transparent about how we collect, use, and share your data.
                  </p>
                </div>
              </div>
            </div>

            <p className="text-gray-300 leading-relaxed mb-6">
              This Privacy Policy describes how ApplyWise Corp. (&quot;we&quot;, &quot;us&quot;, or &quot;our&quot;), a Canadian corporation, collects, uses, and protects your personal information 
              when you use our AI-powered job application platform. By using ApplyWise, you consent to the data practices described in this policy.
            </p>
          </section>

          {/* Information We Collect */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <Database className="h-6 w-6 text-blue-400" />
              1. Information We Collect
            </h2>
            
            <div className="space-y-8">
              <div className="bg-gray-800/50 rounded-lg p-6">
                <h4 className="font-semibold text-white mb-4 flex items-center gap-2">
                  <Users className="h-5 w-5 text-blue-400" />
                  Personal Information You Provide
                </h4>
                <div className="space-y-3 text-gray-300 text-sm">
                  <p>• <strong>Account Information:</strong> Name, email address, password, and profile picture</p>
                  <p>• <strong>Professional Information:</strong> Work experience, education, skills, and career preferences</p>
                  <p>• <strong>Contact Information:</strong> Phone number, location, and preferred contact methods</p>
                  <p>• <strong>Application Content:</strong> Resumes, cover letters, and responses to job applications</p>
                  <p>• <strong>Payment Information:</strong> Billing address and payment method details (processed securely by third parties)</p>
                </div>
              </div>

              <div className="bg-gray-800/50 rounded-lg p-6">
                <h4 className="font-semibold text-white mb-4 flex items-center gap-2">
                  <Eye className="h-5 w-5 text-purple-400" />
                  Information We Collect Automatically
                </h4>
                <div className="space-y-3 text-gray-300 text-sm">
                  <p>• <strong>Usage Data:</strong> How you interact with our platform, features used, and time spent</p>
                  <p>• <strong>Device Information:</strong> IP address, browser type, operating system, and device identifiers</p>
                  <p>• <strong>Log Data:</strong> Server logs, error reports, and performance metrics</p>
                  <p>• <strong>Cookies and Tracking:</strong> Session cookies, preferences, and analytics data</p>
                  <p>• <strong>Job Search Activity:</strong> Jobs viewed, applications submitted, and search queries</p>
                </div>
              </div>

              <div className="bg-gray-800/50 rounded-lg p-6">
                <h4 className="font-semibold text-white mb-4 flex items-center gap-2">
                  <Globe className="h-5 w-5 text-teal-400" />
                  Third-Party Information
                </h4>
                <div className="space-y-3 text-gray-300 text-sm">
                  <p>• <strong>Job Platform Data:</strong> Information from Greenhouse, Lever, Workable, Ashby, and other integrated platforms</p>
                  <p>• <strong>Social Media:</strong> Public profile information if you choose to connect social accounts</p>
                  <p>• <strong>Analytics Services:</strong> Aggregated data from Google Analytics and similar services</p>
                  <p>• <strong>Payment Processors:</strong> Transaction data from Stripe and other payment providers</p>
                </div>
              </div>
            </div>
          </section>

          {/* How We Use Information */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-6">2. How We Use Your Information</h2>
            
            <div className="space-y-6">
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-6">
                <h4 className="font-semibold text-blue-400 mb-3">Core Service Functionality</h4>
                <div className="space-y-2 text-gray-300 text-sm">
                  <p>• Generate personalized job applications using our AI technology</p>
                  <p>• Match you with relevant job opportunities based on your profile</p>
                  <p>• Provide intelligent recommendations and career insights</p>
                  <p>• Enable application tracking and status updates</p>
                  <p>• Facilitate communication with potential employers</p>
                </div>
              </div>

              <div className="bg-teal-500/10 border border-teal-500/20 rounded-lg p-6">
                <h4 className="font-semibold text-teal-400 mb-3">Platform Improvement</h4>
                <div className="space-y-2 text-gray-300 text-sm">
                  <p>• Analyze usage patterns to improve our AI algorithms</p>
                  <p>• Enhance user experience and platform performance</p>
                  <p>• Develop new features and integrations</p>
                  <p>• Conduct research and analytics to better serve users</p>
                  <p>• Monitor and prevent fraudulent or inappropriate activity</p>
                </div>
              </div>

              <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-6">
                <h4 className="font-semibold text-purple-400 mb-3">Communication and Support</h4>
                <div className="space-y-2 text-gray-300 text-sm">
                  <p>• Send important account and service updates</p>
                  <p>• Provide customer support and respond to inquiries</p>
                  <p>• Share relevant job opportunities and career tips</p>
                  <p>• Send promotional content (with your consent)</p>
                  <p>• Notify you of changes to our terms or privacy policy</p>
                </div>
              </div>
            </div>
          </section>

          {/* AI and Data Processing */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-6">3. AI Processing and Machine Learning</h2>
            
            <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-lg p-6 mb-6">
              <h4 className="font-semibold text-white mb-3">How Our AI Uses Your Data</h4>
              <p className="text-gray-300 text-sm mb-4">
                Our artificial intelligence systems analyze your profile information, job descriptions, and application history to provide personalized services.
              </p>
              <div className="space-y-2 text-gray-300 text-sm">
                <p>• Your data trains our models to better match you with opportunities</p>
                <p>• AI-generated content is based on your specific experience and skills</p>
                <p>• We use aggregated, anonymized data to improve our algorithms</p>
                <p>• Personal information is processed securely and never shared in raw form</p>
              </div>
            </div>
          </section>

          {/* Information Sharing */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-6">4. How We Share Your Information</h2>
            
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-6 mb-6">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-red-400 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-red-400 mb-2">We Do Not Sell Your Data</h4>
                  <p className="text-gray-300 text-sm">
                    We never sell, rent, or trade your personal information to third parties for marketing purposes.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h4 className="font-semibold text-white mb-3">When We Share Information</h4>
                <div className="space-y-3 text-gray-300 text-sm">
                  <p>• <strong>Job Applications:</strong> With employers when you submit applications (with your explicit consent)</p>
                  <p>• <strong>Service Providers:</strong> With trusted partners who help us operate our platform (under strict confidentiality agreements)</p>
                  <p>• <strong>Legal Requirements:</strong> When required by law, court order, or to protect our rights and safety</p>
                  <p>• <strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets (with user notification)</p>
                  <p>• <strong>Aggregated Data:</strong> Anonymous, statistical information that cannot identify individuals</p>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-white mb-3">Third-Party Integrations</h4>
                <div className="bg-gray-800/50 rounded-lg p-4">
                  <p className="text-gray-300 text-sm mb-3">
                    We integrate with job platforms and may share necessary information to facilitate applications:
                  </p>
                  <div className="space-y-2 text-gray-300 text-sm">
                    <p>• Greenhouse, Lever, Workable, Ashby (application data only)</p>
                    <p>• Payment processors like Stripe (billing information only)</p>
                    <p>• Analytics providers (anonymized usage data only)</p>
                    <p>• Email service providers (contact information for communications)</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Data Security */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <Lock className="h-6 w-6 text-green-400" />
              5. Data Security and Protection
            </h2>
            
            <div className="space-y-6">
              <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-6">
                <h4 className="font-semibold text-green-400 mb-3">Security Measures</h4>
                <div className="space-y-2 text-gray-300 text-sm">
                  <p>• <strong>Encryption:</strong> All data is encrypted in transit and at rest using industry-standard protocols</p>
                  <p>• <strong>Access Controls:</strong> Strict employee access controls with multi-factor authentication</p>
                  <p>• <strong>Regular Audits:</strong> Security assessments and penetration testing by third-party experts</p>
                  <p>• <strong>Secure Infrastructure:</strong> Cloud hosting with enterprise-grade security features</p>
                  <p>• <strong>Data Backup:</strong> Regular backups with secure, geographically distributed storage</p>
                </div>
              </div>

              <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-6">
                <h4 className="font-semibold text-yellow-400 mb-3">Data Breach Protocol</h4>
                <p className="text-gray-300 text-sm">
                  In the unlikely event of a data breach, we will notify affected users within 72 hours and take immediate action to secure the platform and investigate the incident.
                </p>
              </div>
            </div>
          </section>

          {/* Your Rights */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-6">6. Your Privacy Rights</h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-gray-800/50 rounded-lg p-6">
                <h4 className="font-semibold text-white mb-3">Access and Control</h4>
                <div className="space-y-2 text-gray-300 text-sm">
                  <p>• View and update your personal information</p>
                  <p>• Download a copy of your data</p>
                  <p>• Delete your account and associated data</p>
                  <p>• Opt out of marketing communications</p>
                  <p>• Control cookie preferences</p>
                </div>
              </div>

              <div className="bg-gray-800/50 rounded-lg p-6">
                <h4 className="font-semibold text-white mb-3">Additional Rights (GDPR/CCPA)</h4>
                <div className="space-y-2 text-gray-300 text-sm">
                  <p>• Request data portability</p>
                  <p>• Object to certain processing activities</p>
                  <p>• Request data correction or restriction</p>
                  <p>• Withdraw consent at any time</p>
                  <p>• File complaints with supervisory authorities</p>
                </div>
              </div>
            </div>

            <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-6 mt-6">
              <h4 className="font-semibold text-blue-400 mb-3">How to Exercise Your Rights</h4>
              <p className="text-gray-300 text-sm mb-3">
                To exercise any of these rights, contact us at applywise.help@gmail.com or use the settings in your account dashboard.
              </p>
              <p className="text-gray-300 text-sm">
                We will respond to your request within 30 days and may require identity verification for security purposes.
              </p>
            </div>
          </section>

          {/* Data Retention */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-6">7. Data Retention</h2>
            
            <div className="space-y-4 text-gray-300">
              <p>We retain your personal information only as long as necessary to provide our services and comply with legal obligations:</p>
              
              <div className="bg-gray-800/50 rounded-lg p-6">
                <div className="space-y-3 text-sm">
                  <p>• <strong>Account Information:</strong> Until you delete your account, plus 30 days for backup cleanup</p>
                  <p>• <strong>Application Data:</strong> 7 years for legal compliance and dispute resolution</p>
                  <p>• <strong>Usage Analytics:</strong> 2 years in aggregated, anonymized form</p>
                  <p>• <strong>Communication Records:</strong> 3 years for customer support purposes</p>
                  <p>• <strong>Payment Information:</strong> As required by financial regulations (typically 7 years)</p>
                </div>
              </div>
            </div>
          </section>

          {/* International Transfers */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-6">8. International Data Transfers</h2>
            
            <div className="text-gray-300 space-y-4">
              <p>
                ApplyWise is based in Canada. If you are accessing our services from outside Canada, 
                your information may be transferred to, stored, and processed in Canada.
              </p>
              
              <div className="bg-gray-800/50 rounded-lg p-6">
                <h4 className="font-semibold text-white mb-3">International Safeguards</h4>
                <div className="space-y-2 text-sm">
                  <p>• We comply with PIPEDA (Personal Information Protection and Electronic Documents Act) and applicable data protection laws</p>
                  <p>• Standard Contractual Clauses (SCCs) govern transfers to third countries when necessary</p>
                  <p>• We maintain the same level of protection regardless of data location</p>
                  <p>• Regular compliance audits ensure ongoing protection standards</p>
                </div>
              </div>
            </div>
          </section>

          {/* Children's Privacy */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-6">9. Children&apos;s Privacy</h2>
            
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-6">
              <p className="text-gray-300 text-sm">
                ApplyWise is not intended for users under 18 years of age. We do not knowingly collect personal information from children under 18. 
                If you believe we have collected information from a child under 18, please contact us immediately at applywise.help@gmail.com.
              </p>
            </div>
          </section>

          {/* Updates to Policy */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-6">10. Updates to This Privacy Policy</h2>
            
            <div className="text-gray-300 space-y-4">
              <p>
                We may update this Privacy Policy from time to time to reflect changes in our practices or for other operational, legal, or regulatory reasons.
              </p>
              
              <div className="bg-gray-800/50 rounded-lg p-6">
                <h4 className="font-semibold text-white mb-3">How We Notify You</h4>
                <div className="space-y-2 text-sm">
                  <p>• Email notification for material changes</p>
                  <p>• In-app notifications when you next log in</p>
                  <p>• Updated &quot;Last updated&quot; date at the top of this policy</p>
                  <p>• 30-day notice period for significant changes</p>
                </div>
              </div>
            </div>
          </section>

          {/* Contact Information */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-6">11. Contact Us</h2>
            
            <div className="bg-gray-800/50 rounded-lg p-6">
              <p className="text-gray-300 mb-4">
                If you have questions about this Privacy Policy or our data practices, please contact us:
              </p>
              
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-500/20 rounded">
                    <Database className="h-4 w-4 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-white font-medium">Privacy Contact</p>
                    <p className="text-gray-300 text-sm">applywise.help@gmail.com</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}
