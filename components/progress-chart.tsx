"use client";

type ProgressChartProps = {
  title: string;
  data: {
    label: string;
    value: number;
  }[];
};

export default function ProgressChart({
  title,
  data,
}: ProgressChartProps) {
  const maxValue = Math.max(...data.map((item) => item.value), 1);
  const hasData = data.length > 0;

  return (
    <div
      className="
        rounded-2xl border border-white/10 bg-[#111318] p-6
        transition-all duration-200 hover:border-white/20 hover:bg-[#151920]
      "
    >
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-black tracking-tighter text-white">
          {title}
        </h2>

        <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-[#C8FF00]">
          Chart
        </span>
      </div>

      {!hasData ? (
        <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-sm text-white/50">
          No data available yet.
        </div>
      ) : (
        <div className="space-y-4">
          {data.map((item) => {
            const width = `${(item.value / maxValue) * 100}%`;

            return (
              <div
                key={item.label}
                className="rounded-xl border border-white/10 bg-white/5 p-4 transition-all duration-200 hover:bg-white/10"
              >
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span className="font-medium text-white/80">{item.label}</span>
                  <span className="font-bold text-white">{item.value}</span>
                </div>

                <div className="h-3 w-full overflow-hidden rounded-full bg-white/10">
                  <div
                    className="h-full rounded-full bg-[#C8FF00] transition-all duration-500"
                    style={{ width }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}