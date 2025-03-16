import { useState, useEffect } from "react";
import axios from "axios";

export default function Payments() {
  const [notifications, setNotifications] = useState(5);
  const [data, setData] = useState([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize] = useState(10);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "https://mentalhealthcareapi20250307003056.azurewebsites.net/api/orders",
          {
            params: { PageNumber: pageNumber, PageSize: pageSize },
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setData(response.data.items);
        console.log(response)
      } catch (error) {
        console.error("Error fetching data:", error);
      }

   
    };

    fetchData();
  }, [pageNumber, pageSize]);

  return (
    <div className="max-w-6xl mx-auto py-6 bg-gray-100 rounded-lg px-3">
      <div className="flex flex-col sm:flex-row items-center justify-between mb-6">
        <p className="text-2xl sm:text-3xl font-semibold text-center sm:text-right text-black">
          المدفوعات
        </p>
        <div className="flex items-center mt-4 sm:mt-0">
          <div className="hidden sm:block w-[2px] h-12 bg-gray-300 ml-5"></div>
          <div className="relative flex justify-center items-center rounded-lg shadow-4 w-12 h-12 mr-0 sm:mr-4 bg-white">
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

      <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {data.map((order, index) => (
          <div
            key={index}
            className="bg-white shadow-md rounded-lg p-4 text-gray-700 relative"
          >
            <div className="text-sm mb-8">
              <p>
                <span className="font-bold text-lg">الإيميل: </span>
                {order.email}
              </p>
              <p>
                <span className="font-bold text-lg">التاريخ: </span>
                {new Date(order.orderDate).toLocaleString()}
              </p>
              <p>
                <span className="font-bold text-lg">عدد العناصر: </span>
                {order.numberOfItems}
              </p>
              <p>
                <span className="font-bold text-lg">الإجمالي: </span>
                {order.totalPrice} ج.م
              </p>
            </div>
            <div className="flex justify-between gap-8 absolute bottom-2 md:right-[25%] right-[30%]">
              <button
                type="button"
                className="bg-[#14BE06] text-white rounded-md px-4 py-1 text-sm"
              >
                ✔ موافقة
              </button>
              <button
                type="button"
                className="bg-[#DC3D3D] text-white rounded-md px-4 py-1 text-sm"
              >
                ✘ رفض
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-center mt-6">
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-md"
          onClick={() => setPageNumber((prev) => Math.max(prev - 1, 1))}
          disabled={pageNumber === 1}
        >
          السابق
        </button>
        <span className="mx-4">صفحة {pageNumber}</span>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-md"
          onClick={() => setPageNumber((prev) => prev + 1)}
        >
          التالي
        </button>
      </div>
    </div>
  );
}