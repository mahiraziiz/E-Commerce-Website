import { Avatar, AvatarFallback } from "../ui/avatar";
import { Button } from "../ui/button";
import { Dialog, DialogContent } from "../ui/dialog";
import { Separator } from "../ui/separator";
import { Input } from "../ui/input";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice/index.js";
import { setProductDetails } from "@/store/shop/products-slice/index.js";
import { Label } from "../ui/label";
import StarRatingComponent from "../common/StarRating";
import { useEffect, useState } from "react";
import { addReview, getReviews } from "@/store/shop/review-slice/index.js";
import { useToast } from "@/hooks/useToast.js";

function ProductDetailsDialog({ open, setOpen, productDetails }) {
  const [reviewMsg, setReviewMsg] = useState("");
  const [rating, setRating] = useState(0);
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.shopCart);
  const { reviews } = useSelector((state) => state.shopReview);

  const { toast } = useToast();

  function handleRatingChange(getRating) {
    console.log(getRating, "getRating");

    setRating(getRating);
  }

  function handleAddToCart(getCurrentProductId, getTotalStock) {
    let getCartItems = cartItems.items || [];

    if (getCartItems.length) {
      const indexOfCurrentItem = getCartItems.findIndex(
        (item) => item.productId === getCurrentProductId
      );
      if (indexOfCurrentItem > -1) {
        const getQuantity = getCartItems[indexOfCurrentItem].quantity;
        if (getQuantity + 1 > getTotalStock) {
          toast({
            title: `Only ${getQuantity} quantity can be added for this item`,
            variant: "destructive",
          });

          return;
        }
      }
    }
    dispatch(
      addToCart({
        userId: user?.id,
        productId: getCurrentProductId,
        quantity: 1,
      })
    ).then((data) => {
      if (data?.payload?.success) {
        dispatch(fetchCartItems(user?.id));
        toast({
          title: "Product is added to cart",
        });
      }
    });
  }

  function handleDialogClose() {
    setOpen(false);
    dispatch(setProductDetails());
    setRating(0);
    setReviewMsg("");
  }

  function handleAddReview() {
    dispatch(
      addReview({
        productId: productDetails?._id,
        userId: user?.id,
        userName: user?.userName,
        reviewMessage: reviewMsg,
        reviewValue: rating,
      })
    ).then((data) => {
      if (data?.payload?.success) {
        setRating(0);
        setReviewMsg("");
        dispatch(getReviews(productDetails?._id));
        toast({
          title: "Review added successfully!",
        });
      }
    });
  }

  useEffect(() => {
    if (productDetails !== null) dispatch(getReviews(productDetails?._id));
  }, [productDetails]);

  console.log(reviews, "reviews");

  const averageReview =
    reviews && reviews.length > 0
      ? reviews.reduce((sum, reviewItem) => sum + reviewItem.reviewValue, 0) /
        reviews.length
      : 0;

  return (
    <Dialog open={open} onOpenChange={handleDialogClose}>
      <DialogContent className="grid max-w-[90vw] gap-8 rounded-[1.75rem] border-slate-200/80 bg-white p-6 sm:max-w-[80vw] sm:p-10 lg:max-w-[68vw] lg:grid-cols-2">
        <div className="relative overflow-hidden rounded-[1.5rem] border border-slate-200/80 bg-slate-50">
          <img
            src={productDetails?.image}
            alt={productDetails?.title}
            width={600}
            height={600}
            className="aspect-square w-full object-cover"
          />
        </div>
        <div className="space-y-5">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-sky-600">Product details</p>
            <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-950">{productDetails?.title}</h1>
            <p className="mt-4 text-base leading-7 text-slate-600">
              {productDetails?.description}
            </p>
          </div>
          <div className="flex items-center justify-between rounded-2xl bg-sky-50 px-4 py-3">
            <p
              className={`text-3xl font-black tracking-tight text-slate-950 ${
                productDetails?.salePrice > 0 ? "line-through" : ""
              }`}
            >
              ${productDetails?.price}
            </p>
            {productDetails?.salePrice > 0 ? (
              <p className="text-2xl font-black text-sky-700">
                ${productDetails?.salePrice}
              </p>
            ) : null}
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-0.5 text-sky-500">
              <StarRatingComponent rating={averageReview} />
            </div>
            <span className="text-sm text-slate-500">
              ({averageReview.toFixed(2)})
            </span>
          </div>
          <div className="pt-1">
            {productDetails?.totalStock === 0 ? (
              <Button className="w-full cursor-not-allowed rounded-2xl bg-slate-200 text-slate-500 opacity-100 hover:bg-slate-200">
                Out of Stock
              </Button>
            ) : (
              <Button
                className="w-full rounded-2xl bg-sky-600 text-white shadow-lg shadow-sky-600/20 hover:bg-sky-500"
                onClick={() =>
                  handleAddToCart(
                    productDetails?._id,
                    productDetails?.totalStock
                  )
                }
              >
                Add to Cart
              </Button>
            )}
          </div>
          <Separator className="bg-slate-100" />
          <div className="max-h-[300px] overflow-auto pr-1">
            <h2 className="mb-3 text-lg font-bold tracking-tight text-slate-950">Reviews</h2>
            <div className="grid gap-6">
              {reviews && reviews.length > 0 ? (
                reviews.map((reviewItem) => (
                  <div key={reviewItem?._id || reviewItem?.userName} className="flex gap-4 rounded-2xl bg-slate-50 p-4">
                    <Avatar className="h-10 w-10 border border-sky-100 bg-sky-50">
                      <AvatarFallback className="bg-sky-600 text-white">
                        {reviewItem?.userName[0].toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="grid gap-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-slate-950">{reviewItem?.userName}</h3>
                      </div>
                      <div className="flex items-center gap-0.5">
                        <StarRatingComponent rating={reviewItem?.reviewValue} />
                      </div>
                      <p className="text-sm leading-6 text-slate-600">
                        {reviewItem.reviewMessage}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-4 text-sm text-slate-500">
                  No reviews yet.
                </div>
              )}
            </div>
            <div className="mt-8 flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4">
              <Label className="text-sm font-semibold text-slate-900">Write a review</Label>
              <div className="flex gap-1">
                <StarRatingComponent
                  rating={rating}
                  handleRatingChange={handleRatingChange}
                />
              </div>
              <Input
                name="reviewMsg"
                value={reviewMsg}
                onChange={(event) => setReviewMsg(event.target.value)}
                placeholder="Share your experience..."
              />
              <Button
                onClick={handleAddReview}
                className="rounded-2xl bg-sky-600 text-white hover:bg-sky-500"
                disabled={reviewMsg.trim() === ""}
              >
                Submit
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default ProductDetailsDialog;
