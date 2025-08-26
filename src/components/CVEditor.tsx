import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Save, Download, Plus, X } from 'lucide-react';
import { CVData } from './CVBuilder';

interface CVEditorProps {
  cvData: CVData;
  onComplete: (data: CVData) => void;
  onBack: () => void;
}

export const CVEditor: React.FC<CVEditorProps> = ({ cvData, onComplete, onBack }) => {
  const [editData, setEditData] = useState<CVData>(cvData);

  const handleSave = () => {
    onComplete(editData);
  };

  const addExperience = () => {
    setEditData(prev => ({
      ...prev,
      experience: [...prev.experience, {
        id: Date.now().toString(),
        company: '',
        position: '',
        startDate: '',
        endDate: '',
        current: false,
        responsibilities: [],
        achievements: [],
        technologies: []
      }]
    }));
  };

  const removeExperience = (id: string) => {
    setEditData(prev => ({
      ...prev,
      experience: prev.experience.filter(exp => exp.id !== id)
    }));
  };

  const updateExperience = (id: string, updates: Partial<typeof editData.experience[0]>) => {
    setEditData(prev => ({
      ...prev,
      experience: prev.experience.map(exp => 
        exp.id === id ? { ...exp, ...updates } : exp
      )
    }));
  };

  const addEducation = () => {
    setEditData(prev => ({
      ...prev,
      education: [...prev.education, {
        id: Date.now().toString(),
        institution: '',
        degree: '',
        graduationYear: ''
      }]
    }));
  };

  const removeEducation = (id: string) => {
    setEditData(prev => ({
      ...prev,
      education: prev.education.filter(edu => edu.id !== id)
    }));
  };

  const updateEducation = (id: string, updates: Partial<typeof editData.education[0]>) => {
    setEditData(prev => ({
      ...prev,
      education: prev.education.map(edu => 
        edu.id === id ? { ...edu, ...updates } : edu
      )
    }));
  };

  return (
    <div className="space-y-6">
      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Review & Edit Your CV</span>
            <div className="flex gap-2">
              <Button variant="outline" onClick={onBack}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Interview
              </Button>
              <Button onClick={handleSave} className="bg-gradient-primary">
                <Save className="h-4 w-4 mr-2" />
                Save & Continue
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        
        <CardContent>
          <Tabs defaultValue="contact" className="space-y-4">
            <TabsList className="grid w-full grid-cols-4 lg:grid-cols-7">
              <TabsTrigger value="contact">Contact</TabsTrigger>
              <TabsTrigger value="summary">Summary</TabsTrigger>
              <TabsTrigger value="skills">Skills</TabsTrigger>
              <TabsTrigger value="experience">Experience</TabsTrigger>
              <TabsTrigger value="education">Education</TabsTrigger>
              <TabsTrigger value="certifications">Certificates</TabsTrigger>
              <TabsTrigger value="languages">Languages</TabsTrigger>
            </TabsList>

            <TabsContent value="contact" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Full Name</label>
                  <Input
                    value={editData.contact.name}
                    onChange={(e) => setEditData(prev => ({
                      ...prev,
                      contact: { ...prev.contact, name: e.target.value }
                    }))}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Email</label>
                  <Input
                    type="email"
                    value={editData.contact.email}
                    onChange={(e) => setEditData(prev => ({
                      ...prev,
                      contact: { ...prev.contact, email: e.target.value }
                    }))}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Phone</label>
                  <Input
                    value={editData.contact.phone}
                    onChange={(e) => setEditData(prev => ({
                      ...prev,
                      contact: { ...prev.contact, phone: e.target.value }
                    }))}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Location</label>
                  <Input
                    value={editData.contact.location}
                    onChange={(e) => setEditData(prev => ({
                      ...prev,
                      contact: { ...prev.contact, location: e.target.value }
                    }))}
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="summary" className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Professional Summary</label>
                <Textarea
                  value={editData.summary}
                  onChange={(e) => setEditData(prev => ({ ...prev, summary: e.target.value }))}
                  className="min-h-[120px]"
                  placeholder="Write a brief professional summary highlighting your key skills and experience..."
                />
              </div>
            </TabsContent>

            <TabsContent value="skills" className="space-y-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Technical Skills</label>
                  <Input
                    value={editData.skills.technical.join(', ')}
                    onChange={(e) => setEditData(prev => ({
                      ...prev,
                      skills: { ...prev.skills, technical: e.target.value.split(',').map(s => s.trim()) }
                    }))}
                    placeholder="JavaScript, React, Node.js, Python..."
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Management & Business Skills</label>
                  <Input
                    value={editData.skills.management.join(', ')}
                    onChange={(e) => setEditData(prev => ({
                      ...prev,
                      skills: { ...prev.skills, management: e.target.value.split(',').map(s => s.trim()) }
                    }))}
                    placeholder="Project Management, Team Leadership, Strategic Planning..."
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Soft Skills</label>
                  <Input
                    value={editData.skills.soft.join(', ')}
                    onChange={(e) => setEditData(prev => ({
                      ...prev,
                      skills: { ...prev.skills, soft: e.target.value.split(',').map(s => s.trim()) }
                    }))}
                    placeholder="Communication, Problem Solving, Adaptability..."
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="experience" className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Work Experience</h3>
                <Button onClick={addExperience} size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Experience
                </Button>
              </div>
              
              <div className="space-y-4">
                {editData.experience.map((exp, index) => (
                  <Card key={exp.id} className="relative">
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start">
                        <Badge variant="outline">Experience #{index + 1}</Badge>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeExperience(exp.id)}
                          className="h-8 w-8"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <Input
                          placeholder="Company Name"
                          value={exp.company}
                          onChange={(e) => updateExperience(exp.id, { company: e.target.value })}
                        />
                        <Input
                          placeholder="Job Title"
                          value={exp.position}
                          onChange={(e) => updateExperience(exp.id, { position: e.target.value })}
                        />
                        <Input
                          placeholder="Start Date (e.g., Jan 2020)"
                          value={exp.startDate}
                          onChange={(e) => updateExperience(exp.id, { startDate: e.target.value })}
                        />
                        <Input
                          placeholder="End Date (or 'Present')"
                          value={exp.endDate}
                          onChange={(e) => updateExperience(exp.id, { endDate: e.target.value })}
                        />
                      </div>
                      <Textarea
                        placeholder="Key responsibilities and achievements..."
                        value={exp.responsibilities.join('\n')}
                        onChange={(e) => updateExperience(exp.id, { 
                          responsibilities: e.target.value.split('\n').filter(Boolean) 
                        })}
                        className="min-h-[100px]"
                      />
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="education" className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Education</h3>
                <Button onClick={addEducation} size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Education
                </Button>
              </div>
              
              <div className="space-y-4">
                {editData.education.map((edu, index) => (
                  <Card key={edu.id}>
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start">
                        <Badge variant="outline">Education #{index + 1}</Badge>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeEducation(edu.id)}
                          className="h-8 w-8"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <Input
                          placeholder="Institution"
                          value={edu.institution}
                          onChange={(e) => updateEducation(edu.id, { institution: e.target.value })}
                        />
                        <Input
                          placeholder="Degree"
                          value={edu.degree}
                          onChange={(e) => updateEducation(edu.id, { degree: e.target.value })}
                        />
                        <Input
                          placeholder="Year"
                          value={edu.graduationYear}
                          onChange={(e) => updateEducation(edu.id, { graduationYear: e.target.value })}
                        />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="certifications" className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Certifications</label>
                <Textarea
                  placeholder="List your certifications, one per line..."
                  className="min-h-[120px]"
                />
              </div>
            </TabsContent>

            <TabsContent value="languages" className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Languages</label>
                <Textarea
                  placeholder="List languages and proficiency levels, e.g.:&#10;English - Native&#10;Spanish - Conversational&#10;French - Beginner"
                  className="min-h-[120px]"
                />
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};