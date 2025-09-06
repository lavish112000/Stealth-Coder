'use client';

/**
 * Main Page Component - Stealth Coder Application Entry Point
 *
 * This is the root page component for the Stealth Coder application. It serves as
 * the main layout container that orchestrates the interaction between the code
 * feedback form and the AI response display components.
 */

import { useState } from 'react';
import { CodeFeedbackForm } from '@/components/app/code-feedback-form';
import { FeedbackDisplay } from '@/components/app/feedback-display';
import type { GenerateCodeSolutionOutput } from '@/ai/flows/generate-code-solution';

/**
 * Home Page Component
 * Main application interface that coordinates form input and AI output display
 */
export default function Home() {
  /**
   * Application State Management
   * Shared state between form and display components
   */
  const [feedback, setFeedback] = useState<GenerateCodeSolutionOutput | null>(null);  // AI response data
  const [isLoading, setIsLoading] = useState(false);  // Loading state during AI processing
  const [error, setError] = useState<string | null>(null);  // Error messages from AI processing

  /**
   * Main Application Layout
   * Responsive grid layout with transparent background for desktop integration
   */
  return (
    <main className="min-h-screen bg-transparent text-foreground p-2 sm:p-3 md:p-4">
      {/* Container with maximum width constraint */}
      <div className="max-w-4xl mx-auto">
        {/* Responsive grid layout for form and display components */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-start">
          {/* Left column: Code input form */}
          <CodeFeedbackForm
            setFeedback={setFeedback}
            setIsLoading={setIsLoading}
            setError={setError}
          />
          {/* Right column: AI response display */}
          <FeedbackDisplay
            feedback={feedback}
            isLoading={isLoading}
            error={error}
          />
        </div>
      </div>
    </main>
  );
}
