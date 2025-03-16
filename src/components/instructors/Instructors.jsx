import React, { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Link } from 'react-router-dom';
import axios from 'axios';

export default function Instructors() {
  const [notifications, setNotifications] = useState(2);
  const [showModal, setShowModal] = useState(false);
  const [selectedInstructorIndex, setSelectedInstructorIndex] = useState(null);
  const [instructors, setInstructors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Pagination and search states
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [itemsPerPage] = useState(10); // Number of items per page
  const [searchText, setSearchText] = useState('');

  const token = localStorage.getItem('token');

  // Fetch instructors from the API with pagination and search
  const fetchInstructors = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        'https://mentalhealthcareapi20250307003056.azurewebsites.net/Instructor',
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            PageNumber: currentPage,
            PageSize: itemsPerPage, // Added PageSize for better control of the results
            SearchText: searchText,  // Implementing search functionality
          },
        }
      );

      const totalItems = response.data.totalItems || 0; // Ensure totalItems is valid
      const totalPagesFromApi = response.data.totalPages || 1; // Use totalPages from the API response
      setInstructors(response.data.items || []);
      setTotalPages(totalPagesFromApi); // Set totalPages to the value from the API
    } catch (err) {
      setError('فشل في تحميل بيانات المحاضرين. يرجى المحاولة مرة أخرى.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInstructors();
  }, [currentPage, searchText]);  // Depend on `searchText` and `currentPage`

  const formik = useFormik({
    initialValues: {
      name: '',
      about: '',
      image: null,
    },
    validationSchema: Yup.object({
      name: Yup.string().required('اسم المحاضر مطلوب'),
      about: Yup.string().required('درجة المحاضر مطلوبة'),
      image: Yup.mixed().nullable().required('صورة المحاضر مطلوبة'),
    }),
    onSubmit: async (values, { resetForm }) => {
      const formData = new FormData();
      formData.append('Name', values.name);
      formData.append('About', values.about);
      formData.append('File', values.image);

      try {
        setLoading(true);
        await axios.post(
          'https://mentalhealthcareapi20250307003056.azurewebsites.net/Instructor',
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'multipart/form-data',
            },
          }
        );
        await fetchInstructors(); // Refetch after adding
        resetForm();
        formik.setFieldValue('image', null);
      } catch (err) {
        alert('فشل في إضافة المحاضر. يرجى المحاولة مرة أخرى.');
      } finally {
        setLoading(false);
      }
    },
  });

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    formik.setFieldValue('image', file);
  };

  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const handleSearchChange = (e) => {
    setSearchText(e.target.value);
    setCurrentPage(1); // Reset to page 1 when search changes
  };

  const handleRemoveInstructor = async (instructorId) => {
    setSelectedInstructorIndex(instructorId);
    setShowModal(true);
  };

  const confirmDelete = async () => {
    try {
      setLoading(true);
      await axios.delete(
        `https://mentalhealthcareapi20250307003056.azurewebsites.net/Instructor/${selectedInstructorIndex}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      fetchInstructors();
      setShowModal(false); // Close the modal after deletion
    } catch (err) {
      setError('فشل في حذف المحاضر. يرجى المحاولة مرة أخرى.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-6 bg-gray-100 rounded-lg px-3">
      <div className="flex items-center mb-6 justify-between">
        <p className="text-3xl font-semibold text-right text-black">
          المحاضرين
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

      {/* Search Input */}
      <div className="mb-6">
        <input
          type="text"
          value={searchText}
          onChange={handleSearchChange}
          placeholder="بحث عن محاضر"
          className="border rounded-lg p-3 w-full text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Form to Add New Instructor */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h3 className="text-xl font-semibold mb-4 text-right text-gray-700">
          إضافة محاضر جديد
        </h3>
        <form onSubmit={formik.handleSubmit}>
          <div className="grid grid-cols-1 sm:grid-cols-1 gap-4">
            <div>
              <input
                type="text"
                name="name"
                placeholder="اسم المحاضر"
                value={formik.values.name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="border rounded-lg p-3 w-full text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {formik.touched.name && formik.errors.name && (
                <p className="text-red-500 text-sm mt-1">
                  {formik.errors.name}
                </p>
              )}
            </div>
            <div>
              <input
                type="text"
                name="about"
                placeholder="معلومات عن المحاضر"
                value={formik.values.about}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="border rounded-lg p-3 w-full text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {formik.touched.about && formik.errors.about && (
                <p className="text-red-500 text-sm mt-1">
                  {formik.errors.about}
                </p>
              )}
            </div>
            <div>
              <input
                type="file"
                name="image"
                onChange={handleImageUpload}
                className="border rounded-lg p-3 w-full text-base focus:outline-none"
              />
              {formik.touched.image && formik.errors.image && (
                <p className="text-red-500 text-sm mt-1">
                  {formik.errors.image}
                </p>
              )}
            </div>
          </div>
          <div className="text-right mt-4">
            <button
              type="submit"
              disabled={!formik.isValid || !formik.values.image || loading}
              className={`bg-[#195E8B] text-white px-6 py-3 rounded-lg shadow-md transition-all ${
                !formik.isValid || !formik.values.image || loading
                  ? 'bg-gray-400 text-white cursor-not-allowed'
                  : 'hover:bg-[#134969] focus:ring-2 focus:ring-blue-500'
              }`}
            >
              {loading ? 'جارٍ الإضافة...' : 'إضافة محاضر'}
            </button>
          </div>
        </form>
      </div>

      {/* Instructors Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {loading ? (
          <div className="col-span-full text-center py-6 text-lg text-gray-700">
            جاري تحميل بيانات المحاضرين...
          </div>
        ) : instructors.length > 0 ? (
          instructors.map((instructor) => (
            <div key={instructor.instructorId} className="relative">
              <div
                // to={`/instructor-details/${instructor.instructorId}`}
                className="block p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-all"
              >
                <img
                  src={instructor.imageUrl || '/default-avatar.png'}
                  alt="Instructor"
                  className="w-full h-48 object-cover rounded-md"
                />
                <div className="mt-4 text-center">
                  <p className="text-lg font-semibold text-gray-800">
                    {instructor.name}
                  </p>
                </div>
              </div>
              <div
                className="absolute top-2 left-2  text-white p-2 rounded-full cursor-pointer"
                onClick={() => handleRemoveInstructor(instructor.instructorId)}
              >
                 <i className="fa-regular fa-trash-can fa-lg" style={{ color: '#e7040f' }}></i>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-6 text-lg text-gray-700">
            لا يوجد محاضرون حالياً.
          </div>
        )}
      </div>

      {/* Pagination */}
      <div className="mt-8 flex justify-center">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage <= 1 || loading}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg mr-2 disabled:opacity-50"
        >
          الصفحة السابقة
        </button>
        <span className="px-4 py-2 text-lg text-gray-700">
          صفحة {currentPage} من {totalPages}
        </span>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage >= totalPages || loading}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg ml-2 disabled:opacity-50"
        >
          الصفحة التالية
        </button>
      </div>

      {/* Modal for confirmation */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-md max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4">
              هل أنت متأكد من حذف المحاضر؟
            </h3>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowModal(false)}
                className="px-6 py-3 bg-gray-500 text-white rounded-lg"
              >
                إلغاء
              </button>
              <button
                onClick={confirmDelete}
                className="px-6 py-3 bg-red-500 text-white rounded-lg"
              >
                تأكيد الحذف
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Error Handling */}
      {error && (
        <div className="mt-6 text-center text-red-600">
          <p>{error}</p>
        </div>
      )}
    </div>
  );
}
