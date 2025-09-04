import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Upload, 
  FileText, 
  Mic, 
  CheckCircle, 
  ArrowRight,
  Target,
  Download,
  Edit3
} from 'lucide-react';

// Import components
import { JobDescriptionInput } from './JobDescriptionInput';
import { ResumeUpload } from './ResumeUpload';
import { VoiceInput } from './VoiceInput';
import { AlignmentAnalysis } from './AlignmentAnalysis';
import { ResumeProposal } from './ResumeProposal';
import { ATSReview } from './ATSReview';
import { ExportOptions } from './ExportOptions';

interface ProcessedData {
  jobDescription?: any;
  resume?: any;
  voiceNotes?: string;
}

interface AnalysisData {
  matches: string[];
  gaps: string[];
  keywords: string[];
  score: number;
}

type Step = 'input' | 'processing' | 'analysis' | 'proposal' | 'review' | 'export';

export const JobTargetedResumeBuilder: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<Step>('input');
  const [processedData, setProcessedData] = useState<ProcessedData>({});
  const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null);
  const [proposedResume, setProposedResume] = useState<any>(null);
  const [progress, setProgress] = useState(0);

  const steps = [
    { key: 'input', title: 'Upload Documents', icon: Upload },
    { key: 'processing', title: 'Processing', icon: FileText },
    { key: 'analysis', title: 'Analysis', icon: Target },
    { key: 'proposal', title: 'Proposals', icon: Edit3 },
    { key: 'review', title: 'ATS Review', icon: CheckCircle },
    { key: 'export', title: 'Export', icon: Download }
  ];

  const stepIndex = steps.findIndex(s => s.key === currentStep);
  const progressPercent = ((stepIndex + 1) / steps.length) * 100;

  const handleJobDescriptionComplete = (data: any) => {
    setProcessedData(prev => ({ ...prev, jobDescription: data }));
  };

  const handleResumeComplete = (data: any) => {
    setProcessedData(prev => ({ ...prev, resume: data }));
  };

  const handleVoiceComplete = (notes: string) => {
    setProcessedData(prev => ({ ...prev, voiceNotes: notes }));
  };

  const processDocuments = async () => {
    setCurrentStep('processing');
    setProgress(0);

    // Simulate processing
    for (let i = 0; i <= 100; i += 20) {
      setProgress(i);
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    // Mock analysis results
    const mockAnalysis: AnalysisData = {
      matches: [
        'Project Management',
        'Team Leadership', 
        'Data Analysis',
        'Strategic Planning'
      ],
      gaps: [
        'Machine Learning',
        'Cloud Architecture',
        'DevOps',
        'Agile Methodology'
      ],
      keywords: [
        'leadership', 'analytics', 'strategy', 'optimization',
        'cross-functional', 'stakeholder', 'KPIs', 'growth'
      ],
      score: 72
    };

    setAnalysisData(mockAnalysis);
    setCurrentStep('analysis');
  };

  const generateProposals = () => {
    // Mock proposed resume with job-aligned content
    const mockProposal = {
      summary: {
        current: "Experienced professional with strong background in management.",
        proposed: "Results-driven Project Manager with 8+ years leading cross-functional teams and delivering data-driven solutions. Proven track record of optimizing processes and driving 25% efficiency improvements through strategic planning and stakeholder alignment."
      },
      skills: {
        current: ["Management", "Analysis", "Communication"],
        proposed: ["Project Management", "Data Analysis", "Team Leadership", "Strategic Planning", "Cross-functional Collaboration", "KPI Optimization", "Stakeholder Management"]
      },
      experience: [
        {
          current: "Managed various projects and teams.",
          proposed: "Led cross-functional teams of 12+ members to deliver strategic initiatives, resulting in 25% efficiency improvement and $2M cost savings through data-driven optimization and stakeholder alignment."
        }
      ]
    };

    setProposedResume(mockProposal);
    setCurrentStep('proposal');
  };

  const proceedToReview = () => {
    setCurrentStep('review');
  };

  const proceedToExport = () => {
    setCurrentStep('export');
  };

  const canProceed = () => {
    return processedData.jobDescription && processedData.resume;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Job-Targeted Resume Optimizer
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Upload your resume and job description to create an ATS-friendly, 
            perfectly aligned resume that matches the role requirements.
          </p>
        </div>

        {/* Progress Bar */}
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Progress</span>
                <span className="text-sm text-muted-foreground">
                  Step {stepIndex + 1} of {steps.length}
                </span>
              </div>
              <Progress value={progressPercent} className="h-2" />
              <div className="flex justify-between">
                {steps.map((step, index) => {
                  const Icon = step.icon;
                  const isCompleted = index < stepIndex;
                  const isCurrent = index === stepIndex;
                  
                  return (
                    <div 
                      key={step.key}
                      className={`flex flex-col items-center space-y-1 ${
                        isCompleted ? 'text-primary' : 
                        isCurrent ? 'text-foreground' : 'text-muted-foreground'
                      }`}
                    >
                      <div className={`p-2 rounded-full border-2 ${
                        isCompleted ? 'bg-primary border-primary text-primary-foreground' :
                        isCurrent ? 'border-primary' : 'border-muted'
                      }`}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <span className="text-xs font-medium">{step.title}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Content */}
        {currentStep === 'input' && (
          <Tabs defaultValue="job-description" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="job-description">Job Description</TabsTrigger>
              <TabsTrigger value="resume">Resume Upload</TabsTrigger>
              <TabsTrigger value="voice">Voice Notes</TabsTrigger>
            </TabsList>

            <TabsContent value="job-description">
              <JobDescriptionInput onComplete={handleJobDescriptionComplete} />
            </TabsContent>

            <TabsContent value="resume">
              <ResumeUpload onComplete={handleResumeComplete} />
            </TabsContent>

            <TabsContent value="voice">
              <VoiceInput onComplete={handleVoiceComplete} />
            </TabsContent>

            {/* Status Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5" />
                  Upload Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-full ${
                      processedData.jobDescription ? 'bg-green-100 text-green-600' : 'bg-muted'
                    }`}>
                      <FileText className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-medium">Job Description</p>
                      <p className="text-sm text-muted-foreground">
                        {processedData.jobDescription ? 'Uploaded' : 'Required'}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-full ${
                      processedData.resume ? 'bg-green-100 text-green-600' : 'bg-muted'
                    }`}>
                      <Upload className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-medium">Resume</p>
                      <p className="text-sm text-muted-foreground">
                        {processedData.resume ? 'Uploaded' : 'Required'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-full ${
                      processedData.voiceNotes ? 'bg-blue-100 text-blue-600' : 'bg-muted'
                    }`}>
                      <Mic className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-medium">Voice Notes</p>
                      <p className="text-sm text-muted-foreground">
                        {processedData.voiceNotes ? 'Added' : 'Optional'}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex justify-end">
                  <Button 
                    onClick={processDocuments}
                    disabled={!canProceed()}
                    className="flex items-center gap-2"
                  >
                    Process Documents
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </Tabs>
        )}

        {currentStep === 'processing' && (
          <Card>
            <CardContent className="py-12 text-center">
              <div className="space-y-6">
                <div className="h-16 w-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
                  <FileText className="h-8 w-8 text-primary animate-pulse" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold">Processing Your Documents</h3>
                  <p className="text-muted-foreground">
                    Analyzing job description, parsing resume, and extracting key insights...
                  </p>
                </div>
                <Progress value={progress} className="max-w-md mx-auto" />
              </div>
            </CardContent>
          </Card>
        )}

        {currentStep === 'analysis' && analysisData && (
          <AlignmentAnalysis 
            data={analysisData}
            onContinue={generateProposals}
          />
        )}

        {currentStep === 'proposal' && proposedResume && (
          <ResumeProposal 
            currentResume={processedData.resume}
            proposedResume={proposedResume}
            onContinue={proceedToReview}
          />
        )}

        {currentStep === 'review' && (
          <ATSReview 
            resume={proposedResume}
            onContinue={proceedToExport}
          />
        )}

        {currentStep === 'export' && (
          <ExportOptions 
            resume={proposedResume}
            onRestart={() => {
              setCurrentStep('input');
              setProcessedData({});
              setAnalysisData(null);
              setProposedResume(null);
            }}
          />
        )}
      </div>
    </div>
  );
};