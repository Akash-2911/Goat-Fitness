interface StreakBadgeProps {
  streak: number;
  label?: string;
}

export default function StreakBadge({ streak, label = "Day Streak" }: StreakBadgeProps) { 
    return (
        <div className="flex item-center gap-3 bg-white/5 border border-white/8 rounded-2x1 px-5 py-3 w-fit">
            <span className="text-3x1">🔥</span>
            <div>
                <p className="text-[#C8FF00] font-black text-2xl tracking-tighter leading-none">{streak}</p>
                <p className="text-white/50 text-xs mt-0.5">{label}</p>
            </div>
        </div>
    );
}