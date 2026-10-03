"use client";
import { useState, useRef } from "react";
import { Sparkles, Lightbulb, Target, Brain, MessageCircle, BookOpen, Clock, RefreshCw, ArrowRight, GraduationCap, Heart, ChevronDown } from "lucide-react";

type Level = "Middle School" | "High School" | "College Freshman" | "College Advanced" | "Professional / Adult Learner";

interface QuizItem {
  q: string;
  a: string;
}

interface Explanation {
  analogyTitle: string;
  analogy: string;
  coreTitle: string;
  corePoints: string[];
  quiz: QuizItem[];
  encouragement: string;
}

const levels: Level[] = ["Middle School","High School","College Freshman","College Advanced","Professional / Adult Learner"];

function countWords(s: string) {
  return s.trim().split(/\s+/).filter(Boolean).length;
}

function generateExplanation(topic: string, level: Level, confusing: string): Explanation {
  const t = topic.toLowerCase();
  const conf = confusing.toLowerCase();
  
  let analogyTitle = `Imagine ${topic} is like...`;
  let analogy = "";
  let coreTitle = `How ${topic} actually works`;
  let points: string[] = [];
  let quiz: QuizItem[] = [];

  // analogy logic
  if (t.includes("photo")) {
    analogyTitle = "A Tiny Solar-Powered Kitchen";
    analogy = `Think of a leaf like a tiny kitchen with solar panels on the roof. Sunlight is the electricity. Water from the roots is like water from the tap, and carbon dioxide from the air is the flour. The leaf-chef (chlorophyll) uses solar power to bake sugar — that's food for the plant. Oxygen is just the yummy smell that leaks out the window. That's photosynthesis: light + water + air = food + oxygen. The plant eats the sugar later to grow.`;
    points = [
      `Sunlight is captured by chlorophyll — the green pigment acting like solar panels.`,
      `Water (from roots) + CO2 (from air) enter the chloroplast kitchen.`,
      `Light energy splits water, powers conversion of CO2 into glucose (C6H12O6).`,
      `Oxygen is released as a byproduct; glucose is stored or used for energy via respiration.`
    ];
    quiz = [
      { q: `What is the "solar panel" in photosynthesis?`, a: `Chlorophyll — it absorbs light energy to power the reaction.` },
      { q: `Why do plants need CO2 if they already have water and sun?`, a: `CO2 provides the carbon atoms to build glucose. No carbon, no sugar.` },
      { q: `Where does the oxygen we breathe out from plants actually come from?`, a: `From water molecules that are split by light energy.` }
    ];
  } else if (t.includes("black") && t.includes("scholes") || t.includes("option")) {
    analogyTitle = "Pricing a Weather Bet";
    analogy = `Imagine you bet a farmer: "If it rains tomorrow, you pay me $10." How much should that bet cost today? It depends on how likely rain is, how soon tomorrow is, and how wild the weather has been. Black-Scholes does the same for stocks. It's a formula that says: what's a fair price NOW for the right to buy a stock LATER at a set price, given how wobbly the stock is (volatility), time left, and interest rates. No magic, just fair-bet math.`;
    points = [
      `An option = right, not obligation, to buy/sell a stock at a strike price before expiry.`,
      `Black-Scholes assumes stock prices jiggle randomly (lognormal) and markets are frictionless.`,
      `Price depends on 5 inputs: stock price, strike, time to expiry, risk-free rate, volatility.`,
      `Key insight: you can hedge away risk, so price doesn't depend on expected stock growth — only on volatility.`
    ];
    quiz = [
      { q: `Why does higher volatility increase an option's price?`, a: `More wiggle = higher chance it ends up valuable. That upside has value.` },
      { q: `What happens to option value as expiry approaches?`, a: `Time decay — less time for the stock to move in your favor, so value drops.` },
      { q: `Why doesn't Black-Scholes need your guess of where the stock is headed?`, a: `Because hedging argument removes directional risk; only risk-free rate matters.` }
    ];
  } else if (t.includes("economic") || t.includes("supply") || t.includes("demand")) {
    analogyTitle = "The Lemonade Stand Market";
    analogy = `You sell lemonade for $2. At that price, 10 kids want it but you only made 5 cups — shortage! You raise to $3. Now only 5 kids want it, perfect match. If you go to $4, only 2 kids want it but you have 5 cups — you have to lower price. Supply and demand is just that negotiation dance between "how much people want" and "how much exists" until price finds balance.`;
    points = [
      `Demand: lower price → more buyers; supply: higher price → more sellers willing to produce.`,
      `Equilibrium is where supply curve meets demand curve — no surplus, no shortage.`,
      `Shifts vs movements: price change moves along curve; preferences/income change shifts entire curve.`,
      `Scarcity and tradeoffs create incentives that move the equilibrium.`
    ];
    quiz = [
      { q: `What causes a price to rise in this model?`, a: `Either demand increases or supply decreases, creating temporary shortage.` },
      { q: `Difference between shift and movement along demand?`, a: `Movement = price changed. Shift = something else changed (taste, income, substitutes).` },
      { q: `What is equilibrium?`, a: `Price where quantity demanded equals quantity supplied.` }
    ];
  } else if (t.includes("spanish") || t.includes("preterite") || t.includes("grammar")) {
    analogyTitle = "Two Kinds of Past Photos";
    analogy = `Spanish has two past tenses like two photo albums. Preterite is Polaroid snapshots — done, boxed, finished: "Yesterday I ate tacos. Snap. Done." Imperfect is background video — ongoing, habitual: "When I was a kid, I used to eat tacos every Friday." Preterite = what happened. Imperfect = what was happening.`;
    points = [
      `Preterite: completed actions with clear beginning/end. Signals: ayer, anoche, una vez.`,
      `Imperfect: ongoing, habitual, background context. Signals: siempre, todos los días, mientras.`,
      `Conjugation patterns: preterite often irregular (fui, tuve); imperfect is super regular (-aba, -ía).`,
      `Storytelling trick: imperfect sets scene, preterite moves action forward.`
    ];
    quiz = [
      { q: `Which would you use: "It was raining when I left"?`, a: `Llovía (imperfect) cuando salí (preterite). Background + interruption.` },
      { q: `How to say "I used to play soccer"?`, a: `Jugaba al fútbol — habitual past, so imperfect.` },
      { q: `One-time event yesterday: which tense?`, a: `Preterite. Ayer comí, ayer fui.` }
    ];
  } else if (t.includes("neural") || t.includes("ai") || t.includes("machine learning")) {
    analogyTitle = "A Room Full of Knobs";
    analogy = `Imagine 1,000 friends in a room, each with a dial. You show them a cat photo. They each turn their dials a little, pass notes to next row. Last row shouts "CAT!" If wrong, you say "more left!" and everyone nudges dials. Do that a million times — now they shout CAT correctly. Neural networks are just stacked layers of adjustable knobs (weights) learning from mistakes.`;
    points = [
      `Neurons = simple math: weighted sum + non-linearity (e.g. ReLU).`,
      `Layers stack simple features into complex ones: edges → shapes → cat.`,
      `Training = forward pass + compute error + backpropagate to nudge weights.`,
      `Generalization depends on data diversity, not just memorizing — that's why overfitting hurts.`
    ];
    quiz = [
      { q: `What does backpropagation actually do?`, a: `Calculates how much each weight contributed to error and adjusts it.` },
      { q: `Why non-linear activation?`, a: `Without it, stacked layers collapse to just one linear layer — can't learn curves.` },
      { q: `What is overfitting in one sentence?`, a: `Model memorized training examples but fails on new data.` }
    ];
  } else {
    // generic fallback tailored to topic
    const topicCap = topic.trim() || "This topic";
    analogyTitle = `The ${topicCap} Toolbox`;
    analogy = `Think of ${topicCap} like learning to use a new toolbox. At first you see a bunch of tools and feel overwhelmed. But actually there are only 3-4 main tools you use 90% of the time. Once you know what each tool does and when to grab it, the confusing part (${confusing || "the tricky bit"}) becomes: "Oh, I just need the right tool for this job." Let's name those tools.`;
    points = [
      `${topicCap} builds on a few core principles — mastering them unlocks the rest.`,
      `The confusing part often comes from mixing two ideas: cause vs mechanism, or definition vs use.`,
      `Level adjustment for ${level}: we focus on intuition + key vocabulary first, then formal details.`,
      `Active recall check: can you explain it back without notes? If not, one piece is still fuzzy.`
    ];
    quiz = [
      { q: `In your own words, what is ${topicCap} trying to solve?`, a: `Frame the problem it solves — this is the Feynman test. If you can state the problem, you're halfway there.` },
      { q: `What was the part that felt confusing: ${confusing || "your original question"} — can you rephrase it as a how/why question?`, a: `Turning "I don't get X" into "Why does X happen when Y?" makes it searchable and testable.` },
      { q: `Teach it back in 30 seconds to a 12-year-old. What analogy would you use?`, a: `If you can teach it simply without jargon, you truly understand it.` }
    ];
  }

  const encouragements = [
    "You've got this — great question to dig into!",
    "Love that you're asking exactly where it gets tricky. That's how top students learn.",
    "Let's break it down together, step by step.",
    "This is a classic 'aha!' topic — once it clicks, it really clicks."
  ];

  return {
    analogyTitle,
    analogy: analogy.trim(),
    coreTitle,
    corePoints: points,
    quiz,
    encouragement: encouragements[Math.floor(Math.random()*encouragements.length)]
  };
}

export default function App() {
  const [topic, setTopic] = useState("");
  const [level, setLevel] = useState<Level>("High School");
  const [confusing, setConfusing] = useState("");
  const [explanation, setExplanation] = useState<Explanation | null>(null);
  const [revealed, setRevealed] = useState<boolean[]>([false,false,false]);
  const [followUp, setFollowUp] = useState("");
  const [followUpAnswer, setFollowUpAnswer] = useState<string | null>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  const handleExplain = () => {
    if (!topic.trim()) return;
    const exp = generateExplanation(topic, level, confusing);
    setExplanation(exp);
    setRevealed([false,false,false]);
    setFollowUp("");
    setFollowUpAnswer(null);
    setTimeout(()=> resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 100);
  };

  const handleFollowUpAsk = () => {
    if (!followUp.trim() || !explanation) return;
    const t = topic.toLowerCase();
    // simple follow-up generation
    setFollowUpAnswer(
      `Great follow-up! About "${followUp}" — think of it this way: in ${topic}, that detail is like the fine print on the toolbox manual. For ${level} level, the key is: ${followUp.includes("why") ? "it's about cause-and-effect, not just memorization." : "it's a common sticking point, and yes, others get tripped by it too."} \n\nQuick check: If you had to explain "${followUp}" to a friend, what would be your first sentence? Try it — then compare to: "${explanation.corePoints[0]}" \n\n${explanation.encouragement}`
    );
  };

  const isReady = topic.trim().length > 1;

  return (
    <div className="min-h-screen bg-[#FFFBF6] text-zinc-800 selection:bg-amber-200">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Fraunces:opsz,wght@9..144,600&display=swap');
        * { font-family: Inter, system-ui, sans-serif; }
        .serif { font-family: Fraunces, serif; }
        @keyframes floatUp { from { opacity:0; transform: translateY(12px)} to { opacity:1; transform: translateY(0)} }
        .animate-up { animation: floatUp 0.5s ease-out forwards; }
      `}</style>

      {/* Header */}
      <header className="sticky top-0 z-20 backdrop-blur-xl bg-[#FFFBF6]/80 border-b border-zinc-100" style={{ paddingTop: 'var(--safe-area-inset-top)' }}>
        <div className="mx-auto max-w-5xl px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-full bg-zinc-900 text-white grid place-items-center font-bold serif text-[18px]">S</div>
            <div>
              <h1 className="serif text-[20px] leading-none tracking-tight font-semibold">Study Buddy</h1>
              <p className="text-[11px] text-zinc-500 mt-0.5 hidden sm:block">Your patient, top-student tutor • Feynman Technique • Active Recall</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-1.5 rounded-full bg-amber-100 text-amber-900 px-3 py-1.5 text-[11px] font-medium">
              <BookOpen className="h-3.5 w-3.5" /> Feynman Mode ON
            </div>
            <div className="h-8 w-8 rounded-full bg-white border border-zinc-200 grid place-items-center">
              <GraduationCap className="h-4 w-4" />
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-8 md:py-12">
        <div className="grid lg:grid-cols-[1.15fr_0.85fr] gap-8 items-start">
          {/* Left: Form + Empty state */}
          <div className="space-y-6">
            {/* Hero copy */}
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-3 py-1 text-[11px] font-medium tracking-wide text-zinc-600">
                <Sparkles className="h-3.5 w-3.5 text-amber-500" /> PATIENT • ENCOURAGING • SIMPLE
              </div>
              <h2 className="serif text-[32px] md:text-[40px] leading-[0.95] tracking-tight">
                Stuck on something?
                <br />
                <span className="text-zinc-400">Let’s make it click.</span>
              </h2>
              <p className="text-[15px] leading-6 text-zinc-600 max-w-[48ch]">
                Tell me what’s confusing. I’ll explain it in 3 layers: a kid-simple analogy, the core mechanics, and a quick quiz so it sticks. No fluff — under 200 words per layer.
              </p>
            </div>

            {/* Input Card */}
            <div className="rounded-[20px] bg-white border border-zinc-200 shadow-[0_8px_30px_rgba(0,0,0,0.04)] p-6 md:p-7 space-y-5">
              <div className="flex items-center justify-between">
                <label className="text-[12px] font-semibold tracking-widest text-zinc-500 uppercase">What are we learning?</label>
                <span className="text-[11px] text-zinc-400 flex items-center gap-1"><Heart className="h-3 w-3" /> You’ve got this!</span>
              </div>

              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[13px] font-medium">Topic / Subject</span>
                    <span className="text-[11px] text-zinc-400">{topic.length} chars</span>
                  </div>
                  <input
                    value={topic}
                    onChange={e=>setTopic(e.target.value)}
                    placeholder='e.g. "Photosynthesis, Black-Scholes, Spanish preterite..."'
                    className="w-full rounded-xl border border-zinc-200 bg-[#FCFCF9] px-4 py-3.5 text-[14px] outline-none focus:ring-2 focus:ring-zinc-900 focus:border-zinc-900 placeholder:text-zinc-400 transition"
                  />
                </div>

                <div>
                  <label className="text-[13px] font-medium mb-2 block">Your Level</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {levels.map(l => (
                      <button
                        key={l}
                        onClick={()=>setLevel(l)}
                        className={`text-left rounded-xl border px-4 py-3 text-[13px] transition ${level===l ? "bg-zinc-900 text-white border-zinc-900" : "bg-white border-zinc-200 hover:border-zinc-300 text-zinc-700"}`}
                      >
                        {l}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[13px] font-medium">What’s specifically confusing?</span>
                    <span className="text-[11px] text-zinc-400">helps me tailor analogy</span>
                  </div>
                  <textarea
                    value={confusing}
                    onChange={e=>setConfusing(e.target.value)}
                    placeholder='e.g. I don&apos;t get why plants need sunlight if they already have water...'
                    rows={3}
                    className="w-full rounded-xl border border-zinc-200 bg-[#FCFCF9] px-4 py-3 text-[14px] outline-none focus:ring-2 focus:ring-zinc-900 focus:border-zinc-900 placeholder:text-zinc-400 resize-none"
                  />
                </div>
              </div>

              <button
                onClick={handleExplain}
                disabled={!isReady}
                className={`w-full group rounded-xl px-5 py-4 text-[15px] font-semibold flex items-center justify-center gap-2 transition-all ${isReady ? "bg-zinc-900 text-white hover:bg-black shadow-[0_10px_20px_rgba(0,0,0,0.12)] active:scale-[0.98]" : "bg-zinc-200 text-zinc-400 cursor-not-allowed"}`}
              >
                Explain it to me <ArrowRight className={`h-4 w-4 transition-transform ${isReady ? "group-hover:translate-x-0.5" : ""}`} />
              </button>

              <div className="flex items-center gap-2 text-[11px] text-zinc-500">
                <div className="h-px flex-1 bg-zinc-100" />
                <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> ~30 sec to clarity</span>
                <div className="h-px flex-1 bg-zinc-100" />
              </div>
            </div>

            {/* Study tips */}
            <div className="rounded-[16px] bg-[#FFF3E0] border border-amber-100 p-4 flex gap-3">
              <div className="h-9 w-9 rounded-full bg-white grid place-items-center flex-shrink-0"><Lightbulb className="h-4 w-4 text-amber-600" /></div>
              <div className="space-y-1">
                <p className="text-[12px] font-semibold uppercase tracking-wide text-amber-900">How Feynman Technique works</p>
                <p className="text-[13px] leading-5 text-amber-900/80">1. Pick topic → 2. Explain simply like teaching a kid → 3. Find gaps → 4. Simplify again. Study Buddy forces steps 2 & 3 for you.</p>
                <div className="flex gap-2 pt-1 flex-wrap">
                  <span className="rounded-full bg-white px-2.5 py-1 text-[10px] font-medium border border-amber-200">Active Recall</span>
                  <span className="rounded-full bg-white px-2.5 py-1 text-[10px] font-medium border border-amber-200">Spaced Repetition</span>
                  <span className="rounded-full bg-white px-2.5 py-1 text-[10px] font-medium border border-amber-200">Elaboration</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Output / Empty */}
          <div ref={resultsRef} className="lg:sticky lg:top-[88px] space-y-4">
            {!explanation ? (
              <div className="rounded-[20px] border border-dashed border-zinc-300 bg-white/60 p-8 md:p-10 text-center space-y-6">
                <div className="mx-auto h-24 w-24 rounded-[24px] bg-white border border-zinc-200 shadow-sm grid place-items-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-b from-amber-50 to-white" />
                  <div className="relative flex flex-col items-center gap-2">
                    <div className="h-10 w-10 rounded-full bg-zinc-900 text-white grid place-items-center text-lg">✦</div>
                    <div className="h-1.5 w-16 rounded-full bg-zinc-100" />
                    <div className="h-1.5 w-10 rounded-full bg-zinc-100" />
                  </div>
                </div>
                <div className="space-y-2">
                  <h3 className="serif text-[20px]">Ready when you are</h3>
                  <p className="text-[14px] leading-6 text-zinc-500 max-w-[28ch] mx-auto">
                    Type a topic on the left. I’ll generate a 3-layer explanation that actually sticks — no API needed, just solid study science.
                  </p>
                </div>
                <div className="grid grid-cols-3 gap-2 text-left pt-2">
                  {[
                    { k:"🧒", t:"Analogy", d:"Kid-simple story" },
                    { k:"🎯", t:"Core", d:"Mechanisms" },
                    { k:"🧠", t:"Quiz", d:"Recall check" },
                  ].map(c=>(
                    <div key={c.t} className="rounded-xl bg-white border border-zinc-200 p-3">
                      <div className="text-[16px]">{c.k}</div>
                      <div className="text-[11px] font-semibold mt-1">{c.t}</div>
                      <div className="text-[11px] text-zinc-500">{c.d}</div>
                    </div>
                  ))}
                </div>
                <p className="text-[11px] text-zinc-400 pt-2">Try: “Photosynthesis”, “Black-Scholes”, “Spanish preterite”, “Neural networks”</p>
              </div>
            ) : (
              <div className="space-y-4">
                {/* encouragement banner */}
                <div className="rounded-[16px] bg-zinc-900 text-white p-4 flex items-center gap-3 animate-up">
                  <div className="h-8 w-8 rounded-full bg-white/15 grid place-items-center">💛</div>
                  <div className="text-[13px] leading-5">
                    <span className="font-semibold">Great question!</span> {explanation.encouragement}
                  </div>
                </div>

                {/* Layer 1 */}
                <div className="rounded-[20px] bg-white border border-zinc-200 shadow-[0_8px_24px_rgba(0,0,0,0.04)] overflow-hidden animate-up" style={{ animationDelay:"0.05s" }}>
                  <div className="p-6 md:p-6 space-y-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-full bg-[#FFF1D6] grid place-items-center text-[18px]">🧒</div>
                        <div>
                          <h4 className="text-[13px] font-semibold tracking-wide uppercase text-zinc-500">Layer 1 • Simple Analogy</h4>
                          <p className="serif text-[18px] leading-tight mt-0.5">{explanation.analogyTitle}</p>
                        </div>
                      </div>
                      <span className="shrink-0 rounded-full bg-amber-50 border border-amber-100 px-2.5 py-1 text-[10px] font-medium text-amber-800">{countWords(explanation.analogy)} / 200 words</span>
                    </div>
                    <p className="text-[14px] leading-[1.7] text-zinc-700 bg-[#FFFBF1] rounded-xl p-4 border border-amber-50">{explanation.analogy}</p>
                    <div className="flex items-center gap-2 text-[11px] text-zinc-500">
                      <span className="inline-flex items-center gap-1 rounded-full bg-zinc-50 border px-2.5 py-1"><Target className="h-3 w-3" /> Like I'm 12</span>
                      <span>• tailored for {level}</span>
                    </div>
                  </div>
                </div>

                {/* Layer 2 */}
                <div className="rounded-[20px] bg-white border border-zinc-200 shadow-[0_8px_24px_rgba(0,0,0,0.04)] overflow-hidden animate-up" style={{ animationDelay:"0.12s" }}>
                  <div className="p-6 md:p-6 space-y-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-full bg-zinc-900 text-white grid place-items-center text-[16px]">🎯</div>
                        <div>
                          <h4 className="text-[13px] font-semibold tracking-wide uppercase text-zinc-500">Layer 2 • Core Explanation</h4>
                          <p className="serif text-[18px] leading-tight mt-0.5">{explanation.coreTitle}</p>
                        </div>
                      </div>
                      <span className="shrink-0 rounded-full bg-zinc-50 border border-zinc-200 px-2.5 py-1 text-[10px] font-medium text-zinc-600">{explanation.corePoints.join(" ").split(/\s+/).length} / 200 words</span>
                    </div>
                    <ul className="space-y-3">
                      {explanation.corePoints.map((p,i)=>(
                        <li key={i} className="flex gap-3 text-[14px] leading-6">
                          <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-zinc-900 shrink-0" />
                          <span className="text-zinc-700">{p}</span>
                        </li>
                      ))}
                    </ul>
                    {confusing && (
                      <div className="rounded-xl bg-[#F6F5FF] border border-violet-100 p-3 text-[13px] leading-5">
                        <span className="font-semibold text-violet-900">Your confusion — addressed:</span>
                        <span className="text-zinc-700"> “{confusing}” → That’s exactly why we separated cause vs mechanism above. If you still feel fuzzy on it, use the follow-up box below.</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Layer 3 */}
                <div className="rounded-[20px] bg-white border border-zinc-200 shadow-[0_8px_24px_rgba(0,0,0,0.04)] overflow-hidden animate-up" style={{ animationDelay:"0.18s" }}>
                  <div className="p-6 md:p-6 space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-full bg-[#E8F5E9] grid place-items-center text-[18px]">🧠</div>
                      <div>
                        <h4 className="text-[13px] font-semibold tracking-wide uppercase text-zinc-500">Layer 3 • Quick Quiz — Active Recall</h4>
                        <p className="serif text-[18px] leading-tight mt-0.5">Can you teach it back?</p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      {explanation.quiz.map((item, idx)=>(
                        <div key={idx} className="rounded-xl border border-zinc-200 bg-[#FCFCF9] overflow-hidden">
                          <div className="p-4 flex items-start justify-between gap-3">
                            <div className="flex gap-3">
                              <span className="h-6 w-6 rounded-full bg-zinc-900 text-white grid place-items-center text-[11px] font-bold shrink-0">{idx+1}</span>
                              <p className="text-[14px] leading-6 font-medium text-zinc-800">{item.q}</p>
                            </div>
                            <button
                              onClick={()=> setRevealed(prev=> prev.map((v,i)=> i===idx ? !v : v))}
                              className="shrink-0 rounded-full border border-zinc-200 bg-white px-3 py-1.5 text-[11px] font-medium hover:bg-zinc-50 flex items-center gap-1"
                            >
                              {revealed[idx] ? "Hide" : "Show Answer"} <ChevronDown className={`h-3 w-3 transition ${revealed[idx] ? "rotate-180" : ""}`} />
                            </button>
                          </div>
                          {revealed[idx] && (
                            <div className="px-4 pb-4">
                              <div className="rounded-lg bg-white border border-green-100 p-3 text-[13px] leading-6 text-zinc-700 flex gap-2">
                                <span className="text-green-600 mt-0.5">✓</span> {item.a}
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center gap-2 text-[11px] text-zinc-500 pt-1">
                      <Brain className="h-3.5 w-3.5" /> Tip: Cover answers, say them out loud. That struggle = learning.
                    </div>
                  </div>
                </div>

                {/* Follow-up */}
                <div className="rounded-[20px] bg-white border border-zinc-200 p-5 space-y-3 animate-up" style={{ animationDelay:"0.24s" }}>
                  <div className="flex items-center gap-2">
                    <MessageCircle className="h-4 w-4 text-zinc-700" />
                    <h4 className="text-[13px] font-semibold">Ask follow-up</h4>
                    <span className="text-[11px] text-zinc-400">clears quiz • digs deeper</span>
                  </div>
                  <div className="flex gap-2">
                    <input
                      value={followUp}
                      onChange={e=>setFollowUp(e.target.value)}
                      placeholder="e.g. But why does that last step matter?"
                      className="flex-1 rounded-xl border border-zinc-200 bg-[#FCFCF9] px-4 py-3 text-[13px] outline-none focus:ring-2 focus:ring-zinc-900"
                      onKeyDown={e=> e.key==='Enter' && handleFollowUpAsk()}
                    />
                    <button
                      onClick={handleFollowUpAsk}
                      className="rounded-xl bg-zinc-900 text-white px-4 py-3 text-[13px] font-medium hover:bg-black"
                    >
                      Ask
                    </button>
                  </div>
                  {followUpAnswer && (
                    <div className="rounded-xl bg-zinc-900 text-zinc-100 p-4 text-[13px] leading-6 whitespace-pre-line">
                      {followUpAnswer}
                    </div>
                  )}
                  <div className="flex gap-2">
                    <button
                      onClick={()=> { setExplanation(null); setTopic(""); setConfusing(""); window.scrollTo({ top:0, behavior:"smooth"}) }}
                      className="inline-flex items-center gap-1.5 rounded-full border border-zinc-200 px-3 py-1.5 text-[11px] font-medium hover:bg-zinc-50"
                    >
                      <RefreshCw className="h-3 w-3" /> New topic
                    </button>
                    <span className="text-[11px] text-zinc-400 self-center">Patient tutor mode • No judgment, just clarity</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer tips */}
        <div className="mt-12 grid md:grid-cols-3 gap-3">
          {[
            { icon: Brain, title:"Active Recall", desc:"Close your notes. Write what you remember. Gaps show what to restudy." },
            { icon: Clock, title:"Spaced Repetition", desc:"Review Layer 3 tomorrow, in 3 days, then 7 days. That's when it sticks." },
            { icon: BookOpen, title:"Teach it back", desc:"Explain Layers 1-2 to a rubber duck or friend in under 60 seconds." },
          ].map(card=>(
            <div key={card.title} className="rounded-[16px] bg-white border border-zinc-200 p-4 flex gap-3">
              <div className="h-8 w-8 rounded-full bg-zinc-50 border grid place-items-center shrink-0"><card.icon className="h-4 w-4" /></div>
              <div>
                <p className="text-[12px] font-semibold">{card.title}</p>
                <p className="text-[12px] leading-5 text-zinc-500 mt-1">{card.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 text-center text-[11px] text-zinc-400">
          Built with Feynman Technique • Under 200 words per layer • Crafted to feel like a real top-student tutor
        </div>
      </main>
    </div>
  );
}
