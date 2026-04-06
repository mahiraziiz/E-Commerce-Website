import { AlignJustify, LogOut } from "lucide-react";
import { Button } from "../ui/button";
import { useDispatch } from "react-redux";
import { logoutUser } from "@/store/auth-slice";
import { useLocation } from "react-router-dom";

function AdminHeader({ setOpen }) {
  const dispatch = useDispatch();
  const location = useLocation();

  const title = location.pathname.includes("products")
    ? "Products"
    : location.pathname.includes("orders")
    ? "Orders"
    : location.pathname.includes("dashboard")
    ? "Dashboard"
    : "Admin";

  function handleLogout() {
    dispatch(logoutUser());
  }

  return (
    <header className="sticky top-0 z-20 flex items-center gap-3 border-b border-slate-200/70 bg-white/80 px-4 py-3 backdrop-blur-xl sm:px-6 lg:px-8">
      <div className="flex items-center gap-3">
        <Button
          onClick={() => {
            setOpen(true);
          }}
          className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-950 text-white shadow-lg shadow-slate-950/15 lg:hidden"
        >
          <AlignJustify />
          <span className="sr-only">Toggle Menu</span>
        </Button>
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-slate-400">
            Admin workspace
          </p>
          <h2 className="text-xl font-black tracking-tight text-slate-950">{title}</h2>
        </div>
      </div>
      <div className="ml-auto flex items-center gap-3">
        <span className="hidden rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.25em] text-emerald-700 sm:inline-flex">
          Live
        </span>
        <Button
          onClick={handleLogout}
          className="inline-flex h-11 items-center gap-2 rounded-2xl bg-slate-950 px-4 text-sm font-semibold text-white shadow-lg shadow-slate-950/15 hover:bg-slate-800"
        >
          <LogOut />
          Logout
        </Button>
      </div>
    </header>
  );
}

export default AdminHeader;
