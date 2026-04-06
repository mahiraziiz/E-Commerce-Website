import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import accImg from "../../assets/account.jpg";
import Address from "@/components/shopping-view/ShopAddress";
import ShoppingOrders from "@/components/shopping-view/ShopOrders";

function ShoppingAccount() {
  return (
    <div className="flex flex-col bg-slate-50">
      <div className="relative h-[320px] w-full overflow-hidden">
        <img
          width={"1600"}
          height={"300"}
          style={{ aspectRatio: "1600/300", objectFit: "cover" }}
          src={accImg}
          alt="Account"
          className="h-full w-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,_rgba(2,6,23,0.7),_rgba(2,6,23,0.2),_rgba(2,6,23,0.55))]" />
        <div className="absolute inset-0 flex items-end">
          <div className="mx-auto w-full max-w-7xl px-4 pb-10 md:px-6 lg:px-8">
            <div className="max-w-2xl text-white">
              <span className="inline-flex rounded-full border border-white/10 bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.3em] text-sky-100">
                Your account
              </span>
              <h1 className="mt-4 text-4xl font-black tracking-tight sm:text-5xl">
                Orders, addresses, and account activity in one place.
              </h1>
            </div>
          </div>
        </div>
      </div>
      <div className="container mx-auto grid grid-cols-1 gap-8 py-8 px-4 md:px-6">
        <div className="flex flex-col rounded-[1.75rem] border border-slate-200/80 bg-white p-4 shadow-[0_12px_36px_rgba(15,23,42,0.06)] sm:p-6">
          <Tabs defaultValue="orders">
            <TabsList className="grid w-full grid-cols-2 rounded-full bg-slate-100 p-1">
              <TabsTrigger value="orders">Orders</TabsTrigger>
              <TabsTrigger value="address">Addresses</TabsTrigger>
            </TabsList>
            <TabsContent value="orders">
              <ShoppingOrders />
            </TabsContent>
            <TabsContent value="address">
              <Address />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

export default ShoppingAccount;
