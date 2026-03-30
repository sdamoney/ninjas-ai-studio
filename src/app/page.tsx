"use client";

import { useState, useRef, useCallback } from "react";

const PROCESSING_MESSAGES = [
  "Analyzing facial structure...",
  "Mapping skin tone and lighting...",
  "Calibrating professional parameters...",
  "Applying AI enhancement algorithms...",
  "Optimizing for corporate standards...",
  "Rendering final professional headshot...",
  "Almost there — polishing details...",
];

export default function Home() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [processingMsg, setProcessingMsg] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [limitReached, setLimitReached] = useState(false);
  const [generationsLeft, setGenerationsLeft] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      setSelectedFile(file);
      setGeneratedImage(null);
      setError(null);
      const reader = new FileReader();
      reader.onload = (ev) => setSelectedImage(ev.target?.result as string);
      reader.readAsDataURL(file);
    },
    []
  );

  const handleGenerate = useCallback(async () => {
    if (!selectedFile) return;
    setIsLoading(true);
    setError(null);
    setGeneratedImage(null);

    let msgIndex = 0;
    setProcessingMsg(PROCESSING_MESSAGES[0]);
    const interval = setInterval(() => {
      msgIndex = (msgIndex + 1) % PROCESSING_MESSAGES.length;
      setProcessingMsg(PROCESSING_MESSAGES[msgIndex]);
    }, 3000);

    try {
      const formData = new FormData();
      formData.append("image", selectedFile);

      const res = await fetch("/api/generate", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.limitReached) {
          setLimitReached(true);
        } else {
          setError(data.error || "Something went wrong");
        }
      } else {
        setGeneratedImage(data.image);
        if (data.generationsLeft !== undefined) {
          setGenerationsLeft(data.generationsLeft);
        }
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      clearInterval(interval);
      setIsLoading(false);
    }
  }, [selectedFile]);

  const handleReset = useCallback(() => {
    setSelectedImage(null);
    setSelectedFile(null);
    setGeneratedImage(null);
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="border-b border-border px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center font-bold text-lg">
              91
            </div>
            <div>
              <h1 className="text-lg font-semibold leading-tight">
                91Ninjas AI Studio
              </h1>
              <p className="text-xs text-gray-400">
                Professional Headshot Generator
              </p>
            </div>
          </div>
          <span className="text-xs text-gray-500 bg-surface px-3 py-1 rounded-full border border-border">
            Internal Beta v2.4
          </span>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 flex flex-col items-center px-6 py-12">
        <div className="max-w-3xl w-full">
          {/* Hero */}
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary-light to-primary bg-clip-text text-transparent">
              AI Professional Headshots
            </h2>
            <p className="text-gray-400 text-lg max-w-xl mx-auto">
              Upload a selfie and our AI will transform it into a polished,
              corporate-ready professional headshot in seconds.
            </p>
          </div>

          {/* Upload Area */}
          {!selectedImage && (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-border rounded-2xl p-16 text-center cursor-pointer hover:border-primary hover:bg-surface/50 transition-all duration-300 group"
            >
              <div className="w-20 h-20 rounded-full bg-surface mx-auto mb-6 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <svg
                  className="w-10 h-10 text-gray-500 group-hover:text-primary transition-colors"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M12 16v-8m-4 4l4-4 4 4m5 4v2a2 2 0 01-2 2H5a2 2 0 01-2-2v-2"
                  />
                </svg>
              </div>
              <p className="text-lg font-medium mb-2">
                Drop your selfie here or click to upload
              </p>
              <p className="text-sm text-gray-500">
                JPG, PNG — works best with a clear, well-lit face photo
              </p>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageSelect}
                className="hidden"
              />
            </div>
          )}

          {/* Preview + Result */}
          {selectedImage && (
            <div className="space-y-8">
              <div
                className={`grid ${generatedImage ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1 max-w-md mx-auto"} gap-6`}
              >
                {/* Original */}
                <div className="bg-surface rounded-2xl p-4 border border-border">
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-3 text-center">
                    Your Photo
                  </p>
                  <div className="aspect-square rounded-xl overflow-hidden bg-black">
                    <img
                      src={selectedImage}
                      alt="Original"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                {/* Generated */}
                {generatedImage && (
                  <div className="bg-surface rounded-2xl p-4 border border-primary/30 glow">
                    <p className="text-xs text-primary-light uppercase tracking-wider mb-3 text-center">
                      AI Professional Headshot
                    </p>
                    <div className="aspect-square rounded-xl overflow-hidden bg-black">
                      <img
                        src={generatedImage}
                        alt="Generated"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Loading */}
              {isLoading && (
                <div className="bg-surface rounded-2xl p-8 border border-border text-center">
                  <div className="w-16 h-16 rounded-full border-4 border-primary/30 border-t-primary animate-spin mx-auto mb-4" />
                  <p className="text-primary-light font-medium mb-1">
                    {processingMsg}
                  </p>
                  <p className="text-xs text-gray-500">
                    This may take 15-30 seconds
                  </p>
                  <div className="mt-4 h-1.5 bg-surface-light rounded-full overflow-hidden max-w-xs mx-auto">
                    <div className="h-full bg-gradient-to-r from-primary to-primary-light rounded-full shimmer" />
                  </div>
                </div>
              )}

              {/* Limit Reached CTA */}
              {limitReached && (
                <div className="bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/30 rounded-2xl p-8 text-center">
                  <div className="w-16 h-16 rounded-full bg-primary/20 mx-auto mb-4 flex items-center justify-center">
                    <svg
                      className="w-8 h-8 text-primary-light"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold mb-2">
                    You&apos;ve used all 3 free generations!
                  </h3>
                  <p className="text-gray-400 mb-6 max-w-md mx-auto">
                    Want unlimited AI-powered headshots and more? Let&apos;s
                    level up your marketing together.
                  </p>
                  <a
                    href="mailto:hello@91ninjas.com?subject=Level%20Up%20My%20Marketing"
                    className="inline-block px-8 py-3 bg-primary hover:bg-primary/80 rounded-xl font-semibold transition-colors text-lg"
                  >
                    Contact Us at hello@91ninjas.com
                  </a>
                </div>
              )}

              {/* Error */}
              {error && (
                <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-center">
                  <p className="text-red-400">{error}</p>
                </div>
              )}

              {/* Actions */}
              <div className="flex flex-col items-center gap-4">
                {generationsLeft !== null && generationsLeft > 0 && !limitReached && (
                  <p className="text-xs text-gray-500">
                    {generationsLeft} free generation{generationsLeft !== 1 ? "s" : ""} remaining
                  </p>
                )}
                <div className="flex gap-4 justify-center">
                  {!isLoading && !generatedImage && !limitReached && (
                    <button
                      onClick={handleGenerate}
                      className="px-8 py-3 bg-primary hover:bg-primary/80 rounded-xl font-semibold transition-colors text-lg cursor-pointer"
                    >
                      Generate Professional Headshot
                    </button>
                  )}
                  {generatedImage && (
                    <>
                      {!limitReached && (
                        <button
                          onClick={handleGenerate}
                          className="px-6 py-3 bg-primary hover:bg-primary/80 rounded-xl font-semibold transition-colors cursor-pointer"
                        >
                          Regenerate
                        </button>
                      )}
                      <a
                        href={generatedImage}
                        download="91ninjas-headshot.png"
                        className="px-6 py-3 bg-surface hover:bg-surface-light border border-border rounded-xl font-semibold transition-colors"
                      >
                        Download
                      </a>
                    </>
                  )}
                  <button
                    onClick={handleReset}
                    disabled={isLoading}
                    className="px-6 py-3 bg-surface hover:bg-surface-light border border-border rounded-xl font-semibold transition-colors disabled:opacity-50 cursor-pointer"
                  >
                    {generatedImage ? "Try Another Photo" : "Cancel"}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Features (only show when no image) */}
          {!selectedImage && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
              {[
                {
                  title: "AI-Powered",
                  desc: "State-of-the-art generative AI trained on professional photography.",
                  icon: "M13 10V3L4 14h7v7l9-11h-7z",
                },
                {
                  title: "Instant Results",
                  desc: "Get your professional headshot in under 30 seconds.",
                  icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z",
                },
                {
                  title: "Corporate Ready",
                  desc: "Perfect for LinkedIn, company profiles, and team pages.",
                  icon: "M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m8 0H8m8 0h2a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V8a2 2 0 012-2h2",
                },
              ].map((f) => (
                <div
                  key={f.title}
                  className="bg-surface/50 border border-border rounded-xl p-6 text-center"
                >
                  <div className="w-12 h-12 rounded-lg bg-primary/10 mx-auto mb-4 flex items-center justify-center">
                    <svg
                      className="w-6 h-6 text-primary-light"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d={f.icon}
                      />
                    </svg>
                  </div>
                  <h3 className="font-semibold mb-2">{f.title}</h3>
                  <p className="text-sm text-gray-400">{f.desc}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border px-6 py-4 text-center text-xs text-gray-500">
        &copy; 2026 91Ninjas &middot; AI Studio &middot; Internal Use Only
      </footer>
    </div>
  );
}
