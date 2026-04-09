"use client";

import { AlertTriangle, RefreshCw } from "lucide-react";
import { Component, type ErrorInfo, type ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { Panel } from "@/components/ui/panel";

type Props = {
  children: ReactNode;
  fallback?: ReactNode;
};

type State = {
  hasError: boolean;
  error: Error | null;
};

export class StudioErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Studio error boundary caught:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <Panel className="p-8">
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="rounded-full border border-red-200 bg-red-50 p-4">
              <AlertTriangle className="size-8 text-red-500" />
            </div>
            <div className="space-y-2">
              <h3 className="font-display text-xl uppercase tracking-[0.06em] text-gray-900">
                Something went wrong
              </h3>
              <p className="max-w-md text-sm leading-6 text-gray-500">
                {this.state.error?.message ?? "An unexpected error occurred."}
              </p>
            </div>
            <Button
              variant="secondary"
              leading={<RefreshCw className="size-4" />}
              onClick={() => this.setState({ hasError: false, error: null })}
            >
              Try again
            </Button>
          </div>
        </Panel>
      );
    }

    return this.props.children;
  }
}
