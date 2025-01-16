"use client"; // Error boundaries must be Client Components

interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

// TODO : better error handling
export default function GlobalError({ error, reset, ...rest }: GlobalErrorProps) {
  console.log("GLOBAL ERROR", { error, reset, rest });
  return (
    // global-error must include html and body tags
    <html>
      <body>
        <h2>Something went wrong!</h2>
        <button onClick={() => reset()}>Try again</button>
      </body>
    </html>
  );
}
