import { Component, ReactNode, ErrorInfo } from "react";
import { AlertTriangle, RefreshCcw } from "lucide-react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("[ErrorBoundary]", error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;
      return (
        <div className="flex flex-col items-center justify-center min-h-[400px] p-8 text-center">
          <div className="p-4 rounded-full bg-destructive/10 border border-destructive/20 mb-6">
            <AlertTriangle className="w-8 h-8 text-destructive" />
          </div>
          <h2 className="text-xl font-display font-bold text-white mb-2">Algo deu errado</h2>
          <p className="text-muted-foreground text-sm mb-1 max-w-md">
            Ocorreu um erro inesperado neste módulo. Os outros módulos não foram afetados.
          </p>
          {this.state.error && (
            <p className="text-xs text-destructive/70 font-mono mb-6 bg-destructive/5 px-3 py-2 rounded border border-destructive/10 max-w-md truncate">
              {this.state.error.message}
            </p>
          )}
          <button
            onClick={() => this.setState({ hasError: false, error: null })}
            className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors"
          >
            <RefreshCcw className="w-4 h-4" />
            Tentar novamente
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
