import Link from "next/link";
import { Activity, Droplets, Target, TrendingUp, Users, Zap, CheckCircle, Star } from "lucide-react";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white overflow-x-hidden">

      {/* ── NAVBAR ── */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-[#0a0a0a]/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <span className="text-xl font-black tracking-tighter">
              GOAT<span className="text-[#C8FF00]">.</span>
            </span>
            <div className="hidden md:flex items-center gap-8 text-sm text-white/60">
              <Link href="#features" className="hover:text-white transition-colors">Features</Link>
              <Link href="#pricing" className="hover:text-white transition-colors">Pricing</Link>
              <Link href="#stats" className="hover:text-white transition-colors">Results</Link>
            </div>
            <div className="flex items-center gap-3">
              <Link
                href="/login"
                className="text-sm text-white/70 hover:text-white transition-colors px-4 py-2"
              >
                Log in
              </Link>
              <Link
                href="/signup"
                className="text-sm font-semibold bg-[#C8FF00] text-black px-4 py-2 rounded-full hover:bg-[#d4ff33] transition-colors"
              >
                Get started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="relative pt-32 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[#C8FF00]/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 text-xs font-medium bg-white/5 border border-white/10 rounded-full px-4 py-2 mb-8 text-[#C8FF00]">
            <Zap className="w-3 h-3" />
            The greatest fitness tracker ever built
          </div>

          <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black tracking-tighter leading-none mb-6">
            TRAIN LIKE
            <br />
            THE{" "}
            <span className="text-[#C8FF00]">G.O.A.T</span>
          </h1>

          <p className="text-lg sm:text-xl text-white/50 max-w-2xl mx-auto mb-10 leading-relaxed">
            Log workouts, track nutrition, stay hydrated, and crush your goals.
            One app. Total control. No excuses.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/signup"
              className="w-full sm:w-auto bg-[#C8FF00] text-black font-bold px-8 py-4 rounded-full text-base hover:bg-[#d4ff33] transition-all hover:scale-105 active:scale-95"
            >
              Start for free
            </Link>
            <Link
              href="#features"
              className="w-full sm:w-auto border border-white/10 text-white/70 font-medium px-8 py-4 rounded-full text-base hover:border-white/30 hover:text-white transition-all"
            >
              See features
            </Link>
          </div>
        </div>

        {/* Hero stat strip */}
        <div className="mt-20 grid grid-cols-3 gap-3 max-w-3xl mx-auto">
          {[
            { label: "Workouts logged", value: "2.4M+" },
            { label: "Active users", value: "18K+" },
            { label: "Goals crushed", value: "94%" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="bg-white/3 border border-white/8 rounded-2xl p-6 text-center"
            >
              <div className="text-3xl sm:text-4xl font-black text-[#C8FF00]">{stat.value}</div>
              <div className="text-xs text-white/40 mt-1 uppercase tracking-widest">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section id="features" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-[#C8FF00] text-sm font-semibold uppercase tracking-widest mb-3">Everything you need</p>
          <h2 className="text-4xl sm:text-5xl font-black tracking-tighter">Built for serious athletes</h2>
          <p className="text-white/40 mt-4 max-w-xl mx-auto">
            Every feature is designed to keep you accountable, consistent, and progressing.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            {
              icon: Activity,
              title: "Workout logger",
              desc: "Log exercises, sets, reps, and duration. Search from thousands of exercises powered by ExerciseDB.",
            },
            {
              icon: Target,
              title: "Nutrition tracker",
              desc: "Search millions of foods with Open Food Facts. Track calories, protein, carbs, and fat daily.",
            },
            {
              icon: Droplets,
              title: "Water tracker",
              desc: "Set your daily hydration goal and get smart browser reminders when you fall behind.",
              badge: "★ Extra",
            },
            {
              icon: TrendingUp,
              title: "Progress charts",
              desc: "Visualize your weight, calories, and workout frequency over time with beautiful charts.",
            },
            {
              icon: Zap,
              title: "Streaks & badges",
              desc: "Stay consistent with daily streaks and earn achievement badges for hitting your goals.",
            },
            {
              icon: Users,
              title: "Social feed",
              desc: "Follow friends, share workouts, and celebrate each other's progress together.",
            },
          ].map((feature) => (
            <div
              key={feature.title}
              className="group relative bg-white/3 border border-white/8 rounded-2xl p-6 hover:border-[#C8FF00]/30 hover:bg-white/5 transition-all"
            >
              {feature.badge && (
                <span className="absolute top-4 right-4 text-[10px] font-bold bg-[#C8FF00]/10 text-[#C8FF00] border border-[#C8FF00]/20 rounded-full px-2 py-0.5">
                  {feature.badge}
                </span>
              )}
              <div className="w-10 h-10 rounded-xl bg-[#C8FF00]/10 flex items-center justify-center mb-4 group-hover:bg-[#C8FF00]/20 transition-colors">
                <feature.icon className="w-5 h-5 text-[#C8FF00]" />
              </div>
              <h3 className="font-bold text-base mb-2">{feature.title}</h3>
              <p className="text-sm text-white/40 leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section id="stats" className="py-24 px-4 sm:px-6 lg:px-8 bg-white/2 border-y border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-[#C8FF00] text-sm font-semibold uppercase tracking-widest mb-3">Real results</p>
            <h2 className="text-4xl sm:text-5xl font-black tracking-tighter">What our users say</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                quote: "GOAT Fitness changed how I train. The water reminders alone kept me consistent for 30 days straight.",
                name: "Marcus T.",
                role: "Powerlifter",
                stars: 5,
              },
              {
                quote: "Finally an app that tracks everything in one place. The nutrition logger is incredibly fast to use.",
                name: "Priya S.",
                role: "Marathon runner",
                stars: 5,
              },
              {
                quote: "The streak system is addictive in the best way. I haven't missed a workout in 6 weeks.",
                name: "Jordan K.",
                role: "CrossFit athlete",
                stars: 5,
              },
            ].map((t) => (
              <div key={t.name} className="bg-white/3 border border-white/8 rounded-2xl p-6">
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: t.stars }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-[#C8FF00] text-[#C8FF00]" />
                  ))}
                </div>
                <p className="text-white/70 text-sm leading-relaxed mb-4">&ldquo;{t.quote}&rdquo;</p>
                <div>
                  <div className="font-semibold text-sm">{t.name}</div>
                  <div className="text-white/30 text-xs">{t.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICING ── */}
      <section id="pricing" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-[#C8FF00] text-sm font-semibold uppercase tracking-widest mb-3">Simple pricing</p>
          <h2 className="text-4xl sm:text-5xl font-black tracking-tighter">Start free. Go PRO.</h2>
          <p className="text-white/40 mt-4">No hidden fees. Cancel anytime.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {/* Free */}
          <div className="bg-white/3 border border-white/8 rounded-2xl p-8">
            <div className="text-sm font-semibold text-white/40 uppercase tracking-widest mb-4">Free</div>
            <div className="text-5xl font-black mb-1">$0</div>
            <div className="text-white/30 text-sm mb-8">Forever free</div>
            <ul className="space-y-3 mb-8">
              {[
                "Workout logger",
                "Nutrition tracker",
                "Water tracker",
                "Last 7 days history",
                "Basic badges",
              ].map((f) => (
                <li key={f} className="flex items-center gap-3 text-sm text-white/60">
                  <CheckCircle className="w-4 h-4 text-white/20 shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
            <Link
              href="/signup"
              className="block text-center border border-white/10 text-white/70 font-semibold py-3 rounded-full hover:border-white/30 hover:text-white transition-all"
            >
              Get started free
            </Link>
          </div>

          {/* Pro */}
          <div className="relative bg-[#C8FF00] rounded-2xl p-8 text-black">
            <div className="absolute top-4 right-4 text-[10px] font-black bg-black text-[#C8FF00] rounded-full px-3 py-1 uppercase tracking-widest">
              Popular
            </div>
            <div className="text-sm font-semibold text-black/40 uppercase tracking-widest mb-4">Pro</div>
            <div className="text-5xl font-black mb-1">$4.99</div>
            <div className="text-black/40 text-sm mb-8">per month</div>
            <ul className="space-y-3 mb-8">
              {[
                "Everything in Free",
                "Unlimited history",
                "Advanced progress charts",
                "AI workout suggestions",
                "Priority badge unlocks",
                "Social feed access",
              ].map((f) => (
                <li key={f} className="flex items-center gap-3 text-sm text-black/70">
                  <CheckCircle className="w-4 h-4 text-black shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
            <Link
              href="/pricing"
              className="block text-center bg-black text-[#C8FF00] font-bold py-3 rounded-full hover:bg-black/80 transition-all"
            >
              Upgrade to Pro
            </Link>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="border-t border-white/5 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            <div className="col-span-2 md:col-span-1">
              <span className="text-xl font-black tracking-tighter">
                GOAT<span className="text-[#C8FF00]">.</span>
              </span>
              <p className="text-white/30 text-sm mt-3 leading-relaxed">
                The greatest fitness tracker ever built.
              </p>
            </div>
            {[
              { title: "Product", links: [["Features", "#features"], ["Pricing", "#pricing"], ["Dashboard", "/dashboard"]] },
              { title: "Account", links: [["Log in", "/login"], ["Sign up", "/signup"], ["Profile", "/profile"]] },
              { title: "Legal", links: [["Privacy", "#"], ["Terms", "#"]] },
            ].map((col) => (
              <div key={col.title}>
                <div className="text-xs font-semibold uppercase tracking-widest text-white/30 mb-4">{col.title}</div>
                <ul className="space-y-2 text-sm text-white/50">
                  {col.links.map(([label, href]) => (
                    <li key={label}>
                      <Link href={href} className="hover:text-white transition-colors">{label}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="border-t border-white/5 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-white/20 text-xs">© 2026 GOAT Fitness. All rights reserved.</p>
            <p className="text-white/20 text-xs">Built with Next.js + Supabase + Stripe</p>
          </div>
        </div>
      </footer>

    </main>
  );
}