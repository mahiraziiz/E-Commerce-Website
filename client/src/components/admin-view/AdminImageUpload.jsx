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
  uploadedImages,
  setUploadedImages,
  imageLoadingState,
  setImageLoadingState,
  formData,
  setFormData,
}) {
  const inputRef = useRef(null);

  function handleImageFileChange(event) {
    const selectedFiles = Array.from(event.target.files || []);
    if (selectedFiles.length > 0) {
      setImageFile(selectedFiles);
    }
  }

  function handleDragOver(event) {
    event.preventDefault();
  }

  function handleDrop(event) {
    event.preventDefault();
    const droppedFiles = Array.from(event.dataTransfer.files || []);
    if (droppedFiles.length > 0) {
      setImageFile(droppedFiles);
    }
  }

  function handleRemoveImage(imageToRemove) {
    const updatedImages = uploadedImages.filter(
      (currentImage) => currentImage !== imageToRemove
    );

    setUploadedImages(updatedImages);
    setFormData({
      ...formData,
      images: updatedImages,
      image: updatedImages[0] || null,
    });

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  }

  async function uploadImageToCloudinary(filesToUpload) {
    if (!filesToUpload || filesToUpload.length === 0) return;

    setImageLoadingState(true);

    try {
      const uploadedUrls = [];

      for (const file of filesToUpload) {
        const data = new FormData();
        data.append("my_file", file);

        const response = await axios.post(
          "http://localhost:5000/api/admin/products/upload-image",
          data
        );

        if (response?.data?.success && response?.data?.result?.url) {
          uploadedUrls.push(response.data.result.url);
        }
      }

      if (uploadedUrls.length > 0) {
        const nextImages = [...uploadedImages, ...uploadedUrls];
        setUploadedImages(nextImages);
        setFormData({
          ...formData,
          images: nextImages,
          image: nextImages[0] || null,
        });
      }
    } catch (error) {
      console.error(error);
    } finally {
      setImageLoadingState(false);
      setImageFile(null);
      if (inputRef.current) {
        inputRef.current.value = "";
      }
    }
  }

  useEffect(() => {
    if (imageFile && imageFile.length > 0) {
      uploadImageToCloudinary(imageFile);
    }
  }, [imageFile]);

  return (
    <div className="mx-auto mt-2 w-full max-w-md rounded-[1.5rem] border border-dashed border-slate-200 bg-slate-50 p-4">
      <Label className="mb-2 block text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
        Upload Images
      </Label>
      <div
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className="rounded-[1.25rem] border border-dashed border-slate-300 bg-white p-4 shadow-sm"
      >
        <Input
          id="image-upload"
          type="file"
          multiple
          className="hidden"
          ref={inputRef}
          onChange={handleImageFileChange}
        />

        {!uploadedImages || uploadedImages.length === 0 ? (
          <Label
            htmlFor="image-upload"
            className="flex h-40 cursor-pointer flex-col items-center justify-center gap-3 rounded-[1rem] text-center"
          >
            <span className="grid h-14 w-14 place-items-center rounded-2xl bg-slate-950 text-white shadow-lg shadow-slate-950/15">
              <UploadCloudIcon className="h-7 w-7" />
            </span>
            <span className="text-sm font-medium text-slate-700">
              Drag and drop or click to upload multiple images
            </span>
          </Label>
        ) : null}

        {imageLoadingState ? (
          <Skeleton className="mt-4 h-14 rounded-[1rem] bg-slate-200" />
        ) : null}

        {uploadedImages && uploadedImages.length > 0 ? (
          <div className="mt-4 space-y-4 rounded-[1rem] border border-slate-100 bg-slate-50 p-3">
            <div className="flex items-center gap-3">
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-slate-950 text-white">
                <FileIcon className="h-5 w-5" />
              </span>
              <div>
                <p className="text-sm font-semibold text-slate-950">Uploaded images</p>
                <p className="text-xs text-slate-500">
                  The first image is used as the product cover
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {uploadedImages.map((imageUrl) => (
                <div
                  key={imageUrl}
                  className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white"
                >
                  <img
                    src={imageUrl}
                    alt="Uploaded product"
                    className="h-28 w-full object-cover"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-2 h-8 w-8 rounded-full bg-white/90 text-slate-700 shadow hover:bg-rose-50 hover:text-rose-600"
                    onClick={() => handleRemoveImage(imageUrl)}
                  >
                    <XIcon className="h-4 w-4" />
                    <span className="sr-only">Remove image</span>
                  </Button>
                </div>
              ))}
            </div>
            <Label
              htmlFor="image-upload"
              className="flex cursor-pointer items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-sky-300 hover:text-sky-700"
            >
              Add more images
            </Label>
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default ProductImageUpload;
