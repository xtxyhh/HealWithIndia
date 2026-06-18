"use client";

import { useState } from "react";

import { supabase } from "@/lib/supabase";

import { useRouter } from "next/navigation";

import {

ArrowLeft,

User,

Mail,

Phone,

Shield,

} from "lucide-react";

export default function AddEmployeePage() {

const router = useRouter();

const [loading,setLoading] = useState(false);

const [name,setName] = useState("");

const [email,setEmail] = useState("");

const [phone,setPhone] = useState("");

const [role,setRole] = useState("Sales Executive");

const [error,setError] = useState("");



const handleSubmit = async()=>{

setError("");

if(!name || !email){

setError("Name and Email are required.");

return;

}

setLoading(true);

const { error } = await supabase

.from("employees")

.insert([

{

name,

email,

phone,

role,

}

]);

setLoading(false);

if(error){

setError(error.message);

return;

}

router.push("/admin/employees");

router.refresh();

}



return(

<main className="min-h-screen bg-black text-white">

<div className="max-w-3xl mx-auto px-6 py-14">



<button

onClick={()=>router.back()}

className="flex items-center gap-3 text-slate-400 hover:text-white"

>

<ArrowLeft size={18}/>

Back

</button>



<div className="mt-10">

<p className="uppercase tracking-[4px] text-blue-400 text-sm">

Team Management

</p>

<h1 className="text-5xl font-bold mt-4">

Add Employee

</h1>

<p className="text-slate-400 mt-4">

Create new employee account.

</p>

</div>



<div className="bg-slate-950 border border-slate-800 rounded-[32px] p-10 mt-12">

<div className="space-y-7">



<div>

<label className="text-slate-400">

Full Name

</label>

<div className="relative mt-3">

<User

size={18}

className="absolute left-5 top-5 text-slate-500"

/>

<input

value={name}

onChange={(e)=>setName(e.target.value)}

className="w-full bg-black border border-slate-800 rounded-2xl py-4 pl-14 pr-5"

placeholder="John Smith"

/>

</div>

</div>





<div>

<label className="text-slate-400">

Email

</label>

<div className="relative mt-3">

<Mail

size={18}

className="absolute left-5 top-5 text-slate-500"

/>

<input

type="email"

value={email}

onChange={(e)=>setEmail(e.target.value)}

className="w-full bg-black border border-slate-800 rounded-2xl py-4 pl-14 pr-5"

placeholder="john@healwithindia.com"

/>

</div>

</div>





<div>

<label className="text-slate-400">

Phone

</label>

<div className="relative mt-3">

<Phone

size={18}

className="absolute left-5 top-5 text-slate-500"

/>

<input

value={phone}

onChange={(e)=>setPhone(e.target.value)}

className="w-full bg-black border border-slate-800 rounded-2xl py-4 pl-14 pr-5"

placeholder="+91 XXXXX XXXXX"

/>

</div>

</div>





<div>

<label className="text-slate-400">

Role

</label>

<div className="relative mt-3">

<Shield

size={18}

className="absolute left-5 top-5 text-slate-500"

/>

<select

value={role}

onChange={(e)=>setRole(e.target.value)}

className="w-full bg-black border border-slate-800 rounded-2xl py-4 pl-14 pr-5"

>

<option>

Admin

</option>

<option>

Sales Manager

</option>

<option>

Sales Executive

</option>

<option>

Doctor Coordinator

</option>

</select>

</div>

</div>





{

error &&

<div className="text-red-400">

{error}

</div>

}



<button

onClick={handleSubmit}

disabled={loading}

className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 rounded-2xl py-5 font-semibold"

>

{

loading

?

"Creating Employee..."

:

"Create Employee"

}

</button>



</div>

</div>

</div>

</main>

)

}