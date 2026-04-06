import { Button } from "../ui/button";
import { Card, CardContent, CardFooter } from "../ui/card";
import { Badge } from "../ui/badge";
import { MapPin, Phone, Pencil, Trash2 } from "lucide-react";

function AddressCard({
  addressInfo,
  handleDeleteAddress,
  handleEditAddress,
  setCurrentSelectedAddress,
  selectedId,
}) {
  const isSelected = selectedId?._id === addressInfo?._id;

  return (
    <Card
      onClick={
        setCurrentSelectedAddress
          ? () => setCurrentSelectedAddress(addressInfo)
          : null
      }
      className={`group relative cursor-pointer overflow-hidden rounded-3xl border bg-white transition-all duration-200 hover:-translate-y-1 hover:shadow-xl ${
        isSelected
          ? "border-sky-500 ring-2 ring-sky-100"
          : "border-slate-200 hover:border-sky-200"
      }`}
    >
      <div className="h-1 bg-gradient-to-r from-sky-500 via-cyan-400 to-indigo-500" />
      <CardContent className="space-y-4 p-5 text-sm text-slate-700">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-sky-50 text-sky-600">
              <MapPin className="h-5 w-5" />
            </div>
            <div>
              <div className="text-base font-bold tracking-tight text-slate-950">
                {addressInfo?.name}
              </div>
              <div className="text-xs text-slate-500">Saved address</div>
            </div>
          </div>
          <Badge
            variant="outline"
            className={`rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-wide ${
              isSelected
                ? "border-sky-200 bg-sky-50 text-sky-700"
                : "border-slate-200 bg-slate-50 text-slate-600"
            }`}
          >
            {isSelected ? "Selected" : "Address"}
          </Badge>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4">
          <div className="space-y-1.5 text-slate-700">
            {addressInfo?.addressLine1 && (
              <div>{addressInfo?.addressLine1}</div>
            )}
            {addressInfo?.addressLine2 && (
              <div>{addressInfo?.addressLine2}</div>
            )}

            <div className="flex flex-wrap gap-2 pt-2">
              {addressInfo?.city && (
                <span className="rounded-full bg-white px-3 py-1 text-xs font-medium text-slate-700 shadow-sm ring-1 ring-slate-200">
                  {addressInfo?.city}
                </span>
              )}
              {addressInfo?.state && (
                <span className="rounded-full bg-white px-3 py-1 text-xs font-medium text-slate-700 shadow-sm ring-1 ring-slate-200">
                  {addressInfo?.state}
                </span>
              )}
              {addressInfo?.pincode && (
                <span className="rounded-full bg-white px-3 py-1 text-xs font-medium text-slate-700 shadow-sm ring-1 ring-slate-200">
                  {addressInfo?.pincode}
                </span>
              )}
            </div>

            {addressInfo?.country && (
              <div className="pt-2 text-sm font-medium text-slate-900">
                {addressInfo?.country}
              </div>
            )}

            {addressInfo?.phone && (
              <div className="flex items-center gap-2 pt-2 font-medium text-slate-900">
                <Phone className="h-4 w-4 text-sky-600" />
                <span>
                  {addressInfo?.countryCode} {addressInfo?.phone}
                </span>
              </div>
            )}

            {addressInfo?.notes && (
              <div className="mt-3 rounded-xl border border-dashed border-slate-200 bg-white px-3 py-2 text-xs italic text-slate-600">
                {addressInfo?.notes}
              </div>
            )}
          </div>
        </div>
      </CardContent>
      <CardFooter className="gap-2 border-t border-slate-100 bg-slate-50/70 p-4">
        <Button
          onClick={() => handleEditAddress(addressInfo)}
          variant="outline"
          className="flex-1 rounded-full border-slate-200 bg-white hover:bg-sky-50"
        >
          <Pencil className="mr-2 h-4 w-4" />
          Edit
        </Button>
        <Button
          onClick={() => handleDeleteAddress(addressInfo)}
          variant="outline"
          className="flex-1 rounded-full border-rose-200 bg-white text-rose-600 hover:bg-rose-50 hover:text-rose-700"
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Delete
        </Button>
      </CardFooter>
    </Card>
  );
}

export default AddressCard;
