import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Send, User, Bot, FileText } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Message {
  id: string;
  type: 'ai' | 'user';
  content: string;
  timestamp: Date;
}

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

const interviewQuestions = [
  {
    question: "Hi! I'm your AI CV assistant. Let's create an amazing resume together! What's your full name?",
    field: 'name'
  },
  {
    question: "Great to meet you! What's your email address?",
    field: 'email'
  },
  {
    question: "What's your phone number?",
    field: 'phone'
  },
  {
    question: "Where are you located? (City, State/Country)",
    field: 'location'
  },
  {
    question: "Tell me about yourself in 2-3 sentences. What's your professional summary?",
    field: 'summary'
  },
  {
    question: "Let's talk about your work experience. What's your current or most recent job? (Company name, position, and duration)",
    field: 'experience',
    followUp: "Tell me about your key responsibilities and achievements in this role."
  },
  {
    question: "Any previous work experience you'd like to add? (Type 'no' if done, or provide company, position, duration)",
    field: 'experience',
    repeat: true
  },
  {
    question: "What's your educational background? (Institution, degree, graduation year)",
    field: 'education'
  },
  {
    question: "Any additional education or certifications? (Type 'no' if done)",
    field: 'education',
    repeat: true
  },
  {
    question: "What are your top skills? Please list them separated by commas.",
    field: 'skills'
  },
  {
    question: "Perfect! I have all the information I need. Let me generate your professional CV now!",
    field: 'complete'
  }
];

interface CVInterviewChatProps {
  onComplete: (userData: UserData) => void;
}

export const CVInterviewChat: React.FC<CVInterviewChatProps> = ({ onComplete }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentInput, setCurrentInput] = useState('');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userData, setUserData] = useState<UserData>({});
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Start the interview
    setTimeout(() => {
      addAIMessage(interviewQuestions[0].question);
    }, 1000);
  }, []);

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

  const processAnswer = (answer: string, questionData: typeof interviewQuestions[0]) => {
    const { field } = questionData;
    
    switch (field) {
      case 'name':
        setUserData(prev => ({ ...prev, name: answer }));
        break;
      case 'email':
        setUserData(prev => ({ ...prev, email: answer }));
        break;
      case 'phone':
        setUserData(prev => ({ ...prev, phone: answer }));
        break;
      case 'location':
        setUserData(prev => ({ ...prev, location: answer }));
        break;
      case 'summary':
        setUserData(prev => ({ ...prev, summary: answer }));
        break;
      case 'experience':
        if (answer.toLowerCase() !== 'no') {
          const experienceData = parseExperience(answer);
          setUserData(prev => ({ 
            ...prev, 
            experience: [...(prev.experience || []), experienceData] 
          }));
        }
        break;
      case 'education':
        if (answer.toLowerCase() !== 'no') {
          const educationData = parseEducation(answer);
          setUserData(prev => ({ 
            ...prev, 
            education: [...(prev.education || []), educationData] 
          }));
        }
        break;
      case 'skills':
        const skills = answer.split(',').map(skill => skill.trim()).filter(Boolean);
        setUserData(prev => ({ ...prev, skills }));
        break;
      case 'complete':
        setTimeout(() => {
          onComplete(userData);
        }, 2000);
        return;
    }
  };

  const parseExperience = (text: string) => {
    // Simple parsing - in real app, you'd use more sophisticated NLP
    const parts = text.split(',').map(p => p.trim());
    return {
      company: parts[0] || '',
      position: parts[1] || '',
      duration: parts[2] || '',
      description: parts.slice(3).join(', ') || ''
    };
  };

  const parseEducation = (text: string) => {
    const parts = text.split(',').map(p => p.trim());
    return {
      institution: parts[0] || '',
      degree: parts[1] || '',
      year: parts[2] || ''
    };
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentInput.trim()) return;

    const answer = currentInput.trim();
    addUserMessage(answer);
    setCurrentInput('');

    const currentQuestion = interviewQuestions[currentQuestionIndex];
    processAnswer(answer, currentQuestion);

    // Move to next question
    setTimeout(() => {
      const nextIndex = currentQuestionIndex + 1;
      if (nextIndex < interviewQuestions.length) {
        setCurrentQuestionIndex(nextIndex);
        addAIMessage(interviewQuestions[nextIndex].question);
      }
    }, 1000);
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-background">
      {/* Header */}
      <div className="p-6 border-b bg-card/50 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <FileText className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-semibold">CV Interview Assistant</h1>
            <p className="text-sm text-muted-foreground">Let's build your professional resume together</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        <AnimatePresence>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
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
                <Card className={`shadow-soft ${message.type === 'user' ? 'bg-chat-user text-chat-user-foreground' : 'bg-chat-ai'}`}>
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
            <Card className="bg-chat-ai shadow-soft">
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
      <div className="p-6 border-t bg-card/50 backdrop-blur-sm">
        <form onSubmit={handleSubmit} className="flex gap-3">
          <Input
            value={currentInput}
            onChange={(e) => setCurrentInput(e.target.value)}
            placeholder="Type your answer..."
            className="flex-1"
            disabled={isTyping}
          />
          <Button type="submit" disabled={!currentInput.trim() || isTyping} className="px-6">
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  );
};