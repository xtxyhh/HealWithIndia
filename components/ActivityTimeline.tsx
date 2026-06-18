export default function ActivityTimeline(){

const activities=[

"Ahmed uploaded MRI",

"John converted to patient",

"Sara followup overdue",

"New lead from UAE",

"Apollo quote uploaded",

];

return(

<div className="bg-slate-950 border border-slate-800 rounded-[32px] p-8">

<h2 className="text-2xl font-bold text-white mb-8">

Recent Activity

</h2>

<div className="space-y-6">

{

activities.map((item,index)=>(

<div

key={index}

className="flex gap-4"

>

<div

className="w-4 h-4 rounded-full bg-blue-500 mt-2"

></div>

<p className="text-slate-300">

{item}

</p>

</div>

))

}

</div>

</div>

)

}