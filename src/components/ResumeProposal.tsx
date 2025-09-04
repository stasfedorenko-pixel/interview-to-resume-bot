import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Edit3, 
  Check, 
  X, 
  RefreshCw,
  ArrowRight,
  Sparkles,
  TrendingUp,
  User,
  Award,
  Briefcase
} from 'lucide-react';

interface ResumeProposalProps {
  currentResume: any;
  proposedResume: any;
  onContinue: () => void;
}

export const ResumeProposal: React.FC<ResumeProposalProps> = ({ 
  currentResume, 
  proposedResume, 
  onContinue 
}) => {
  const [editedResume, setEditedResume] = useState(proposedResume);
  const [activeTab, setActiveTab] = useState('summary');

  const handleAcceptProposal = (section: string, field?: string) => {
    // Accept the proposed changes for a section
    console.log('Accepted proposal for:', section, field);
  };

  const handleRejectProposal = (section: string, field?: string) => {
    // Reject the proposed changes for a section
    console.log('Rejected proposal for:', section, field);
  };

  const handleEditText = (section: string, field: string, value: string) => {
    setEditedResume((prev: any) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const ComparisonCard = ({ 
    title, 
    currentText, 
    proposedText, 
    section, 
    field 
  }: {
    title: string;
    currentText: string;
    proposedText: string;
    section: string;
    field: string;
  }) => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" />
            {title}
          </span>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleRejectProposal(section, field)}
              className="text-red-600 border-red-200 hover:bg-red-50"
            >
              <X className="h-3 w-3 mr-1" />
              Keep Original
            </Button>
            <Button
              size="sm"
              onClick={() => handleAcceptProposal(section, field)}
              className="bg-green-600 hover:bg-green-700"
            >
              <Check className="h-3 w-3 mr-1" />
              Accept Changes
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Current Version */}
          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-2">
              Current Version
            </h4>
            <div className="p-3 border rounded-lg bg-gray-50 min-h-[100px]">
              <p className="text-sm whitespace-pre-wrap">{currentText}</p>
            </div>
          </div>

          {/* Proposed Version */}
          <div>
            <h4 className="text-sm font-medium text-primary mb-2 flex items-center gap-1">
              <TrendingUp className="h-3 w-3" />
              Optimized Version
            </h4>
            <Textarea
              value={proposedText}
              onChange={(e) => handleEditText(section, field, e.target.value)}
              className="min-h-[100px] border-primary/20 bg-primary/5"
            />
          </div>
        </div>

        {/* Improvements Highlight */}
        <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <h5 className="text-sm font-medium text-blue-800 mb-1">Key Improvements:</h5>
          <ul className="text-xs text-blue-700 space-y-1">
            <li>• Added relevant keywords from job description</li>
            <li>• Included quantifiable metrics and achievements</li>
            <li>• Enhanced with action verbs and impact statements</li>
            <li>• Improved ATS compatibility and readability</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );

  const SkillsComparison = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Award className="h-4 w-4 text-primary" />
          Skills Optimization
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Current Skills */}
          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-2">
              Current Skills
            </h4>
            <div className="space-y-2">
              {editedResume.skills?.current?.map((skill: string, index: number) => (
                <Badge key={index} variant="outline" className="mr-2 mb-2">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>

          {/* Optimized Skills */}
          <div>
            <h4 className="text-sm font-medium text-primary mb-2">
              Optimized Skills
            </h4>
            <div className="space-y-2">
              {editedResume.skills?.proposed?.map((skill: string, index: number) => {
                const isNew = !editedResume.skills.current.includes(skill);
                return (
                  <Badge 
                    key={index} 
                    variant={isNew ? "default" : "outline"}
                    className={`mr-2 mb-2 ${isNew ? 'bg-primary text-primary-foreground' : ''}`}
                  >
                    {skill}
                    {isNew && <span className="ml-1 text-xs">NEW</span>}
                  </Badge>
                );
              })}
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleRejectProposal('skills')}
          >
            Keep Original Skills
          </Button>
          <Button
            size="sm"
            onClick={() => handleAcceptProposal('skills')}
          >
            Accept Optimized Skills
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Edit3 className="h-5 w-5" />
            Resume Optimization Proposals
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Review and customize the AI-generated improvements to your resume. 
            You can accept, reject, or edit each section.
          </p>
        </CardHeader>
      </Card>

      {/* Progress Summary */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
            <div className="p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">+23%</div>
              <div className="text-sm text-green-700">Keyword Match</div>
            </div>
            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">+18%</div>
              <div className="text-sm text-blue-700">ATS Score</div>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">12</div>
              <div className="text-sm text-purple-700">New Keywords</div>
            </div>
            <div className="p-4 bg-orange-50 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">8</div>
              <div className="text-sm text-orange-700">Improvements</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Section Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-1 md:grid-cols-3 w-full">
          <TabsTrigger value="summary" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            Summary
          </TabsTrigger>
          <TabsTrigger value="skills" className="flex items-center gap-2">
            <Award className="h-4 w-4" />
            Skills
          </TabsTrigger>
          <TabsTrigger value="experience" className="flex items-center gap-2">
            <Briefcase className="h-4 w-4" />
            Experience
          </TabsTrigger>
        </TabsList>

        <TabsContent value="summary" className="space-y-4">
          <ComparisonCard
            title="Professional Summary"
            currentText={editedResume.summary?.current || "No summary available"}
            proposedText={editedResume.summary?.proposed || ""}
            section="summary"
            field="proposed"
          />
        </TabsContent>

        <TabsContent value="skills" className="space-y-4">
          <SkillsComparison />
        </TabsContent>

        <TabsContent value="experience" className="space-y-4">
          {editedResume.experience?.map((exp: any, index: number) => (
            <ComparisonCard
              key={index}
              title={`${exp.current || 'Experience Entry'}`}
              currentText={exp.current || "No description available"}
              proposedText={exp.proposed || ""}
              section="experience"
              field={`${index}`}
            />
          ))}
        </TabsContent>
      </Tabs>

      {/* Action Buttons */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-between">
            <div className="flex gap-2">
              <Button variant="outline" className="flex items-center gap-2">
                <RefreshCw className="h-4 w-4" />
                Regenerate All
              </Button>
            </div>
            
            <div className="flex gap-2">
              <Button variant="outline">
                Save Draft
              </Button>
              <Button onClick={onContinue} className="flex items-center gap-2">
                Proceed to Review
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};