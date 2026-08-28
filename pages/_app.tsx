import type { AppProps } from "next/app";
import { AuthProvider } from "@/context/AuthContext";
import { Navbar } from "@/components/shared/Navbar";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
          <Component {...pageProps} />
        </main>
        <footer className="glass-panel border-t border-white/10 py-6 text-center text-xs text-slate-500">
          <p>Smart India Hackathon 2026 • Problem Statement 44 • Academia–Industry Collaboration Engine</p>
        </footer>
      </div>
    </AuthProvider>
  );
}
