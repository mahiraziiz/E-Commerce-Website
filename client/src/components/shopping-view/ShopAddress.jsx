import { useEffect, useState } from "react";
import CommonForm from "../common/Form";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { addressFormControls } from "@/config";
import { useDispatch, useSelector } from "react-redux";
import AddressCard from "./ShopAddressCard";
import { useToast } from "../../hooks/useToast.js";
import {
  addNewAddress,
  deleteAddress,
  editAddress,
  fetchAllAddress,
} from "@/store/shop/address-slice/index.js";

const initialAddressFormData = {
  name: "",
  addressLine1: "",
  addressLine2: "",
  city: "",
  state: "",
  pincode: "",
  country: "",
  countryCode: "",
  phone: "",
  notes: "",
};

function Address({ setCurrentSelectedAddress, selectedId }) {
  const [formData, setFormData] = useState(initialAddressFormData);
  const [currentEditedId, setCurrentEditedId] = useState(null);
  const { user } = useSelector((state) => state.auth);
  const { addressList } = useSelector((state) => state.shopAddress);
  const dispatch = useDispatch();
  const { toast } = useToast();

  function handleManageAddress(event) {
    event.preventDefault();

    if (addressList.length >= 3 && currentEditedId === null) {
      setFormData(initialAddressFormData);
      toast({
        title: "You can add max 3 addresses",
        variant: "destructive",
      });

      return;
    }

    currentEditedId !== null
      ? dispatch(
          editAddress({
            userId: user?.id,
            addressId: currentEditedId,
            formData,
          })
        ).then((data) => {
          if (data?.payload?.success) {
            dispatch(fetchAllAddress(user?.id));
            setCurrentEditedId(null);
            setFormData(initialAddressFormData);
            toast({
              title: "Address updated successfully",
            });
          }
        })
      : dispatch(
          addNewAddress({
            ...formData,
            userId: user?.id,
          })
        ).then((data) => {
          if (data?.payload?.success) {
            dispatch(fetchAllAddress(user?.id));
            setFormData(initialAddressFormData);
            toast({
              title: "Address added successfully",
            });
          }
        });
  }

  function handleDeleteAddress(getCurrentAddress) {
    dispatch(
      deleteAddress({ userId: user?.id, addressId: getCurrentAddress._id })
    ).then((data) => {
      if (data?.payload?.success) {
        dispatch(fetchAllAddress(user?.id));
        toast({
          title: "Address deleted successfully",
        });
      }
    });
  }

  function handleEditAddress(getCuurentAddress) {
    setCurrentEditedId(getCuurentAddress?._id);
    setFormData({
      ...formData,
      name: getCuurentAddress?.name,
      addressLine1: getCuurentAddress?.addressLine1,
      addressLine2: getCuurentAddress?.addressLine2,
      city: getCuurentAddress?.city,
      state: getCuurentAddress?.state,
      pincode: getCuurentAddress?.pincode,
      country: getCuurentAddress?.country,
      countryCode: getCuurentAddress?.countryCode,
      phone: getCuurentAddress?.phone,
      notes: getCuurentAddress?.notes,
    });
  }

  function isFormValid() {
    const requiredFields = [
      "name",
      "addressLine1",
      "city",
      "state",
      "pincode",
      "country",
      "countryCode",
      "phone",
    ];
    return requiredFields.every(
      (field) => formData[field] && formData[field].trim() !== ""
    );
  }

  useEffect(() => {
    dispatch(fetchAllAddress(user?.id));
  }, [dispatch]);

  return (
    <Card className="border-slate-200/80 bg-white shadow-[0_12px_36px_rgba(15,23,42,0.06)]">
      <CardHeader className="border-b border-slate-100 bg-gradient-to-r from-sky-50 via-white to-cyan-50">
        <div className="flex items-center justify-between gap-3">
          <div>
            <CardTitle className="font-black tracking-tight text-slate-950">
              Saved Addresses
            </CardTitle>
            <p className="mt-1 text-sm text-slate-500">
              Choose one for checkout or edit an existing location.
            </p>
          </div>
          <div className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm ring-1 ring-slate-200">
            {addressList?.length || 0} saved
          </div>
        </div>
      </CardHeader>

      <div className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-2 xl:grid-cols-3">
        {addressList && addressList.length > 0 ? (
          addressList.map((singleAddressItem) => (
            <AddressCard
              key={singleAddressItem?._id}
              selectedId={selectedId}
              handleDeleteAddress={handleDeleteAddress}
              addressInfo={singleAddressItem}
              handleEditAddress={handleEditAddress}
              setCurrentSelectedAddress={setCurrentSelectedAddress}
            />
          ))
        ) : (
          <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-slate-200 bg-slate-50 py-12 text-center sm:col-span-2 xl:col-span-3">
            <p className="text-lg font-semibold text-slate-950">
              No saved address yet
            </p>
            <p className="mt-1 text-sm text-slate-500">
              Add one below. It will appear here as a polished address card.
            </p>
          </div>
        )}
      </div>
      <CardHeader className="border-t border-slate-100 bg-slate-50/60">
        <CardTitle className="font-black tracking-tight text-slate-950">
          {currentEditedId !== null ? "Edit Address" : "Add New Address"}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <CommonForm
          formControls={addressFormControls}
          formData={formData}
          setFormData={setFormData}
          buttonText={currentEditedId !== null ? "Edit" : "Add"}
          onSubmit={handleManageAddress}
          isBtnDisabled={!isFormValid()}
        />
      </CardContent>
    </Card>
  );
}

export default Address;
