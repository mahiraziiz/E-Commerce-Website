import { Outlet } from "react-router-dom";
import ShoppingHeader from "./ShopHeader";

function ShoppingLayout() {
  return (
    <div className="flex min-h-screen flex-col overflow-hidden bg-slate-50 text-slate-950">
      <ShoppingHeader />
      <main className="flex flex-1 flex-col w-full">
        <Outlet />
      </main>
    </div>
  );
}
export default ShoppingLayout;
