import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Users() {
  const [notifications, setNotifications] = useState(1);

  // Example user data
  const users = [
    {
      id: 1,
      name: "مينا عادل",
      email: "Mina.Adel@gmail.com",
      phone: "+20 128 475 9978",
      image: "https://via.placeholder.com/80",
    },
    {
      id: 2,
      name: "ماثيو موريس",
      email: "Mathew.Maurice@gmail.com",
      phone: "+20 128 628 7234",
      image: "https://via.placeholder.com/80",
    },
    {
      id: 3,
      name: "بشوي جميل",
      email: "Bishoy.Gameel@gmail.com",
      phone: "+20 128 628 7234",
      image: "https://via.placeholder.com/80",
    },
    {
      id: 4,
      name: "أرسينيوس أمجد",
      email: "Arsainious.Amgad@gmail.com",
      phone: "+20 128 475 9978",
      image: "https://via.placeholder.com/80",
    },
    {
      id: 5,
      name: "مينا ماهر",
      email: "Mina.Maher@gmail.com",
      phone: "+20 128 628 7234",
      image: "https://via.placeholder.com/80",
    },
    {
      id: 6,
      name: "أندرو فيليب",
      email: "Andrew.Philip@gmail.com",
      phone: "+20 128 628 7234",
      image: "https://via.placeholder.com/80",
    },
  ];

  const navigate = useNavigate();

  const handleUserClick = (id) => {
    console.log(id)
    navigate(`/userDetails/${id}`); // Navigate to the user details page
  };

  return (
    <div className="max-w-6xl mx-auto py-6 bg-gray-100 rounded-lg px-3">
      {/* Title with Notification Section */}
      <div className="flex items-center mb-6 justify-between">
        <p className="text-3xl font-semibold text-right text-black">المستخدمين</p>
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

      {/* Search and Filter Section */}
      <div className="flex gap-2 mb-10">
        <input
          type="text"
          placeholder="ابحث"
          className="w-[50%] px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button className="px-6 py-2 bg-[#195E8B] text-white rounded-md hover:bg-[#134969]">
          تصفية
        </button>
      </div>

      {/* User Grid */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {users.map((user) => (
          <div
            key={user.id}
            className="bg-white shadow-md rounded-lg p-4 text-center cursor-pointer hover:shadow-lg transition-shadow duration-200"
            onClick={() => handleUserClick(user.id)} // Using navigate on click
          >
            <img
              src={user.image}
              alt={user.name}
              className="w-20 h-20 mx-auto rounded-full mb-4"
            />
            <h3 className="text-lg font-semibold text-gray-800">{user.name}</h3>
            <p className="text-gray-500">{user.email}</p>
            <p className="text-gray-500">
              {`${user.phone.slice(3).split(" ").reverse().join(" ")  + user.phone.slice(1,3).split('').join('') + user.phone.slice(0,1).split('').join('')}`}
            </p>
          </div>
        ))}
      </section>
    </div>
  );
}
