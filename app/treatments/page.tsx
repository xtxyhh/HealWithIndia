export const metadata = {
  title: "Medical Treatments in India | HealWithIndia",
  description:
    "Explore cardiology, oncology, orthopedics, IVF, kidney transplant and advanced medical treatments in India.",
};

import Image from "next/image";

import {

HeartPulse,

Bone,

Activity,

Baby,

ShieldPlus,

Syringe,

ArrowRight,

ShieldCheck,

Globe,

Clock3,

} from "lucide-react";

const treatments = [

{

name:"Cardiology",

image:"/images/cardiology.jpg",

description:

"Heart bypass surgery, valve replacement and advanced cardiac care.",

cost:"$5,000 - $8,000",

savings:"Up to 90%",

success:"98%",

hospitals:"15+",

rating:"4.9",

popular:true,

features:[

"JCI Accredited Hospitals",

"Experienced Specialists",

"Minimal Waiting Time",

],

link:"/treatments/cardiology",

icon:HeartPulse,

},

{

name:"Orthopedics",

image:"/images/orthopedics.jpg",

description:

"Joint replacement, spine surgery and sports injury treatment.",

cost:"$4,000 - $7,000",

savings:"Up to 85%",

success:"97%",

hospitals:"12+",

rating:"4.8",

popular:false,

features:[

"Advanced Surgical Techniques",

"Leading Orthopedic Surgeons",

"Faster Recovery",

],

link:"/treatments/orthopedics",

icon:Bone,

},

{

name:"Oncology",

image:"/images/oncology.jpg",

description:

"Comprehensive cancer care with advanced diagnostics and therapies.",

cost:"$3,000 - $20,000",

savings:"Up to 80%",

success:"96%",

hospitals:"18+",

rating:"4.9",

popular:true,

features:[

"Radiation Therapy",

"Cancer Specialists",

"Modern Diagnostics",

],

link:"/treatments/oncology",

icon:Activity,

},

{

name:"IVF Treatment",

image:"/images/ivf.jpg",

description:

"Affordable fertility treatment with high success rates.",

cost:"$2,000 - $4,000",

savings:"Up to 80%",

success:"75%",

hospitals:"10+",

rating:"4.8",

popular:false,

features:[

"Experienced Fertility Experts",

"High Success Rates",

"Personalized Care",

],

link:"/treatments/ivf",

icon:Baby,

},

{

name:"Kidney Transplant",

image:"/images/kidney-transplant.jpg",

description:

"Expert transplant teams and world-class post-operative care.",

cost:"$8,000 - $15,000",

savings:"Up to 95%",

success:"98%",

hospitals:"8+",

rating:"4.9",

popular:true,

features:[

"Leading Transplant Surgeons",

"Advanced ICU Facilities",

"Post Treatment Support",

],

link:"/treatments/kidney-transplant",

icon:ShieldPlus,

},

{

name:"Liver Transplant",

image:"/images/liver-transplant.jpg",

description:

"Advanced liver transplant procedures by experienced specialists.",

cost:"$20,000 - $35,000",

savings:"Up to 85%",

success:"97%",

hospitals:"7+",

rating:"4.8",

popular:false,

features:[

"Highly Experienced Teams",

"Modern Operation Theatres",

"Comprehensive Recovery",

],

link:"/treatments/liver-transplant",

icon:Syringe,

},

];

export default function TreatmentsPage() {

return (

<main className="min-h-screen bg-black text-white">

<section className="relative overflow-hidden py-20 lg:py-32 bg-gradient-to-br from-black via-slate-950 to-blue-950">

<div className="absolute top-0 left-0 w-[500px] h-[500px] bg-blue-600/10 blur-[160px] rounded-full"/>

<div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-cyan-600/10 blur-[160px] rounded-full"/>

<div className="relative max-w-7xl mx-auto px-5 lg:px-4 text-center">

<div className="inline-flex items-center gap-3 px-5 py-3 rounded-full border border-blue-500/20 bg-blue-500/10 text-blue-400">

<ShieldCheck size={18}/>

Medical Treatments

</div>

<h1 className="text-4xl sm:text-5xl lg:text-8xl font-bold mt-8 leading-tight">

Advanced Medical

<br/>

Treatments In India

</h1>

<h2 className="text-3xl lg:text-4xl mt-10 font-semibold text-slate-200">

Save Up To

<span className="text-green-400">

{" "}90%

</span>

Without Compromising Quality

</h2>

<p className="max-w-4xl mx-auto mt-6 lg:mt-10 text-base sm:text-lg lg:text-xl text-slate-300 leading-relaxed">

Access internationally accredited hospitals,

experienced specialists and affordable

world-class healthcare across India.

</p>

<div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-10 lg:mt-14">

<div className="bg-slate-950/70 border border-slate-800 rounded-2xl px-4 py-4 lg:px-7 lg:py-5">

<div className="flex items-center gap-3">

<ShieldCheck className="text-blue-400"/>

<span>

JCI Accredited Hospitals

</span>

</div>

</div>

<div className="bg-slate-950/70 border border-slate-800 rounded-2xl px-4 py-4 lg:px-7 lg:py-5">

<div className="flex items-center gap-3">

<Globe className="text-green-400"/>

<span>

International Patients

</span>

</div>

</div>

<div className="bg-slate-950/70 border border-slate-800 rounded-2xl px-4 py-4 lg:px-7 lg:py-5">

<div className="flex items-center gap-3">

<Clock3 className="text-cyan-400"/>

<span>

Minimal Waiting Time

</span>

</div>

</div>

</div>

</div>

</section>

{/* TREATMENTS */}

<section className="py-20 lg:py-28">

<div className="max-w-7xl mx-auto px-5 lg:px-4">

<div className="text-center mb-20">

<p className="uppercase tracking-[4px] text-blue-400 text-sm font-semibold">

Our Expertise

</p>

<h2 className="text-4xl lg:text-5xl font-bold mt-5">

Specialized Medical Treatments

</h2>

<p className="text-slate-400 max-w-3xl mx-auto mt-6 text-sm lg:text-lg">

Explore advanced medical treatments delivered by internationally

accredited hospitals and experienced specialists across India.

</p>

</div>



<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">

{

treatments.map((treatment)=>{

const Icon = treatment.icon;

return (

<a

href={treatment.link}

key={treatment.name}

className="group relative overflow-hidden rounded-[24px] lg:rounded-[36px]

border border-slate-800

bg-gradient-to-b from-slate-950 to-slate-900

hover:border-blue-500

transition-all duration-500

hover:-translate-y-3

hover:shadow-[0_0_70px_rgba(59,130,246,0.15)]"

>

<div className="absolute -top-24 -right-24 w-56 h-56 rounded-full bg-blue-500/10 blur-[110px]" />



{

treatment.popular &&

<div className="absolute top-6 right-6 z-20">

<div

className="bg-blue-500/15

border border-blue-500/30

backdrop-blur

text-blue-300

px-4 py-2

rounded-full

text-sm

font-semibold"

>

Featured Treatment

</div>

</div>

}



<div className="relative h-48 sm:h-56 overflow-hidden">

<Image

src={treatment.image}

alt={treatment.name}

width={700}

height={450}

className="w-full h-full object-cover group-hover:scale-105 transition duration-700"

/>

</div>

<div className="p-6 lg:p-8 relative z-10">

  <div className="flex items-center gap-4">

    <div
      className="
      w-12 h-12

      lg:w-14 lg:h-14

      rounded-2xl

      bg-blue-500/10

      flex items-center justify-center
      "
    >

      <Icon

        size={26}

        className="text-blue-400"

      />

    </div>

    <h2 className="text-2xl lg:text-3xl font-bold">

      {treatment.name}

    </h2>

  </div>



  <p

    className="

    text-slate-400

    mt-6

    leading-relaxed

    text-[15px]

    lg:text-base

    min-h-[72px]

    "

  >

    {treatment.description}

  </p>





  <div className="flex gap-3 mt-6 flex-wrap">

    <div

      className="

      bg-slate-900

      border border-slate-800

      px-4 py-2

      rounded-full

      text-sm

      "

    >

      Rating {treatment.rating}

    </div>



    <div

      className="

      bg-slate-900

      border border-slate-800

      px-4 py-2

      rounded-full

      text-sm

      "

    >

      {treatment.hospitals} Hospitals

    </div>

  </div>





  <div

    className="

    grid

    grid-cols-1

    sm:grid-cols-2

    gap-4

    mt-8

    "

  >



    <div

      className="

      bg-slate-900

      border border-slate-800

      rounded-2xl

      p-5

      "

    >

      <p className="text-slate-500 text-sm">

        Success Rate

      </p>



      <h3

        className="

        text-3xl

        font-bold

        text-green-400

        mt-3

        "

      >

        {treatment.success}

      </h3>

    </div>





    <div

      className="

      bg-slate-900

      border border-slate-800

      rounded-2xl

      p-5

      "

    >

      <p className="text-slate-500 text-sm">

        Typical Cost

      </p>



      <h3

        className="

        text-xl

        lg:text-2xl

        font-bold

        text-blue-400

        mt-3

        "

      >

        {treatment.cost}

      </h3>

    </div>

  </div>





  <div className="mt-7">

    <div

      className="

      inline-flex

      bg-green-500/15

      border border-green-500/20

      text-green-400

      px-5 py-3

      rounded-full

      font-semibold

      "

    >

      {treatment.savings}

    </div>

  </div>





  <div className="space-y-4 mt-8">

    {

      treatment.features.map((feature)=>(

        <div

          key={feature}

          className="flex gap-3 text-slate-300"

        >

          <div className="text-blue-400">

            •

          </div>



          <div>

            {feature}

          </div>



        </div>

      ))

    }

  </div>





  <div

    className="

    mt-10

    inline-flex

    items-center

    gap-3

    text-blue-400

    font-semibold

    "

  >

    Learn More

    <ArrowRight

      size={18}

      className="group-hover:translate-x-1 transition"

    />

  </div>

</div>

</a>

);

})

}

</div>

</div>

</section>





{/* COST COMPARISON */}



<section className="py-20 lg:py-28 border-t border-slate-900">

<div className="max-w-7xl mx-auto px-5 lg:px-4">



<div className="text-center mb-14 lg:mb-20">

<p

className="

uppercase

tracking-[4px]

text-blue-400

text-sm

font-semibold

"

>

Affordable Healthcare

</p>



<h2

className="

text-4xl

lg:text-5xl

font-bold

mt-5

"

>

Save Up To 90% On Treatment Costs

</h2>



<p

className="

text-slate-400

mt-6

max-w-3xl

mx-auto

text-base

lg:text-lg

"

>

Receive world-class treatment at internationally accredited hospitals

while spending significantly less compared to western countries.

</p>

</div>





<div

className="

overflow-x-auto

rounded-[24px]

lg:rounded-[32px]

border

border-slate-800

"

>

<table className="w-full min-w-[700px]">



<thead className="bg-slate-950">

<tr>

<th className="px-6 lg:px-8 py-6 text-left">

Treatment

</th>

<th className="px-6 lg:px-8 py-6">

USA

</th>

<th className="px-6 lg:px-8 py-6">

UK

</th>

<th className="px-6 lg:px-8 py-6 text-green-400">

India

</th>

</tr>

</thead>

<tbody>

<tr className="border-t border-slate-800 hover:bg-slate-950/70">

<td className="px-6 lg:px-8 py-7 font-semibold">
Heart Surgery
</td>

<td className="text-center">
$120,000
</td>

<td className="text-center">
$70,000
</td>

<td className="text-center text-green-400 font-bold">
$6,500
</td>

</tr>


<tr className="border-t border-slate-800 hover:bg-slate-950/70">

<td className="px-6 lg:px-8 py-7 font-semibold">
IVF Treatment
</td>

<td className="text-center">
$20,000
</td>

<td className="text-center">
$12,000
</td>

<td className="text-center text-green-400 font-bold">
$3,000
</td>

</tr>


<tr className="border-t border-slate-800 hover:bg-slate-950/70">

<td className="px-6 lg:px-8 py-7 font-semibold">
Kidney Transplant
</td>

<td className="text-center">
$300,000
</td>

<td className="text-center">
$150,000
</td>

<td className="text-center text-green-400 font-bold">
$12,000
</td>

</tr>


<tr className="border-t border-slate-800 hover:bg-slate-950/70">

<td className="px-6 lg:px-8 py-7 font-semibold">
Liver Transplant
</td>

<td className="text-center">
$500,000
</td>

<td className="text-center">
$180,000
</td>

<td className="text-center text-green-400 font-bold">
$28,000
</td>

</tr>

</tbody>

</table>

</div>

</div>

</section>


{/* TRUST */}

<section className="py-20 lg:py-28 border-t border-slate-900">

<div className="max-w-7xl mx-auto px-5 lg:px-4">

<div className="text-center">

<p className="uppercase tracking-[4px] text-blue-400 text-sm font-semibold">

Why HealWithIndia

</p>

<h2 className="text-4xl lg:text-5xl font-bold mt-5">

Trusted Healthcare Partner

</h2>

</div>



<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 mt-16">

<div className="bg-slate-950 border border-slate-800 rounded-[24px] lg:rounded-[32px] p-6 lg:p-8">

<ShieldCheck

size={40}

className="text-blue-400"

/>

<h3 className="text-xl lg:text-2xl font-bold mt-6 lg:mt-8">

Verified Hospitals

</h3>

<p className="text-slate-400 mt-5 leading-relaxed">

JCI and NABH accredited hospitals

with internationally recognized

standards.

</p>

</div>



<div className="bg-slate-950 border border-slate-800 rounded-[24px] lg:rounded-[32px] p-6 lg:p-8">

<Globe

size={40}

className="text-green-400"

/>

<h3 className="text-xl lg:text-2xl font-bold mt-6 lg:mt-8">

Global Patients

</h3>

<p className="text-slate-400 mt-5 leading-relaxed">

Helping patients from over

100 countries receive

quality healthcare.

</p>

</div>



<div className="bg-slate-950 border border-slate-800 rounded-[24px] lg:rounded-[32px] p-6 lg:p-8">

<Clock3

size={40}

className="text-cyan-400"

/>

<h3 className="text-xl lg:text-2xl font-bold mt-6 lg:mt-8">

Quick Treatment

</h3>

<p className="text-slate-400 mt-5 leading-relaxed">

Minimal waiting times and

faster access to expert doctors.

</p>

</div>



<div className="bg-slate-950 border border-slate-800 rounded-[24px] lg:rounded-[32px] p-6 lg:p-8">

<ShieldPlus

size={40}

className="text-purple-400"

/>

<h3 className="text-xl lg:text-2xl font-bold mt-6 lg:mt-8">

End To End Support

</h3>

<p className="text-slate-400 mt-5 leading-relaxed">

Visa assistance,

hospital coordination

and travel support.

</p>

</div>

</div>

</div>

</section>

{/* STATS */}

<section className="py-20 lg:py-28">

<div className="max-w-7xl mx-auto px-5 lg:px-4">

<div className="grid grid-cols-2 lg:grid-cols-4 gap-5 text-center">

<div className="bg-slate-950 border border-slate-800 rounded-[24px] lg:rounded-[32px] py-8 lg:py-12">

<h3 className="text-4xl lg:text-6xl font-bold text-blue-400">

30+

</h3>

<p className="text-slate-400 mt-5 text-sm lg:text-lg">

Partner Hospitals

</p>

</div>



<div className="bg-slate-950 border border-slate-800 rounded-[24px] lg:rounded-[32px] py-8 lg:py-12">

<h3 className="text-4xl lg:text-6xl font-bold text-green-400">

100+

</h3>

<p className="text-slate-400 mt-5 text-lg">

Countries Served

</p>

</div>



<div className="bg-slate-950 border border-slate-800 rounded-[24px] lg:rounded-[32px] py-8 lg:py-12">

<h3 className="text-4xl lg:text-6xl font-bold text-cyan-400">

20+

</h3>

<p className="text-slate-400 mt-5 text-sm lg:text-lg">

Medical Specialties

</p>

</div>



<div className="bg-slate-950 border border-slate-800 rounded-[24px] lg:rounded-[32px] py-8 lg:py-12">

<h3 className="text-4xl lg:text-6xl font-bold text-purple-400">

24/7

</h3>

<p className="text-slate-400 mt-5 text-sm lg:text-lg">

Patient Support

</p>

</div>

</div>

</div>

</section>



{/* FAQ */}

<section className="py-20 lg:py-28 border-t border-slate-900">

<div className="max-w-5xl mx-auto px-5 lg:px-4">

<div className="text-center">

<p className="uppercase tracking-[4px] text-blue-400 text-sm font-semibold">

Frequently Asked Questions

</p>

<h2 className="text-4xl lg:text-5xl font-bold mt-5">

Everything You Need To Know

</h2>

</div>



<div className="space-y-5 mt-14 lg:mt-20">

{

[

{

q:"Why are treatments cheaper in India?",

a:"India offers advanced healthcare at lower operational costs, allowing patients to save significantly without compromising quality.",

},

{

q:"Are hospitals internationally accredited?",

a:"Yes. Many hospitals are accredited by JCI and NABH and follow international healthcare standards.",

},

{

q:"Is India safe for medical tourists?",

a:"Yes. India welcomes thousands of international patients every year and offers dedicated international patient departments.",

},

{

q:"Can HealWithIndia help with visas?",

a:"Yes. Our team assists with medical visas, travel planning and hospital coordination.",

},

{

q:"How do I get started?",

a:"Simply submit your medical reports and our healthcare experts will guide you through the next steps.",

},

].map((faq)=>(

<div

key={faq.q}

className="bg-slate-950 border border-slate-800 rounded-[24px] lg:rounded-[28px] p-6 lg:p-8"

>

<h3 className="text-xl lg:text-2xl font-semibold">

{faq.q}

</h3>

<p className="text-slate-400 mt-5 leading-relaxed text-sm lg:text-lg">

{faq.a}

</p>

</div>

))

}

</div>

</div>

</section>



{/* CTA */}

<section className="relative overflow-hidden py-20 lg:py-32">

<div className="absolute inset-0 bg-gradient-to-r from-blue-950 via-slate-950 to-cyan-950" />



<div className="absolute left-0 top-0 w-[500px] h-[500px] bg-blue-500/10 blur-[170px] rounded-full" />



<div className="absolute right-0 bottom-0 w-[500px] h-[500px] bg-cyan-500/10 blur-[170px] rounded-full" />



<div className="relative max-w-5xl mx-auto px-5 lg:px-4 text-center">

<h2 className="text-4xl lg:text-4xl sm:text-5xl lg:text-7xl font-bold leading-tight">

Need Help Choosing

<br/>

A Treatment?

</h2>



<p className="text-slate-300 text-base lg:text-xl max-w-3xl mx-auto mt-10 leading-relaxed">

Submit your medical reports and receive

hospital recommendations,

treatment options and estimated costs

from our healthcare experts.

</p>



<div className="flex flex-col sm:flex-row justify-center gap-4 mt-10 lg:mt-14">

<a

href="/#consultation"

className="bg-blue-600 hover:bg-blue-700 px-10 py-5 rounded-2xl font-semibold text-sm lg:text-lg transition-all hover:scale-105 shadow-[0_0_40px_rgba(37,99,235,0.4)]"

>

Get Free Medical Opinion

</a>



<a

href="/hospitals"

className="border border-slate-700 hover:border-blue-500 px-10 py-5 rounded-2xl font-semibold text-sm lg:text-lg transition"

>

Explore Hospitals

</a>

</div>

</div>

</section>

</main>

);

}