import { FileIcon, UploadCloudIcon, XIcon } from "lucide-react";
import React, { useEffect, useRef } from "react";
import axios from "axios";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Skeleton } from "../ui/skeleton";

function ProductImageUpload({
  imageFile,
  setImageFile,
  uploadedImageUrl,
  setUploadedImageUrl,
  imageLoadingState,
  setImageLoadingState,
  isEditMode,
}) {
  const inputRef = useRef(null);

  function handleImageFileChange(event) {
    console.log(event.target.files);
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      console.log(selectedFile);
      setImageFile(selectedFile);
    }
  }

  function handleDragOver(event) {
    event.preventDefault();
  }

  function handleDrop(event) {
    event.preventDefault();
    const droppedFile = event.dataTransfer.files?.[0];
    if (droppedFile) {
      setImageFile(droppedFile);
    }
  }

  function handleRemoveImage() {
    setImageFile(null);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  }

  async function uploadImageToCloudinary() {
    setImageLoadingState(true);
    const data = new FormData();
    data.append("my_file", imageFile);
    const response = await axios.post(
      "http://localhost:5000/api/admin/products/upload-image",
      data
    );
    if (response?.data?.success) {
      setUploadedImageUrl(response.data.result.url);
      setImageLoadingState(false);
    }
  }

  useEffect(() => {
    if (imageFile !== null) {
      // console.log("Image file selected:", imageFile);
      uploadImageToCloudinary();
    }
  }, [imageFile]);

  return (
    <div className="mx-auto mt-2 w-full max-w-md rounded-[1.5rem] border border-dashed border-slate-200 bg-slate-50 p-4">
      <Label className="mb-2 block text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
        Upload Image
      </Label>
      <div
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className={`${
          isEditMode ? "opacity-60" : ""
        } rounded-[1.25rem] border border-dashed border-slate-300 bg-white p-4 shadow-sm`}
      >
        <Input
          id="image-upload"
          type="file"
          className="hidden"
          ref={inputRef}
          disabled={isEditMode}
          onChange={handleImageFileChange}
        />

        {!imageFile ? (
          <Label
            htmlFor="image-upload"
            className={`${
              isEditMode ? "cursor-not-allowed" : ""
            } flex h-40 cursor-pointer flex-col items-center justify-center gap-3 rounded-[1rem] text-center`}
          >
            <span className="grid h-14 w-14 place-items-center rounded-2xl bg-slate-950 text-white shadow-lg shadow-slate-950/15">
              <UploadCloudIcon className="h-7 w-7" />
            </span>
            <span className="text-sm font-medium text-slate-700">Drag and drop or click to upload</span>
          </Label>
        ) : imageLoadingState ? (
          <Skeleton className="h-14 rounded-[1rem] bg-slate-200" />
        ) : (
          <div className="flex items-center justify-between gap-4 rounded-[1rem] border border-slate-100 bg-slate-50 p-3">
            <div className="flex items-center gap-3">
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-slate-950 text-white">
                <FileIcon className="h-5 w-5" />
              </span>
              <div>
                <p className="text-sm font-semibold text-slate-950">Selected image</p>
                <p className="text-xs text-slate-500">Ready to upload</p>
              </div>
            </div>
            <p className="max-w-[10rem] truncate text-sm font-medium text-slate-700">{imageFile.name}</p>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full text-slate-500 hover:bg-rose-50 hover:text-rose-600"
              onClick={handleRemoveImage}
            >
              <XIcon className="w-4 h-4" />
              <span className="sr-only">Remove File</span>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProductImageUpload;
