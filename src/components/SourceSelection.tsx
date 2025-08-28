import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Linkedin, 
  FileText, 
  Mic, 
  CheckCircle2, 
  ArrowRight,
  Upload,
  MessageSquare
} from 'lucide-react';

export interface SourceOptions {
  linkedin: boolean;
  files: boolean;
  voice: boolean;
}

interface SourceSelectionProps {
  onComplete: (sources: SourceOptions) => void;
}

export const SourceSelection: React.FC<SourceSelectionProps> = ({ onComplete }) => {
  const [selectedSources, setSelectedSources] = useState<SourceOptions>({
    linkedin: false,
    files: false,
    voice: false
  });

  const toggleSource = (source: keyof SourceOptions) => {
    setSelectedSources(prev => ({
      ...prev,
      [source]: !prev[source]
    }));
  };

  const hasSelection = Object.values(selectedSources).some(Boolean);
  const selectedCount = Object.values(selectedSources).filter(Boolean).length;

  const sources = [
    {
      key: 'linkedin' as const,
      title: 'LinkedIn Profile',
      description: 'Import from your public LinkedIn profile URL',
      icon: <Linkedin className="h-8 w-8" />,
      features: ['Professional summary', 'Work experience', 'Education', 'Skills', 'Certifications'],
      color: 'text-[#0077B5]'
    },
    {
      key: 'files' as const,
      title: 'Existing CV Files',
      description: 'Upload your current CV in PDF, DOCX, MD, or TXT format',
      icon: <FileText className="h-8 w-8" />,
      features: ['Parse existing CVs', 'Multiple formats', 'Structured extraction', 'Merge with other sources'],
      color: 'text-primary'
    },
    {
      key: 'voice' as const,
      title: 'Voice Dictation',
      description: 'Tell us about your experience through guided questions',
      icon: <Mic className="h-8 w-8" />,
      features: ['English speech-to-text', 'Structured interview', 'Fill missing sections', 'Pause & resume'],
      color: 'text-accent-foreground'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold">Choose Your CV Sources</h2>
        <p className="text-muted-foreground text-lg">
          Select one or more sources to build your comprehensive CoreCV
        </p>
        {selectedCount > 0 && (
          <Badge variant="secondary" className="text-sm">
            {selectedCount} source{selectedCount > 1 ? 's' : ''} selected
          </Badge>
        )}
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {sources.map((source) => (
          <Card 
            key={source.key}
            className={`cursor-pointer transition-all duration-300 hover:shadow-medium ${
              selectedSources[source.key] 
                ? 'ring-2 ring-primary bg-accent/50' 
                : 'hover:bg-accent/20'
            }`}
            onClick={() => toggleSource(source.key)}
          >
            <CardHeader className="text-center">
              <div className={`mx-auto mb-2 ${source.color}`}>
                {source.icon}
              </div>
              <CardTitle className="flex items-center justify-center gap-2">
                {source.title}
                {selectedSources[source.key] && (
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground text-sm text-center">
                {source.description}
              </p>
              <ul className="space-y-2">
                {source.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-2 text-sm">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>

      {hasSelection && (
        <div className="space-y-4">
          <div className="bg-accent/30 rounded-lg p-4">
            <h3 className="font-semibold mb-2">What happens next:</h3>
            <div className="grid md:grid-cols-3 gap-4 text-sm">
              {selectedSources.linkedin && (
                <div className="flex items-start gap-2">
                  <Linkedin className="h-4 w-4 text-[#0077B5] mt-0.5 flex-shrink-0" />
                  <span>Enter your LinkedIn URL and we'll parse your public profile</span>
                </div>
              )}
              {selectedSources.files && (
                <div className="flex items-start gap-2">
                  <Upload className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                  <span>Upload your existing CV files for intelligent parsing</span>
                </div>
              )}
              {selectedSources.voice && (
                <div className="flex items-start gap-2">
                  <MessageSquare className="h-4 w-4 text-accent-foreground mt-0.5 flex-shrink-0" />
                  <span>Complete guided interview to fill in missing details</span>
                </div>
              )}
            </div>
          </div>

          <div className="text-center">
            <Button 
              size="lg" 
              onClick={() => onComplete(selectedSources)}
              className="px-8"
            >
              Continue with Selected Sources
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      <div className="text-center text-sm text-muted-foreground">
        <p>You can combine multiple sources for the most comprehensive CV</p>
        <p>Data conflicts will be resolved in the next step</p>
      </div>
    </div>
  );
};