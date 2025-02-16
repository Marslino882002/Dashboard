import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

export default function InstructorDetails() {
  const { id } = useParams(); // Get ID from route
  const [instructor, setInstructor] = useState(null);
  const [courses, setCourses] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedCourseIndex, setSelectedCourseIndex] = useState(null);

  useEffect(() => {
    // Sample instructors
    const instructors = [
      {
        id: 1,
        name: 'يوسف عصام',
        about: 'بكالريوس ...',
        image: 'https://via.placeholder.com/150',
      },
      {
        id: 2,
        name: 'عزت يوسف عصام',
        about: 'بكالريوس ...',
        image: 'https://via.placeholder.com/150',
      },
      {
        id: 3,
        name: 'يوسف عصام',
        about: 'بكالريوس ...',
        image: 'https://via.placeholder.com/150',
      },
    ];

    const selectedInstructor = instructors.find(
      (instructor) => instructor.id === parseInt(id, 10)
    );
    setInstructor(selectedInstructor);

    // Sample courses
    const sampleCourses = [
      {
        title: 'دورة البرمجة',
        duration: '40 ساعة',
        daysLeft: '15 يوم',
        progress: '75%',
        image: 'https://via.placeholder.com/80',
      },
      {
        title: 'دورة التصميم',
        duration: '30 ساعة',
        daysLeft: '10 أيام',
        progress: '50%',
        image: 'https://via.placeholder.com/80',
      },
      {
        title: 'دورة الإدارة',
        duration: '25 ساعة',
        daysLeft: '5 أيام',
        progress: '30%',
        image: 'https://via.placeholder.com/80',
      },
    ];

    setCourses(sampleCourses);
  }, [id]);

  const handleShowModal = (index) => {
    setSelectedCourseIndex(index);
    setShowModal(true);
  };

  const handleRemoveCourse = (index) => {
    const updatedCourses = courses.filter((_, i) => i !== index);
    setCourses(updatedCourses);
    setShowModal(false);
  };

  if (!instructor) {
    return <p>Loading...</p>;
  }

  return (
    <div className="max-w-6xl mx-auto py-6 bg-gray-100 rounded-lg px-3">
     <div className='bg-[#134969] p-6 rounded-[80px]'>
      <div className="text-center mb-6">
        <img
          className="w-32 h-32 rounded-full mx-auto border-4 border-transparent"
          src={instructor.image}
          alt={instructor.name}
        />
      </div>
      <h3 className="text-2xl font-semibold text-black text-center mb-2">
        {instructor.name}
      </h3>
      <p className="text-lg font-semibold text-black text-center ">{instructor.about}</p>

      </div>

      {/* Courses Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
        {courses.map((course, index) => (
          <div
            key={index}
            className="bg-white shadow-md rounded-lg overflow-hidden border relative"
          >
            <img
              src={course.image}
              alt={course.title}
              className="w-full h-32 object-cover"
            />
            <div className="p-4">
              <h2 className="font-semibold text-lg text-gray-800 mb-2">
                {course.title}
              </h2>
              <p className="text-sm text-gray-500 mb-1">
                {course.duration} - {course.daysLeft} متبقية
              </p>
              <div className="relative w-full bg-gray-200 h-2 rounded-full mb-2">
                <div
                  className="absolute top-0 left-0 h-2 bg-[#195E8B] rounded-full"
                  style={{ width: course.progress }}
                ></div>
              </div>
              <p className="text-xs text-gray-600 text-right">
                {course.progress} مكتملة
              </p>
            </div>
            <button
              onClick={() => handleShowModal(index)}
              type="button"
              className="absolute top-2 left-2 bg-white rounded-md p-1"
            >
              <i
                className="fa-regular fa-trash-can fa-lg"
                style={{ color: '#e7040f' }}
              ></i>
            </button>
          </div>
        ))}
      </div>

      {/* Modal Section */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <div className="flex flex-col items-center">
              <div className="text-red-500 mb-4">
                <i className="fa-solid fa-trash fa-2x"></i>
              </div>
              <h3 className="text-lg font-semibold mb-2 text-black">
                حذف الدورة!
              </h3>
              <p className="text-gray-500 text-center mb-4">
                لا يمكن التراجع عن هذا الإجراء. هل أنت متأكد أنك تريد حذف هذا
                الكورس؟
              </p>
              <div className="flex justify-around w-full mt-4">
                <button
                  className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                  onClick={() => handleRemoveCourse(selectedCourseIndex)}
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
