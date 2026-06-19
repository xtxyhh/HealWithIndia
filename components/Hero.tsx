import Image from "next/image";

import {
  ShieldCheck,
  Globe,
  Building2,
  UserRoundCheck,
  ArrowRight,
  CheckCircle,
  HeartPulse,
  Stethoscope,
  Sparkles,
} from "lucide-react";

export default function Hero() {

  const treatments = [
    "Cardiology",
    "Oncology",
    "Orthopedics",
    "Organ Transplant",
    "IVF",
    "Neurology",
  ];


  const countries = [
    "🇺🇸 USA",
    "🇬🇧 UK",
    "🇦🇪 UAE",
    "🇨🇦 Canada",
    "🇳🇬 Nigeria",
    "🇦🇺 Australia",
  ];


  const stats = [
    {
      number: "50+",
      label: "Partner Hospitals",
      color: "text-blue-400",
      border: "hover:border-blue-500/60",
    },

    {
      number: "90%",
      label: "Cost Savings",
      color: "text-green-400",
      border: "hover:border-green-500/60",
    },

    {
      number: "24/7",
      label: "Patient Support",
      color: "text-cyan-400",
      border: "hover:border-cyan-500/60",
    },
  ];


  return (

    <>

      <section

        id="home"

        className="

        relative

        overflow-hidden

        bg-[#020817]

        text-white

        "

      >

        {/* BACKGROUND */}


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

            blur-[170px]

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

            blur-[170px]

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

          sm:px-8

          lg:px-10

          pt-24

          md:pt-32

          pb-20

          "

        >



          <div

            className="

            grid

            lg:grid-cols-2

            gap-16

            xl:gap-24

            items-center

            "

          >



            {/* LEFT SIDE */}



            <div className="relative">



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

                backdrop-blur-2xl

                text-blue-300

                text-sm

                font-medium

                shadow-[0_0_40px_rgba(37,99,235,.15)]

                "

              >

                <Sparkles size={16} />

                Trusted By International Patients

              </div>





              <h1

                className="

                mt-8

                text-[42px]

                sm:text-[55px]

                lg:text-[72px]

                xl:text-[88px]

                font-bold

                leading-[0.95]

                tracking-[-2px]

                "

              >

                World-Class

                <br />



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

                  Medical Care

                </span>



                <br />



                In India



                <br />



                Save Up To



                <span className="text-green-400">

                  {" "}90%

                </span>

              </h1>





              <p

                className="

                mt-8

                max-w-2xl

                text-base

                sm:text-lg

                lg:text-xl

                leading-[1.9]

                text-slate-300

                "

              >

                Access internationally accredited hospitals,

                experienced doctors,

                and dedicated care coordinators for

                Cardiology,

                Oncology,

                Organ Transplants,

                IVF,

                Orthopedics

                and advanced treatments —

                all at a fraction of the cost.



              </p>





              {/* TREATMENTS */}



              <div

                className="

                flex

                flex-wrap

                gap-3

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

                      backdrop-blur-xl

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





              {/* CTA */}



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

                  px-8

                  py-5

                  rounded-[22px]

                  bg-blue-600

                  hover:bg-blue-700

                  text-lg

                  font-semibold

                  shadow-[0_0_60px_rgba(37,99,235,.35)]

                  transition-all

                  duration-300

                  hover:scale-[1.02]

                  "

                >

                  Get Free Medical Opinion



                  <ArrowRight

                    size={20}

                    className="

                    transition

                    group-hover:translate-x-1

                    "

                  />

                </a>



                <a

                  href="/treatments"

                  className="

                  px-8

                  py-5

                  rounded-[22px]

                  border

                  border-slate-700

                  bg-slate-900/50

                  backdrop-blur-xl

                  hover:border-blue-500

                  hover:bg-blue-500/5

                  transition-all

                  text-lg

                  font-medium

                  "

                >

                  Explore Treatments

                </a>

              </div>

              {/* TRUST FEATURES */}


              <div

                className="

                flex

                flex-wrap

                gap-x-8

                gap-y-5

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

                grid-cols-1

                sm:grid-cols-3

                gap-5

                mt-14

                "

              >

                {

                  stats.map((item)=>(

                    <div

                      key={item.label}

                      className={`

                      rounded-[28px]

                      border

                      border-slate-800

                      ${item.border}

                      bg-slate-900/50

                      backdrop-blur-2xl

                      p-7

                      transition-all

                      duration-300

                      hover:-translate-y-1

                      `}

                    >

                      <div

                        className={`

                        text-4xl

                        lg:text-5xl

                        font-bold

                        ${item.color}

                        `}

                      >

                        {item.number}

                      </div>



                      <p

                        className="

                        text-slate-400

                        mt-3

                        "

                      >

                        {item.label}

                      </p>

                    </div>

                  ))

                }

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

                  gap-3

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

                        backdrop-blur-xl

                        text-slate-200

                        hover:border-blue-500

                        transition-all

                        duration-300

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



            <div

              className="

              relative

              flex

              justify-center

              items-center

              min-h-[600px]

              lg:min-h-[760px]

              "

            >



              {/* BACK GLOW */}



              <div

                className="

                absolute

                w-[450px]

                h-[450px]

                sm:w-[550px]

                sm:h-[550px]

                rounded-full

                bg-blue-500/20

                blur-[150px]

                "

              />



              <div

                className="

                absolute

                top-[20%]

                right-[12%]

                w-[220px]

                h-[220px]

                rounded-full

                bg-cyan-500/20

                blur-[110px]

                "

              />





              {/* GLASS CIRCLE */}



              <div

                className="

                absolute

                w-[320px]

                h-[320px]

                sm:w-[430px]

                sm:h-[430px]

                rounded-full

                border

                border-white/10

                bg-white/[0.03]

                backdrop-blur-3xl

                "

              />





              {/* DOCTOR IMAGE */}



              <Image

                src="/images/hero-doctor.png"

                alt="Doctor"

                width={820}

                height={820}

                priority

                className="

                relative

                z-10

                object-contain

                w-full

                max-w-[580px]

                lg:max-w-[680px]

                drop-shadow-[0_50px_120px_rgba(0,0,0,.85)]

                animate-[float_6s_ease-in-out_infinite]

                "

              />





              {/* TOP LEFT CARD */}



              <div

                className="

                absolute

                left-0

                top-10

                sm:left-4

                z-20

                rounded-[28px]

                border

                border-white/10

                bg-slate-900/70

                backdrop-blur-3xl

                px-6

                py-5

                shadow-[0_20px_60px_rgba(0,0,0,.45)]

                animate-[float_7s_ease-in-out_infinite]

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

                      text-lg

                      font-bold

                      "

                    >

                      Hospitals

                    </h3>

                  </div>

                </div>

              </div>





              {/* TOP RIGHT CARD */}



              <div

                className="

                absolute

                top-10

                right-0

                sm:right-4

                z-20

                rounded-[28px]

                border

                border-white/10

                bg-slate-900/70

                backdrop-blur-3xl

                px-7

                py-6

                shadow-[0_20px_60px_rgba(0,0,0,.45)]

                animate-[float_8s_ease-in-out_infinite]

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

                  text-slate-300

                  mt-2

                  "

                >

                  Cost Savings

                </p>

              </div>

              {/* BOTTOM LEFT CARD */}



              <div

                className="

                absolute

                bottom-8

                left-0

                sm:left-6

                z-20

                rounded-[28px]

                border

                border-white/10

                bg-slate-900/70

                backdrop-blur-3xl

                px-7

                py-6

                shadow-[0_20px_60px_rgba(0,0,0,.45)]

                animate-[float_9s_ease-in-out_infinite]

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

                    <HeartPulse

                      size={26}

                      className="text-green-400"

                    />

                  </div>



                  <div>

                    <h3 className="text-2xl font-bold">

                      100+

                    </h3>



                    <p className="text-slate-400">

                      Countries Served

                    </p>

                  </div>

                </div>

              </div>





              {/* BOTTOM RIGHT CARD */}



              <div

                className="

                absolute

                bottom-10

                right-0

                sm:right-6

                z-20

                rounded-[28px]

                border

                border-white/10

                bg-slate-900/70

                backdrop-blur-3xl

                px-7

                py-6

                shadow-[0_20px_60px_rgba(0,0,0,.45)]

                animate-[float_10s_ease-in-out_infinite]

                "

              >

                <div className="flex items-center gap-4">



                  <div

                    className="

                    h-14

                    w-14

                    rounded-2xl

                    bg-cyan-500/20

                    flex

                    items-center

                    justify-center

                    "

                  >

                    <Stethoscope

                      size={26}

                      className="text-cyan-400"

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

                      Care Support

                    </p>

                  </div>

                </div>

              </div>



            </div>



          </div>



        </div>



      </section>







      {/* HOSPITAL NETWORK */}



      <section

        className="

        relative

        py-24

        overflow-hidden

        bg-black

        "

      >



        <div

          className="

          absolute

          inset-0

          bg-[radial-gradient(circle_at_center,rgba(37,99,235,.08),transparent_70%)]

          "

        />





        <div className="max-w-7xl mx-auto px-6 relative">



          <div className="text-center">



            <p

              className="

              uppercase

              tracking-[5px]

              text-blue-400

              text-sm

              font-semibold

              "

            >

              Trusted Hospital Network

            </p>





            <h2

              className="

              text-4xl

              md:text-5xl

              lg:text-6xl

              font-bold

              mt-6

              "

            >

              India's Leading



              <span

                className="

                bg-gradient-to-r

                from-blue-400

                to-cyan-400

                bg-clip-text

                text-transparent

                "

              >

                {" "}Healthcare Institutions

              </span>

            </h2>





            <p

              className="

              text-slate-400

              text-lg

              md:text-xl

              max-w-3xl

              mx-auto

              mt-8

              leading-relaxed

              "

            >

              Collaborating with internationally

              accredited hospitals and experienced

              specialists to deliver world-class

              medical care for patients globally.

            </p>

          </div>





          <div

            className="

            grid

            grid-cols-2

            md:grid-cols-3

            lg:grid-cols-6

            gap-6

            mt-20

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

              ].map((hospital)=>(



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

                    width={140}

                    height={60}

                    className="

                    object-contain

                    w-[120px]

                    h-[50px]

                    opacity-80

                    grayscale

                    group-hover:opacity-100

                    group-hover:grayscale-0

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

            p-8

            md:p-10

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



                <h3 className="text-xl font-semibold mt-5">

                  Accredited Hospitals

                </h3>



                <p className="text-slate-400 mt-3">

                  JCI & NABH certified hospitals

                  following international standards.

                </p>

              </div>





              <div className="text-center">

                <Globe

                  size={38}

                  className="mx-auto text-blue-400"

                />



                <h3 className="text-xl font-semibold mt-5">

                  Global Patients

                </h3>



                <p className="text-slate-400 mt-3">

                  Trusted by patients from

                  over 100 countries worldwide.

                </p>

              </div>





              <div className="text-center">

                <UserRoundCheck

                  size={38}

                  className="mx-auto text-cyan-400"

                />



                <h3 className="text-xl font-semibold mt-5">

                  Dedicated Coordinator

                </h3>



                <p className="text-slate-400 mt-3">

                  Personal support throughout

                  your treatment journey.

                </p>

              </div>





              <div className="text-center">

                <Building2

                  size={38}

                  className="mx-auto text-purple-400"

                />



                <h3 className="text-xl font-semibold mt-5">

                  End-To-End Care

                </h3>



                <p className="text-slate-400 mt-3">

                  Consultation, travel,

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