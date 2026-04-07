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
    <div className="min-h-[420px] overflow-hidden rounded-[24px] border border-white/10 bg-[#070b18]">
      <MonacoEditor
        beforeMount={(monaco) => {
          monaco.editor.defineTheme("gibe-night", {
            base: "vs-dark",
            inherit: true,
            rules: [
              { token: "comment", foreground: "5b6c99" },
              { token: "keyword", foreground: "7CFFC5" },
              { token: "string", foreground: "ffbe5c" },
              { token: "number", foreground: "69a4ff" },
            ],
            colors: {
              "editor.background": "#070b18",
              "editor.lineHighlightBackground": "#11182d",
              "editorCursor.foreground": "#4DE2FF",
              "editor.selectionBackground": "#173259",
              "editor.inactiveSelectionBackground": "#0f223d",
              "editorLineNumber.foreground": "#516181",
              "editorLineNumber.activeForeground": "#cad4f8",
            },
          });
        }}
        height="420px"
        language={language}
        theme="gibe-night"
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

