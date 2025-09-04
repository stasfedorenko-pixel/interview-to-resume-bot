import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { 
  Upload, 
  FileText, 
  CheckCircle, 
  AlertCircle,
  X,
  Loader2
} from 'lucide-react';

interface ResumeUploadProps {
  onComplete: (data: any) => void;
}

interface UploadedFile {
  id: string;
  file: File;
  status: 'pending' | 'processing' | 'completed' | 'error';
  progress: number;
  data?: any;
  error?: string;
}

export const ResumeUpload: React.FC<ResumeUploadProps> = ({ onComplete }) => {
  const [file, setFile] = useState<UploadedFile | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const supportedTypes = [
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/msword',
    'text/markdown',
    'text/plain'
  ];

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) handleFile(droppedFile);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) handleFile(selectedFile);
  };

  const handleFile = (selectedFile: File) => {
    if (!supportedTypes.includes(selectedFile.type)) {
      alert('Please upload a PDF, DOCX, DOC, MD, or TXT file');
      return;
    }

    if (selectedFile.size > 10 * 1024 * 1024) {
      alert('File size must be less than 10MB');
      return;
    }

    const fileObj: UploadedFile = {
      id: Math.random().toString(36).substr(2, 9),
      file: selectedFile,
      status: 'pending',
      progress: 0
    };

    setFile(fileObj);
  };

  const processResume = async () => {
    if (!file) return;

    setFile(prev => prev ? { ...prev, status: 'processing', progress: 25 } : null);

    try {
      // Simulate file processing
      await new Promise(resolve => setTimeout(resolve, 1000));
      setFile(prev => prev ? { ...prev, progress: 50 } : null);
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      setFile(prev => prev ? { ...prev, progress: 75 } : null);
      
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Mock parsed resume data
      const mockResumeData = {
        source: 'file',
        fileName: file.file.name,
        contact: {
          name: 'Alexandra Johnson',
          email: 'alexandra.johnson@email.com',
          phone: '+1 (555) 123-4567',
          location: 'San Francisco, CA',
          linkedin: 'linkedin.com/in/alexandra-johnson'
        },
        summary: 'Results-driven product manager with 6 years of experience leading cross-functional teams and delivering user-centric solutions. Proven track record of driving product growth and improving user engagement through data-driven decision making.',
        skills: {
          technical: ['SQL', 'Python', 'Tableau', 'Google Analytics', 'A/B Testing'],
          business: ['Product Strategy', 'Market Research', 'Competitive Analysis', 'User Research'],
          leadership: ['Team Leadership', 'Project Management', 'Stakeholder Management', 'Cross-functional Collaboration']
        },
        experience: [
          {
            id: '1',
            company: 'InnovateTech Solutions',
            position: 'Senior Product Manager',
            location: 'San Francisco, CA',
            startDate: '2021-03',
            endDate: 'Present',
            current: true,
            responsibilities: [
              'Lead product roadmap for B2B SaaS platform serving 10K+ users',
              'Collaborate with engineering team of 15 developers across 3 squads',
              'Conduct user research and analyze customer feedback',
              'Define product requirements and acceptance criteria'
            ],
            achievements: [
              'Increased user engagement by 35% through feature optimization',
              'Reduced customer churn by 20% via improved onboarding flow',
              'Led successful product launch generating $2M ARR',
              'Implemented A/B testing framework improving conversion by 18%'
            ],
            technologies: ['Jira', 'Confluence', 'Mixpanel', 'Figma', 'SQL']
          },
          {
            id: '2',
            company: 'StartupCorp',
            position: 'Product Manager',
            location: 'San Francisco, CA',
            startDate: '2019-01',
            endDate: '2021-02',
            current: false,
            responsibilities: [
              'Managed product development lifecycle for mobile application',
              'Coordinated with design and engineering teams',
              'Analyzed user behavior and market trends',
              'Created product documentation and specifications'
            ],
            achievements: [
              'Grew user base from 5K to 50K users within 18 months',
              'Improved app store rating from 3.2 to 4.6 stars',
              'Successfully launched 3 major feature releases'
            ],
            technologies: ['Firebase', 'Google Analytics', 'Sketch', 'Trello']
          }
        ],
        education: [
          {
            id: '1',
            institution: 'UC Berkeley',
            degree: 'Bachelor of Science in Business Administration',
            field: 'Marketing',
            graduationYear: '2018',
            location: 'Berkeley, CA'
          }
        ],
        certifications: [
          {
            id: '1',
            name: 'Certified Scrum Product Owner (CSPO)',
            issuer: 'Scrum Alliance',
            date: '2020-06',
            credentialId: 'CSP-001234'
          }
        ],
        languages: [
          { language: 'English', proficiency: 'Native' },
          { language: 'Spanish', proficiency: 'Conversational' }
        ]
      };

      setFile(prev => prev ? { 
        ...prev, 
        status: 'completed', 
        progress: 100, 
        data: mockResumeData 
      } : null);

      onComplete(mockResumeData);
    } catch (error) {
      setFile(prev => prev ? { 
        ...prev, 
        status: 'error', 
        progress: 0, 
        error: 'Failed to parse resume' 
      } : null);
    }
  };

  const removeFile = () => {
    setFile(null);
  };

  if (file?.status === 'completed' && file.data) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            Resume Successfully Processed
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium mb-2">Contact Information</h4>
              <div className="space-y-1 text-sm">
                <p><span className="font-medium">Name:</span> {file.data.contact.name}</p>
                <p><span className="font-medium">Email:</span> {file.data.contact.email}</p>
                <p><span className="font-medium">Location:</span> {file.data.contact.location}</p>
              </div>
            </div>
            <div>
              <h4 className="font-medium mb-2">Experience</h4>
              <div className="space-y-1 text-sm">
                <p><span className="font-medium">Positions:</span> {file.data.experience.length}</p>
                <p><span className="font-medium">Current Role:</span> {file.data.experience[0].position}</p>
                <p><span className="font-medium">Skills:</span> {Object.values(file.data.skills).flat().length} total</p>
              </div>
            </div>
          </div>

          <Alert>
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>
              Extracted all resume sections including {file.data.experience.length} positions, 
              {Object.values(file.data.skills).flat().length} skills, and contact information.
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
          <CardTitle>Upload Your Resume</CardTitle>
          <p className="text-sm text-muted-foreground">
            Upload your current resume in PDF, DOCX, MD, or TXT format (max 10MB)
          </p>
        </CardHeader>
        <CardContent>
          {/* Upload Area */}
          <Card 
            className={`border-2 border-dashed transition-colors cursor-pointer ${
              isDragOver 
                ? 'border-primary bg-accent/50' 
                : 'border-border hover:border-primary/50'
            }`}
            onClick={() => document.getElementById('resume-file-input')?.click()}
            onDrop={handleDrop}
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragOver(true);
            }}
            onDragLeave={() => setIsDragOver(false)}
          >
            <CardContent className="py-12 text-center">
              <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <div className="space-y-2">
                <p className="text-lg font-medium">Drop your resume here or click to browse</p>
                <p className="text-sm text-muted-foreground">
                  Supported formats: PDF, DOCX, DOC, MD, TXT
                </p>
              </div>
              <input
                id="resume-file-input"
                type="file"
                accept=".pdf,.docx,.doc,.md,.txt"
                className="hidden"
                onChange={handleFileSelect}
              />
            </CardContent>
          </Card>

          {/* File Display */}
          {file && (
            <Card className="mt-4">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1">
                    <FileText className="h-5 w-5" />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{file.file.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {(file.file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {file.status === 'pending' && (
                        <Button onClick={processResume}>Process Resume</Button>
                      )}
                      {file.status === 'processing' && (
                        <div className="flex items-center gap-2">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <span className="text-sm">Processing...</span>
                        </div>
                      )}
                      {file.status === 'completed' && (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      )}
                      {file.status === 'error' && (
                        <AlertCircle className="h-5 w-5 text-destructive" />
                      )}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={removeFile}
                    className="ml-2"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                {file.status === 'processing' && (
                  <Progress value={file.progress} className="mt-2" />
                )}
                {file.status === 'error' && file.error && (
                  <Alert variant="destructive" className="mt-2">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{file.error}</AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
    </div>
  );
};