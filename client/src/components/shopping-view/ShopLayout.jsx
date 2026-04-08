import { Outlet } from "react-router-dom";
import ShoppingHeader from "./ShopHeader";
import ShopFooter from "./ShopFooter";

function ShoppingLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-950">
      <ShoppingHeader />
      <main className="flex flex-1 flex-col w-full">
        <Outlet />
      </main>
      <ShopFooter />
    </div>
  );
}
export default ShoppingLayout;
