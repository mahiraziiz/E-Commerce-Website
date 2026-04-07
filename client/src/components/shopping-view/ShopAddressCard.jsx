import { Button } from "../ui/button";
import { Card, CardContent, CardFooter } from "../ui/card";
import { Badge } from "../ui/badge";
import { MapPin, Phone, Pencil, Trash2 } from "lucide-react";

function AddressCard({
  addressIndex,
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
      className={`group relative flex h-full cursor-pointer flex-col overflow-hidden rounded-2xl border py-0 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg ${
        isSelected
          ? "border-sky-500 bg-sky-50/30 ring-2 ring-sky-100"
          : "border-slate-200 bg-white hover:border-sky-300"
      }`}
    >
      <div className="h-1.5 bg-gradient-to-r from-sky-500 via-cyan-500 to-blue-500" />

      <CardContent className="flex-1 space-y-4 p-4 text-sm text-slate-700">
        <div className="space-y-2">
          <div className="flex items-start justify-between gap-3">
            <div className="flex min-w-0 items-center gap-2">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-sky-100 text-sky-700">
                <MapPin className="h-4.5 w-4.5" />
              </div>
              <div className="text-sm font-semibold text-slate-700">
                Address {Number(addressIndex) + 1}
              </div>
            </div>
          </div>
          <Badge
            variant="outline"
            className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${
              isSelected
                ? "border-sky-200 bg-sky-50 text-sky-700"
                : "border-slate-200 bg-slate-50 text-slate-600"
            }`}
          >
            {isSelected ? "Selected" : "Address"}
          </Badge>

          <div className="break-words text-lg font-bold leading-tight text-slate-950">
            {addressInfo?.name}
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-slate-50 p-3.5">
          <div className="space-y-1.5 break-words text-slate-700">
            {addressInfo?.addressLine1 && (
              <div>{addressInfo?.addressLine1}</div>
            )}
            {addressInfo?.addressLine2 && (
              <div>{addressInfo?.addressLine2}</div>
            )}

            <div className="flex flex-wrap gap-1.5 pt-2">
              {addressInfo?.city && (
                <span className="rounded-full border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-700">
                  {addressInfo?.city}
                </span>
              )}
              {addressInfo?.state && (
                <span className="rounded-full border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-700">
                  {addressInfo?.state}
                </span>
              )}
              {addressInfo?.pincode && (
                <span className="rounded-full border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-700">
                  {addressInfo?.pincode}
                </span>
              )}
            </div>

            {addressInfo?.country && (
              <div className="pt-2 text-sm font-semibold text-slate-900">
                {addressInfo?.country}
              </div>
            )}

            {addressInfo?.phone && (
              <div className="flex items-center gap-2 pt-2 font-semibold text-slate-900">
                <Phone className="h-4 w-4 shrink-0 text-sky-600" />
                <span>
                  {addressInfo?.countryCode} {addressInfo?.phone}
                </span>
              </div>
            )}

            {addressInfo?.notes && (
              <div className="mt-3 rounded-lg border border-dashed border-slate-300 bg-white px-3 py-2 text-xs italic text-slate-600">
                {addressInfo?.notes}
              </div>
            )}
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex flex-col gap-2 border-t border-slate-100 bg-slate-50/80 p-3">
        <Button
          onClick={(event) => {
            event.stopPropagation();
            handleEditAddress(addressInfo);
          }}
          variant="outline"
          className="w-full justify-center rounded-lg border-slate-200 bg-white text-slate-800 hover:bg-sky-50"
        >
          <Pencil className="mr-2 h-4 w-4" />
          Edit
        </Button>
        <Button
          onClick={(event) => {
            event.stopPropagation();
            handleDeleteAddress(addressInfo);
          }}
          variant="outline"
          className="w-full justify-center rounded-lg border-rose-200 bg-white text-rose-600 hover:bg-rose-50 hover:text-rose-700"
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Delete
        </Button>
      </CardFooter>
    </Card>
  );
}

export default AddressCard;
