import React, { useState } from 'react';
import { CVInterviewChat } from '@/components/CVInterviewChat';
import { CVPreview } from '@/components/CVPreview';

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

const Index = () => {
  const [currentView, setCurrentView] = useState<'interview' | 'preview'>('interview');
  const [userData, setUserData] = useState<UserData>({});

  const handleInterviewComplete = (data: UserData) => {
    setUserData(data);
    setCurrentView('preview');
  };

  const handleBackToInterview = () => {
    setCurrentView('interview');
  };

  return (
    <>
      {currentView === 'interview' ? (
        <CVInterviewChat onComplete={handleInterviewComplete} />
      ) : (
        <CVPreview userData={userData} onBack={handleBackToInterview} />
      )}
    </>
  );
};

export default Index;
