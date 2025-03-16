import React, { useState, useEffect } from "react";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import axios from "axios";

export default function Courses() {
  const { categoryId } = useParams();
  const [notifications, setNotifications] = useState(1);
  const [courses, setCourses] = useState([]);
  const [currentPage, setCurrentPage] = useState(1); // Current page state
  const [totalPages, setTotalPages] = useState(1); // Total pages from API
  const [loading, setLoading] = useState(false); // Loading state
  const navigate = useNavigate();

  const fetchCourses = async (page) => {
    const token = localStorage.getItem("token"); // Retrieve token from localStorage
    setLoading(true); // Start loading

    try {
      const response = await axios.get(
        `https://mentalhealthcareapi20250307003056.azurewebsites.net/api/courses`,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Add token in Authorization header
          },
          params: {
            PageNumber: page, // Include page number as a query parameter
          },
        }
      );

      if (response.data.success) {
        const fetchedCourses = response.data.data.items.map((course) => ({
          id: course.courseId,
          categoryId: course.categories[0]?.categoryId || 0,
          name: course.name,
          thumbnail: course.thumbnailUrl || "https://via.placeholder.com/150",
          price: course.price,
          rating: course.rating || "N/A",
          reviewsCount: course.reviewsCount,
          enrollmentCount: course.enrollmentsCount,
        }));
        console.log(fetchedCourses)
        setCourses(fetchedCourses);
        setTotalPages(response.data.data.totalPages || 1); // Set total pages
      } else {
        console.error("Failed to fetch courses:", response.data.message);
      }
    } catch (error) {
      console.error("Error fetching courses:", error);
    } finally {
      setLoading(false); // Stop loading
    }
  };

  useEffect(() => {
    fetchCourses(currentPage); // Fetch courses whenever the page changes
  }, [currentPage]);

  const handleCourseClick = (courseId) => {
    navigate(`/upload/category/${categoryId}/course/${courseId}/section`);
  };

  return (
    <div className="p-6 text-right rtl bg-gray-100 min-h-screen px-3">
      <div className="flex items-center mb-6 justify-between">
        <header className="flex justify-between items-center">
          <p className="text-3xl font-semibold text-right text-black">
            الرفع - كورسات - الكورس
          </p>
        </header>
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

      {/* Show Loading Indicator */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <span className="text-xl font-semibold text-gray-600">جارٍ التحميل...</span>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {courses.map((course) => (
              <div
                key={course.id}
                className="bg-white shadow-md rounded-lg overflow-hidden border relative cursor-pointer"
                onClick={() => handleCourseClick(course.id)}
              >
                <img
                  src={course.thumbnail}
                  alt={course.name}
                  className="w-full h-40 object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src =
                      "https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg";
                  }}
                />
                <div className="p-4">
                  <h2 className="font-semibold text-lg text-gray-800 mb-2 text-center">
                    {course.name}
                  </h2>
                  <p className="text-gray-600 text-sm mb-2">
                    <span className="font-semibold text-base">السعر:</span>{" "}
                    {course.price} جنيه
                  </p>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      <i className="fa-solid fa-star text-yellow-500 mr-1"></i>
                      <span className="text-gray-800">{course.rating}</span>
                    </div>
                    <p className="text-gray-500 text-sm">
                      ({course.reviewsCount} تقييمات)
                    </p>
                  </div>
                  <p className="text-gray-600 text-sm">
                    <span className="font-semibold text-base">المسجلين:</span>{" "}
                    {course.enrollmentCount} شخص
                  </p>
                </div>
              </div>
            ))}
            <NavLink to={`/upload/category/${categoryId}/addcourse`}>
              <div className="flex items-center justify-center bg-gray-100 border-dashed border-2 border-gray-300 rounded-lg cursor-pointer h-80">
                <span className="text-[#195E8B] text-lg font-semibold">
                  + أضف كورس
                </span>
              </div>
            </NavLink>
          </div>

          {/* Pagination Controls */}
          <div className="flex justify-center mt-6">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="mx-2 px-4 py-2 bg-gray-300 rounded-lg disabled:opacity-50"
            >
              السابق
            </button>
            <span className="mx-4 text-lg">
              صفحة {currentPage} من {totalPages}
            </span>
            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className="mx-2 px-4 py-2 bg-gray-300 rounded-lg disabled:opacity-50"
            >
              التالي
            </button>
          </div>
        </>
      )}
    </div>
  );
}
