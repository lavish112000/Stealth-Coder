'use client';

import { useState } from 'react';
import { CodeFeedbackForm } from '@/components/app/code-feedback-form';
import { FeedbackDisplay } from '@/components/app/feedback-display';
import type { GetCodeFeedbackOutput } from '@/ai/flows/get-code-feedback';

export default function Home() {
  const [feedback, setFeedback] = useState<GetCodeFeedbackOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  return (
    <main className="min-h-screen bg-background text-foreground p-4 sm:p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8 text-center">
          <h1 className="text-4xl lg:text-5xl font-bold text-primary-foreground flex items-center justify-center gap-4">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary-foreground/80"><path d="M10 12.5 8 15l-4-4"/><path d="m14 12.5 2 2.5 4-4"/><path d="M14 5a1 1 0 0 0-1-1H3a2 2 0 0 0-2 2v7.5a2.5 2.5 0 0 0 2.5 2.5H10"/><path d="M21 7a1 1 0 0 0-1-1h-5a2 2 0 0 0-2 2v4a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1Z"/></svg>
            Stealth Coder
          </h1>
          <p className="text-muted-foreground mt-2 text-lg">Your discreet AI interview assistant</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          <CodeFeedbackForm setFeedback={setFeedback} setIsLoading={setIsLoading} setError={setError} />
          <FeedbackDisplay feedback={feedback} isLoading={isLoading} error={error} />
        </div>
      </div>
    </main>
  );
}
