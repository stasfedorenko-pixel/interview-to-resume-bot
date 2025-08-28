import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CoreCVData } from './CoreCVBuilder';
import { 
  GitMerge, 
  AlertTriangle, 
  CheckCircle, 
  Linkedin,
  FileText,
  MessageSquare,
  ArrowRight,
  Eye,
  Users
} from 'lucide-react';

interface Conflict {
  id: string;
  field: string;
  section: string;
  values: Array<{
    source: string;
    value: any;
    icon?: React.ReactNode;
  }>;
  selectedValue?: any;
}

interface DataMergerProps {
  collectedData: {
    linkedin?: any;
    files?: any[];
    interview?: Partial<CoreCVData>;
  };
  onComplete: (mergedData: CoreCVData) => void;
}

export const DataMerger: React.FC<DataMergerProps> = ({ collectedData, onComplete }) => {
  const [conflicts, setConflicts] = useState<Conflict[]>([]);
  const [mergedData, setMergedData] = useState<CoreCVData | null>(null);
  const [isProcessing, setIsProcessing] = useState(true);

  const sourceIcons = {
    linkedin: <Linkedin className="h-4 w-4 text-[#0077B5]" />,
    file: <FileText className="h-4 w-4 text-primary" />,
    interview: <MessageSquare className="h-4 w-4 text-accent-foreground" />
  };

  useEffect(() => {
    processDataMerging();
  }, [collectedData]);

  const processDataMerging = async () => {
    setIsProcessing(true);
    
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 1500));

    const detectedConflicts: Conflict[] = [];
    
    // Initialize merged data structure
    const merged: CoreCVData = {
      contact: { name: '', email: '', phone: '', location: '' },
      summary: '',
      skills: { technical: [], business: [], soft: [] },
      experience: [],
      education: [],
      certifications: [],
      languages: []
    };

    // Process LinkedIn data
    if (collectedData.linkedin) {
      const linkedin = collectedData.linkedin;
      if (linkedin.name) merged.contact.name = linkedin.name;
      if (linkedin.location) merged.contact.location = linkedin.location;
      if (linkedin.profileUrl) merged.contact.linkedin = linkedin.profileUrl;
      if (linkedin.summary) merged.summary = linkedin.summary;
      if (linkedin.experience) {
        merged.experience = linkedin.experience.map((exp: any) => ({
          ...exp,
          source: 'linkedin'
        }));
      }
      if (linkedin.education) {
        merged.education = linkedin.education.map((edu: any) => ({
          ...edu,
          source: 'linkedin'
        }));
      }
      if (linkedin.skills) {
        merged.skills.technical = linkedin.skills;
      }
    }

    // Process file data
    if (collectedData.files && collectedData.files.length > 0) {
      collectedData.files.forEach(fileData => {
        // Check for conflicts with existing data
        if (fileData.contact?.name && merged.contact.name && fileData.contact.name !== merged.contact.name) {
          detectedConflicts.push({
            id: 'name-conflict',
            field: 'name',
            section: 'contact',
            values: [
              { source: 'linkedin', value: merged.contact.name, icon: sourceIcons.linkedin },
              { source: 'file', value: fileData.contact.name, icon: sourceIcons.file }
            ]
          });
        } else if (fileData.contact?.name && !merged.contact.name) {
          merged.contact.name = fileData.contact.name;
        }

        // Merge experience with conflict detection
        if (fileData.experience) {
          fileData.experience.forEach((exp: any) => {
            const existingExp = merged.experience.find(e => 
              e.company === exp.company && e.position === exp.position
            );
            
            if (existingExp && existingExp.source !== 'file') {
              detectedConflicts.push({
                id: `exp-${exp.company}-${exp.position}`,
                field: 'experience',
                section: 'experience',
                values: [
                  { source: existingExp.source || 'unknown', value: existingExp, icon: sourceIcons[existingExp.source as keyof typeof sourceIcons] },
                  { source: 'file', value: { ...exp, source: 'file' }, icon: sourceIcons.file }
                ]
              });
            } else if (!existingExp) {
              merged.experience.push({ ...exp, source: 'file' });
            }
          });
        }
      });
    }

    // Process interview data
    if (collectedData.interview) {
      const interview = collectedData.interview;
      
      // Merge contact info
      Object.keys(interview.contact || {}).forEach(key => {
        const value = (interview.contact as any)?.[key];
        if (value && !(merged.contact as any)[key]) {
          (merged.contact as any)[key] = value;
        }
      });

      // Add interview-specific data
      if (interview.experience) {
        interview.experience.forEach(exp => {
          merged.experience.push({ ...exp, source: 'interview' });
        });
      }
    }

    setConflicts(detectedConflicts);
    setMergedData(merged);
    setIsProcessing(false);
  };

  const resolveConflict = (conflictId: string, selectedValue: any) => {
    setConflicts(prev => prev.map(conflict => 
      conflict.id === conflictId 
        ? { ...conflict, selectedValue }
        : conflict
    ));
  };

  const applyResolutions = () => {
    if (!mergedData) return;

    const finalData = { ...mergedData };

    conflicts.forEach(conflict => {
      if (conflict.selectedValue) {
        if (conflict.section === 'contact') {
          (finalData.contact as any)[conflict.field] = conflict.selectedValue;
        }
        // Handle other sections as needed
      }
    });

    onComplete(finalData);
  };

  const unresolvedConflicts = conflicts.filter(c => !c.selectedValue);
  const hasConflicts = conflicts.length > 0;

  if (isProcessing) {
    return (
      <Card className="shadow-soft">
        <CardContent className="py-12 text-center">
          <GitMerge className="h-12 w-12 mx-auto mb-4 text-primary animate-pulse" />
          <h3 className="text-lg font-semibold mb-2">Merging Your Data</h3>
          <p className="text-muted-foreground">
            Analyzing and combining information from all sources...
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold">Data Merging & Conflict Resolution</h2>
        <p className="text-muted-foreground">
          We've combined your data from all sources. Please resolve any conflicts below.
        </p>
      </div>

      {/* Summary Stats */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <Users className="h-8 w-8 mx-auto mb-2 text-primary" />
            <div className="text-2xl font-bold">{mergedData?.experience.length || 0}</div>
            <div className="text-sm text-muted-foreground">Experiences</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <FileText className="h-8 w-8 mx-auto mb-2 text-primary" />
            <div className="text-2xl font-bold">{mergedData?.education.length || 0}</div>
            <div className="text-sm text-muted-foreground">Education</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <CheckCircle className="h-8 w-8 mx-auto mb-2 text-primary" />
            <div className="text-2xl font-bold">
              {(mergedData?.skills.technical.length || 0) + 
               (mergedData?.skills.business.length || 0) + 
               (mergedData?.skills.soft.length || 0)}
            </div>
            <div className="text-sm text-muted-foreground">Skills</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <AlertTriangle className="h-8 w-8 mx-auto mb-2 text-orange-500" />
            <div className="text-2xl font-bold">{conflicts.length}</div>
            <div className="text-sm text-muted-foreground">Conflicts</div>
          </CardContent>
        </Card>
      </div>

      {hasConflicts && (
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-500" />
              Resolve Data Conflicts ({unresolvedConflicts.length} remaining)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {conflicts.map((conflict) => (
                <div key={conflict.id} className="border rounded-lg p-4">
                  <div className="mb-4">
                    <h4 className="font-semibold capitalize">
                      {conflict.section} - {conflict.field}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Multiple sources provided different values. Please choose the correct one:
                    </p>
                  </div>
                  
                  <div className="grid gap-3">
                    {conflict.values.map((option, index) => (
                      <div
                        key={index}
                        className={`border rounded-lg p-3 cursor-pointer transition-colors ${
                          conflict.selectedValue === option.value
                            ? 'border-primary bg-accent/50'
                            : 'hover:bg-accent/20'
                        }`}
                        onClick={() => resolveConflict(conflict.id, option.value)}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-2 mb-2">
                            {option.icon}
                            <Badge variant="outline" className="text-xs">
                              {option.source}
                            </Badge>
                          </div>
                          {conflict.selectedValue === option.value && (
                            <CheckCircle className="h-5 w-5 text-primary" />
                          )}
                        </div>
                        <div className="text-sm">
                          {typeof option.value === 'string' 
                            ? option.value 
                            : JSON.stringify(option.value, null, 2).substring(0, 100) + '...'
                          }
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Preview of Merged Data */}
      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Merged Data Preview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="contact" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="contact">Contact</TabsTrigger>
              <TabsTrigger value="experience">Experience</TabsTrigger>
              <TabsTrigger value="education">Education</TabsTrigger>
              <TabsTrigger value="skills">Skills</TabsTrigger>
            </TabsList>
            
            <TabsContent value="contact" className="mt-4">
              <div className="space-y-2">
                <p><strong>Name:</strong> {mergedData?.contact.name || 'Not provided'}</p>
                <p><strong>Email:</strong> {mergedData?.contact.email || 'Not provided'}</p>
                <p><strong>Phone:</strong> {mergedData?.contact.phone || 'Not provided'}</p>
                <p><strong>Location:</strong> {mergedData?.contact.location || 'Not provided'}</p>
              </div>
            </TabsContent>
            
            <TabsContent value="experience" className="mt-4">
              <div className="space-y-4">
                {mergedData?.experience.map((exp, index) => (
                  <div key={index} className="border-l-2 border-primary pl-4">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold">{exp.position}</h4>
                      <Badge variant="outline" className="text-xs">
                        {sourceIcons[exp.source as keyof typeof sourceIcons]}
                        {exp.source}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{exp.company}</p>
                  </div>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="education" className="mt-4">
              <div className="space-y-3">
                {mergedData?.education.map((edu, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{edu.degree}</p>
                      <p className="text-sm text-muted-foreground">{edu.institution}</p>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {sourceIcons[edu.source as keyof typeof sourceIcons]}
                      {edu.source}
                    </Badge>
                  </div>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="skills" className="mt-4">
              <div className="space-y-3">
                {mergedData?.skills.technical.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-2">Technical Skills</h4>
                    <div className="flex flex-wrap gap-2">
                      {mergedData.skills.technical.map((skill, index) => (
                        <Badge key={index} variant="secondary">{skill}</Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex justify-center">
        <Button 
          size="lg"
          onClick={applyResolutions}
          disabled={unresolvedConflicts.length > 0}
          className="px-8"
        >
          {unresolvedConflicts.length > 0 
            ? `Resolve ${unresolvedConflicts.length} conflict${unresolvedConflicts.length > 1 ? 's' : ''} first`
            : 'Continue to Edit CoreCV'
          }
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>

      {unresolvedConflicts.length > 0 && (
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Please resolve all conflicts before proceeding to ensure your CoreCV has accurate information.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};