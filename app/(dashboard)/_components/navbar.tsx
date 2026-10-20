import { NavbarRoutes } from "@/components/navbar-routes"
import { MobileSidebar } from "./mobile-sidebar"


export const Navbar = () => {
    return(
        <div className="h-full flex items-center border-b border-slate-200/80 bg-white/80 px-5 shadow-sm backdrop-blur-xl md:px-7">
            <MobileSidebar />
            <NavbarRoutes />
        </div>
    )
}
