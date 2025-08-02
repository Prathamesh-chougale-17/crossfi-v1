"use client";

import { Loader2, Bot, Database } from "lucide-react";

interface LoadingPreviewProps {
  isGenerating?: boolean;
  isSaving?: boolean;
}

export function LoadingPreview({ isGenerating, isSaving }: LoadingPreviewProps) {
  const getLoadingContent = () => {
    if (isGenerating) {
      return {
        icon: <Bot className="h-12 w-12 text-primary animate-pulse" />,
        title: "AI Generating Game...",
        description: "Creating your game code with AI",
        details: [
          "Analyzing your prompt",
          "Generating HTML structure", 
          "Creating CSS styles",
          "Writing JavaScript logic"
        ]
      };
    }
    
    if (isSaving) {
      return {
        icon: <Database className="h-12 w-12 text-primary animate-pulse" />,
        title: "Saving to Database...",
        description: "Storing your game safely",
        details: [
          "Creating checkpoint",
          "Saving game code",
          "Updating metadata",
          "Almost done!"
        ]
      };
    }

    return {
      icon: <Loader2 className="h-12 w-12 animate-spin text-primary" />,
      title: "Loading...",
      description: "Please wait",
      details: []
    };
  };

  const { icon, title, description, details } = getLoadingContent();

  return (
    <div className="h-full w-full bg-background border-l flex items-center justify-center">
      <div className="text-center max-w-sm px-6">
        <div className="flex justify-center mb-6">
          {icon}
        </div>
        
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        <p className="text-muted-foreground mb-6">{description}</p>
        
        {details.length > 0 && (
          <div className="space-y-2">
            {details.map((detail, index) => (
              <div 
                key={index}
                className="flex items-center justify-center gap-2 text-sm text-muted-foreground"
                style={{
                  animation: `fadeInUp 0.5s ease-out ${index * 0.2}s both`
                }}
              >
                <div className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse" />
                {detail}
              </div>
            ))}
          </div>
        )}

        {/* Progress bar */}
        <div className="mt-8 w-full">
          <div className="h-1 bg-muted rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary rounded-full transition-all duration-1000"
              style={{
                width: isGenerating ? '70%' : isSaving ? '90%' : '50%',
                animation: 'loading-shimmer 2s ease-in-out infinite'
              }}
            />
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes loading-shimmer {
          0% { opacity: 0.5; }
          50% { opacity: 1; }
          100% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
}