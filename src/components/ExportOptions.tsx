import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Download, 
  FileText, 
  File, 
  Code, 
  RotateCcw,
  CheckCircle
} from 'lucide-react';

interface ExportOptionsProps {
  resume: any;
  onRestart: () => void;
}

export const ExportOptions: React.FC<ExportOptionsProps> = ({ resume, onRestart }) => {
  const handleExport = (format: string) => {
    // Mock export functionality
    console.log(`Exporting resume in ${format} format`);
    alert(`Resume exported in ${format.toUpperCase()} format! (Mock functionality)`);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            Export Your Optimized Resume
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Download your ATS-friendly, job-targeted resume in your preferred format
          </p>
        </CardHeader>
      </Card>

      {/* Export Formats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => handleExport('pdf')}>
          <CardContent className="p-6 text-center">
            <File className="h-12 w-12 mx-auto mb-4 text-red-600" />
            <h3 className="font-semibold mb-2">PDF Format</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Most widely accepted format, preserves formatting
            </p>
            <Badge variant="secondary">Recommended</Badge>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => handleExport('docx')}>
          <CardContent className="p-6 text-center">
            <FileText className="h-12 w-12 mx-auto mb-4 text-blue-600" />
            <h3 className="font-semibold mb-2">DOCX Format</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Editable format for further customization
            </p>
            <Badge variant="outline">Editable</Badge>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => handleExport('markdown')}>
          <CardContent className="p-6 text-center">
            <Code className="h-12 w-12 mx-auto mb-4 text-green-600" />
            <h3 className="font-semibold mb-2">Markdown</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Plain text format, easy to convert
            </p>
            <Badge variant="outline">Developer Friendly</Badge>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => handleExport('json')}>
          <CardContent className="p-6 text-center">
            <Code className="h-12 w-12 mx-auto mb-4 text-purple-600" />
            <h3 className="font-semibold mb-2">JSON Data</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Structured data for integrations
            </p>
            <Badge variant="outline">Data Export</Badge>
          </CardContent>
        </Card>
      </div>

      {/* Success Message */}
      <Card className="bg-green-50 border-green-200">
        <CardContent className="pt-6">
          <div className="flex items-center gap-3 mb-4">
            <CheckCircle className="h-6 w-6 text-green-600" />
            <div>
              <h3 className="font-semibold text-green-800">Resume Optimization Complete!</h3>
              <p className="text-sm text-green-700">
                Your resume has been successfully optimized for the target job position.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-green-600">89%</div>
              <div className="text-sm text-green-700">ATS Score</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-600">+23%</div>
              <div className="text-sm text-blue-700">Job Match</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-600">12</div>
              <div className="text-sm text-purple-700">Keywords Added</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex justify-center gap-4">
        <Button variant="outline" onClick={onRestart} className="flex items-center gap-2">
          <RotateCcw className="h-4 w-4" />
          Optimize Another Resume
        </Button>
      </div>
    </div>
  );
};