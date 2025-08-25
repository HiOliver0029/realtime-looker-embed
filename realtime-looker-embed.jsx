{
  "name": "realtime-looker-embed",
  "type": "code/react",
  "content": "// package.json
{
  "name": "realtime-looker-embed",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start"
  },
  "dependencies": {
    "framer-motion": "^11.0.0",
    "lucide-react": "^0.452.0",
    "next": "14.0.0",
    "react": "18.2.0",
    "react-dom": "18.2.0",
    "tailwindcss": "^3.4.0",
    "@/components": "*"
  }
}

// tailwind.config.js
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};

// postcss.config.js
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};

// app/page.tsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { RefreshCcw, Link as LinkIcon, Timer, MonitorSmartphone } from "lucide-react";

const LOOKER_STUDIO_EMBED_URL =
  "https://lookerstudio.google.com/reporting/4f544129-1f6f-4a88-97ea-b7ee4aed6f54";

export default function Page() {
  const [url, setUrl] = useState(LOOKER_STUDIO_EMBED_URL);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [intervalSec, setIntervalSec] = useState(60);
  const [lastRefreshAt, setLastRefreshAt] = useState<number | null>(null);

  const bustSrc = useMemo(() => {
    const u = new URL(url);
    u.searchParams.set("cb", Date.now().toString());
    return u.toString();
  }, [url, lastRefreshAt]);

  const iframeRef = useRef<HTMLIFrameElement | null>(null);

  const doRefresh = () => setLastRefreshAt(Date.now());

  useEffect(() => {
    if (!autoRefresh) return;
    const t = setInterval(() => doRefresh(), intervalSec * 1000);
    return () => clearInterval(t);
  }, [autoRefresh, intervalSec]);

  useEffect(() => {
    doRefresh();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 p-6">
      <div className="max-w-5xl mx-auto">
        <header className="flex items-center gap-3 mb-6">
          <MonitorSmartphone className="w-6 h-6" />
          <h1 className="text-2xl font-bold">Looker Studio 即時報表</h1>
        </header>

        <div className="flex gap-2 mb-4">
          <input
            className="border rounded px-2 py-1 flex-1"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
          <button
            onClick={doRefresh}
            className="px-3 py-1 border rounded bg-slate-100 hover:bg-slate-200"
          >
            <RefreshCcw className="w-4 h-4 inline mr-1" /> 手動刷新
          </button>
        </div>

        <div className="rounded-xl overflow-hidden border bg-white shadow">
          <iframe
            key={bustSrc}
            ref={iframeRef}
            src={bustSrc}
            className="w-full h-[70vh]"
            allowFullScreen
          />
        </div>

        {lastRefreshAt && (
          <p className="text-xs text-slate-500 mt-2">上次刷新：{new Date(lastRefreshAt).toLocaleString()}</p>
        )}
      </div>
    </div>
  );
}

// styles/globals.css
@tailwind base;
@tailwind components;
@tailwind utilities;
