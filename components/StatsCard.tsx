import { LucideIcon } from "lucide-react";

export default function StatsCard({

title,

value,

icon:Icon,

color,

}:{

title:string,

value:string|number,

icon:LucideIcon,

color:string

}){

return(

<div className="bg-slate-950 border border-slate-800 rounded-[32px] p-8">

<Icon

size={34}

className={color}

/>

<p className="text-slate-400 mt-6">

{title}

</p>

<h1 className="text-5xl font-bold text-white mt-2">

{value}

</h1>

</div>

)

}