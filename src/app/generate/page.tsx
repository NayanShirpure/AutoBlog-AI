
'use client';

import React, { useEffect, useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { handleGeneratePost, type GeneratePostFormState } from '@/actions/blogActions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal, Sparkles, Loader2, KeyRound } from 'lucide-react';

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
  const [state, formAction] = useActionState(handleGeneratePost, initialState);
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
            Enter a title for your blog post and the admin token. Our AI will craft the content for you.
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
              {state.issues?.filter(issue => !issue.startsWith("Admin token")).map((issue) => (
                  <p key={issue} className="text-sm text-destructive mt-1">{issue}</p>
              ))}
            </div>

            <div className="space-y-2">
              <Label htmlFor="adminToken" className="text-lg font-medium flex items-center">
                <KeyRound className="mr-2 h-5 w-5 text-muted-foreground" />
                Admin Access Token
              </Label>
              <Input
                id="adminToken"
                name="adminToken"
                type="password"
                placeholder="Enter your secret token"
                required
                className="text-base"
                defaultValue={state.fields?.adminToken}
              />
              {state.issues?.filter(issue => issue.startsWith("Admin token")).map((issue) => (
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
            <p>AI generation may take a few moments. Please be patient. Ensure your admin token is set correctly.</p>
        </CardFooter>
      </Card>
