import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Upload, 
  FileText, 
  Clipboard, 
  CheckCircle,
  AlertCircle 
} from 'lucide-react';

interface JobDescriptionInputProps {
  onComplete: (data: any) => void;
}

export const JobDescriptionInput: React.FC<JobDescriptionInputProps> = ({ onComplete }) => {
  const [textInput, setTextInput] = useState('');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processedData, setProcessedData] = useState<any>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const supportedTypes = [
        'application/pdf',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/msword',
        'text/plain'
      ];

      if (supportedTypes.includes(file.type)) {
        setUploadedFile(file);
      } else {
        alert('Please upload a PDF, DOCX, DOC, or TXT file');
      }
    }
  };

  const processJobDescription = async (source: 'text' | 'file') => {
    setIsProcessing(true);

    try {
      // Simulate processing
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Mock parsed job description data
      const mockData = {
        source,
        title: 'Senior Product Manager',
        company: 'TechCorp Inc.',
        location: 'San Francisco, CA',
        type: 'Full-time',
        experience: '5+ years',
        responsibilities: [
          'Lead cross-functional teams to deliver product roadmap',
          'Analyze market trends and customer feedback',
          'Define product requirements and user stories',
          'Collaborate with engineering and design teams',
          'Track KPIs and optimize product performance'
        ],
        requirements: [
          "Bachelor's degree in Business, Engineering, or related field",
          '5+ years of product management experience',
          'Strong analytical and problem-solving skills',
          'Experience with Agile methodologies',
          'Excellent communication and leadership skills'
        ],
        skills: [
          'Product Management',
          'Data Analysis',
          'Market Research', 
          'Agile/Scrum',
          'Leadership',
          'Strategic Planning',
          'User Experience',
          'KPI Tracking',
          'Cross-functional Collaboration',
          'Stakeholder Management'
        ],
        keywords: [
          'product', 'management', 'analytics', 'agile', 'leadership',
          'strategy', 'roadmap', 'KPIs', 'cross-functional', 'stakeholder'
        ]
      };

      setProcessedData(mockData);
      onComplete(mockData);
    } catch (error) {
      console.error('Processing failed:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  if (processedData) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            Job Description Processed
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium mb-2">Position Details</h4>
              <div className="space-y-1 text-sm">
                <p><span className="font-medium">Title:</span> {processedData.title}</p>
                <p><span className="font-medium">Company:</span> {processedData.company}</p>
                <p><span className="font-medium">Location:</span> {processedData.location}</p>
              </div>
            </div>
            <div>
              <h4 className="font-medium mb-2">Key Requirements</h4>
              <div className="flex flex-wrap gap-1">
                {processedData.skills.slice(0, 6).map((skill: string, index: number) => (
                  <span 
                    key={index}
                    className="px-2 py-1 bg-primary/10 text-primary rounded-md text-xs"
                  >
                    {skill}
                  </span>
                ))}
                {processedData.skills.length > 6 && (
                  <span className="px-2 py-1 bg-muted text-muted-foreground rounded-md text-xs">
                    +{processedData.skills.length - 6} more
                  </span>
                )}
              </div>
            </div>
          </div>

          <Alert>
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>
              Extracted {processedData.keywords.length} keywords and {processedData.skills.length} skills 
              from the job description. Ready to analyze against your resume.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Add Job Description</CardTitle>
          <p className="text-sm text-muted-foreground">
            Upload a job posting file or paste the text directly
          </p>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="paste" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="paste" className="flex items-center gap-2">
                <Clipboard className="h-4 w-4" />
                Paste Text
              </TabsTrigger>
              <TabsTrigger value="upload" className="flex items-center gap-2">
                <Upload className="h-4 w-4" />
                Upload File
              </TabsTrigger>
            </TabsList>

            <TabsContent value="paste" className="space-y-4">
              <Textarea
                placeholder="Paste the job description here..."
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                className="min-h-[200px] resize-none"
              />
              <Button 
                onClick={() => processJobDescription('text')}
                disabled={!textInput.trim() || isProcessing}
                className="w-full"
              >
                {isProcessing ? 'Processing...' : 'Process Job Description'}
              </Button>
            </TabsContent>

            <TabsContent value="upload" className="space-y-4">
              <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <div className="space-y-2">
                  <p className="text-lg font-medium">Upload Job Description</p>
                  <p className="text-sm text-muted-foreground">
                    PDF, DOCX, DOC, or TXT files supported
                  </p>
                </div>
                <input
                  type="file"
                  accept=".pdf,.docx,.doc,.txt"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="job-file-input"
                />
                <Button 
                  onClick={() => document.getElementById('job-file-input')?.click()}
                  variant="outline"
                  className="mt-4"
                >
                  Choose File
                </Button>
              </div>

              {uploadedFile && (
                <div className="p-4 border rounded-lg bg-accent/50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5" />
                      <div>
                        <p className="font-medium">{uploadedFile.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                    <Button 
                      onClick={() => processJobDescription('file')}
                      disabled={isProcessing}
                    >
                      {isProcessing ? 'Processing...' : 'Process File'}
                    </Button>
                  </div>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};