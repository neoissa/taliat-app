import React from 'react';
import { AlertTriangle, RotateCcw, Home } from 'lucide-react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Uncaught error caught by ErrorBoundary:", error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    if (this.props.onReset) {
      this.props.onReset();
    } else {
      window.location.reload();
    }
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[350px] bg-slate-900 border border-red-500/40 rounded-3xl p-6 sm:p-8 flex flex-col items-center justify-center text-center space-y-4 shadow-2xl m-4">
          <div className="w-14 h-14 rounded-2xl bg-red-500/20 border border-red-500/40 flex items-center justify-center text-red-400">
            <AlertTriangle size={32} />
          </div>
          <div className="space-y-1 max-w-md">
            <h3 className="text-lg font-black text-white">Something went wrong in this section</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              An unexpected display issue occurred. You can reload this view or return to the main dashboard.
            </p>
            {this.state.error && (
              <pre className="text-[10px] text-red-300 bg-black/40 p-2.5 rounded-xl text-left overflow-x-auto font-mono mt-2 border border-red-900/40">
                {this.state.error.message || String(this.state.error)}
              </pre>
            )}
          </div>
          <div className="flex gap-2.5 pt-2">
            <button
              type="button"
              onClick={this.handleReset}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition cursor-pointer flex items-center gap-1.5 shadow-md"
            >
              <RotateCcw size={14} />
              <span>Retry / Reload</span>
            </button>
            <button
              type="button"
              onClick={() => {
                this.setState({ hasError: false, error: null });
                window.location.href = '/';
              }}
              className="bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-bold text-xs px-4 py-2.5 rounded-xl border border-slate-700 transition cursor-pointer flex items-center gap-1.5"
            >
              <Home size={14} />
              <span>Go to Home</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
