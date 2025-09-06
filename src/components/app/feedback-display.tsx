'use client';

/**
 * Feedback Display Component - AI Response Interface
 *
 * This component displays AI-generated code solutions and explanations from the
 * Stealth Coder application. It handles multiple states (loading, error, empty,
 * content) and provides minimize/drag functionality matching the input form.
 */

import type { GenerateCodeSolutionOutput } from '@/ai/flows/generate-code-solution';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Bot, Lightbulb, AlertCircle, FileText, IterationCcw, Minus } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

/**
 * Component Props Interface
 * Defines the props required for displaying AI feedback
 */
type FeedbackDisplayProps = {
  // AI-generated solution data or null if not available
  feedback: GenerateCodeSolutionOutput | null;
  // Loading state during AI processing
  isLoading: boolean;
  // Error message string or null if no error
  error: string | null;
};

/**
 * Main Feedback Display Component
 * Renders AI responses with minimize/drag functionality and multiple display states
 */
export function FeedbackDisplay({ feedback, isLoading, error }: FeedbackDisplayProps) {
  /**
   * UI State Management for Minimize/Drag Functionality
   */
  const [isMinimized, setIsMinimized] = useState(false);  // Minimize/maximize state
  const [position, setPosition] = useState({ x: 480, y: 20 });  // Initial position (right of form)
  const [isDragging, setIsDragging] = useState(false);  // Drag operation state
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });  // Mouse offset during drag

  /**
   * Drag Functionality Handlers
   * Enables dragging of the minimized window around the screen
   */

  /**
   * Mouse Down Handler - Initiates Drag Operation
   * Captures initial mouse position relative to window for accurate dragging
   */
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

  /**
   * Mouse Move Handler - Updates Window Position During Drag
   * Calculates new position based on mouse movement and drag offset
   */
  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && isMinimized) {
      setPosition({
        x: e.clientX - dragOffset.x,
        y: e.clientY - dragOffset.y,
      });
    }
  };

  /**
   * Mouse Up Handler - Terminates Drag Operation
   * Resets drag state when user releases mouse button
   */
  const handleMouseUp = () => {
    setIsDragging(false);
  };

  /**
   * Loading State Component
   * Displays skeleton placeholders while AI is processing the request
   */
  const LoadingState = () => (
    <div className="space-y-4 pt-4">
      <Skeleton className="h-8 w-1/2" />      {/* Title skeleton */}
      <Skeleton className="h-20 w-full" />    {/* Content skeleton */}
      <Skeleton className="h-8 w-1/3 mt-4" /> {/* Section title skeleton */}
      <Skeleton className="h-20 w-full" />    {/* Content skeleton */}
    </div>
  );

  /**
   * Empty State Component
   * Displays when no feedback is available (initial state)
   */
  const EmptyState = () => (
    <div className="text-center text-muted-foreground py-16">
      <Bot className="mx-auto h-12 w-12" />
      <p className="mt-4 text-lg">AI feedback will appear here.</p>
      <p>Fill out the form and click "Generate Solution" to start.</p>
    </div>
  );

  /**
   * Error State Component
   * Displays error messages when AI processing fails
   */
  const ErrorState = () => (
    <div className="text-center text-destructive-foreground bg-destructive/80 rounded-lg p-8">
      <AlertCircle className="mx-auto h-12 w-12" />
      <p className="mt-4 text-lg font-semibold">An Error Occurred</p>
      <p className="font-mono mt-2">{error}</p>
    </div>
  );

  /**
   * Feedback Content Component
   * Renders the complete AI-generated solution with structured sections
   */
  const FeedbackContent = () => (
    <div className="space-y-6">
      {/* High-Level Explanation Section */}
      <div>
        <h3 className="text-xl flex items-center gap-2 text-primary-foreground/90 font-sans">
          <FileText className="h-6 w-6" />
          High-Level Explanation
        </h3>
        <div className="mt-2 text-foreground/90 whitespace-pre-wrap bg-secondary p-4 rounded-md font-sans">
          {feedback?.highLevelExplanation}
        </div>
      </div>

      {/* Code Solution Section */}
      <div>
        <h3 className="text-xl flex items-center gap-2 text-primary-foreground/90 font-sans">
          <Lightbulb className="h-6 w-6" />
          Code Solution
        </h3>
        <div className="mt-2 text-foreground/90 whitespace-pre-wrap bg-secondary p-4 rounded-md font-mono text-sm">
          {feedback?.code}
        </div>
      </div>

      {/* Line-by-Line Breakdown Section */}
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

  /**
   * Main Component Render
   * Conditionally renders based on minimize state and content availability
   */
  return (
    <div
      // Dynamic styling based on minimize state
      className={isMinimized ? "fixed z-50" : ""}
      style={isMinimized ? {
        left: position.x,
        top: position.y,
        cursor: isDragging ? 'grabbing' : 'grab',  // Visual feedback during drag
        width: '448px', // Fixed width to match form component (28rem = 448px)
        height: 'auto'
      } : {}}
      // Mouse event handlers for drag functionality
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <Card className={`bg-card/90 border-border shadow-lg ${isMinimized ? 'w-full min-h-[80px]' : 'min-h-[400px] max-h-[600px] max-w-md'}`}>
        <CardHeader
          // Enable dragging on header when minimized
          style={{ WebkitAppRegion: 'drag' } as any}
          onMouseDown={handleMouseDown}
          className={isMinimized ? "cursor-grab active:cursor-grabbing" : ""}
        >
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl">AI Assistant</CardTitle>
            <CardDescription>AI-generated solution and explanation will be displayed below.</CardDescription>
          </div>
          {/* Minimize/Maximize Toggle Button */}
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
      {/* Conditional rendering of content when not minimized */}
      {!isMinimized && (
        <CardContent className="max-h-[400px] overflow-y-auto">
        {/* State-based content rendering */}
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