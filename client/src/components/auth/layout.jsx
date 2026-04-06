import { Outlet } from "react-router-dom";

function AuthLayout() {
  return (
    <div className="flex min-h-screen w-full bg-slate-50">
      <div className="relative hidden lg:flex lg:w-[45%] items-center justify-center overflow-hidden bg-slate-950 px-12 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(251,191,36,0.18),_transparent_30%),linear-gradient(180deg,_rgba(15,23,42,0.98),_rgba(15,23,42,0.9))]" />
        <div className="relative max-w-xl space-y-8 rounded-[2rem] border border-white/10 bg-white/5 p-10 shadow-[0_30px_100px_rgba(15,23,42,0.22)] backdrop-blur-sm">
          <div className="space-y-3">
            <span className="inline-flex rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-amber-200">
              E-Commerce Platform
            </span>
            <h1 className="text-4xl font-black tracking-tight leading-tight">
              Clear operations. Better checkout. Less friction.
            </h1>
          </div>
          <p className="max-w-lg text-sm leading-7 text-slate-300">
            Manage your catalog, orders, and account access from a focused workspace built for speed and clarity.
          </p>
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl bg-white/5 p-4">
              <p className="text-[11px] uppercase tracking-[0.25em] text-slate-400">Checkout</p>
              <p className="mt-2 text-sm font-semibold">Fast and reliable</p>
            </div>
            <div className="rounded-2xl bg-white/5 p-4">
              <p className="text-[11px] uppercase tracking-[0.25em] text-slate-400">Orders</p>
              <p className="mt-2 text-sm font-semibold">Easy to review</p>
            </div>
            <div className="rounded-2xl bg-white/5 p-4">
              <p className="text-[11px] uppercase tracking-[0.25em] text-slate-400">Access</p>
              <p className="mt-2 text-sm font-semibold">Secure sign-in</p>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-1 items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        <Outlet />
      </div>
    </div>
  );
}

export default AuthLayout;
