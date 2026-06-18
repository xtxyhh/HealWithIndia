"use client";

import Link from "next/link";

import {

LayoutDashboard,

Users,

User,

Building2,

Calendar,

FileText,

DollarSign,

UserCog,

Settings,

LogOut,

Brain,

} from "lucide-react";

const menu = [

{

name:"Dashboard",

href:"/admin",

icon:LayoutDashboard,

},

{

name:"Leads",

href:"/admin/leads",

icon:Users,

},

{

name:"Patients",

href:"/admin/patient",

icon:User,

},

{

name:"Hospitals",

href:"/admin/hospitals",

icon:Building2,

},

{

name:"Followups",

href:"/admin/followups",

icon:Calendar,

},

{

name:"Documents",

href:"/admin/documents",

icon:FileText,

},

{

name:"Revenue",

href:"/admin/revenue",

icon:DollarSign,

},

{

name:"Employees",

href:"/admin/employees",

icon:UserCog,

},

{

name:"HealAI",

href:"/admin/ai",

icon:Brain,

},

{

name:"Settings",

href:"/admin/settings",

icon:Settings,

},

];

export default function Sidebar() {

return (

<div className="w-[280px] min-h-screen bg-slate-950 border-r border-slate-800 p-6 fixed left-0 top-0">

<h1 className="text-3xl font-bold text-white mb-2">

HealWithIndia

</h1>

<p className="text-slate-500 mb-10">

Medical Tourism CRM

</p>

<div className="space-y-3">

{

menu.map((item)=>{

const Icon = item.icon;

return(

<Link

key={item.href}

href={item.href}

className="flex items-center gap-4 px-5 py-4 rounded-2xl text-slate-300 hover:bg-slate-900 hover:text-white transition"

>

<Icon size={20}/>

<span>

{item.name}

</span>

</Link>

)

})

}

</div>

<button

className="mt-10 w-full bg-red-500/20 text-red-400 rounded-2xl py-4 flex items-center justify-center gap-3"

>

<LogOut size={18}/>

Logout

</button>

</div>

)

}