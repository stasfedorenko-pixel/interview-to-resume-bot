import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CoreCVData } from './CoreCVBuilder';
import { 
  Save, 
  ArrowLeft, 
  Plus, 
  Trash2, 
  User, 
  FileText, 
  Briefcase,
  GraduationCap,
  Award,
  Languages
} from 'lucide-react';

interface CoreCVEditorProps {
  cvData: CoreCVData;
  onComplete: (data: CoreCVData) => void;
  onBack: () => void;
}

export const CoreCVEditor: React.FC<CoreCVEditorProps> = ({ cvData, onComplete, onBack }) => {
  const [editedData, setEditedData] = useState<CoreCVData>(cvData);

  const updateField = (section: keyof CoreCVData, field: string, value: any) => {
    setEditedData(prev => ({
      ...prev,
      [section]: prev[section] && typeof prev[section] === 'object' 
        ? { ...prev[section], [field]: value }
        : { [field]: value }
    }));
  };

  const updateArrayField = (section: keyof CoreCVData, index: number, field: string, value: any) => {
    setEditedData(prev => ({
      ...prev,
      [section]: (prev[section] as any[]).map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      )
    }));
  };

  const addArrayItem = (section: keyof CoreCVData, template: any) => {
    setEditedData(prev => ({
      ...prev,
      [section]: [...(prev[section] as any[]), { ...template, id: Date.now().toString() }]
    }));
  };

  const removeArrayItem = (section: keyof CoreCVData, index: number) => {
    setEditedData(prev => ({
      ...prev,
      [section]: (prev[section] as any[]).filter((_, i) => i !== index)
    }));
  };

  const addSkill = (category: keyof CoreCVData['skills'], skill: string) => {
    if (skill.trim()) {
      setEditedData(prev => ({
        ...prev,
        skills: {
          ...prev.skills,
          [category]: [...prev.skills[category], skill.trim()]
        }
      }));
    }
  };

  const removeSkill = (category: keyof CoreCVData['skills'], index: number) => {
    setEditedData(prev => ({
      ...prev,
      skills: {
        ...prev.skills,
        [category]: prev.skills[category].filter((_, i) => i !== index)
      }
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Edit Your CoreCV</h2>
          <p className="text-muted-foreground">
            Review and refine your merged CV data before final export
          </p>
        </div>
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
      </div>

      <Tabs defaultValue="contact" className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="contact">
            <User className="h-4 w-4 mr-2" />
            Contact
          </TabsTrigger>
          <TabsTrigger value="summary">
            <FileText className="h-4 w-4 mr-2" />
            Summary
          </TabsTrigger>
          <TabsTrigger value="experience">
            <Briefcase className="h-4 w-4 mr-2" />
            Experience
          </TabsTrigger>
          <TabsTrigger value="education">
            <GraduationCap className="h-4 w-4 mr-2" />
            Education
          </TabsTrigger>
          <TabsTrigger value="skills">
            <Award className="h-4 w-4 mr-2" />
            Skills
          </TabsTrigger>
          <TabsTrigger value="other">
            <Languages className="h-4 w-4 mr-2" />
            Other
          </TabsTrigger>
        </TabsList>

        <TabsContent value="contact" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Full Name</label>
                  <Input
                    value={editedData.contact.name}
                    onChange={(e) => updateField('contact', 'name', e.target.value)}
                    placeholder="Your full name"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Email</label>
                  <Input
                    type="email"
                    value={editedData.contact.email}
                    onChange={(e) => updateField('contact', 'email', e.target.value)}
                    placeholder="your.email@example.com"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Phone</label>
                  <Input
                    type="tel"
                    value={editedData.contact.phone}
                    onChange={(e) => updateField('contact', 'phone', e.target.value)}
                    placeholder="+1-555-123-4567"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Location</label>
                  <Input
                    value={editedData.contact.location}
                    onChange={(e) => updateField('contact', 'location', e.target.value)}
                    placeholder="City, State/Country"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">LinkedIn</label>
                  <Input
                    value={editedData.contact.linkedin || ''}
                    onChange={(e) => updateField('contact', 'linkedin', e.target.value)}
                    placeholder="https://linkedin.com/in/yourname"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Website</label>
                  <Input
                    value={editedData.contact.website || ''}
                    onChange={(e) => updateField('contact', 'website', e.target.value)}
                    placeholder="https://yourwebsite.com"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="summary" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Professional Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                value={editedData.summary}
                onChange={(e) => setEditedData(prev => ({ ...prev, summary: e.target.value }))}
                placeholder="Write a compelling 3-5 sentence professional summary..."
                className="min-h-32"
              />
              <p className="text-sm text-muted-foreground mt-2">
                Keep it concise and highlight your key strengths and experience.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="experience" className="mt-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Work Experience</h3>
              <Button
                variant="outline"
                size="sm"
                onClick={() => addArrayItem('experience', {
                  company: '',
                  position: '',
                  location: '',
                  startDate: '',
                  endDate: '',
                  current: false,
                  context: '',
                  responsibilities: [],
                  achievements: [],
                  technologies: []
                })}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Experience
              </Button>
            </div>

            {editedData.experience.map((exp, index) => (
              <Card key={exp.id || index}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{exp.position || 'New Position'}</CardTitle>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeArrayItem('experience', index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <Input
                      placeholder="Job Title"
                      value={exp.position}
                      onChange={(e) => updateArrayField('experience', index, 'position', e.target.value)}
                    />
                    <Input
                      placeholder="Company Name"
                      value={exp.company}
                      onChange={(e) => updateArrayField('experience', index, 'company', e.target.value)}
                    />
                    <Input
                      placeholder="Location"
                      value={exp.location || ''}
                      onChange={(e) => updateArrayField('experience', index, 'location', e.target.value)}
                    />
                    <div className="flex gap-2">
                      <Input
                        placeholder="Start Date (YYYY-MM)"
                        value={exp.startDate}
                        onChange={(e) => updateArrayField('experience', index, 'startDate', e.target.value)}
                      />
                      <Input
                        placeholder="End Date (YYYY-MM)"
                        value={exp.endDate}
                        onChange={(e) => updateArrayField('experience', index, 'endDate', e.target.value)}
                        disabled={exp.current}
                      />
                    </div>
                  </div>
                  
                  <Textarea
                    placeholder="Brief context about the role and company..."
                    value={exp.context || ''}
                    onChange={(e) => updateArrayField('experience', index, 'context', e.target.value)}
                    className="min-h-20"
                  />

                  <div>
                    <label className="text-sm font-medium mb-2 block">Key Achievements</label>
                    <div className="space-y-2">
                      {exp.achievements.map((achievement, achIndex) => (
                        <div key={achIndex} className="flex gap-2">
                          <Input
                            value={achievement}
                            onChange={(e) => {
                              const newAchievements = [...exp.achievements];
                              newAchievements[achIndex] = e.target.value;
                              updateArrayField('experience', index, 'achievements', newAchievements);
                            }}
                            placeholder="Quantified achievement with metrics..."
                          />
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              const newAchievements = exp.achievements.filter((_, i) => i !== achIndex);
                              updateArrayField('experience', index, 'achievements', newAchievements);
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateArrayField('experience', index, 'achievements', [...exp.achievements, ''])}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Achievement
                      </Button>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Technologies Used</label>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {exp.technologies.map((tech, techIndex) => (
                        <Badge key={techIndex} variant="secondary" className="cursor-pointer"
                          onClick={() => {
                            const newTech = exp.technologies.filter((_, i) => i !== techIndex);
                            updateArrayField('experience', index, 'technologies', newTech);
                          }}
                        >
                          {tech} ×
                        </Badge>
                      ))}
                    </div>
                    <Input
                      placeholder="Add technology and press Enter"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          const input = e.target as HTMLInputElement;
                          if (input.value.trim()) {
                            updateArrayField('experience', index, 'technologies', [...exp.technologies, input.value.trim()]);
                            input.value = '';
                          }
                        }
                      }}
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="education" className="mt-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Education</h3>
              <Button
                variant="outline"
                size="sm"
                onClick={() => addArrayItem('education', {
                  institution: '',
                  degree: '',
                  graduationYear: '',
                  additionalInfo: ''
                })}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Education
              </Button>
            </div>

            {editedData.education.map((edu, index) => (
              <Card key={edu.id || index}>
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between mb-4">
                    <h4 className="font-medium">{edu.degree || 'New Degree'}</h4>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeArrayItem('education', index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <Input
                      placeholder="Degree/Program"
                      value={edu.degree}
                      onChange={(e) => updateArrayField('education', index, 'degree', e.target.value)}
                    />
                    <Input
                      placeholder="Institution"
                      value={edu.institution}
                      onChange={(e) => updateArrayField('education', index, 'institution', e.target.value)}
                    />
                    <Input
                      placeholder="Graduation Year"
                      value={edu.graduationYear}
                      onChange={(e) => updateArrayField('education', index, 'graduationYear', e.target.value)}
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="skills" className="mt-6">
          <div className="space-y-6">
            {(['technical', 'business', 'soft'] as const).map((category) => (
              <Card key={category}>
                <CardHeader>
                  <CardTitle className="capitalize">{category} Skills</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {editedData.skills[category].map((skill, index) => (
                      <Badge 
                        key={index} 
                        variant="secondary" 
                        className="cursor-pointer"
                        onClick={() => removeSkill(category, index)}
                      >
                        {skill} ×
                      </Badge>
                    ))}
                  </div>
                  <Input
                    placeholder={`Add ${category} skill and press Enter`}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        const input = e.target as HTMLInputElement;
                        addSkill(category, input.value);
                        input.value = '';
                      }
                    }}
                  />
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="other" className="mt-6">
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Languages</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm">
                  Language management will be available after Supabase integration
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      <div className="flex justify-center pt-6">
        <Button size="lg" onClick={() => onComplete(editedData)} className="px-8">
          <Save className="mr-2 h-4 w-4" />
          Save CoreCV & Continue
        </Button>
      </div>
    </div>
  );
};