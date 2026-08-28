import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en" className="dark">
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
        <script src="https://cdn.tailwindcss.com"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              tailwind.config = {
                darkMode: 'class',
                theme: {
                  extend: {
                    colors: {
                      background: 'var(--background)',
                      foreground: 'var(--foreground)',
                      primary: {
                        50: '#eef2ff', 100: '#e0e7ff', 200: '#c7d2fe', 300: '#a5b4fc',
                        400: '#818cf8', 500: '#6366f1', 600: '#4f46e5', 700: '#4338ca',
                        800: '#3730a3', 900: '#312e81', 950: '#1e1b4b',
                      },
                      accent: {
                        cyan: '#06b6d4',
                        emerald: '#10b981',
                        amber: '#f59e0b',
                        rose: '#f43f5e',
                        purple: '#a855f7',
                      },
                    },
                    fontFamily: {
                      sans: ['Inter', 'system-ui', 'sans-serif'],
                      mono: ['JetBrains Mono', 'monospace'],
                    },
                    boxShadow: {
                      glass: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
                      glow: '0 0 25px rgba(99, 102, 241, 0.35)',
                      'glow-cyan': '0 0 25px rgba(6, 182, 212, 0.35)',
                    },
                  },
                },
              };
            `,
          }}
        />
        <style
          dangerouslySetInnerHTML={{
            __html: `
              :root {
                --background: #090d16;
                --foreground: #f8fafc;
              }
              body {
                background-color: var(--background);
                color: var(--foreground);
                font-family: 'Inter', system-ui, sans-serif;
                background-image: 
                  radial-gradient(circle at 15% 15%, rgba(99, 102, 241, 0.08) 0%, transparent 40%),
                  radial-gradient(circle at 85% 25%, rgba(6, 182, 212, 0.06) 0%, transparent 40%),
                  radial-gradient(circle at 50% 85%, rgba(168, 85, 247, 0.05) 0%, transparent 50%);
                background-attachment: fixed;
                min-height: 100vh;
              }
              .glass-panel {
                background: rgba(15, 23, 42, 0.65);
                backdrop-filter: blur(16px);
                -webkit-backdrop-filter: blur(16px);
                border: 1px solid rgba(255, 255, 255, 0.08);
                box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
              }
              .glass-card {
                background: rgba(30, 41, 59, 0.5);
                backdrop-filter: blur(12px);
                -webkit-backdrop-filter: blur(12px);
                border: 1px solid rgba(255, 255, 255, 0.06);
                transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
              }
              .glass-card:hover {
                border-color: rgba(99, 102, 241, 0.35);
                box-shadow: 0 10px 30px -10px rgba(99, 102, 241, 0.2);
                transform: translateY(-2px);
              }
              .glass-input {
                background: rgba(15, 23, 42, 0.6);
                border: 1px solid rgba(255, 255, 255, 0.1);
                color: #f8fafc;
              }
              .glass-input:focus {
                border-color: #6366f1;
                box-shadow: 0 0 15px rgba(99, 102, 241, 0.3);
                outline: none;
              }
              .gradient-text {
                background: linear-gradient(135deg, #6366f1 0%, #06b6d4 50%, #a855f7 100%);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
              }
              .gradient-text-gold {
                background: linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
              }
              ::-webkit-scrollbar {
                width: 6px;
                height: 6px;
              }
              ::-webkit-scrollbar-track {
                background: rgba(15, 23, 42, 0.5);
              }
              ::-webkit-scrollbar-thumb {
                background: rgba(99, 102, 241, 0.3);
                border-radius: 9999px;
              }
              ::-webkit-scrollbar-thumb:hover {
                background: rgba(99, 102, 241, 0.6);
              }
            `,
          }}
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
