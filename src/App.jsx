// Import statements remain the same
import React, { useEffect, useState, createContext, useContext } from 'react';
import { Route, Routes, useLocation, useNavigate, Navigate } from 'react-router-dom';
import { ClipLoader } from 'react-spinners';
import DefaultLayout from './layout/DefaultLayout';



import AdAdvertise from './components/AdAdvertise/AdAdvertise';
import Login from './components/LoginPage/Login';
import Faq from './components/FAQ/Faq';
import AddFaq from './components/FAQ/AddFaq';

import Advertises from './components/AdAdvertise/Advertises';






import InstructorDetails from './components/instractorDetails/InstractorDetails';
import Reflections from './components/Reflections/Reflections';
import Articles from './components/Articles/Articles';
import Podcast from './components/Podcast/Podcast';
import Users from './components/users/Users';
import UserDetails from './components/UserDetails/UserDetails';
import Instructors from './components/instructors/Instructors';
import Payments from './components/Payments/Payments';
import AddEpisode from './components/Podcast/AddEpisode';
import AddPodcast from './components/Podcast/AddPodcast';
import PodcastEpisodes from './components/Podcast/PodcastEpisodes';
import Categories from './components/Courses/Category/Categories';
import AddCategory from './components/Courses/Category/AddCategory';
import AddCourse from './components/Courses/Courses/AddCourse';
import Courses from './components/Courses/Courses/Courses';
import AddSection from './components/Courses/Section/AddSection';
import CourseSection from './components/Courses/Section/CourseSection';
import Lesson from './components/Courses/Lessons/Lesson';
import AddLesson from './components/Courses/Lessons/AddLesson';
import Resources from './components/Courses/Resources/Resources';
import AddResources from './components/Courses/Resources/AddResources';


// Authentication Context
const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

const AuthContextProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));

  const login = (token) => {
    localStorage.setItem('token', token);
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// ProtectedRoute Component
const ProtectedRoute = ({ element, redirectTo = '/login' }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? element : <Navigate to={redirectTo} />;
};

// Define routes array
const routes = [
  { path: '/users', element: <Users /> },
  { path: '/userDetails/:id', element: <UserDetails /> },
  { path: '/faq', element: <Faq /> },
  { path: '/addFaq/:faqNumber', element: <AddFaq /> },
  { path: '/instructors', element: <Instructors /> },
  { path: '/instructor/:id', element: <InstructorDetails /> },
  { path: '/adAdvertise', element: <AdAdvertise /> },
  { path: '/Advertises', element: <Advertises /> },
  { path: '/payments', element: <Payments /> },
  { path: '/upload/reflections', element: <Reflections /> },
  { path: '/upload/articles', element: <Articles /> },
  { path: '/upload/podcast', element: <Podcast /> },
  { path: '/upload/addEpisode', element: <AddEpisode /> },
  { path: '/upload/addPodcast', element: <AddPodcast /> },
  { path: '/upload/PodcastEpisodes/:id', element: <PodcastEpisodes /> },
  { path: '/upload/categories', element: <Categories /> },
  { path: '/upload/addCategory', element: <AddCategory /> },
  { path: '/upload/category/:categoryId/addcourse', element: <AddCourse /> },
  { path: '/upload/category/:categoryId/course', element: <Courses /> },
  { path: '/upload/category/:categoryId/course/:courseId/addsection', element: <AddSection /> },
  { path: '/upload/category/:categoryId/course/:courseId/section', element: <CourseSection /> },
  { path: '/upload/category/:categoryId/course/:courseId/section/:sectionId/lesson', element: <Lesson /> },
  { path: '/upload/category/:categoryId/course/:courseId/section/:sectionId/addlesson', element: <AddLesson /> },
  { path: '/upload/category/:categoryId/course/:courseId/section/:sectionId/lesson/:lessonId/resource', element: <Resources /> },
  { path: '/upload/category/:categoryId/course/:courseId/section/:sectionId/lesson/:lessonId/addresource', element: <AddResources /> },
];

function App() {
  const [loading, setLoading] = useState(true);
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);

  return loading ? (
    <div className="flex justify-center items-center w-full h-screen">
      <ClipLoader size={50} color="#195E8B" loading={loading} />
    </div>
  ) : (
    <AuthContextProvider>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/*"
          element={<ProtectedRoute element={<DefaultLayout routes={routes} />} />}
        />
      </Routes>
    </AuthContextProvider>
  );
}

export default App;
