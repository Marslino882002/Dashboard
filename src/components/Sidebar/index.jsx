  import { useEffect, useRef, useState } from 'react';
  import { NavLink, useNavigate } from 'react-router-dom';
  import logo from '../../images/logo.jpg';

  const Sidebar = ({ sidebarOpen, setSidebarOpen }) => {
    const trigger = useRef(null);
    const sidebar = useRef(null);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const navigate = useNavigate(); 


    const closeSidebar = () => setSidebarOpen(false);

    const handleClickOutside = (event) => {
      if (
        sidebar.current &&
        trigger.current &&
        !sidebar.current.contains(event.target) &&
        !trigger.current.contains(event.target) &&
        sidebarOpen
      ) {
        closeSidebar();
      }
    };

    useEffect(() => {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }, [sidebarOpen]);

    const renderNavLink = (to, iconClass, label) => (
      <NavLink
        to={to}
        onClick={closeSidebar}
        className={({ isActive }) =>
          `flex items-center gap-3 rounded-md px-4 py-3 font-medium ${
            isActive ? 'bg-blue-100 text-[#195E8B]' : 'text-gray-700 hover:bg-gray-100'
          }`
        }
      >
        <i className={`${iconClass} text-lg`}></i>
        <span>{label}</span>
      </NavLink>
    );

    const handleLogout = () => {
      localStorage.removeItem('token'); // Remove the token
      navigate('/login'); // Redirect to the login page
    };
    return (
      <aside
      ref={sidebar}
      className={`fixed w-[40%] inset-y-0 right-0 z-50 flex h-full flex-col bg-white transition-all duration-500 ease-in-out dark:bg-boxdark sm:static lg:w-[18%] sm:w-[30%] sm:translate-x-0 ${
        sidebarOpen ? 'right-0 pt-15 sm:pt-0' : 'right-[-100%]'
      }`}
    >
      <div className="flex items-center gap-2 px-6 py-4 border-b">
        <img src={logo} alt="logo" className="w-full object-contain" />
      </div>
      {/* Apply overflow-y-auto here */}
      <nav className="flex flex-col gap-2 px-4 py-6 overflow-y-auto">
        <div>
          <button
            className="flex items-center justify-between gap-3 w-full rounded-md px-4 py-3 font-medium text-gray-700 hover:bg-gray-100"
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            <div>
              <i className="fa fa-upload text-lg"></i>
              <span className="mr-5">الرفع</span>
            </div>
            <i
              className={`fa ${dropdownOpen ? 'fa-chevron-up' : 'fa-chevron-down'} text-sm`}
            ></i>
          </button>
          {/* Add dynamic content */}
          {dropdownOpen && (
            <div className="ml-8 flex flex-col gap-2 mr-7">
              {renderNavLink('/upload/reflections', '', 'تأملات')}
              {renderNavLink('/upload/podcast', '', 'بودكاست')}
              {renderNavLink('/upload/articles', '', 'مقالات')}
              {renderNavLink('/upload/categories', '', 'كورسات')}
            </div>
          )}
        </div>
        {renderNavLink('/users', 'fa fa-users', 'المستخدمين')}
        {renderNavLink('/instructors', 'fa fa-chalkboard-teacher', 'المحاضرين')}
        {renderNavLink('/Advertises', 'fa fa-bullhorn', 'اضف اعلان')}
        {renderNavLink('/payments', 'fa fa-wallet', 'المدفوعات')}
        {renderNavLink('/faq', 'fa-solid fa-question', 'أسئلة متكررة')}
      </nav>
      <div className="mt-auto border-t px-4 py-4">
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-md px-4 py-3 font-medium text-red-600 hover:bg-red-50"
        >
          <i className="fa fa-sign-out-alt text-lg"></i>
          <span>تسجيل خروج</span>
        </button>
      </div>
    </aside>
    
    );
  };

  export default Sidebar;
