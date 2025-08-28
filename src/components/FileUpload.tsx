import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { 
  Upload, 
  FileText, 
  File, 
  CheckCircle, 
  AlertCircle, 
  X,
  Loader2
} from 'lucide-react';

interface UploadedFile {
  id: string;
  file: File;
  status: 'pending' | 'processing' | 'completed' | 'error';
  progress: number;
  data?: any;
  error?: string;
}

interface FileUploadProps {
  onComplete: (data: any[]) => void;
  onSkip: () => void;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onComplete, onSkip }) => {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const supportedTypes = [
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/msword',
    'text/markdown',
    'text/plain'
  ];

  const getFileIcon = (type: string) => {
    if (type === 'application/pdf') return <File className="h-5 w-5" />;
    if (type.includes('word')) return <FileText className="h-5 w-5" />;
    return <FileText className="h-5 w-5" />;
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const droppedFiles = Array.from(e.dataTransfer.files);
    handleFiles(droppedFiles);
  }, []);

  const handleFiles = (newFiles: File[]) => {
    const validFiles = newFiles.filter(file => 
      supportedTypes.includes(file.type) && file.size <= 10 * 1024 * 1024 // 10MB limit
    );

    const fileObjects: UploadedFile[] = validFiles.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      file,
      status: 'pending',
      progress: 0
    }));

    setFiles(prev => [...prev, ...fileObjects]);
  };

  const removeFile = (id: string) => {
    setFiles(prev => prev.filter(f => f.id !== id));
  };

  const processFiles = async () => {
    if (files.length === 0) return;

    setIsProcessing(true);
    const processedData: any[] = [];

    for (const fileObj of files) {
      setFiles(prev => prev.map(f => 
        f.id === fileObj.id ? { ...f, status: 'processing', progress: 50 } : f
      ));

      try {
        // Simulate file processing - replace with actual parsing
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Mock parsed CV data - replace with actual file parsing
        const mockData = {
          source: 'file',
          fileName: fileObj.file.name,
          contact: {
            name: 'Jane Smith',
            email: 'jane.smith@example.com',
            phone: '+1-555-0123',
            location: 'New York, NY'
          },
          summary: 'Experienced professional with expertise in multiple domains.',
          experience: [
            {
              id: Math.random().toString(36).substr(2, 9),
              company: 'Previous Company',
              position: 'Senior Role',
              startDate: '2020-01',
              endDate: '2023-12',
              current: false,
              responsibilities: [
                'Led important projects',
                'Managed cross-functional teams'
              ],
              achievements: [
                'Delivered 25% improvement in efficiency',
                'Successfully launched major initiative'
              ],
              technologies: ['Leadership', 'Project Management']
            }
          ],
          education: [
            {
              id: Math.random().toString(36).substr(2, 9),
              institution: 'University Name',
              degree: 'Bachelor of Science',
              graduationYear: '2018'
            }
          ],
          skills: ['Communication', 'Leadership', 'Analysis']
        };

        processedData.push(mockData);

        setFiles(prev => prev.map(f => 
          f.id === fileObj.id 
            ? { ...f, status: 'completed', progress: 100, data: mockData }
            : f
        ));
      } catch (error) {
        setFiles(prev => prev.map(f => 
          f.id === fileObj.id 
            ? { ...f, status: 'error', progress: 0, error: 'Failed to parse file' }
            : f
        ));
      }
    }

    setIsProcessing(false);
    
    if (processedData.length > 0) {
      onComplete(processedData);
    }
  };

  const completedFiles = files.filter(f => f.status === 'completed');
  const hasCompletedFiles = completedFiles.length > 0;

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h3 className="text-xl font-semibold">Upload Your CV Files</h3>
        <p className="text-muted-foreground">
          Upload your existing CVs in PDF, DOCX, MD, or TXT format (max 10MB each)
        </p>
      </div>

      {/* Upload Area */}
      <Card 
        className={`border-2 border-dashed transition-colors cursor-pointer ${
          isDragOver 
            ? 'border-primary bg-accent/50' 
            : 'border-border hover:border-primary/50'
        }`}
        onClick={() => document.getElementById('file-input')?.click()}
        onDrop={handleDrop}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragOver(true);
        }}
        onDragLeave={() => setIsDragOver(false)}
      >
        <CardContent className="py-12 text-center">
          <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <div className="space-y-2">
            <p className="text-lg font-medium">Drop files here or click to browse</p>
            <p className="text-sm text-muted-foreground">
              Supported formats: PDF, DOCX, DOC, MD, TXT
            </p>
          </div>
          <input
            id="file-input"
            type="file"
            multiple
            accept=".pdf,.docx,.doc,.md,.txt"
            className="hidden"
            onChange={(e) => {
              if (e.target.files) {
                handleFiles(Array.from(e.target.files));
              }
            }}
          />
        </CardContent>
      </Card>

      {/* File List */}
      {files.length > 0 && (
        <div className="space-y-3">
          <h4 className="font-medium">Uploaded Files ({files.length})</h4>
          {files.map((file) => (
            <Card key={file.id} className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 flex-1">
                  {getFileIcon(file.file.type)}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{file.file.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {(file.file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {file.status === 'pending' && (
                      <div className="text-muted-foreground">Waiting</div>
                    )}
                    {file.status === 'processing' && (
                      <div className="flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span className="text-sm">Processing...</span>
                      </div>
                    )}
                    {file.status === 'completed' && (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    )}
                    {file.status === 'error' && (
                      <AlertCircle className="h-5 w-5 text-destructive" />
                    )}
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFile(file.id);
                  }}
                  className="ml-2"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              {file.status === 'processing' && (
                <Progress value={file.progress} className="mt-2" />
              )}
              {file.status === 'error' && file.error && (
                <Alert variant="destructive" className="mt-2">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{file.error}</AlertDescription>
                </Alert>
              )}
            </Card>
          ))}
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-3">
        {files.length > 0 && !isProcessing && (
          <Button 
            onClick={processFiles}
            disabled={files.every(f => f.status === 'completed')}
            className="flex-1"
          >
            {hasCompletedFiles ? 'Continue' : 'Process Files'}
          </Button>
        )}
        <Button 
          variant="outline" 
          onClick={onSkip}
          disabled={isProcessing}
        >
          Skip Files
        </Button>
      </div>

      {hasCompletedFiles && (
        <Alert>
          <CheckCircle className="h-4 w-4" />
          <AlertDescription>
            Successfully processed {completedFiles.length} file{completedFiles.length > 1 ? 's' : ''}. 
            Ready to merge with other sources.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};