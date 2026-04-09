"use client";

import dynamic from "next/dynamic";

const MonacoEditor = dynamic(() => import("@monaco-editor/react"), {
  ssr: false,
});

type CodeEditorProps = {
  language: "html" | "css" | "javascript";
  value: string;
  onChange: (value: string) => void;
};

export function CodeEditor({ language, value, onChange }: CodeEditorProps) {
  return (
    <div className="min-h-[420px] overflow-hidden rounded-xl border border-gray-200 bg-white">
      <MonacoEditor
        beforeMount={(monaco) => {
          monaco.editor.defineTheme("gibe-light", {
            base: "vs",
            inherit: true,
            rules: [
              { token: "comment", foreground: "6B7280" },
              { token: "keyword", foreground: "2563EB" },
              { token: "string", foreground: "D97706" },
              { token: "number", foreground: "059669" },
            ],
            colors: {
              "editor.background": "#F9FAFB",
              "editor.lineHighlightBackground": "#F3F4F6",
              "editorCursor.foreground": "#2563EB",
              "editor.selectionBackground": "#DBEAFE",
              "editor.inactiveSelectionBackground": "#E5E7EB",
              "editorLineNumber.foreground": "#9CA3AF",
              "editorLineNumber.activeForeground": "#374151",
            },
          });
        }}
        height="420px"
        language={language}
        theme="gibe-light"
        value={value}
        onChange={(nextValue) => onChange(nextValue ?? "")}
        options={{
          automaticLayout: true,
          minimap: { enabled: false },
          padding: { top: 16, bottom: 16 },
          roundedSelection: true,
          fontSize: 14,
          fontFamily: "var(--font-mono)",
          scrollBeyondLastLine: false,
          smoothScrolling: true,
          lineNumbersMinChars: 3,
          wordWrap: "on",
        }}
      />
    </div>
  );
}
