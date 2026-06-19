import Link from "next/link";

import {

ArrowLeft,
Phone,
Mail,
MessageCircle,
MapPin,
Activity,
Calendar,
Edit,
BadgeCheck,
Building2,
FileText,

} from "lucide-react";

import { createClient } from "@/lib/supabaseServer";





export default async function PatientProfile({

params,

}:{

params:{id:string}

}){





const supabase=await createClient();





const {

data:patient,

}=await supabase

.from("patients")

.select("*")

.eq(

"id",

params.id

)

.single();





if(!patient){

return(



<div

className="

min-h-screen

bg-[#020817]

text-white

flex

items-center

justify-center

"

>

Patient not found

</div>



)

}







return(



<div

className="

min-h-screen

bg-[#020817]

text-white

relative

overflow-hidden

"

>





{/* AURORA */}



<div className="absolute inset-0 -z-0">



<div

className="

absolute

top-[-250px]

left-[-150px]

w-[600px]

h-[600px]

rounded-full

bg-blue-600/15

blur-[180px]

"

/>





<div

className="

absolute

bottom-[-250px]

right-[-150px]

w-[650px]

h-[650px]

rounded-full

bg-cyan-500/10

blur-[180px]

"

/>





<div

className="

absolute

inset-0

opacity-[0.03]

bg-[linear-gradient(rgba(255,255,255,1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,1)_1px,transparent_1px)]

bg-[size:70px_70px]

"

/>



</div>







<div

className="

relative

z-10

max-w-[1500px]

mx-auto

px-6

lg:px-10

py-12

"

>





{/* TOP */}



<div

className="

flex

flex-col

xl:flex-row

justify-between

gap-10

"

>





<div>





<Link

href="/admin/leads"

className="

inline-flex

items-center

gap-3

px-5

py-3

rounded-[22px]

bg-slate-900

border

border-slate-800

hover:border-blue-500

transition

"

>

<ArrowLeft

size={18}

/>

Back To Leads

</Link>







<p

className="

uppercase

tracking-[5px]

text-blue-400

text-sm

mt-10

"

>

PATIENT PROFILE

</p>







<h1

className="

text-[52px]

lg:text-[78px]

font-bold

leading-[0.95]

mt-5

"

>

{

patient.full_name

}



</h1>







<div

className="

flex

flex-wrap

gap-4

mt-8

"

>





<div

className="

px-5

py-3

rounded-full

bg-slate-900

border

border-slate-800

"

>

🌍 {

patient.country

||

"Unknown"

}

</div>







<div

className="

px-5

py-3

rounded-full

bg-blue-500/10

border

border-blue-500/20

text-blue-300

"

>

{

patient.treatment

||

"Treatment"

}

</div>







<div

className="

px-5

py-3

rounded-full

bg-green-500/10

border

border-green-500/20

text-green-400

"

>

● {

patient.status

||

"New"

}

</div>





</div>







<p

className="

max-w-3xl

text-slate-400

text-lg

leading-[1.9]

mt-10

"

>

{

patient.description

||

"No description available."

}

</p>



</div>







{/* ACTIONS */}



<div

className="

grid

grid-cols-2

gap-5

w-full

xl:w-[420px]

"

>





<a

href={`tel:${patient.phone}`}

className="

group

rounded-[30px]

border

border-slate-800

bg-slate-900/60

backdrop-blur-3xl

p-8

hover:border-blue-500

transition-all

"

>

<Phone

size={30}

className="text-blue-400"

/>



<h3

className="

text-2xl

font-bold

mt-8

"

>

Call

</h3>



<p

className="

text-slate-400

mt-3

"

>

{

patient.phone

||

"No Number"

}

</p>

</a>







<a

href={`https://wa.me/${patient.phone}`}

target="_blank"

className="

group

rounded-[30px]

border

border-green-500/20

bg-green-500/10

backdrop-blur-3xl

p-8

hover:bg-green-500/20

transition-all

"

>

<MessageCircle

size={30}

className="text-green-400"

/>



<h3

className="

text-2xl

font-bold

mt-8

"

>

WhatsApp

</h3>



<p

className="

text-slate-300

mt-3

"

>

Instant Message

</p>

</a>







<a

href={`mailto:${patient.email}`}

className="

rounded-[30px]

border

border-cyan-500/20

bg-cyan-500/10

backdrop-blur-3xl

p-8

hover:bg-cyan-500/20

transition-all

"

>

<Mail

size={30}

className="text-cyan-400"

/>



<h3

className="

text-2xl

font-bold

mt-8

"

>

Email

</h3>



<p

className="

text-slate-300

mt-3

break-all

"

>

{

patient.email

||

"No Email"

}

</p>

</a>







<div

className="

rounded-[30px]

border

border-yellow-500/20

bg-yellow-500/10

backdrop-blur-3xl

p-8

"

>

<Edit

size={30}

className="text-yellow-400"

/>



<h3

className="

text-2xl

font-bold

mt-8

"

>

Edit

</h3>



<p

className="

text-slate-300

mt-3

"

>

Update Details

</p>

</div>



</div>





</div>

{/* INFO GRID */}

<div

className="

grid

xl:grid-cols-[1.4fr_1fr]

gap-8

mt-14

"

>





{/* LEFT SIDE */}



<div className="space-y-8">





{/* REVENUE */}



<div

className="

rounded-[36px]

border

border-slate-800

bg-slate-900/50

backdrop-blur-3xl

p-8

"

>





<p className="text-slate-400">

Estimated Revenue

</p>



<h2

className="

text-6xl

font-bold

mt-5

bg-gradient-to-r

from-green-400

to-cyan-400

bg-clip-text

text-transparent

"

>

$

{

patient

.estimated_revenue

?.toLocaleString()

||

0

}

</h2>







<div

className="

grid

grid-cols-2

gap-6

mt-10

"

>





<div

className="

rounded-[24px]

bg-slate-950/70

border

border-slate-800

p-6

"

>

<p className="text-slate-500">

Paid

</p>



<h3

className="

text-3xl

font-bold

text-green-400

mt-4

"

>

60%

</h3>

</div>







<div

className="

rounded-[24px]

bg-slate-950/70

border

border-slate-800

p-6

"

>

<p className="text-slate-500">

Pending

</p>



<h3

className="

text-3xl

font-bold

text-yellow-400

mt-4

"

>

40%

</h3>

</div>



</div>





</div>







{/* REPORTS */}



<div

className="

rounded-[36px]

border

border-slate-800

bg-slate-900/50

backdrop-blur-3xl

p-8

"

>





<div className="flex justify-between items-center">

<h2

className="

text-3xl

font-bold

"

>

Reports

</h2>







<a

href="#"

className="

px-5

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

Upload

</a>





</div>







<div className="space-y-5 mt-10">





<div

className="

rounded-[24px]

bg-slate-950/70

border

border-slate-800

p-6

flex

justify-between

items-center

"

>





<div className="flex gap-4">

<FileText

size={24}

className="text-cyan-400"

/>



<div>

<h3 className="font-semibold">

Medical_Report.pdf

</h3>



<p className="text-slate-500 mt-2">

PDF Document

</p>

</div>

</div>







<a

href={

patient.report_url

||

"#"

}

target="_blank"

className="

px-5

py-3

rounded-xl

bg-slate-900

border

border-slate-700

hover:border-blue-500

transition

"

>

View

</a>





</div>





</div>





</div>







{/* NOTES */}



<div

className="

rounded-[36px]

border

border-slate-800

bg-slate-900/50

backdrop-blur-3xl

p-8

"

>





<div className="flex justify-between items-center">

<h2

className="

text-3xl

font-bold

"

>

Notes

</h2>







<button

className="

px-5

py-3

rounded-2xl

bg-blue-600

hover:bg-blue-500

transition

"

>

Add Note

</button>





</div>







<div

className="

rounded-[24px]

bg-slate-950/70

border

border-slate-800

p-7

mt-10

"

>

<p

className="

text-slate-300

leading-[1.9]

"

>

{

patient.notes

||

"No notes available."

}

</p>

</div>





</div>





</div>







{/* RIGHT SIDE */}



<div className="space-y-8">





{/* HOSPITAL */}



<div

className="

rounded-[36px]

border

border-slate-800

bg-slate-900/50

backdrop-blur-3xl

p-8

"

>





<Building2

size={34}

className="text-blue-400"

/>



<h2

className="

text-3xl

font-bold

mt-7

"

>

Hospital

</h2>







<div

className="

mt-8

rounded-[24px]

bg-slate-950/70

border

border-slate-800

p-7

"

>

<h3

className="

font-semibold

text-xl

"

>

{

patient.assigned_hospital

||

"Not Assigned"

}

</h3>



<p

className="

text-slate-400

mt-3

"

>

International Partner Hospital

</p>

</div>





</div>







{/* TIMELINE */}



<div

className="

rounded-[36px]

border

border-slate-800

bg-slate-900/50

backdrop-blur-3xl

p-8

"

>





<h2

className="

text-3xl

font-bold

"

>

Timeline

</h2>







<div

className="

space-y-8

mt-10

"

>





{

[

"Lead Created",

"Consultation",

"Hospital Assigned",

"Treatment Started",

"Recovery"

]

.map((step,index)=>(



<div

key={index}

className="

flex

gap-5

"

>





<div className="relative">



<div

className="

h-5

w-5

rounded-full

bg-blue-500

"

/>



{

index!==4

&&

<div

className="

absolute

top-6

left-2

w-[2px]

h-[70px]

bg-slate-800

"

/>

}



</div>







<div>

<h3

className="

font-semibold

text-lg

"

>

{step}

</h3>



<p

className="

text-slate-500

mt-2

"

>

Completed

</p>

</div>



</div>



))

}





</div>





</div>







{/* PATIENT META */}



<div

className="

rounded-[36px]

border

border-slate-800

bg-slate-900/50

backdrop-blur-3xl

p-8

"

>





<h2

className="

text-2xl

font-bold

"

>

Patient Details

</h2>







<div className="space-y-6 mt-8">





<div className="flex justify-between">

<span className="text-slate-500">

Email

</span>



<span>

{

patient.email

||

"-"

}

</span>

</div>







<div className="flex justify-between">

<span className="text-slate-500">

Phone

</span>



<span>

{

patient.phone

||

"-"

}

</span>

</div>







<div className="flex justify-between">

<span className="text-slate-500">

Country

</span>



<span>

{

patient.country

||

"-"

}

</span>

</div>







<div className="flex justify-between">

<span className="text-slate-500">

Created

</span>



<span>

{

new Date(

patient.created_at

)

.toLocaleDateString()

}

</span>

</div>



</div>





</div>





</div>





</div>







</div>

</div>

)
}