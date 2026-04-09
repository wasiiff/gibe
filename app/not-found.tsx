import Link from "next/link";
import { ArrowLeft, Home } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Panel } from "@/components/ui/panel";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[60vh] w-full max-w-md items-center px-6 py-12">
      <Panel className="w-full p-8 text-center">
        <p className="text-xs uppercase tracking-[0.22em] text-gray-400">
          Not Found
        </p>
        <h1 className="mt-4 font-display text-3xl font-bold uppercase tracking-[0.06em] text-gray-900">
          Page not found
        </h1>
        <p className="mt-3 text-sm leading-7 text-gray-500">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-8 flex justify-center gap-3">
          <Button
            asChild
            variant="primary"
            leading={<Home className="size-4" />}
          >
            <Link href="/">Home</Link>
          </Button>
          <Button
            asChild
            variant="secondary"
            leading={<ArrowLeft className="size-4" />}
          >
            <Link href="/dashboard">Dashboard</Link>
          </Button>
        </div>
      </Panel>
    </div>
  );
}
