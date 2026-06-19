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
ChevronDown,

Search,

HeartPulse,
Activity,
Bone,
Baby,
ShieldPlus,

Building2,

Globe,
Sparkles,
BadgeCheck,

} from "lucide-react";



export default function Navbar() {

const pathname=usePathname();

const [menuOpen,setMenuOpen]=useState(false);

const [treatmentsOpen,setTreatmentsOpen]=useState(false);

const [hospitalsOpen,setHospitalsOpen]=useState(false);

const [mobileTreatments,setMobileTreatments]=useState(false);

const [mobileHospitals,setMobileHospitals]=useState(false);





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

description:"Advanced Heart Care",

},

{

name:"Oncology",

href:"/treatments/oncology",

icon:Activity,

description:"Cancer Treatment",

},

{

name:"Orthopedics",

href:"/treatments/orthopedics",

icon:Bone,

description:"Bones & Joints",

},

{

name:"IVF Treatment",

href:"/treatments/ivf",

icon:Baby,

description:"Fertility Care",

},

{

name:"Kidney Transplant",

href:"/treatments/kidney-transplant",

icon:ShieldPlus,

description:"Transplant Excellence",

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



{/* TOP ANNOUNCEMENT BAR */}



<div

className="

relative

overflow-hidden

border-b

border-white/[0.05]

"

>





<div

className="

absolute

inset-0

bg-gradient-to-r

from-blue-700

via-blue-600

to-cyan-500

"

/>





<div

className="

absolute

inset-0

opacity-[0.08]

bg-[linear-gradient(rgba(255,255,255,1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,1)_1px,transparent_1px)]

bg-[size:50px_50px]

"

/>





<div

className="

relative

max-w-7xl

mx-auto

px-5

"

>

<div

className="

h-10

flex

items-center

justify-center

gap-4

text-white

text-xs

sm:text-sm

font-medium

overflow-x-auto

whitespace-nowrap

scrollbar-none

"

>

<div className="flex items-center gap-2">

<BadgeCheck

size={15}

/>

JCI Accredited Hospitals

</div>



<span className="opacity-50">

•

</span>



<div className="flex items-center gap-2">

<Globe

size={15}

/>

100+ Countries

</div>



<span className="opacity-50">

•

</span>



<div className="flex items-center gap-2">

<Sparkles

size={15}

/>

24/7 Patient Support

</div>



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



<div

className="

max-w-[1500px]

mx-auto

px-5

"

>



<div

className="

h-[92px]

flex

items-center

justify-between

"

>





{/* LEFT SIDE */}



<div

className="

flex

items-center

gap-16

"

>





<Link

href="/"

className="

group

flex

items-center

gap-5

hover:scale-[1.02]

transition-all

duration-500

"

>





<div className="relative">



<div

className="

absolute

inset-0

rounded-full

bg-blue-500/20

blur-3xl

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

shadow-[0_0_45px_rgba(37,99,235,.25)]

"

/>

</div>





<div>



<h1

className="

text-[30px]

lg:text-[34px]

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

tracking-wide

mt-1

"

>

International Patient Care

</p>



</div>

</Link>







{/* DESKTOP MENU */}



<div

className="

hidden

lg:flex

items-center

gap-9

"

>



{/* TREATMENTS START */}



<div

className="relative"

onMouseEnter={()=>setTreatmentsOpen(true)}

onMouseLeave={()=>setTreatmentsOpen(false)}

>



<button

className="

flex

items-center

gap-2

font-medium

text-slate-300

hover:text-white

transition-all

"

>

Treatments

<ChevronDown

size={16}

className={`

transition

duration-300

${

treatmentsOpen

?

"rotate-180"

:

""

}

`}

/>

</button>



{

treatmentsOpen

&&

(

<div

className="

absolute

top-14

left-0

w-[420px]

rounded-[32px]

border

border-slate-800

bg-slate-950/90

backdrop-blur-3xl

p-6

shadow-[0_30px_90px_rgba(0,0,0,.45)]

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

                          group

                          flex

                          items-center

                          gap-5

                          p-5

                          rounded-[24px]

                          hover:bg-slate-900

                          transition-all

                          duration-300

                          "

                        >



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

                            group-hover:bg-blue-500/20

                            transition-all

                            "

                          >



                            <Icon

                              size={24}

                              className="text-blue-400"

                            />



                          </div>





                          <div className="flex-1">



                            <h3

                              className="

                              text-white

                              font-semibold

                              text-lg

                              "

                            >

                              {item.name}

                            </h3>



                            <p

                              className="

                              text-slate-500

                              text-sm

                              mt-1

                              "

                            >

                              {item.description}

                            </p>



                          </div>





                          <ChevronRight

                            size={18}

                            className="

                            text-slate-600

                            group-hover:text-blue-400

                            group-hover:translate-x-1

                            transition-all

                            "

                          />



                        </Link>



                      )



                    })

                  }



                </div>



              </div>

            )

          }

        </div>







        {/* HOSPITALS */}



        <div

          className="relative"

          onMouseEnter={()=>setHospitalsOpen(true)}

          onMouseLeave={()=>setHospitalsOpen(false)}

        >



          <button

            className="

            flex

            items-center

            gap-2

            font-medium

            text-slate-300

            hover:text-white

            transition-all

            "

          >

            Hospitals



            <ChevronDown

              size={16}

              className={`

              transition

              duration-300

              ${

                hospitalsOpen

                ?

                "rotate-180"

                :

                ""

              }

              `}

            />



          </button>





          {

            hospitalsOpen

            &&

            (

              <div

                className="

                absolute

                top-14

                left-0

                w-[350px]

                rounded-[32px]

                border

                border-slate-800

                bg-slate-950/90

                backdrop-blur-3xl

                p-5

                shadow-[0_30px_90px_rgba(0,0,0,.45)]

                "

              >



                <div className="space-y-2">



                  {

                    hospitals.map((hospital)=>(



                      <Link

                        key={hospital.name}

                        href={hospital.href}

                        className="

                        group

                        flex

                        items-center

                        gap-4

                        p-4

                        rounded-[22px]

                        hover:bg-slate-900

                        transition-all

                        duration-300

                        "

                      >



                        <div

                          className="

                          h-12

                          w-12

                          rounded-xl

                          bg-blue-500/10

                          border

                          border-blue-500/20

                          flex

                          items-center

                          justify-center

                          "

                        >



                          <Building2

                            size={20}

                            className="text-blue-400"

                          />



                        </div>





                        <div className="flex-1">



                          <h3

                            className="

                            text-white

                            font-medium

                            "

                          >

                            {hospital.name}

                          </h3>



                        </div>





                        <ChevronRight

                          size={18}

                          className="

                          text-slate-600

                          group-hover:text-blue-400

                          group-hover:translate-x-1

                          transition-all

                          "

                        />



                      </Link>



                    ))

                  }



                </div>



              </div>

            )

          }



        </div>







        {/* NORMAL LINKS */}



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

              py-2



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

                (

                  <div

                    className="

                    absolute

                    left-0

                    -bottom-1

                    w-full

                    h-[2px]

                    rounded-full

                    bg-gradient-to-r

                    from-blue-500

                    to-cyan-400

                    "

                  />

                )

              }



            </Link>



          ))

        }



      </div>



    </div>







    {/* RIGHT SIDE */}



    <div

      className="

      hidden

      lg:flex

      items-center

      gap-4

      "

    >



      {/* SEARCH */}



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

          w-[240px]

          bg-slate-900/70

          border

          border-slate-800

          rounded-2xl

          pl-11

          pr-4

          py-3

          text-white

          outline-none

          focus:border-blue-500

          focus:bg-slate-900

          transition-all

          duration-300

          "

        />



      </div>







      {/* CALL */}



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

        transition-all

        "

      >



        <Phone size={18}/>



        Call



      </a>







      {/* WHATSAPP */}



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

        transition-all

        shadow-[0_0_35px_rgba(22,163,74,.25)]

        "

      >



        <MessageCircle size={18}/>



        WhatsApp



      </a>







      {/* MAIN CTA */}



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

            className="

            group-hover:translate-x-1

            transition

            "

          />



        </span>



      </a>

      {/* MOBILE MENU BUTTON */}



      <button

        className="

        lg:hidden

        text-white

        p-2

        rounded-xl

        hover:bg-slate-900

        transition

        "

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

</div>

</nav>







{/* MOBILE DRAWER */}



<div

className={`

fixed

top-0

right-0

h-screen

w-[88%]

max-w-[420px]

z-[100]

bg-slate-950/95

backdrop-blur-[40px]

border-l

border-slate-800

transition-all

duration-500



${

menuOpen

?

"translate-x-0"

:

"translate-x-full"

}



`}

>





<div

className="

h-[90px]

px-6

border-b

border-slate-800

flex

items-center

justify-between

"

>



<div>

<h2

className="

text-2xl

font-bold

bg-gradient-to-r

from-white

to-blue-200

bg-clip-text

text-transparent

"

>

HealWithIndia

</h2>



<p

className="

text-slate-400

text-sm

mt-1

"

>

International Patient Care

</p>

</div>





<button

onClick={()=>setMenuOpen(false)}

className="

text-white

"

>

<X size={28}/>

</button>



</div>







<div

className="

overflow-y-auto

h-[calc(100vh-90px)]

px-6

py-8

"

>





{/* HOME + LINKS */}



<div className="space-y-2">



{

navLinks.map((link)=>(



<Link

key={link.name}

href={link.href}

onClick={()=>setMenuOpen(false)}

className={`

flex

items-center

justify-between

rounded-2xl

px-5

py-4

font-medium

transition-all



${



pathname===link.href



?



"bg-blue-500/10 text-white border border-blue-500/20"



:



"text-slate-300 hover:bg-slate-900"



}



`}

>

{link.name}



<ChevronRight size={18}/>

</Link>



))

}



</div>







{/* TREATMENTS */}



<div className="mt-8">



<button

onClick={()=>setMobileTreatments(!mobileTreatments)}

className="

w-full

flex

items-center

justify-between

text-white

font-semibold

mb-4

"

>

Treatments



<ChevronDown

size={18}

className={`

transition



${



mobileTreatments



?



"rotate-180"



:



""



}



`}

/>

</button>





{

mobileTreatments

&&

<div className="space-y-3">



{

treatments.map((item)=>{



const Icon=item.icon;



return(



<Link

key={item.name}

href={item.href}

onClick={()=>setMenuOpen(false)}

className="

flex

items-center

gap-4

p-4

rounded-2xl

bg-slate-900

hover:bg-slate-800

transition-all

"

>





<div

className="

h-12

w-12

rounded-xl

bg-blue-500/10

border

border-blue-500/20

flex

items-center

justify-center

"

>

<Icon

size={22}

className="text-blue-400"

/>

</div>





<div>

<h3

className="

text-white

font-semibold

"

>

{item.name}

</h3>



<p

className="

text-slate-500

text-sm

"

>

{item.description}

</p>

</div>

</Link>



)

})

}



</div>

}

</div>







{/* HOSPITALS */}



<div className="mt-10">



<button

onClick={()=>setMobileHospitals(!mobileHospitals)}

className="

w-full

flex

items-center

justify-between

text-white

font-semibold

mb-4

"

>

Hospitals



<ChevronDown

size={18}

className={`

transition



${



mobileHospitals



?



"rotate-180"



:



""



}



`}

/>

</button>





{

mobileHospitals

&&

<div className="space-y-3">



{

hospitals.map((hospital)=>(



<Link

key={hospital.name}

href={hospital.href}

onClick={()=>setMenuOpen(false)}

className="

flex

items-center

gap-4

p-4

rounded-2xl

bg-slate-900

hover:bg-slate-800

transition-all

"

>





<div

className="

h-12

w-12

rounded-xl

bg-blue-500/10

border

border-blue-500/20

flex

items-center

justify-center

"

>

<Building2

size={20}

className="text-blue-400"

/>

</div>



<span

className="

text-white

font-medium

"

>

{hospital.name}

</span>

</Link>



))

}



</div>

}

</div>







{/* MOBILE CTA */}



<div

className="

mt-12

space-y-4

"

>





<a

href="tel:+919116734675"

className="

flex

items-center

justify-center

gap-3

w-full

py-4

rounded-2xl

border

border-slate-700

text-white

hover:border-blue-500

transition

"

>

<Phone size={20}/>

Call Now

</a>







<a

href="https://wa.me/919116734675"

target="_blank"

className="

flex

items-center

justify-center

gap-3

w-full

py-4

rounded-2xl

bg-gradient-to-r

from-green-600

to-green-500

text-white

font-semibold

shadow-[0_0_35px_rgba(22,163,74,.25)]

"

>

<MessageCircle size={20}/>

WhatsApp

</a>







<a

href="/#consultation"

onClick={()=>setMenuOpen(false)}

className="

group

flex

items-center

justify-center

gap-3

w-full

py-4

rounded-2xl

bg-gradient-to-r

from-blue-600

to-cyan-500

text-white

font-semibold

shadow-[0_0_50px_rgba(37,99,235,.35)]

hover:scale-[1.02]

transition-all

"

>

Start Free Consultation



<ChevronRight

size={18}

className="

group-hover:translate-x-1

transition

"

/>

</a>



</div>



</div>



</div>





{/* MOBILE OVERLAY */}



{

menuOpen

&&

<div

onClick={()=>setMenuOpen(false)}

className="

fixed

inset-0

z-[90]

bg-black/60

backdrop-blur-sm

lg:hidden

"

/>

}





</>

)

}