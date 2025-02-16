import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

export default function Categories() {
  const [notifications, setNotifications] = useState(1);
  const [selectedCategoryIndex, setSelectedCategoryIndex] = useState(null);
  const [showModal, setShowModal] = useState(false);
  
  const [categories, setCategories] = useState([
    { id: 1, name: 'دينية', description: 'التعافي من الإدمان' },
    { id: 2, name: 'علاج الإدمان', description: 'التعافي من الإدمان التعافي من الإدمان التعافي من الإدمان' },
    { id: 3, name: 'هادفة', description: '' },
   
  ]);

  const navigate = useNavigate();

  const handleCategoryClick = (id) => {
    navigate(`/upload/category/${id}/course`);
  };

  const handleRemoveCategory = (index) => {
    const updatedCategories = categories.filter((_, i) => i !== index);
    setCategories(updatedCategories);
    setShowModal(false);
  };

  return (
    <div className="max-w-6xl mx-auto py-6 bg-gray-100 rounded-lg px-3">
      <div className="flex items-center mb-6 justify-between">
        <p className="text-3xl font-semibold text-right text-black"> الرفع - كورسات - الفئة</p>
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

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category, index) => (
          <div
            className="bg-white shadow-md rounded-lg p-4 text-center relative cursor-pointer"
            key={category.id}
            onClick={() => handleCategoryClick(category.id)}
          >
            <h3 className="text-lg font-semibold text-gray-800">{category.name}</h3>
            <p className="text-gray-600 text-xl mt-2">{category.description}</p>
            <button
              onClick={(event) => {
                event.stopPropagation();
                setSelectedCategoryIndex(index);
                setShowModal(true);
              }}
              type="button"
              className="absolute top-2 left-2 bg-white rounded-md p-1 text-xs py-1 px-2"
            >
              <i className="fa-regular fa-trash-can fa-lg" style={{ color: '#e7040f' }}></i>
            </button>
          </div>
        ))}
        <NavLink to="/upload/addCategory">
          <div className="flex items-center justify-center bg-gray-100 border-dashed border-2 border-gray-300 rounded-lg cursor-pointer h-36">
            <span className="text-[#195E8B] text-lg font-semibold">+ أضف فئة</span>
          </div>
        </NavLink>
      </section>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <div className="flex flex-col items-center">
              <div className="text-red-500 mb-4">
                <i className="fa-solid fa-trash fa-2x"></i>
              </div>
              <h3 className="text-lg font-semibold mb-2 text-black">حذف الفئة!</h3>
              <p className="text-gray-500 text-center mb-4">
                لا يمكن التراجع عن هذا الإجراء. هل أنت متأكد أنك تريد حذف هذه الفئة؟
              </p>
              <div className="flex justify-around w-full mt-4">
                <button
                  className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                  onClick={() => handleRemoveCategory(selectedCategoryIndex)}
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
