"use client";

import Image from "next/image";
import Link from "next/link";

import { useState } from "react";

import { usePathname } from "next/navigation";

import {

Menu,

X,

Phone,

MessageCircle,

ChevronRight,

Search,

HeartPulse,

Activity,

Bone,

Baby,

ShieldPlus,

Building2,

MapPin,

BadgeCheck,

} from "lucide-react";

export default function Navbar() {

const pathname=usePathname();

const [menuOpen,setMenuOpen]=useState(false);

const [treatmentsOpen,setTreatmentsOpen]=useState(false);

const [hospitalsOpen,setHospitalsOpen]=useState(false);



const navLinks=[

{

name:"Home",

href:"/",

},

{

name:"Why India",

href:"/why-india",

},

{

name:"About",

href:"/about",

},

{

name:"FAQ",

href:"/faq",

},

{

name:"Contact",

href:"/contact",

},

];



const treatments=[

{

name:"Cardiology",

href:"/treatments/cardiology",

icon:HeartPulse,

},

{

name:"Oncology",

href:"/treatments/oncology",

icon:Activity,

},

{

name:"Orthopedics",

href:"/treatments/orthopedics",

icon:Bone,

},

{

name:"IVF Treatment",

href:"/treatments/ivf",

icon:Baby,

},

{

name:"Kidney Transplant",

href:"/treatments/kidney-transplant",

icon:ShieldPlus,

},

];



const hospitals=[

{

name:"Apollo Hospitals",

href:"/hospitals/apollo",

},

{

name:"Fortis Healthcare",

href:"/hospitals/fortis",

},

{

name:"Medanta",

href:"/hospitals/medanta",

},

{

name:"Max Healthcare",

href:"/hospitals/max",

},

{

name:"Manipal Hospitals",

href:"/hospitals/manipal",

},

{

name:"Narayana Health",

href:"/hospitals/narayana",

},

];



return(

<>

{/* TOP BAR */}

<div className="relative overflow-hidden">

<div className="absolute inset-0 bg-gradient-to-r from-blue-700 via-blue-600 to-cyan-500"/>

<div className="relative max-w-7xl mx-auto px-5">

<div className="h-10 flex items-center justify-center text-white text-sm font-medium">

JCI Accredited Hospitals

<span className="mx-4 opacity-50">

•

</span>

Serving Patients From 100+ Countries

<span className="mx-4 opacity-50">

•

</span>

24/7 International Patient Support

</div>

</div>

</div>



<nav

className="

sticky

top-0

z-50

backdrop-blur-[40px]

bg-slate-950/75

border-b

border-white/[0.05]

shadow-[0_10px_60px_rgba(0,0,0,.45)]

"

>

<div className="max-w-[1500px] mx-auto px-5">

<div className="h-[95px] flex items-center justify-between">



<div className="flex items-center gap-20">




<Link

href="/"

className="

group

flex

items-center

gap-5

hover:scale-[1.02]

transition

duration-500

"

>

<div className="relative">

<div

className="

absolute

inset-0

bg-blue-500/20

blur-2xl

rounded-full

"

/>



<Image

src="/images/logo.png"

alt="HealWithIndia"

width={62}

height={62}

priority

className="

relative

rounded-2xl

border

border-white/[0.08]

shadow-[0_0_40px_rgba(37,99,235,.25)]

"

/>

</div>




<div>

<h1

className="

text-[34px]

font-bold

tracking-tight

bg-gradient-to-r

from-white

to-blue-200

bg-clip-text

text-transparent

"

>

HealWithIndia

</h1>

<p

className="

text-sm

text-slate-400

mt-1

tracking-wide

"

>

International Patient Care

</p>

</div>

</Link>

<div className="hidden lg:flex items-center gap-10">


<div

className="relative"

onMouseEnter={()=>setTreatmentsOpen(true)}

onMouseLeave={()=>setTreatmentsOpen(false)}

>

<button

className="

text-slate-300

hover:text-white

font-medium

transition

"

>

Treatments

</button>



{

treatmentsOpen &&

(

<div

className="

absolute

top-10

left-0

w-[350px]

bg-slate-950

border

border-slate-800

rounded-3xl

p-6

shadow-2xl

"

>

<div className="space-y-3">

{

treatments.map((item)=>{

const Icon=item.icon;

return(

<Link

key={item.name}

href={item.href}

className="

flex

items-center

gap-4

p-4

rounded-2xl

hover:bg-slate-900

transition

"

>

<Icon

size={22}

className="text-blue-400"

/>

<div>

<h3 className="text-white font-semibold">

{item.name}

</h3>

<p className="text-sm text-slate-500">

Advanced Treatment

</p>

</div>

</Link>

)

})

}

</div>

</div>

)

}

</div>

<div

className="relative"

onMouseEnter={()=>setHospitalsOpen(true)}

onMouseLeave={()=>setHospitalsOpen(false)}

>

<button

className="

text-slate-300

hover:text-white

font-medium

transition

"

>

Hospitals

</button>



{

hospitalsOpen

&&

(

<div

className="

absolute

top-10

left-0

w-[320px]

bg-slate-950

border

border-slate-800

rounded-3xl

p-5

shadow-2xl

"

>

{

hospitals.map((hospital)=>(

<Link

key={hospital.name}

href={hospital.href}

className="

flex

items-center

gap-3

p-4

rounded-2xl

hover:bg-slate-900

transition

"

>

<Building2

size={20}

className="text-blue-400"

/>

{hospital.name}

</Link>

))

}

</div>

)

}

</div>


{

navLinks.map((link)=>(

<Link

key={link.name}

href={link.href}

className={`

relative

font-medium

transition-all

duration-300

${

pathname===link.href

?

"text-white"

:

"text-slate-300 hover:text-white"

}

`}

>

{link.name}


{

pathname===link.href

&&

<div

className="

absolute

left-0

-bottom-2

w-full

h-[2px]

bg-blue-500

rounded-full

"

/>

}

</Link>

))

}

</div>

</div>

<div className="hidden lg:flex items-center gap-4">


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

placeholder="Search Hospitals"

className="

w-[220px]

bg-slate-900

border

border-slate-800

rounded-2xl

pl-11

pr-4

py-3

text-white

outline-none

focus:border-blue-500

transition

"

/>

</div>



<a

href="tel:+919116734675"

className="

flex

items-center

gap-3

px-6

py-3

rounded-2xl

border

border-white/[0.08]

text-white

hover:border-blue-500

hover:bg-slate-900

transition

"

>

<Phone size={18}/>

Call

</a>



<a

href="https://wa.me/919116734675"

target="_blank"

className="

flex

items-center

gap-3

px-6

py-3

rounded-2xl

bg-gradient-to-r

from-green-600

to-green-500

text-white

font-semibold

hover:scale-[1.03]

transition

shadow-[0_0_35px_rgba(22,163,74,.25)]

"

>

<MessageCircle size={18}/>

WhatsApp

</a>

<a

href="/#consultation"

className="

group

relative

overflow-hidden

px-7

py-3

rounded-2xl

bg-gradient-to-r

from-blue-600

to-cyan-500

text-white

font-semibold

hover:scale-[1.03]

transition-all

duration-500

shadow-[0_0_50px_rgba(37,99,235,.35)]

"

>

<div

className="

absolute

inset-0

bg-white/10

translate-x-[-100%]

skew-x-12

group-hover:translate-x-[100%]

transition-all

duration-700

"

/>

<span className="relative flex items-center gap-2">

Start Free Consultation

<ChevronRight

size={18}

className="group-hover:translate-x-1 transition"

/>

</span>

</a>

</div>


<button

className="lg:hidden text-white"

onClick={()=>setMenuOpen(!menuOpen)}

>

{

menuOpen

?

<X size={30}/>

:

<Menu size={30}/>

}

</button>

</div>

</div>

</nav>

</>

)

}