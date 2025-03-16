import React, { useState, useEffect } from "react";
import { NavLink, useParams } from "react-router-dom";
import axios from "axios";

export default function Resources() {
  const { categoryId, courseId, sectionId, lessonId } = useParams();
  const [notifications, setNotifications] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [selectedResourceIndex, setSelectedResourceIndex] = useState(null);
  const [resources, setResources] = useState([]);

  useEffect(() => {
    const fetchResources = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `https://mentalhealthcareapi20250307003056.azurewebsites.net/api/courses/${courseId}/sections/${sectionId}/lessons/${lessonId}/Resources`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        
        const fetchedResources = response.data?.data.map((item) => ({
          id: item.courseLessonResourceId,
          name: item.title,
          description: `ترتيب: ${item.itemOrder}`,
          categoryId: parseInt(categoryId),
          courseId: parseInt(courseId),
          sectionId: parseInt(sectionId),
          lessonId: parseInt(lessonId),
          type: getFileType(item.contentType),
          fileUrl: item.url,
        }));

        setResources(fetchedResources);
      } catch (error) {
        console.error("Error fetching resources:", error);
      }
    };

    fetchResources();
  }, [categoryId, courseId, sectionId, lessonId]);

  // Function to determine file type
  const getFileType = (contentType) => {
    switch (contentType) {
      case 0:
        return "video"; // MP4
      case 1:
        return "image"; // JPEG, PNG
      case 2:
        return "image"; // JPEG, PNG
      case 3:
        return "pdf"; // PDF
      case 4:
        return "audio"; // MP3
      case 5:
        return "text"; // TXT
      case 6:
        return "zip"; // ZIP
      default:
        return "unknown";
    }
  };
  

  const handleRemoveResource = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(
        `https://mentalhealthcareapi20250307003056.azurewebsites.net/api/courses/${courseId}/sections/${sectionId}/lessons/${lessonId}/Resources/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          data: {
            CourseId: parseInt(courseId),
            SectionId: parseInt(sectionId),
            LessonId: parseInt(lessonId),
            ResourceId: id,
          },
        }
      );
  
      // Remove the resource from state after successful deletion
      setResources((prevResources) =>
        prevResources.filter((resource) => resource.id !== id)
      );
      setShowModal(false);
    } catch (error) {
      console.error("Error deleting resource:", error);
    }
  };
  

  return (
    <div className="p-6 text-right rtl bg-gray-100 min-h-screen px-3">
      <div className="flex items-center mb-6 justify-between">
        <p className="text-3xl font-semibold text-right text-black">
          الرفع - كورسات - الموارد
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {resources.map((resource) => (
          <div
            key={resource.id}
            className="bg-white shadow-md rounded-lg overflow-hidden border relative"
          >
            <div className="p-4">
              <h2 className="font-semibold text-lg text-gray-800 mb-2 text-center border border-cyan-800">
                {resource.name}
              </h2>

              <p className="mt-6 text-lg text-gray-800 mb-10 text-center">
                {resource.description}
              </p>

              {/* Display different file types */}
              {resource.type === "video" && (
                <video controls className="w-full h-40 mt-4">
                  <source src={resource.fileUrl} type="video/mp4" />
                  فيديو غير مدعوم
                </video>
              )}

              {resource.type === "image" && (
                <img
                  src={resource.fileUrl}
                  alt={resource.name}
                  className="w-full h-40 object-cover mt-4"
                />
              )}

              {resource.type === "audio" && (
                <audio controls className="w-full mt-4">
                  <source src={resource.fileUrl} type="audio/mpeg" />
                  صوت غير مدعوم
                </audio>
              )}

              {resource.type === "pdf" && (
                <a
                  href={resource.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline text-sm text-center flex justify-center"
                >
                  عرض ملف PDF
                </a>
              )}

              {resource.type === "text" && (
                <a
                  href={resource.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-green-600 hover:underline text-sm text-center flex justify-center"
                >
                  عرض الملف النصي
                </a>
              )}

              {resource.type === "zip" && (
                <a
                  href={resource.fileUrl}
                  download
                  className="text-orange-600 hover:underline text-sm text-center flex justify-center"
                >
                  تحميل الملف المضغوط
                </a>
              )}
            </div>

            <button
              onClick={(event) => {
                event.stopPropagation();
                setSelectedResourceIndex(resource.id);
                setShowModal(true);
              }}
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

        <NavLink
          to={`/upload/category/${categoryId}/course/${courseId}/section/${sectionId}/lesson/${lessonId}/addresource`}
        >
          <div className="flex items-center justify-center bg-gray-100 border-dashed border-2 border-gray-300 rounded-lg cursor-pointer h-30">
            <span className="text-[#195E8B] text-lg font-semibold">+ أضف مورد</span>
          </div>
        </NavLink>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <div className="flex flex-col items-center">
              <div className="text-red-500 mb-4">
                <i className="fa-solid fa-trash fa-2x"></i>
              </div>
              <h3 className="text-lg font-semibold mb-2 text-black">
                حذف المورد!
              </h3>
              <p className="text-gray-500 text-center mb-4">
                لا يمكن التراجع عن هذا الإجراء. هل أنت متأكد أنك تريد حذف هذا المورد؟
              </p>
              <div className="flex justify-around w-full mt-4">
                <button
                  className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                  onClick={() => {
                    if (selectedResourceIndex !== null) {
                      handleRemoveResource(selectedResourceIndex);
                    }
                  }}
                >
                  حذف
                </button>
                <button
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400"
                  onClick={() => setShowModal(false)}
                >
                  إلغاء
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
