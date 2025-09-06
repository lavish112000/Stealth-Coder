'use client';

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

const formSchema = z.object({
  problemDescription: z.string().min(10, { message: 'Problem description must be at least 10 characters.' }),
  language: z.string().optional(),
});

type CodeFeedbackFormProps = {
  setFeedback: (feedback: GenerateCodeSolutionOutput | null) => void;
  setIsLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
};

export function CodeFeedbackForm({ setFeedback, setIsLoading, setError }: CodeFeedbackFormProps) {
  const { toast } = useToast();
  const [isMinimized, setIsMinimized] = useState(false);
  const [position, setPosition] = useState({ x: 20, y: 20 });
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
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      problemDescription: '',
      language: 'javascript',
    },
  });

  // TODO: Implement Speech-to-Text functionality
  // This requires using the browser's Web Speech API.
  //
  // 1. Create a state to manage the recording status for each field.
  //    const [isRecording, setIsRecording] = useState({ problem: false, code: false });
  //
  // 2. Implement a function to handle starting/stopping recording.
  //    This function will check for browser support and manage permissions.
  //    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
  //    recognition.onresult = (event) => {
  //      const transcript = event.results[0][0].transcript;
  //      // Use form.setValue(fieldName, transcript) to update the input.
  //    };
  //
  // 3. Attach this function to the onClick event of the Mic buttons below.
  const handleListen = (field: 'problemDescription' | 'code') => {
    // Placeholder function
    alert(
      'Speech-to-Text functionality needs to be implemented using the Web Speech API.'
    );
  };
  
  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setFeedback(null);
    setError(null);
    try {
      const result = await generateCodeSolution(values);
      setFeedback(result);
    } catch (e) {
      const error = e instanceof Error ? e.message : 'An unknown error occurred.';
      setError(error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error,
      });
    } finally {
      setIsLoading(false);
    }
  }

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
      <Card className={`bg-card/90 border-border shadow-lg ${isMinimized ? 'w-full min-h-[80px]' : 'max-w-md'}`}>
        <CardHeader
          style={{ WebkitAppRegion: 'drag' } as any}
          onMouseDown={handleMouseDown}
          className={isMinimized ? "cursor-grab active:cursor-grabbing" : ""}
        >
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary-foreground/80"><path d="M10 12.5 8 15l-4-4"/><path d="m14 12.5 2 2.5 4-4"/><path d="M14 5a1 1 0 0 0-1-1H3a2 2 0 0 0-2 2v7.5a2.5 2.5 0 0 0 2.5 2.5H10"/><path d="M21 7a1 1 0 0 0-1-1h-5a2 2 0 0 0-2 2v4a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1Z"/></svg>
              Stealth Coder
            </CardTitle>
            <CardDescription>Your discreet AI interview assistant.</CardDescription>
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
        <CardContent className="max-h-[500px] overflow-y-auto">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="problemDescription"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center justify-between">
                    <FormLabel className="text-lg">Problem Description</FormLabel>
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
