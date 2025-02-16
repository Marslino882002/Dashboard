import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { NavLink } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";


export default function AddCategory() {
  
  const [notifications, setNotifications] = useState(3);
  const navigate = useNavigate();



  // Formik configuration
  const formik = useFormik({
    initialValues: {
      name: "",
      description: "",
    },
    validationSchema: Yup.object({
      name: Yup.string().required("الاسم مطلوب"),
      description: Yup.string(),
    }),
    onSubmit: (values) => {
    
      console.log("Form values:", values);
  

      // Show success toast
      toast.success("تم اضافة الفئة", {
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
        navigate("/upload/categories"); 
      }, 3000);

    },
  });



  return (
    <div className="max-w-6xl mx-auto py-6 bg-gray-100 rounded-lg px-3">
      {/* Toast Container */}
      <ToastContainer />
      {/* Title with Notification Section */}
      <div className="flex items-center mb-6 justify-between">
      <p className="text-3xl font-semibold text-right text-black"> الرفع - كورسات - الفئة</p>
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
            العنوان<span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="name"
            name="name"
            placeholder="علاج الادمان"
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
            الوصف <span className="text-red-500">*</span>
          </label>
          <textarea
            id="description"
            name="description"
            placeholder=" التعافي من الادمان من اهم الاشياء"
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

       

        <div className="flex justify-end mt-6">
          <button
            type="submit"
            disabled={!formik.isValid } // Disable button if form is invalid 
            className={`py-3 px-12 rounded-lg transition-all ${
              !formik.isValid 
                ? "bg-gray-400 text-white cursor-not-allowed"
                : "bg-[#195E8B] text-white hover:bg-[#134969] cursor-pointer"
            }`}
          >
            اضافة الفئة
          </button>
        </div>
      </form>
    </div>
  );
}
