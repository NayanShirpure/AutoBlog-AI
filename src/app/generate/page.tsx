'use client';

import { useFormStatus } from 'react-dom'; // Corrected: Removed useActionState from react-dom import
import { handleGeneratePost, type GeneratePostFormState } from '@/actions/blogActions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
// import { Textarea } from '@/components/ui/textarea'; // For potential future use, not needed for title
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal, Sparkles, Loader2 } from 'lucide-react';
import React from 'react'; // Retained for React.useActionState

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full sm:w-auto">
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Generating...
        </>
      ) : (
        <>
          <Sparkles className="mr-2 h-4 w-4" />
          Generate Post
        </>
      )}
    </Button>
  );
}

export default function GeneratePostPage() {
  const initialState: GeneratePostFormState = { message: '', success: false };
  const [state, formAction] = React.useActionState(handleGeneratePost, initialState); // Correctly uses useActionState from 'react'
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    if (state.message) {
      if (state.success) {
        toast({
          title: "Success!",
          description: state.message,
        });
        if (state.slug) {
          router.push(`/blog/${state.slug}`);
        } else {
          router.push('/blog');
        }
      } else {
        toast({
          title: "Error",
          description: state.message,
          variant: "destructive",
        });
      }
    }
  }, [state, toast, router]);

  return (
    <div className="max-w-2xl mx-auto py-8">
      <Card className="shadow-xl">
        <CardHeader>
          <CardTitle className="text-3xl font-bold tracking-tight text-center">Generate a New Blog Post</CardTitle>
          <CardDescription className="text-center">
            Enter a title for your blog post, and our AI will craft the content for you.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={formAction} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-lg font-medium">Post Title</Label>
              <Input
                id="title"
                name="title"
                placeholder="e.g., The Future of Renewable Energy"
                required
                minLength={5}
                maxLength={150}
                className="text-base"
                defaultValue={state.fields?.title}
              />
              {state.issues?.map((issue) => (
                  <p key={issue} className="text-sm text-destructive mt-1">{issue}</p>
              ))}
            </div>
            
            <div className="flex flex-col sm:flex-row justify-end items-center gap-4">
                 <SubmitButton />
            </div>
          </form>
          
          {state.message && !state.success && (
             <Alert variant="destructive" className="mt-6">
                <Terminal className="h-4 w-4" />
                <AlertTitle>Generation Failed</AlertTitle>
                <AlertDescription>
                    {state.message}
                    {state.issues && (
                        <ul className="list-disc list-inside mt-2">
                            {state.issues.map((issue, i) => <li key={i}>{issue}</li>)}
                        </ul>
                    )}
                </AlertDescription>
            </Alert>
          )}

        </CardContent>
         <CardFooter className="text-xs text-muted-foreground">
            <p>AI generation may take a few moments. Please be patient.</p>
        </CardFooter>
      </Card>
    </div>
  );
}
