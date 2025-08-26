import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, ArrowLeft, Mail, Phone, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';

interface UserData {
  name?: string;
  email?: string;
  phone?: string;
  location?: string;
  summary?: string;
  experience?: Array<{
    company: string;
    position: string;
    duration: string;
    description: string;
  }>;
  education?: Array<{
    institution: string;
    degree: string;
    year: string;
  }>;
  skills?: string[];
}

interface CVPreviewProps {
  userData: UserData;
  onBack: () => void;
}

export const CVPreview: React.FC<CVPreviewProps> = ({ userData, onBack }) => {
  const handleDownload = () => {
    // In a real app, you'd generate a PDF here
    const cvContent = generateCVText(userData);
    const blob = new Blob([cvContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${userData.name?.replace(/\s+/g, '_')}_CV.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const generateCVText = (data: UserData) => {
    let cv = `${data.name}\n`;
    cv += `${data.email} | ${data.phone} | ${data.location}\n\n`;
    
    if (data.summary) {
      cv += `PROFESSIONAL SUMMARY\n${data.summary}\n\n`;
    }
    
    if (data.experience?.length) {
      cv += `WORK EXPERIENCE\n`;
      data.experience.forEach(exp => {
        cv += `${exp.position} at ${exp.company} (${exp.duration})\n`;
        if (exp.description) cv += `${exp.description}\n`;
        cv += `\n`;
      });
    }
    
    if (data.education?.length) {
      cv += `EDUCATION\n`;
      data.education.forEach(edu => {
        cv += `${edu.degree} - ${edu.institution} (${edu.year})\n`;
      });
      cv += `\n`;
    }
    
    if (data.skills?.length) {
      cv += `SKILLS\n${data.skills.join(', ')}\n`;
    }
    
    return cv;
  };

  return (
    <div className="min-h-screen bg-gradient-background p-6">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-6"
        >
          <div className="flex items-center justify-between mb-6">
            <Button variant="outline" onClick={onBack} className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Interview
            </Button>
            <Button onClick={handleDownload} className="gap-2">
              <Download className="h-4 w-4" />
              Download CV
            </Button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card className="shadow-medium bg-card">
            <CardContent className="p-8">
              {/* Header */}
              <div className="text-center mb-8 pb-6 border-b">
                <h1 className="text-3xl font-bold text-foreground mb-2">
                  {userData.name || 'Your Name'}
                </h1>
                <div className="flex flex-wrap justify-center gap-4 text-muted-foreground">
                  {userData.email && (
                    <div className="flex items-center gap-1">
                      <Mail className="h-4 w-4" />
                      <span className="text-sm">{userData.email}</span>
                    </div>
                  )}
                  {userData.phone && (
                    <div className="flex items-center gap-1">
                      <Phone className="h-4 w-4" />
                      <span className="text-sm">{userData.phone}</span>
                    </div>
                  )}
                  {userData.location && (
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      <span className="text-sm">{userData.location}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Professional Summary */}
              {userData.summary && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="mb-8"
                >
                  <h2 className="text-xl font-semibold text-primary mb-3">Professional Summary</h2>
                  <p className="text-foreground leading-relaxed">{userData.summary}</p>
                </motion.div>
              )}

              {/* Work Experience */}
              {userData.experience && userData.experience.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="mb-8"
                >
                  <h2 className="text-xl font-semibold text-primary mb-4">Work Experience</h2>
                  <div className="space-y-4">
                    {userData.experience.map((exp, index) => (
                      <div key={index} className="border-l-2 border-primary/20 pl-4">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2">
                          <h3 className="font-semibold text-foreground">{exp.position}</h3>
                          <span className="text-sm text-muted-foreground">{exp.duration}</span>
                        </div>
                        <p className="text-primary font-medium mb-2">{exp.company}</p>
                        {exp.description && (
                          <p className="text-muted-foreground text-sm leading-relaxed">{exp.description}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Education */}
              {userData.education && userData.education.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  className="mb-8"
                >
                  <h2 className="text-xl font-semibold text-primary mb-4">Education</h2>
                  <div className="space-y-3">
                    {userData.education.map((edu, index) => (
                      <div key={index} className="border-l-2 border-primary/20 pl-4">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                          <div>
                            <h3 className="font-semibold text-foreground">{edu.degree}</h3>
                            <p className="text-primary">{edu.institution}</p>
                          </div>
                          <span className="text-sm text-muted-foreground">{edu.year}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Skills */}
              {userData.skills && userData.skills.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                >
                  <h2 className="text-xl font-semibold text-primary mb-4">Skills</h2>
                  <div className="flex flex-wrap gap-2">
                    {userData.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-accent text-accent-foreground rounded-full text-sm font-medium"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </motion.div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};