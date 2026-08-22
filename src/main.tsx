import { Component, StrictMode, ReactNode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./styles.css";

// Fixes FE-01: without this, any unexpected render error (e.g. an
// unexpected data shape from Supabase) crashed the whole SPA to a blank
// white screen with no recovery path.
class ErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean }> {
  state = { hasError: false };
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(error: unknown) {
    console.error("Unhandled error in صهوة:", error);
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
