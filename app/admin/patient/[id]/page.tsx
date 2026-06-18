import { createClient } from "@/lib/supabaseServer";
import { redirect } from "next/navigation";
import Link from "next/link";

import {

Mail,

Phone,

Globe,

HeartPulse,

Hospital,

DollarSign,

FileText,

ArrowLeft,

Calendar,

} from "lucide-react";

export default async function PatientPage({

params,

}:{

params:Promise<{id:string}>

}){

const {id}=await params;

const supabase=await createClient();

const {

data:{user},

}=await supabase.auth.getUser();

if(!user){

redirect("/login");

}

const {

data:patient,

error,

}=await supabase

.from("patients")

.select("*")

.eq("id",id)

.single();

if(error || !patient){

return(

<main className="min-h-screen flex items-center justify-center bg-black text-white">

<div className="text-center">

<h1 className="text-5xl font-bold">

Patient Not Found

</h1>

<p className="text-slate-400 mt-5">

The requested patient does not exist.

</p>

<Link

href="/admin/patient"

className="inline-block mt-8 bg-blue-600 px-6 py-3 rounded-xl"

>

Go Back

</Link>

</div>

</main>

)

}

return(

<main className="p-10 text-white">

<div className="flex items-center gap-4 mb-10">

<Link

href="/admin/patient"

className="bg-slate-900 border border-slate-800 p-4 rounded-2xl"

>

<ArrowLeft/>

</Link>

<div>

<p className="uppercase tracking-[4px] text-blue-400 text-sm">

Patient Profile

</p>

<h1 className="text-5xl font-bold mt-2">

{patient.full_name}

</h1>

</div>

</div>



<div className="grid grid-cols-1 xl:grid-cols-3 gap-8">



<div className="bg-slate-950 border border-slate-800 rounded-[32px] p-8 h-fit">

<div className="w-28 h-28 rounded-full bg-blue-600 flex items-center justify-center text-5xl font-bold mx-auto">

{

patient.full_name

?.charAt(0)

?.toUpperCase()

}

</div>



<h2 className="text-center text-3xl font-bold mt-6">

{patient.full_name}

</h2>



<p className="text-center text-slate-400 mt-2">

{patient.country}

</p>



<div className="space-y-5 mt-10">



<div className="flex items-center gap-4">

<Mail

className="text-blue-400"

/>

<p>

{patient.email}

</p>

</div>



<div className="flex items-center gap-4">

<Phone

className="text-green-400"

/>

<p>

{

patient.phone ||

"Not Provided"

}

</p>

</div>



<div className="flex items-center gap-4">

<Globe

className="text-cyan-400"

/>

<p>

{patient.country}

</p>

</div>



<div className="flex items-center gap-4">

<HeartPulse

className="text-red-400"

/>

<p>

{patient.treatment}

</p>

</div>



<div className="flex items-center gap-4">

<Hospital

className="text-purple-400"

/>

<p>

{

patient.assigned_hospital ||

"Not Assigned"

}

</p>

</div>



<div className="flex items-center gap-4">

<DollarSign

className="text-yellow-400"

/>

<p>

$

{

patient.estimated_revenue ||

0

}

</p>

</div>



<div className="flex items-center gap-4">

<Calendar

className="text-orange-400"

/>

<p>

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

</p>

</div>

</div>



<div className="flex gap-4 mt-10">



<a

href={`mailto:${patient.email}`}

className="flex-1 bg-blue-600 hover:bg-blue-700 py-4 rounded-2xl text-center"

>

Email

</a>



{

patient.phone &&

<a

href={`https://wa.me/${patient.phone}`}

target="_blank"

className="flex-1 bg-green-600 hover:bg-green-700 py-4 rounded-2xl text-center"

>

Whatsapp

</a>

}



</div>

</div>





<div className="xl:col-span-2 space-y-8">



<div className="bg-slate-950 border border-slate-800 rounded-[32px] p-8">

<h2 className="text-3xl font-bold mb-8">

Treatment Details

</h2>



<div className="grid md:grid-cols-2 gap-8">



<div>

<p className="text-slate-400">

Treatment

</p>

<p className="text-2xl font-semibold mt-2">

{

patient.treatment ||

"-"

}

</p>

</div>



<div>

<p className="text-slate-400">

Status

</p>

<div className="mt-3">

<span className="bg-blue-500/20 text-blue-400 px-5 py-2 rounded-full">

{

patient.status ||

"New"

}

</span>

</div>

</div>



<div>

<p className="text-slate-400">

Hospital

</p>

<p className="text-2xl font-semibold mt-2">

{

patient.assigned_hospital ||

"Unassigned"

}

</p>

</div>



<div>

<p className="text-slate-400">

Revenue

</p>

<p className="text-2xl font-semibold mt-2 text-green-400">

$

{

patient.estimated_revenue ||

0

}

</p>

</div>

</div>

</div>





<div className="bg-slate-950 border border-slate-800 rounded-[32px] p-8">

<h2 className="text-3xl font-bold mb-8">

Description

</h2>



<div className="bg-slate-900 p-6 rounded-2xl text-slate-300 leading-relaxed">

{

patient.description ||

"No description"

}

</div>

</div>





<div className="bg-slate-950 border border-slate-800 rounded-[32px] p-8">

<h2 className="text-3xl font-bold mb-8">

Medical Reports

</h2>



{

patient.report_url

?

(

<a

href={patient.report_url}

target="_blank"

className="bg-green-500/20 text-green-400 px-6 py-4 rounded-2xl inline-flex gap-3"

>

<FileText/>

View Medical Report

</a>

)

:

(

<div className="text-slate-500">

No reports uploaded.

</div>

)

}

</div>





<div className="bg-slate-950 border border-slate-800 rounded-[32px] p-8">

<h2 className="text-3xl font-bold mb-8">

Internal Notes

</h2>



<div className="bg-slate-900 rounded-2xl p-6 min-h-[150px] text-slate-300">

{

patient.notes ||

"No notes added yet."

}

</div>

</div>



</div>

</div>

</main>

)

}