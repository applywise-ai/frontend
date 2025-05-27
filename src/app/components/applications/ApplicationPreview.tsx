import { Loader2, FileText, Download } from 'lucide-react';
import Image from 'next/image';
import { Card, CardContent } from '@/app/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/app/components/ui/tabs';

interface ApplicationPreviewProps {
  isLoading: boolean;
  resumeFile?: string;
  coverLetterFile?: string;
  activeTab?: string;
  setActiveTab?: (tab: string) => void;
}

// We're now using actual image previews instead of icons

export function ApplicationPreview({ 
  isLoading, 
  resumeFile = '', 
  coverLetterFile = '',
  activeTab = 'application',
  setActiveTab
}: ApplicationPreviewProps) {
  // Check if a file is a PDF
  const isPdf = (file: string) => {
    return file.toLowerCase().endsWith('.pdf');
  };

  // Render document preview based on file type
  const renderDocumentPreview = (file: string) => {
    if (!file) return null;
    
    if (isPdf(file)) {
      return (
        <iframe
          src={file}
          className="w-full h-[92vh] border-0"
          title="Document Preview"
          // style={{ height: '100%' }}
        />
      );
    } else {
      // For non-PDF files, show a download button
      return (
        <div className="flex flex-col items-center justify-center h-full text-center p-6">
          <div className="p-6 mb-4 bg-gray-50 rounded-full">
            <FileText className="h-12 w-12 text-gray-600" />
          </div>
          <h3 className="text-lg font-semibold mb-2">{file.split('/').pop()}</h3>
          <p className="text-sm text-gray-500 mb-4">
            This file type cannot be previewed directly.
          </p>
          <a 
            href={file}
            download
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            <Download className="h-4 w-4" />
            Download File
          </a>
        </div>
      );
    }
  };

  return (
    <div className="w-full h-full flex flex-col overflow-hidden">
      {isLoading ? (
        <div className="flex flex-col items-center justify-center min-h-[50vh] md:min-h-[70vh]">
          <div className="bg-blue-50 rounded-full p-3 mb-4">
            <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />
          </div>
          <p className="text-gray-600 font-medium">Loading preview...</p>
          <p className="text-gray-500 text-sm mt-2">We&apos;re preparing your application preview</p>
        </div>
      ) : (
        <Card className="shadow-sm border-0 h-full flex flex-col">
          <CardContent className="p-0 h-full flex flex-col">
            <Tabs value={activeTab} className="w-full h-full flex flex-col" onValueChange={setActiveTab ? setActiveTab : undefined}>
              <TabsList className="w-full border-b border-gray-200 p-0 h-10 rounded-none bg-white flex-shrink-0">
                <TabsTrigger 
                  value="application" 
                  className="flex-1 rounded-none text-gray-600 h-full font-medium px-1
                            data-[state=active]:text-blue-600 data-[state=active]:border-b-2 
                            data-[state=active]:border-blue-500 data-[state=active]:font-semibold 
                            transition-all duration-200 hover:text-blue-600"
                >
                  Application
                </TabsTrigger>
                <TabsTrigger 
                  value="resume" 
                  className="flex-1 rounded-none text-gray-600 h-full font-medium px-1
                            data-[state=active]:text-blue-600 data-[state=active]:border-b-2 
                            data-[state=active]:border-blue-500 data-[state=active]:font-semibold 
                            transition-all duration-200 hover:text-blue-600"
                >
                  Resume
                </TabsTrigger>
                <TabsTrigger 
                  value="coverLetter" 
                  className="flex-1 rounded-none text-gray-600 h-full font-medium px-1
                            data-[state=active]:text-indigo-600 data-[state=active]:border-b-2 
                            data-[state=active]:border-indigo-500 data-[state=active]:font-semibold 
                            transition-all duration-200 hover:text-indigo-600"
                >
                  Cover Letter
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="application" className="flex-1 m-0 p-0 overflow-auto">
                <div className="px-6 py-6 h-full">
                  <div className="bg-gray-50 rounded-lg border border-gray-200 p-3 h-full overflow-auto relative">
                    <Image
                      src="/images/sample_job_app_ss.png"
                      alt="Application Preview"
                      width={1200}
                      height={1600}
                      className="w-full h-auto max-w-full rounded-md shadow-sm"
                      style={{ objectFit: 'contain' }}
                      priority
                    />
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="resume" className="flex-1 m-0 p-0">
                <div className="px-6 py-6 h-full">
                  {resumeFile ? (
                    <div className="flex flex-col h-full">
                      <div className="bg-gray-50 rounded-lg border border-gray-200 p-3 h-full overflow-auto relative">
                        {renderDocumentPreview('/images/sample_resume.pdf')}
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center min-h-[50vh] md:min-h-[70vh] text-center">
                      <div className="p-6 mb-4 bg-gray-50 rounded-full">
                        <FileText className="h-12 w-12 text-gray-400" />
                      </div>
                      <h3 className="text-lg font-semibold mb-1">No resume uploaded</h3>
                      <p className="text-sm text-gray-500">
                        Please upload your resume to see a preview here
                      </p>
                    </div>
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="coverLetter" className="flex-1 m-0 p-0 overflow-auto">
                <div className="px-6 py-6 h-full">
                  {coverLetterFile ? (
                    <div className="flex flex-col h-full">
                      <div className="bg-gray-50 rounded-lg border border-gray-200 p-3 h-full overflow-auto relative">
                        {renderDocumentPreview('/images/sample_cover_letter.pdf')}
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center min-h-[50vh] md:min-h-[70vh] text-center">
                      <div className="p-6 mb-4 bg-gray-50 rounded-full">
                        <FileText className="h-12 w-12 text-gray-400" />
                      </div>
                      <h3 className="text-lg font-semibold mb-1">No cover letter uploaded</h3>
                      <p className="text-sm text-gray-500">
                        Please upload your cover letter to see a preview here
                      </p>
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}
    </div>
  );
}