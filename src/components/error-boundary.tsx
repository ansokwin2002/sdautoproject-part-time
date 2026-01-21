"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(_: Error): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
    // Check if the error is a ChunkLoadError
    if (error.name === 'ChunkLoadError') {
      console.log("ChunkLoadError detected, reloading page...");
      window.location.reload(true); // Force a hard reload
    }
  }

  public render() {
    if (this.state.hasError) {
      return <h1>Something went wrong. We are reloading the page...</h1>;
    }

    return this.props.children;
  }
}

export default ErrorBoundary;