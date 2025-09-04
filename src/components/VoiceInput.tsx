import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Mic, 
  MicOff, 
  Square, 
  Play, 
  Pause,
  Save,
  Trash2,
  Volume2
} from 'lucide-react';

interface VoiceInputProps {
  onComplete: (notes: string) => void;
}

export const VoiceInput: React.FC<VoiceInputProps> = ({ onComplete }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isSupported, setIsSupported] = useState(true);
  const [recordingTime, setRecordingTime] = useState(0);
  const [savedNotes, setSavedNotes] = useState('');
  
  const recognitionRef = useRef<any>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  React.useEffect(() => {
    // Check for speech recognition support
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      setIsSupported(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setIsRecording(true);
      startTimer();
    };

    recognition.onresult = (event: any) => {
      let finalTranscript = '';
      let interimTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript + ' ';
        } else {
          interimTranscript += event.results[i][0].transcript;
        }
      }

      setTranscript(prev => prev + finalTranscript);
    };

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      setIsRecording(false);
      stopTimer();
    };

    recognition.onend = () => {
      setIsRecording(false);
      stopTimer();
    };

    recognitionRef.current = recognition;

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  const startTimer = () => {
    timerRef.current = setInterval(() => {
      setRecordingTime(prev => prev + 1);
    }, 1000);
  };

  const stopTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
  };

  const startRecording = () => {
    if (recognitionRef.current && !isRecording) {
      setRecordingTime(0);
      recognitionRef.current.start();
    }
  };

  const stopRecording = () => {
    if (recognitionRef.current && isRecording) {
      recognitionRef.current.stop();
    }
  };

  const pauseRecording = () => {
    if (recognitionRef.current && isRecording) {
      recognitionRef.current.stop();
      setIsPaused(true);
    }
  };

  const resumeRecording = () => {
    if (recognitionRef.current && isPaused) {
      recognitionRef.current.start();
      setIsPaused(false);
    }
  };

  const clearTranscript = () => {
    setTranscript('');
    setRecordingTime(0);
  };

  const saveNotes = () => {
    const combinedNotes = transcript.trim();
    setSavedNotes(combinedNotes);
    onComplete(combinedNotes);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (!isSupported) {
    return (
      <Card>
        <CardContent className="py-8 text-center">
          <MicOff className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-semibold mb-2">Speech Recognition Not Supported</h3>
          <p className="text-muted-foreground mb-4">
            Your browser doesn't support speech recognition. Please use Chrome, Edge, or Safari.
          </p>
          <Textarea
            placeholder="You can type your additional information here instead..."
            value={transcript}
            onChange={(e) => setTranscript(e.target.value)}
            className="min-h-[100px]"
          />
          <Button 
            onClick={saveNotes}
            disabled={!transcript.trim()}
            className="mt-4 w-full"
          >
            Save Notes
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (savedNotes) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Volume2 className="h-5 w-5 text-green-600" />
            Voice Notes Saved
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 bg-accent/50 rounded-lg">
              <h4 className="font-medium mb-2">Recorded Notes:</h4>
              <p className="text-sm text-muted-foreground">
                {savedNotes.length > 200 ? `${savedNotes.substring(0, 200)}...` : savedNotes}
              </p>
            </div>
            <Alert>
              <Save className="h-4 w-4" />
              <AlertDescription>
                Voice notes saved successfully. These will be used to enrich your resume content 
                during the optimization process.
              </AlertDescription>
            </Alert>
            <Button 
              variant="outline" 
              onClick={() => {
                setSavedNotes('');
                setTranscript('');
              }}
              className="w-full"
            >
              Add More Notes
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Voice Input (Optional)</CardTitle>
          <p className="text-sm text-muted-foreground">
            Add additional information about your experience, skills, or achievements that might not be in your resume
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Recording Controls */}
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center space-x-4">
              {!isRecording && !isPaused && (
                <Button
                  onClick={startRecording}
                  size="lg"
                  className="w-32 h-32 rounded-full bg-red-500 hover:bg-red-600 text-white"
                >
                  <Mic className="h-8 w-8" />
                </Button>
              )}

              {isRecording && !isPaused && (
                <div className="flex space-x-2">
                  <Button
                    onClick={pauseRecording}
                    size="lg"
                    variant="outline"
                    className="w-24 h-24 rounded-full"
                  >
                    <Pause className="h-6 w-6" />
                  </Button>
                  <Button
                    onClick={stopRecording}
                    size="lg"
                    className="w-24 h-24 rounded-full bg-red-500 hover:bg-red-600 text-white animate-pulse"
                  >
                    <Square className="h-6 w-6" />
                  </Button>
                </div>
              )}

              {isPaused && (
                <div className="flex space-x-2">
                  <Button
                    onClick={resumeRecording}
                    size="lg"
                    className="w-24 h-24 rounded-full bg-green-500 hover:bg-green-600 text-white"
                  >
                    <Play className="h-6 w-6" />
                  </Button>
                  <Button
                    onClick={stopRecording}
                    size="lg"
                    variant="destructive"
                    className="w-24 h-24 rounded-full"
                  >
                    <Square className="h-6 w-6" />
                  </Button>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <div className="text-2xl font-mono font-bold">
                {formatTime(recordingTime)}
              </div>
              <p className="text-sm text-muted-foreground">
                {isRecording ? (isPaused ? 'Recording paused' : 'Recording in progress...') : 
                 transcript ? 'Recording completed' : 'Click the microphone to start recording'}
              </p>
            </div>
          </div>

          {/* Transcript Display */}
          {transcript && (
            <div className="space-y-4">
              <div className="border rounded-lg p-4 min-h-[200px] bg-accent/20">
                <h4 className="font-medium mb-2">Transcript:</h4>
                <div className="text-sm whitespace-pre-wrap">
                  {transcript || 'Your speech will appear here...'}
                </div>
              </div>

              {/* Edit Transcript */}
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Edit or add to your transcript:
                </label>
                <Textarea
                  value={transcript}
                  onChange={(e) => setTranscript(e.target.value)}
                  placeholder="You can edit the transcript or add more information here..."
                  className="min-h-[100px] resize-none"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <Button 
                  onClick={saveNotes}
                  disabled={!transcript.trim()}
                  className="flex-1"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save Notes
                </Button>
                <Button 
                  onClick={clearTranscript}
                  variant="outline"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Clear
                </Button>
              </div>
            </div>
          )}

          {/* Help Text */}
          {!transcript && (
            <Alert>
              <Mic className="h-4 w-4" />
              <AlertDescription>
                <strong>Tips for better voice input:</strong>
                <ul className="mt-2 space-y-1 text-sm">
                  <li>• Speak clearly and at a normal pace</li>
                  <li>• Mention specific achievements, metrics, or skills</li>
                  <li>• Include details about projects, tools, or technologies</li>
                  <li>• You can pause and resume recording anytime</li>
                </ul>
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  );
};