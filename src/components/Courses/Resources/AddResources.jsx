import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate, useParams } from "react-router-dom";

const FILE_TYPES = {
  video: 0,
  image: 1,
  audio: 2,
  pdf: 3,
  text: 4,
  zip: 5,
};

const getFileType = (file) => {
  if (!file) return null;
  const { type, name } = file;
  if (type.startsWith("video")) return FILE_TYPES.video;
  if (type.startsWith("image")) return FILE_TYPES.image;
  if (type.startsWith("audio")) return FILE_TYPES.audio;
  if (type === "application/pdf") return FILE_TYPES.pdf;
  if (type.startsWith("text")) return FILE_TYPES.text;
  if (name.endsWith(".zip")) return FILE_TYPES.zip;
  return null;
};

export default function AddResources() {
  const { courseId, sectionId, lessonId } = useParams();
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [fileError, setFileError] = useState("");
  const [isUploading, setIsUploading] = useState(false); // Uploading state

  const handleFileUpload = (event) => {
    const uploadedFile = event.target.files[0];
    if (!uploadedFile) return;

    const fileType = getFileType(uploadedFile);
    if (fileType !== null && uploadedFile.size <= 50 * 1024 * 1024) {
      setFile(uploadedFile);
      setFileError("");
    } else {
      setFileError("يرجى تحميل ملف بحجم أقل من 50 ميجابايت");
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
    setFileError("");
  };

  const formik = useFormik({
    initialValues: {
      description: "",
      fileName: "",
    },
    validationSchema: Yup.object({
      description: Yup.string().required("الوصف مطلوب"),
      fileName: Yup.string().required("اسم الملف مطلوب"),
    }),
    onSubmit: async (values) => {
      if (!file) {
        setFileError("يرجى تحميل ملف");
        return;
      }

      const fileType = getFileType(file);
      if (fileType === null) {
        setFileError("نوع الملف غير مدعوم");
        return;
      }

      const formData = new FormData();
      formData.append("CourseId", courseId);
      formData.append("SectionId", sectionId);
      formData.append("LessonId", lessonId);
      formData.append("File", file);
      formData.append("FileName", values.fileName);
      formData.append("ContentType", fileType);

      setIsUploading(true); // Start uploading

      const token = localStorage.getItem("token");
      try {
        const res = await axios.post(
          `https://mentalhealthcareapi20250307003056.azurewebsites.net/api/courses/${courseId}/sections/${sectionId}/lessons/${lessonId}/Resources`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        toast.success("تم إضافة المحتوى بنجاح");
        setTimeout(() => {
          navigate(-1);
        }, 3000);
      } catch (error) {
        toast.error("حدث خطأ أثناء رفع الملف");
      } finally {
        setIsUploading(false); // Stop uploading
      }
    },
  });

  return (
    <div className=" max-w-6xl mx-auto py-6 bg-gray-100 rounded-lg px-3">
      {/* Loading Overlay */}
      {isUploading && (
        <div className="absolute top-0 bottom-0 left-0 right-0 inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <span className="text-white text-3xl font-semibold">جاري الرفع...</span>
        </div>
      )}
      
      <ToastContainer />
      <h2 className="text-3xl font-semibold text-right text-black mb-6">رفع ملف جديد</h2>
      <div className="w-full h-[2px] bg-gray-200 mb-8"></div>
      
      <form onSubmit={formik.handleSubmit} className="space-y-4">
        <div>
          <input
            type="text"
            placeholder="اسم الملف"
            {...formik.getFieldProps("fileName")}
            className="w-full p-2 border border-gray-300 rounded-md"
          />
          {formik.errors.fileName && <p className="text-red-500 text-sm">{formik.errors.fileName}</p>}
        </div>
        
        <div>
          <textarea
            placeholder="الوصف"
            {...formik.getFieldProps("description")}
            className="w-full p-2 border border-gray-300 rounded-md"
          />
          {formik.errors.description && <p className="text-red-500 text-sm">{formik.errors.description}</p>}
        </div>
        
        <div>
          <input 
            type="file" 
            onChange={handleFileUpload} 
            className="w-full p-2 border border-gray-300 rounded-md" 
          />
          {file && <p className="text-gray-700">{file.name}</p>}
          {fileError && <p className="text-red-500 text-sm">{fileError}</p>}
        </div>
        
        <div className="flex justify-end">
          <button
            type="submit"
            className="w-1/6 py-3 px-12 rounded-lg bg-[#195E8B] text-white hover:bg-[#134969] cursor-pointer"
            disabled={!file || formik.isSubmitting || isUploading} // Disabled during upload
          >
            {isUploading ? "جاري الرفع..." : "إضافة"}
          </button>
        </div>
      </form>
    </div>
  );
}
