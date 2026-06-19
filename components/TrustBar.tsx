import {

Hospital,
DollarSign,
Plane,

UserRound,

Globe,
FileText,

ShieldCheck,
BadgeCheck,

Star,

HeartHandshake,

Sparkles,

ChevronRight,

} from "lucide-react";





export default function TrustBar(){





const features=[



{

icon:Hospital,

title:"JCI & NABH Accredited Hospitals",

description:

"Access internationally accredited hospitals trusted by patients from over 100 countries.",

color:"from-blue-500/20 to-cyan-500/20",

iconColor:"text-blue-400",

},





{

icon:DollarSign,

title:"70%–90% Cost Savings",

description:

"Receive world-class treatment while saving significantly compared to the US, UK and Europe.",

color:"from-cyan-500/20 to-blue-500/20",

iconColor:"text-cyan-400",

},





{

icon:Plane,

title:"Medical Visa Assistance",

description:

"Complete support for invitation letters, medical visas, airport pickup and accommodation.",

color:"from-indigo-500/20 to-blue-500/20",

iconColor:"text-indigo-400",

},





{

icon:UserRound,

title:"Dedicated Patient Coordinator",

description:

"One personal coordinator manages your entire treatment journey from start to finish.",

color:"from-green-500/20 to-cyan-500/20",

iconColor:"text-green-400",

},





{

icon:Globe,

title:"International Patient Services",

description:

"Interpreter support, local assistance and personalized care for overseas patients.",

color:"from-cyan-500/20 to-blue-500/20",

iconColor:"text-cyan-400",

},





{

icon:FileText,

title:"Free Medical Review",

description:

"Our specialists review your reports and connect you with suitable hospitals and doctors.",

color:"from-purple-500/20 to-blue-500/20",

iconColor:"text-purple-400",

},

];





return(



<section

className="

relative

overflow-hidden

py-28

bg-[#020817]

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

blur-[170px]

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

WHY PATIENTS TRUST HEALWITHINDIA

</div>







<h2

className="

mt-8

text-[44px]

sm:text-[58px]

lg:text-[76px]

font-bold

leading-[0.95]

tracking-[-3px]

text-white

"

>

End-To-End



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

Medical Travel Support

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

From diagnosis and hospital selection

to travel,

treatment and recovery support,

we simplify every step

of your healthcare journey

with complete transparency

and world-class patient care.

</p>





{/* TRUST MINI BADGES */}



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

bg-slate-900/60

border

border-slate-800

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

bg-slate-900/60

border

border-slate-800

backdrop-blur-xl

text-slate-200

text-sm

"

>

🏥 JCI & NABH Hospitals

</div>





<div

className="

px-5

py-3

rounded-full

bg-slate-900/60

border

border-slate-800

backdrop-blur-xl

text-slate-200

text-sm

"

>

💙 Dedicated Care Team

</div>



</div>







{/* FEATURE GRID START */}



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

features.map((feature,index)=>{



const Icon=feature.icon;



return(



<div

key={feature.title}

className={`

group

relative

overflow-hidden

rounded-[36px]

border

border-slate-800

bg-slate-900/50

backdrop-blur-3xl

p-8

hover:border-blue-500/40

hover:-translate-y-2

transition-all

duration-500

shadow-[0_20px_70px_rgba(0,0,0,.25)]



${

index===1

?

"xl:translate-y-12"

:

""

}



${

index===4

?

"xl:-translate-y-12"

:

""

}



`}

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

bg-gradient-to-r



${feature.color}



blur-[100px]

opacity-0

group-hover:opacity-100

transition-all

duration-700

`}

/>





<div

className="

absolute

inset-0

bg-gradient-to-br

from-white/[0.03]

to-transparent

opacity-0

group-hover:opacity-100

transition-all

duration-500

"

/>







{/* ICON */}



<div

className={`

relative

h-20

w-20

rounded-[28px]

bg-gradient-to-br



${feature.color}



border

border-white/[0.08]

backdrop-blur-xl

flex

items-center

justify-center

group-hover:scale-110

group-hover:rotate-3

transition-all

duration-500

`}

>





<div

className="

absolute

inset-0

rounded-[28px]

bg-white/[0.03]

"

/>





<Icon

size={36}

className={`

relative

${feature.iconColor}

`}

/>





</div>







{/* SMALL BADGE */}



<div

className="

mt-8

inline-flex

items-center

gap-2

px-4

py-2

rounded-full

border

border-slate-700

bg-slate-950/70

text-slate-300

text-xs

tracking-wide

"

>

<BadgeCheck

size={14}

className="text-blue-400"

/>



Trusted Worldwide

</div>







{/* TITLE */}



<h3

className="

mt-7

text-[28px]

font-bold

leading-[1.2]

text-white

"

>

{feature.title}

</h3>







{/* DESCRIPTION */}



<p

className="

mt-5

text-slate-400

leading-[1.9]

text-[16px]

"

>

{feature.description}

</p>







{/* CTA */}



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

Learn More



<ChevronRight

size={18}

className="

group-hover:translate-x-1

transition-all

"

/>

</div>







{/* BORDER SHINE */}



<div

className="

absolute

inset-0

rounded-[36px]

border

border-transparent

group-hover:border-blue-500/20

transition-all

duration-500

"

/>





</div>



)



})

}





</div>







{/* FLOATING TRUST STATS */}



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

group

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

90%

</h3>



<p

className="

mt-4

text-slate-400

"

>

Cost Savings

</p>

</div>







<div

className="

group

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







<div

className="

group

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

Patient Support

</p>

</div>







<div

className="

group

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

20+

</h3>



<p

className="

mt-4

text-slate-400

"

>

Specialties

</p>

</div>

</div>

      {/* PREMIUM TRUST STRIP */}



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



        {/* GLOW */}



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

          bottom-[-120px]

          right-[-60px]

          w-[320px]

          h-[320px]

          rounded-full

          bg-cyan-500/10

          blur-[140px]

          "

        />







        <div

          className="

          relative

          grid

          md:grid-cols-4

          gap-8

          "

        >





          {/* ITEM 1 */}



          <div

            className="

            flex

            items-center

            gap-5

            rounded-[28px]

            border

            border-white/[0.05]

            bg-slate-950/50

            p-6

            hover:border-green-500/30

            transition-all

            duration-300

            "

          >



            <div

              className="

              h-16

              w-16

              rounded-[22px]

              bg-green-500/10

              border

              border-green-500/20

              flex

              items-center

              justify-center

              "

            >

              <BadgeCheck

                size={30}

                className="text-green-400"

              />

            </div>





            <div>

              <h3

                className="

                text-white

                font-semibold

                text-lg

                "

              >

                Accredited

              </h3>



              <p className="text-slate-400 text-sm mt-1">

                JCI & NABH Hospitals

              </p>

            </div>

          </div>







          {/* ITEM 2 */}



          <div

            className="

            flex

            items-center

            gap-5

            rounded-[28px]

            border

            border-white/[0.05]

            bg-slate-950/50

            p-6

            hover:border-blue-500/30

            transition-all

            duration-300

            "

          >



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

              <ShieldCheck

                size={30}

                className="text-blue-400"

              />

            </div>





            <div>

              <h3

                className="

                text-white

                font-semibold

                text-lg

                "

              >

                Secure

              </h3>



              <p className="text-slate-400 text-sm mt-1">

                Patient Data Protection

              </p>

            </div>

          </div>







          {/* ITEM 3 */}



          <div

            className="

            flex

            items-center

            gap-5

            rounded-[28px]

            border

            border-white/[0.05]

            bg-slate-950/50

            p-6

            hover:border-cyan-500/30

            transition-all

            duration-300

            "

          >



            <div

              className="

              h-16

              w-16

              rounded-[22px]

              bg-cyan-500/10

              border

              border-cyan-500/20

              flex

              items-center

              justify-center

              "

            >

              <HeartHandshake

                size={30}

                className="text-cyan-400"

              />

            </div>





            <div>

              <h3

                className="

                text-white

                font-semibold

                text-lg

                "

              >

                Dedicated Care

              </h3>



              <p className="text-slate-400 text-sm mt-1">

                Personal Coordinator

              </p>

            </div>

          </div>







          {/* ITEM 4 */}



          <div

            className="

            flex

            items-center

            gap-5

            rounded-[28px]

            border

            border-white/[0.05]

            bg-slate-950/50

            p-6

            hover:border-yellow-500/30

            transition-all

            duration-300

            "

          >



            <div

              className="

              h-16

              w-16

              rounded-[22px]

              bg-yellow-500/10

              border

              border-yellow-500/20

              flex

              items-center

              justify-center

              "

            >

              <Star

                size={30}

                className="text-yellow-400"

              />

            </div>





            <div>

              <h3

                className="

                text-white

                font-semibold

                text-lg

                "

              >

                Transparent

              </h3>



              <p className="text-slate-400 text-sm mt-1">

                Honest Pricing

              </p>

            </div>

          </div>



        </div>

      </div>







      {/* FINAL CTA */}



      <div

        className="

        text-center

        mt-24

        "

      >



        <h3

          className="

          text-4xl

          md:text-5xl

          font-bold

          text-white

          "

        >

          Ready To Begin

          <span

            className="

            bg-gradient-to-r

            from-blue-400

            to-cyan-400

            bg-clip-text

            text-transparent

            "

          >

            {" "}Your Healthcare Journey?

          </span>

        </h3>





        <p

          className="

          mt-6

          max-w-2xl

          mx-auto

          text-lg

          text-slate-400

          leading-[1.9]

          "

        >

          Connect with our care team and receive

          expert guidance,

          hospital recommendations

          and a free treatment estimate.



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