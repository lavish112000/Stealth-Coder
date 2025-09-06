'use client';

/**
 * Code Feedback Form Component - Stealth Coder Input Interface
 *
 * This component provides the main input interface for the Stealth Coder application.
 * It handles user problem descriptions, language selection, and AI code generation
 * requests. Features include minimize/maximize functionality, drag-and-drop
 * positioning, and form validation.
 */

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { generateCodeSolution } from '@/ai/flows/generate-code-solution';
import type { GenerateCodeSolutionOutput } from '@/ai/flows/generate-code-solution';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Wand2, Mic, Minus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';

/**
 * Form Validation Schema
 * Defines validation rules for the input form using Zod
 */
const formSchema = z.object({
  // Problem description must be at least 10 characters
  problemDescription: z.string().min(10, { message: 'Problem description must be at least 10 characters.' }),
  // Optional programming language selection
  language: z.string().optional(),
});

/**
 * Component Props Interface
 * Defines the props required by the CodeFeedbackForm component
 */
type CodeFeedbackFormProps = {
  // Callback to update the feedback display with AI results
  setFeedback: (feedback: GenerateCodeSolutionOutput | null) => void;
  // Callback to manage loading state during AI processing
  setIsLoading: (isLoading: boolean) => void;
  // Callback to handle and display error messages
  setError: (error: string | null) => void;
};

/**
 * Main Code Feedback Form Component
 * Handles user input, form validation, AI integration, and UI state management
 */
export function CodeFeedbackForm({ setFeedback, setIsLoading, setError }: CodeFeedbackFormProps) {
  // Toast notifications for user feedback
  const { toast } = useToast();

  /**
   * UI State Management
   */
  const [isMinimized, setIsMinimized] = useState(false);  // Minimize/maximize state
  const [position, setPosition] = useState({ x: 20, y: 20 });  // Window position for dragging
  const [isDragging, setIsDragging] = useState(false);  // Drag state tracking
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
   * Form Configuration
   * Sets up React Hook Form with Zod validation and default values
   */
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      problemDescription: '',
      language: 'javascript',  // Default to JavaScript
    },
  });

  /**
   * Speech-to-Text Functionality (Future Implementation)
   * Placeholder for Web Speech API integration
   *
   * TODO: Implement Speech-to-Text functionality using Web Speech API
   * This would allow users to dictate problem descriptions instead of typing
   *
   * Implementation steps:
   * 1. Check for browser support (webkitSpeechRecognition)
   * 2. Request microphone permissions
   * 3. Handle speech recognition events
   * 4. Update form fields with transcribed text
   * 5. Provide visual feedback during recording
   */
  const handleListen = (field: 'problemDescription' | 'code') => {
    // Placeholder implementation - shows user what will be implemented
    alert(
      'Speech-to-Text functionality needs to be implemented using the Web Speech API.'
    );
  };

  /**
   * Form Submission Handler
   * Processes the form data and initiates AI code generation
   */
  async function onSubmit(values: z.infer<typeof formSchema>) {
    // Reset UI state for new request
    setIsLoading(true);
    setFeedback(null);
    setError(null);

    try {
      // Call AI service to generate code solution
      const result = await generateCodeSolution(values);
      setFeedback(result);
    } catch (e) {
      // Handle and display errors
      const error = e instanceof Error ? e.message : 'An unknown error occurred.';
      setError(error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error,
      });
    } finally {
      // Always reset loading state
      setIsLoading(false);
    }
  }

  /**
   * Component Render
   * Conditionally renders minimized or full interface based on state
   */
  return (
    <div
      // Dynamic styling based on minimize state
      className={isMinimized ? "fixed z-50" : ""}
      style={isMinimized ? {
        left: position.x,
        top: position.y,
        cursor: isDragging ? 'grabbing' : 'grab',  // Visual feedback during drag
        width: '448px', // Fixed width to match max-w-md (28rem = 448px)
        height: 'auto'
      } : {}}
      // Mouse event handlers for drag functionality
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <Card className={`bg-card/90 border-border shadow-lg ${isMinimized ? 'w-full min-h-[80px]' : 'max-w-md'}`}>
        <CardHeader
          // Enable dragging on header when minimized
          style={{ WebkitAppRegion: 'drag' } as any}
          onMouseDown={handleMouseDown}
          className={isMinimized ? "cursor-grab active:cursor-grabbing" : ""}
        >
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl flex items-center gap-2">
              {/* Custom Stealth Coder icon */}
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary-foreground/80"><path d="M10 12.5 8 15l-4-4"/><path d="m14 12.5 2 2.5 4-4"/><path d="M14 5a1 1 0 0 0-1-1H3a2 2 0 0 0-2 2v7.5a2.5 2.5 0 0 0 2.5 2.5H10"/><path d="M21 7a1 1 0 0 0-1-1h-5a2 2 0 0 0-2 2v4a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1Z"/></svg>
              Stealth Coder
            </CardTitle>
            <CardDescription>Your discreet AI interview assistant.</CardDescription>
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
      {/* Conditional rendering of form content when not minimized */}
      {!isMinimized && (
        <CardContent className="max-h-[500px] overflow-y-auto">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Problem Description Input Field */}
            <FormField
              control={form.control}
              name="problemDescription"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center justify-between">
                    <FormLabel className="text-lg">Problem Description</FormLabel>
                    {/* Voice Input Button (Future Feature) */}
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => handleListen('problemDescription')}
                      className="h-8 w-8"
                    >
                      <Mic className="h-4 w-4" />
                      <span className="sr-only">Use microphone</span>
                    </Button>
                  </div>
                  <FormControl>
                    <Textarea
                      placeholder="e.g., Write a function to reverse a string."
                      className="min-h-[120px] font-sans"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Programming Language Selection */}
            <FormField
              control={form.control}
              name="language"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg">Programming Language</FormLabel>
                  <FormControl>
                    <select {...field} className="w-full p-2 border rounded text-black">
                      <option value="javascript">JavaScript</option>
                      <option value="python">Python</option>
                      <option value="java">Java</option>
                      <option value="cpp">C++</option>
                      <option value="csharp">C#</option>
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Submit Button with Loading State */}
            <Button type="submit" className="w-full text-lg py-6 bg-accent text-accent-foreground hover:bg-accent/90" disabled={form.formState.isSubmitting}>
              <Wand2 className="mr-2 h-5 w-5" />
              Generate Solution
            </Button>
          </form>
        </Form>
      </CardContent>
      )}
    </Card>
    </div>
  );
}
