export default function RevenueChart(){

const revenue=[

25,

45,

30,

65,

70,

90,

75,

];

return(

<div className="bg-slate-950 border border-slate-800 rounded-[32px] p-8">

<h2 className="text-2xl font-bold text-white mb-8">

Revenue Growth

</h2>

<div className="flex items-end gap-5 h-[250px]">

{

revenue.map((v,i)=>(

<div

key={i}

className="flex-1 bg-blue-500 rounded-t-3xl"

style={{

height:`${v*2}px`

}}

>

</div>

))

}

</div>

</div>

)

}