import Link from "next/link";
import {
  Users,
  UserPlus,
  PhoneCall,
  DollarSign,
  FileText,
  Building2,
  ArrowRight,
  Activity,
} from "lucide-react";

const stats = [
  {
    title: "Total Leads",
    value: "128",
    icon: Users,
    color: "text-blue-400",
  },

  {
    title: "New This Month",
    value: "24",
    icon: UserPlus,
    color: "text-green-400",
  },

  {
    title: "Consultations",
    value: "89",
    icon: PhoneCall,
    color: "text-cyan-400",
  },

  {
    title: "Revenue",
    value: "$48K",
    icon: DollarSign,
    color: "text-yellow-400",
  },
];

const activities = [
  {
    title: "New patient from USA",
    desc: "Cardiology consultation submitted",
    time: "5 min ago",
  },

  {
    title: "Hospital assigned",
    desc: "Apollo Hospital assigned to patient",
    time: "30 min ago",
  },

  {
    title: "Medical reports uploaded",
    desc: "Kidney transplant case documents",
    time: "1 hour ago",
  },

  {
    title: "Follow-up scheduled",
    desc: "Patient from UAE",
    time: "3 hours ago",
  },
];

const quickLinks = [
  {
    title: "Manage Leads",
    href: "/admin/leads",
    icon: Users,
  },

  {
    title: "Documents",
    href: "/admin/documents",
    icon: FileText,
  },

  {
    title: "Hospitals",
    href: "/admin/hospitals",
    icon: Building2,
  },

  {
    title: "Follow Ups",
    href: "/admin/followups",
    icon: Activity,
  },
];

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-black text-white p-8">

      <div className="mb-12">

        <p className="uppercase tracking-[4px] text-blue-400 text-sm">

          HealWithIndia

        </p>

        <h1 className="text-5xl font-bold mt-3">

          Dashboard

        </h1>

        <p className="text-slate-400 mt-4">

          Monitor leads, patients, hospitals and revenue.

        </p>

      </div>



      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">

        {stats.map((item) => {

          const Icon = item.icon;

          return (

            <div
              key={item.title}
              className="bg-slate-950 border border-slate-800 rounded-3xl p-7"
            >

              <div className="flex justify-between items-start">

                <div>

                  <p className="text-slate-400">

                    {item.title}

                  </p>

                  <h2 className="text-4xl font-bold mt-4">

                    {item.value}

                  </h2>

                </div>

                <Icon
                  size={34}
                  className={item.color}
                />

              </div>

            </div>

          );

        })}

      </div>



      <div className="grid lg:grid-cols-3 gap-8 mt-12">

        <div className="lg:col-span-2 bg-slate-950 border border-slate-800 rounded-3xl p-8">

          <h2 className="text-2xl font-bold">

            Recent Activities

          </h2>

          <div className="mt-8 space-y-6">

            {activities.map((item) => (

              <div
                key={item.title}
                className="border-b border-slate-800 pb-6"
              >

                <h3 className="font-semibold text-lg">

                  {item.title}

                </h3>

                <p className="text-slate-400 mt-2">

                  {item.desc}

                </p>

                <p className="text-sm text-slate-500 mt-2">

                  {item.time}

                </p>

              </div>

            ))}

          </div>

        </div>



        <div className="bg-slate-950 border border-slate-800 rounded-3xl p-8">

          <h2 className="text-2xl font-bold">

            Quick Access

          </h2>

          <div className="mt-8 space-y-4">

            {quickLinks.map((item) => {

              const Icon = item.icon;

              return (

                <Link
                  key={item.title}
                  href={item.href}
                  className="flex items-center justify-between bg-slate-900 border border-slate-800 rounded-2xl p-5 hover:border-blue-500 transition"
                >

                  <div className="flex items-center gap-4">

                    <Icon
                      size={24}
                      className="text-blue-400"
                    />

                    <span className="font-medium">

                      {item.title}

                    </span>

                  </div>

                  <ArrowRight
                    size={20}
                    className="text-slate-500"
                  />

                </Link>

              );

            })}

          </div>

        </div>

      </div>

    </main>
  );
}