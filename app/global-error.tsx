"use client";

/** Last-resort boundary for errors in the root layout. Self-contained: no app CSS or providers. */
export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, background: "#07131f", color: "#f1fafa", fontFamily: "system-ui, sans-serif", display: "grid", minHeight: "100vh", placeItems: "center", textAlign: "center", padding: "1rem" }}>
        <main>
          <h1 style={{ fontSize: "1.75rem" }}>We could not load this page</h1>
          <p style={{ color: "#a9bbc9" }}>This is on our side. Please try again.</p>
          <button type="button" onClick={reset} style={{ marginTop: "1rem", padding: "0.75rem 1.5rem", borderRadius: 12, border: 0, background: "#fe5504", color: "#07131f", fontWeight: 700, fontSize: "1rem", cursor: "pointer" }}>
            Try again
          </button>
        </main>
      </body>
    </html>
  );
}
