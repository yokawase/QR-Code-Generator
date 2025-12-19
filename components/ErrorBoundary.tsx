import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[50vh] flex flex-col items-center justify-center p-6 text-center animate-fade-in">
          <div className="bg-red-50 p-6 rounded-2xl border border-red-100 max-w-sm w-full shadow-sm">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-red-100 rounded-full">
                <AlertTriangle className="w-8 h-8 text-red-600" />
              </div>
            </div>
            <h2 className="text-lg font-bold text-slate-800 mb-2">エラーが発生しました</h2>
            <p className="text-sm text-slate-600 mb-6">
              予期せぬエラーによりアプリケーションを正しく表示できませんでした。
            </p>
            <button
              onClick={this.handleReload}
              className="w-full bg-slate-800 hover:bg-slate-900 text-white font-medium py-2.5 px-4 rounded-lg transition flex items-center justify-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              再読み込み
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}