import React from "react";
import { Card, CardContent, CardFooter } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";

function AdminProductTile({
  product,
  setFormData,
  setOpenCreateProductDialog,
  setCurrentEditedId,
  setImageFile,
  setUploadedImages,
  handleDelete,
}) {
  const productImages = product?.images?.length
    ? product.images
    : product?.image
    ? [product.image]
    : [];

  return (
    <Card className="group w-full overflow-hidden rounded-[1.5rem] border border-slate-200/80 bg-white shadow-[0_12px_36px_rgba(15,23,42,0.06)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_50px_rgba(15,23,42,0.1)]">
      <div>
        <div className="relative overflow-hidden">
          <img
            src={product?.image}
            alt={product?.title}
            className="h-52 w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
          />
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/70 to-transparent p-4 text-white">
            <div className="flex items-center justify-between gap-2">
              <Badge className="rounded-full border border-white/10 bg-white/10 text-white hover:bg-white/15">
                {product?.category}
              </Badge>
              <Badge className="rounded-full bg-amber-300 text-slate-950 hover:bg-amber-200">
                {product?.totalStock} in stock
              </Badge>
            </div>
          </div>
        </div>
        <CardContent className="space-y-3 p-4">
          <div className="space-y-1">
            <h2 className="text-lg font-semibold tracking-tight text-slate-950">{product?.title}</h2>
            <p className="line-clamp-2 text-sm text-slate-500">{product?.description}</p>
          </div>
          <div className="flex items-end justify-between rounded-2xl border border-slate-100 bg-slate-50 p-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Price</p>
              <div className="mt-1 flex items-center gap-2">
                <span
                  className={`text-lg font-semibold ${
                    product?.salePrice > 0 ? "text-slate-400 line-through" : "text-slate-950"
                  }`}
                >
                  ${product?.price}
                </span>
                {product?.salePrice > 0 ? (
                  <span className="text-lg font-black text-emerald-600">
                    ${product?.salePrice}
                  </span>
                ) : null}
              </div>
            </div>
            <span className="rounded-full bg-slate-950 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-white">
              {product?.brand}
            </span>
          </div>
        </CardContent>
        <CardFooter className="flex items-center justify-between gap-3 border-t border-slate-100 bg-slate-50/70 p-4">
          <Button
            onClick={() => {
              setOpenCreateProductDialog(true);
              setCurrentEditedId(product?._id);
              setFormData({
                ...product,
                image: productImages[0] || null,
                images: productImages,
              });
              setImageFile(null);
              setUploadedImages(productImages);
            }}
            className="rounded-2xl bg-slate-950 text-white hover:bg-slate-800"
          >
            Edit
          </Button>
          <Button
            onClick={() => {
              handleDelete(product?._id);
            }}
            variant="outline"
            className="rounded-2xl border-rose-200 text-rose-600 hover:bg-rose-50 hover:text-rose-700"
          >
            Delete
          </Button>
        </CardFooter>
      </div>
    </Card>
  );
}

export default AdminProductTile;
