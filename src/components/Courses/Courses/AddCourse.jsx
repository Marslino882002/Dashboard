import React, { useState } from "react";
  import { useFormik } from "formik";
  import * as Yup from "yup";
  import { ToastContainer, toast } from "react-toastify";
  import "react-toastify/dist/ReactToastify.css";
  import { useNavigate, useParams } from "react-router-dom";
  import axios from "axios";

  export default function AddCourse() {
    const { categoryId } = useParams();
    const navigate = useNavigate();

    const [image, setImage] = useState(null); // For a single image
    const [dragActive, setDragActive] = useState(false);
    const [notifications, setNotifications] = useState(3);
    const [imageError, setImageError] = useState("");
    const [loading, setLoading] = useState(false); // Loading state
    
    const handleImageUpload = (event) => {
      const file = event.target.files[0]; // Get only the first file
    
      if (file && file.size <= 1 * 1024 * 1024 && /image\/(jpeg|png|jpg|webp)/.test(file.type)) {
        setImage(file); // Store the actual file in the state
        setImageError(""); // Clear any previous errors
        // console.log("Uploaded Image:", file); 
      } else {
        setImageError("يرجى تحميل صورة بصيغة JPG أو PNG أو WEBP بحجم أقل من 1MB");
      }
    };
    
    
    

    const handleRemoveImage = () => {
      setImage(null); // Clear the image
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
        handleImageUpload({ target: { files: [e.dataTransfer.files[0]] } });
      }
    };

    // Formik configuration
    const formik = useFormik({
      initialValues: {
        name: "",
        description: "",
        price: "",
        isFree: false,
      },
      validationSchema: Yup.object({
        name: Yup.string().required("العنوان مطلوب"),
        description: Yup.string().required("التأملات مطلوبة"),
        price: Yup.number()
          .required("المبلغ مطلوب")
          .min(0, "يجب أن يكون السعر رقمًا موجبًا"),
      }),
      onSubmit: async (values) => {
        if (!image) {
          setImageError("يرجى تحميل صورة واحدة على الأقل");
          return;
        }
        // console.log("Submitting Image:", image); 
        setImageError("");
        setLoading(true);
      
        const courseData = {
          name: values.name,
          price: values.price,
          description: values.description,
          instructorId: 7,
          categoryId: [6],
          // categoryId: [parseInt(categoryId)],
        };
      
        const token = localStorage.getItem("token");
        if (!token) {
          setLoading(false);
          toast.error("لا يوجد رمز مصدق!");
          return;
        }
      
        try {
          const response = await axios.post(
            "https://mentalhealthcareapi20250307003056.azurewebsites.net/api/courses",
            courseData,
            { headers: { Authorization: `Bearer ${token}` } }
          );
      
          // console.log(response)
          const courseId = response.data.data?.courseId?.courseId;
          if (!courseId) throw new Error("Invalid course ID received");
      
          // console.log("Course created successfully. Uploading thumbnail...");
          await handleAddThumbnail(courseId, image);
          // console.log("Thumbnail uploaded successfully.");
      
          setLoading(false);
          toast.success("تم اضافة الكورس",{
            position: "top-left",
            autoClose: 3000,
          });
      
          setTimeout(() => {
            navigate(`/upload/category/${categoryId}/course`);
          }, 3000);
        } catch (error) {
          setLoading(false);
          console.error("Error:", error.response?.data || error.message);
          toast.error(error.response?.data?.message || "حدث خطأ أثناء إضافة الكورس");
        }
      }
      
      
    });

    const handleAddThumbnail = async (courseId, image) => {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found");

        return;
      }
    
      try {
        const formData = new FormData();
        formData.append("CourseId", courseId); // Ensure courseId is correctly added
        const newImage = new File([image], image.name, { type: image.type });
        formData.append("File", newImage);

    
        // console.log("Uploading Thumbnail...", formData.get("File")); // Debugging
    
        const response = await axios.post(
          `https://mentalhealthcareapi20250307003056.azurewebsites.net/api/courses/${courseId}/thumbnail`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data", // Allow axios to set correct boundary
            },
          }
        );
    
        if (response.status === 200 || response.status === 201) {
          console.log("Thumbnail uploaded successfully.");
        } else {
          console.error("Failed to upload thumbnail:", response.data.message);
        }
      } catch (error) {
        console.error("Error uploading thumbnail:", error.response?.data || error.message);
      }
    };
    

    return (
      <>
        <div className="max-w-6xl mx-auto py-6 bg-gray-100 rounded-lg px-3">
          {/* Toast Container */}
          <ToastContainer />
          {/* Title with Notification Section */}
          <div className="flex items-center mb-6 justify-between">
            <p className="text-3xl font-semibold text-right text-black">
              الرفع - كورسات - الكورس
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
    {/* Name Input */}
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
        placeholder="العمل"
        className={`w-full p-3 border rounded-lg ${
          formik.touched.name && formik.errors.name
            ? "border-red-500"
            : "border-gray-300"
        }`}
        {...formik.getFieldProps("name")}
      />
      {formik.touched.name && formik.errors.name && (
        <p className="text-red-500 text-sm mt-1">{formik.errors.name}</p>
      )}
    </div>

    {/* Description Input */}
    <div className="mt-5">
      <label
        htmlFor="description"
        className="block text-right text-gray-700 mb-2 font-medium text-xl md:text-2xl"
      >
        الوصف<span className="text-red-500">*</span>
      </label>
      <textarea
        id="description"
        placeholder="الوصف"
        className={`w-full p-3 border rounded-lg ${
          formik.touched.description && formik.errors.description
            ? "border-red-500"
            : "border-gray-300"
        }`}
        rows={4}
        {...formik.getFieldProps("description")}
      />
      {formik.touched.description && formik.errors.description && (
        <p className="text-red-500 text-sm mt-1">
          {formik.errors.description}
        </p>
      )}
    </div>

    {/* Price Input */}
    <div className="mt-5">
      <label
        htmlFor="price"
        className="block text-right text-gray-700 mb-2 font-medium text-xl md:text-2xl"
      >
        السعر<span className="text-red-500">*</span>
      </label>
      <input
        type="number"
        id="price"
        placeholder="أدخل السعر"
        className={`w-full p-3 border rounded-lg ${
          formik.touched.price && formik.errors.price
            ? "border-red-500"
            : "border-gray-300"
        }`}
        {...formik.getFieldProps("price")}
      />
      {formik.touched.price && formik.errors.price && (
        <p className="text-red-500 text-sm mt-1">{formik.errors.price}</p>
      )}
    </div>

    {/* Image Upload */}
    <div
      className={`mt-6 border-4 p-6 rounded-xl bg-white ${
        dragActive ? "border-blue-500" : "border-gray-200 border-dashed"
      }`}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
    >
      {!image && (
        <div className="flex flex-col items-center py-5">
          <i className="fa-regular fa-image text-gray-400 text-3xl mb-4"></i>
          <div className="flex">
            <p className="text-black">or drag and drop</p>
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
      {image && (
        <div className="relative w-55 h-55 rounded-lg overflow-hidden border border-gray-300">
          <img
            src={image ? URL.createObjectURL(image) : ""}
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

    {/* Submit Button */}
    <div className="flex justify-end mt-5">
      <button
        type="submit"
        disabled={!formik.isValid || !image || imageError || loading}
        className={`py-3 px-12 rounded-lg transition-all ${
          !formik.isValid || !image || loading
            ? "bg-gray-400 text-white cursor-not-allowed"
            : "bg-[#195E8B] text-white hover:bg-[#134969] cursor-pointer"
        }`}
      >
        {loading ? "جاري الإضافة..." : "اضافة الكورس"}
      </button>
    </div>
  </form>

        </div>
      </>
    );
  }