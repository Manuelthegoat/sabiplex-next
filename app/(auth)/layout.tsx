const AuthLayout = ({
    children
}: {
    children: React.ReactNode
}) => {
    return <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-950 p-5"><div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-indigo-600/30 blur-3xl" /><div className="absolute -bottom-40 -right-20 h-96 w-96 rounded-full bg-violet-500/20 blur-3xl" /><div className="relative rounded-2xl bg-white p-2 shadow-2xl shadow-black/30">{children}</div></div>;
}
 
export default AuthLayout;
