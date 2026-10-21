import React, { useState } from 'react';
import axios from 'axios'

export default function MockItApp() {
  const [inputJson, setInputJson] = useState('{\n  "status": "success",\n  "message": "Hello from Mock-It!",\n  "data": [\n    {"id": 1, "name": "Item One", "active": true},\n    {"id": 2, "name": "Item Two", "active": false}\n  ]\n}');
  const [error, setError] = useState(null);
  const [generatedUrl, setGeneratedUrl] = useState('');
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);

  const serverUrl = "http://localhost:8000"

  const handleFormat = () => {
    try {
      const parsed = JSON.parse(inputJson);
      setInputJson(JSON.stringify(parsed, null, 2));
      setError(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleGenerate = async () => {
    try {
      const parsed = JSON.parse(inputJson);
      setError(null);
      setLoading(true);
      console.log(inputJson)

      // Simulating backend call (Replace with actual fetch/axios call)
      // setTimeout(() => {
      //   const mockId = Math.random().toString(36).substring(2, 9);
      //   setGeneratedUrl(`http://localhost:5000/api/mock/${mockId}`);
      //   setLoading(false);
      // }, 500);

      const response = await axios.post(`${serverUrl}/api/generate`, parsed, {withCredentials: true, headers:{"Content-Type":"application/json"}})
      console.log(response.data)
      const mockId = response.data.endpointId
      setGeneratedUrl(`http://localhost:8000/api/mock/${mockId}`)
      setLoading(false)

    } catch (err) {
      setError("Invalid JSON format. Check commas and quotes.");
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!generatedUrl) return;
    navigator.clipboard.writeText(generatedUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#0b0f17] text-zinc-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Top Navigation */}
      <header className="border-b border-zinc-800/80 bg-[#0d121d]/60 backdrop-blur px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center font-mono font-bold text-lg shadow-lg shadow-indigo-500/20">
            &#123;&#125;
          </div>
          <div>
            <h1 className="text-base font-bold tracking-tight flex items-center gap-2">
              MOCK-IT <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-zinc-800 text-zinc-400 border border-zinc-700">API Sandbox</span>
            </h1>
          </div>
        </div>
        <div className="text-xs text-zinc-400 font-mono flex items-center gap-4">
          <span className="inline-flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            Server Ready
          </span>
        </div>
      </header>

      {/* Main Studio Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Editor (7 Cols) */}
        <section className="lg:col-span-7 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Payload Builder</span>
            <div className="flex items-center gap-2">
              <button 
                onClick={handleFormat}
                className="text-xs font-mono px-3 py-1.5 rounded-md bg-zinc-900 border border-zinc-800 hover:border-zinc-700 hover:bg-zinc-800 transition text-zinc-300"
              >
                Format JSON
              </button>
              <button 
                onClick={() => {setInputJson('{\n  \n}');setGeneratedUrl("")}}
                className="text-xs font-mono px-3 py-1.5 rounded-md bg-zinc-900 border border-zinc-800 hover:border-zinc-700 hover:bg-zinc-800 transition text-zinc-400 hover:text-zinc-200"
              >
                Reset
              </button>
            </div>
          </div>

          <div className="relative flex-1 flex flex-col rounded-xl border border-zinc-800 bg-[#070a0f] overflow-hidden focus-within:border-indigo-500 transition shadow-inner">
            <textarea
              value={inputJson}
              onChange={(e) => {
                setInputJson(e.target.value);
                if (error) setError(null);
              }}
              spellCheck="false"
              className="flex-1 w-full bg-transparent p-4 font-mono text-sm leading-relaxed text-indigo-100 placeholder-zinc-700 resize-none outline-none"
              placeholder="Paste raw JSON here..."
              rows={16}
            />
            {error && (
              <div className="p-3 bg-rose-950/70 border-t border-rose-900/60 text-rose-300 text-xs font-mono flex items-center gap-2">
                <span className="text-rose-400">⚠</span> {error}
              </div>
            )}
          </div>

          <button
            onClick={handleGenerate}
            disabled={loading}
            className="w-full py-3.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 active:scale-[0.99] font-medium text-sm text-white shadow-lg shadow-indigo-600/25 transition flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
          >
            {loading ? 'Publishing Endpoint...' : '⚡ Generate Mock API Endpoint'}
          </button>
        </section>

        {/* Right Column: Endpoint & Inspector (5 Cols) */}
        <section className="lg:col-span-5 flex flex-col gap-4">
          <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Endpoint Status</span>

          <div className="rounded-xl border border-zinc-800 bg-[#0d121d]/70 p-5 flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3">
              <span className="text-xs font-mono text-zinc-400">HTTP Method</span>
              <span className="px-2 py-0.5 rounded text-xs font-mono font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                GET 200 OK
              </span>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs text-zinc-400 font-medium">Live Endpoint URL</label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={generatedUrl || 'Endpoint not generated yet'}
                  className="w-full bg-[#070a0f] border border-zinc-800 rounded-lg px-3 py-2 text-xs font-mono text-zinc-300 select-all outline-none"
                />
                <button
                  onClick={handleCopy}
                  disabled={!generatedUrl}
                  className={`px-3 py-2 rounded-lg text-xs font-medium font-mono transition border ${
                    copied 
                      ? 'bg-emerald-600/20 border-emerald-500 text-emerald-300' 
                      : 'bg-zinc-800 border-zinc-700 text-zinc-200 hover:bg-zinc-700 disabled:opacity-30'
                  }`}
                >
                  {copied ? 'Copied!' : 'Copy'}
                </button>
              </div>
            </div>
          </div>

          {/* Quick Explainer Card */}
          <div className="rounded-xl border border-zinc-800/60 bg-zinc-950/40 p-4 text-xs text-zinc-400 leading-relaxed space-y-2">
            <p className="font-semibold text-zinc-300">How to consume this:</p>
            <p>Paste the generated URL into your frontend code (`fetch` or `axios.get()`). </p>
          </div>
        </section>

      </main>
    </div>
  );
}