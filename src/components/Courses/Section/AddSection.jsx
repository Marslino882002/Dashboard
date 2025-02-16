import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { NavLink, useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";  // Import axios

export default function AddSection() {
  const { categoryId, courseId } = useParams();
  const [notifications, setNotifications] = useState(3);
  const [loading, setLoading] = useState(false);  // State to track loading
  const navigate = useNavigate();

  // Formik configuration
  const formik = useFormik({
    initialValues: {
      name: "",
    },
    validationSchema: Yup.object({
      name: Yup.string().required("الاسم مطلوب"),
    }),
    onSubmit: async (values) => {
      console.log("Form values:", values);
      setLoading(true); // Start loading

      try {
        // API Call
        const response = await axios.post(
          `https://generalcommittee-dev.azurewebsites.net/api/courses/${courseId}/sections`,
          { name: values.name },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,  // Get token from localStorage
            },
          }
        );

        // Check if the response is successful
        if (response.status === 201 || response.status === 200) {
          // Show success toast
          toast.success("تم اضافة القسم", {
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
            // Navigate to the upload section page
            navigate(`/upload/category/${categoryId}/course/${courseId}/section`);
          }, 3000);
        }
      } catch (error) {
        // Handle errors
        toast.error("حدث خطأ أثناء إضافة القسم", {
          position: "top-left",
          autoClose: 3000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          rtl: true,
          style: { backgroundColor: "#FFEBEB", color: "Black" },
        });
        console.error("Error adding section:", error);
      } finally {
        setLoading(false); // Stop loading
      }
    },
  });

  return (
    <div className="max-w-6xl mx-auto py-6 bg-gray-100 rounded-lg px-3">
      {/* Toast Container */}
      <ToastContainer />
      {/* Title with Notification Section */}
      <div className="flex items-center mb-6 justify-between">
        <p className="text-3xl font-semibold text-right text-black"> الرفع - كورسات - القسم</p>
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

        <div className="flex justify-end mt-6">
          <button
            type="submit"
            disabled={loading || !formik.isValid}  // Disable button if loading or form is invalid
            className={`py-3 px-12 rounded-lg transition-all ${
              loading
                ? "bg-gray-400 text-white cursor-not-allowed"
                : !formik.isValid
                ? "bg-gray-400 text-white cursor-not-allowed"
                : "bg-[#195E8B] text-white hover:bg-[#134969] cursor-pointer"
            }`}
          >
            {loading ? (
              <i className="fa fa-spinner fa-spin"></i>  // Show loading spinner
            ) : (
              "اضافة الفئة"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
