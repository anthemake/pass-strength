import PasswordStrengthAnalyzer from "./components/PasswordStrengthAnalyzer";

export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-100 px-4 py-10 sm:px-8 sm:py-16">
      <div className="mx-auto flex w-full max-w-5xl flex-col items-center gap-6">
        <p className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold tracking-wide text-slate-600 shadow-sm">
          Local-only analysis: your input never leaves your browser
        </p>
        <PasswordStrengthAnalyzer />
      </div>
    </main>
  );
}
