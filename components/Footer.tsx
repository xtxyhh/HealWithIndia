import Link from "next/link";

import {

Mail,
Phone,
Globe,

ArrowRight,

ShieldCheck,
BadgeCheck,

HeartPulse,

Sparkles,

MapPin,

} from "lucide-react";





const quickLinks=[

{label:"Home",href:"/"},

{label:"About Us",href:"/about"},

{label:"Hospitals",href:"/hospitals"},

{label:"Treatments",href:"/treatments"},

{label:"Contact",href:"/contact"},

];





const treatmentLinks=[

{

label:"Cardiology",

href:"/treatments/cardiology",

},

{

label:"Oncology",

href:"/treatments/oncology",

},

{

label:"Orthopedics",

href:"/treatments/orthopedics",

},

{

label:"IVF Treatment",

href:"/treatments/ivf",

},

{

label:"Kidney Transplant",

href:"/treatments/kidney-transplant",

},

];





const legalLinks=[

{

label:"Privacy Policy",

href:"/privacy-policy",

},

{

label:"Terms",

href:"/terms",

},

{

label:"FAQ",

href:"/faq",

},

];





const certifications=[

"HIPAA Compliant",

"JCI Accredited",

"International Patients",

"Secure Data",

];





const patientLocations=[

{

country:"USA",

top:"25%",

left:"18%",

},

{

country:"UK",

top:"18%",

left:"46%",

},

{

country:"UAE",

top:"35%",

left:"60%",

},

{

country:"Nigeria",

top:"48%",

left:"48%",

},

{

country:"India",

top:"42%",

left:"67%",

},

];







export default function Footer(){



return(



<footer

className="

relative

overflow-hidden

bg-[#020817]

border-t

border-slate-800

text-white

"

>





{/* AURORA */}



<div className="absolute inset-0 -z-0">





<div

className="

absolute

top-[-250px]

left-[-200px]

w-[650px]

h-[650px]

rounded-full

bg-blue-600/20

blur-[180px]

animate-pulse

"

/>





<div

className="

absolute

bottom-[-300px]

right-[-150px]

w-[650px]

h-[650px]

rounded-full

bg-cyan-500/15

blur-[180px]

animate-pulse

"

/>





<div

className="

absolute

inset-0

bg-[radial-gradient(circle_at_center,rgba(37,99,235,.08),transparent_70%)]

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





</div>







<div

className="

relative

z-10

max-w-[1450px]

mx-auto

px-6

lg:px-10

py-24

"

>





<div

className="

grid

lg:grid-cols-[1.4fr_1fr]

gap-16

items-center

"

>





{/* BRAND */}



<div>





<div

className="

inline-flex

items-center

gap-3

px-5

py-3

rounded-full

border

border-blue-500/20

bg-blue-500/10

backdrop-blur-xl

text-blue-300

text-sm

font-medium

"

>

<Sparkles size={16}/>

Trusted By International Patients

</div>







<h1

className="

mt-8

text-[60px]

sm:text-[80px]

lg:text-[110px]

font-bold

leading-[0.9]

tracking-[-5px]

"

>

HealWith



<span

className="

bg-gradient-to-r

from-blue-400

via-cyan-300

to-cyan-500

bg-clip-text

text-transparent

"

>

India

</span>

</h1>







<p

className="

mt-8

max-w-2xl

text-lg

lg:text-xl

leading-[1.9]

text-slate-400

"

>

Connecting international patients

with India's leading hospitals,

experienced specialists

and affordable world-class healthcare.



From consultation

to recovery,

we stay with you

every step of your journey.

</p>







{/* CERTIFICATIONS */}



<div

className="

flex

flex-wrap

gap-4

mt-10

"

>

{

certifications.map((item)=>(



<div

key={item}

className="

px-5

py-3

rounded-full

border

border-slate-700

bg-slate-900/60

backdrop-blur-xl

text-sm

text-slate-200

hover:border-blue-500

hover:bg-blue-500/10

transition-all

duration-300

"

>

{item}

</div>



))

}

</div>







{/* CONTACT */}



<div

className="

grid

sm:grid-cols-3

gap-5

mt-14

"

>





<div

className="

rounded-[28px]

border

border-slate-800

bg-slate-900/50

backdrop-blur-2xl

p-6

"

>

<Mail

size={24}

className="text-blue-400"

/>



<p

className="

text-slate-500

text-sm

mt-4

"

>

EMAIL

</p>



<h3

className="

text-white

font-semibold

mt-2

"

>

care@healwithindia.com

</h3>

</div>







<div

className="

rounded-[28px]

border

border-slate-800

bg-slate-900/50

backdrop-blur-2xl

p-6

"

>

<Phone

size={24}

className="text-green-400"

/>



<p

className="

text-slate-500

text-sm

mt-4

"

>

PHONE

</p>



<h3

className="

text-white

font-semibold

mt-2

"

>

+91 91167 34675

</h3>

</div>







<div

className="

rounded-[28px]

border

border-slate-800

bg-slate-900/50

backdrop-blur-2xl

p-6

"

>

<Globe

size={24}

className="text-cyan-400"

/>



<p

className="

text-slate-500

text-sm

mt-4

"

>

SUPPORT

</p>



<h3

className="

text-white

font-semibold

mt-2

"

>

24/7 Worldwide

</h3>

</div>



</div>



{/* WORLD MAP */}

<div

className="

relative

h-[450px]

rounded-[40px]

border

border-slate-800

bg-slate-900/50

backdrop-blur-3xl

overflow-hidden

"

>

<div

className="

absolute

inset-0

bg-[url('/images/world-map.png')]

bg-contain

bg-center

bg-no-repeat

opacity-25

"

/>              {/* PATIENT LOCATIONS */}



              {

                patientLocations.map((item)=>(



                  <div

                    key={item.country}

                    className="absolute"

                    style={{

                      top:item.top,

                      left:item.left,

                    }}

                  >



                    <div className="relative">



                      <div

                        className="

                        absolute

                        inset-0

                        h-5

                        w-5

                        rounded-full

                        bg-blue-500

                        animate-ping

                        opacity-50

                        "

                      />





                      <div

                        className="

                        relative

                        h-5

                        w-5

                        rounded-full

                        bg-gradient-to-r

                        from-blue-500

                        to-cyan-400

                        border

                        border-white/20

                        shadow-[0_0_30px_rgba(59,130,246,.7)]

                        "

                      />





                      <div

                        className="

                        absolute

                        top-8

                        left-1/2

                        -translate-x-1/2

                        whitespace-nowrap

                        px-4

                        py-2

                        rounded-full

                        bg-slate-950/80

                        backdrop-blur-xl

                        border

                        border-slate-700

                        text-xs

                        text-white

                        "

                      >

                        {item.country}

                      </div>



                    </div>



                  </div>



                ))

              }





              {/* CENTER CARD */}



              <div

                className="

                absolute

                left-1/2

                top-1/2

                -translate-x-1/2

                -translate-y-1/2

                rounded-[32px]

                border

                border-white/[0.08]

                bg-slate-950/70

                backdrop-blur-3xl

                p-8

                shadow-[0_20px_70px_rgba(0,0,0,.45)]

                "

              >



                <div className="flex items-center gap-4">



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



                    <MapPin

                      size={32}

                      className="text-blue-400"

                    />



                  </div>





                  <div>



                    <h3

                      className="

                      text-3xl

                      font-bold

                      "

                    >

                      100+

                    </h3>



                    <p

                      className="

                      text-slate-400

                      mt-1

                      "

                    >

                      Countries Served

                    </p>



                  </div>



                </div>



              </div>



            </div>



          </div>







          {/* LINKS SECTION */}



          <div

            className="

            grid

            md:grid-cols-3

            gap-12

            mt-24

            "

          >





            {/* QUICK LINKS */}



            <div>



              <h3

                className="

                text-2xl

                font-bold

                text-white

                mb-8

                "

              >

                Quick Links

              </h3>





                <div className="space-y-4">



                  {

                    quickLinks.map((link)=>(



                      <Link

                        key={link.label}

                        href={link.href}

                        className="

                        group

                        flex

                        items-center

                        gap-4

                        text-slate-400

                        hover:text-white

                        transition-all

                        duration-300

                        "

                      >



                        <div

                          className="

                          h-10

                          w-10

                          rounded-xl

                          border

                          border-slate-800

                          bg-slate-900

                          flex

                          items-center

                          justify-center

                          group-hover:border-blue-500

                          group-hover:bg-blue-500/10

                          transition-all

                          "

                        >



                          <ArrowRight

                            size={16}

                            className="

                            group-hover:translate-x-1

                            transition-all

                            "

                          />



                        </div>



                        {link.label}



                      </Link>



                    ))

                  }



                </div>



              </div>







              {/* TREATMENTS */}



              <div>



                <h3

                  className="

                  text-2xl

                  font-bold

                  text-white

                  mb-8

                  "

                >

                  Treatments

                </h3>





                <div className="space-y-4">



                  {

                    treatmentLinks.map((item)=>(



                      <Link

                        key={item.label}

                        href={item.href}

                        className="

                        group

                        flex

                        items-center

                        gap-4

                        text-slate-400

                        hover:text-white

                        transition-all

                        duration-300

                        "

                      >



                        <div

                          className="

                          h-10

                          w-10

                          rounded-xl

                          border

                          border-slate-800

                          bg-slate-900

                          flex

                          items-center

                          justify-center

                          group-hover:border-cyan-500

                          group-hover:bg-cyan-500/10

                          transition-all

                          "

                        >



                          <ArrowRight

                            size={16}

                            className="

                            group-hover:translate-x-1

                            transition-all

                            "

                          />



                        </div>



                        {item.label}



                      </Link>



                    ))

                  }



                </div>



              </div>







              {/* LEGAL */}



              <div>



                <h3

                  className="

                  text-2xl

                  font-bold

                  text-white

                  mb-8

                  "

                >

                  Legal

                </h3>





                <div className="space-y-4">



                  {

                    legalLinks.map((item)=>(



                      <Link

                        key={item.label}

                        href={item.href}

                        className="

                        group

                        flex

                        items-center

                        gap-4

                        text-slate-400

                        hover:text-white

                        transition-all

                        duration-300

                        "

                      >



                        <div

                          className="

                          h-10

                          w-10

                          rounded-xl

                          border

                          border-slate-800

                          bg-slate-900

                          flex

                          items-center

                          justify-center

                          group-hover:border-purple-500

                          group-hover:bg-purple-500/10

                          transition-all

                          "

                        >



                          <ArrowRight

                            size={16}

                            className="

                            group-hover:translate-x-1

                            transition-all

                            "

                          />



                        </div>



                        {item.label}



                      </Link>



                    ))

                  }



                </div>



              </div>



            </div>          {/* HOSPITAL LOGOS MARQUEE */}

            <div className="mt-24 overflow-hidden">

              <div className="text-center mb-10">

                <p className="text-slate-400 uppercase tracking-[4px] text-sm">

                  Trusted Hospital Network

                </p>



                <h2 className="text-4xl font-bold mt-4">

                  India's Leading

                  <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">

                    {" "}Healthcare Institutions

                  </span>

                </h2>

              </div>



              <div className="relative overflow-hidden">

                <div

                  className="

                  flex

                  gap-8

                  whitespace-nowrap

                  animate-[marquee_28s_linear_infinite]

                  "

                >

                  {

                    [

                      "apollo",

                      "fortis",

                      "medanta",

                      "max",

                      "manipal",

                      "narayana",

                      "apollo",

                      "fortis",

                      "medanta",

                      "max",

                    ].map((hospital,index)=>(



                      <div

                        key={index}

                        className="

                        h-28

                        w-[220px]

                        rounded-[28px]

                        border

                        border-slate-800

                        bg-slate-900/60

                        backdrop-blur-3xl

                        flex

                        items-center

                        justify-center

                        hover:border-blue-500

                        transition-all

                        duration-300

                        "

                      >



                        <img

                          src={`/images/${hospital}.png`}

                          alt={hospital}

                          className="

                          w-[130px]

                          h-[55px]

                          object-contain

                          opacity-80

                          grayscale

                          hover:opacity-100

                          hover:grayscale-0

                          transition-all

                          "

                        />



                      </div>



                    ))

                  }

                </div>

              </div>

            </div>







            {/* TESTIMONIAL MARQUEE */}



            <div className="mt-24 overflow-hidden">



              <div

                className="

                flex

                gap-6

                whitespace-nowrap

                animate-[marquee_38s_linear_infinite]

                "

              >



                {

                  [

                    "Saved over 80% on my heart surgery.",

                    "Excellent doctors and seamless experience.",

                    "The best decision for my family.",

                    "World-class hospitals at affordable prices.",

                    "Dedicated support throughout treatment.",

                    "Amazing care and hospitality.",

                  ].map((quote,index)=>(



                    <div

                      key={index}

                      className="

                      shrink-0

                      rounded-[28px]

                      border

                      border-slate-800

                      bg-slate-900/50

                      backdrop-blur-2xl

                      px-8

                      py-6

                      text-slate-300

                      "

                    >

                      "{quote}"

                    </div>



                  ))

                }

              </div>

            </div>







            {/* NEWSLETTER */}



            <div

              className="

              relative

              overflow-hidden

              mt-24

              rounded-[40px]

              border

              border-slate-800

              bg-slate-950/60

              backdrop-blur-3xl

              p-10

              md:p-14

              "

            >



              <div

                className="

                absolute

                top-[-100px]

                right-[-80px]

                w-[300px]

                h-[300px]

                rounded-full

                bg-blue-500/10

                blur-[150px]

                "

              />





              <div

                className="

                grid

                lg:grid-cols-[1.5fr_1fr]

                gap-10

                items-center

                "

              >



                <div>



                  <div

                    className="

                    inline-flex

                    items-center

                    gap-2

                    px-5

                    py-3

                    rounded-full

                    border

                    border-blue-500/20

                    bg-blue-500/10

                    text-blue-300

                    "

                  >

                    <Sparkles size={16}/>

                    Newsletter

                  </div>





                  <h2

                    className="

                    mt-8

                    text-5xl

                    font-bold

                    leading-tight

                    "

                  >

                    Healthcare

                    <span

                      className="

                      bg-gradient-to-r

                      from-blue-400

                      to-cyan-400

                      bg-clip-text

                      text-transparent

                      "

                    >

                      {" "}Insights

                    </span>

                  </h2>





                  <p

                    className="

                    mt-6

                    text-lg

                    text-slate-400

                    leading-[1.9]

                    "

                  >

                    Receive updates about treatments,

                    hospitals,

                    healthcare innovations,

                    and patient success stories.

                  </p>



                </div>







                <div className="space-y-4">



                  <input

                    placeholder="Enter your email"

                    className="

                    w-full

                    rounded-[22px]

                    border

                    border-slate-800

                    bg-slate-900

                    px-6

                    py-5

                    text-white

                    outline-none

                    focus:border-blue-500

                    transition-all

                    "

                  />





                  <button

                    className="

                    group

                    relative

                    overflow-hidden

                    w-full

                    rounded-[22px]

                    bg-gradient-to-r

                    from-blue-600

                    to-cyan-500

                    px-8

                    py-5

                    text-white

                    font-semibold

                    hover:scale-[1.02]

                    transition-all

                    shadow-[0_0_45px_rgba(37,99,235,.35)]

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



                    <span className="relative flex items-center justify-center gap-3">

                      Subscribe

                      <ArrowRight

                        size={18}

                        className="group-hover:translate-x-1 transition"

                      />

                    </span>

                  </button>

                </div>

              </div>

            </div>





  {/* FOOTER BOTTOM */}

  <div
    className="
    mt-24
    pt-10
    border-t
    border-slate-800
    flex
    flex-col
    lg:flex-row
    items-center
    justify-between
    gap-8
    "
  >

    <p className="text-slate-500 text-center lg:text-left">

      © 2026 HealWithIndia.

      All Rights Reserved.

    </p>



    <div

      className="

      flex

      flex-wrap

      justify-center

      gap-8

      "

    >

      {

        legalLinks.map((item)=>(

          <Link

            key={item.label}

            href={item.href}

            className="

            text-slate-500

            hover:text-white

            transition-all

            "

          >

            {item.label}

          </Link>

        ))

      }

    </div>

  </div>



    </div>

  </div>

  </footer>

  );

  }