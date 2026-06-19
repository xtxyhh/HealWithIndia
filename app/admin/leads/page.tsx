"use client";

import { useEffect, useMemo, useState } from "react";

import Link from "next/link";

import {

Search,

Phone,

MessageCircle,

FileText,

Building2,

ChevronRight,

Filter,

CircleDollarSign,

Clock3,

RefreshCcw,

Plus,

} from "lucide-react";

import { supabase } from "@/lib/supabase";



type Patient={

id:number;

created_at:string;

full_name:string | null;

email:string | null;

country:string | null;

treatment:string | null;

description:string | null;

status:string | null;

report_url:string | null;

notes:string | null;

phone:string | null;

assigned_hospital:string | null;

estimated_revenue:number | null;

};





const statuses=[

"All",

"New",

"Consultation",

"Hospital Assigned",

"Treatment Started",

"Completed",

];





export default function LeadsPage(){



const [patients,setPatients]=useState<Patient[]>([]);

const [loading,setLoading]=useState(true);

const [search,setSearch]=useState("");

const [status,setStatus]=useState("All");



useEffect(()=>{

fetchPatients();

},[]);





async function fetchPatients(){



setLoading(true);



const {data,error}=await supabase

.from("patients")

.select("*")

.order("created_at",{ascending:false});



if(!error && data){

setPatients(data);

}



setLoading(false);

}





const filteredPatients=useMemo(()=>{



return patients.filter((patient)=>{



const matchesSearch=



patient.full_name

?.toLowerCase()

.includes(search.toLowerCase())

||

patient.country

?.toLowerCase()

.includes(search.toLowerCase())

||

patient.treatment

?.toLowerCase()

.includes(search.toLowerCase());





const matchesStatus=

status==="All"

||

patient.status===status;



return matchesSearch && matchesStatus;



})



},[patients,search,status]);







return(



<div

className="

min-h-screen

bg-[#020817]

text-white

px-6

lg:px-10

py-10

"

>





{/* HEADER */}



<div

className="

flex

flex-col

xl:flex-row

justify-between

gap-8

"

>





<div>





<p

className="

uppercase

tracking-[5px]

text-blue-400

text-sm

"

>

HealWithIndia CRM

</p>





<h1

className="

text-[48px]

lg:text-[72px]

font-bold

leading-[0.95]

mt-4

"

>

Patient



<span

className="

block

bg-gradient-to-r

from-blue-400

to-cyan-400

bg-clip-text

text-transparent

"

>

Leads

</span>

</h1>





<p

className="

text-slate-400

text-lg

mt-6

max-w-2xl

"

>

Manage international patients,

assign hospitals,

track treatment progress

and communicate instantly.

</p>



</div>







<div

className="

flex

flex-wrap

gap-4

items-start

"

>





<button

onClick={fetchPatients}

className="

flex

items-center

gap-3

px-6

py-4

rounded-[22px]

bg-slate-900

border

border-slate-800

hover:border-blue-500

transition

"

>

<RefreshCcw size={18}/>

Refresh

</button>







<button

className="

flex

items-center

gap-3

px-7

py-4

rounded-[22px]

bg-gradient-to-r

from-blue-600

to-cyan-500

font-semibold

hover:scale-[1.03]

transition-all

"

>

<Plus size={18}/>

New Lead

</button>



</div>





</div>







{/* STATS */}



<div

className="

grid

sm:grid-cols-2

xl:grid-cols-4

gap-7

mt-14

"

>





<div

className="

rounded-[34px]

border

border-slate-800

bg-slate-900/50

backdrop-blur-3xl

p-8

"

>

<p className="text-slate-400">

Total Leads

</p>



<h2

className="

text-5xl

font-bold

mt-5

"

>

{patients.length}

</h2>



<div

className="

mt-5

inline-flex

items-center

gap-2

text-green-400

"

>

<ChevronRight size={18}/>

Growing

</div>

</div>







<div

className="

rounded-[34px]

border

border-slate-800

bg-slate-900/50

backdrop-blur-3xl

p-8

"

>

<p className="text-slate-400">

Revenue

</p>



<h2

className="

text-5xl

font-bold

mt-5

"

>

$

{

patients

.reduce(

(acc,item)=>

acc+

(item.estimated_revenue || 0),

0

)

.toLocaleString()

}

</h2>



<div

className="

mt-5

inline-flex

items-center

gap-2

text-yellow-400

"

>

<CircleDollarSign size={18}/>

Estimated

</div>

</div>

<div

className="

rounded-[34px]

border

border-slate-800

bg-slate-900/50

backdrop-blur-3xl

p-8

"

>

<p className="text-slate-400">

Active Cases

</p>



<h2

className="

text-5xl

font-bold

mt-5

"

>

{

patients.filter(

(item)=>

item.status!=="Completed"

).length

}

</h2>



<div

className="

mt-5

inline-flex

items-center

gap-2

text-cyan-400

"

>

<Clock3 size={18}/>

In Progress

</div>

</div>







<div

className="

rounded-[34px]

border

border-slate-800

bg-slate-900/50

backdrop-blur-3xl

p-8

"

>

<p className="text-slate-400">

Hospitals

</p>



<h2

className="

text-5xl

font-bold

mt-5

"

>

{

new Set(

patients

.map(

(p)=>p.assigned_hospital

)

.filter(Boolean)

).size

}

</h2>



<div

className="

mt-5

inline-flex

items-center

gap-2

text-blue-400

"

>

<Building2 size={18}/>

Connected

</div>

</div>





</div>







{/* TOOLBAR */}



<div

className="

mt-14

rounded-[36px]

border

border-slate-800

bg-slate-900/50

backdrop-blur-3xl

p-6

"

>





<div

className="

flex

flex-col

xl:flex-row

gap-6

justify-between

"

>





{/* SEARCH */}



<div

className="

relative

flex-1

"

>

<Search

size={20}

className="

absolute

left-5

top-5

text-slate-500

"

/>





<input

value={search}

onChange={(e)=>

setSearch(

e.target.value

)

}

placeholder="Search patients, country or treatment..."

className="

w-full

bg-slate-950

border

border-slate-800

rounded-[24px]

pl-14

pr-5

py-5

text-white

outline-none

focus:border-blue-500

transition-all

"

/>





</div>







{/* FILTERS */}



<div

className="

flex

gap-3

flex-wrap

"

>





<div

className="

flex

items-center

gap-3

px-5

py-4

rounded-[22px]

bg-slate-950

border

border-slate-800

"

>

<Filter

size={18}

className="text-blue-400"

/>



<span>

Status

</span>

</div>







{

statuses.map((item)=>(



<button

key={item}

onClick={()=>

setStatus(item)

}

className={`

px-5

py-4

rounded-[22px]

border

transition-all



${

status===item

?

"bg-blue-600 border-blue-500 text-white"

:

"bg-slate-950 border-slate-800 text-slate-300 hover:border-blue-500"

}



`}

>

{item}

</button>



))

}





</div>





</div>





</div>







{/* LEADS TABLE */}



<div

className="

mt-14

rounded-[38px]

border

border-slate-800

bg-slate-900/50

backdrop-blur-3xl

overflow-hidden

"

>





<div

className="

flex

items-center

justify-between

px-8

py-7

border-b

border-slate-800

"

>





<div>

<h2

className="

text-3xl

font-bold

"

>

Patient Leads

</h2>



<p

className="

text-slate-400

mt-2

"

>

{

filteredPatients.length

}

 patients found

</p>

</div>







<Link

href="/admin/patients"

className="

px-6

py-3

rounded-2xl

bg-blue-500/10

border

border-blue-500/20

text-blue-400

hover:bg-blue-500/20

transition

"

>

View All

</Link>





</div>







<div className="overflow-x-auto">





<table

className="

w-full

min-w-[1200px]

"

>





<thead>

<tr

className="

border-b

border-slate-800

text-left

text-slate-500

"

>

<th className="px-8 py-6">

Patient

</th>



<th className="py-6">

Country

</th>



<th className="py-6">

Treatment

</th>



<th className="py-6">

Hospital

</th>



<th className="py-6">

Revenue

</th>



<th className="py-6">

Status

</th>



<th className="py-6">

Actions

</th>

</tr>

</thead>







<tbody>

{

filteredPatients.map(

(patient)=>(

<tr

key={patient.id}

className="

border-b

border-slate-800/60

hover:bg-slate-950/60

transition-all

duration-300

"

>





{/* PATIENT */}



<td className="px-8 py-7">



<div className="flex items-center gap-5">





<div

className="

h-14

w-14

rounded-full

bg-gradient-to-r

from-blue-500

to-cyan-400

flex

items-center

justify-center

font-bold

text-lg

"

>

{

patient.full_name

?.charAt(0)

.toUpperCase()

||

"P"

}

</div>







<div>

<h3

className="

font-bold

text-lg

"

>

{

patient.full_name

||

"Unknown"

}

</h3>



<p

className="

text-slate-400

mt-1

"

>

{

patient.email

||

"No Email"

}

</p>

</div>



</div>

</td>







{/* COUNTRY */}



<td>

<div

className="

inline-flex

items-center

gap-2

px-4

py-2

rounded-full

bg-slate-950

border

border-slate-800

"

>

🌍

{

patient.country

||

"-"

}

</div>

</td>







{/* TREATMENT */}



<td>

<div>

<h4

className="

font-semibold

"

>

{

patient.treatment

||

"-"

}

</h4>



<p

className="

text-sm

text-slate-500

mt-2

"

>

{

patient.description

?.slice(0,50)

||

""

}

...

</p>

</div>

</td>







{/* HOSPITAL */}



<td>



<div

className="

inline-flex

items-center

gap-3

px-4

py-3

rounded-[18px]

bg-blue-500/10

border

border-blue-500/20

"

>

<Building2

size={18}

className="text-blue-400"

/>



{

patient.assigned_hospital

||

"Not Assigned"

}



</div>



</td>







{/* REVENUE */}



<td>



<div

className="

inline-flex

items-center

gap-2

px-4

py-3

rounded-[18px]

bg-green-500/10

border

border-green-500/20

text-green-400

font-semibold

"

>

<CircleDollarSign size={18}/>



$

{

patient

.estimated_revenue

?.toLocaleString()

||

0

}

</div>



</td>







{/* STATUS */}



<td>





<div

className={`

inline-flex

items-center

gap-3

px-5

py-3

rounded-full

font-medium

border



${

patient.status==="Completed"

?

"bg-green-500/10 border-green-500/20 text-green-400"

:



patient.status==="Treatment Started"

?

"bg-cyan-500/10 border-cyan-500/20 text-cyan-400"

:



patient.status==="Hospital Assigned"

?

"bg-blue-500/10 border-blue-500/20 text-blue-400"

:



"bg-yellow-500/10 border-yellow-500/20 text-yellow-400"

}



`}

>

<div

className={`

h-2

w-2

rounded-full



${

patient.status==="Completed"

?

"bg-green-400"

:



patient.status==="Treatment Started"

?

"bg-cyan-400"

:



patient.status==="Hospital Assigned"

?

"bg-blue-400"

:



"bg-yellow-400"

}



`}

/>



{

patient.status

||

"New"

}



</div>





</td>







{/* ACTIONS */}



<td>



<div

className="

flex

items-center

gap-3

"

>





<a

href={`tel:${patient.phone}`}

className="

h-12

w-12

rounded-2xl

bg-slate-950

border

border-slate-800

flex

items-center

justify-center

hover:border-blue-500

transition

"

>

<Phone

size={18}

className="text-blue-400"

/>

</a>







<a

href={`https://wa.me/${patient.phone}`}

target="_blank"

className="

h-12

w-12

rounded-2xl

bg-green-500/10

border

border-green-500/20

flex

items-center

justify-center

hover:bg-green-500/20

transition

"

>

<MessageCircle

size={18}

className="text-green-400"

/>

</a>







<a

href={

patient.report_url

||

"#"

}

target="_blank"

className="

h-12

w-12

rounded-2xl

bg-cyan-500/10

border

border-cyan-500/20

flex

items-center

justify-center

hover:bg-cyan-500/20

transition

"

>

<FileText

size={18}

className="text-cyan-400"

/>

</a>







<Link

href={`/admin/patient/${patient.id}`}

className="

px-5

py-3

rounded-2xl

bg-blue-600

hover:bg-blue-500

transition

font-medium

"

>

View

</Link>





</div>





</td>





</tr>





))

}





</tbody>

</table>





</div>







{

filteredPatients.length===0

&&

<div

className="

text-center

py-24

"

>





<h3

className="

text-3xl

font-bold

"

>

No Patients Found

</h3>



<p

className="

text-slate-400

mt-4

"

>

Try changing filters

or adding a new lead.

</p>





</div>

}





</div>







</div>

)

}