import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

export default function AddEpisode() {
  const [audioFiles, setAudioFiles] = useState([]);
  const [dragActive, setDragActive] = useState(false);
  const [notifications, setNotifications] = useState(3);
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      name: "",
    },
    validationSchema: Yup.object({
      name: Yup.string()
        .required("العنوان مطلوب")
        .min(3, "العنوان يجب أن يحتوي على 3 أحرف على الأقل"),
    }),
    onSubmit: (values) => {
      console.log("Form Submitted:", values);
      console.log("Uploaded Files:", audioFiles);
      
       // Show success toast
  toast.success("تم اضافة الحلقة", {
    position: "top-left",
    autoClose: 3000,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    rtl: false, // Enable right-to-left text alignment
    style: { backgroundColor: "#EFFFEF", color: "Black" },
  });

  setTimeout(() => {
    navigate("/upload/podcast"); 
  }, 3000);

    },
  });

  const handleAudioUpload = (event) => {
    const files = Array.from(event.target.files);
    const validFiles = files.filter(
      (file) =>
        file.size <= 300 * 1024 * 1024 && // Validate file size (300MB max)
        /audio\/(mpeg|wav|aac|flac|ogg)/.test(file.type) // Validate file types
    );
    const newAudioFiles = validFiles.map((file) => ({
      name: file.name,
      url: URL.createObjectURL(file),
    }));
    setAudioFiles([...audioFiles, ...newAudioFiles]);
  };

  const handleRemoveAudio = (index) => {
    const updatedAudioFiles = audioFiles.filter((_, i) => i !== index);
    setAudioFiles(updatedAudioFiles);
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
      handleAudioUpload({ target: { files: e.dataTransfer.files } });
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-6 bg-gray-100 rounded-lg px-3">

         {/* Toast Container */}
    <ToastContainer />
      {/* Title with Notification Section */}
      <div className="flex items-center mb-6 justify-between">
        <p className="text-3xl font-semibold text-right text-black">
          الرفع - بودكاست
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
            placeholder="الإدمان وطرق التعافي"
            className={`w-full p-3 border ${
              formik.touched.name && formik.errors.name
                ? "border-red-500"
                : "border-gray-300"
            } rounded-lg`}
            value={formik.values.name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.name && formik.errors.name && (
            <p className="text-red-500 text-sm mt-1">{formik.errors.name}</p>
          )}
        </div>

        {/* Audio Upload */}
        <div
          className={`mt-6 border-4 p-6 rounded-xl bg-white ${
            dragActive ? "border-blue-500" : "border-gray-200 border-dashed"
          }`}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
        >
          {/* Drag-and-Drop Instructions */}
          {audioFiles.length === 0 && (
            <div className="flex flex-col items-center py-5">
              <div>
                <i className="fa-regular fa-file-audio text-gray-400 text-3xl mb-4"></i>
              </div>
              <div>
                <div className="flex">
                  <div>
                    <p className="text-black mr-10">or drag and drop</p>
                  </div>
                  <div className="mr-2">
                    <label className="text-[#195E8B] cursor-pointer hover:underline">
                      <span>Click to upload</span>
                      <input
                        type="file"
                        multiple
                        accept="audio/*"
                        className="hidden"
                        onChange={handleAudioUpload}
                      />
                    </label>
                  </div>
                </div>
                <p>MP3, WAV, AAC, FLAC, OGG less than 300MB</p>
              </div>
            </div>
          )}

          {/* Uploaded Audio Files */}
          {audioFiles.length > 0 && (
            <div className="flex flex-wrap gap-4">
              {/* Upload Button */}
              <label className="w-36 h-36 border border-gray-300 flex items-center justify-center rounded-lg cursor-pointer bg-gray-50">
                <input
                  type="file"
                  multiple
                  accept="audio/*"
                  className="hidden"
                  onChange={handleAudioUpload}
                />
                <span className="text-gray-500 text-3xl font-bold">+</span>
              </label>

              {/* Uploaded Audio Files */}
              {audioFiles.map((audio, index) => (
                <div
                  key={index}
                  className="relative w-full max-w-xs bg-gray-50 p-4 rounded-lg border border-gray-300 flex items-center"
                >
                  <div className="flex-grow">
                    <p className="text-sm font-medium text-gray-800 truncate">
                      {audio.name}
                    </p>
                  </div>
                  <button
                    onClick={() => handleRemoveAudio(index)}
                    type="button"
                    className="ml-2 bg-white text-white rounded-md p-1"
                  >
                    <i
                      className="fa-regular fa-trash-can fa-lg"
                      style={{ color: "#e7040f" }}
                    ></i>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Submit Button */}
        {/* <NavLink to="/upload/podcast"> */}
        <div className="flex justify-end mt-25">
          <button
            type="submit"
            disabled={!formik.isValid || !audioFiles.length}
            className={`py-3 px-12 rounded-lg transition ${
              !formik.isValid || !audioFiles.length
                ? "bg-gray-400 text-white cursor-not-allowed"
                : "bg-[#195E8B] text-white hover:bg-[#134969] cursor-pointer"
            }`}
          >
            اضافة حلقة
          </button>
        </div>
        {/* </NavLink> */}
      </form>
    </div>
  );
}
