import {
  FileText,
  Download,
  Eye,
  Search,
  Upload,
  ShieldCheck,
} from "lucide-react";

const documents = [

  {
    patient: "John Smith",
    country: "USA",
    treatment: "Cardiology",
    file: "heart-report.pdf",
    uploaded: "15 Jun 2026",
    size: "2.4 MB",
  },

  {
    patient: "Sarah Johnson",
    country: "UK",
    treatment: "IVF Treatment",
    file: "ivf-reports.pdf",
    uploaded: "14 Jun 2026",
    size: "5.1 MB",
  },

  {
    patient: "Ahmed Ali",
    country: "UAE",
    treatment: "Kidney Transplant",
    file: "kidney-scan.pdf",
    uploaded: "12 Jun 2026",
    size: "3.8 MB",
  },

];

export default function DocumentsPage() {

  return (

    <main className="min-h-screen bg-black text-white">

      <div className="max-w-7xl mx-auto px-6 py-12">

        {/* HEADER */}

        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8 mb-12">

          <div>

            <p className="uppercase tracking-[4px] text-blue-400 text-sm font-semibold">

              Admin Dashboard

            </p>

            <h1 className="text-5xl font-bold mt-3">

              Medical Documents

            </h1>

            <p className="text-slate-400 mt-3">

              Securely manage uploaded patient reports and files.

            </p>

          </div>


          <button className="inline-flex items-center gap-3 bg-blue-600 hover:bg-blue-700 px-6 py-4 rounded-2xl font-semibold transition">

            <Upload size={20} />

            Upload Document

          </button>

        </div>



        {/* STATS */}

        <div className="grid md:grid-cols-3 gap-6 mb-12">

          <div className="bg-slate-950 border border-slate-800 rounded-[28px] p-7">

            <FileText

              className="text-blue-400"

              size={34}

            />

            <p className="text-slate-400 mt-6">

              Total Documents

            </p>

            <h2 className="text-5xl font-bold mt-2">

              154

            </h2>

          </div>



          <div className="bg-slate-950 border border-slate-800 rounded-[28px] p-7">

            <ShieldCheck

              className="text-green-400"

              size={34}

            />

            <p className="text-slate-400 mt-6">

              Secure Storage

            </p>

            <h2 className="text-4xl font-bold mt-2">

              Enabled

            </h2>

          </div>



          <div className="bg-slate-950 border border-slate-800 rounded-[28px] p-7">

            <Upload

              className="text-cyan-400"

              size={34}

            />

            <p className="text-slate-400 mt-6">

              Storage Used

            </p>

            <h2 className="text-4xl font-bold mt-2">

              1.2 GB

            </h2>

          </div>

        </div>



        {/* SEARCH */}

        <div className="relative mb-8">

          <Search

            className="absolute left-4 top-4 text-slate-500"

            size={18}

          />

          <input

            placeholder="Search documents..."

            className="w-full bg-slate-950 border border-slate-800 rounded-2xl pl-12 pr-5 py-4 text-white outline-none focus:border-blue-500"

          />

        </div>



        {/* TABLE */}

        <div className="bg-slate-950 border border-slate-800 rounded-[32px] overflow-hidden">

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

                    File

                  </th>

                  <th className="text-left px-6 py-5">

                    Uploaded

                  </th>

                  <th className="text-left px-6 py-5">

                    Size

                  </th>

                  <th className="text-left px-6 py-5">

                    Actions

                  </th>

                </tr>

              </thead>


              <tbody>

                {

                  documents.map((doc)=>(

                    <tr

                      key={doc.file}

                      className="border-b border-slate-800 hover:bg-slate-900/50"

                    >

                      <td className="px-6 py-5 font-semibold">

                        {doc.patient}

                      </td>

                      <td className="px-6 py-5 text-slate-300">

                        {doc.country}

                      </td>

                      <td className="px-6 py-5 text-slate-300">

                        {doc.treatment}

                      </td>

                      <td className="px-6 py-5">

                        <div className="flex items-center gap-3">

                          <FileText

                            size={18}

                            className="text-blue-400"

                          />

                          {doc.file}

                        </div>

                      </td>

                      <td className="px-6 py-5 text-slate-300">

                        {doc.uploaded}

                      </td>

                      <td className="px-6 py-5 text-slate-300">

                        {doc.size}

                      </td>

                      <td className="px-6 py-5">

                        <div className="flex gap-3">

                          <button className="bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 p-3 rounded-xl transition">

                            <Eye size={18} />

                          </button>

                          <button className="bg-green-500/20 hover:bg-green-500/30 text-green-400 p-3 rounded-xl transition">

                            <Download size={18} />

                          </button>

                        </div>

                      </td>

                    </tr>

                  ))

                }

              </tbody>

            </table>

          </div>

        </div>

      </div>

    </main>

  );

}