
"use client";
import { useState, useRef, useEffect } from "react";
import { Sparkles, Lightbulb, Target, Brain, MessageCircle, BookOpen, Clock, RefreshCw, ArrowRight, GraduationCap, Heart, ChevronDown, Lock, Zap, Crown } from "lucide-react";

type Level = "Middle School" | "High School" | "College Freshman" | "College Advanced" | "Professional / Adult Learner";

interface QuizItem { q: string; a: string; }
interface Explanation {
  analogyTitle: string;
  analogy: string;
  coreTitle: string;
  corePoints: string[];
  quiz: QuizItem[];
  encouragement: string;
}

const levels: Level[] = ["Middle School","High School","College Freshman","College Advanced","Professional / Adult Learner"];

function countWords(s: string) { return s.trim().split(/\s+/).filter(Boolean).length; }

export default function App() {
  const [topic, setTopic] = useState("");
  const [level, setLevel] = useState<Level>("College Freshman");
  const [confusing, setConfusing] = useState("");
  const [explanation, setExplanation] = useState<Explanation | null>(null);
  const [loading, setLoading] = useState(false);
  const [revealed, setRevealed] = useState<boolean[]>([false,false,false]);
  const [followUp, setFollowUp] = useState("");
  const [followUpAnswer, setFollowUpAnswer] = useState("");
  const [error, setError] = useState("");

  // Monetization state
  const [freeUses, setFreeUses] = useState(0);
  const [isPro, setIsPro] = useState(false);
  const [showPaywall, setShowPaywall] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  const resultRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Load free uses from localStorage
    const uses = parseInt(localStorage.getItem("sb_free_uses") || "0");
    setFreeUses(uses);
    const pro = localStorage.getItem("sb_pro") === "true";
    setIsPro(pro);
    // Check Stripe success param
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (params.get("success") === "true") {
        localStorage.setItem("sb_pro", "true");
        setIsPro(true);
        setShowPaywall(false);
      }
    }
  }, []);

  const handleCheckout = async () => {
    setCheckoutLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
      else setError(data.error || "Checkout failed");
    } catch (e: any) { setError(e.message); }
    setCheckoutLoading(false);
  };

  const handleGenerate = async () => {
    if (!topic.trim()) return;

    // Paywall check: 3 free uses
    if (!isPro && freeUses >= 3) {
      setShowPaywall(true);
      return;
    }

    setLoading(true);
    setError("");
    setExplanation(null);
    setFollowUpAnswer("");
    setRevealed([false,false,false]);

    try {
      const res = await fetch("/api/explain", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic, level, confusing }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");

      setExplanation(data);
      if (!isPro) {
        const newUses = freeUses + 1;
        setFreeUses(newUses);
        localStorage.setItem("sb_free_uses", String(newUses));
        if (newUses >= 3) setTimeout(() => setShowPaywall(true), 1500);
      }
      setTimeout(() => resultRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
    } catch (e: any) {
      setError(e.message || "Something went wrong. Check your OPENAI_API_KEY in Vercel env vars.");
    }
    setLoading(false);
  };

  const handleFollowUpAsk = async () => {
    if (!followUp.trim() || !explanation) return;
    setLoading(true);
    try {
      const res = await fetch("/api/explain", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          topic: `${topic} - Follow-up: ${followUp}`, 
          level, 
          confusing: `Previously explained: ${explanation.corePoints.join("; ")}. Now user asks: ${followUp}` 
        }),
      });
      const data = await res.json();
      setFollowUpAnswer(`${data.analogy}\n\n${data.corePoints.join("\n• ")}`);
    } catch (e: any) { setFollowUpAnswer("Could not get answer: " + e.message); }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#FFFEF8] text-zinc-900 selection:bg-zinc-900 selection:text-white">
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Inter:wght@400;500;600;700&display=swap');
        .serif{font-family:'Instrument Serif',serif} .sans{font-family:Inter,sans-serif}
        .animate-up{animation:up .4s ease both} @keyframes up{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
      `}</style>

      <header className="sticky top-0 z-30 backdrop-blur bg-[#FFFEF8]/80 border-b border-zinc-100">
        <div className="mx-auto max-w-6xl px-6 h-[64px] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-xl bg-zinc-900 grid place-items-center text-white"><GraduationCap className="h-5 w-5" /></div>
            <span className="serif text-[20px] tracking-tight">Study Buddy</span>
            <span className="hidden md:inline-flex ml-3 rounded-full bg-zinc-900 text-white px-2.5 py-1 text-[10px] font-semibold tracking-wide uppercase">Real AI + Stripe</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2 text-[11px] text-zinc-500">
              <span className="inline-flex items-center gap-1"><div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" /> GPT-4o-mini live</span>
              <span>•</span>
              <span>{isPro ? "Pro Unlimited" : `${3 - freeUses} free left`}</span>
            </div>
            {!isPro ? (
              <button onClick={() => setShowPaywall(true)} className="sans rounded-full bg-zinc-900 text-white px-4 py-2 text-[13px] font-medium flex items-center gap-1.5 hover:bg-black"><Crown className="h-4 w-4" /> Upgrade $9/mo</button>
            ) : (
              <span className="rounded-full bg-green-100 text-green-700 px-3 py-1.5 text-[12px] font-semibold flex items-center gap-1"><Zap className="h-3.5 w-3.5" /> Pro</span>
            )}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-10 md:py-14">
        <div className="grid md:grid-cols-[1.1fr_0.9fr] gap-8 md:gap-12 items-start">
          <div className="space-y-6">
            <div className="space-y-4">
              <h1 className="serif text-[42px] md:text-[56px] leading-[0.95] tracking-tight">Understand anything <span className="italic font-light">fast.</span></h1>
              <p className="sans text-[15px] leading-6 text-zinc-600 max-w-[52ch]">Patient, top-student tutor. Asks your level + what is confusing, then teaches in 3 layers using Feynman technique & active recall. Each layer under 200 words.</p>
              <div className="flex gap-2 flex-wrap">
                {["Feynman Technique","Active Recall","Spaced Repetition"].map(t=>(
                  <span key={t} className="rounded-full border border-zinc-200 bg-white px-3 py-1 text-[11px] font-medium">{t}</span>
                ))}
              </div>
            </div>

            <div className="rounded-[24px] bg-white border border-zinc-200 shadow-[0_12px_32px_rgba(0,0,0,0.06)] p-6 md:p-7 space-y-5">
              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold tracking-wide uppercase text-zinc-500">Topic / Subject</label>
                <div className="relative">
                  <input value={topic} onChange={e=>setTopic(e.target.value)} placeholder="e.g. Photosynthesis, Black-Scholes, Spanish preterite..." className="w-full rounded-xl border border-zinc-200 bg-[#FCFCF9] px-4 py-3.5 text-[14px] outline-none focus:ring-2 focus:ring-zinc-900 sans" />
                  <Sparkles className="absolute right-3 top-3.5 h-4 w-4 text-zinc-400" />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold tracking-wide uppercase text-zinc-500">Your Level</label>
                <div className="grid grid-cols-1 gap-2">
                  <select value={level} onChange={e=>setLevel(e.target.value as Level)} className="w-full rounded-xl border border-zinc-200 bg-[#FCFCF9] px-4 py-3 text-[13px] outline-none focus:ring-2 focus:ring-zinc-900 sans">
                    {levels.map(l=> <option key={l} value={l}>{l}</option>)}
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold tracking-wide uppercase text-zinc-500">What is specifically confusing?</label>
                <textarea value={confusing} onChange={e=>setConfusing(e.target.value)} placeholder="e.g. I don't get why plants need sunlight if they have water..." className="min-h-[88px] w-full rounded-xl border border-zinc-200 bg-[#FCFCF9] px-4 py-3 text-[13px] outline-none focus:ring-2 focus:ring-zinc-900 sans resize-none" />
              </div>

              {error && <div className="rounded-xl bg-red-50 border border-red-200 p-3 text-[12px] text-red-700">{error}</div>}

              <button onClick={handleGenerate} disabled={loading || !topic.trim()} className="group w-full rounded-xl bg-zinc-900 text-white py-3.5 text-[14px] font-medium flex items-center justify-center gap-2 hover:bg-black disabled:opacity-50 sans">
                {loading ? <><RefreshCw className="h-4 w-4 animate-spin" /> Thinking like a top student...</> : <>{isPro || freeUses < 3 ? "Explain it to me" : "Upgrade to Continue"} <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition" /></>}
              </button>

              <div className="flex items-center gap-2 text-[11px] text-zinc-500"><Heart className="h-3.5 w-3.5" /> Patient mode • No judgment, just clarity • Real GPT-4o-mini</div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {[
                {icon: Brain, title:"Active Recall", desc:"Close notes, write what you remember."},
                {icon: Clock, title:"Spaced", desc:"Review tomorrow, 3 days, 7 days."},
                {icon: BookOpen, title:"Teach Back", desc:"Explain in 60s to a friend."},
              ].map(c=>(
                <div key={c.title} className="rounded-[16px] bg-white border border-zinc-200 p-4 flex flex-col gap-2">
                  <c.icon className="h-4 w-4" />
                  <p className="text-[12px] font-semibold sans">{c.title}</p>
                  <p className="text-[11px] leading-4 text-zinc-500 sans">{c.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div ref={resultRef} className="space-y-4 md:sticky md:top-[88px]">
            {!explanation && !loading && (
              <div className="rounded-[24px] border border-dashed border-zinc-200 bg-white/60 p-8 text-center space-y-3">
                <div className="mx-auto h-12 w-12 rounded-2xl bg-zinc-900 grid place-items-center text-white"><Lightbulb className="h-6 w-6" /></div>
                <p className="serif text-[18px]">Your 3-layer explanation will appear here</p>
                <p className="sans text-[12px] text-zinc-500 max-w-[32ch] mx-auto">Layer 1: Analogy like you are 12 • Layer 2: Core points • Layer 3: Quiz with hidden answers. Powered by real AI now.</p>
              </div>
            )}

            {loading && (
              <div className="space-y-3">
                {[1,2,3].map(i=> <div key={i} className="rounded-[20px] bg-white border border-zinc-200 p-6 animate-pulse h-[140px]" />)}
              </div>
            )}

            {explanation && (
              <div className="space-y-4">
                <div className="rounded-[20px] bg-white border border-zinc-200 shadow-[0_8px_24px_rgba(0,0,0,0.04)] p-6 space-y-4 animate-up">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-full bg-[#FEF3C7] grid place-items-center">🧒</div>
                    <div><h4 className="text-[11px] font-semibold tracking-wide uppercase text-zinc-500 sans">Layer 1 • Simple Analogy</h4><p className="serif text-[16px]">{explanation.analogyTitle} • {countWords(explanation.analogy)} words</p></div>
                  </div>
                  <p className="text-[13.5px] leading-6 text-zinc-700 sans">{explanation.analogy}</p>
                  <div className="rounded-xl bg-amber-50 border border-amber-100 p-3 text-[11px] text-amber-800 sans">{explanation.encouragement}</div>
                </div>

                <div className="rounded-[20px] bg-white border border-zinc-200 shadow-[0_8px_24px_rgba(0,0,0,0.04)] p-6 space-y-4 animate-up" style={{animationDelay:"0.08s"}}>
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-full bg-zinc-900 text-white grid place-items-center"><Target className="h-4 w-4" /></div>
                    <div><h4 className="text-[11px] font-semibold tracking-wide uppercase text-zinc-500 sans">Layer 2 • Core Explanation</h4><p className="serif text-[16px]">{explanation.coreTitle}</p></div>
                  </div>
                  <ul className="space-y-2">
                    {explanation.corePoints?.map((pt,i)=>(
                      <li key={i} className="flex gap-2 text-[13px] leading-5 sans"><span className="h-5 w-5 rounded-full bg-zinc-100 grid place-items-center text-[10px] font-bold shrink-0 mt-0.5">{i+1}</span><span>{pt}</span></li>
                    ))}
                  </ul>
                </div>

                <div className="rounded-[20px] bg-white border border-zinc-200 shadow-[0_8px_24px_rgba(0,0,0,0.04)] p-6 space-y-4 animate-up" style={{animationDelay:"0.16s"}}>
                  <div className="flex items-center gap-3"><div className="h-9 w-9 rounded-full bg-[#E8F5E9] grid place-items-center">🧠</div><div><h4 className="text-[11px] font-semibold tracking-wide uppercase text-zinc-500 sans">Layer 3 • Quick Quiz</h4><p className="serif text-[16px]">Can you teach it back?</p></div></div>
                  <div className="space-y-3">
                    {explanation.quiz?.map((item, idx)=>(
                      <div key={idx} className="rounded-xl border border-zinc-200 bg-[#FCFCF9] overflow-hidden">
                        <div className="p-4 flex items-start justify-between gap-3">
                          <div className="flex gap-3"><span className="h-6 w-6 rounded-full bg-zinc-900 text-white grid place-items-center text-[11px] font-bold shrink-0">{idx+1}</span><p className="text-[13px] leading-5 font-medium sans">{item.q}</p></div>
                          <button onClick={()=> setRevealed(prev=> prev.map((v,i)=> i===idx ? !v : v))} className="shrink-0 rounded-full border border-zinc-200 bg-white px-3 py-1.5 text-[11px] font-medium hover:bg-zinc-50 flex items-center gap-1 sans">{revealed[idx] ? "Hide" : "Show Answer"} <ChevronDown className={`h-3 w-3 transition ${revealed[idx] ? "rotate-180" : ""}`} /></button>
                        </div>
                        {revealed[idx] && <div className="px-4 pb-4"><div className="rounded-lg bg-white border border-green-100 p-3 text-[12px] leading-5 sans">✓ {item.a}</div></div>}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-[20px] bg-white border border-zinc-200 p-5 space-y-3">
                  <div className="flex items-center gap-2"><MessageCircle className="h-4 w-4" /><h4 className="text-[12px] font-semibold sans">Ask follow-up</h4></div>
                  <div className="flex gap-2">
                    <input value={followUp} onChange={e=>setFollowUp(e.target.value)} placeholder="But why does that last step matter?" className="flex-1 rounded-xl border border-zinc-200 bg-[#FCFCF9] px-4 py-3 text-[13px] outline-none focus:ring-2 focus:ring-zinc-900" onKeyDown={e=> e.key==='Enter' && handleFollowUpAsk()} />
                    <button onClick={handleFollowUpAsk} className="rounded-xl bg-zinc-900 text-white px-4 py-3 text-[13px] font-medium hover:bg-black sans">Ask</button>
                  </div>
                  {followUpAnswer && <div className="rounded-xl bg-zinc-900 text-zinc-100 p-4 text-[13px] leading-6 whitespace-pre-line sans">{followUpAnswer}</div>}
                </div>
              </div>
            )}
          </div>
        </div>

        {showPaywall && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm grid place-items-center p-6">
            <div className="w-full max-w-[420px] rounded-[24px] bg-white p-7 space-y-5 shadow-2xl animate-up">
              <div className="h-12 w-12 rounded-2xl bg-zinc-900 text-white grid place-items-center mx-auto"><Lock className="h-6 w-6" /></div>
              <div className="text-center space-y-2">
                <h3 className="serif text-[24px]">Unlock unlimited Study Buddy</h3>
                <p className="sans text-[13px] text-zinc-600">You have used {freeUses}/3 free explanations. Go Pro for unlimited AI explanations, saved history, and export.</p>
              </div>
              <div className="rounded-xl bg-zinc-50 border p-4 space-y-2">
                <div className="flex items-center justify-between text-[13px]"><span className="font-medium">Study Buddy Pro</span><span className="font-bold">$9/mo</span></div>
                <ul className="text-[12px] text-zinc-600 space-y-1 list-disc pl-4">
                  <li>Unlimited GPT-4o explanations</li>
                  <li>Save & export all notes</li>
                  <li>Priority fast generation</li>
                  <li>Cancel anytime</li>
                </ul>
              </div>
              <button onClick={handleCheckout} disabled={checkoutLoading} className="w-full rounded-xl bg-zinc-900 text-white py-3.5 text-[14px] font-medium flex items-center justify-center gap-2 hover:bg-black disabled:opacity-50">
                {checkoutLoading ? "Redirecting to Stripe..." : <><Crown className="h-4 w-4" /> Upgrade with Stripe</>}
              </button>
              <button onClick={()=>setShowPaywall(false)} className="w-full text-[12px] text-zinc-500 hover:text-zinc-900">Continue with limited free</button>
              <p className="text-[10px] text-zinc-400 text-center">Secure checkout by Stripe • Test mode until you add live keys</p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
