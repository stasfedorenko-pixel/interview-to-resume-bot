import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, ExternalLink, AlertCircle, CheckCircle } from 'lucide-react';

interface LinkedInInputProps {
  onComplete: (data: any) => void;
}

export const LinkedInInput: React.FC<LinkedInInputProps> = ({ onComplete }) => {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validateLinkedInUrl = (url: string): boolean => {
    const linkedinPattern = /^https?:\/\/(www\.)?linkedin\.com\/in\/[a-zA-Z0-9-]+\/?$/;
    return linkedinPattern.test(url);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!validateLinkedInUrl(url)) {
      setError('Please enter a valid LinkedIn profile URL (e.g., https://linkedin.com/in/yourname)');
      return;
    }

    setIsLoading(true);

    try {
      // Simulate parsing LinkedIn data
      // In a real implementation with Supabase, this would call an Edge Function
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock LinkedIn data - replace with actual parsing
      const mockLinkedInData = {
        name: 'John Doe',
        location: 'San Francisco, CA',
        profileUrl: url,
        summary: 'Experienced software engineer with 5+ years in full-stack development',
        experience: [
          {
            id: '1',
            company: 'Tech Corp',
            position: 'Senior Software Engineer',
            startDate: '2021-01',
            endDate: '',
            current: true,
            responsibilities: [
              'Led development of web applications using React and Node.js',
              'Mentored junior developers and conducted code reviews',
              'Collaborated with product team to define technical requirements'
            ],
            achievements: [
              'Increased application performance by 40%',
              'Successfully launched 3 major features ahead of schedule'
            ],
            teamSize: 5,
            technologies: ['React', 'Node.js', 'TypeScript', 'MongoDB']
          }
        ],
        education: [
          {
            id: '1',
            institution: 'University of Technology',
            degree: 'Bachelor of Science in Computer Science',
            graduationYear: '2019'
          }
        ],
        skills: ['JavaScript', 'React', 'Node.js', 'Python', 'AWS', 'Docker']
      };

      onComplete(mockLinkedInData);
    } catch (err) {
      setError('Failed to parse LinkedIn profile. Please try again or continue without LinkedIn data.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSkip = () => {
    onComplete({});
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold mb-2">LinkedIn Profile URL</h3>
          <p className="text-muted-foreground text-sm mb-4">
            We'll extract your professional information from your public LinkedIn profile to pre-fill your CV sections.
          </p>
        </div>

        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Make sure your LinkedIn profile is set to public or that the information you want to include is visible to everyone.
          </AlertDescription>
        </Alert>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Input
              type="url"
              placeholder="https://linkedin.com/in/yourname"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="text-lg"
              disabled={isLoading}
            />
            {url && validateLinkedInUrl(url) && (
              <div className="flex items-center gap-2 text-sm text-green-600">
                <CheckCircle className="h-4 w-4" />
                Valid LinkedIn URL
              </div>
            )}
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="flex gap-3">
            <Button 
              type="submit" 
              disabled={!url || isLoading || !validateLinkedInUrl(url)}
              className="flex-1"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Parsing Profile...
                </>
              ) : (
                <>
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Import from LinkedIn
                </>
              )}
            </Button>
            
            <Button 
              type="button" 
              variant="outline" 
              onClick={handleSkip}
              disabled={isLoading}
            >
              Skip for Now
            </Button>
          </div>
        </form>
      </div>

      <Card className="bg-muted/50">
        <CardContent className="p-4">
          <h4 className="font-medium mb-2">What we'll extract:</h4>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• Name and contact information</li>
            <li>• Professional summary</li>
            <li>• Work experience and achievements</li>
            <li>• Education background</li>
            <li>• Skills and endorsements</li>
          </ul>
        </CardContent>
      </Card>

      <div className="text-center text-sm text-muted-foreground">
        Don't have LinkedIn or prefer to start fresh? You can skip this step and provide all information during the interview.
      </div>
    </div>
  );
};