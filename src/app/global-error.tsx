"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Global Error Caught:", error);
  }, [error]);

  return (
    <html>
      <body>
        <div style={{ padding: "2rem", fontFamily: "monospace", color: "red", backgroundColor: "black", minHeight: "100vh" }}>
          <h2>Synqverse Global Error Boundary</h2>
          <p><strong>Error Message:</strong> {error.message || "Unknown Error"}</p>
          <p><strong>Digest:</strong> {error.digest}</p>
          <pre style={{ whiteSpace: "pre-wrap", marginTop: "1rem", color: "lightcoral" }}>
            {error.stack}
          </pre>
          <button 
            onClick={() => reset()} 
            style={{ marginTop: "2rem", padding: "0.5rem 1rem", background: "white", color: "black", border: "none", cursor: "pointer" }}
          >
            Try Again
          </button>
        </div>
      </body>
    </html>
  );
}
