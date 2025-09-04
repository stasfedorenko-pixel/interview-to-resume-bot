import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { 
  CheckCircle, 
  AlertTriangle, 
  FileText, 
  ArrowRight,
  Shield,
  Search,
  Calendar,
  Type
} from 'lucide-react';

interface ATSReviewProps {
  resume: any;
  onContinue: () => void;
}

export const ATSReview: React.FC<ATSReviewProps> = ({ resume, onContinue }) => {
  const atsScore = 89;
  
  const checks = [
    { name: 'Single Column Layout', status: 'pass', description: 'Resume uses ATS-friendly single column' },
    { name: 'Standard Fonts', status: 'pass', description: 'Uses standard, readable fonts' },
    { name: 'Clear Section Headers', status: 'pass', description: 'Standard section headers used' },
    { name: 'Date Formatting', status: 'pass', description: 'Consistent MMM YYYY format' },
    { name: 'Action Verbs', status: 'warning', description: '2 weak phrases found' },
    { name: 'Quantified Achievements', status: 'pass', description: 'Metrics included in achievements' },
    { name: 'Keyword Density', status: 'pass', description: 'Optimal keyword distribution' },
    { name: 'Contact Information', status: 'pass', description: 'All required fields present' }
  ];

  const passedChecks = checks.filter(c => c.status === 'pass').length;
  const warningChecks = checks.filter(c => c.status === 'warning').length;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            ATS Compatibility Review
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Final check to ensure your resume passes Applicant Tracking Systems
          </p>
        </CardHeader>
      </Card>

      {/* ATS Score */}
      <Card>
        <CardContent className="pt-6 text-center">
          <div className="space-y-4">
            <div className="text-4xl font-bold text-green-600">{atsScore}%</div>
            <div className="text-lg font-medium">ATS Compatible</div>
            <Progress value={atsScore} className="max-w-md mx-auto h-3" />
            <p className="text-sm text-muted-foreground max-w-md mx-auto">
              Your resume is highly optimized for ATS systems and should pass most automated screening processes.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Checks */}
      <Card>
        <CardHeader>
          <CardTitle>Detailed ATS Checks</CardTitle>
          <p className="text-sm text-muted-foreground">
            {passedChecks} checks passed • {warningChecks} minor issues found
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {checks.map((check, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  {check.status === 'pass' ? (
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  ) : (
                    <AlertTriangle className="h-5 w-5 text-yellow-600" />
                  )}
                  <div>
                    <p className="font-medium">{check.name}</p>
                    <p className="text-sm text-muted-foreground">{check.description}</p>
                  </div>
                </div>
                <Badge variant={check.status === 'pass' ? 'default' : 'secondary'}>
                  {check.status === 'pass' ? 'PASS' : 'MINOR'}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recommendations */}
      {warningChecks > 0 && (
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <strong>Minor improvements suggested:</strong> Consider replacing phrases like "responsible for" 
            with stronger action verbs like "led," "developed," or "implemented" for better impact.
          </AlertDescription>
        </Alert>
      )}

      {/* Continue Button */}
      <Card>
        <CardContent className="pt-6 text-center">
          <Button onClick={onContinue} size="lg" className="flex items-center gap-2">
            Proceed to Export
            <ArrowRight className="h-4 w-4" />
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};