import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

function PaypalCancelPage() {
  const navigate = useNavigate();

  return (
    <Card className="p-8 sm:p-10">
      <CardHeader className="space-y-2 p-0">
        <CardTitle className="text-2xl font-bold text-slate-950 sm:text-3xl">
          We’re sorry.
        </CardTitle>
        <p className="text-sm text-slate-600">
          This seller doesn’t accept payments in your currency. Please return
          to the seller and choose another way to pay.
        </p>
      </CardHeader>
      <Button className="mt-6 w-full sm:w-auto" onClick={() => navigate("/shop/checkout")}>
        Return to checkout
      </Button>
    </Card>
  );
}

export default PaypalCancelPage;
