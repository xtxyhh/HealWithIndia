"use client";

import {

Bell,

Search,

Settings,

} from "lucide-react";

export default function Topbar(){

return(

<div className="flex justify-between items-center mb-10">

<div>

<h1 className="text-5xl font-bold text-white">

HealWithIndia CRM

</h1>

<p className="text-slate-400 mt-3">

Manage leads, patients and revenue.

</p>

</div>

<div className="flex items-center gap-5">

<div className="relative">

<Search

className="absolute left-4 top-4 text-slate-500"

size={18}

/>

<input

placeholder="Search..."

className="bg-slate-950 border border-slate-800 rounded-2xl pl-12 pr-5 py-4 w-[300px] text-white outline-none focus:border-blue-500"

/>

</div>

<button

className="bg-slate-950 border border-slate-800 p-4 rounded-2xl"

>

<Bell className="text-white"/>

</button>

<button

className="bg-slate-950 border border-slate-800 p-4 rounded-2xl"

>

<Settings className="text-white"/>

</button>

<div

className="h-12 w-12 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold"

>

T

</div>

</div>

</div>

)

}