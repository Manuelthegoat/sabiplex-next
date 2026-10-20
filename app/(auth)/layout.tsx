import Image from "next/image";

const AuthLayout = ({
    children
}: {
    children: React.ReactNode
}) => {
    return <div className="relative flex min-h-screen flex-col items-center justify-center gap-8 overflow-hidden bg-slate-950 p-5"><div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-neutral-600/30 blur-3xl" /><div className="absolute -bottom-40 -right-20 h-96 w-96 rounded-full bg-neutral-500/20 blur-3xl" /><Image src="/logo.svg" alt="Sabiplex" width={170} height={54} priority className="relative h-12 w-auto brightness-0 invert" /><div className="relative rounded-2xl bg-white p-2 shadow-2xl shadow-black/30">{children}</div></div>;
}
 
export default AuthLayout;
