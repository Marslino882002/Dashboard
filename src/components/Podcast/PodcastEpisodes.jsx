import React, { useState } from "react";
import { NavLink, useParams } from "react-router-dom";
import wave from '../../images/wave2.png';

export default function PodcastEpisodes() {
  const [notifications, setNotifications] = useState(1);
  const [selectedPodcastIndex, setSelectedPodcastIndex] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const handleRemoveEpisode = (index) => {
    const updatedEpisodes = episodes.filter((_, i) => i !== index);
    setepisodes(updatedEpisodes); // Update the episodes array
    setShowModal(false); // Close the modal after deletion
  };

  const [podcasts, setpodcasts] = useState([
    {
      id: 1,
      name: "ارسانيوس امجد",
      podcastName: "التعافي من الادمان",
      image: "https://via.placeholder.com/80",
    },
    {
      id: 2,
      name: "يوسف عصام",
      podcastName: "الادمان",
      image: "https://via.placeholder.com/80",
    },
    {
      id: 3,
      name: "مارسلينو اشرف",
      podcastName: "التعافي ",
      image: "https://via.placeholder.com/80",
    },
  ]);

  const { id } = useParams(); // Extract the user ID from the URL
  const podcast = podcasts.find((podcast) => podcast.id === parseInt(id)); // Find the user by ID

  const [episodes, setepisodes] = useState([
    {
      title: "المشاكل الزوجية وكيفية التعامل معها",
      
    },
    {
      title: "تربية الأطفال في بيئة زوجية سعيدة",
      
    },
    {
      title: "أسرار النجاح داخل تفاصيل السعادة الزوجية",
      
    },
  ]);

  return (
    <div className="p-6 text-right rtl bg-gray-100 min-h-screen px-3">
      {/* Title with Notification Section */}
      <div className="flex items-center mb-6 justify-between">
        {/* Title */}
        <header className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">الرفع - بودكاست</h1>
        </header>
        <div className="flex items-center">
          <div className="w-[1.4px] h-12 bg-gray-300 ml-5"></div>
          <div className="relative flex justify-center items-center rounded-lg shadow-4 w-12 h-12 mr-4 bg-white">
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {episodes.map((episode, index) => (
          <div
            key={index}
            className="bg-white shadow-md rounded-lg overflow-hidden border relative"
          >
           
            <div className="p-4">
              <h2 className="font-semibold text-lg text-gray-800 mb-2 text-center">
                {episode.title}
              </h2>

              <img src={wave} alt="sound wave" className="h-45" />
            
            </div>
            <button
              onClick={() => {
                setSelectedPodcastIndex(index);
                setShowModal(true);
              }}
              type="button"
              className="absolute top-2 left-2 bg-white text-white rounded-md p-1 text-xs py-1 px-2"
            >
              <span>
                <i
                  className="fa-regular fa-trash-can fa-lg"
                  style={{ color: "#e7040f" }}
                ></i>
              </span>
            </button>
          </div>
        ))}
         <NavLink to='/upload/addEpisode'>
        <div className="flex items-center justify-center bg-gray-100 border-dashed border-2 border-gray-300 rounded-lg cursor-pointer h-50">
          <span className="text-[#195E8B] text-lg font-semibold">
            + أضف حلقة
          </span>
        </div>
        </NavLink>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <div className="flex flex-col items-center">
              <div className="text-red-500 mb-4">
                <i className="fa-solid fa-trash fa-2x"></i>
              </div>
              <h3 className="text-lg font-semibold mb-2 text-black">حذف الحلقة!</h3>
              <p className="text-gray-500 text-center mb-4">
                لا يمكن التراجع عن هذا الإجراء. هل أنت متأكد أنك تريد حذف هذا
                الحلقة؟
              </p>
              <div className="flex justify-around w-full mt-4">
                <button
                  className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                  onClick={() => {
                    handleRemoveEpisode(selectedPodcastIndex);
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
