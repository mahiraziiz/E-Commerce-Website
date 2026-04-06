import { Outlet } from "react-router-dom";
import AdminSideBar from "./AdminSidebar";
import AdminHeader from "./AdminHeader";
import { useState } from "react";

function AdminLayout() {
  const [openSidebar, setOpenSidebar] = useState(false);
  
  return (
    <div className="flex min-h-screen w-full bg-slate-50 text-slate-900">
      <AdminSideBar open={openSidebar} setOpen={setOpenSidebar} />
      <div className="flex flex-1 flex-col">
        <AdminHeader setOpen={setOpenSidebar} />
        <main className="flex flex-1 flex-col px-4 py-5 sm:px-6 lg:px-8 lg:py-6">
          <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-6 rounded-[1.75rem] border border-slate-200/70 bg-white p-4 shadow-[0_16px_60px_rgba(15,23,42,0.06)] sm:p-6 lg:p-8">
          <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;
