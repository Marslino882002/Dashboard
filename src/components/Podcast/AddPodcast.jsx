import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { NavLink } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";


export default function AddPodcast() {
  const [images, setImages] = useState([]);
  const [dragActive, setDragActive] = useState(false);
  const [notifications, setNotifications] = useState(3);
  const [imageError, setImageError] = useState(""); // Error state for image
  const navigate = useNavigate();



  // Formik configuration
  const formik = useFormik({
    initialValues: {
      name: "",
      description: "",
    },
    validationSchema: Yup.object({
      name: Yup.string().required("الاسم مطلوب"),
      description: Yup.string().required("الوصف مطلوب"),
    }),
    onSubmit: (values) => {
      if (images.length === 0) {
        setImageError("يرجى تحميل صورة واحدة على الأقل "); // Show error if no image
        return;
      }
      setImageError(""); // Clear image error
      console.log("Form values:", values);
      console.log("Uploaded image:", images[0]); // Only one image is allowed

      // Show success toast
      toast.success("تم اضافة البودكاست", {
        position: "top-left",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        rtl: true,
        style: { backgroundColor: "#EFFFEF", color: "Black" },
      });

      setTimeout(() => {
        navigate("/upload/podcast"); 
      }, 3000);

    },
  });

  const handleImageUpload = (event) => {
    const file = event.target.files[0]; // Get the first file
    if (file && file.size <= 1024 * 1024 && /image\/(jpeg|png|jpg)/.test(file.type)) {
      const newImage = URL.createObjectURL(file);
      setImages([newImage]); // Replace the image array with the new image
      setImageError(""); // Clear error when a valid image is uploaded
    } else {
      setImageError("يرجى تحميل صورة بصيغة JPG أو PNG بحجم أقل من 1MB");
    }
  };

  const handleRemoveImage = () => {
    setImages([]); // Clear the image
  };

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleImageUpload({ target: { files: [e.dataTransfer.files[0]] } }); // Pass only the first file
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-6 bg-gray-100 rounded-lg px-3">
      {/* Toast Container */}
      <ToastContainer />
      {/* Title with Notification Section */}
      <div className="flex items-center mb-6 justify-between">
        <p className="text-3xl font-semibold text-right text-black">الرفع - بودكاست</p>
        <div className="flex items-center">
          <div className="w-[1.4px] h-12 bg-gray-300 ml-5"></div>
          <div className="relative flex justify-center items-center rounded-lg shadow-4 w-12 h-12 mr-4 bg-white">
            <i className="fa-regular fa-bell fa-lg"></i>
            {notifications > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
                {notifications}
              </span>
            )}
          </div>
        </div>
      </div>
      <div className="w-full h-[2px] bg-gray-200 mb-8"></div>

      <form onSubmit={formik.handleSubmit}>
        <div>
          <label
            htmlFor="name"
            className="block text-right text-gray-700 mb-2 font-medium text-xl md:text-2xl"
          >
            الاسم<span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="name"
            name="name"
            placeholder="يوسف"
            className="w-full p-3 border border-gray-300 rounded-lg"
            value={formik.values.name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.name && formik.errors.name && (
            <p className="text-red-500 text-sm">{formik.errors.name}</p>
          )}
        </div>

        <div className="mt-5">
          <label
            htmlFor="description"
            className="block text-right text-gray-700 mb-2 font-medium text-xl md:text-2xl"
          >
            عنوان البودكاست<span className="text-red-500">*</span>
          </label>
          <textarea
            id="description"
            name="description"
            placeholder="التعافي من الادمان"
            className="w-full p-3 border border-gray-300 rounded-lg"
            rows={4}
            value={formik.values.description}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.description && formik.errors.description && (
            <p className="text-red-500 text-sm">{formik.errors.description}</p>
          )}
        </div>

        <div
          className={`mt-6 border-4 p-6 rounded-xl bg-white ${
            dragActive ? "border-blue-500" : "border-gray-200 border-dashed"
          }`}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
        >
          {images.length === 0 && (
            <div className="flex flex-col items-center py-5">
              <i className="fa-regular fa-image text-gray-400 text-3xl mb-4"></i>
              <div className="flex">
                <p className="text-black">or drag and drop </p>
                <label className="text-blue-500 cursor-pointer hover:underline ml-2 mr-2">
                  Click to upload
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpload}
                  />
                </label>
              </div>
              <p>JPG, JPEG, PNG less than 1MB</p>
            </div>
          )}
          {images.length > 0 && (
            <div className="relative w-55 h-55 rounded-lg overflow-hidden border border-gray-300">
              <img
                src={images[0]}
                alt="Uploaded"
                className="w-full h-full object-cover"
              />
              <button
                onClick={handleRemoveImage}
                type="button"
                className="absolute top-2 left-2 bg-white text-white rounded-md p-1 text-xs py-1 px-2"
              >
                <i
                  className="fa-regular fa-trash-can fa-lg"
                  style={{ color: "#e7040f" }}
                ></i>
              </button>
            </div>
          )}
          {imageError && <p className="text-red-500 text-sm mt-2">{imageError}</p>}
        </div>

        <div className="flex justify-end mt-6">
          <button
            type="submit"
            disabled={!formik.isValid || images.length === 0} // Disable button if form is invalid or no image uploaded
            className={`py-3 px-12 rounded-lg transition-all ${
              !formik.isValid || images.length === 0
                ? "bg-gray-400 text-white cursor-not-allowed"
                : "bg-[#195E8B] text-white hover:bg-[#134969] cursor-pointer"
            }`}
          >
            رفع البودكاست
          </button>
        </div>
      </form>
    </div>
  );
}
