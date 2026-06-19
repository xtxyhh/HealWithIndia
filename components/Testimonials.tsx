import Image from "next/image";

import {

Quote,

Star,

Sparkles,

Globe,

ChevronRight,

} from "lucide-react";





export default function Testimonials(){





const testimonials=[



{

image:"/images/testimonials/patient1.jpg",

name:"Michael R.",

country:"Texas, USA",

treatment:"Heart Bypass Surgery",

saved:"$110,000",

quote:

"The quality of care was exceptional. HealWithIndia coordinated everything from hospital selection to travel and recovery support.",

gradient:"from-blue-500/20 to-cyan-500/20",

},





{

image:"/images/testimonials/patient2.jpg",

name:"Sarah W.",

country:"London, UK",

treatment:"Knee Replacement",

saved:"$35,000",

quote:

"The doctors were outstanding and the entire journey was stress-free. The savings compared to treatment in the UK were significant.",

gradient:"from-cyan-500/20 to-blue-500/20",

},





{

image:"/images/testimonials/patient3.jpg",

name:"Daniel O.",

country:"Lagos, Nigeria",

treatment:"IVF Treatment",

saved:"$12,000",

quote:

"Professional support from start to finish. We received excellent care and achieved the results we hoped for.",

gradient:"from-indigo-500/20 to-blue-500/20",

},

];







return(



<section

className="

relative

overflow-hidden

py-32

bg-[#020817]

"

>





{/* AURORA */}



<div className="absolute inset-0 -z-0">





<div

className="

absolute

top-[-250px]

left-[-180px]

w-[650px]

h-[650px]

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

right-[-180px]

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

bg-[size:80px_80px]

"

/>





<div

className="

absolute

inset-0

bg-[radial-gradient(circle_at_center,rgba(37,99,235,.08),transparent_70%)]

"

/>



</div>







<div

className="

relative

z-10

max-w-[1450px]

mx-auto

px-6

lg:px-10

"

>





<div

className="

text-center

max-w-4xl

mx-auto

"

>





<div

className="

inline-flex

items-center

gap-3

px-6

py-3

rounded-full

border

border-blue-500/20

bg-blue-500/10

backdrop-blur-xl

text-blue-300

text-sm

font-semibold

tracking-wide

"

>

<Sparkles size={16}/>

SUCCESS STORIES

</div>







<h2

className="

mt-8

text-[44px]

sm:text-[60px]

lg:text-[76px]

font-bold

leading-[0.95]

tracking-[-3px]

text-white

"

>

Trusted By Patients



<span

className="

block

bg-gradient-to-r

from-blue-400

via-cyan-300

to-cyan-500

bg-clip-text

text-transparent

"

>

Worldwide

</span>

</h2>







<p

className="

mt-8

text-lg

lg:text-xl

leading-[1.9]

text-slate-400

max-w-3xl

mx-auto

"

>

Patients from around the world

choose India for

advanced healthcare,

experienced specialists

and life-changing cost savings.



Their stories reflect

the trust,

care and excellence

that define HealWithIndia.

</p>







<div

className="

mt-12

flex

flex-wrap

justify-center

gap-4

"

>





<div

className="

px-5

py-3

rounded-full

border

border-slate-800

bg-slate-900/60

backdrop-blur-xl

text-slate-200

text-sm

"

>

🌍 Patients From 100+ Countries

</div>





<div

className="

px-5

py-3

rounded-full

border

border-slate-800

bg-slate-900/60

backdrop-blur-xl

text-slate-200

text-sm

"

>

⭐ 98% Patient Satisfaction

</div>





<div

className="

px-5

py-3

rounded-full

border

border-slate-800

bg-slate-900/60

backdrop-blur-xl

text-slate-200

text-sm

"

>

🏥 50+ Partner Hospitals

</div>



</div>







{/* TESTIMONIAL GRID START */}



<div

className="

mt-24

grid

md:grid-cols-2

xl:grid-cols-3

gap-8

"

>

{

testimonials.map((patient,index)=>{



return(



<div

key={patient.name}

className={`

group

relative

overflow-hidden

rounded-[38px]

border

border-slate-800

bg-slate-900/50

backdrop-blur-3xl

hover:border-blue-500/40

hover:-translate-y-2

transition-all

duration-500

shadow-[0_25px_80px_rgba(0,0,0,.35)]



${

index===1

?

"xl:translate-y-12"

:

""

}



`}

>





{/* GLOW */}



<div

className={`

absolute

top-[-120px]

right-[-80px]

w-[250px]

h-[250px]

rounded-full

bg-gradient-to-r



${patient.gradient}



blur-[120px]

opacity-0

group-hover:opacity-100

transition-all

duration-700

`}

/>







{/* IMAGE */}



<div

className="

relative

h-[320px]

overflow-hidden

"

>





<Image

src={patient.image}

alt={patient.name}

fill

className="

object-cover

group-hover:scale-105

transition-all

duration-700

"

/>







<div

className="

absolute

inset-0

bg-gradient-to-t

from-slate-950

via-slate-950/10

to-transparent

"

/>







<div

className="

absolute

top-6

right-6

h-16

w-16

rounded-[22px]

bg-slate-950/70

backdrop-blur-xl

border

border-white/[0.08]

flex

items-center

justify-center

"

>

<Quote

size={28}

className="text-blue-400"

/>

</div>







<div

className="

absolute

bottom-6

left-6

flex

gap-3

"

>





<div

className="

px-4

py-2

rounded-full

bg-slate-950/70

backdrop-blur-xl

border

border-white/[0.08]

text-sm

text-white

"

>

🌍 {patient.country}

</div>







<div

className="

px-4

py-2

rounded-full

bg-green-500/10

backdrop-blur-xl

border

border-green-500/20

text-sm

text-green-300

font-semibold

"

>

Saved {patient.saved}

</div>



</div>





</div>







{/* CONTENT */}



<div className="p-8">





<div className="flex gap-2 mb-6">

{

Array.from({length:5}).map((_,i)=>(



<Star

key={i}

size={18}

className="

text-yellow-400

fill-yellow-400

drop-shadow-[0_0_10px_rgba(250,204,21,.4)]

"

/>



))

}

</div>







<p

className="

text-slate-300

leading-[1.95]

text-[17px]

"

>

"

{patient.quote}

"

</p>







<div

className="

mt-8

pt-8

border-t

border-slate-800

"

>





<h3

className="

text-[28px]

font-bold

text-white

"

>

{patient.name}

</h3>







<p

className="

mt-2

text-slate-400

"

>

{patient.country}

</p>







<div

className="

mt-6

inline-flex

items-center

gap-3

px-5

py-3

rounded-full

bg-blue-500/10

border

border-blue-500/20

text-blue-300

text-sm

font-medium

"

>

<Globe

size={16}

/>



{patient.treatment}

</div>







<div

className="

mt-8

flex

items-center

gap-3

text-blue-400

font-semibold

group-hover:gap-4

transition-all

duration-300

"

>

Read Full Story



<ChevronRight

size={18}

className="

group-hover:translate-x-1

transition-all

"

/>

</div>





</div>





</div>





</div>



)



})

}





</div>







{/* FLOATING STATS */}



<div

className="

grid

grid-cols-2

lg:grid-cols-4

gap-7

mt-28

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

text-center

hover:border-blue-500

hover:-translate-y-1

transition-all

duration-300

"

>

<h3

className="

text-5xl

font-bold

bg-gradient-to-r

from-blue-400

to-cyan-400

bg-clip-text

text-transparent

"

>

100+

</h3>



<p

className="

mt-4

text-slate-400

"

>

Countries Served

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

text-center

hover:border-blue-500

hover:-translate-y-1

transition-all

duration-300

"

>

<h3

className="

text-5xl

font-bold

bg-gradient-to-r

from-blue-400

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

text-slate-400

"

>

Patient Satisfaction

</p>

</div>

{/* REMAINING STATS */}

<div

className="

rounded-[34px]

border

border-slate-800

bg-slate-900/50

backdrop-blur-3xl

p-8

text-center

hover:border-blue-500

hover:-translate-y-1

transition-all

duration-300

"

>

<h3

className="

text-5xl

font-bold

bg-gradient-to-r

from-blue-400

to-cyan-400

bg-clip-text

text-transparent

"

>

24/7

</h3>



<p

className="

mt-4

text-slate-400

"

>

Global Support

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

text-center

hover:border-blue-500

hover:-translate-y-1

transition-all

duration-300

"

>

<h3

className="

text-5xl

font-bold

bg-gradient-to-r

from-blue-400

to-cyan-400

bg-clip-text

text-transparent

"

>

50+

</h3>



<p

className="

mt-4

text-slate-400

"

>

Partner Hospitals

</p>

</div>



</div>







{/* TRUST STRIP */}



<div

className="

relative

overflow-hidden

mt-28

rounded-[42px]

border

border-slate-800

bg-slate-900/50

backdrop-blur-3xl

p-8

md:p-10

"

>





<div

className="

absolute

top-[-100px]

left-[-50px]

w-[300px]

h-[300px]

rounded-full

bg-blue-500/10

blur-[130px]

"

/>





<div

className="

absolute

bottom-[-100px]

right-[-50px]

w-[300px]

h-[300px]

rounded-full

bg-cyan-500/10

blur-[130px]

"

/>







<div

className="

relative

grid

md:grid-cols-3

gap-8

"

>





<div

className="

text-center

rounded-[28px]

border

border-white/[0.05]

bg-slate-950/50

p-8

"

>

<div className="text-5xl mb-5">

🌍

</div>



<h3

className="

text-2xl

font-bold

text-white

"

>

Worldwide Trust

</h3>



<p

className="

mt-3

text-slate-400

leading-relaxed

"

>

Patients from more than

100 countries

trust India's healthcare

system.

</p>

</div>







<div

className="

text-center

rounded-[28px]

border

border-white/[0.05]

bg-slate-950/50

p-8

"

>

<div className="text-5xl mb-5">

❤️

</div>



<h3

className="

text-2xl

font-bold

text-white

"

>

Personalized Care

</h3>



<p

className="

mt-3

text-slate-400

leading-relaxed

"

>

Dedicated coordinators

guide you through

every stage

of treatment.

</p>

</div>







<div

className="

text-center

rounded-[28px]

border

border-white/[0.05]

bg-slate-950/50

p-8

"

>

<div className="text-5xl mb-5">

🏥

</div>



<h3

className="

text-2xl

font-bold

text-white

"

>

Top Hospitals

</h3>



<p

className="

mt-3

text-slate-400

leading-relaxed

"

>

Partnered with

India's leading

JCI and NABH

accredited hospitals.

</p>

</div>



</div>



</div>







{/* FINAL CTA */}



<div

className="

text-center

mt-28

"

>





<h3

className="

text-[44px]

md:text-[60px]

font-bold

leading-[1]

text-white

"

>

Ready To Become



<span

className="

block

bg-gradient-to-r

from-blue-400

via-cyan-300

to-cyan-500

bg-clip-text

text-transparent

"

>

Our Next Success Story?

</span>

</h3>







<p

className="

mt-8

max-w-3xl

mx-auto

text-lg

leading-[1.9]

text-slate-400

"

>

Get expert guidance,

hospital recommendations

and a free treatment estimate

from our dedicated

international patient team.

</p>







<a

href="/#consultation"

className="

group

inline-flex

items-center

gap-3

mt-10

px-9

py-5

rounded-[24px]

bg-gradient-to-r

from-blue-600

to-cyan-500

text-white

font-semibold

text-lg

hover:scale-[1.03]

transition-all

duration-500

shadow-[0_0_60px_rgba(37,99,235,.35)]

"

>

Start Free Consultation



<ChevronRight

size={20}

className="

group-hover:translate-x-1

transition-all

"

/>

</a>





</div>





</div>

</div>

</section>

)

}