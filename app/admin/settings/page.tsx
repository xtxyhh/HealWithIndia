"use client";

import {

ShieldCheck,

Bell,

Users,

User,

Palette,

Lock,

Globe,

Building2,

ChevronRight,

Mail,

Phone,

BadgeCheck,

Search,

Plus,

Trash2,

Pencil,

UserCog,

}from "lucide-react";



const sections=[

{

title:"Profile",

icon:User,

},

{

title:"Permissions",

icon:ShieldCheck,

},

{

title:"Employees",

icon:Users,

},

{

title:"Website CMS",

icon:Globe,

},

{

title:"Notifications",

icon:Bell,

},

{

title:"Security",

icon:Lock,

},

{

title:"Theme",

icon:Palette,

},

];



export default function SettingsPage(){



return(



<main

className="

min-h-screen

text-white

relative

overflow-hidden

"

>





{/* BG */}



<div

className="

absolute

inset-0

opacity-[0.03]

bg-[linear-gradient(rgba(255,255,255,1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,1)_1px,transparent_1px)]

bg-[size:70px_70px]

"

/>





<div

className="

absolute

top-[-200px]

right-[-200px]

h-[600px]

w-[600px]

bg-blue-600/15

blur-[150px]

rounded-full

"

/>







<div className="relative max-w-[1700px] mx-auto px-8 py-14">





{/* HEADER */}



<div

className="

flex

flex-col

lg:flex-row

lg:items-center

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

Admin Panel

</p>







<h1

className="

text-5xl

lg:text-6xl

font-bold

mt-4

"

>

Settings

</h1>







<p

className="

text-slate-400

text-lg

mt-5

max-w-2xl

"

>

Manage employees,

permissions,

website content,

notifications,

security,

and company preferences.

</p>



</div>







<div

className="

rounded-[32px]

border

border-slate-800

bg-slate-900/50

backdrop-blur-3xl

px-8

py-6

"

>





<div className="flex items-center gap-4">



<div

className="

h-16

w-16

rounded-[24px]

bg-blue-500/10

border

border-blue-500/20

flex

items-center

justify-center

"

>

<User

size={30}

className="text-blue-400"

/>

</div>







<div>



<h2

className="

text-2xl

font-bold

"

>

Super Admin

</h2>



<p className="text-slate-400 mt-1">

HealWithIndia

</p>



<div

className="

flex

items-center

gap-2

mt-3

text-green-400

"

>

<BadgeCheck size={16}/>

Verified Access

</div>



</div>



</div>





</div>





</div>







{/* GRID */}



<div

className="

grid

xl:grid-cols-[340px_1fr]

gap-10

mt-16

"

>





{/* SETTINGS MENU */}



<div

className="

rounded-[36px]

border

border-slate-800

bg-slate-900/50

backdrop-blur-3xl

p-7

h-fit

"

>





<h2

className="

text-2xl

font-bold

mb-8

"

>

Categories

</h2>







<div className="space-y-3">





{

sections.map((item)=>{



const Icon=item.icon;



return(



<button

key={item.title}

className="

group

w-full

flex

items-center

justify-between

rounded-[24px]

px-5

py-5

hover:bg-slate-800/60

transition-all

"

>





<div className="flex items-center gap-4">



<div

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

group-hover:border-blue-500

transition

"

>

<Icon

size={22}

className="text-blue-400"

/>

</div>







<span

className="

font-semibold

"

>

{item.title}

</span>





</div>







<ChevronRight

size={18}

className="

text-slate-500

group-hover:translate-x-1

transition

"

/>





</button>



)



})

}





</div>





</div>







{/* RIGHT */}



<div className="space-y-10">





{/* EMPLOYEE CARD */}



<div

className="

rounded-[36px]

border

border-slate-800

bg-slate-900/50

backdrop-blur-3xl

p-10

"

>





<div

className="

flex

flex-col

lg:flex-row

justify-between

gap-10

"

>





<div className="flex gap-6">



<div

className="

h-28

w-28

rounded-[30px]

bg-gradient-to-br

from-blue-600

to-cyan-500

flex

items-center

justify-center

text-4xl

font-bold

"

>

A

</div>







<div>



<h2

className="

text-4xl

font-bold

"

>

Admin User

</h2>



<p

className="

text-slate-400

mt-3

"

>

Super Administrator

</p>







<div className="space-y-4 mt-8">



<div className="flex gap-3">

<Mail

size={18}

className="text-blue-400"

/>



admin@healwithindia.com

</div>







<div className="flex gap-3">

<Phone

size={18}

className="text-green-400"

/>



+91 91167 34675

</div>



</div>





</div>



</div>







<div

className="

grid

grid-cols-2

gap-6

"

>





<div

className="

rounded-[28px]

bg-slate-950/70

border

border-slate-800

p-7

"

>

<p className="text-slate-500">

Role

</p>



<h3

className="

text-3xl

font-bold

mt-5

"

>

Super Admin

</h3>

</div>







<div

className="

rounded-[28px]

bg-slate-950/70

border

border-slate-800

p-7

"

>

<p className="text-slate-500">

Status

</p>



<h3

className="

text-3xl

font-bold

text-green-400

mt-5

"

>

Active

</h3>

</div>



</div>





</div>





</div>

{/* PROFILE SETTINGS */}

<div

className="

rounded-[36px]

border

border-slate-800

bg-slate-900/50

backdrop-blur-3xl

p-10

"

>





<div className="flex items-center justify-between flex-wrap gap-5">

<h2

className="

text-4xl

font-bold

"

>

Profile Settings

</h2>







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

Upload Photo

</button>



</div>







<div

className="

grid

md:grid-cols-2

gap-7

mt-10

"

>





<div>

<label

className="

text-slate-400

mb-3

block

"

>

Full Name

</label>



<input

defaultValue="Admin User"

className="

w-full

rounded-[24px]

bg-slate-950

border

border-slate-800

px-6

py-5

outline-none

focus:border-blue-500

"

/>

</div>







<div>

<label

className="

text-slate-400

mb-3

block

"

>

Email

</label>



<input

defaultValue="admin@healwithindia.com"

className="

w-full

rounded-[24px]

bg-slate-950

border

border-slate-800

px-6

py-5

outline-none

focus:border-blue-500

"

/>

</div>







<div>

<label

className="

text-slate-400

mb-3

block

"

>

Phone

</label>



<input

defaultValue="+91 91167 34675"

className="

w-full

rounded-[24px]

bg-slate-950

border

border-slate-800

px-6

py-5

outline-none

focus:border-blue-500

"

/>

</div>







<div>

<label

className="

text-slate-400

mb-3

block

"

>

Department

</label>



<select

className="

w-full

rounded-[24px]

bg-slate-950

border

border-slate-800

px-6

py-5

outline-none

focus:border-blue-500

"

>

<option>

Administration

</option>

<option>

Medical Coordination

</option>

<option>

Sales

</option>

<option>

Finance

</option>

<option>

Marketing

</option>

</select>

</div>





</div>







<div className="mt-8">

<label

className="

text-slate-400

mb-3

block

"

>

Bio

</label>



<textarea

rows={5}

defaultValue="Responsible for overseeing operations, employees, patient management and hospital partnerships."

className="

w-full

rounded-[28px]

bg-slate-950

border

border-slate-800

px-6

py-5

outline-none

resize-none

focus:border-blue-500

"

/>

</div>







{/* PASSWORD */}



<div className="mt-14">

<h3

className="

text-2xl

font-bold

"

>

Security

</h3>







<div

className="

grid

md:grid-cols-2

gap-7

mt-8

"

>





<div>

<label

className="

text-slate-400

mb-3

block

"

>

New Password

</label>



<input

type="password"

placeholder="********"

className="

w-full

rounded-[24px]

bg-slate-950

border

border-slate-800

px-6

py-5

outline-none

focus:border-blue-500

"

/>

</div>







<div>

<label

className="

text-slate-400

mb-3

block

"

>

Confirm Password

</label>



<input

type="password"

placeholder="********"

className="

w-full

rounded-[24px]

bg-slate-950

border

border-slate-800

px-6

py-5

outline-none

focus:border-blue-500

"

/>

</div>





</div>







<div

className="

flex

items-center

justify-between

mt-10

flex-wrap

gap-5

"

>





<div>

<h4

className="

font-semibold

text-xl

"

>

Two Factor Authentication

</h4>



<p

className="

text-slate-500

mt-2

"

>

Add extra security to your account

</p>

</div>







<label

className="

relative

inline-flex

cursor-pointer

"

>

<input

type="checkbox"

defaultChecked

className="sr-only peer"

/>



<div

className="

w-16

h-9

bg-slate-700

rounded-full

peer

peer-checked:bg-blue-600

after:content-['']

after:absolute

after:left-1

after:top-1

after:h-7

after:w-7

after:bg-white

after:rounded-full

after:transition-all

peer-checked:after:translate-x-7

"

/>

</label>





</div>







<div

className="

flex

justify-end

mt-12

"

>

<button

className="

px-10

py-5

rounded-[24px]

font-semibold

bg-gradient-to-r

from-blue-600

to-cyan-500

hover:scale-[1.03]

transition-all

shadow-[0_0_50px_rgba(37,99,235,.35)]

"

>

Save Settings

</button>

</div>





</div>

{/* ROLE & PERMISSIONS */}

<div

className="

rounded-[36px]

border

border-slate-800

bg-slate-900/50

backdrop-blur-3xl

p-10

"

>





<div

className="

flex

flex-col

lg:flex-row

justify-between

gap-6

"

>





<div>

<h2

className="

text-4xl

font-bold

"

>

Role & Permissions

</h2>



<p

className="

text-slate-400

mt-4

"

>

Control employee access

to different parts

of HealWithIndia CRM.

</p>

</div>







<select

className="

h-fit

rounded-[22px]

bg-slate-950

border

border-slate-800

px-6

py-4

outline-none

focus:border-blue-500

"

>

<option>

Super Admin

</option>

<option>

Manager

</option>

<option>

Medical Coordinator

</option>

<option>

Sales Executive

</option>

<option>

Finance

</option>

</select>





</div>







<div

className="

grid

md:grid-cols-2

xl:grid-cols-3

gap-6

mt-12

"

>





{

[

"Leads",

"Patients",

"Hospitals",

"Employees",

"Website CMS",

"Revenue",

"Notifications",

"Analytics",

"Security",

]

.map((item)=>(



<div

key={item}

className="

rounded-[28px]

bg-slate-950/70

border

border-slate-800

p-6

flex

items-center

justify-between

"

>





<div className="flex items-center gap-4">

<div

className="

h-12

w-12

rounded-2xl

bg-blue-500/10

border

border-blue-500/20

flex

items-center

justify-center

"

>

<ShieldCheck

size={22}

className="text-blue-400"

/>

</div>







<div>

<h3

className="

font-semibold

"

>

{item}

</h3>



<p

className="

text-slate-500

text-sm

mt-1

"

>

Allow Access

</p>

</div>



</div>







<label

className="

relative

inline-flex

cursor-pointer

"

>

<input

type="checkbox"

defaultChecked

className="sr-only peer"

/>



<div

className="

w-16

h-9

bg-slate-700

rounded-full

peer

peer-checked:bg-blue-600

after:content-['']

after:absolute

after:left-1

after:top-1

after:h-7

after:w-7

after:bg-white

after:rounded-full

after:transition-all

peer-checked:after:translate-x-7

"

/>

</label>





</div>



))

}





</div>





</div>









{/* EMPLOYEE MANAGEMENT */}

<div

className="

rounded-[36px]

border

border-slate-800

bg-slate-900/50

backdrop-blur-3xl

p-10

"

>





<div

className="

flex

flex-col

xl:flex-row

justify-between

gap-6

"

>





<div>

<h2

className="

text-4xl

font-bold

"

>

Employees

</h2>



<p

className="

text-slate-400

mt-4

"

>

Manage team members,

roles,

and account status.

</p>

</div>







<div

className="

flex

gap-4

flex-wrap

"

>





<div className="relative">

<Search

size={18}

className="

absolute

left-5

top-5

text-slate-500

"

/>







<input

placeholder="Search Employee"

className="

bg-slate-950

border

border-slate-800

rounded-[22px]

pl-14

pr-5

py-4

outline-none

focus:border-blue-500

"

/>

</div>







<button

className="

flex

items-center

gap-3

rounded-[22px]

px-6

py-4

bg-gradient-to-r

from-blue-600

to-cyan-500

hover:scale-[1.03]

transition-all

"

>

<Plus size={18}/>

Add Employee

</button>





</div>





</div>







<div className="overflow-x-auto mt-12">





<table className="w-full min-w-[1000px]">





<thead>

<tr

className="

text-left

border-b

border-slate-800

text-slate-500

"

>

<th className="pb-6">

Employee

</th>



<th className="pb-6">

Department

</th>



<th className="pb-6">

Role

</th>



<th className="pb-6">

Status

</th>



<th className="pb-6">

Actions

</th>

</tr>

</thead>







<tbody>





{

[

{

name:"Aman Sharma",

department:"Administration",

role:"Super Admin",

status:"Active",

},

{

name:"Priya Gupta",

department:"Medical",

role:"Coordinator",

status:"Active",

},

{

name:"Rohit Jain",

department:"Sales",

role:"Executive",

status:"Suspended",

},

]

.map((employee)=>(



<tr

key={employee.name}

className="

border-b

border-slate-800/60

hover:bg-slate-950/50

transition-all

"

>





<td className="py-8">

<div className="flex gap-5 items-center">





<div

className="

h-16

w-16

rounded-[22px]

bg-gradient-to-br

from-blue-600

to-cyan-500

flex

items-center

justify-center

text-xl

font-bold

"

>

{

employee

.name

.charAt(0)

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

employee.name

}

</h3>



<p

className="

text-slate-500

mt-1

"

>

employee@healwithindia.com

</p>

</div>



</div>

</td>







<td>

{

employee.department

}

</td>







<td>

<div

className="

inline-flex

items-center

gap-3

px-5

py-3

rounded-full

bg-blue-500/10

border

border-blue-500/20

text-blue-400

"

>

<UserCog size={18}/>

{

employee.role

}

</div>

</td>







<td>

<div

className={`

inline-flex

px-5

py-3

rounded-full

font-medium



${

employee.status==="Active"

?

"bg-green-500/10 text-green-400"

:

"bg-red-500/10 text-red-400"

}



`}

>

{

employee.status

}

</div>

</td>







<td>

<div className="flex gap-3">





<button

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

<Pencil

size={18}

className="text-blue-400"

/>

</button>







<button

className="

h-12

w-12

rounded-2xl

bg-red-500/10

border

border-red-500/20

flex

items-center

justify-center

hover:bg-red-500/20

transition

"

>

<Trash2

size={18}

className="text-red-400"

/>

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

{/* WEBSITE CMS */}

<div

className="

rounded-[36px]

border

border-slate-800

bg-slate-900/50

backdrop-blur-3xl

p-10

"

>





<div

className="

flex

flex-col

lg:flex-row

justify-between

gap-8

"

>





<div>

<h2

className="

text-4xl

font-bold

"

>

Website CMS

</h2>



<p

className="

text-slate-400

mt-4

max-w-2xl

"

>

Manage the complete

HealWithIndia website

without writing code.

Update Hero,

Trust Bar,

Testimonials,

Footer and SEO.

</p>

</div>







<div

className="

inline-flex

items-center

gap-3

px-6

py-4

rounded-[22px]

bg-green-500/10

border

border-green-500/20

text-green-400

font-medium

"

>

🌐 Website Live

</div>





</div>







{/* HERO */}



<div

className="

rounded-[32px]

bg-slate-950/60

border

border-slate-800

p-8

mt-14

"

>





<h3

className="

text-3xl

font-bold

"

>

Hero Section

</h3>







<div

className="

grid

md:grid-cols-2

gap-7

mt-10

"

>





<div>

<label className="text-slate-400 block mb-3">

Headline

</label>



<input

defaultValue="World Class Healthcare In India"

className="

w-full

bg-slate-900

border

border-slate-800

rounded-[24px]

px-6

py-5

outline-none

focus:border-blue-500

"

/>

</div>







<div>

<label className="text-slate-400 block mb-3">

CTA Button

</label>



<input

defaultValue="Get Free Consultation"

className="

w-full

bg-slate-900

border

border-slate-800

rounded-[24px]

px-6

py-5

outline-none

focus:border-blue-500

"

/>

</div>





</div>







<div className="mt-8">

<label className="text-slate-400 block mb-3">

Subtitle

</label>



<textarea

rows={4}

defaultValue="Connect with India's leading hospitals and experienced doctors with end-to-end treatment support."

className="

w-full

bg-slate-900

border

border-slate-800

rounded-[28px]

px-6

py-5

outline-none

resize-none

focus:border-blue-500

"

/>

</div>







<div

className="

grid

md:grid-cols-3

gap-6

mt-10

"

>





<button

className="

rounded-[24px]

bg-blue-500/10

border

border-blue-500/20

py-5

text-blue-400

hover:bg-blue-500/20

transition

"

>

Upload Doctor Image

</button>







<button

className="

rounded-[24px]

bg-cyan-500/10

border

border-cyan-500/20

py-5

text-cyan-400

hover:bg-cyan-500/20

transition

"

>

Upload World Map

</button>







<button

className="

rounded-[24px]

bg-green-500/10

border

border-green-500/20

py-5

text-green-400

hover:bg-green-500/20

transition

"

>

Save Hero

</button>





</div>





</div>









{/* TRUST BAR */}



<div

className="

rounded-[32px]

bg-slate-950/60

border

border-slate-800

p-8

mt-10

"

>





<div className="flex justify-between items-center flex-wrap gap-5">

<h3

className="

text-3xl

font-bold

"

>

Trust Bar

</h3>







<button

className="

rounded-[22px]

bg-blue-600

px-6

py-3

hover:bg-blue-500

transition

"

>

Add Feature

</button>





</div>







<div

className="

grid

md:grid-cols-2

xl:grid-cols-3

gap-6

mt-10

"

>





{

[

"JCI Accredited",

"90% Cost Savings",

"Medical Visa",

]

.map((item)=>(



<div

key={item}

className="

rounded-[28px]

bg-slate-900

border

border-slate-800

p-7

"

>





<h3

className="

font-bold

text-xl

"

>

{item}

</h3>



<p

className="

text-slate-500

mt-4

"

>

Edit title,

description,

icon and order.

</p>







<div className="flex gap-3 mt-8">



<button

className="

px-5

py-3

rounded-xl

bg-slate-800

hover:bg-slate-700

transition

"

>

Edit

</button>







<button

className="

px-5

py-3

rounded-xl

bg-red-500/10

text-red-400

hover:bg-red-500/20

transition

"

>

Delete

</button>



</div>





</div>



))

}





</div>





</div>









{/* TESTIMONIALS */}



<div

className="

rounded-[32px]

bg-slate-950/60

border

border-slate-800

p-8

mt-10

"

>





<div className="flex justify-between items-center">

<h3

className="

text-3xl

font-bold

"

>

Testimonials

</h3>







<button

className="

rounded-[22px]

bg-gradient-to-r

from-blue-600

to-cyan-500

px-6

py-3

hover:scale-[1.03]

transition-all

"

>

Add Testimonial

</button>





</div>







<div

className="

grid

lg:grid-cols-3

gap-7

mt-10

"

>





{

[

"Michael",

"Sarah",

"Daniel",

]

.map((item)=>(



<div

key={item}

className="

rounded-[28px]

bg-slate-900

border

border-slate-800

p-7

"

>





<div

className="

h-20

w-20

rounded-full

bg-gradient-to-br

from-blue-600

to-cyan-500

flex

items-center

justify-center

text-2xl

font-bold

"

>

{

item.charAt(0)

}

</div>







<h3

className="

text-2xl

font-bold

mt-6

"

>

{item}

</h3>



<p

className="

text-slate-400

mt-3

"

>

Edit photo,

quote,

country,

treatment

and savings.

</p>







<div className="flex gap-3 mt-8">

<button

className="

px-5

py-3

rounded-xl

bg-slate-800

hover:bg-slate-700

transition

"

>

Edit

</button>







<button

className="

px-5

py-3

rounded-xl

bg-red-500/10

text-red-400

hover:bg-red-500/20

transition

"

>

Delete

</button>

</div>





</div>



))

}





</div>





</div>

{/* SEO SETTINGS */}

<div

className="

rounded-[36px]

border

border-slate-800

bg-slate-900/50

backdrop-blur-3xl

p-10

"

>

<h2

className="

text-4xl

font-bold

"

>

SEO & Social

</h2>





<div

className="

grid

md:grid-cols-2

gap-7

mt-10

"

>





<div>

<label className="text-slate-400 block mb-3">

Website Title

</label>



<input

defaultValue="HealWithIndia | Medical Tourism"

className="

w-full

rounded-[24px]

bg-slate-950

border

border-slate-800

px-6

py-5

outline-none

focus:border-blue-500

"

/>

</div>







<div>

<label className="text-slate-400 block mb-3">

Meta Keywords

</label>



<input

defaultValue="medical tourism, india hospitals"

className="

w-full

rounded-[24px]

bg-slate-950

border

border-slate-800

px-6

py-5

outline-none

focus:border-blue-500

"

/>

</div>





</div>







<div className="mt-8">

<label className="text-slate-400 block mb-3">

Meta Description

</label>



<textarea

rows={4}

className="

w-full

rounded-[28px]

bg-slate-950

border

border-slate-800

px-6

py-5

resize-none

outline-none

focus:border-blue-500

"

defaultValue="Connect international patients with India's leading hospitals and doctors."

/>

</div>







<div

className="

grid

md:grid-cols-3

gap-6

mt-10

"

>





<input

placeholder="Facebook"

className="

rounded-[22px]

bg-slate-950

border

border-slate-800

px-5

py-5

outline-none

focus:border-blue-500

"

/>







<input

placeholder="Instagram"

className="

rounded-[22px]

bg-slate-950

border

border-slate-800

px-5

py-5

outline-none

focus:border-blue-500

"

/>







<input

placeholder="LinkedIn"

className="

rounded-[22px]

bg-slate-950

border

border-slate-800

px-5

py-5

outline-none

focus:border-blue-500

"

/>





</div>





</div>









{/* NOTIFICATIONS */}

<div

className="

rounded-[36px]

border

border-slate-800

bg-slate-900/50

backdrop-blur-3xl

p-10

"

>





<h2

className="

text-4xl

font-bold

"

>

Notifications

</h2>







<div

className="

grid

md:grid-cols-2

xl:grid-cols-3

gap-6

mt-10

"

>





{

[

"New Leads",

"New Patients",

"Reports Uploaded",

"Whatsapp Alerts",

"Revenue Updates",

"Website Changes",

]

.map((item)=>(



<div

key={item}

className="

rounded-[28px]

bg-slate-950

border

border-slate-800

p-7

flex

items-center

justify-between

"

>





<div>

<h3

className="

font-semibold

"

>

{item}

</h3>



<p

className="

text-slate-500

mt-2

"

>

Receive alerts

</p>

</div>







<label

className="

relative

inline-flex

cursor-pointer

"

>

<input

type="checkbox"

defaultChecked

className="sr-only peer"

/>



<div

className="

w-16

h-9

bg-slate-700

rounded-full

peer

peer-checked:bg-blue-600

after:content-['']

after:absolute

after:left-1

after:top-1

after:h-7

after:w-7

after:bg-white

after:rounded-full

after:transition-all

peer-checked:after:translate-x-7

"

/>

</label>





</div>



))

}





</div>





</div>









{/* SECURITY */}

<div

className="

rounded-[36px]

border

border-slate-800

bg-slate-900/50

backdrop-blur-3xl

p-10

"

>





<h2

className="

text-4xl

font-bold

"

>

Security

</h2>







<div

className="

grid

md:grid-cols-2

xl:grid-cols-4

gap-6

mt-10

"

>





{

[

{

title:"Last Login",

value:"Today"

},

{

title:"IP",

value:"103.xxx.xxx"

},

{

title:"Browser",

value:"Chrome"

},

{

title:"Location",

value:"India"

},

]

.map((item)=>(



<div

key={item.title}

className="

rounded-[28px]

bg-slate-950

border

border-slate-800

p-7

"

>

<p

className="

text-slate-500

"

>

{

item.title

}

</p>







<h3

className="

text-2xl

font-bold

mt-5

"

>

{

item.value

}

</h3>





</div>



))

}





</div>







<button

className="

mt-10

px-7

py-4

rounded-[22px]

bg-red-500/10

border

border-red-500/20

text-red-400

hover:bg-red-500/20

transition

"

>

Logout All Sessions

</button>





</div>









{/* THEME */}

<div

className="

rounded-[36px]

border

border-slate-800

bg-slate-900/50

backdrop-blur-3xl

p-10

"

>





<h2

className="

text-4xl

font-bold

"

>

Theme

</h2>







<div

className="

grid

md:grid-cols-2

xl:grid-cols-4

gap-6

mt-10

"

>





{

[

"Dark",

"Blue",

"Emerald",

"Corporate",

]

.map((theme)=>(



<button

key={theme}

className="

rounded-[28px]

bg-slate-950

border

border-slate-800

hover:border-blue-500

p-10

font-semibold

text-xl

transition-all

hover:-translate-y-1

"

>

{

theme

}

</button>



))

}





</div>





</div>









{/* BACKUP */}

<div

className="

rounded-[36px]

border

border-slate-800

bg-gradient-to-r

from-blue-950/40

to-slate-900

backdrop-blur-3xl

p-10

"

>





<div

className="

flex

flex-col

lg:flex-row

justify-between

items-start

lg:items-center

gap-7

"

>





<div>

<h2

className="

text-4xl

font-bold

"

>

Backup & Export

</h2>



<p

className="

text-slate-400

mt-4

"

>

Backup database

and export patient records.

</p>

</div>







<div className="flex gap-4 flex-wrap">





<button

className="

px-7

py-4

rounded-[22px]

bg-slate-950

border

border-slate-800

hover:border-blue-500

transition

"

>

Export CSV

</button>







<button

className="

px-7

py-4

rounded-[22px]

bg-gradient-to-r

from-blue-600

to-cyan-500

hover:scale-[1.03]

transition-all

"

>

Backup Database

</button>





</div>





</div>





</div>







</div>



<div>
</div>
</div>
</div>

</div>

</div>



</main>

)

}