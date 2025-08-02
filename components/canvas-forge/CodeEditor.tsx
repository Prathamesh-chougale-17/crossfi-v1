"use client";

import { Textarea } from "@/components/ui/textarea";

interface CodeEditorProps {
  language: string;
  value: string;
  onChange: (value: string) => void;
  readOnly?: boolean;
}

const languageColors: Record<string, string> = {
  HTML: "text-orange-400",
  CSS: "text-blue-400",
  JavaScript: "text-yellow-400",
};

export function CodeEditor({ language, value, onChange, readOnly = false }: CodeEditorProps) {
  return (
    <div className="flex h-full flex-col bg-muted/30">
      <div className="flex h-10 flex-shrink-0 items-center px-4">
        <h3 className={`font-medium ${languageColors[language] || "text-foreground"}`}>
          {language}
        </h3>
      </div>
      <div className="h-full flex-grow">
        <Textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          readOnly={readOnly}
          className={`h-full w-full resize-none rounded-none border-0 border-t bg-transparent font-code text-sm !ring-0 !ring-offset-0 ${readOnly ? 'cursor-default' : ''}`}
          placeholder={readOnly ? `${language} code (read-only)` : `Write your ${language} code here...`}
          aria-label={`${language} code editor${readOnly ? ' (read-only)' : ''}`}
        />
      </div>
    </div>
  );
}
