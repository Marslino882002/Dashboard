import React, { useEffect, useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import Sidebar from '../components/Sidebar/index';

const DefaultLayout = ({ routes }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (sidebarOpen) {
      document.body.classList.add('no-scroll');
    } else {
      document.body.classList.remove('no-scroll');
    }
    return () => document.body.classList.remove('no-scroll');
  }, [sidebarOpen]);

  return (
    <div className="dark:bg-boxdark-2 dark:text-bodydark">
      <div className="flex h-screen overflow-hidden">
        {/* Sidebar */}
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        {/* Content Area */}
        <div className="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
          {/* Header for Mobile View */}
          <div className="sm:hidden fixed top-0 left-0 right-0 bg-white z-50 shadow-md flex items-center justify-between p-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="text-gray-700 focus:outline-none"
            >
              <i className={`fa ${sidebarOpen ? 'fa-times' : 'fa-bars'} text-xl`}></i>
            </button>
            <h1 className="text-lg font-semibold text-gray-800">القائمة</h1>
          </div>

          {/* Adjust for Mobile Header */}
          <div className="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden mt-[60px] sm:mt-0 lg:mt-0">
            <main>
              <div className="mx-auto max-w-screen-2xl md:p-6 2xl:p-5">
                <Routes>
                  {routes.map((route) => (
                    <Route
                      key={route.path}
                      path={route.path}
                      element={route.element}
                    />
                  ))}
                </Routes>
              </div>
            </main>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DefaultLayout;
