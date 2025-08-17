'use client';

import type { GetCodeFeedbackOutput } from '@/ai/flows/get-code-feedback';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Bot, Lightbulb, AlertCircle } from 'lucide-react';

type FeedbackDisplayProps = {
  feedback: GetCodeFeedbackOutput | null;
  isLoading: boolean;
  error: string | null;
};

export function FeedbackDisplay({ feedback, isLoading, error }: FeedbackDisplayProps) {
  const LoadingState = () => (
    <div className="space-y-4 pt-4">
      <Skeleton className="h-8 w-1/2" />
      <Skeleton className="h-20 w-full" />
      <Skeleton className="h-8 w-1/3 mt-4" />
      <Skeleton className="h-20 w-full" />
    </div>
  );

  const EmptyState = () => (
    <div className="text-center text-muted-foreground py-16">
      <Bot className="mx-auto h-12 w-12" />
      <p className="mt-4 text-lg">AI feedback will appear here.</p>
      <p>Fill out the form and click "Get AI Feedback" to start.</p>
    </div>
  );

  const ErrorState = () => (
    <div className="text-center text-destructive-foreground bg-destructive/80 rounded-lg p-8">
      <AlertCircle className="mx-auto h-12 w-12" />
      <p className="mt-4 text-lg font-semibold">An Error Occurred</p>
      <p className="font-code mt-2">{error}</p>
    </div>
  );
  
  const FeedbackContent = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-headline flex items-center gap-2 text-primary-foreground/90">
          <Bot className="h-6 w-6" />
          Feedback
        </h3>
        <div className="mt-2 text-foreground/90 whitespace-pre-wrap font-body bg-secondary p-4 rounded-md">
          {feedback?.feedback}
        </div>
      </div>
      <div>
        <h3 className="text-xl font-headline flex items-center gap-2 text-primary-foreground/90">
          <Lightbulb className="h-6 w-6" />
          Suggestions
        </h3>
        <div className="mt-2 text-foreground/90 whitespace-pre-wrap font-code bg-secondary p-4 rounded-md">
          {feedback?.suggestions}
        </div>
      </div>
    </div>
  );

  return (
    <Card className="bg-card/80 border-border shadow-lg min-h-[642px]">
      <CardHeader>
        <CardTitle className="text-2xl font-headline">AI Assistant</CardTitle>
        <CardDescription>Feedback and suggestions from the AI will be displayed below.</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading && <LoadingState />}
        {!isLoading && error && <ErrorState />}
        {!isLoading && !error && !feedback && <EmptyState />}
        {!isLoading && !error && feedback && <FeedbackContent />}
      </CardContent>
    </Card>
  );
}
