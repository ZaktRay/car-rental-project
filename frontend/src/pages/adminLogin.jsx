import { MdEmail } from "react-icons/md";
import { FaKey } from "react-icons/fa";
import axios from "axios";
import { useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const AdminLogin = () => {
  const backendURL = import.meta.env.VITE_BACKEND_URL;

  console.log(backendURL);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  function submit() {
      const URL = `${backendURL}/admin/login`
        axios.post(URL, {
            ...formData
        })
            .then(response => {
                console.log('Success:', response.data);
                toast.success('Logged in Successfully');
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('role', 'admin');
                navigate('/admin/dashboard');
                
            })
            .catch(error => {
                console.error('Error:', error.message);
                toast.error(error.response.data.message);

            });
    }

  return (

    <div className='bg-black w-full h-[100vh] flex justify-center items-center'>

      <div className='rounded-xl w-[95%] bg-white py-8 px-7 text-center space-y-8 lg:w-[30%]'>
        <h1 className='text-3xl font-bold'>Admin Login</h1>
        <div className='w-[90%] flex items-center rounded-xl border-2 border-gray-400 h-[50px] px-3 mx-auto focus-within:outline outline-1 outline-[#5d36eb]'>
          <MdEmail size={20} className='text-gray-400' />
          <input type="text" placeholder='Enter your Email' className='w-full h-full outline-none px-3' onChange={(e) => { setFormData({ ...formData, email: e.target.value }) }} />
        </div>
        <div className='w-[90%] flex items-center rounded-xl border-2 border-gray-400 h-[50px] px-3 mx-auto focus-within:outline outline-1 outline-[#5d36eb]'>
          <FaKey size={18} className='text-gray-400' />
          <input type="password" placeholder='Enter your Password' className='w-full h-full outline-none px-3' onChange={(e) => { setFormData({ ...formData, password: e.target.value }) }} />
        </div>
        <button className='bg-[#5d36eb] w-[90%] p-3 rounded-xl font-semibold text-white' onClick={submit}>Login</button>

      </div>

    </div>
  )
}

export default AdminLogin
