import React, { useState, useEffect } from 'react';
import { useNavigate, NavLink, useParams } from 'react-router-dom';
import axios from 'axios';

export default function CourseSection() {
  const navigate = useNavigate();
  const { categoryId, courseId } = useParams(); // Use categoryId and courseId from route params

  const [notifications, setNotifications] = useState(2);
  const [sections, setSections] = useState([]);  // Initially empty array
  const [loading, setLoading] = useState(true);  // To track loading state
  const [error, setError] = useState(null);  // To track API errors

  const [showModal, setShowModal] = useState(false);
  const [selectedSectionId, setSelectedSectionId] = useState(null);

  // Fetch sections from API when the component mounts
  useEffect(() => {
    const fetchSections = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `https://generalcommittee-dev.azurewebsites.net/api/courses/${courseId}/sections`,
          {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          }
        );
  
        console.log("API Response:", response.data); // Debugging
  
        // Extract the array of sections safely
        setSections(Array.isArray(response.data?.data) ? response.data.data : []);
  
        setError(null);
      } catch (err) {
        setError("Failed to load sections");
      } finally {
        setLoading(false);
      }
    };
  
    fetchSections();
  }, [courseId]);
  

  const handleRemoveSection = async (id) => {
    try {
      await axios.delete(
        `https://generalcommittee-dev.azurewebsites.net/api/courses/${courseId}/sections/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,  // Authorization header
          },
          data: {},  // Add an empty object to the body (in case the API expects it)
        }
      );
      // Remove the section from state after successful deletion
      setSections(sections.filter((section) => section.courseSectionId !== id));
      setShowModal(false);
    } catch (err) {
      // setError('Failed to delete the section');
      console.error('Error deleting section:', err);
    }
  };
  
  

  

  const handleSectionClick = (sectionId) => {
    navigate(`/upload/category/${categoryId}/course/${courseId}/section/${sectionId}/lesson`);
  };

  return (
    <div className="max-w-6xl mx-auto py-6 bg-gray-100 rounded-lg px-3">
      <div className="flex items-center mb-6 justify-between">
        <header className="flex justify-between items-center">
          <p className="text-3xl font-semibold text-right text-black"> الرفع - كورسات - القسم</p>
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

      {/* Loading State */}
      {loading && <p className="text-center text-gray-500">جاري تحميل الأقسام...</p>}

      {/* Error State */}
      {error && <p className="text-center text-red-500">{error}</p>}

      {/* Sections List */}
      {!loading && !error && (
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {sections.map((section) => (
            <div
              className="bg-white shadow-md rounded-lg p-4 text-center relative cursor-pointer"
              key={section.courseSectionId}  // Use courseSectionId as the key
              onClick={() => handleSectionClick(section.courseSectionId)}  // Use courseSectionId for navigation
            >
              <h3 className="text-lg font-semibold text-gray-800">{section.name}</h3>
              <button
                onClick={(event) => {
                  event.stopPropagation();
                  setSelectedSectionId(section.courseSectionId);  // Use courseSectionId
                  setShowModal(true);
                }}
                type="button"
                className="absolute top-2 left-2 bg-white rounded-md p-1 text-xs py-1 px-2"
              >
                <i className="fa-regular fa-trash-can fa-lg" style={{ color: '#e7040f' }}></i>
              </button>
            </div>
          ))}
          <NavLink to={`/upload/category/${categoryId}/course/${courseId}/addsection`}>
            <div className="flex items-center justify-center bg-gray-100 border-dashed border-2 border-gray-300 rounded-lg cursor-pointer h-15">
              <span className="text-[#195E8B] text-lg font-semibold">+ أضف قسم</span>
            </div>
          </NavLink>
        </section>
      )}

      {/* Modal for deleting section */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <div className="flex flex-col items-center">
              <div className="text-red-500 mb-4">
                <i className="fa-solid fa-trash fa-2x"></i>
              </div>
              <h3 className="text-lg font-semibold mb-2 text-black">حذف القسم!</h3>
              <p className="text-gray-500 text-center mb-4">
                لا يمكن التراجع عن هذا الإجراء. هل أنت متأكد أنك تريد حذف هذا القسم؟
              </p>
              <div className="flex justify-around w-full mt-4">
                <button
                  className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                  onClick={() => handleRemoveSection(selectedSectionId)}
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
