"use client";

import Link from "next/link";

import {

Search,

Bell,

Settings,

ChevronDown,

Users,

UserPlus,

PhoneCall,

DollarSign,

FileText,

Building2,

Activity,

Home,

Calendar,

BarChart3,

ArrowUpRight,

} from "lucide-react";







const sidebar=[

{

title:"Overview",

href:"/admin",

icon:Home,

},

{

title:"Leads",

href:"/admin/leads",

icon:Users,

},

{

title:"Hospitals",

href:"/admin/hospitals",

icon:Building2,

},

{

title:"Documents",

href:"/admin/documents",

icon:FileText,

},

{

title:"Follow Ups",

href:"/admin/followups",

icon:Activity,

},

{

title:"Appointments",

href:"/admin/appointments",

icon:Calendar,

},

{

title:"Analytics",

href:"/admin/analytics",

icon:BarChart3,

},

];







const stats=[



{

title:"Total Leads",

value:"128",

growth:"+12%",

icon:Users,

color:"text-blue-400",

bg:"bg-blue-500/10",

border:"border-blue-500/20",

},

{

title:"New This Month",

value:"24",

growth:"+18%",

icon:UserPlus,

color:"text-green-400",

bg:"bg-green-500/10",

border:"border-green-500/20",

},

{

title:"Consultations",

value:"89",

growth:"+9%",

icon:PhoneCall,

color:"text-cyan-400",

bg:"bg-cyan-500/10",

border:"border-cyan-500/20",

},

{

title:"Revenue",

value:"$48K",

growth:"+23%",

icon:DollarSign,

color:"text-yellow-400",

bg:"bg-yellow-500/10",

border:"border-yellow-500/20",

},

];







export default function DashboardPage(){



return(



<main

className="

relative

min-h-screen

overflow-hidden

bg-[#020817]

text-white

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

animate-pulse

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

animate-pulse

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

flex

min-h-screen

"

>





{/* SIDEBAR */}



<aside

className="

hidden

lg:flex

w-[300px]

shrink-0

border-r

border-slate-800

bg-slate-950/50

backdrop-blur-3xl

flex-col

sticky

top-0

h-screen

"

>





<div

className="

px-8

pt-10

"

>





<p

className="

uppercase

tracking-[5px]

text-blue-400

text-xs

font-semibold

"

>

HealWithIndia

</p>





<h2

className="

text-4xl

font-bold

mt-4

"

>

Admin CRM

</h2>





<p

className="

text-slate-400

mt-3

leading-relaxed

"

>

Manage leads,

patients,

hospitals

and international operations.

</p>





</div>







<nav

className="

mt-12

px-5

space-y-3

"

>





{

sidebar.map((item)=>{



const Icon=item.icon;



return(



<Link

key={item.title}

href={item.href}

className="

group

flex

items-center

gap-4

px-5

py-4

rounded-[22px]

text-slate-300

hover:text-white

hover:bg-slate-900

hover:border-blue-500/20

border

border-transparent

transition-all

duration-300

"

>





<div

className="

h-12

w-12

rounded-xl

bg-slate-900

border

border-slate-800

flex

items-center

justify-center

group-hover:border-blue-500

transition-all

"

>

<Icon

size={22}

className="text-blue-400"

/>

</div>





<span

className="

font-medium

"

>

{item.title}

</span>



</Link>



)



})

}





</nav>







<div

className="

mt-auto

p-6

"

>





<div

className="

rounded-[28px]

border

border-slate-800

bg-slate-900/70

backdrop-blur-3xl

p-6

"

>





<p className="text-slate-500 text-sm">

Active Coordinators

</p>



<h3

className="

text-5xl

font-bold

mt-4

"

>

8

</h3>



<p

className="

text-green-400

mt-3

"

>

All Online

</p>





</div>



</div>





</aside>







{/* MAIN AREA */}



<div

className="

flex-1

px-6

lg:px-10

py-8

"

>





{/* TOPBAR */}



<div

className="

flex

flex-col

lg:flex-row

lg:items-center

justify-between

gap-6

"

>





<div>



<p

className="

uppercase

tracking-[4px]

text-blue-400

text-sm

"

>

Dashboard

</p>





<h1

className="

text-[42px]

lg:text-[60px]

font-bold

leading-[1]

mt-3

"

>

Welcome Back,



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

Admin

</span>

</h1>





<p

className="

text-slate-400

mt-5

text-lg

"

>

Monitor leads,

patients,

hospitals

and revenue in real time.

</p>



</div>







<div

className="

flex

items-center

gap-4

flex-wrap

"

>





<div className="relative">

<Search

size={18}

className="

absolute

left-4

top-4

text-slate-500

"

/>





<input

placeholder="Search patients..."

className="

w-[280px]

bg-slate-900/70

border

border-slate-800

rounded-[22px]

pl-11

pr-4

py-3

text-white

outline-none

focus:border-blue-500

transition-all

"

/>

</div>







<button

className="

h-14

w-14

rounded-2xl

bg-slate-900

border

border-slate-800

flex

items-center

justify-center

hover:border-blue-500

transition-all

"

>

<Bell

size={22}

className="text-blue-400"

/>

</button>

<button

className="

h-14

w-14

rounded-2xl

bg-slate-900

border

border-slate-800

flex

items-center

justify-center

hover:border-blue-500

transition-all

"

>

<Settings

size={22}

className="text-slate-300"

/>

</button>







<div

className="

flex

items-center

gap-4

px-4

py-3

rounded-[22px]

bg-slate-900/70

border

border-slate-800

backdrop-blur-xl

"

>





<div

className="

h-12

w-12

rounded-full

bg-gradient-to-r

from-blue-500

to-cyan-400

flex

items-center

justify-center

font-bold

"

>

A

</div>





<div>

<p className="font-semibold">

Admin

</p>



<p

className="

text-slate-400

text-sm

"

>

Super Admin

</p>

</div>





<ChevronDown

size={18}

className="text-slate-500"

/>





</div>







</div>







</div>







{/* KPI CARDS */}



<div

className="

grid

sm:grid-cols-2

xl:grid-cols-4

gap-7

mt-14

"

>





{

stats.map((item)=>{



const Icon=item.icon;



return(



<div

key={item.title}

className="

group

relative

overflow-hidden

rounded-[34px]

border

border-slate-800

bg-slate-900/50

backdrop-blur-3xl

p-8

hover:border-blue-500/30

hover:-translate-y-1

transition-all

duration-300

"

>





{/* GLOW */}



<div

className={`

absolute

top-[-80px]

right-[-60px]

w-[220px]

h-[220px]

rounded-full



${item.bg}



blur-[100px]

opacity-0

group-hover:opacity-100

transition-all

duration-700

`}

/>







<div

className="

relative

flex

items-start

justify-between

"

>





<div>



<p

className="

text-slate-400

"

>

{item.title}

</p>





<h2

className="

text-5xl

font-bold

mt-5

"

>

{item.value}

</h2>







<div

className="

mt-6

inline-flex

items-center

gap-2

px-4

py-2

rounded-full

bg-green-500/10

border

border-green-500/20

text-green-400

text-sm

font-medium

"

>

<ArrowUpRight

size={15}

/>



{item.growth}

</div>





</div>







<div

className={`

h-20

w-20

rounded-[28px]

${item.bg}

${item.border}

border

flex

items-center

justify-center

group-hover:scale-110

transition-all

duration-500

`}

>





<Icon

size={36}

className={item.color}

/>





</div>







</div>





</div>



)



})

}





</div>







{/* REVENUE + LEADS OVERVIEW */}



<div

className="

grid

xl:grid-cols-[1.8fr_1fr]

gap-8

mt-14

"

>





{/* REVENUE CARD */}



<div

className="

relative

overflow-hidden

rounded-[38px]

border

border-slate-800

bg-slate-900/50

backdrop-blur-3xl

p-8

"

>





<div

className="

absolute

top-[-120px]

right-[-60px]

w-[260px]

h-[260px]

rounded-full

bg-blue-500/10

blur-[130px]

"

/>







<div className="relative">





<div

className="

flex

items-center

justify-between

"

>





<div>

<p className="text-slate-400">

Monthly Revenue

</p>



<h2

className="

text-5xl

font-bold

mt-3

"

>

$48,000

</h2>



<p

className="

text-green-400

mt-4

"

>

↑ 23% from last month

</p>

</div>







<div

className="

h-16

w-16

rounded-[22px]

bg-blue-500/10

border

border-blue-500/20

flex

items-center

justify-center

"

>

<DollarSign

size={32}

className="text-blue-400"

/>

</div>





</div>







{/* FAKE CHART */}



<div

className="

mt-12

h-[220px]

flex

items-end

gap-5

"

>





{

[45,70,58,82,65,95,75,110,85,120]

.map((height,index)=>(



<div

key={index}

className="

flex-1

rounded-t-full

bg-gradient-to-t

from-blue-600

to-cyan-400

opacity-90

hover:opacity-100

transition

"

style={{

height:`${height}px`

}}

/>



))

}





</div>





</div>





</div>







{/* LEADS FUNNEL */}



<div

className="

rounded-[38px]

border

border-slate-800

bg-slate-900/50

backdrop-blur-3xl

p-8

"

>





<p

className="

text-slate-400

"

>

Patient Funnel

</p>



<h2

className="

text-3xl

font-bold

mt-4

"

>

Lead Pipeline

</h2>







<div

className="

space-y-6

mt-10

"

>





<div>

<div className="flex justify-between">

<span>New Leads</span>

<span className="text-blue-400">

128

</span>

</div>



<div

className="

h-3

rounded-full

bg-slate-800

mt-3

overflow-hidden

"

>

<div

className="

h-full

w-[90%]

bg-gradient-to-r

from-blue-500

to-cyan-400

rounded-full

"

/>

</div>

</div>

</div>





<div>

<div className="flex justify-between">

<span>Consultations</span>

<span className="text-cyan-400">

89

</span>

</div>



<div

className="

h-3

rounded-full

bg-slate-800

mt-3

overflow-hidden

"

>

<div

className="

h-full

w-[72%]

bg-gradient-to-r

from-cyan-500

to-blue-400

rounded-full

"

/>

</div>

</div>







<div>

<div className="flex justify-between">

<span>Hospital Assigned</span>

<span className="text-green-400">

64

</span>

</div>



<div

className="

h-3

rounded-full

bg-slate-800

mt-3

overflow-hidden

"

>

<div

className="

h-full

w-[55%]

bg-gradient-to-r

from-green-500

to-cyan-400

rounded-full

"

/>

</div>

</div>







<div>

<div className="flex justify-between">

<span>Treatment Started</span>

<span className="text-yellow-400">

31

</span>

</div>



<div

className="

h-3

rounded-full

bg-slate-800

mt-3

overflow-hidden

"

>

<div

className="

h-full

w-[30%]

bg-gradient-to-r

from-yellow-400

to-orange-400

rounded-full

"

/>

</div>

</div>





</div>

</div>







{/* ACTIVITIES + QUICK ACTIONS */}



<div

className="

grid

xl:grid-cols-[1.6fr_1fr]

gap-8

mt-14

"

>





{/* RECENT ACTIVITIES */}



<div

className="

rounded-[38px]

border

border-slate-800

bg-slate-900/50

backdrop-blur-3xl

p-8

"

>





<div className="flex items-center justify-between">

<h2

className="

text-3xl

font-bold

"

>

Recent Activities

</h2>



<div

className="

px-4

py-2

rounded-full

bg-green-500/10

border

border-green-500/20

text-green-400

text-sm

"

>

Live Updates

</div>

</div>







<div

className="

space-y-7

mt-10

"

>





{

[

{

title:"New patient from USA",

desc:"Cardiology consultation submitted",

time:"5 min ago",

},

{

title:"Apollo Hospital Assigned",

desc:"Heart surgery case approved",

time:"25 min ago",

},

{

title:"Reports Uploaded",

desc:"Kidney transplant documents",

time:"1 hour ago",

},

{

title:"Video Consultation",

desc:"Patient from UAE connected",

time:"2 hours ago",

},

]

.map((item,index)=>(



<div

key={index}

className="

flex

gap-5

"

>





<div

className="

relative

"

>

<div

className="

h-5

w-5

rounded-full

bg-blue-500

"

/>



{

index!==3

&&

<div

className="

absolute

top-6

left-2

w-[2px]

h-[90px]

bg-slate-800

"

/>

}



</div>







<div>

<h3

className="

text-xl

font-semibold

"

>

{item.title}

</h3>



<p

className="

text-slate-400

mt-2

"

>

{item.desc}

</p>



<p

className="

text-sm

text-slate-500

mt-3

"

>

{item.time}

</p>

</div>



</div>



))

}





</div>

</div>







{/* QUICK ACTIONS */}



<div

className="

rounded-[38px]

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

Quick Actions

</h2>







<div

className="

space-y-5

mt-10

"

>





{

[

{

title:"Manage Leads",

href:"/admin/leads",

icon:Users,

},

{

title:"Documents",

href:"/admin/documents",

icon:FileText,

},

{

title:"Hospitals",

href:"/admin/hospitals",

icon:Building2,

},

{

title:"Follow Ups",

href:"/admin/followups",

icon:Activity,

},

]

.map((item)=>{



const Icon=item.icon;



return(



<Link

key={item.title}

href={item.href}

className="

group

flex

items-center

justify-between

rounded-[26px]

border

border-slate-800

bg-slate-950/70

p-5

hover:border-blue-500

hover:-translate-y-1

transition-all

duration-300

"

>





<div

className="

flex

items-center

gap-4

"

>





<div

className="

h-14

w-14

rounded-[18px]

bg-blue-500/10

border

border-blue-500/20

flex

items-center

justify-center

"

>

<Icon

size={26}

className="text-blue-400"

/>

</div>





<span

className="

font-semibold

text-lg

"

>

{item.title}

</span>





</div>







<ArrowUpRight

size={20}

className="

text-slate-500

group-hover:text-blue-400

transition

"

/>





</Link>



)



})

}

</div>

</div>







{/* EMPLOYEES + APPOINTMENTS */}



<div

className="

grid

xl:grid-cols-[1.4fr_1fr]

gap-8

mt-14

"

>





{/* EMPLOYEE PERFORMANCE */}



<div

className="

rounded-[38px]

border

border-slate-800

bg-slate-900/50

backdrop-blur-3xl

p-8

"

>





<div className="flex items-center justify-between">



<div>

<p className="text-slate-400">

Team Performance

</p>



<h2

className="

text-3xl

font-bold

mt-3

"

>

Patient Coordinators

</h2>

</div>







<div

className="

px-5

py-3

rounded-full

bg-blue-500/10

border

border-blue-500/20

text-blue-400

text-sm

"

>

8 Active

</div>



</div>







<div

className="

space-y-6

mt-10

"

>





{

[

{

name:"Priya Sharma",

role:"Senior Coordinator",

patients:"32",

score:"97%",

},

{

name:"Aman Verma",

role:"International Coordinator",

patients:"26",

score:"95%",

},

{

name:"Sara Khan",

role:"Medical Advisor",

patients:"21",

score:"93%",

},

]

.map((emp,index)=>(



<div

key={index}

className="

group

flex

flex-col

md:flex-row

md:items-center

justify-between

gap-6

rounded-[28px]

border

border-slate-800

bg-slate-950/70

p-6

hover:border-blue-500

transition-all

duration-300

"

>





<div className="flex items-center gap-5">





<div

className="

h-16

w-16

rounded-full

bg-gradient-to-r

from-blue-500

to-cyan-400

flex

items-center

justify-center

text-xl

font-bold

"

>

{emp.name.charAt(0)}

</div>







<div>

<h3

className="

text-xl

font-bold

"

>

{emp.name}

</h3>



<p

className="

text-slate-400

mt-2

"

>

{emp.role}

</p>

</div>



</div>







<div

className="

flex

gap-10

"

>





<div>

<p className="text-slate-500 text-sm">

Patients

</p>



<p

className="

text-2xl

font-bold

mt-2

"

>

{emp.patients}

</p>

</div>







<div>

<p className="text-slate-500 text-sm">

Performance

</p>



<p

className="

text-2xl

font-bold

text-green-400

mt-2

"

>

{emp.score}

</p>

</div>





</div>







<button

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

View

</button>





</div>



))

}





</div>





</div>







{/* UPCOMING APPOINTMENTS */}



<div

className="

rounded-[38px]

border

border-slate-800

bg-slate-900/50

backdrop-blur-3xl

p-8

"

>





<p className="text-slate-400">

Upcoming

</p>



<h2

className="

text-3xl

font-bold

mt-3

"

>

Appointments

</h2>







<div

className="

space-y-5

mt-10

"

>





{

[

{

patient:"John Smith",

country:"USA",

time:"11:00 AM",

},

{

patient:"Fatima Noor",

country:"UAE",

time:"01:30 PM",

},

{

patient:"William Lee",

country:"UK",

time:"03:00 PM",

},

]

.map((item,index)=>(



<div

key={index}

className="

rounded-[26px]

border

border-slate-800

bg-slate-950/70

p-6

hover:border-blue-500

transition

"

>





<div className="flex justify-between items-start">



<div>

<h3

className="

font-bold

text-lg

"

>

{item.patient}

</h3>



<p

className="

text-slate-400

mt-2

"

>

{item.country}

</p>

</div>







<div

className="

px-4

py-2

rounded-full

bg-cyan-500/10

border

border-cyan-500/20

text-cyan-400

text-sm

"

>

{item.time}

</div>



</div>





</div>



))

}





</div>







{/* SMALL STATS */}



<div

className="

grid

grid-cols-2

gap-5

mt-8

"

>





<div

className="

rounded-[24px]

border

border-slate-800

bg-slate-950/70

p-5

text-center

"

>

<p className="text-slate-500">

Today's Calls

</p>



<h3

className="

text-3xl

font-bold

mt-3

text-blue-400

"

>

14

</h3>

</div>







<div

className="

rounded-[24px]

border

border-slate-800

bg-slate-950/70

p-5

text-center

"

>

<p className="text-slate-500">

Pending

</p>



<h3

className="

text-3xl

font-bold

mt-3

text-yellow-400

"

>

7

</h3>

</div>



</div>





</div>

</div>

{/* HOSPITAL OVERVIEW */}



<div

className="

rounded-[38px]

border

border-slate-800

bg-slate-900/50

backdrop-blur-3xl

p-8

mt-14

"

>





<div

className="

flex

flex-col

md:flex-row

md:items-center

justify-between

gap-6

"

>





<div>

<p className="text-slate-400">

Hospital Network

</p>



<h2

className="

text-3xl

font-bold

mt-3

"

>

Partner Hospitals

</h2>

</div>







<button

className="

px-6

py-3

rounded-2xl

bg-blue-500/10

border

border-blue-500/20

text-blue-400

hover:bg-blue-500/20

transition-all

"

>

Add Hospital

</button>



</div>







<div

className="

overflow-x-auto

mt-10

"

>





<table className="w-full min-w-[850px]">



<thead>

<tr

className="

text-left

text-slate-500

border-b

border-slate-800

"

>

<th className="pb-5">

Hospital

</th>



<th className="pb-5">

Location

</th>



<th className="pb-5">

Doctors

</th>



<th className="pb-5">

Patients

</th>



<th className="pb-5">

Status

</th>



<th className="pb-5">

Action

</th>

</tr>

</thead>







<tbody>





{

[

{

name:"Apollo Hospitals",

location:"Delhi",

doctors:"220",

patients:"64",

status:"Active",

},

{

name:"Fortis Healthcare",

location:"Mumbai",

doctors:"175",

patients:"49",

status:"Active",

},

{

name:"Medanta",

location:"Gurugram",

doctors:"205",

patients:"52",

status:"Active",

},

]

.map((hospital,index)=>(



<tr

key={index}

className="

border-b

border-slate-800/70

hover:bg-slate-900/40

transition

"

>





<td className="py-7">



<div className="flex items-center gap-4">





<div

className="

h-14

w-14

rounded-2xl

bg-blue-500/10

border

border-blue-500/20

flex

items-center

justify-center

"

>

<Building2

size={24}

className="text-blue-400"

/>

</div>







<div>

<h3

className="

font-semibold

text-lg

"

>

{hospital.name}

</h3>



<p

className="

text-slate-500

text-sm

mt-1

"

>

International Partner

</p>

</div>





</div>

</td>







<td>

{hospital.location}

</td>





<td>

{hospital.doctors}

</td>





<td>

{hospital.patients}

</td>







<td>



<div

className="

inline-flex

items-center

gap-2

px-4

py-2

rounded-full

bg-green-500/10

border

border-green-500/20

text-green-400

text-sm

"

>

<div

className="

h-2

w-2

rounded-full

bg-green-400

"

/>

{hospital.status}

</div>





</td>







<td>



<button

className="

px-5

py-2

rounded-xl

bg-slate-900

border

border-slate-700

hover:border-blue-500

transition

"

>

Manage

</button>





</td>





</tr>



))

}





</tbody>

</table>





</div>





</div>







{/* COMPANY HEALTH */}



<div

className="

grid

md:grid-cols-3

gap-8

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

<p className="text-slate-500">

Patient Satisfaction

</p>



<h3

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

98%

</h3>



<p

className="

mt-4

text-green-400

"

>

Excellent Rating

</p>

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

<p className="text-slate-500">

Monthly Revenue

</p>



<h3

className="

text-6xl

font-bold

mt-5

bg-gradient-to-r

from-blue-400

to-cyan-400

bg-clip-text

text-transparent

"

>

$48K

</h3>



<p

className="

mt-4

text-blue-400

"

>

Growing Fast

</p>

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

<p className="text-slate-500">

System Status

</p>



<h3

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

100%

</h3>



<p

className="

mt-4

text-green-400

"

>

All Services Online

</p>

</div>





</div>







{/* FOOTER */}



<div

className="

mt-20

pt-10

border-t

border-slate-800

flex

flex-col

lg:flex-row

items-center

justify-between

gap-6

"

>





<p

className="

text-slate-500

"

>

© 2026 HealWithIndia Admin CRM.

All Rights Reserved.

</p>







<div

className="

flex

items-center

gap-6

text-slate-500

"

>

<span>

v2.0

</span>



<span>

Secure Platform

</span>



<span>

Realtime Analytics

</span>

</div>





</div>







</div>

</div>

</div>



</main>

)

}