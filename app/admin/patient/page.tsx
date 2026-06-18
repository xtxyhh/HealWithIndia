import { createClient } from "@/lib/supabaseServer";
import { redirect } from "next/navigation";
import Link from "next/link";

import Topbar from "@/components/Topbar";

import {

Users,

Phone,

Search,

Eye,

Globe,

HeartPulse,

Plus,

} from "lucide-react";

export default async function PatientsPage() {

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

        <h1 className="text-3xl font-bold text-white">

          Failed to load patients

        </h1>

        <p className="text-red-400 mt-4">

          {error.message}

        </p>

      </main>

    );

  }

  return (

    <main className="p-10 text-white">

      <Topbar />



      <div className="flex justify-between items-center mb-10">

        <div>

          <p className="uppercase tracking-[4px] text-blue-400 text-sm font-semibold">

            Patients

          </p>



          <h1 className="text-5xl font-bold mt-3">

            International Patients

          </h1>



          <p className="text-slate-400 mt-3">

            Manage treatment progress and patient journey.

          </p>

        </div>



        <button

          className="bg-blue-600 hover:bg-blue-700 px-6 py-4 rounded-2xl flex items-center gap-3 transition"

        >

          <Plus size={20} />



          Add Patient

        </button>

      </div>



      <div className="relative mb-8">

        <Search

          size={18}

          className="absolute left-5 top-5 text-slate-500"

        />



        <input

          placeholder="Search patients..."

          className="w-full bg-slate-950 border border-slate-800 rounded-2xl pl-14 pr-5 py-4 text-white outline-none focus:border-blue-500"

        />

      </div>



      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">



        <div className="bg-slate-950 border border-slate-800 rounded-[28px] p-7">

          <Users

            size={34}

            className="text-blue-400"

          />



          <p className="text-slate-400 mt-6">

            Total Patients

          </p>



          <h2 className="text-5xl font-bold mt-2">

            {patients?.length || 0}

          </h2>

        </div>



        <div className="bg-slate-950 border border-slate-800 rounded-[28px] p-7">

          <HeartPulse

            size={34}

            className="text-red-400"

          />



          <p className="text-slate-400 mt-6">

            Treatments

          </p>



          <h2 className="text-5xl font-bold mt-2">

            {

              new Set(

                patients?.map(

                  p => p.treatment

                )

              ).size

            }

          </h2>

        </div>



        <div className="bg-slate-950 border border-slate-800 rounded-[28px] p-7">

          <Globe

            size={34}

            className="text-green-400"

          />



          <p className="text-slate-400 mt-6">

            Countries

          </p>



          <h2 className="text-5xl font-bold mt-2">

            {

              new Set(

                patients?.map(

                  p => p.country

                )

              ).size

            }

          </h2>

        </div>



        <div className="bg-slate-950 border border-slate-800 rounded-[28px] p-7">

          <Phone

            size={34}

            className="text-cyan-400"

          />



          <p className="text-slate-400 mt-6">

            Contacted

          </p>



          <h2 className="text-5xl font-bold mt-2">

            {

              patients?.filter(

                p =>

                p.status==="Contacted"

              ).length || 0

            }

          </h2>

        </div>



      </div>



      <div className="bg-slate-950 border border-slate-800 rounded-[32px] overflow-hidden">

        {

          patients?.length===0

          ?

          (

            <div className="text-center py-24">

              <Users

                size={70}

                className="mx-auto text-slate-700"

              />



              <h2 className="text-3xl font-bold mt-8">

                No Patients Found

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

                      Status

                    </th>



                    <th className="text-left px-6 py-5">

                      Phone

                    </th>



                    <th className="text-left px-6 py-5">

                      Action

                    </th>

                  </tr>

                </thead>



                <tbody>

                  {

                    patients.map((patient)=>(

                      <tr

                        key={patient.id}

                        className="border-b border-slate-800 hover:bg-slate-900/50"

                      >

                        <td className="px-6 py-5">

                          <div>

                            <h3 className="font-semibold">

                              {

                                patient.full_name ||

                                "Unknown"

                              }

                            </h3>



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



                        <td className="px-6 py-5">

                          <span

                            className="px-4 py-2 rounded-full bg-blue-500/20 text-blue-400 text-sm"

                          >

                            {

                              patient.status ||

                              "New"

                            }

                          </span>

                        </td>



                        <td className="px-6 py-5">

                          {

                            patient.phone ||

                            "-"

                          }

                        </td>



                        <td className="px-6 py-5">

                          <Link

                            href={`/admin/patient/${patient.id}`}

                            className="bg-slate-800 hover:bg-slate-700 p-3 rounded-xl inline-flex"

                          >

                            <Eye size={18}/>

                          </Link>

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