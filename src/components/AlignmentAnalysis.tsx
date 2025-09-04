import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Target, 
  CheckCircle, 
  AlertCircle, 
  TrendingUp,
  ArrowRight,
  Eye,
  Search
} from 'lucide-react';

interface AlignmentAnalysisProps {
  data: {
    matches: string[];
    gaps: string[];
    keywords: string[];
    score: number;
  };
  onContinue: () => void;
}

export const AlignmentAnalysis: React.FC<AlignmentAnalysisProps> = ({ data, onContinue }) => {
  const { matches, gaps, keywords, score } = data;

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return 'Excellent Match';
    if (score >= 60) return 'Good Match';
    return 'Needs Improvement';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Resume-Job Alignment Analysis
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Analysis of how well your resume matches the job requirements
          </p>
        </CardHeader>
      </Card>

      {/* Overall Score */}
      <Card>
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <div className="space-y-2">
              <div className={`text-4xl font-bold ${getScoreColor(score)}`}>
                {score}%
              </div>
              <div className={`text-lg font-medium ${getScoreColor(score)}`}>
                {getScoreLabel(score)}
              </div>
            </div>
            <Progress value={score} className="w-full max-w-md mx-auto h-3" />
            <p className="text-sm text-muted-foreground max-w-md mx-auto">
              Your resume matches {score}% of the job requirements. 
              We'll help you optimize it for better alignment.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Analysis */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Strong Matches */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-600">
              <CheckCircle className="h-5 w-5" />
              Strong Matches ({matches.length})
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Skills and qualifications already in your resume
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {matches.map((match, index) => (
                <div key={index} className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                  <Badge variant="secondary" className="bg-green-50 text-green-700 border-green-200">
                    {match}
                  </Badge>
                </div>
              ))}
              {matches.length === 0 && (
                <p className="text-sm text-muted-foreground italic">
                  No strong matches found. We'll help you highlight relevant skills.
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Missing Elements */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-orange-600">
              <AlertCircle className="h-5 w-5" />
              Areas for Improvement ({gaps.length})
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Key requirements missing or underemphasized
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {gaps.map((gap, index) => (
                <div key={index} className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-orange-600 flex-shrink-0" />
                  <Badge variant="outline" className="border-orange-200 text-orange-700">
                    {gap}
                  </Badge>
                </div>
              ))}
              {gaps.length === 0 && (
                <p className="text-sm text-muted-foreground italic">
                  Great! Your resume covers all major requirements.
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Keywords Analysis */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Important Keywords Found ({keywords.length})
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            These keywords from the job description should be emphasized in your resume
          </p>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {keywords.map((keyword, index) => (
              <Badge 
                key={index}
                variant="outline" 
                className="bg-blue-50 text-blue-700 border-blue-200"
              >
                {keyword}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Optimization Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Optimization Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 border rounded-lg bg-accent/50">
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  <Eye className="h-4 w-4" />
                  Content Optimization
                </h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Emphasize matching skills and experience</li>
                  <li>• Add missing keywords naturally</li>
                  <li>• Quantify achievements with metrics</li>
                  <li>• Use action verbs from job description</li>
                </ul>
              </div>

              <div className="p-4 border rounded-lg bg-accent/50">
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  <Target className="h-4 w-4" />
                  ATS Optimization
                </h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Improve keyword density</li>
                  <li>• Use standard section headers</li>
                  <li>• Format for ATS parsing</li>
                  <li>• Include relevant certifications</li>
                </ul>
              </div>
            </div>

            {/* Expected Improvements */}
            <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
              <h4 className="font-medium text-primary mb-2">Expected Improvements</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">+15-25%</div>
                  <div className="text-muted-foreground">Match Score</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">+40%</div>
                  <div className="text-muted-foreground">ATS Compatibility</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">+30%</div>
                  <div className="text-muted-foreground">Keyword Relevance</div>
                </div>
              </div>
            </div>

            {/* Continue Button */}
            <div className="flex justify-end pt-4">
              <Button onClick={onContinue} size="lg" className="flex items-center gap-2">
                Generate Optimized Resume
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};