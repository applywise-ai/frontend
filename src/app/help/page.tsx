'use client';

import { BookOpen, Bug, Lightbulb } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Textarea } from '@/app/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/app/components/ui/dialog';
import React, { useState } from 'react';

// General HelpModal component
type HelpModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  formState: { title: string; description: string };
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  titlePlaceholder: string;
  descriptionPlaceholder: string;
  buttonClass: string;
  buttonText: string;
};
function HelpModal({ open, onOpenChange, title, formState, onChange, onSubmit, titlePlaceholder, descriptionPlaceholder, buttonClass, buttonText }: HelpModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl w-full bg-white rounded-2xl p-8">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">{title}</DialogTitle>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-6 mt-2">
          <div>
            <label className="block text-md font-semibold text-gray-700 mb-2">Title</label>
            <Input
              name="title"
              value={formState.title}
              onChange={onChange}
              placeholder={titlePlaceholder}
              className="rounded-xl text-lg px-3 py-2"
              required
            />
          </div>
          <div>
            <label className="block text-md font-semibold text-gray-700 mb-2">Description</label>
            <Textarea
              name="description"
              value={formState.description}
              onChange={onChange}
              placeholder={descriptionPlaceholder}
              rows={6}
              className="rounded-xl text-lg px-3 py-2"
              required
            />
          </div>
          <Button type="submit" className={buttonClass + ' text-md py-2 rounded-xl'}>{buttonText}</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default function HelpPage() {
  const [bugReport, setBugReport] = useState({ title: '', description: '' });
  const [featureSuggestion, setFeatureSuggestion] = useState({ title: '', description: '' });
  const [bugModalOpen, setBugModalOpen] = useState(false);
  const [featureModalOpen, setFeatureModalOpen] = useState(false);

  const handleBugReportChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setBugReport(prev => ({ ...prev, [name]: value }));
  };

  const handleFeatureSuggestionChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFeatureSuggestion(prev => ({ ...prev, [name]: value }));
  };

  const handleBugReportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Add API call to submit bug report
    setBugReport({ title: '', description: '' });
    setBugModalOpen(false);
  };

  const handleFeatureSuggestionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Add API call to submit feature suggestion
    setFeatureSuggestion({ title: '', description: '' });
    setFeatureModalOpen(false);
  };

  return (
    <div className="bg-gray-50 py-16 px-4 sm:px-8 lg:px-16">
      <div className="mx-auto max-w-7xl">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold mb-3 text-gray-900">How can we help you?</h1>
          <p className="text-base text-gray-600 max-w-2xl mx-auto">Find answers to your questions, report issues, or suggest improvements to make Applywise better for everyone.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 min-h-[500px] h-full">
          {/* Help Center Card (spans 2 rows on desktop) */}
          <a
            href="https://applywise.notion.site/Applywise-Help-Center-2e2e2e2e2e2e2e2e2e2e2e2e2e2e2e2e"
            target="_blank"
            rel="noopener noreferrer"
            className="lg:row-span-1 flex flex-col items-center justify-center p-8 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 group hover:scale-[1.02] h-full"
          >
            <div className="bg-teal-50 p-4 rounded-full mb-5 group-hover:bg-teal-100 transition-colors duration-300">
              <BookOpen className="h-10 w-10 text-teal-500" />
            </div>
            <span className="font-semibold text-xl text-gray-900 mb-2">Help Center</span>
            <span className="text-gray-600 text-center mb-6 leading-relaxed">Browse FAQs, guides, and get answers to common questions about Applywise. Our Help Center is your go-to resource for troubleshooting and learning how to use all features.</span>
            <Button className="bg-teal-500 hover:bg-teal-600 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-300 group-hover:shadow-md mt-8">Go to Help Center</Button>
          </a>

          {/* Right column: Stacked Feature Suggestion and Bug Report cards */}
          <div className="lg:col-span-2 flex flex-col gap-8 h-full">
            {/* Feature Suggestion Card */}
            <div
              className="flex flex-col justify-between p-8 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer group hover:scale-[1.02] flex-1"
              onClick={() => setFeatureModalOpen(true)}
              tabIndex={0}
            >
              <div>
                <div className="flex items-center mb-4">
                  <div className="bg-yellow-50 p-3 rounded-full mr-4 group-hover:bg-yellow-100 transition-colors duration-300">
                    <Lightbulb className="h-7 w-7 text-yellow-500" />
                  </div>
                  <span className="font-semibold text-lg text-gray-900">Suggest a Feature</span>
                </div>
                <p className="text-gray-600 leading-relaxed">Have an idea to make Applywise better? Share your feature suggestions with us. We value your feedback and are always looking to improve the platform for everyone.</p>
              </div>
              <span
                className="mt-12 text-yellow-600 font-medium cursor-pointer underline-offset-4 group-hover:underline group-focus:underline transition-all duration-200 select-none self-end"
                onClick={e => { e.stopPropagation(); setFeatureModalOpen(true); }}
                tabIndex={-1}
              >
                Suggest a Feature
              </span>
            </div>

            {/* Bug Report Card */}
            <div
              className="flex flex-col justify-between p-8 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer group hover:scale-[1.02] flex-1"
              onClick={() => setBugModalOpen(true)}
              tabIndex={0}
            >
              <div>
                <div className="flex items-center mb-4">
                  <div className="bg-red-50 p-3 rounded-full mr-4 group-hover:bg-red-100 transition-colors duration-300">
                    <Bug className="h-7 w-7 text-red-500" />
                  </div>
                  <span className="font-semibold text-lg text-gray-900">Report a Bug</span>
                </div>
                <p className="text-gray-600 leading-relaxed">Found something not working? Let us know about any bugs or issues you encounter so we can fix them and improve your experience.</p>
              </div>
              <span
                className="mt-12 text-red-600 font-medium cursor-pointer underline-offset-4 group-hover:underline group-focus:underline transition-all duration-200 select-none self-end"
                onClick={e => { e.stopPropagation(); setBugModalOpen(true); }}
                tabIndex={-1}
              >
                Report a Bug
              </span>
            </div>
          </div>
        </div>

        {/* Feature Suggestion Modal */}
        <HelpModal
          open={featureModalOpen}
          onOpenChange={setFeatureModalOpen}
          title="Suggest a Feature"
          formState={featureSuggestion}
          onChange={handleFeatureSuggestionChange}
          onSubmit={handleFeatureSuggestionSubmit}
          titlePlaceholder="Short description of the feature"
          descriptionPlaceholder="Please describe the feature in detail."
          buttonClass="bg-yellow-500 hover:bg-yellow-600 text-white w-full py-3 rounded-lg transition-colors duration-300"
          buttonText="Submit Feature Suggestion"
        />

        {/* Bug Report Modal */}
        <HelpModal
          open={bugModalOpen}
          onOpenChange={setBugModalOpen}
          title="Report a Bug"
          formState={bugReport}
          onChange={handleBugReportChange}
          onSubmit={handleBugReportSubmit}
          titlePlaceholder="Short description of the bug"
          descriptionPlaceholder="Please describe the bug in detail."
          buttonClass="bg-red-500 hover:bg-red-600 text-white w-full py-3 rounded-lg transition-colors duration-300"
          buttonText="Submit Bug Report"
        />
      </div>
    </div>
  );
} 