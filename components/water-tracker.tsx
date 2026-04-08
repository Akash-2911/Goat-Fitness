"use client";

import { useMemo, useState } from "react";

export default function WaterTracker() {
  const [glasses, setGlasses] = useState(3);
  const [goal, setGoal] = useState(8);
  const [remindersOn, setRemindersOn] = useState(true);

  const percentage = useMemo(() => {
    if (goal <= 0) return 0;
    return Math.min((glasses / goal) * 100, 100);
  }, [glasses, goal]);

  const circumference = 2 * Math.PI * 54;
  const strokeDashoffset =
    circumference - (percentage / 100) * circumference;

  const addGlass = () => {
    setGlasses((prev) => prev + 1);
  };

  const removeGlass = () => {
    setGlasses((prev) => (prev > 0 ? prev - 1 : 0));
  };

  return (
    <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
      <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-[#C8FF00]">
              Daily Progress
            </p>
            <h2 className="mt-2 text-2xl font-black tracking-tight">
              Today’s Hydration
            </h2>
          </div>

          <div className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/70">
            Goal: {goal} glasses
          </div>
        </div>

        <div className="flex flex-col items-center justify-center">
          <div className="relative mb-6 h-64 w-64">
            <svg className="h-full w-full -rotate-90" viewBox="0 0 140 140">
              <circle
                cx="70"
                cy="70"
                r="54"
                stroke="rgba(255,255,255,0.10)"
                strokeWidth="12"
                fill="none"
              />
              <circle
                cx="70"
                cy="70"
                r="54"
                stroke="#C8FF00"
                strokeWidth="12"
                fill="none"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
              />
            </svg>

            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-4xl font-black tracking-tight">
                {glasses}
              </span>
              <span className="mt-1 text-sm text-white/60">glasses logged</span>
              <span className="mt-3 rounded-full bg-[#C8FF00] px-3 py-1 text-xs font-bold text-black">
                {Math.round(percentage)}% complete
              </span>
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-3">
            <button
              onClick={removeGlass}
              className="rounded-full border border-white/10 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              Remove
            </button>

            <button
              onClick={addGlass}
              className="rounded-full bg-[#C8FF00] px-6 py-3 text-sm font-bold text-black transition hover:scale-[1.02]"
            >
              Add Glass
            </button>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
          <p className="text-sm font-semibold uppercase tracking-widest text-[#C8FF00]">
            Goal Settings
          </p>

          <h3 className="mt-2 text-xl font-black tracking-tight">
            Set Daily Goal
          </h3>

          <p className="mt-2 text-sm text-white/60">
            Choose how many glasses of water you want to drink today.
          </p>

          <div className="mt-5">
            <label className="mb-2 block text-sm text-white/70">
              Daily water goal
            </label>
            <input
              type="number"
              min={1}
              value={goal}
              onChange={(e) => setGoal(Number(e.target.value))}
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none"
            />
          </div>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-widest text-[#C8FF00]">
                Reminder
              </p>
              <h3 className="mt-2 text-xl font-black tracking-tight">
                Hydration Reminder
              </h3>
              <p className="mt-2 text-sm text-white/60">
                Turn reminders on or off for daily water tracking.
              </p>
            </div>

            <button
              onClick={() => setRemindersOn((prev) => !prev)}
              className={`rounded-full px-5 py-3 text-sm font-bold transition ${
                remindersOn
                  ? "bg-[#C8FF00] text-black"
                  : "border border-white/10 bg-white/5 text-white/70"
              }`}
            >
              {remindersOn ? "On" : "Off"}
            </button>
          </div>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
          <p className="text-sm font-semibold uppercase tracking-widest text-[#C8FF00]">
            Summary
          </p>

          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-[#111318] p-4">
              <p className="text-sm text-white/50">Logged</p>
              <p className="mt-2 text-2xl font-black">{glasses}</p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-[#111318] p-4">
              <p className="text-sm text-white/50">Goal</p>
              <p className="mt-2 text-2xl font-black">{goal}</p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-[#111318] p-4">
              <p className="text-sm text-white/50">Remaining</p>
              <p className="mt-2 text-2xl font-black">
                {Math.max(goal - glasses, 0)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}