import React, { useState } from 'react';
import { LinkedInInput } from './LinkedInInput';
import { CVInterviewFlow } from './CVInterviewFlow';
import { CVEditor } from './CVEditor';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, Linkedin, MessageSquare, FileEdit, Download } from 'lucide-react';

export interface CVData {
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
    management: string[];
    soft: string[];
  };
  experience: Array<{
    id: string;
    company: string;
    position: string;
    startDate: string;
    endDate: string;
    current: boolean;
    responsibilities: string[];
    achievements: string[];
    teamSize?: number;
    technologies: string[];
  }>;
  education: Array<{
    id: string;
    institution: string;
    degree: string;
    graduationYear: string;
    additionalInfo?: string;
  }>;
  certifications: Array<{
    id: string;
    name: string;
    issuer: string;
    date: string;
    expiryDate?: string;
    certificateNumber?: string;
  }>;
  languages: Array<{
    id: string;
    language: string;
    proficiency: string;
  }>;
}

type FlowStep = 'linkedin' | 'interview' | 'editing' | 'export';

export const CVBuilder: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<FlowStep>('linkedin');
  const [cvData, setCVData] = useState<CVData>({
    contact: { name: '', email: '', phone: '', location: '' },
    summary: '',
    skills: { technical: [], management: [], soft: [] },
    experience: [],
    education: [],
    certifications: [],
    languages: []
  });
  const [linkedinData, setLinkedinData] = useState<any>(null);

  const handleLinkedInComplete = (data: any) => {
    setLinkedinData(data);
    // Pre-fill CV data with LinkedIn information
    setCVData(prev => ({
      ...prev,
      contact: {
        ...prev.contact,
        name: data.name || prev.contact.name,
        location: data.location || prev.contact.location,
        linkedin: data.profileUrl
      },
      experience: data.experience || [],
      education: data.education || [],
      skills: {
        ...prev.skills,
        technical: data.skills || []
      }
    }));
    setCurrentStep('interview');
  };

  const handleInterviewComplete = (interviewData: Partial<CVData>) => {
    setCVData(prev => ({
      ...prev,
      ...interviewData
    }));
    setCurrentStep('editing');
  };

  const handleEditingComplete = (finalData: CVData) => {
    setCVData(finalData);
    setCurrentStep('export');
  };

  const getStepProgress = () => {
    const stepMap = { linkedin: 0, interview: 33, editing: 66, export: 100 };
    return stepMap[currentStep];
  };

  const stepIcons = {
    linkedin: <Linkedin className="h-5 w-5" />,
    interview: <MessageSquare className="h-5 w-5" />,
    editing: <FileEdit className="h-5 w-5" />,
    export: <Download className="h-5 w-5" />
  };

  const stepTitles = {
    linkedin: 'LinkedIn Profile',
    interview: 'Oral Interview', 
    editing: 'Review & Edit',
    export: 'Export CV'
  };

  return (
    <div className="min-h-screen bg-gradient-background">
      {/* Header with Progress */}
      <div className="bg-card/80 backdrop-blur-sm border-b sticky top-0 z-50">
        <div className="max-w-4xl mx-auto p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold">AI CV Builder</h1>
              <p className="text-muted-foreground">Create your professional CV with LinkedIn integration and AI interview</p>
            </div>
            <div className="text-right">
              <div className="text-sm text-muted-foreground mb-1">Progress</div>
              <div className="text-lg font-semibold">{getStepProgress()}%</div>
            </div>
          </div>
          
          {/* Progress Steps */}
          <div className="flex items-center justify-between mb-4">
            {(['linkedin', 'interview', 'editing', 'export'] as FlowStep[]).map((step, index) => (
              <div key={step} className="flex items-center">
                <div className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                  currentStep === step 
                    ? 'bg-primary text-primary-foreground' 
                    : getStepProgress() > index * 33 
                      ? 'bg-accent text-accent-foreground' 
                      : 'bg-muted text-muted-foreground'
                }`}>
                  {getStepProgress() > index * 33 && currentStep !== step ? (
                    <CheckCircle className="h-5 w-5" />
                  ) : (
                    stepIcons[step]
                  )}
                  <span className="hidden sm:block text-sm font-medium">{stepTitles[step]}</span>
                </div>
                {index < 3 && (
                  <div className={`w-8 h-0.5 mx-2 ${
                    getStepProgress() > (index + 1) * 33 ? 'bg-accent' : 'bg-border'
                  }`} />
                )}
              </div>
            ))}
          </div>
          
          <Progress value={getStepProgress()} className="h-2" />
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto p-6">
        {currentStep === 'linkedin' && (
          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Linkedin className="h-6 w-6 text-primary" />
                LinkedIn Profile Integration
              </CardTitle>
            </CardHeader>
            <CardContent>
              <LinkedInInput onComplete={handleLinkedInComplete} />
            </CardContent>
          </Card>
        )}

        {currentStep === 'interview' && (
          <CVInterviewFlow 
            linkedinData={linkedinData}
            onComplete={handleInterviewComplete}
            initialData={cvData}
          />
        )}

        {currentStep === 'editing' && (
          <CVEditor 
            cvData={cvData}
            onComplete={handleEditingComplete}
            onBack={() => setCurrentStep('interview')}
          />
        )}

        {currentStep === 'export' && (
          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Download className="h-6 w-6 text-primary" />
                Export Your CV
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center space-y-4">
                <div className="text-lg text-muted-foreground">Your CV is ready!</div>
                {/* Export functionality will be added here */}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};