import { createClient } from "@/lib/supabaseServer";

import Link from "next/link";

import {

Users,

Plus,

Mail,

Phone,

Shield,

} from "lucide-react";

export default async function EmployeesPage(){

const supabase = await createClient();

const {

data: employees,

error,

} = await supabase

.from("employees")

.select("*")

.order("created_at",{

ascending:false,

});

if(error){

return(

<div className="min-h-screen bg-black text-white flex items-center justify-center">

<div>

<h1 className="text-4xl font-bold">

Failed To Load Employees

</h1>

<p className="text-slate-400 mt-3">

{error.message}

</p>

</div>

</div>

);

}

return(

<main className="min-h-screen bg-black text-white">

<div className="max-w-7xl mx-auto px-6 py-12">

<div className="flex justify-between items-center mb-12">

<div>

<p className="uppercase tracking-[4px] text-blue-400 text-sm">

Team Management

</p>

<h1 className="text-5xl font-bold mt-3">

Employees

</h1>

<p className="text-slate-400 mt-4">

Manage staff accounts and roles.

</p>

</div>

<Link

href="/admin/employees/add"

className="bg-blue-600 hover:bg-blue-700 px-6 py-4 rounded-2xl font-semibold flex items-center gap-3"

>

<Plus size={20}/>

Add Employee

</Link>

</div>



<div className="grid md:grid-cols-3 gap-6 mb-12">

<div className="bg-slate-950 border border-slate-800 rounded-[32px] p-8">

<Users

size={34}

className="text-blue-400"

/>

<p className="text-slate-400 mt-6">

Total Employees

</p>

<h2 className="text-5xl font-bold mt-3">

{employees?.length || 0}

</h2>

</div>



<div className="bg-slate-950 border border-slate-800 rounded-[32px] p-8">

<Shield

size={34}

className="text-green-400"

/>

<p className="text-slate-400 mt-6">

Admins

</p>

<h2 className="text-5xl font-bold mt-3">

{

employees?.filter(

e=>e.role==="Admin"

).length || 0

}

</h2>

</div>



<div className="bg-slate-950 border border-slate-800 rounded-[32px] p-8">

<Users

size={34}

className="text-purple-400"

/>

<p className="text-slate-400 mt-6">

Executives

</p>

<h2 className="text-5xl font-bold mt-3">

{

employees?.filter(

e=>e.role==="Sales Executive"

).length || 0

}

</h2>

</div>

</div>





<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">

{

employees?.map((employee)=>(

<div

key={employee.id}

className="bg-slate-950 border border-slate-800 rounded-[32px] p-8"

>

<div className="w-20 h-20 rounded-full bg-blue-500/10 flex items-center justify-center text-3xl font-bold">

{

employee.name?.charAt(0)

}

</div>

<h2 className="text-3xl font-bold mt-8">

{employee.name}

</h2>

<div className="mt-6 space-y-4">

<div className="flex gap-3 text-slate-300">

<Mail size={18}/>

{employee.email}

</div>

<div className="flex gap-3 text-slate-300">

<Phone size={18}/>

{employee.phone || "N/A"}

</div>

</div>

<div className="mt-8">

<span className="bg-blue-500/15 text-blue-400 px-5 py-3 rounded-full">

{employee.role}

</span>

</div>

</div>

))

}

</div>

</div>

</main>

)

}