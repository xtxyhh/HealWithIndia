const stats = [
  { value: "50+", label: "Partner Hospitals", accent: "text-blue-400" },
  { value: "20+", label: "Specialties", accent: "text-cyan-400" },
  { value: "90%", label: "Cost Savings", accent: "text-green-400" },
  { value: "24/7", label: "Patient Support", accent: "text-purple-400" },
];

export default function Stats() {
  return (
    <section className="bg-[#020615] text-white py-24">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 text-center">
          {stats.map((stat) => (
            <div key={stat.label} className="glass-strong rounded-[32px] border border-slate-800 p-8 card-hover">
              <div className="flex h-16 w-16 items-center justify-center mx-auto rounded-full bg-slate-900/80 shadow-inner">
                <span className={`text-3xl font-semibold ${stat.accent}`}>{stat.value}</span>
              </div>
              <p className="mt-4 text-slate-300 text-lg">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
