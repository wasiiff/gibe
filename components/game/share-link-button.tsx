"use client";

import { Check, Copy } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";

type ShareLinkButtonProps = {
  href: string;
};

export function ShareLinkButton({ href }: ShareLinkButtonProps) {
  const [copied, setCopied] = useState(false);

  function copyLink() {
    navigator.clipboard.writeText(href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <Button
      variant="secondary"
      size="sm"
      leading={
        copied ? (
          <Check className="size-3.5 text-green-600" />
        ) : (
          <Copy className="size-3.5" />
        )
      }
      onClick={copyLink}
    >
      {copied ? "Copied!" : "Copy link"}
    </Button>
  );
}
