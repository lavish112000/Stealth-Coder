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
    <main className="min-h-screen bg-transparent text-foreground p-4 sm:p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          <CodeFeedbackForm setFeedback={setFeedback} setIsLoading={setIsLoading} setError={setError} />
          <FeedbackDisplay feedback={feedback} isLoading={isLoading} error={error} />
        </div>
      </div>
    </main>
  );
}
