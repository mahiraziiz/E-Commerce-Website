import {
  BadgeCheck,
  ChartNoAxesCombined,
  ChartPie,
  ShoppingCart,
} from "lucide-react";
import { Fragment } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "../ui/sheet";

const adminSidebarMenuItems = [
  {
    id: "dashboard",
    label: "Dashboard",
    path: "/admin/dashboard",
    icons: <ChartPie />,
  },
  {
    id: "products",
    label: "Products",
    path: "/admin/products",
    icons: <ShoppingCart />,
  },
  {
    id: "orders",
    label: "Orders",
    path: "/admin/orders",
    icons: <BadgeCheck />,
  },
];

function MenuItems({ setOpen }) {
  const navigate = useNavigate();
  const location = useLocation();
  return (
    <nav className="mt-8 flex flex-col gap-2">
      {adminSidebarMenuItems.map((menuItems) => (
        <button
          key={menuItems.id}
          onClick={() => {
            navigate(menuItems.path);
            setOpen ? setOpen(false) : null;
          }}
          className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-medium transition-all duration-200 hover:translate-x-0.5 hover:bg-white/10 hover:text-white ${
            location.pathname.includes(menuItems.id)
              ? "bg-white/10 text-white ring-1 ring-inset ring-white/10"
              : "bg-transparent text-slate-400"
          }`}
        >
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-white/5 text-current ring-1 ring-inset ring-white/10">
            {menuItems.icons}
          </span>
          <span className="text-base">{menuItems.label}</span>
        </button>
      ))}
    </nav>
  );
}

function AdminSideBar({ open, setOpen }) {
  const navigate = useNavigate();

  return (
    <Fragment>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="left" className="w-[18rem] border-r-0 bg-slate-950 p-0 text-white">
          <div className="flex h-full flex-col bg-[linear-gradient(180deg,_rgba(15,23,42,0.98),_rgba(15,23,42,0.94))] p-6">
            <SheetHeader className="border-b border-white/10 pb-4">
              <SheetTitle className="flex items-center gap-3 text-left text-white">
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-amber-400 text-slate-950 shadow-lg shadow-amber-500/20">
                  <ChartNoAxesCombined size={24} />
                </span>
                <div>
                  <h1 className="text-xl font-black tracking-tight">Admin Panel</h1>
                  <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-400">
                    Store control center
                  </p>
                </div>
              </SheetTitle>
            </SheetHeader>
            <MenuItems setOpen={setOpen} />
          </div>
        </SheetContent>
      </Sheet>
      <aside className="hidden w-[18rem] flex-col border-r border-white/10 bg-slate-950 p-6 text-white shadow-[8px_0_40px_rgba(15,23,42,0.12)] lg:flex">
        <div
          onClick={() => navigate("/admin/dashboard")}
          className="flex cursor-pointer items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 transition hover:bg-white/10"
        >
          <span className="grid h-12 w-12 place-items-center rounded-2xl bg-amber-400 text-slate-950 shadow-lg shadow-amber-500/20">
            <ChartNoAxesCombined size={24} />
          </span>
          <div>
            <h1 className="text-xl font-black tracking-tight">Admin Panel</h1>
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-400">
              Store control center
            </p>
          </div>
        </div>
        <MenuItems setOpen={setOpen} />
      </aside>
    </Fragment>
  );
}

export default AdminSideBar;
