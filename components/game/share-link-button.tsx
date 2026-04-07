"use client";

import { Check, Copy } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";

export function ShareLinkButton({ href }: { href: string }) {
  const [copied, setCopied] = useState(false);

  return (
    <Button
      variant="secondary"
      leading={copied ? <Check className="size-4" /> : <Copy className="size-4" />}
      onClick={async () => {
        await navigator.clipboard.writeText(href);
        setCopied(true);
        window.setTimeout(() => setCopied(false), 1500);
      }}
    >
      {copied ? "Copied" : "Copy share link"}
    </Button>
  );
}

