export default function CountryChart(){

const countries=[

{

country:"USA",

value:42,

},

{

country:"UK",

value:26,

},

{

country:"UAE",

value:18,

},

{

country:"Nigeria",

value:9,

},

];

return(

<div className="bg-slate-950 border border-slate-800 rounded-[32px] p-8">

<h2 className="text-2xl font-bold text-white mb-8">

Leads by Country

</h2>

<div className="space-y-7">

{

countries.map((c)=>(

<div key={c.country}>

<div className="flex justify-between mb-3">

<p className="text-slate-300">

{c.country}

</p>

<p className="text-white">

{c.value}%

</p>

</div>

<div className="w-full bg-slate-800 rounded-full h-4">

<div

className="bg-blue-500 h-4 rounded-full"

style={{

width:`${c.value}%`

}}

>

</div>

</div>

</div>

))

}

</div>

</div>

)

}