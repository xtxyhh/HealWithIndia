import Sidebar from "@/components/Sidebar";

export default function AdminLayout({

children,

}:{

children:React.ReactNode

}){

return(

<div className="bg-black min-h-screen">

<Sidebar/>

<div className="ml-[280px]">

{children}

</div>

</div>

)

}