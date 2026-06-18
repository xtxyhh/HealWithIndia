export const metadata = {
  title: "Healthcare Blog | HealWithIndia",
  description:
    "Read articles about medical tourism in India, treatment costs, hospitals and patient success stories.",
};

const posts = [
  {
    title: "Why Thousands Choose India For Medical Treatment",
    category: "Medical Tourism",
    date: "June 2026",
    description:
      "Discover why India is becoming the preferred healthcare destination for international patients.",
  },

  {
    title: "Heart Surgery Costs In India vs USA",
    category: "Cardiology",
    date: "June 2026",
    description:
      "Compare treatment costs and understand how patients save up to 90% on cardiac procedures.",
  },

  {
    title: "Top Hospitals In India For International Patients",
    category: "Hospitals",
    date: "May 2026",
    description:
      "Explore India's leading hospitals offering world-class healthcare at affordable prices.",
  },

  {
    title: "Complete Guide To IVF Treatment In India",
    category: "IVF",
    date: "May 2026",
    description:
      "Everything you need to know about IVF success rates, costs and top fertility hospitals.",
  },

  {
    title: "Medical Visa For India: Step By Step Guide",
    category: "Travel",
    date: "April 2026",
    description:
      "Learn how to apply for a medical visa and prepare for treatment in India.",
  },

  {
    title: "Kidney Transplant In India: Cost And Recovery",
    category: "Transplant",
    date: "April 2026",
    description:
      "A complete guide covering transplant costs, hospitals and recovery timelines.",
  },
];

export default function BlogPage() {
  return (
    <main className="min-h-screen bg-black text-white">

      <section className="bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 py-24">

        <div className="max-w-7xl mx-auto px-4 text-center">

          <span className="text-blue-400 uppercase tracking-widest font-semibold">

            HealWithIndia Blog

          </span>

          <h1 className="text-5xl lg:text-7xl font-bold mt-6">

            Healthcare Insights

            <br />

            For International Patients

          </h1>

          <p className="max-w-3xl mx-auto mt-8 text-slate-300 text-xl">

            Expert articles about treatments, hospitals,
            medical tourism and healthcare in India.

          </p>

        </div>

      </section>

      <section className="py-24">

        <div className="max-w-7xl mx-auto px-4">

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">

            {posts.map((post) => (

              <article
                key={post.title}
                className="bg-slate-950 border border-slate-800 rounded-3xl p-8 hover:border-blue-500 transition-all hover:-translate-y-2"
              >

                <span className="bg-blue-500/20 text-blue-400 px-4 py-2 rounded-full text-sm">

                  {post.category}

                </span>

                <p className="text-slate-500 mt-5">

                  {post.date}

                </p>

                <h2 className="text-2xl font-bold mt-4">

                  {post.title}

                </h2>

                <p className="text-slate-400 mt-5 leading-relaxed">

                  {post.description}

                </p>

                <button className="mt-8 text-blue-400 font-semibold">

                  Read More →

                </button>

              </article>

            ))}

          </div>

        </div>

      </section>

    </main>
  );
}