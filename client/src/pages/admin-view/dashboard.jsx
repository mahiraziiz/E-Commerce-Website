import ProductImageUpload from "@/components/admin-view/AdminImageUpload";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  addFeatureImage,
  getFeatureImages,
  deleteFeatureImage,
} from "@/store/common-slice/index.js";
import { Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

function AdminDashboard() {
  const [imageFile, setImageFile] = useState(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState("");
  const [imageLoadingState, setImageLoadingState] = useState(false);
  const dispatch = useDispatch();
  const { featureImageList } = useSelector((state) => state.commonFeature);

  function handleUploadFeatureImage() {
    dispatch(addFeatureImage(uploadedImageUrl)).then((data) => {
      if (data?.payload?.success) {
        dispatch(getFeatureImages());
        setImageFile(null);
        setUploadedImageUrl("");
      }
    });
  }

  function handleDeleteFeatureImage(id) {
    dispatch(deleteFeatureImage(id)).then((data) => {
      if (data?.payload?.success) {
        dispatch(getFeatureImages());
      }
    });
  }

  useEffect(() => {
    dispatch(getFeatureImages());
  }, [dispatch]);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 lg:grid-cols-[1.3fr_0.7fr]">
        <Card className="border-slate-200/80 bg-slate-950 text-white shadow-[0_18px_60px_rgba(15,23,42,0.12)]">
          <CardContent className="flex h-full flex-col justify-between gap-6 p-6 sm:p-8">
            <div className="space-y-3">
              <span className="inline-flex rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.3em] text-amber-200">
                Feature banner manager
              </span>
              <h1 className="max-w-2xl text-3xl font-black tracking-tight sm:text-4xl">
                Keep the storefront banner current without leaving the admin panel.
              </h1>
              <p className="max-w-2xl text-sm leading-6 text-slate-300 sm:text-base">
                Upload and publish the featured image shown on the home page with a workflow that stays fast and simple.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-[11px] uppercase tracking-[0.24em] text-slate-400">Focus</p>
                <p className="mt-2 text-sm font-semibold">Promotions and launches</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-[11px] uppercase tracking-[0.24em] text-slate-400">Speed</p>
                <p className="mt-2 text-sm font-semibold">Instant visual updates</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-[11px] uppercase tracking-[0.24em] text-slate-400">Control</p>
                <p className="mt-2 text-sm font-semibold">Keep the homepage alive</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-slate-200/80 bg-white shadow-[0_18px_60px_rgba(15,23,42,0.08)]">
          <CardContent className="p-6 sm:p-8">
            <ProductImageUpload
              imageFile={imageFile}
              setImageFile={setImageFile}
              uploadedImageUrl={uploadedImageUrl}
              setUploadedImageUrl={setUploadedImageUrl}
              setImageLoadingState={setImageLoadingState}
              imageLoadingState={imageLoadingState}
              isCustomStyling={true}
            />
            <Button 
              onClick={handleUploadFeatureImage} 
              disabled={!uploadedImageUrl || imageLoadingState}
              className="mt-6 h-11 w-full rounded-2xl bg-slate-950 text-white shadow-lg shadow-slate-950/15 hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-slate-950"
              title={!uploadedImageUrl ? "Please upload an image first" : ""}
            >
              {imageLoadingState ? "Publishing..." : "Publish banner"}
            </Button>
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {featureImageList && featureImageList.length > 0
          ? featureImageList.map((featureImgItem) => (
              <div
                key={featureImgItem._id || featureImgItem.image}
                className="group relative overflow-hidden rounded-[1.5rem] border border-slate-200/80 bg-white shadow-[0_12px_40px_rgba(15,23,42,0.06)]"
              >
                <img
                  src={featureImgItem.image}
                  className="h-56 w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                />
                <Button
                  onClick={() => handleDeleteFeatureImage(featureImgItem._id)}
                  className="absolute right-3 top-3 h-8 w-8 rounded-full bg-rose-50 p-0 text-rose-600 shadow-lg opacity-0 transition-opacity hover:bg-rose-100 group-hover:opacity-100"
                  title="Remove banner"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))
          : (
            <Card className="border-dashed border-slate-200 bg-white md:col-span-2 xl:col-span-3">
              <CardContent className="flex min-h-[220px] flex-col items-center justify-center text-center">
                <p className="text-lg font-semibold text-slate-900">No feature banners yet</p>
                <p className="mt-2 max-w-md text-sm text-slate-600">
                  Upload your first hero image to give the store homepage a stronger visual identity.
                </p>
              </CardContent>
            </Card>
          )}
      </div>
    </div>
  );
}

export default AdminDashboard;
