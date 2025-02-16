import React, { useState, useEffect } from "react";
import axios from "axios";
import { NavLink } from "react-router-dom";

export default function InfoPage() {
  const [notifications, setNotifications] = useState(1);
  const [selectedPageType, setSelectedPageType] = useState(3);
  const [choosen, setChoosen] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    fetchData();
  }, [selectedPageType]);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `https://generalcommittee-dev.azurewebsites.net/api/helpcenter`,
        {
          params: { itemType: selectedPageType },
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setChoosen(response.data || []);
    } catch (err) {
      setError("حدث خطأ أثناء تحميل البيانات.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const confirmDelete = (id) => {
    
    setDeleteId(id);
    
    setShowModal(true);
  };

  const handleDelete = async (helpCenterId) => {
    setLoading(true);  // Start loading when delete is initiated
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`https://generalcommittee-dev.azurewebsites.net/api/helpcenter`, {
        headers: { Authorization: `Bearer ${token}` },
        data: { helpCenterId },
      });
  
      // Remove deleted item from state
      setChoosen((prev) => prev.filter((item) => item.id !== helpCenterId));
      fetchData();
      setShowModal(false);
    } catch (err) {
      console.error("Error deleting item:", err);
      alert("حدث خطأ أثناء الحذف.");
    } finally {
      setLoading(false);  
    }
  };
  

  return (
    <div className="p-6 text-right rtl bg-gray-100 min-h-screen px-3">
      {/* Title and Notifications */}
      <div className="flex items-center mb-6 justify-between">
        <p className="text-3xl font-semibold text-right text-black">مركز المساعدة</p>
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

      {/* Page Selector */}
      <div className="mb-6">
        <select
          value={selectedPageType}
          onChange={(e) => setSelectedPageType(Number(e.target.value))}
          className="p-2 border rounded-md shadow-sm focus:outline-none focus:ring focus:ring-cyan-500"
        >
          <option value={1}>الشروط والأحكام</option>
          <option value={2}>سياسة الخصوصية</option>
          <option value={3}>الأسئلة الشائعة</option>
        </select>
      </div>

      {/* Display Resources */}
      {loading ? (
        <p className="text-center text-gray-500">جاري التحميل...</p>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : choosen.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {choosen.map((choose) => (
            <div key={choose.helpCenterItemId} className="bg-white shadow-md rounded-lg overflow-hidden border relative p-4">
              <h2 className="font-semibold text-lg text-gray-800 mb-2 text-center">
                {choose.name}
              </h2>
              <p className="mt-6 text-lg text-gray-800 mb-10 text-center">
                {choose.description}
              </p>
              <button onClick={() => confirmDelete(choose.helpCenterItemId)} className="absolute top-3 left-3">
                <i className="fa-regular fa-trash-can fa-lg" style={{ color: '#e7040f' }}></i>
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500">لا توجد بيانات متاحة.</p>
      )}

      {/* Add Content Button */}
      <NavLink to={`/addFaq/${selectedPageType}`}>
        <div className="flex items-center justify-center bg-gray-100 border-dashed border-2 border-gray-300 rounded-lg cursor-pointer h-30 mt-6">
          <span className="text-[#195E8B] text-lg font-semibold">+ أضف محتوى</span>
        </div>
      </NavLink>
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <p className="mb-4">هل أنت متأكد أنك تريد حذف هذا المحتوى؟</p>
            <div className="flex justify-center gap-4">
            <button
              className={`px-4 py-2 rounded ${loading ? "bg-gray-400" : "bg-red-500 text-white"}`}
              onClick={() => handleDelete(deleteId)}
              disabled={loading}
            >
              {loading ? "جار الحذف..." : "حذف"}
            </button>
            <button
              className="px-4 py-2 rounded bg-gray-300"
              onClick={() => setShowModal(false)}
              disabled={loading}
            >
              إلغاء
            </button>

            </div>
          </div>
        </div>
      )}
    </div>
  );
}
