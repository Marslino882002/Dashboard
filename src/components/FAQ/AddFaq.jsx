import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function AddFaq() {
  const { faqNumber } = useParams(); // Accept faqNumber from the route params
  const [notifications, setNotifications] = useState(3);
  const navigate = useNavigate();

  // Mapping FAQ categories to names
  const faqNames = {
    1: "الشروط والأحكام",
    2: "سياسة الخصوصية",
    3: "الأسئلة الشائعة",
  };
  const faqTitle = faqNames[faqNumber] || "مركز المساعدة";
  console.log(parseInt(faqNumber))
  // Formik configuration
  const formik = useFormik({
    initialValues: {
      name: "",
      description: "",
    },
    validationSchema: Yup.object({
      name: Yup.string().required("العنوان مطلوب"),
      description: Yup.string().required("الوصف مطلوب"),
    }),
    onSubmit: async (values) => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.post(
          "https://mentalhealthcareapi20250307003056.azurewebsites.net/api/helpcenter",
          {
            helpCenterItemType: parseInt(faqNumber),
            name: values.name,
            description: values.description,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`, // Pass token in the Authorization header
            },
          }
        );
    
        if (response.status === 204) {
          // Show success toast
          toast.success(`تم إضافة ${faqTitle} بنجاح`, {
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
    
          // Redirect after success
          setTimeout(() => {
            navigate(`/faq`);
          }, 3000);
        } else {
          throw new Error("Unexpected response");
        }
      } catch (error) {
        console.error("Error posting FAQ:", error);
        toast.error("حدث خطأ أثناء إضافة البيانات", {
          position: "top-left",
          autoClose: 3000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          rtl: true,
          style: { backgroundColor: "#FFEFEF", color: "Black" },
        });
      }
    },
    
  });

  return (
    <div className="max-w-6xl mx-auto py-6 bg-gray-100 rounded-lg px-3">
      {/* Toast Container */}
      <ToastContainer />
      {/* Title with Notification Section */}
      <div className="flex items-center mb-6 justify-between">
        <p className="text-3xl font-semibold text-right text-black">
          مركز المساعدة - {faqTitle}
        </p>
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
        {/* Name Field */}
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
            placeholder="أدخل العنوان"
            className="w-full p-3 border border-gray-300 rounded-lg"
            value={formik.values.name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.name && formik.errors.name && (
            <p className="text-red-500 text-sm">{formik.errors.name}</p>
          )}
        </div>

        {/* Description Field */}
        <div className="mt-4">
          <label
            htmlFor="description"
            className="block text-right text-gray-700 mb-2 font-medium text-xl md:text-2xl"
          >
            الوصف<span className="text-red-500">*</span>
          </label>
          <textarea
            id="description"
            name="description"
            placeholder="أدخل الوصف"
            className="w-full p-3 border border-gray-300 rounded-lg"
            value={formik.values.description}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.description && formik.errors.description && (
            <p className="text-red-500 text-sm">{formik.errors.description}</p>
          )}
        </div>

        {/* Submit Button */}
        <div className="flex justify-end mt-6">
          <button
            type="submit"
            disabled={!formik.values.name || !formik.values.description}
            className={`py-3 px-12 rounded-lg transition-all ${
              !formik.values.name || !formik.values.description
                ? "bg-gray-400 text-white cursor-not-allowed"
                : "bg-[#195E8B] text-white hover:bg-[#134969] cursor-pointer"
            }`}
          >
            إضافة {faqTitle}
          </button>
        </div>
      </form>
    </div>
  );
}
