export const metadata = {
  title: "Top Hospitals In India | HealWithIndia",
  description:
    "Explore India's leading hospitals including Apollo, Fortis, Medanta, Max, Manipal and Narayana Health for world-class medical treatment.",
};

import Image from "next/image";

import {

MapPin,

Building2,

BadgeCheck,

ArrowRight,

Star,

ShieldCheck,

Globe,

Languages,

HeartHandshake,

} from "lucide-react";

const hospitals = [

{

name:"Apollo Hospitals",

city:"Chennai",

image:"/images/apollo.png",

specialty:"Cardiology • Oncology • Organ Transplants",

accreditation:"JCI & NABH Accredited",

rating:"4.9",

cost:"From $50",

success:"98%",

experience:"40+ Years",

featured:true,

link:"/hospitals/apollo",

},

{

name:"Fortis Healthcare",

city:"New Delhi",

image:"/images/fortis.png",

specialty:"Cancer Care • Neurosciences • Cardiology",

accreditation:"NABH Accredited",

rating:"4.8",

cost:"From $45",

success:"97%",

experience:"30+ Years",

featured:false,

link:"/hospitals/fortis",

},

{

name:"Medanta",

city:"Gurugram",

image:"/images/medanta.png",

specialty:"Multi-Specialty Excellence",

accreditation:"JCI & NABH Accredited",

rating:"4.9",

cost:"From $60",

success:"98%",

experience:"20+ Years",

featured:true,

link:"/hospitals/medanta",

},

{

name:"Max Healthcare",

city:"New Delhi",

image:"/images/max.png",

specialty:"Orthopedics • Cardiology • Oncology",

accreditation:"NABH Accredited",

rating:"4.7",

cost:"From $40",

success:"96%",

experience:"25+ Years",

featured:false,

link:"/hospitals/max",

},

{

name:"Manipal Hospitals",

city:"Bengaluru",

image:"/images/manipal.png",

specialty:"Advanced Surgery • Organ Transplants",

accreditation:"NABH Accredited",

rating:"4.8",

cost:"From $45",

success:"97%",

experience:"35+ Years",

featured:false,

link:"/hospitals/manipal",

},

{

name:"Narayana Health",

city:"Bengaluru",

image:"/images/narayana.png",

specialty:"Cardiac Sciences • Pediatrics",

accreditation:"JCI & NABH Accredited",

rating:"4.8",

cost:"From $35",

success:"98%",

experience:"24+ Years",

featured:true,

link:"/hospitals/narayana",

},

];

const testimonials = [

{

name:"John M.",

country:"USA",

review:

"Exceptional care and huge savings. HealWithIndia helped me choose Apollo and the experience exceeded expectations.",

},

{

name:"Sarah J.",

country:"UK",

review:

"Everything from consultation to travel assistance was seamless. Highly recommended.",

},

{

name:"Ahmed A.",

country:"UAE",

review:

"Professional doctors, modern facilities and transparent pricing.",

},

];

export default function HospitalsPage() {

return (

<main className="min-h-screen bg-black text-white">

{/* HERO */}

<section className="relative overflow-hidden py-32 bg-gradient-to-br from-black via-slate-950 to-blue-950">

<div className="absolute top-0 left-0 w-[500px] h-[500px] bg-blue-600/10 blur-[150px] rounded-full"/>

<div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-cyan-500/10 blur-[150px] rounded-full"/>

<div className="relative max-w-7xl mx-auto px-4 text-center">

<div className="inline-flex items-center gap-3 px-5 py-3 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400">

<ShieldCheck size={18}/>

Trusted By International Patients

</div>

<h1 className="text-6xl lg:text-8xl font-bold mt-10 leading-tight">

India's Leading

<br/>

Healthcare Institutions

</h1>

<p className="max-w-3xl mx-auto mt-8 text-xl text-slate-300 leading-relaxed">

Access internationally recognized hospitals,

experienced specialists and advanced medical

facilities trusted by patients worldwide.

</p>

<div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mt-16">

<div className="bg-slate-950/70 backdrop-blur border border-slate-800 rounded-3xl py-8">

<h3 className="text-5xl font-bold text-blue-400">

30+

</h3>

<p className="text-slate-400 mt-3">

Partner Hospitals

</p>

</div>

<div className="bg-slate-950/70 backdrop-blur border border-slate-800 rounded-3xl py-8">

<h3 className="text-5xl font-bold text-green-400">

20+

</h3>

<p className="text-slate-400 mt-3">

Specialties

</p>

</div>

<div className="bg-slate-950/70 backdrop-blur border border-slate-800 rounded-3xl py-8">

<h3 className="text-5xl font-bold text-cyan-400">

100+

</h3>

<p className="text-slate-400 mt-3">

Countries Served

</p>

</div>

<div className="bg-slate-950/70 backdrop-blur border border-slate-800 rounded-3xl py-8">

<h3 className="text-5xl font-bold text-yellow-400">

24/7

</h3>

<p className="text-slate-400 mt-3">

Patient Support

</p>

</div>

</div>

</div>

</section>

{/* HOSPITALS */}

<section className="py-28">

<div className="max-w-7xl mx-auto px-4">

<div className="text-center mb-16">

<p className="uppercase tracking-[4px] text-blue-400 text-sm font-semibold">

Our Network

</p>

<h2 className="text-5xl font-bold mt-5">

World-Class Hospitals

</h2>

<p className="text-slate-400 mt-6 max-w-2xl mx-auto">

Partnered with India's most trusted hospitals

providing advanced healthcare and international

patient services.

</p>

</div>



<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">

{

hospitals.map((hospital)=>(

<div

key={hospital.name}

className="relative overflow-hidden rounded-[36px] border border-slate-800 bg-gradient-to-b from-slate-950 to-slate-900 hover:border-blue-500 transition-all duration-500 hover:-translate-y-3 hover:shadow-[0_0_70px_rgba(59,130,246,0.18)]"

>

<div className="absolute -top-24 -right-24 w-60 h-60 rounded-full bg-blue-500/10 blur-[120px]" />



{

hospital.featured &&

<div className="absolute top-6 right-6 z-20">

<div className="bg-yellow-500/20 text-yellow-400 px-4 py-2 rounded-full text-sm font-semibold backdrop-blur">

⭐ Featured

</div>

</div>

}



<div className="h-56 bg-gradient-to-b from-white to-slate-100 flex items-center justify-center p-10">

<Image

src={hospital.image}

alt={hospital.name}

width={220}

height={100}

className="object-contain"

/>

</div>



<div className="p-8 relative z-10">

<h2 className="text-3xl font-bold">

{hospital.name}

</h2>



<div className="flex items-center gap-2 text-blue-400 mt-4">

<MapPin size={18}/>

{hospital.city}

</div>



<p className="text-slate-400 mt-6 leading-relaxed min-h-[70px]">

{hospital.specialty}

</p>



<div className="flex items-center gap-2 text-green-400 mt-6">

<BadgeCheck size={18}/>

<span>

{hospital.accreditation}

</span>

</div>



<div className="flex gap-3 mt-7 flex-wrap">

<div className="bg-slate-900 border border-slate-800 px-4 py-2 rounded-full font-medium">

⭐ {hospital.rating}

</div>



<div className="bg-blue-500/20 text-blue-400 px-4 py-2 rounded-full font-medium">

{hospital.cost}

</div>

</div>



<div className="grid grid-cols-2 gap-4 mt-8">

<div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">

<p className="text-slate-500 text-sm">

Success Rate

</p>

<h3 className="text-3xl font-bold text-green-400 mt-3">

{hospital.success}

</h3>

</div>



<div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">

<p className="text-slate-500 text-sm">

Experience

</p>

<h3 className="text-3xl font-bold text-cyan-400 mt-3">

{hospital.experience}

</h3>

</div>

</div>



<div className="space-y-4 mt-9">

<div className="flex gap-3 text-slate-300">

<div className="text-green-400">

✓

</div>

International Patient Department

</div>



<div className="flex gap-3 text-slate-300">

<div className="text-green-400">

✓

</div>

Experienced Specialists

</div>



<div className="flex gap-3 text-slate-300">

<div className="text-green-400">

✓

</div>

Advanced Medical Technology

</div>



<div className="flex gap-3 text-slate-300">

<div className="text-green-400">

✓

</div>

Visa & Travel Assistance

</div>

</div>



<a

href={hospital.link}

className="mt-10 inline-flex items-center gap-3 bg-blue-600 hover:bg-blue-700 px-7 py-4 rounded-2xl font-semibold transition-all hover:scale-105"

>

View Hospital

<ArrowRight size={18}/>

</a>



</div>

</div>

))

}

</div>

</div>

</section>

{/* TRUST SECTION */}

<section className="py-28 border-t border-slate-900">

<div className="max-w-7xl mx-auto px-4">

<div className="text-center">

<p className="uppercase tracking-[4px] text-blue-400 text-sm font-semibold">

Why Choose HealWithIndia

</p>

<h2 className="text-5xl font-bold mt-5">

Trusted Healthcare Partner

</h2>

<p className="text-slate-400 mt-6 max-w-3xl mx-auto">

We help international patients connect with India's top hospitals,

assist with treatment planning, travel, visas and provide complete

end-to-end healthcare support.

</p>

</div>



<div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mt-20">

<div className="bg-slate-950 border border-slate-800 rounded-[32px] p-8 hover:border-blue-500 transition">

<div className="bg-blue-500/20 w-16 h-16 rounded-2xl flex items-center justify-center">

<ShieldCheck

size={30}

className="text-blue-400"

/>

</div>

<h3 className="text-2xl font-bold mt-8">

Verified Hospitals

</h3>

<p className="text-slate-400 mt-4 leading-relaxed">

JCI and NABH accredited hospitals with internationally recognized standards.

</p>

</div>



<div className="bg-slate-950 border border-slate-800 rounded-[32px] p-8 hover:border-green-500 transition">

<div className="bg-green-500/20 w-16 h-16 rounded-2xl flex items-center justify-center">

<Globe

size={30}

className="text-green-400"

/>

</div>

<h3 className="text-2xl font-bold mt-8">

100+ Countries

</h3>

<p className="text-slate-400 mt-4 leading-relaxed">

Serving patients worldwide with dedicated support and treatment coordination.

</p>

</div>



<div className="bg-slate-950 border border-slate-800 rounded-[32px] p-8 hover:border-cyan-500 transition">

<div className="bg-cyan-500/20 w-16 h-16 rounded-2xl flex items-center justify-center">

<Languages

size={30}

className="text-cyan-400"

/>

</div>

<h3 className="text-2xl font-bold mt-8">

Multilingual Support

</h3>

<p className="text-slate-400 mt-4 leading-relaxed">

Dedicated team helping patients communicate comfortably at every step.

</p>

</div>



<div className="bg-slate-950 border border-slate-800 rounded-[32px] p-8 hover:border-purple-500 transition">

<div className="bg-purple-500/20 w-16 h-16 rounded-2xl flex items-center justify-center">

<HeartHandshake

size={30}

className="text-purple-400"

/>

</div>

<h3 className="text-2xl font-bold mt-8">

Personal Assistance

</h3>

<p className="text-slate-400 mt-4 leading-relaxed">

Visa support, airport pickup and treatment coordination.

</p>

</div>

</div>

</div>

</section>



{/* TESTIMONIALS */}

<section className="py-28">

<div className="max-w-7xl mx-auto px-4">

<div className="text-center">

<p className="uppercase tracking-[4px] text-blue-400 text-sm font-semibold">

Patient Stories

</p>

<h2 className="text-5xl font-bold mt-5">

Trusted By Patients Worldwide

</h2>

</div>



<div className="grid md:grid-cols-3 gap-8 mt-20">

{

testimonials.map((testimonial)=>(

<div

key={testimonial.name}

className="bg-slate-950 border border-slate-800 rounded-[32px] p-10 hover:border-blue-500 transition"

>

<div className="flex gap-1 text-yellow-400">

<Star fill="currentColor" size={20}/>

<Star fill="currentColor" size={20}/>

<Star fill="currentColor" size={20}/>

<Star fill="currentColor" size={20}/>

<Star fill="currentColor" size={20}/>

</div>

<p className="text-slate-300 mt-8 leading-relaxed text-lg">

"{testimonial.review}"

</p>

<div className="mt-10">

<h3 className="font-bold text-xl">

{testimonial.name}

</h3>

<p className="text-slate-500 mt-2">

{testimonial.country}

</p>

</div>

</div>

))

}

</div>

</div>

</section>



{/* CTA */}

<section className="relative overflow-hidden py-32 bg-gradient-to-r from-blue-950 via-slate-950 to-cyan-950">

<div className="absolute left-0 top-0 w-[500px] h-[500px] bg-blue-500/10 blur-[150px] rounded-full"/>

<div className="absolute right-0 bottom-0 w-[500px] h-[500px] bg-cyan-500/10 blur-[150px] rounded-full"/>



<div className="relative max-w-5xl mx-auto px-4 text-center">

<div className="bg-blue-500/15 w-24 h-24 rounded-[32px] flex items-center justify-center mx-auto">

<Building2

size={48}

className="text-blue-400"

/>

</div>



<h2 className="text-6xl font-bold mt-10">

Need Help Choosing

<br/>

A Hospital?

</h2>



<p className="text-slate-300 text-xl mt-8 max-w-3xl mx-auto leading-relaxed">

Our healthcare experts will review your medical reports,

recommend suitable hospitals and provide estimated treatment costs

completely free of charge.

</p>



<div className="flex justify-center gap-5 flex-wrap mt-12">

<a

href="/#consultation"

className="bg-blue-600 hover:bg-blue-700 px-10 py-5 rounded-2xl font-semibold text-lg transition-all hover:scale-105"

>

Get Free Consultation

</a>



<a

href="/treatments"

className="border border-slate-700 hover:border-blue-500 px-10 py-5 rounded-2xl font-semibold text-lg transition"

>

Explore Treatments

</a>

</div>

</div>

</section>

</main>

);

}