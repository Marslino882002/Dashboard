import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useAuth } from '../../App';
import login_image from '../../images/loginImage.jpg';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth(); // Access the login function from context
  const [userIdentifier, setUserIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isClicked, setIsClicked] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!userIdentifier || !password) {
      setError('يُرجى إدخال اسم المستخدم وكلمة المرور');
      return;
    }

    setIsClicked(true);

    const loginPayload = {
      userIdentifier,
      password,
      otp: '123456', // Default OTP value
    };

    try {
      const response = await axios.post(
        'https://generalcommittee-dev.azurewebsites.net/api/admin/login',
        loginPayload
      );

      // Access and save the token
      const token = response.data?.data?.token;
      if (token) {
        login(token); // Update the authentication state
        toast.success('تم تسجيل الدخول بنجاح!');
        navigate('/users'); // Redirect to the users page
      } else {
        throw new Error('لم يتم العثور على رمز الوصول');
      }
    } catch (error) {
      const errorMsg =
        error.response?.data?.message || 'حدث خطأ أثناء تسجيل الدخول';
      toast.error(errorMsg);
      setError(errorMsg);
      setIsClicked(false);
    }
  };

  return (
    <div className="w-screen h-screen flex justify-center items-center bg-gray-800">
      <div className="flex flex-col md:flex-row w-screen h-screen bg-white shadow-lg overflow-hidden">
        <div className="md:w-1/2 w-full flex flex-col justify-center items-center px-6 sm:px-8 md:px-10 py-6 sm:py-8 md:py-10">
          <h2 className="text-xl sm:text-2xl font-bold mb-4 text-center">
            مرحباً بعودتك!
          </h2>
          <form className="w-full" onSubmit={handleLogin}>
            {error && (
              <div className="mb-4 text-red-600 text-sm text-center">{error}</div>
            )}
            <div className="mb-4">
              <label htmlFor="userIdentifier" className="block mb-2 text-sm text-right">
                اسم المستخدم أو البريد الإلكتروني
              </label>
              <input
                type="text"
                id="userIdentifier"
                value={userIdentifier}
                onChange={(e) => setUserIdentifier(e.target.value)}
                placeholder="ادخل اسم المستخدم أو البريد الإلكتروني"
                className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-[#195E8B]"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="password" className="block mb-2 text-sm text-right">
                كلمة المرور
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="ادخل كلمة المرور"
                className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-[#195E8B]"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-[#195E8B] text-white py-2 rounded-md hover:bg-[#134969] transition"
              disabled={isClicked}
            >
              {!isClicked ? 'تسجيل الدخول' : 'جاري تسجيل الدخول...'}
            </button>
          </form>
        </div>
        <div className="md:w-1/2 w-full  sm:h-56 md:h-auto bg-danger">
          <img
            src={login_image}
            alt="Login Illustration"
            className="w-[100%] h-[50%] md:h-full object-fill  md:object-fill"
          />
        </div> 
      </div>
    </div>
  );
}



