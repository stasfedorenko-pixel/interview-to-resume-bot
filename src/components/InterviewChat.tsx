import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Mic, MicOff, Send, Bot, User, Volume2, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Message {
  id: string;
  type: 'ai' | 'user';
  content: string;
  timestamp: Date;
}

interface InterviewChatProps {
  section: string;
  linkedinData: any;
  onSectionComplete: (section: string, data: any) => void;
  recordingSupported: boolean;
  existingData?: any;
}

// Interview questions for each section
const interviewQuestions = {
  contact: [
    "Let me confirm your contact information. Please state your full name as you'd like it to appear on your CV.",
    "What is your preferred phone number for job applications?",
    "What email address should employers use to contact you?", 
    "What is your current location? Just city and state/country is fine.",
    "Would you like to include any professional profiles like GitHub or personal website?"
  ],
  summary: [
    "Can you briefly summarize your professional background in 4-5 sentences?",
    "What are the main strengths you want employers to notice first?",
    "Do you want to emphasize years of experience, specific industries, or particular achievements?"
  ],
  skills: [
    "What are your top technical skills? Please mention tools, frameworks, and programming languages.",
    "What are your key management or business skills?",
    "Which soft skills do you want to highlight, such as communication, leadership, or teamwork?"
  ],
  experience: [
    "Let's go through your work experience. Can you confirm the details of your current or most recent position?",
    "What were your main responsibilities in this role?",
    "Can you describe 2-3 key achievements you're most proud of?",
    "Did you manage a team? If so, how many people and what were their roles?",
    "What technologies, tools, or methods did you use in this position?"
  ],
  education: [
    "Please confirm your educational background - degrees, institutions, and graduation years.",
    "Would you like to include any additional programs, certifications, or executive education?"
  ],
  certifications: [
    "Please list your professional certifications.",
    "Would you like to include expiry dates or certificate numbers for any of these?"
  ],
  languages: [
    "What languages do you speak and at what proficiency level?",
    "Should I include both native and secondary languages?"
  ]
};

export const InterviewChat: React.FC<InterviewChatProps> = ({
  section,
  linkedinData,
  onSectionComplete,
  recordingSupported,
  existingData
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentInput, setCurrentInput] = useState('');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [sectionData, setSectionData] = useState<any>(existingData || {});
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  const questions = interviewQuestions[section] || [];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Reset for new section
    setMessages([]);
    setCurrentQuestionIndex(0);
    setSectionData(existingData || {});
    
    // Start with first question
    setTimeout(() => {
      addAIMessage(getContextualQuestion(0));
    }, 1000);
  }, [section, existingData]);

  const getContextualQuestion = (index: number): string => {
    const baseQuestion = questions[index] || "Please provide any additional information for this section.";
    
    // Add LinkedIn context if available
    if (linkedinData && hasLinkedInDataForSection()) {
      const prefix = "I see from your LinkedIn profile that ";
      switch (section) {
        case 'contact':
          if (index === 0 && linkedinData.name) {
            return `${prefix}your name is "${linkedinData.name}". ${baseQuestion}`;
          }
          break;
        case 'experience':
          if (index === 0 && linkedinData.experience?.[0]) {
            const exp = linkedinData.experience[0];
            return `${prefix}you work at ${exp.company} as ${exp.position}. Can you confirm these details and tell me about your responsibilities?`;
          }
          break;
      }
    }
    
    return baseQuestion;
  };

  const hasLinkedInDataForSection = (): boolean => {
    if (!linkedinData) return false;
    
    switch (section) {
      case 'contact': return !!(linkedinData.name || linkedinData.location);
      case 'summary': return !!linkedinData.summary;
      case 'skills': return !!(linkedinData.skills?.length);
      case 'experience': return !!(linkedinData.experience?.length);
      case 'education': return !!(linkedinData.education?.length);
      default: return false;
    }
  };

  const addAIMessage = (content: string) => {
    setIsTyping(true);
    setTimeout(() => {
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        type: 'ai',
        content,
        timestamp: new Date()
      }]);
      setIsTyping(false);
    }, 1500);
  };

  const addUserMessage = (content: string) => {
    setMessages(prev => [...prev, {
      id: Date.now().toString(),
      type: 'user',
      content,
      timestamp: new Date()
    }]);
  };

  const startRecording = () => {
    if (!recordingSupported) return;

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setIsRecording(true);
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setCurrentInput(transcript);
      setIsRecording(false);
    };

    recognition.onerror = () => {
      setIsRecording(false);
    };

    recognition.onend = () => {
      setIsRecording(false);
    };

    recognitionRef.current = recognition;
    recognition.start();
  };

  const stopRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsRecording(false);
  };

  const processAnswer = (answer: string) => {
    // Process the answer based on current section and question
    const updatedData = { ...sectionData };
    
    switch (section) {
      case 'contact':
        if (currentQuestionIndex === 0) updatedData.name = answer;
        if (currentQuestionIndex === 1) updatedData.phone = answer;
        if (currentQuestionIndex === 2) updatedData.email = answer;
        if (currentQuestionIndex === 3) updatedData.location = answer;
        break;
      case 'summary':
        updatedData.summary = answer;
        break;
      case 'skills':
        if (currentQuestionIndex === 0) updatedData.technical = answer.split(',').map(s => s.trim());
        if (currentQuestionIndex === 1) updatedData.management = answer.split(',').map(s => s.trim());
        if (currentQuestionIndex === 2) updatedData.soft = answer.split(',').map(s => s.trim());
        break;
      // Add processing for other sections
    }
    
    setSectionData(updatedData);
    return updatedData;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentInput.trim()) return;

    const answer = currentInput.trim();
    addUserMessage(answer);
    setCurrentInput('');

    const updatedData = processAnswer(answer);

    // Move to next question or complete section
    setTimeout(() => {
      const nextIndex = currentQuestionIndex + 1;
      if (nextIndex < questions.length) {
        setCurrentQuestionIndex(nextIndex);
        addAIMessage(getContextualQuestion(nextIndex));
      } else {
        // Section complete
        addAIMessage("Perfect! I have all the information I need for this section. Let's move on to the next one.");
        setTimeout(() => {
          onSectionComplete(section, updatedData);
        }, 2000);
      }
    }, 1000);
  };

  return (
    <Card className="shadow-soft">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Interview: {section}</span>
          {hasLinkedInDataForSection() && (
            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
              LinkedIn Data Available
            </Badge>
          )}
        </CardTitle>
        {hasLinkedInDataForSection() && (
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              I'll use information from your LinkedIn profile to speed up this section. Please confirm or correct any details.
            </AlertDescription>
          </Alert>
        )}
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Messages */}
        <div className="h-64 overflow-y-auto space-y-3 p-4 bg-muted/20 rounded-lg">
          <AnimatePresence>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className={`flex gap-3 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex gap-3 max-w-[80%] ${message.type === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                  <div className={`p-2 rounded-full ${message.type === 'user' ? 'bg-chat-user' : 'bg-chat-ai'}`}>
                    {message.type === 'user' ? (
                      <User className="h-4 w-4 text-chat-user-foreground" />
                    ) : (
                      <Bot className="h-4 w-4 text-chat-ai-foreground" />
                    )}
                  </div>
                  <Card className={`${message.type === 'user' ? 'bg-chat-user text-chat-user-foreground' : 'bg-chat-ai'}`}>
                    <CardContent className="p-3">
                      <p className="text-sm leading-relaxed">{message.content}</p>
                    </CardContent>
                  </Card>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Typing indicator */}
          {isTyping && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex gap-3"
            >
              <div className="p-2 bg-chat-ai rounded-full">
                <Bot className="h-4 w-4 text-chat-ai-foreground" />
              </div>
              <Card className="bg-chat-ai">
                <CardContent className="p-3">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <form onSubmit={handleSubmit} className="flex gap-3">
          <div className="flex-1 relative">
            <Textarea
              value={currentInput}
              onChange={(e) => setCurrentInput(e.target.value)}
              placeholder="Type your answer or use voice input..."
              className="min-h-[60px] pr-12"
              disabled={isTyping}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
            />
            
            {recordingSupported && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className={`absolute right-2 top-2 ${isRecording ? 'text-red-500' : ''}`}
                onClick={isRecording ? stopRecording : startRecording}
                disabled={isTyping}
              >
                {isRecording ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
              </Button>
            )}
          </div>
          
          <Button 
            type="submit" 
            disabled={!currentInput.trim() || isTyping}
            className="self-end"
          >
            <Send className="h-4 w-4" />
          </Button>
        </form>

        <div className="text-xs text-muted-foreground">
          Question {currentQuestionIndex + 1} of {questions.length} • 
          {recordingSupported ? ' Click the mic to use voice input or type your response' : ' Type your response below'}
        </div>
      </CardContent>
    </Card>
  );
};