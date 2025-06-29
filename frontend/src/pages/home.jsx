import React, { useState, useEffect, useRef } from 'react'
import { Link, Links } from 'react-router-dom';
import bgCar from '../assets/bg-car.jpg';
import { FaUser } from "react-icons/fa";
import { RiAdminFill } from "react-icons/ri";
import { FaCar } from "react-icons/fa";
import { SlCalender } from "react-icons/sl";
import { BiSupport } from "react-icons/bi";
import { FaShieldAlt } from "react-icons/fa";
import { FaArrowRight } from "react-icons/fa";
import axios from 'axios';

const Home = () => {
  const backendURL = import.meta.env.VITE_BACKEND_URL;
  const [isLoginMenuOpen, setIsLoginMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkToken = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;

      try {
        const res = await axios.get(`${backendURL}/verify/verify-token`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.data.valid) {
          setIsLoggedIn(true);
        } else {
          localStorage.removeItem('token');
          setIsLoggedIn(false);
        }
      } catch (err) {
        localStorage.removeItem('token');
        setIsLoggedIn(false);
      }
    };

    checkToken();
  }, [])


  return (
    <div className=''>

      {isLoggedIn ? <Link to={'/profile'}><button className='fixed top-6 right-6 rounded-3xl bg-gray-300/70 px-6 py-3 text-white font-semibold flex items-center gap-2 z-50'><FaUser />Profile</button></Link> : <button className='fixed top-6 right-6 rounded-3xl bg-gray-300/70 px-6 py-3 text-white font-semibold flex items-center gap-2 z-50' onClick={() => setIsLoginMenuOpen(!isLoginMenuOpen)}><FaUser />Login</button>}


      {isLoginMenuOpen && <div className='w-[45%] bg-white flex flex-col fixed top-20 right-6 rounded-xl overflow-hidden lg:w-[12%] z-50'>
        <Link to='/login'>
          <div className='flex items-center gap-4 hover:bg-gray-100 p-3'><FaUser />User Login</div>
        </Link>
        <Link to='/admin-login'>
          <div className='flex items-center gap-4 hover:bg-gray-100 p-3'><RiAdminFill /> Admin Login</div>
        </Link>
      </div>}

      <div className='max-w-[100vw] h-[100vh] bg-cover bg-center flex flex-col justify-end py-5' style={{ backgroundImage: `url(${bgCar})` }}>

        <div className='w-[80%] mx-auto flex flex-col gap-y-14'>

          <div className='w-[100%] space-y-10 lg:w-[60%]'>
            <h1 className='text-7xl font-bold text-white lg:text-8xl'>Drive Your <span>Dreams</span></h1>
            <p className='text-white text-xl lg:text-2xl'>Experience luxury and comfort with our premium car rental service. Choose from our wide selection of vehicles at competitive prices.</p>
          </div>

          <div className='w-[100%] rounded-xl bg-slate-300/40 text-white p-6 left-0 right-0 flex flex-wrap gap-2 justify-around'>

            {[
              { value: "500+", stat: "Cars Available" },
              { value: "1000+", stat: "Happy Customers" },
              { value: "50+", stat: "Locations" },
              { value: "24/7", stat: "Support" }
            ].map((stat, index) => {
              return (
                <div key={index} className='flex flex-col items-center'>
                  <p className='font-bold text-4xl'>{stat.value}</p>
                  <p>{stat.stat}</p>
                </div>
              );
            })}

          </div>

        </div>

      </div>

      <div className='max-w-[100vw] bg-gradient-to-b from-[#0b0518] to-[#0c0027] py-20 flex flex-col items-center space-y-12 lg:h-[100vh]'>
        <div className='text-center space-y-4'>
          <h1 className='text-white font-bold text-4xl'>Featured Rides</h1>
          <p className='text-white'>Choose from our exceptional collection</p>
        </div>

        <div className='flex flex-wrap gap-y-5 w-[90%] justify-evenly'>

          <div className='p-5 w-[100%] bg-white/30 rounded-lg lg:w-[30%]'>
            <div className='w-full rounded-lg overflow-hidden'><img src="https://images.unsplash.com/photo-1617469767053-d3b523a0b982?ixlib=rb-4.0.3" alt="car" className='object-cover' /></div>
            <div className='space-y-3 mt-5'>
              <div className='font-bold text-white text-2xl'>Toyota</div>
              <div className='text-gray-300'>Luxury SUV</div>
              <div className='text-gray-300 font-bold'>$249/Day</div>
            </div>
          </div>

          <div className='p-5 w-[100%] bg-white/30 rounded-lg lg:w-[30%]'>
            <div className='w-full rounded-lg overflow-hidden'><img src="https://images.unsplash.com/photo-1617469767053-d3b523a0b982?ixlib=rb-4.0.3" alt="car" className='object-cover' /></div>
            <div className='space-y-3 mt-5'>
              <div className='font-bold text-white text-2xl'>Toyota</div>
              <div className='text-gray-300'>Luxury SUV</div>
              <div className='text-gray-300 font-bold'>$249/Day</div>
            </div>
          </div>

          <div className='p-5 w-[100%] bg-white/30 rounded-lg lg:w-[30%]'>
            <div className='w-full rounded-lg overflow-hidden'><img src="https://images.unsplash.com/photo-1617469767053-d3b523a0b982?ixlib=rb-4.0.3" alt="car" className='object-cover' /></div>
            <div className='space-y-3 mt-5'>
              <div className='font-bold text-white text-2xl'>Toyota</div>
              <div className='text-gray-300'>Luxury SUV</div>
              <div className='text-gray-300 font-bold'>$249/Day</div>
            </div>
          </div>
        </div>
      </div>


      <div className='flex flex-wrap justify-around gap-y-5 bg-gradient-to-b from-[#161616] to-[#292929] py-12 px-9 lg:px-16'>
        <div className='w-full text-left space-y-5 bg-slate-200/10 backdrop-blur-sm py-8 rounded-lg px-6 lg:w-[20%] hover:transition-all duration-300 hover:bg-slate-200/30'>
          <FaCar size={50} className='text-white' />
          <p className='text-white font-bold text-xl'>Premium Selection</p>
          <p className='text-white'>Luxury and comfort vehicles</p>
        </div>

        <div className='w-full text-left space-y-5 bg-slate-200/10 backdrop-blur-sm py-8 rounded-lg px-6 lg:w-[20%] hover:transition-all duration-300 hover:bg-slate-200/30'>

          <SlCalender size={50} className='text-white' />
          <p className='text-white font-bold text-xl'>Easy Booking</p>
          <p className='text-white'>Quick reservation process</p>
        </div>

        <div className='w-full text-left space-y-5 bg-slate-200/10 backdrop-blur-sm py-8 rounded-lg px-6 lg:w-[20%] hover:transition-all duration-300 hover:bg-slate-200/30'>
          <BiSupport size={50} className='text-white' />
          <p className='text-white font-bold text-xl'>24/7 Support</p>
          <p className='text-white'>Always here to help</p>
        </div>

        <div className='w-full text-left space-y-5 bg-slate-200/10 backdrop-blur-sm py-8 rounded-lg px-6 lg:w-[20%] hover:transition-all duration-300 hover:bg-slate-200/30'>
          <FaShieldAlt size={50} className='text-white' />
          <p className='text-white font-bold text-xl'>Safe & Secure</p>
          <p className='text-white'>Fully insured vehicles</p>
        </div>
      </div>

      <div className='w-full py-[150px] overflow-hidden relative'>
        <div className='mx-auto text-center space-y-10 px-4 relative z-50 bg-transparent'>
          <h1 className='text-4xl font-bold text-white'>Ready for your next Adventure?</h1>
          <p className='text-xl text-white'>Get started with our easy booking process and experience the best in car rentals.</p>
          <Link to='/cars'><button className='flex gap-2 items-center mx-auto bg-white px-8 py-4 my-6 rounded-full'>Book Now <FaArrowRight className='text-black' /></button></Link>
        </div>
        <div className='w-full h-full -skew-y-6 bg-black absolute top-0'></div>
      </div>
    </div>
  )
}

export default Home
