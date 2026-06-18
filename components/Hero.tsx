import Image from "next/image";

import {

ShieldCheck,
Globe,
Building2,
UserRoundCheck,
ArrowRight,
CheckCircle,

} from "lucide-react";


export default function Hero() {

const treatments=[

"Cardiology",
"Oncology",
"Organ Transplants",
"Orthopedics",
"IVF",

]

const countries=[

"🇺🇸 USA",
"🇬🇧 UK",
"🇦🇪 UAE",
"🇳🇬 Nigeria",
"🇨🇦 Canada",
"🇦🇺 Australia",

]

const hospitals=[

"apollo",
"fortis",
"medanta",
"max",
"manipal",
"narayana",

]

return(

<>

<section

id="home"

className="

relative

overflow-hidden

bg-[#020617]

text-white

"

>


{/* BACKGROUND */}


<div className="absolute inset-0">


<div className="

absolute

top-[-200px]

left-[-150px]

w-[700px]

h-[700px]

bg-blue-600/20

blur-[180px]

rounded-full

"/>



<div className="

absolute

bottom-[-250px]

right-[-150px]

w-[700px]

h-[700px]

bg-cyan-500/10

blur-[180px]

rounded-full

"/>


<div className="

absolute

inset-0

bg-[radial-gradient(circle_at_center,rgba(37,99,235,0.10),transparent_70%)]

"/>


</div>




<div className="

relative

max-w-[1450px]

mx-auto

px-6

lg:px-10

pt-24

pb-28

">


<div className="

grid

lg:grid-cols-2

gap-24

items-center

">




{/* LEFT */}


<div>


<div className="

inline-flex

items-center

gap-2

px-6

py-3

rounded-full

border

border-blue-500/30

bg-blue-500/10

backdrop-blur-2xl

text-blue-300

text-sm

font-medium

shadow-[0_0_40px_rgba(37,99,235,.15)]

">

<CheckCircle

size={16}

/>

Trusted By International Patients

</div>





<h1

className="

mt-10

text-[65px]

lg:text-[88px]

font-bold

leading-[0.95]

tracking-[-4px]

"

>

Trusted

Medical Care

<br/>

In

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

{" "}India

</span>

<br/>

Save Up To

<span

className="

text-green-400

"

>

{" "}90%

</span>

<br/>

Without

Compromising

Quality

</h1>





<p

className="

mt-10

text-xl

leading-[1.9]

text-slate-300

max-w-2xl

"

>

Access JCI & NABH accredited hospitals,

internationally trained doctors,

and personalized healthcare support

for Cardiology, Oncology,

Organ Transplants, IVF

and advanced treatments.

</p>





<div

className="

flex

flex-wrap

gap-4

mt-10

"

>

{

treatments.map((item)=>(

<div

key={item}

className="

px-5

py-3

rounded-full

border

border-slate-700

bg-slate-900/60

backdrop-blur-2xl

text-sm

text-slate-200

hover:border-blue-500

hover:bg-blue-500/10

transition-all

duration-300

cursor-pointer

"

>

{item}

</div>

))

}

</div>





<div

className="

flex

flex-col

sm:flex-row

gap-5

mt-12

"

>


<a

href="#consultation"

className="

group

flex

items-center

justify-center

gap-3

px-10

py-5

rounded-[22px]

bg-blue-600

hover:bg-blue-700

font-semibold

text-lg

shadow-[0_0_60px_rgba(37,99,235,.35)]

transition-all

hover:scale-[1.03]

"

>

Get Free Medical Opinion

<ArrowRight

size={20}

className="

group-hover:translate-x-1

transition

"

/>

</a>



<a

href="/treatments"

className="

px-10

py-5

rounded-[22px]

border

border-slate-700

bg-slate-900/50

backdrop-blur-xl

hover:border-blue-500

hover:bg-blue-500/5

text-lg

font-medium

transition-all

"

>

Explore Treatments

</a>

</div>


              {/* TRUST ROW */}

              <div

                className="

                flex

                flex-wrap

                gap-8

                mt-14

                "

              >

                <div className="flex items-center gap-3">

                  <ShieldCheck

                    size={20}

                    className="text-green-400"

                  />

                  <span className="text-slate-300">

                    HIPAA Compliant

                  </span>

                </div>



                <div className="flex items-center gap-3">

                  <Building2

                    size={20}

                    className="text-blue-400"

                  />

                  <span className="text-slate-300">

                    JCI Accredited Hospitals

                  </span>

                </div>



                <div className="flex items-center gap-3">

                  <UserRoundCheck

                    size={20}

                    className="text-cyan-400"

                  />

                  <span className="text-slate-300">

                    Dedicated Care Coordinator

                  </span>

                </div>



                <div className="flex items-center gap-3">

                  <Globe

                    size={20}

                    className="text-purple-400"

                  />

                  <span className="text-slate-300">

                    Patients Worldwide

                  </span>

                </div>

              </div>



              {/* STATS */}



              <div

                className="

                grid

                grid-cols-3

                gap-7

                mt-16

                "

              >



                <div

                  className="

                  rounded-[28px]

                  border

                  border-slate-800

                  bg-slate-900/50

                  backdrop-blur-2xl

                  p-8

                  hover:border-blue-500

                  transition-all

                  "

                >

                  <div

                    className="

                    text-5xl

                    font-bold

                    text-blue-400

                    "

                  >

                    50+

                  </div>



                  <p

                    className="

                    text-slate-400

                    mt-3

                    "

                  >

                    Partner Hospitals

                  </p>

                </div>





                <div

                  className="

                  rounded-[28px]

                  border

                  border-slate-800

                  bg-slate-900/50

                  backdrop-blur-2xl

                  p-8

                  hover:border-green-500

                  transition-all

                  "

                >

                  <div

                    className="

                    text-5xl

                    font-bold

                    text-green-400

                    "

                  >

                    90%

                  </div>



                  <p

                    className="

                    text-slate-400

                    mt-3

                    "

                  >

                    Healthcare Savings

                  </p>

                </div>





                <div

                  className="

                  rounded-[28px]

                  border

                  border-slate-800

                  bg-slate-900/50

                  backdrop-blur-2xl

                  p-8

                  hover:border-cyan-500

                  transition-all

                  "

                >

                  <div

                    className="

                    text-5xl

                    font-bold

                    text-cyan-400

                    "

                  >

                    24/7

                  </div>



                  <p

                    className="

                    text-slate-400

                    mt-3

                    "

                  >

                    Patient Support

                  </p>

                </div>

              </div>





              {/* COUNTRIES */}



              <div className="mt-14">

                <p

                  className="

                  text-slate-400

                  mb-5

                  "

                >

                  Patients From

                </p>



                <div

                  className="

                  flex

                  flex-wrap

                  gap-4

                  "

                >

                  {

                    countries.map((country)=>(

                      <div

                        key={country}

                        className="

                        px-5

                        py-3

                        rounded-full

                        border

                        border-slate-800

                        bg-slate-900/50

                        backdrop-blur-2xl

                        hover:border-blue-500

                        transition-all

                        "

                      >

                        {country}

                      </div>

                    ))

                  }

                </div>

              </div>



            </div>



            {/* RIGHT SIDE */}

            <div className="relative flex justify-center">



              {/* MAIN GLOW */}



              <div

                className="

                absolute

                w-[600px]

                h-[600px]

                rounded-full

                bg-blue-500/20

                blur-[170px]

                "

              />



              <div

                className="

                absolute

                top-[20%]

                right-[10%]

                w-[250px]

                h-[250px]

                rounded-full

                bg-cyan-500/20

                blur-[110px]

                "

              />





              {/* DOCTOR IMAGE */}



              <Image

                src="/images/hero-doctor.png"

                alt="HealWithIndia Doctor"

                width={950}

                height={950}

                priority

                className="

                relative

                z-10

                object-contain

                scale-[1.12]

                -translate-y-24

                drop-shadow-[0_60px_120px_rgba(0,0,0,.85)]

                "

              />






              {/* LEFT FLOATING CARD */}



              <div

                className="

                absolute

                left-0

                top-20

                z-20

                backdrop-blur-2xl

                bg-slate-900/60

                border

                border-white/10

                rounded-[28px]

                px-7

                py-6

                shadow-[0_20px_60px_rgba(0,0,0,.45)]

                "

              >



                <div className="flex items-center gap-4">



                  <div

                    className="

                    h-14

                    w-14

                    rounded-2xl

                    bg-blue-500/20

                    flex

                    items-center

                    justify-center

                    "

                  >



                    <Building2

                      size={26}

                      className="text-blue-400"

                    />



                  </div>





                  <div>



                    <p className="text-slate-400 text-sm">

                      Accredited

                    </p>



                    <h3

                      className="

                      font-bold

                      text-xl

                      text-white

                      "

                    >

                      Partner Hospitals

                    </h3>



                  </div>



                </div>

              </div>







              {/* TOP RIGHT CARD */}



              <div

                className="

                absolute

                top-20

                right-0

                z-20

                backdrop-blur-2xl

                bg-slate-900/60

                border

                border-white/10

                rounded-[28px]

                px-8

                py-7

                shadow-[0_20px_60px_rgba(0,0,0,.45)]

                "

              >



                <div

                  className="

                  text-6xl

                  font-bold

                  text-green-400

                  leading-none

                  "

                >

                  90%

                </div>



                <p

                  className="

                  mt-3

                  text-slate-300

                  "

                >

                  Average Cost Savings

                </p>

              </div>







              {/* BOTTOM LEFT CARD */}



              <div

                className="

                absolute

                bottom-10

                left-4

                z-20

                backdrop-blur-2xl

                bg-slate-900/60

                border

                border-white/10

                rounded-[28px]

                px-8

                py-7

                shadow-[0_20px_60px_rgba(0,0,0,.45)]

                "

              >



                <div

                  className="

                  text-6xl

                  font-bold

                  text-blue-400

                  leading-none

                  "

                >

                  100+

                </div>



                <p

                  className="

                  mt-3

                  text-slate-300

                  "

                >

                  Countries Served

                </p>

              </div>







              {/* BOTTOM RIGHT CARD */}



              <div

                className="

                absolute

                bottom-14

                right-0

                z-20

                backdrop-blur-2xl

                bg-slate-900/60

                border

                border-white/10

                rounded-[28px]

                px-7

                py-6

                shadow-[0_20px_60px_rgba(0,0,0,.45)]

                "

              >



                <div className="flex items-center gap-4">



                  <div

                    className="

                    h-14

                    w-14

                    rounded-2xl

                    bg-green-500/20

                    flex

                    items-center

                    justify-center

                    "

                  >



                    <ShieldCheck

                      size={26}

                      className="text-green-400"

                    />



                  </div>





                  <div>



                    <h3

                      className="

                      text-2xl

                      font-bold

                      "

                    >

                      24/7

                    </h3>



                    <p className="text-slate-400">

                      Patient Support

                    </p>



                  </div>



                </div>

              </div>



            </div>



          </div>



        </div>



      </section>

      {/* HOSPITAL NETWORK */}

      <section className="relative py-24 bg-black overflow-hidden">

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(37,99,235,.08),transparent_70%)]" />

        <div className="max-w-7xl mx-auto px-6 relative">

          <div className="text-center">

            <p className="uppercase tracking-[5px] text-blue-400 text-sm font-semibold">

              Trusted Hospital Network

            </p>

            <h2 className="text-5xl lg:text-6xl font-bold mt-6">

              India's Leading

              <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">

                {" "}Healthcare Institutions

              </span>

            </h2>

            <p className="text-slate-400 text-xl max-w-3xl mx-auto mt-8">

              Collaborating with internationally accredited hospitals

              and experienced specialists to provide

              exceptional medical care.

            </p>

          </div>



          <div

            className="

            grid

            grid-cols-2

            md:grid-cols-3

            lg:grid-cols-6

            gap-7

            mt-20

            "

          >

            {

              hospitals.map((hospital)=>(

                <div

                  key={hospital}

                  className="

                  group

                  h-32

                  rounded-[30px]

                  border

                  border-slate-800

                  bg-slate-950/70

                  backdrop-blur-3xl

                  flex

                  items-center

                  justify-center

                  hover:border-blue-500

                  hover:-translate-y-2

                  hover:shadow-[0_0_45px_rgba(37,99,235,.18)]

                  transition-all

                  duration-500

                  "

                >

                  <Image

                    src={`/images/${hospital}.png`}

                    alt={hospital}

                    width={160}

                    height={70}

                    className="

                    object-contain

                    max-h-16

                    w-auto

                    opacity-80

                    grayscale

                    group-hover:grayscale-0

                    group-hover:opacity-100

                    transition-all

                    duration-500

                    "

                  />

                </div>

              ))

            }

          </div>





          {/* TRUST BAR */}



          <div

            className="

            mt-24

            rounded-[40px]

            border

            border-slate-800

            bg-slate-950/50

            backdrop-blur-3xl

            p-10

            "

          >

            <div

              className="

              grid

              md:grid-cols-4

              gap-10

              "

            >



              <div className="text-center">

                <ShieldCheck

                  size={38}

                  className="mx-auto text-green-400"

                />



                <h3

                  className="

                  text-xl

                  font-semibold

                  mt-5

                  "

                >

                  Accredited Hospitals

                </h3>



                <p

                  className="

                  text-slate-400

                  mt-3

                  "

                >

                  JCI & NABH certified institutions

                  with global standards.

                </p>

              </div>





              <div className="text-center">

                <Globe

                  size={38}

                  className="mx-auto text-blue-400"

                />



                <h3

                  className="

                  text-xl

                  font-semibold

                  mt-5

                  "

                >

                  Global Patients

                </h3>



                <p

                  className="

                  text-slate-400

                  mt-3

                  "

                >

                  Serving patients from

                  more than 100 countries.

                </p>

              </div>





              <div className="text-center">

                <UserRoundCheck

                  size={38}

                  className="mx-auto text-cyan-400"

                />



                <h3

                  className="

                  text-xl

                  font-semibold

                  mt-5

                  "

                >

                  Dedicated Coordinator

                </h3>



                <p

                  className="

                  text-slate-400

                  mt-3

                  "

                >

                  Personal assistance

                  throughout your journey.

                </p>

              </div>





              <div className="text-center">

                <Building2

                  size={38}

                  className="mx-auto text-purple-400"

                />



                <h3

                  className="

                  text-xl

                  font-semibold

                  mt-5

                  "

                >

                  End-To-End Care

                </h3>



                <p

                  className="

                  text-slate-400

                  mt-3

                  "

                >

                  Consultation,

                  travel assistance,

                  treatment and follow-up.

                </p>

              </div>



            </div>

          </div>

        </div>

      </section>

    </>

  )

}