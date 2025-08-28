import React, { useState } from 'react';
import { SourceSelection, SourceOptions } from './SourceSelection';
import { LinkedInInput } from './LinkedInInput';
import { FileUpload } from './FileUpload';
import { CVInterviewFlow } from './CVInterviewFlow';
import { DataMerger } from './DataMerger';
import { CoreCVEditor } from './CoreCVEditor';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  CheckCircle, 
  Linkedin, 
  FileText, 
  MessageSquare, 
  GitMerge,
  FileEdit,
  Download
} from 'lucide-react';

export interface CoreCVData {
  contact: {
    name: string;
    email: string;
    phone: string;
    location: string;
    linkedin?: string;
    github?: string;
    website?: string;
  };
  summary: string;
  skills: {
    technical: string[];
    business: string[];
    soft: string[];
  };
  experience: Array<{
    id: string;
    company: string;
    position: string;
    location?: string;
    startDate: string;
    endDate: string;
    current: boolean;
    context?: string;
    responsibilities: string[];
    achievements: string[];
    teamSize?: number;
    technologies: string[];
    source?: string;
  }>;
  education: Array<{
    id: string;
    institution: string;
    degree: string;
    graduationYear: string;
    additionalInfo?: string;
    source?: string;
  }>;
  certifications: Array<{
    id: string;
    name: string;
    issuer: string;
    date: string;
    expiryDate?: string;
    certificateNumber?: string;
    source?: string;
  }>;
  languages: Array<{
    id: string;
    language: string;
    proficiency: string;
    source?: string;
  }>;
}

type FlowStep = 'sources' | 'linkedin' | 'files' | 'interview' | 'merge' | 'edit' | 'export';

interface CollectedData {
  linkedin?: any;
  files?: any[];
  interview?: Partial<CoreCVData>;
}

export const CoreCVBuilder: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<FlowStep>('sources');
  const [selectedSources, setSelectedSources] = useState<SourceOptions>({
    linkedin: false,
    files: false,
    voice: false
  });
  const [collectedData, setCollectedData] = useState<CollectedData>({});
  const [cvData, setCVData] = useState<CoreCVData>({
    contact: { name: '', email: '', phone: '', location: '' },
    summary: '',
    skills: { technical: [], business: [], soft: [] },
    experience: [],
    education: [],
    certifications: [],
    languages: []
  });

  const getNextStep = (current: FlowStep): FlowStep => {
    if (current === 'sources') {
      if (selectedSources.linkedin) return 'linkedin';
      if (selectedSources.files) return 'files';
      if (selectedSources.voice) return 'interview';
      return 'merge';
    }
    if (current === 'linkedin') {
      if (selectedSources.files) return 'files';
      if (selectedSources.voice) return 'interview';
      return 'merge';
    }
    if (current === 'files') {
      if (selectedSources.voice) return 'interview';
      return 'merge';
    }
    if (current === 'interview') return 'merge';
    if (current === 'merge') return 'edit';
    if (current === 'edit') return 'export';
    return 'export';
  };

  const handleSourceSelection = (sources: SourceOptions) => {
    setSelectedSources(sources);
    setCurrentStep(getNextStep('sources'));
  };

  const handleLinkedInComplete = (data: any) => {
    setCollectedData(prev => ({ ...prev, linkedin: data }));
    setCurrentStep(getNextStep('linkedin'));
  };

  const handleFilesComplete = (data: any[]) => {
    setCollectedData(prev => ({ ...prev, files: data }));
    setCurrentStep(getNextStep('files'));
  };

  const handleInterviewComplete = (interviewData: Partial<any>) => {
    // Transform the interview data to match CoreCVData structure
    const transformedData: Partial<CoreCVData> = {
      ...interviewData,
      skills: interviewData.skills ? {
        technical: interviewData.skills.technical || [],
        business: interviewData.skills.management || [], // Map management to business
        soft: interviewData.skills.soft || []
      } : undefined
    };
    setCollectedData(prev => ({ ...prev, interview: transformedData }));
    setCurrentStep(getNextStep('interview'));
  };

  const handleMergeComplete = (mergedData: CoreCVData) => {
    setCVData(mergedData);
    setCurrentStep('edit');
  };

  const handleEditComplete = (finalData: CoreCVData) => {
    setCVData(finalData);
    setCurrentStep('export');
  };

  const getStepProgress = () => {
    const steps = ['sources', 'linkedin', 'files', 'interview', 'merge', 'edit', 'export'];
    const currentIndex = steps.indexOf(currentStep);
    return Math.round((currentIndex / (steps.length - 1)) * 100);
  };

  const getActiveSteps = () => {
    const steps = ['sources'];
    if (selectedSources.linkedin) steps.push('linkedin');
    if (selectedSources.files) steps.push('files');
    if (selectedSources.voice) steps.push('interview');
    steps.push('merge', 'edit', 'export');
    return steps;
  };

  const stepIcons = {
    sources: <GitMerge className="h-4 w-4" />,
    linkedin: <Linkedin className="h-4 w-4" />,
    files: <FileText className="h-4 w-4" />,
    interview: <MessageSquare className="h-4 w-4" />,
    merge: <GitMerge className="h-4 w-4" />,
    edit: <FileEdit className="h-4 w-4" />,
    export: <Download className="h-4 w-4" />
  };

  const stepTitles = {
    sources: 'Select Sources',
    linkedin: 'LinkedIn Import',
    files: 'File Upload',
    interview: 'Voice Interview',
    merge: 'Merge Data',
    edit: 'Edit CoreCV',
    export: 'Export CV'
  };

  return (
    <div className="min-h-screen bg-gradient-background">
      {/* Header with Progress */}
      <div className="bg-card/80 backdrop-blur-sm border-b sticky top-0 z-50">
        <div className="max-w-6xl mx-auto p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold">CoreCV Builder</h1>
              <p className="text-muted-foreground">
                Create your master CV from multiple sources with AI assistance
              </p>
            </div>
            <div className="text-right">
              <div className="text-sm text-muted-foreground mb-1">Progress</div>
              <div className="text-lg font-semibold">{getStepProgress()}%</div>
            </div>
          </div>
          
          {/* Progress Steps */}
          <div className="flex items-center justify-between mb-4 overflow-x-auto pb-2">
            {getActiveSteps().map((step, index) => (
              <div key={step} className="flex items-center flex-shrink-0">
                <div className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                  currentStep === step 
                    ? 'bg-primary text-primary-foreground' 
                    : getActiveSteps().indexOf(currentStep) > index
                      ? 'bg-accent text-accent-foreground' 
                      : 'bg-muted text-muted-foreground'
                }`}>
                  {getActiveSteps().indexOf(currentStep) > index ? (
                    <CheckCircle className="h-4 w-4" />
                  ) : (
                    stepIcons[step as keyof typeof stepIcons]
                  )}
                  <span className="text-sm font-medium whitespace-nowrap">
                    {stepTitles[step as keyof typeof stepTitles]}
                  </span>
                </div>
                {index < getActiveSteps().length - 1 && (
                  <div className={`w-8 h-0.5 mx-2 flex-shrink-0 ${
                    getActiveSteps().indexOf(currentStep) > index ? 'bg-accent' : 'bg-border'
                  }`} />
                )}
              </div>
            ))}
          </div>
          
          <Progress value={getStepProgress()} className="h-2" />
          
          {/* Selected Sources Display */}
          {currentStep !== 'sources' && (
            <div className="flex gap-2 mt-4">
              {selectedSources.linkedin && (
                <Badge variant="secondary">
                  <Linkedin className="h-3 w-3 mr-1" />
                  LinkedIn
                </Badge>
              )}
              {selectedSources.files && (
                <Badge variant="secondary">
                  <FileText className="h-3 w-3 mr-1" />
                  Files
                </Badge>
              )}
              {selectedSources.voice && (
                <Badge variant="secondary">
                  <MessageSquare className="h-3 w-3 mr-1" />
                  Voice
                </Badge>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto p-6">
        {currentStep === 'sources' && (
          <SourceSelection onComplete={handleSourceSelection} />
        )}

        {currentStep === 'linkedin' && (
          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Linkedin className="h-6 w-6 text-[#0077B5]" />
                LinkedIn Profile Integration
              </CardTitle>
            </CardHeader>
            <CardContent>
              <LinkedInInput onComplete={handleLinkedInComplete} />
            </CardContent>
          </Card>
        )}

        {currentStep === 'files' && (
          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-6 w-6 text-primary" />
                Upload CV Files
              </CardTitle>
            </CardHeader>
            <CardContent>
              <FileUpload 
                onComplete={handleFilesComplete}
                onSkip={() => setCurrentStep(getNextStep('files'))}
              />
            </CardContent>
          </Card>
        )}

        {currentStep === 'interview' && (
          <CVInterviewFlow 
            linkedinData={collectedData.linkedin}
            onComplete={handleInterviewComplete}
            initialData={{
              contact: cvData.contact,
              summary: cvData.summary,
              skills: {
                technical: cvData.skills.technical,
                management: cvData.skills.business, // Map business to management for compatibility
                soft: cvData.skills.soft
              },
              experience: cvData.experience,
              education: cvData.education,
              certifications: cvData.certifications,
              languages: cvData.languages
            }}
          />
        )}

        {currentStep === 'merge' && (
          <DataMerger 
            collectedData={collectedData}
            onComplete={handleMergeComplete}
          />
        )}

        {currentStep === 'edit' && (
          <CoreCVEditor 
            cvData={cvData}
            onComplete={handleEditComplete}
            onBack={() => setCurrentStep('merge')}
          />
        )}

        {currentStep === 'export' && (
          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Download className="h-6 w-6 text-primary" />
                Export Your CoreCV
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center space-y-4">
                <div className="text-lg text-muted-foreground">
                  Your ATS-friendly CoreCV is ready!
                </div>
                <p className="text-sm text-muted-foreground">
                  Export functionality will be available after Supabase integration
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};