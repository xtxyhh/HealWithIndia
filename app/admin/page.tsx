import { createClient } from "@/lib/supabaseServer";
import { redirect } from "next/navigation";
import Link from "next/link";

import Topbar from "@/components/Topbar";
import StatsCard from "@/components/StatsCard";
import RevenueChart from "@/components/RevenueChart";
import CountryChart from "@/components/CountryChart";
import ActivityTimeline from "@/components/ActivityTimeline";
import StatusDropdown from "@/components/StatusDropdown";

import {
  Users,
  UserPlus,
  PhoneCall,
  DollarSign,
  FileText,
  Plus,
  Building2,
  Calendar,
} from "lucide-react";

export default async function AdminPage() {

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {

    redirect("/login");

  }

  const {

    data: patients,

    error,

  } = await supabase

    .from("patients")

    .select("*")

    .order("created_at", {

      ascending: false,

    });

  if (error) {

    return (

      <main className="p-10">

        <h1 className="text-4xl font-bold text-white">

          Failed to load dashboard

        </h1>

        <p className="text-red-400 mt-4">

          {error.message}

        </p>

      </main>

    );

  }

  const totalLeads = patients?.length || 0;

  const newLeads =

    patients?.filter(

      (p) =>

        (p.status || "New") === "New"

    ).length || 0;

  const contactedLeads =

    patients?.filter(

      (p) =>

        p.status === "Contacted"

    ).length || 0;

  const convertedLeads =

    patients?.filter(

      (p) =>

        p.status === "Converted"

    ).length || 0;

  const totalRevenue =

    patients?.reduce(

      (sum, p) =>

        sum +

        Number(

          p.estimated_revenue || 0

        ),

      0

    ) || 0;

  return (

    <main className="p-10 text-white">

      <Topbar />



      {/* STATS */}



      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-6 mb-10">

        <StatsCard

          title="Total Leads"

          value={totalLeads}

          icon={Users}

          color="text-blue-400"

        />



        <StatsCard

          title="New Leads"

          value={newLeads}

          icon={UserPlus}

          color="text-green-400"

        />



        <StatsCard

          title="Contacted"

          value={contactedLeads}

          icon={PhoneCall}

          color="text-cyan-400"

        />



        <StatsCard

          title="Converted"

          value={convertedLeads}

          icon={UserPlus}

          color="text-purple-400"

        />



        <StatsCard

          title="Revenue"

          value={`$${totalRevenue.toLocaleString()}`}

          icon={DollarSign}

          color="text-yellow-400"

        />

      </div>



      {/* CHARTS */}



      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mb-10">

        <RevenueChart />

        <CountryChart />

      </div>



      {/* ACTIVITY + ACTIONS */}



      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mb-10">

        <ActivityTimeline />



        <div className="bg-slate-950 border border-slate-800 rounded-[32px] p-8">

          <h2 className="text-2xl font-bold mb-8">

            Quick Actions

          </h2>



          <div className="grid grid-cols-2 gap-5">



            <button

              className="bg-blue-600 hover:bg-blue-700 rounded-2xl p-6 transition"

            >

              <Plus className="mx-auto mb-3" />



              Add Lead

            </button>



            <button

              className="bg-green-600 hover:bg-green-700 rounded-2xl p-6 transition"

            >

              <Building2 className="mx-auto mb-3" />



              Add Hospital

            </button>



            <button

              className="bg-purple-600 hover:bg-purple-700 rounded-2xl p-6 transition"

            >

              <Calendar className="mx-auto mb-3" />



              Follow Up

            </button>



            <button

              className="bg-cyan-600 hover:bg-cyan-700 rounded-2xl p-6 transition"

            >

              <FileText className="mx-auto mb-3" />



              Upload Report

            </button>



          </div>

        </div>

      </div>



      {/* RECENT LEADS TABLE */}



      <div className="bg-slate-950 border border-slate-800 rounded-[32px] overflow-hidden">

        <div className="flex justify-between items-center px-8 py-7 border-b border-slate-800">

          <h2 className="text-2xl font-bold">

            Recent Patients

          </h2>



          <Link

            href="/admin/leads"

            className="text-blue-400 hover:text-blue-300"

          >

            View All →

          </Link>

        </div>



        {

          patients?.length === 0

          ?

          (

            <div className="text-center py-20">

              <Users

                size={70}

                className="mx-auto text-slate-700"

              />



              <h2 className="text-2xl font-bold mt-8">

                No Patients Yet

              </h2>



              <p className="text-slate-400 mt-3">

                Consultation requests will appear here.

              </p>

            </div>

          )

          :

          (

            <div className="overflow-x-auto">

              <table className="w-full">

                <thead className="bg-slate-900">

                  <tr>

                    <th className="text-left px-6 py-5">

                      Patient

                    </th>



                    <th className="text-left px-6 py-5">

                      Country

                    </th>



                    <th className="text-left px-6 py-5">

                      Treatment

                    </th>



                    <th className="text-left px-6 py-5">

                      Hospital

                    </th>



                    <th className="text-left px-6 py-5">

                      Revenue

                    </th>



                    <th className="text-left px-6 py-5">

                      Report

                    </th>



                    <th className="text-left px-6 py-5">

                      Status

                    </th>

                  </tr>

                </thead>



                <tbody>

                  {

                    patients.map((patient) => (

                      <tr

                        key={patient.id}

                        className="border-b border-slate-800 hover:bg-slate-900/50"

                      >

                        <td className="px-6 py-5">

                          <div>

                            <Link

                              href={`/admin/patient/${patient.id}`}

                              className="font-semibold hover:text-blue-400"

                            >

                              {

                                patient.full_name ||

                                "Unknown"

                              }

                            </Link>



                            <p className="text-slate-500 text-sm mt-1">

                              {patient.email}

                            </p>

                          </div>

                        </td>



                        <td className="px-6 py-5 text-slate-300">

                          {patient.country}

                        </td>



                        <td className="px-6 py-5 text-slate-300">

                          {patient.treatment}

                        </td>



                        <td className="px-6 py-5 text-slate-300">

                          {

                            patient.assigned_hospital ||

                            "Unassigned"

                          }

                        </td>



                        <td className="px-6 py-5 text-green-400 font-semibold">

                          $

                          {

                            patient.estimated_revenue ||

                            0

                          }

                        </td>



                        <td className="px-6 py-5">

                          {

                            patient.report_url

                            ?

                            (

                              <a

                                href={patient.report_url}

                                target="_blank"

                                rel="noopener noreferrer"

                                className="bg-green-500/20 text-green-400 px-4 py-2 rounded-xl"

                              >

                                View

                              </a>

                            )

                            :

                            (

                              <span className="text-slate-500">

                                No File

                              </span>

                            )

                          }

                        </td>



                        <td className="px-6 py-5">

                          <StatusDropdown

                            patientId={patient.id}

                            currentStatus={

                              patient.status ||

                              "New"

                            }

                          />

                        </td>

                      </tr>

                    ))

                  }

                </tbody>

              </table>

            </div>

          )

        }

      </div>

    </main>

  );

}