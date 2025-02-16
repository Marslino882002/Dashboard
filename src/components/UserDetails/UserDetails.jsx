import React, { useState } from 'react';
import { useParams } from 'react-router-dom';

export default function UserDetails() {
  const [activeTab, setActiveTab] = useState('data'); // State to track active tab
  const [notifications, setNotifications] = useState(1);
  const [selectedCourseIndex, setSelectedCourseIndex] = useState(null);
  const [selectedFavoriteIndex, setselectedFavoriteIndex] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const handleRemoveCourse = (index) => {
    const updatedCourses = courses.filter((_, i) => i !== index);
    setCourses(updatedCourses);
    setShowModal(false);
  };
  const handleRemoveFavorite = (index) => {
    const updatedFavorites = favorites.filter((_, i) => i !== index);
    setfavorites(updatedFavorites);
    setShowModal(false);
  };
  // const handleRemoveCourse = async (index) => {
  //   try {
  //     const courseToDelete = courses[index];

  //     // Simulate API call
  //     await fetch(`/api/courses/${courseToDelete.id}`, {
  //       method: 'DELETE',
  //     });

  //     // Remove locally after successful API deletion
  //     const updatedCourses = courses.filter((_, i) => i !== index);
  //     setCourses(updatedCourses);
  //   } catch (error) {
  //     console.error('Failed to delete course:', error);
  //   }
  // };

  const users = [
    {
      id: 1,
      name: 'مينا عادل',
      email: 'Mina.Adel@gmail.com',
      phone: '+20 128 475 9978',
      image: 'https://via.placeholder.com/80', // Replace with actual image URLs
      status: 'نشط',
    },
    {
      id: 2,
      name: 'ماثيو موريس',
      email: 'Mathew.Maurice@gmail.com',
      phone: '+20 128 628 7234',
      image: 'https://via.placeholder.com/80',
      status: 'نشط',
    },
    {
      id: 3,
      name: 'بشوي جميل',
      email: 'Bishoy.Gameel@gmail.com',
      phone: '+20 128 628 7234',
      image: 'https://via.placeholder.com/80',
      status: 'نشط',
    },
    {
      id: 4,
      name: 'أرسينيوس أمجد',
      email: 'Arsainious.Amgad@gmail.com',
      phone: '+20 128 475 9978',
      image: 'https://via.placeholder.com/80',
      status: 'نشط',
    },
    {
      id: 5,
      name: 'مينا ماهر',
      email: 'Mina.Maher@gmail.com',
      phone: '+20 128 628 7234',
      image: 'https://via.placeholder.com/80',
      status: '',
    },
    {
      id: 6,
      name: 'أندرو فيليب',
      email: 'Andrew.Philip@gmail.com',
      phone: '+20 128 628 7234',
      image: 'https://via.placeholder.com/80',
      status: 'نشط',
    },
  ];

  const handleStatusChange = () => {
    setUser((prevUser) => ({
      ...prevUser,
      status: prevUser.status === 'نشط' ? 'غير نشط' : 'نشط',
    }));
  };

  const { id } = useParams(); // Extract the user ID from the URL
  const user = users.find((user) => user.id === parseInt(id)); // Find the user by ID

  if (!user) {
    return <p>User not found!</p>;
  }

  const [courses, setCourses] = useState([
    {
      title: 'المشاكل الزوجية وكيفية التعامل معها',
      progress: '24%',
      duration: '5 ساعات',
      daysLeft: '23 يوم',
      image: 'https://via.placeholder.com/150', // Replace with course image
    },
    {
      title: 'تربية الأطفال في بيئة زوجية سعيدة',
      progress: '43%',
      duration: '5 ساعات',
      daysLeft: '23 يوم',
      image: 'https://via.placeholder.com/150', // Replace with course image
    },
    {
      title: 'أسرار النجاح داخل تفاصيل السعادة الزوجية',
      progress: '72%',
      duration: '13 ساعات',
      daysLeft: '17 يوم',
      image: 'https://via.placeholder.com/150', // Replace with course image
    },
  ]);
  const [favorites, setfavorites] = useState([
    {
      title: 'المشاكل الزوجية وكيفية التعامل معها',
      progress: '24%',
      duration: '5 ساعات',
      daysLeft: '23 يوم',
      image: 'https://via.placeholder.com/150', // Replace with course image
    },
    {
      title: 'تربية الأطفال في بيئة زوجية سعيدة',
      progress: '43%',
      duration: '5 ساعات',
      daysLeft: '23 يوم',
      image: 'https://via.placeholder.com/150', // Replace with course image
    },
  ]);

  return (
    <div className="p-6 text-right rtl bg-gray-100 min-h-screen px-3">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 mb-6">
        {/* Title */}
        <header className="flex flex-col items-start md:items-center w-full lg:flex-row">
          <h1 className="text-2xl font-bold text-gray-800 mb-4 md:mb-0">
            ملف المستخدم
          </h1>
          <nav className="flex gap-4 lg:mr-30 bg-gray-200 rounded-lg shadow-2">
            <div className="flex">
              <button
                className={`px-12 py-2 ${
                  activeTab === 'data'
                    ? 'text-[#195E8B] font-semibold bg-[#aed9f5] rounded-lg'
                    : 'text-gray-500 hover:text-[#134969]'
                }`}
                onClick={() => setActiveTab('data')}
              >
                البيانات
              </button>
              <div className="w-[1px] h-6 bg-gray-300 self-center"></div>{' '}
              {/* Vertical line */}
              <button
                className={`px-12 py-2 ${
                  activeTab === 'courses'
                    ? 'bg-[#aed9f5] rounded-lg text-[#195E8B] font-semibold'
                    : 'text-gray-500 hover:text-[#134969]'
                }`}
                onClick={() => setActiveTab('courses')}
              >
                الدورات
              </button>
              <div className="w-[1px] h-6 bg-gray-300 self-center"></div>{' '}
              {/* Vertical line */}
              <button
                className={`px-12 py-2 ${
                  activeTab === 'favorites'
                    ? 'bg-[#aed9f5] rounded-lg text-[#195E8B] font-semibold'
                    : 'text-gray-500 hover:text-[#134969]'
                }`}
                onClick={() => setActiveTab('favorites')}
              >
                المفضلة
              </button>
            </div>
          </nav>
        </header>

        {/* Notification Section */}
        <div className="flex items-center justify-between w-full md:w-auto mt-4 md:mt-0">
          <div className="w-[1px] h-12 bg-gray-300 hidden md:block ml-5"></div>
          <div className="relative flex justify-center items-center rounded-lg shadow-4 w-12 h-12 bg-white">
            {/* Notification Icon */}
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

      {/* Content */}
      {activeTab === 'data' && (
        // User Details View
        <>
          <div className="flex justify-center lg:justify-start mb-6 lg:mr-6">
            <img
              src={user.image}
              alt="User"
              className="w-32 h-32 rounded-full border"
            />
          </div>
          <div className="flex flex-col lg:flex-row bg-white shadow-md rounded-lg p-6">
            <div className="flex-1 space-y-4">
              <div className="grid grid-cols-2 gap-4 items-center">
                <span className="text-gray-500 font-bold text-lg">
                  الاسم الأول
                </span>
                <span className="font-semibold text-gray-800">
                  {user.name.split(' ')[0]} {/* Extracts the first name */}
                </span>

                <span className="text-gray-500 font-bold text-lg">
                  الاسم الثاني
                </span>
                <span className="font-semibold text-gray-800">
                  {user.name.split(' ')[1] || ''}{' '}
                  {/* Extracts the last name, or an empty string if not available */}
                </span>

                <span className="text-gray-500 font-bold text-lg">
                  البريد الإلكتروني
                </span>
                <span className="font-semibold text-gray-800">
                  {user.email}
                </span>

                <span className="text-gray-500 font-bold text-lg">
                  الموبايل
                </span>
                <span className="font-semibold text-gray-800">
                  {user.phone.slice(3).split(' ').reverse().join(' ') +
                    user.phone.slice(1, 3).split('').join('') +
                    user.phone.slice(0, 1).split('').join('')}
                </span>

                <span className="text-gray-500 font-bold text-lg">
                  حالة العضو
                </span>
                <span className="font-semibold text-gray-800 flex items-center">
                  {user.status === 'نشط' ? (
                    <span className="flex items-center gap-2 font-bold text-lg">
                      <label className="relative inline-flex items-center cursor-pointer ml-6">
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          checked={user.status === 'نشط'}
                          onChange={handleStatusChange}
                        />
                        <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-2 rounded-full peer dark:bg-gray-700 peer-checked:bg-[#195E8B]"></div>
                        <div className="absolute left-0.5 top-0.5 w-5 h-5 bg-white border border-gray-300 rounded-full transition-transform peer-checked:translate-x-full"></div>
                      </label>
                      نشط
                    </span>
                  ) : (
                    <span className="flex items-center gap-2 font-bold text-lg">
                      <label className="relative inline-flex items-center cursor-pointer ml-6">
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          checked={user.status === 'نشط'}
                          onChange={handleStatusChange}
                        />
                        <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-2 rounded-full peer dark:bg-gray-700 peer-checked:bg-[#195E8B]"></div>
                        <div className="absolute left-0.5 top-0.5 w-5 h-5 bg-white border border-gray-300 rounded-full transition-transform peer-checked:translate-x-full"></div>
                      </label>
                      غير نشط
                    </span>
                  )}
                </span>
              </div>
            </div>
          </div>
        </>
      )}

      {activeTab === 'courses' && (
        // Courses View
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
                <p className="text-xs text-gray-600">
                  {course.progress} مكتملة
                </p>
              </div>
              <button
                onClick={() => {
                  setSelectedCourseIndex(index);
                  setShowModal(true);
                }}
                type="button"
                className="absolute top-2 left-2 bg-white text-white rounded-md p-1 text-xs py-1 px-2"
              >
                <span className="">
                  <i
                    className="fa-regular fa-trash-can fa-lg"
                    style={{ color: '#e7040f' }}
                  ></i>
                </span>
              </button>
            </div>
          ))}
          <div className="flex items-center justify-center bg-gray-100 border-dashed border-2 border-gray-300 rounded-lg cursor-pointer h-50">
            <span className="text-[#195E8B] text-lg font-semibold">
              + أضف دورة
            </span>
          </div>
        </div>
      )}
      {activeTab === 'favorites' && (
        // favorites View
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {favorites.map((favorite, index) => (
            <div
              key={index}
              className="bg-white shadow-md rounded-lg overflow-hidden border relative"
            >
              <img
                src={favorite.image}
                alt={favorite.title}
                className="w-full h-32 object-cover"
              />
              <div className="p-4">
                <h2 className="font-semibold text-lg text-gray-800 mb-2">
                  {favorite.title}
                </h2>
                <p className="text-sm text-gray-500 mb-1">
                  {favorite.duration} - {favorite.daysLeft} متبقية
                </p>
                <div className="relative w-full bg-gray-200 h-2 rounded-full mb-2">
                  <div
                    className="absolute top-0 left-0 h-2 bg-[#195E8B] rounded-full"
                    style={{ width: favorite.progress }}
                  ></div>
                </div>
                <p className="text-xs text-gray-600">
                  {favorite.progress} مكتملة
                </p>
              </div>
              <button
                onClick={() => {
                  setselectedFavoriteIndex(index);
                  setShowModal(true);
                }}
                type="button"
                className="absolute top-2 left-2 bg-white text-white rounded-md p-1 text-xs py-1 px-2"
              >
                <span className="">
                  <i
                    className="fa-regular fa-trash-can fa-lg"
                    style={{ color: '#e7040f' }}
                  ></i>
                </span>
              </button>
            </div>
          ))}
        </div>
      )}
      {/* Modal */}
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
                  onClick={() => {
                    if (activeTab === 'courses')
                      handleRemoveCourse(selectedCourseIndex);
                    if (activeTab === 'favorites')
                      handleRemoveFavorite(selectedFavoriteIndex);
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
