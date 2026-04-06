import { Button } from "../ui/button";
import { Card, CardContent, CardFooter } from "../ui/card";
import { Label } from "../ui/label";

function AddressCard({
  addressInfo,
  handleDeleteAddress,
  handleEditAddress,
  setCurrentSelectedAddress,
  selectedId,
}) {
  return (
    <Card
      onClick={
        setCurrentSelectedAddress
          ? () => setCurrentSelectedAddress(addressInfo)
          : null
      }
      className={`cursor-pointer rounded-2xl border bg-white transition hover:-translate-y-0.5 hover:shadow-md ${
        selectedId?._id === addressInfo?._id
          ? "border-sky-500 ring-2 ring-sky-100"
          : "border-slate-200"
      }`}
    >
      <CardContent className="grid gap-2 p-4 text-sm text-slate-700">
        <Label className="text-slate-950">Address: {addressInfo?.address}</Label>
        <Label>City: {addressInfo?.city}</Label>
        <Label>Pincode: {addressInfo?.pincode}</Label>
        <Label>Phone: {addressInfo?.phone}</Label>
        <Label>Notes: {addressInfo?.notes}</Label>
      </CardContent>
      <CardFooter className="flex justify-between gap-2 border-t border-slate-100 p-3">
        <Button onClick={() => handleEditAddress(addressInfo)} variant="outline" className="rounded-full border-slate-200 hover:bg-sky-50">
          Edit
        </Button>
        <Button onClick={() => handleDeleteAddress(addressInfo)} variant="outline" className="rounded-full border-rose-200 text-rose-600 hover:bg-rose-50 hover:text-rose-700">
          Delete
        </Button>
      </CardFooter>
    </Card>
  );
}

export default AddressCard;
