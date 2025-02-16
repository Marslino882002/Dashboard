import React, { useEffect, useState } from "react";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import axios from "axios";

export default function Lesson() {
  const { categoryId, courseId, sectionId } = useParams(); // Retrieve route params
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchLessons();
  }, [courseId, sectionId]); // Fetch data when courseId or sectionId changes

  const fetchLessons = async () => {
    setLoading(true);
    setError(null);

    const token = localStorage.getItem("token"); // Retrieve token from localStorage (or wherever you store it)
    
    try {
      const response = await axios.get(
        `https://generalcommittee-dev.azurewebsites.net/api/courses/${courseId}/sections/${sectionId}/lessons`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setLessons(Array.isArray(response.data?.data) ? response.data.data : []); // Store the API response
    } catch (err) {
      setError("Failed to fetch lessons. Please try again.");
      console.error("Error fetching lessons:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleLessonClick = (lessonId) => {
    navigate(`/upload/category/${categoryId}/course/${courseId}/section/${sectionId}/lesson/${lessonId}/resource`);
  };

  return (
    <div className="p-6 text-right rtl bg-gray-100 min-h-screen px-3">
      <p className="text-3xl font-semibold text-right text-black"> الرفع - كورسات - الدروس</p>

      <div className="w-full h-[2px] bg-gray-200 mb-8"></div>

      {loading ? (
        <p className="text-center text-blue-600">جارِ تحميل البيانات...</p>
      ) : error ? (
        <p className="text-center text-red-600">{error}</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {lessons.map((lesson) => (
            <div key={lesson.courseLessonId} className="bg-white shadow-md rounded-lg overflow-hidden border relative">
              <div className="p-4 relative">
                <h2 className="font-semibold text-lg text-gray-800 mb-2 text-center border border-cyan-800">
                  {lesson.lessonName}
                </h2>

                <p className="cursor-pointer text-center text-blue-800 mt-10" onClick={() => handleLessonClick(lesson.courseLessonId)}>
                  المزيد من الموارد
                </p>
              </div>
            </div>
          ))}
          <NavLink to={`/upload/category/${categoryId}/course/${courseId}/section/${sectionId}/addlesson`}>
            <div className="flex items-center justify-center bg-gray-100 border-dashed border-2 border-gray-300 rounded-lg cursor-pointer h-30">
              <span className="text-[#195E8B] text-lg font-semibold">+ أضف درس</span>
            </div>
          </NavLink>
        </div>
      )}
    </div>
  );
}
