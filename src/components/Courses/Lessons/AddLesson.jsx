import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { Upload } from "tus-js-client";

export default function AddLesson() {
  const { categoryId, courseId, sectionId } = useParams();
  const navigate = useNavigate();

  const [file, setFile] = useState(null);
  const [fileError, setFileError] = useState("");
  const [uploadType, setUploadType] = useState("pdf");
  const [loading, setLoading] = useState(false);

  const handleFileUpload = (event) => {
    const uploadedFile = event.target.files[0];
    const isVideo = uploadedFile?.type.startsWith("video/");

    if (uploadedFile && uploadType === "video" && isVideo && uploadedFile.size <= 50 * 1024 * 1024) {
      setFile(uploadedFile);
      setFileError("");
    } else {
      setFile(uploadedFile);
      setFileError("");
      // setFileError("يرجى تحميل ملف فيديو بحجم أقل من 50 ميجابايت");
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
    setFileError("");
  };

  const uploadVideo = async (values) => {
    try {
      if (!file) throw new Error("No file selected for upload.");
      setLoading(true);
      const token = localStorage.getItem("token");

      // First API call to get authorization data for uploading
      const authResponse = await axios.post(
        `https://mentalhealthcareapi20250307003056.azurewebsites.net/api/courses/${courseId}/sections/${sectionId}/lessons/video`,
        { title: values.title, lengthWithSeconds: 60 },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // console.log(authResponse);
      const authData = authResponse.data?.data;
      

      // Upload video to Bunny CDN
      const uploadWithTus = new Upload(file, {
        endpoint: "https://video.bunnycdn.com/tusupload",
        headers: {
          AuthorizationSignature: authData.authorizationSignature,
          AuthorizationExpire: authData.authorizationExpire,
          VideoId: authData.videoId,
          LibraryId: authData.libraryId,
        },
        chunkSize: 1000000,
        onError: (error) => {
          setLoading(false);
          console.error("Upload failed:", error);
          toast.error("فشل رفع الفيديو", {
            position: "top-left",
            autoClose: 3000,
          });
        },
        onSuccess: async () => {
          console.log("Upload successful");

          // Confirm the video after the upload is complete
          try {
            const confirmResponse = await axios.post(
              `https://mentalhealthcareapi20250307003056.azurewebsites.net/api/courses/${courseId}/sections/${sectionId}/lessons/video/confirm`,
              {
                videoId: authData.videoId,
                confirmed: true,
              },
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );
            console.log("Video confirmed successfully:", confirmResponse);

            // Success toast and redirection
            toast.success("تم إضافة الفيديو بنجاح", {
              position: "top-left",
              autoClose: 3000,
            });

            setTimeout(() => {
              navigate(`/upload/category/${categoryId}/course/${courseId}/section/${sectionId}/lesson`);
            }, 3000);
          } catch (error) {
            toast.error("فشل تأكيد الفيديو", {
              position: "top-left",
              autoClose: 3000,
            });
          } finally {
            setLoading(false);
          }
        },
      });

      uploadWithTus.start();
    } catch (error) {
      setLoading(false);
      toast.error("حدث خطأ أثناء رفع الفيديو", {
        position: "top-left",
        autoClose: 3000,
      });
    }
  };


  const uploadPDF = async (values) => {
    try {
      if (!file) throw new Error("No file selected.");
      setLoading(true);
      const token = localStorage.getItem("token");
      const formData = new FormData();
    
      formData.append("PdfName", values.title);
      formData.append("LessonLengthInSeconds", 60);
      formData.append("File", file);
      formData.append("CourseId", courseId);
      formData.append("SectionId", sectionId);

      const res = await axios.post(
        `https://mentalhealthcareapi20250307003056.azurewebsites.net/api/courses/${courseId}/sections/${sectionId}/lessons/pdf`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
            Accept: "*/*",
          }
          
        }
      );
       console.log(res)
      toast.success("تم إضافة الملف بنجاح", { position: "top-left", autoClose: 3000 });
      setTimeout(() => navigate(`/upload/category/${categoryId}/course/${courseId}/section/${sectionId}/lesson`), 3000);
    } catch (error) {
      toast.error("فشل رفع الملف", { position: "top-left", autoClose: 3000 });
    } finally {
      setLoading(false);
    }
  };
  const formik = useFormik({
    initialValues: {
      title: "",
    },
    validationSchema: Yup.object({
      title: Yup.string().required("العنوان مطلوب"),
    }),
    onSubmit: (values) => {
      if (uploadType === "video") {
        uploadVideo(values);
      }
      else{
        uploadPDF(values)
      }
    },
  });

  useEffect(() => {
    formik.resetForm();
    setFile(null);
    setFileError("");
  }, [uploadType]);

  return (
    <div className="max-w-6xl mx-auto py-6 bg-gray-100 rounded-lg px-3">
      <ToastContainer />
      {loading && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 z-50 flex items-center justify-center">
          <div className="text-white text-xl">جارٍ التحميل...</div>
        </div>
      )}
      <div className="flex items-center mb-6 justify-between">
        <p className="text-3xl font-semibold text-right text-black">
          الرفع - كورسات - الدروس
        </p>
      </div>
      <div className="w-full h-[2px] bg-gray-200 mb-8"></div>

      <div className="flex justify-center gap-4 mb-6">
        <button
          type="button"
          className={`py-2 px-4 rounded-lg ${
            uploadType === "pdf" ? "bg-blue-500 text-white" : "bg-gray-300"
          }`}
          onClick={() => setUploadType("pdf")}
        >
          رفع ملف PDF
        </button>
        <button
          type="button"
          className={`py-2 px-4 rounded-lg ${
            uploadType === "video" ? "bg-blue-500 text-white" : "bg-gray-300"
          }`}
          onClick={() => setUploadType("video")}
        >
          رفع فيديو
        </button>
      </div>

      <form onSubmit={formik.handleSubmit}>
        {uploadType === "video" && (
          <div>
            <label
              htmlFor="title"
              className="block text-right text-gray-700 mb-2 font-medium text-xl md:text-2xl"
            >
              العنوان<span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="title"
              placeholder="العنوان"
              className={`w-full p-3 border rounded-lg ${
                formik.touched.title && formik.errors.title
                  ? "border-red-500"
                  : "border-gray-300"
              }`}
              {...formik.getFieldProps("title")}
            />
            {formik.touched.title && formik.errors.title && (
              <p className="text-red-500 text-sm mt-1">{formik.errors.title}</p>
            )}
          </div>
        )}
        {uploadType === "pdf" && (
          <div>
            <label
              htmlFor="title"
              className="block text-right text-gray-700 mb-2 font-medium text-xl md:text-2xl"
            >
              العنوان<span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="title"
              placeholder="العنوان"
              className={`w-full p-3 border rounded-lg ${
                formik.touched.title && formik.errors.title
                  ? "border-red-500"
                  : "border-gray-300"
              }`}
              {...formik.getFieldProps("title")}
            />
            {formik.touched.title && formik.errors.title && (
              <p className="text-red-500 text-sm mt-1">{formik.errors.title}</p>
            )}
          </div>
        )}

        <div className="mt-6 border-4 p-6 rounded-xl bg-white border-gray-200 border-dashed">
          {!file && (
            <div className="flex flex-col items-center py-5">
              <i className="fa-regular fa-file text-gray-400 text-3xl mb-4"></i>
              <label className="text-blue-500 cursor-pointer hover:underline">
                انقر لتحميل الملف
                <input
                  type="file"
                  accept={uploadType === "pdf" ? "application/pdf" : "video/*"}
                  className="hidden"
                  onChange={handleFileUpload}
                />
              </label>
            </div>
          )}

          {file && (
            <div className="relative w-full p-4 border rounded-lg bg-gray-100">
              <p className="text-gray-700">{file.name}</p>
              <button
                onClick={handleRemoveFile}
                type="button"
                className="absolute top-2 left-2 bg-red-500 text-white rounded-md p-1 text-xs"
              >
                إزالة
              </button>
            </div>
          )}
          {fileError && <p className="text-red-500 text-sm mt-2">{fileError}</p>}
        </div>

        <div className="flex justify-end mt-5">
          <button
            type="submit"
            disabled={!formik.isValid || !file}
            className={`py-3 px-12 rounded-lg transition-all ${
              !formik.isValid || !file
                ? "bg-gray-400 text-white cursor-not-allowed"
                : "bg-[#195E8B] text-white hover:bg-[#134969] cursor-pointer"
            }`}
          >
            {uploadType === "pdf" ? "إضافة ملف PDF" : "إضافة فيديو"}
          </button>
        </div>
      </form>
    </div>
  );
}
