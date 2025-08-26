import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Mic, MicOff, Play, Pause, Volume2, CheckCircle, AlertCircle, MessageSquare } from 'lucide-react';
import { CVData } from './CVBuilder';
import { InterviewChat } from './InterviewChat';

interface CVInterviewFlowProps {
  linkedinData: any;
  onComplete: (data: Partial<CVData>) => void;
  initialData: CVData;
}

type InterviewSection = 'contact' | 'summary' | 'skills' | 'experience' | 'education' | 'certifications' | 'languages';

const sectionTitles: Record<InterviewSection, string> = {
  contact: 'Contact Information',
  summary: 'Professional Summary',
  skills: 'Core Skills',
  experience: 'Professional Experience',
  education: 'Education',
  certifications: 'Certifications',
  languages: 'Languages'
};

export const CVInterviewFlow: React.FC<CVInterviewFlowProps> = ({
  linkedinData,
  onComplete,
  initialData
}) => {
  const [currentSection, setCurrentSection] = useState<InterviewSection>('contact');
  const [completedSections, setCompletedSections] = useState<Set<InterviewSection>>(new Set());
  const [interviewData, setInterviewData] = useState<Partial<CVData>>(initialData);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSupported, setRecordingSupported] = useState(false);

  const sections: InterviewSection[] = ['contact', 'summary', 'skills', 'experience', 'education', 'certifications', 'languages'];

  useEffect(() => {
    // Check if speech recognition is supported
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    setRecordingSupported(!!SpeechRecognition);
  }, []);

  const handleSectionComplete = (section: InterviewSection, data: any) => {
    setCompletedSections(prev => new Set([...prev, section]));
    setInterviewData(prev => ({
      ...prev,
      [section]: data
    }));

    // Auto-advance to next section
    const currentIndex = sections.indexOf(section);
    if (currentIndex < sections.length - 1) {
      setCurrentSection(sections[currentIndex + 1]);
    }
  };

  const handleComplete = () => {
    onComplete(interviewData);
  };

  const getSectionStatus = (section: InterviewSection) => {
    if (completedSections.has(section)) return 'completed';
    if (section === currentSection) return 'current';
    return 'pending';
  };

  const hasLinkedInDataForSection = (section: InterviewSection): boolean => {
    if (!linkedinData) return false;
    
    switch (section) {
      case 'contact':
        return !!(linkedinData.name || linkedinData.location);
      case 'summary':
        return !!linkedinData.summary;
      case 'skills':
        return !!(linkedinData.skills && linkedinData.skills.length > 0);
      case 'experience':
        return !!(linkedinData.experience && linkedinData.experience.length > 0);
      case 'education':
        return !!(linkedinData.education && linkedinData.education.length > 0);
      default:
        return false;
    }
  };

  return (
    <div className="space-y-6">
      {/* Speech Recognition Alert */}
      {!recordingSupported && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Speech recognition is not supported in your browser. You can still complete the interview by typing your responses.
          </AlertDescription>
        </Alert>
      )}

      {/* Section Progress */}
      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-6 w-6 text-primary" />
            Interview Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {sections.map((section) => {
              const status = getSectionStatus(section);
              const hasLinkedIn = hasLinkedInDataForSection(section);
              
              return (
                <Button
                  key={section}
                  variant={status === 'current' ? 'default' : status === 'completed' ? 'secondary' : 'outline'}
                  size="sm"
                  className={`justify-start h-auto p-3 ${status === 'current' ? 'ring-2 ring-primary' : ''}`}
                  onClick={() => setCurrentSection(section)}
                >
                  <div className="flex flex-col items-start w-full">
                    <div className="flex items-center gap-2 w-full">
                      {status === 'completed' && <CheckCircle className="h-4 w-4" />}
                      <span className="text-xs font-medium truncate">
                        {sectionTitles[section]}
                      </span>
                    </div>
                    {hasLinkedIn && (
                      <Badge variant="outline" className="mt-1 text-xs">
                        LinkedIn
                      </Badge>
                    )}
                  </div>
                </Button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Current Section Interview */}
      <InterviewChat
        section={currentSection}
        linkedinData={linkedinData}
        onSectionComplete={handleSectionComplete}
        recordingSupported={recordingSupported}
        existingData={interviewData[currentSection]}
      />

      {/* Navigation */}
      <Card className="shadow-soft">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              Section {sections.indexOf(currentSection) + 1} of {sections.length}
            </div>
            
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => {
                  const currentIndex = sections.indexOf(currentSection);
                  if (currentIndex > 0) {
                    setCurrentSection(sections[currentIndex - 1]);
                  }
                }}
                disabled={sections.indexOf(currentSection) === 0}
              >
                Previous
              </Button>
              
              {completedSections.size === sections.length ? (
                <Button onClick={handleComplete} className="bg-gradient-primary">
                  Complete Interview
                </Button>
              ) : (
                <Button
                  onClick={() => {
                    const currentIndex = sections.indexOf(currentSection);
                    if (currentIndex < sections.length - 1) {
                      setCurrentSection(sections[currentIndex + 1]);
                    }
                  }}
                  disabled={sections.indexOf(currentSection) === sections.length - 1}
                >
                  Next Section
                </Button>
              )}
            </div>
          </div>
          
          <div className="mt-3">
            <div className="w-full bg-muted rounded-full h-2">
              <div 
                className="bg-gradient-primary h-2 rounded-full transition-all duration-500"
                style={{ width: `${(completedSections.size / sections.length) * 100}%` }}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};