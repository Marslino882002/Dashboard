import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import axios from "axios";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

const ItemType = "ADVERTISE";

const DraggableAdvertise = ({ ad, index, moveAdvertise, setSelectedIndex, setShowModal }) => {
  const [{ isDragging }, ref] = useDrag({
    type: ItemType,
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: ItemType,
    hover: (draggedItem) => {
      if (draggedItem.index !== index) {
        moveAdvertise(draggedItem.index, index);
        draggedItem.index = index;
      }
    },
  });

  const opacity = isDragging ? 0.5 : 1;

  return (
    <div
      ref={(node) => drop(ref(node))}
      className="bg-white shadow-md rounded-lg p-4 relative"
      style={{ opacity }}
    >
      <img
        src={ad.advertisementImageUrls[0] || "https://via.placeholder.com/150"}
        alt={ad.advertisementName}
        className="w-full h-32 object-cover mb-2 rounded"
      />
      <h2 className="text-lg font-semibold mb-2 text-center">{`${index + 1}. ${ad.advertisementName}`}</h2>
      <p className="text-gray-600 text-sm mb-2 text-center">{ad.advertisementDescription}</p>
      <button
        onClick={() => {
          setSelectedIndex(index);
          setShowModal(true);
        }}
        className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded"
      >
        حذف
      </button>
    </div>
  );
};

export default function Advertises() {
  const [notifications] = useState(1);
  const [advertisements, setAdvertisements] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const fetchAdvertisements = async (page) => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("Authentication token is missing!");
      return;
    }

    try {
      const response = await axios.get(
        "https://generalcommittee-dev.azurewebsites.net/Advertisement",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            IsActive: 1,
            PageNumber: page,
            PageSize: 10,
          },
        }
      );

      const { items, totalPages } = response.data;
      if (Array.isArray(items)) {
        setAdvertisements(items);
        setTotalPages(totalPages);
      } else {
        console.error("Unexpected API response structure:", response.data);
      }
    } catch (error) {
      console.error("Error fetching advertisements:", error.response || error.message || error);
    }
  };

  useEffect(() => {
    fetchAdvertisements(pageNumber);
  }, [pageNumber]);

  const moveAdvertise = (fromIndex, toIndex) => {
    const updated = Array.from(advertisements);
    const [moved] = updated.splice(fromIndex, 1);
    updated.splice(toIndex, 0, moved);
    setAdvertisements(updated);
  };

  const handleRemove = async () => {
    if (selectedIndex === null || selectedIndex < 0 || selectedIndex >= advertisements.length) {
      console.error("Invalid selected advertisement index");
      return;
    }

    const selectedAd = advertisements[selectedIndex];
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("Authentication token is missing!");
      return;
    }

    // Optimistically update the UI
    const updatedAdvertisements = advertisements.filter((_, index) => index !== selectedIndex);
    setAdvertisements(updatedAdvertisements);

    setLoading(true);
    try {
      // Make the DELETE API call
      await axios.delete(
        `https://generalcommittee-dev.azurewebsites.net/Advertisement/${selectedAd.advertisementId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Reset modal and loading state
      setSelectedIndex(null);
      setShowModal(false);
    } catch (error) {
      // Revert the optimistic UI update if API fails
      setAdvertisements(advertisements);
      console.error("Error deleting advertisement:", error.response || error.message || error);
      alert("حدث خطأ أثناء حذف الإعلان. الرجاء المحاولة لاحقًا.");
    } finally {
      setLoading(false);
    }
  };

  const handleNextPage = () => {
    if (pageNumber < totalPages) setPageNumber((prev) => prev + 1);
  };

  const handlePreviousPage = () => {
    if (pageNumber > 1) setPageNumber((prev) => prev - 1);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="p-6 text-right rtl bg-gray-100 min-h-screen px-3">
        <div className="flex items-center mb-6 justify-between">
          <h1 className="text-3xl font-semibold text-black">الاعلانات</h1>
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

        <div className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
  {advertisements.map((ad, index) => (
    <DraggableAdvertise
      key={ad.advertisementId}
      ad={ad}
      index={index}
      moveAdvertise={moveAdvertise}
      setSelectedIndex={setSelectedIndex}
      setShowModal={setShowModal}
    />
  ))}
  <NavLink to="/adAdvertise">
    <div className="flex items-center justify-center bg-gray-100 border-dashed border-2 border-gray-300 rounded-lg cursor-pointer h-40 w-full">
      <span className="text-[#195E8B] text-lg font-semibold">+ أضف اعلان</span>
    </div>
  </NavLink>
</div>


        <div className="flex justify-center mt-6">
          <button
            className="px-4 py-2 mx-2 bg-gray-300 rounded"
            disabled={pageNumber === 1}
            onClick={handlePreviousPage}
          >
            السابق
          </button>
          <span className="px-4 py-2 bg-gray-100 rounded">{`صفحة ${pageNumber} من ${totalPages}`}</span>
          <button
            className="px-4 py-2 mx-2 bg-gray-300 rounded"
            disabled={pageNumber === totalPages}
            onClick={handleNextPage}
          >
            التالي
          </button>
        </div>

        {showModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg text-center">
              <p className="mb-4">هل أنت متأكد أنك تريد حذف هذا الإعلان؟</p>
              <div className="flex justify-center gap-4">
                <button
                  className={`px-4 py-2 rounded ${loading ? "bg-gray-400" : "bg-red-500 text-white"}`}
                  onClick={handleRemove}
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
    </DndProvider>
  );
}
