'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { getCodeFeedback } from '@/ai/flows/get-code-feedback';
import type { GetCodeFeedbackOutput } from '@/ai/flows/get-code-feedback';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Wand2, Mic } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const formSchema = z.object({
  problemDescription: z.string().min(10, { message: 'Problem description must be at least 10 characters.' }),
  code: z.string().min(10, { message: 'Code must be at least 10 characters.' }),
});

type CodeFeedbackFormProps = {
  setFeedback: (feedback: GetCodeFeedbackOutput | null) => void;
  setIsLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
};

export function CodeFeedbackForm({ setFeedback, setIsLoading, setError }: CodeFeedbackFormProps) {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      problemDescription: '',
      code: '',
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
      const result = await getCodeFeedback(values);
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
    <Card className="bg-card/80 border-border shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary-foreground/80"><path d="M10 12.5 8 15l-4-4"/><path d="m14 12.5 2 2.5 4-4"/><path d="M14 5a1 1 0 0 0-1-1H3a2 2 0 0 0-2 2v7.5a2.5 2.5 0 0 0 2.5 2.5H10"/><path d="M21 7a1 1 0 0 0-1-1h-5a2 2 0 0 0-2 2v4a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1Z"/></svg>
          Stealth Coder
        </CardTitle>
        <CardDescription>Your discreet AI interview assistant.</CardDescription>
      </CardHeader>
      <CardContent>
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
              name="code"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center justify-between">
                    <FormLabel className="text-lg">Your Code</FormLabel>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => handleListen('code')}
                      className="h-8 w-8"
                    >
                      <Mic className="h-4 w-4" />
                      <span className="sr-only">Use microphone</span>
                    </Button>
                  </div>
                  <FormControl>
                    <Textarea
                      placeholder="function reverseString(str) { ... }"
                      className="min-h-[250px] font-mono text-sm bg-muted/50"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full text-lg py-6 bg-accent text-accent-foreground hover:bg-accent/90" disabled={form.formState.isSubmitting}>
              <Wand2 className="mr-2 h-5 w-5" />
              Get AI Feedback
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
