
'use client';

import { useFormStatus } from 'react-dom';
import { useActionState, useEffect } from 'react';
import { handleGeneratePost, type GeneratePostFormState } from '@/actions/blogActions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal, Sparkles, Loader2, KeyRound, Copy } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Generate New Post (Admin)',
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
      'max-video-preview': -1,
      'max-image-preview': 'none',
      'max-snippet': -1,
    },
  },
};


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
  const initialState: GeneratePostFormState = { message: '', success: false, postStatus: undefined };
  const [state, formAction] = useActionState(handleGeneratePost, initialState);
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    if (state.message) {
      if (state.success && state.postStatus === 'created') {
        toast({
          title: "Success!",
          description: state.message,
        });
        if (state.slug) {
          router.push(`/blog/${state.slug}`);
        } else {
          router.push('/blog');
        }
      } else if (state.success && state.postStatus === 'generated_not_saved') {
        toast({
          title: "Content Generated!",
          description: state.message + " See below for content and instructions.",
          duration: 15000, // Keep it longer
        });
        // Do not redirect, content will be shown on the page
      } else if (!state.success) { // Error state
        toast({
          title: "Error",
          description: state.message,
          variant: "destructive",
        });
         // Do not redirect on error, generatedContent might be shown for manual recovery
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
          
          {state.generatedContent && (
            <div className="mt-6 space-y-3 p-4 border rounded-md bg-card">
              <Label htmlFor="generatedContentOutput" className="text-xl font-semibold">
                {state.postStatus === 'generated_not_saved' 
                  ? `Generated Content for "${state.slug}.mdx"`
                  : `Post Content for "${state.slug || 'post'}.mdx" (Save Manually)` }
              </Label>
              <Alert variant={state.postStatus === 'error' && state.postStatus !== 'generated_not_saved' ? 'destructive' : 'default'}>
                <Terminal className="h-4 w-4" />
                <AlertTitle>
                    {state.postStatus === 'generated_not_saved' ? 'Action Required' : 'Content for Manual Saving'}
                </AlertTitle>
                <AlertDescription>
                  {state.postStatus === 'generated_not_saved'
                    ? `The application is running in an environment where it cannot save files directly (e.g., on Vercel). Please copy the content below and save it as '${state.slug}.mdx' in your project's 'content/posts' directory. Then, commit and deploy your changes.`
                    : `An error occurred: "${state.message}". You can try to manually save the content below as '${state.slug || 'post'}.mdx' in your project's 'content/posts' directory.`}
                </AlertDescription>
              </Alert>
              <Textarea
                id="generatedContentOutput"
                readOnly
                value={state.generatedContent}
                className="h-96 min-h-[240px] font-mono text-xs bg-muted/50 p-3"
                aria-label="Generated post content"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  navigator.clipboard.writeText(state.generatedContent || '');
                  toast({ description: "Content copied to clipboard!" });
                }}
                className="mt-2"
              >
                <Copy className="mr-2 h-4 w-4" />
                Copy Content
              </Button>
            </div>
          )}

          {state.message && !state.success && !state.generatedContent && (
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
            <p>AI generation may take a few moments. Please be patient. Ensure your admin token is set correctly. In deployed environments, you may need to manually save the generated post file.</p>
        </CardFooter>
      </Card>
    </div>
  );
}
