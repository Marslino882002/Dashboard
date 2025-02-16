  import React, { useState } from "react";
  import axios from "axios";
  import { useFormik } from "formik";
  import * as Yup from "yup";
  import { ToastContainer, toast } from "react-toastify";
  import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

  export default function AddAdvertise() {
    const navigate = useNavigate();
    const [images, setImages] = useState([]);
    const [dragActive, setDragActive] = useState(false);
    const [notifications, setNotifications] = useState(3);
    const [imageError, setImageError] = useState("");

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
      onSubmit: async (values) => {
        if (images.length === 0) {
          setImageError("يرجى تحميل صورة واحدة على الأقل ");
          return;
        }
        setImageError("");

        // Prepare form data
        const formData = new FormData();
        formData.append("AdvertisementName", values.name);
        formData.append("AdvertisementDescription", values.description);
        formData.append("IsActive", true); // Set IsActive to true by default

        // Append images to the form data
        images.forEach((image, index) => {
          formData.append("Images", image);
        });

        try {
          // Axios POST request
          const token = localStorage.getItem("token"); // Retrieve token from localStorage
          const response = await axios.post(
            "https://generalcommittee-dev.azurewebsites.net/Advertisement",
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
                Authorization: `Bearer ${token}`, // Pass token in the Authorization header
              },
            }
          );
        console.log(response)
          // Show success toast
          toast.success("تم اضافة الاعلان بنجاح!", {
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

          // Clear form and images
          formik.resetForm();
          setImages([]);
          setTimeout(() => {
            navigate(`/Advertises`);
          }, 3000);
        } catch (error) {
          console.error("Error adding advertisement:", error);
          toast.error("حدث خطأ أثناء إضافة الإعلان. حاول مرة أخرى.", {
            position: "top-left",
            autoClose: 3000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            rtl: true,
            style: { backgroundColor: "#FFF5F5", color: "Black" },
          });
        }
      },
    });

    const handleImageUpload = (event) => {
      const files = Array.from(event.target.files);
      const validFiles = files.filter(
        (file) =>
          file.size <= 1024 * 1024 && /image\/(jpeg|png|jpg)/.test(file.type)
      );

      if (validFiles.length < files.length) {
        setImageError(
          "بعض الصور غير صالحة. يرجى تحميل صور بصيغة JPG أو PNG بحجم أقل من 1MB."
        );
      } else {
        setImageError("");
      }

      setImages((prevImages) => [...prevImages, ...validFiles]);

      // Reset file input value to allow consecutive uploads of the same file
      event.target.value = "";
    };

    const handleRemoveImage = (index) => {
      setImages((prevImages) => prevImages.filter((_, i) => i !== index));
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
      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        handleImageUpload({ target: { files: e.dataTransfer.files } });
      }
    };

    return (
      <div className="max-w-6xl mx-auto py-6 px-3 bg-gray-100 rounded-lg">
        <ToastContainer />
        <div className="flex items-center mb-6 justify-between">
          <p className="text-3xl font-semibold text-right text-black">اضف اعلان</p>
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
            <label htmlFor="name" className="block text-right text-gray-700 mb-2 font-medium text-xl md:text-2xl">
              الاسم<span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              placeholder="خصم ٣٠٪؜ على جميع الدورات"
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
            <label htmlFor="description" className="block text-right text-gray-700 mb-2 font-medium text-xl md:text-2xl">
              الوصف<span className="text-red-500">*</span>
            </label>
            <textarea
              id="description"
              name="description"
              placeholder="خصم على جميع الدورات حتى نهاية العام"
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
                      multiple
                      className="hidden"
                      onChange={handleImageUpload}
                    />
                  </label>
                </div>
                <p>JPG, JPEG, PNG less than 1MB</p>
              </div>
            )}
                {images.length > 0 && (
    <div className="grid md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 sm:grid-cols-3 grid-cols-2 gap-4">
      {images.map((image, index) => (
        <div
          key={index}
          className="relative w-40 h-40 rounded-lg overflow-hidden border border-gray-300"
        >
          <img
            src={URL.createObjectURL(image)} // Convert File to URL
            alt={`Uploaded ${index}`}
            className="w-full h-full object-cover"
          />
          <button
            onClick={() => handleRemoveImage(index)}
            type="button"
            className="absolute top-2 left-2 bg-white text-white rounded-md p-1 text-xs py-1 px-2"
          >
            <i
              className="fa-regular fa-trash-can fa-lg"
              style={{ color: "#e7040f" }}
            ></i>
          </button>
        </div>
      ))}
      {/* Add More Images Button */}
      <div className="relative w-40 h-40 flex items-center justify-center border border-gray-300 rounded-lg bg-gray-100 cursor-pointer">
        <input
          type="file"
          accept="image/*"
          multiple
          className="absolute inset-0 opacity-0 z-10 cursor-pointer"
          onChange={handleImageUpload}
        />
        <i className="fa-solid fa-plus text-gray-400 text-3xl z-0"></i>
      </div>
    </div>
  )}


            {imageError && <p className="text-red-500 text-sm mt-2">{imageError}</p>}
          </div>

          <div className="flex justify-end mt-6">
            <button
              type="submit"
              disabled={!formik.isValid || images.length === 0}
              className={`py-3 px-12 rounded-lg transition-all ${
                !formik.isValid || images.length === 0
                  ? "bg-gray-400 text-white cursor-not-allowed"
                  : "bg-[#195E8B] text-white hover:bg-[#134969] cursor-pointer"
              }`}
            >
              أضف الاعلان
            </button>
          </div>
        </form>
      </div>
    );
  }



// import React, { useState } from "react";
// import { useFormik } from "formik";
// import * as Yup from "yup";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// export default function AddAdvertise() {
//   const [images, setImages] = useState([]);
//   const [dragActive, setDragActive] = useState(false);
//   const [notifications, setNotifications] = useState(3);
//   const [imageError, setImageError] = useState("");

//   // Formik configuration
//   const formik = useFormik({
//     initialValues: {
//       name: "",
//       description: "",
//     },
//     validationSchema: Yup.object({
//       name: Yup.string().required("الاسم مطلوب"),
//       description: Yup.string().required("الوصف مطلوب"),
//     }),
//     onSubmit: (values) => {
//       if (images.length === 0) {
//         setImageError("يرجى تحميل صورة واحدة على الأقل ");
//         return;
//       }
//       setImageError("");
//       console.log("Form values:", values);
//       console.log("Uploaded images:", images);
//       // Submit logic here

//        // Show success toast
//        toast.success("تم اضافة الاعلان", {
//         position: "top-left",
//         autoClose: 3000,
//         hideProgressBar: true,
//         closeOnClick: true,
//         pauseOnHover: true,
//         draggable: true,
//         progress: undefined,
//         rtl: true,
//         style: { backgroundColor: "#EFFFEF", color: "Black" },
//       });
//     },
//   });

//   const handleImageUpload = (event) => {
//     const files = Array.from(event.target.files);
//     const validFiles = files.filter(
//       (file) =>
//         file.size <= 1024 * 1024 && /image\/(jpeg|png|jpg)/.test(file.type)
//     );
  
//     if (validFiles.length < files.length) {
//       setImageError("بعض الصور غير صالحة. يرجى تحميل صور بصيغة JPG أو PNG بحجم أقل من 1MB.");
//     } else {
//       setImageError("");
//     }
  
//     const newImages = validFiles.map((file) => URL.createObjectURL(file));
//     setImages((prevImages) => [...prevImages, ...newImages]);
  
//     // Reset file input value to allow consecutive uploads of the same file
//     event.target.value = "";
//   };
  

//   const handleRemoveImage = (index) => {
//     setImages((prevImages) => prevImages.filter((_, i) => i !== index));
//   };

//   const handleDragEnter = (e) => {
//     e.preventDefault();
//     e.stopPropagation();
//     setDragActive(true);
//   };

//   const handleDragLeave = (e) => {
//     e.preventDefault();
//     e.stopPropagation();
//     setDragActive(false);
//   };

//   const handleDrop = (e) => {
//     e.preventDefault();
//     e.stopPropagation();
//     setDragActive(false);
//     if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
//       handleImageUpload({ target: { files: e.dataTransfer.files } });
//     }
//   };

//   return (
//     <div className="max-w-6xl mx-auto py-6 px-3 bg-gray-100 rounded-lg">
//       {/* Toast Container */}
//       <ToastContainer />
      
      // <div className="flex items-center mb-6 justify-between">
      //   <p className="text-3xl font-semibold text-right text-black">اضف اعلان</p>
      //   <div className="flex items-center">
      //     <div className="w-[1.4px] h-12 bg-gray-300 ml-5"></div>
      //     <div className="relative flex justify-center items-center rounded-lg shadow-4 w-12 h-12 mr-4 bg-white">
      //       <i className="fa-regular fa-bell fa-lg"></i>
      //       {notifications > 0 && (
      //         <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
      //           {notifications}
      //         </span>
      //       )}
      //     </div>
      //   </div>
      // </div>
      // <div className="w-full h-[2px] bg-gray-200 mb-8"></div>

      // <form onSubmit={formik.handleSubmit}>
      //   <div>
      //     <label htmlFor="name" className="block text-right text-gray-700 mb-2 font-medium text-xl md:text-2xl">
      //       الاسم<span className="text-red-500">*</span>
      //     </label>
      //     <input
      //       type="text"
      //       id="name"
      //       name="name"
      //       placeholder="خصم ٣٠٪؜ على جميع الدورات"
      //       className="w-full p-3 border border-gray-300 rounded-lg"
      //       value={formik.values.name}
      //       onChange={formik.handleChange}
      //       onBlur={formik.handleBlur}
      //     />
      //     {formik.touched.name && formik.errors.name && (
      //       <p className="text-red-500 text-sm">{formik.errors.name}</p>
      //     )}
      //   </div>

      //   <div className="mt-5">
      //     <label htmlFor="description" className="block text-right text-gray-700 mb-2 font-medium text-xl md:text-2xl">
      //       الوصف<span className="text-red-500">*</span>
      //     </label>
      //     <textarea
      //       id="description"
      //       name="description"
      //       placeholder="خصم على جميع الدورات حتى نهاية العام"
      //       className="w-full p-3 border border-gray-300 rounded-lg"
      //       rows={4}
      //       value={formik.values.description}
      //       onChange={formik.handleChange}
      //       onBlur={formik.handleBlur}
      //     />
      //     {formik.touched.description && formik.errors.description && (
      //       <p className="text-red-500 text-sm">{formik.errors.description}</p>
      //     )}
      //   </div>

      //   <div
      //     className={`mt-6 border-4 p-6 rounded-xl bg-white ${
      //       dragActive ? "border-blue-500" : "border-gray-200 border-dashed"
      //     }`}
      //     onDragEnter={handleDragEnter}
      //     onDragLeave={handleDragLeave}
      //     onDragOver={(e) => e.preventDefault()}
      //     onDrop={handleDrop}
      //   >
      //     {images.length === 0 && (
      //       <div className="flex flex-col items-center py-5">
      //         <i className="fa-regular fa-image text-gray-400 text-3xl mb-4"></i>
      //         <div className="flex">
      //           <p className="text-black">or drag and drop </p>
      //           <label className="text-blue-500 cursor-pointer hover:underline ml-2 mr-2">
      //             Click to upload
      //             <input
      //               type="file"
      //               accept="image/*"
      //               multiple
      //               className="hidden"
      //               onChange={handleImageUpload}
      //             />
      //           </label>
      //         </div>
      //         <p>JPG, JPEG, PNG less than 1MB</p>
      //       </div>
      //     )}
      //           {images.length > 0 && (
      //   <div className="grid md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 sm:grid-cols-3 grid-cols-2  gap-4">
      //     {images.map((image, index) => (
      //       <div
      //         key={index}
      //         className="relative w-40 h-40 rounded-lg overflow-hidden border border-gray-300"
      //       >
      //         <img
      //           src={image}
      //           alt={`Uploaded ${index}`}
      //           className="w-full h-full object-cover"
      //         />
      //         <button
      //           onClick={() => handleRemoveImage(index)}
      //           type="button"
      //           className="absolute top-2 left-2 bg-white text-white rounded-md p-1 text-xs py-1 px-2"
      //         >
      //           <i
      //             className="fa-regular fa-trash-can fa-lg"
      //             style={{ color: "#e7040f" }}
      //           ></i>
      //         </button>
      //       </div>
      //     ))}
      //     {/* Add More Images Button */}
      //     <div className=" relative w-40 h-40 flex items-center justify-center border border-gray-300 rounded-lg bg-gray-100 cursor-pointer">
      //       <input
      //         type="file"
      //         accept="image/*"
      //         multiple
      //         className="absolute inset-0 opacity-0 z-10 cursor-pointer"
      //         onChange={handleImageUpload}
      //       />
      //       <i className="fa-solid fa-plus text-gray-400 text-3xl z-0"></i>
      //     </div>
      //   </div>
      // )}

      //     {imageError && <p className="text-red-500 text-sm mt-2">{imageError}</p>}
      //   </div>

      //   <div className="flex justify-end mt-6">
      //     <button
      //       type="submit"
      //       disabled={!formik.isValid || images.length === 0}
      //       className={`py-3 px-12 rounded-lg transition-all ${
      //         !formik.isValid || images.length === 0
      //           ? "bg-gray-400 text-white cursor-not-allowed"
      //           : "bg-[#195E8B] text-white hover:bg-[#134969] cursor-pointer"
      //       }`}
      //     >
      //       أضف الاعلان
      //     </button>
      //   </div>
      // </form>
//     </div>
//   );
// }
