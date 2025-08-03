"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Bot, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { generateGame } from "@/lib/actions";
import type { GenerateGameCodeOutput } from "@/ai/flows/generate-game-code";
import { toast } from "sonner";

const formSchema = z.object({
  prompt: z.string().min(10, {
    message: "Prompt must be at least 10 characters.",
  }),
});

interface GameGeneratorDialogProps {
  onGenerate: (output: GenerateGameCodeOutput) => void;
  children: React.ReactNode;
  html: string;
  css: string;
  js: string;
  isGameGenerated: boolean;
  checkpointCount?: number;
  onGeneratingChange?: (isGenerating: boolean) => void;
}

export function GameGeneratorDialog({ onGenerate, children, html, css, js, isGameGenerated, checkpointCount, onGeneratingChange }: GameGeneratorDialogProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [isGenerating, setIsGenerating] = React.useState(false);
  
  // Helper to determine if we're refining existing code or generating new code
  const hasExistingCode = checkpointCount && checkpointCount > 0;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsGenerating(true);
    onGeneratingChange?.(true);
    try {
      const result = await generateGame({ 
        prompt: values.prompt,
        previousHtml: hasExistingCode ? html : undefined,
        previousCss: hasExistingCode ? css : undefined,
        previousJs: hasExistingCode ? js : undefined,
      });
      onGenerate(result);
      setIsOpen(false);
      form.reset();
    } catch (error) {
      console.error(error);
      toast.error(
        "An error occurred while generating the game. Please try again later.",
        {
          description: "Please try again later.",
        }
      );
    } finally {
      setIsGenerating(false);
      onGeneratingChange?.(false);
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <DialogHeader>
              <DialogTitle>{hasExistingCode ? 'Refine Your Game' : 'Game Generator'}</DialogTitle>
              <DialogDescription>
                {hasExistingCode
                  ? 'Describe the changes or new features you want to add.' 
                  : 'Describe the game you want to create, and let AI build the code for you.'}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <FormField
                control={form.control}
                name="prompt"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{hasExistingCode ? 'Feedback or Refinements' : 'Game Idea'}</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder={hasExistingCode
                          ? "e.g., Make the paddle smaller and the ball faster."
                          : "e.g., A simple breakout-style game with a paddle and a ball."}
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter>
              <Button type="submit" disabled={isGenerating}>
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Bot className="mr-2 h-4 w-4" />
                    {hasExistingCode ? 'Refine Code' : 'Generate Code'}
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
