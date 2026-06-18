import { createClient } from "@/lib/supabaseServer";
import { redirect } from "next/navigation";
import Link from "next/link";

import {

Users,

Search,

Phone,

Mail,

Eye,

DollarSign,

Calendar,

FileText,

} from "lucide-react";

import Topbar from "@/components/Topbar";
import StatusDropdown from "@/components/StatusDropdown";

export default async function LeadsPage() {

const supabase = await createClient();

const {

data:{user},

} = await supabase.auth.getUser();

if(!user){

redirect("/login");

}

const {

data:patients,

error,

} = await supabase

.from("patients")

.select("*")

.order("created_at",{

ascending:false,

});

if(error){

return(

<main className="p-10">

<h1 className="text-white text-3xl font-bold">

Failed to load leads

</h1>

<p className="text-red-400 mt-3">

{error.message}

</p>

</main>

)

}

const totalLeads = patients?.length || 0;

const newLeads =

patients?.filter(

p=>

(p.status || "New")==="New"

).length || 0;

const contactedLeads =

patients?.filter(

p=>

p.status==="Contacted"

).length || 0;

const convertedLeads =

patients?.filter(

p=>

p.status==="Converted"

).length || 0;

return(

<main className="p-10 text-white">

<Topbar/>

<div className="mb-10">

<p className="uppercase tracking-[4px] text-blue-400 text-sm font-semibold">

Leads Management

</p>

<h1 className="text-5xl font-bold mt-3">

Patient Leads

</h1>

<p className="text-slate-400 mt-3">

Manage consultation requests and patient conversions.

</p>

</div>



<div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">

<div className="bg-slate-950 border border-slate-800 rounded-[28px] p-7">

<Users

className="text-blue-400"

size={32}

/>

<p className="text-slate-400 mt-5">

Total Leads

</p>

<h2 className="text-5xl font-bold mt-2">

{totalLeads}

</h2>

</div>



<div className="bg-slate-950 border border-slate-800 rounded-[28px] p-7">

<p className="text-slate-400">

New Leads

</p>

<h2 className="text-5xl font-bold text-green-400 mt-6">

{newLeads}

</h2>

</div>



<div className="bg-slate-950 border border-slate-800 rounded-[28px] p-7">

<p className="text-slate-400">

Contacted

</p>

<h2 className="text-5xl font-bold text-cyan-400 mt-6">

{contactedLeads}

</h2>

</div>



<div className="bg-slate-950 border border-slate-800 rounded-[28px] p-7">

<p className="text-slate-400">

Converted

</p>

<h2 className="text-5xl font-bold text-purple-400 mt-6">

{convertedLeads}

</h2>

</div>

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



<div className="bg-slate-950 border border-slate-800 rounded-[32px] overflow-hidden">

{

patients?.length===0

?

(

<div className="py-24 text-center">

<Users

size={70}

className="mx-auto text-slate-700"

/>

<h2 className="text-3xl font-bold mt-8">

No Leads Yet

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

Revenue

</th>

<th className="text-left px-6 py-5">

Created

</th>

<th className="text-left px-6 py-5">

Report

</th>

<th className="text-left px-6 py-5">

Status

</th>

<th className="text-left px-6 py-5">

Actions

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



<td className="px-6 py-5">

<div className="flex items-center gap-2 text-green-400 font-semibold">

<DollarSign size={16}/>

{

patient.estimated_revenue ||

0

}

</div>

</td>



<td className="px-6 py-5 text-slate-400">

<div className="flex items-center gap-2">

<Calendar size={15}/>

{

patient.created_at

?

new Date(

patient.created_at

)

.toLocaleDateString()

:

"-"

}

</div>

</td>



<td className="px-6 py-5">

{

patient.report_url

?

(

<a

href={patient.report_url}

target="_blank"

className="bg-green-500/20 text-green-400 px-4 py-2 rounded-xl"

>

<FileText size={16}/>

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



<td className="px-6 py-5">

<div className="flex gap-3">

<a

href={`mailto:${patient.email}`}

className="bg-blue-500/20 text-blue-400 p-3 rounded-xl"

>

<Mail size={18}/>

</a>



<a

href={`https://wa.me/${patient.phone || ""}`}

target="_blank"

className="bg-green-500/20 text-green-400 p-3 rounded-xl"

>

<Phone size={18}/>

</a>



<Link

href={`/admin/patient/${patient.id}`}

className="bg-slate-800 text-white p-3 rounded-xl"

>

<Eye size={18}/>

</Link>

</div>

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

)

}