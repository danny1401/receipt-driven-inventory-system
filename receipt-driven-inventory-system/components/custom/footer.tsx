export const Footer = () => {
  return (
    <footer>
      <div className="mx-auto w-full max-w-6xl px-4 pb-8 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-3 border-t border-border/60 pt-6 text-sm text-muted-foreground sm:flex-row">
          <p>
            © {new Date().getFullYear()} Receipt-Driven Inventory System. All
            rights reserved.
          </p>
          <p>Built with Next.js, Convex &amp; Gemini AI.</p>
        </div>
      </div>
    </footer>
  );
};
