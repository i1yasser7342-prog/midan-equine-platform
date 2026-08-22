import { Component, StrictMode, ReactNode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./styles.css";

// OPS-01: no production error-monitoring vendor is wired in — that needs an
// account (Sentry or similar) this codebase can't create on its own. This
// function is the single seam to plug one into: swap the console.error
// below for e.g. Sentry.captureException(error, { extra: context }) once a
// DSN exists, and every caller here starts reporting immediately.
function reportError(error: unknown, context: Record<string, unknown> = {}) {
  console.error("[صهوة]", error, context);
}

window.addEventListener("error", (event) => {
  reportError(event.error ?? event.message, { source: "window.onerror" });
});
window.addEventListener("unhandledrejection", (event) => {
  reportError(event.reason, { source: "unhandledrejection" });
});

// Fixes FE-01: without this, any unexpected render error (e.g. an
// unexpected data shape from Supabase) crashed the whole SPA to a blank
// white screen with no recovery path.
class ErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean }> {
  state = { hasError: false };
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(error: unknown, info: { componentStack: string }) {
    reportError(error, { source: "react-error-boundary", componentStack: info.componentStack });
  }
  render() {
    if (this.state.hasError) {
      return (
        <main className="app-crash">
          <h1>حدث خطأ غير متوقع</h1>
          <p>حاول إعادة تحميل الصفحة. إن استمرت المشكلة، تواصل معنا.</p>
          <button className="primary-button" onClick={() => window.location.reload()}>
            إعادة تحميل الصفحة
          </button>
        </main>
      );
    }
    return this.props.children;
  }
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
);
