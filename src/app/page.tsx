'use client';

import { useState } from 'react';
import { CodeFeedbackForm } from '@/components/app/code-feedback-form';
import { FeedbackDisplay } from '@/components/app/feedback-display';
import type { GenerateCodeSolutionOutput } from '@/ai/flows/generate-code-solution';

export default function Home() {
  const [feedback, setFeedback] = useState<GenerateCodeSolutionOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  return (
    <main className="min-h-screen bg-transparent text-foreground p-2 sm:p-3 md:p-4">
      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-start">
          <CodeFeedbackForm setFeedback={setFeedback} setIsLoading={setIsLoading} setError={setError} />
          <FeedbackDisplay feedback={feedback} isLoading={isLoading} error={error} />
        </div>
      </div>
    </main>
  );
}
