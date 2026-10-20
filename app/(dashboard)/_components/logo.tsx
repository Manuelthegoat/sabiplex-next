import Link from 'next/link'
import { GraduationCap } from 'lucide-react'

export const Logo = () => {
    return (
        <Link href="/dashboard" className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-indigo-400 to-violet-600 shadow-lg shadow-indigo-500/30"><GraduationCap className="h-5 w-5 text-white" /></span>
            <span className="text-xl font-black tracking-tight text-white">Sabiplex</span>
        </Link>
    )
}
