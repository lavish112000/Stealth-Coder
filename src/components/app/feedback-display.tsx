'use client';

import type { GenerateCodeSolutionOutput } from '@/ai/flows/generate-code-solution';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Bot, Lightbulb, AlertCircle, FileText, IterationCcw, Minus } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

type FeedbackDisplayProps = {
  feedback: GenerateCodeSolutionOutput | null;
  isLoading: boolean;
  error: string | null;
};

export function FeedbackDisplay({ feedback, isLoading, error }: FeedbackDisplayProps) {
  const [isMinimized, setIsMinimized] = useState(false);
  const [position, setPosition] = useState({ x: 480, y: 20 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const handleMouseDown = (e: React.MouseEvent) => {
    if (isMinimized) {
      setIsDragging(true);
      const rect = e.currentTarget.getBoundingClientRect();
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && isMinimized) {
      setPosition({
        x: e.clientX - dragOffset.x,
        y: e.clientY - dragOffset.y,
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };
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
      <p>Fill out the form and click "Generate Solution" to start.</p>
    </div>
  );

  const ErrorState = () => (
    <div className="text-center text-destructive-foreground bg-destructive/80 rounded-lg p-8">
      <AlertCircle className="mx-auto h-12 w-12" />
      <p className="mt-4 text-lg font-semibold">An Error Occurred</p>
      <p className="font-mono mt-2">{error}</p>
    </div>
  );
  
  const FeedbackContent = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl flex items-center gap-2 text-primary-foreground/90 font-sans">
          <FileText className="h-6 w-6" />
          High-Level Explanation
        </h3>
        <div className="mt-2 text-foreground/90 whitespace-pre-wrap bg-secondary p-4 rounded-md font-sans">
          {feedback?.highLevelExplanation}
        </div>
      </div>
      <div>
        <h3 className="text-xl flex items-center gap-2 text-primary-foreground/90 font-sans">
          <Lightbulb className="h-6 w-6" />
          Code Solution
        </h3>
        <div className="mt-2 text-foreground/90 whitespace-pre-wrap bg-secondary p-4 rounded-md font-mono text-sm">
          {feedback?.code}
        </div>
      </div>
      <div>
        <h3 className="text-xl flex items-center gap-2 text-primary-foreground/90 font-sans">
          <IterationCcw className="h-6 w-6" />
          Line-by-Line Breakdown
        </h3>
        <div className="mt-2 text-foreground/90 whitespace-pre-wrap bg-secondary p-4 rounded-md font-mono">
          {feedback?.lineByLineBreakdown}
        </div>
      </div>
    </div>
  );

  return (
    <div
      className={isMinimized ? "fixed z-50" : ""}
      style={isMinimized ? { 
        left: position.x, 
        top: position.y, 
        cursor: isDragging ? 'grabbing' : 'grab',
        width: '448px', // w-112 (28rem = 448px) to match max-w-md
        height: 'auto'
      } : {}}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <Card className={`bg-card/90 border-border shadow-lg ${isMinimized ? 'w-full min-h-[80px]' : 'min-h-[400px] max-h-[600px] max-w-md'}`}>
        <CardHeader
          style={{ WebkitAppRegion: 'drag' } as any}
          onMouseDown={handleMouseDown}
          className={isMinimized ? "cursor-grab active:cursor-grabbing" : ""}
        >
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl">AI Assistant</CardTitle>
            <CardDescription>AI-generated solution and explanation will be displayed below.</CardDescription>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => setIsMinimized(!isMinimized)}
            className="h-8 w-8"
          >
            <Minus className="h-4 w-4" />
            <span className="sr-only">Minimize</span>
          </Button>
        </div>
      </CardHeader>
      {!isMinimized && (
        <CardContent className="max-h-[400px] overflow-y-auto">
        {isLoading && <LoadingState />}
        {!isLoading && error && <ErrorState />}
        {!isLoading && !error && !feedback && <EmptyState />}
        {!isLoading && !error && feedback && <FeedbackContent />}
      </CardContent>
      )}
    </Card>
    </div>
  );
}
