import React, { useState } from 'react'
import { MdEmail } from "react-icons/md";
import { FaKey } from "react-icons/fa";
import { TailSpin } from 'react-loading-icons'
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';


const Login = () => {
    const backendURL = import.meta.env.VITE_BACKEND_URL;
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: "",
        password: ""
    })
     const [loading, setLoading] = useState(false);

     function submit() {
        setLoading(true);

        axios.post(`${backendURL}/user/login`, {
            ...formData
        })
            .then(response => {
                setLoading(false);
                console.log('Success:', response.data);
                toast.success('Logged in Successfully');
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('role','user');
                navigate('/');
                
            })
            .catch(error => {
                console.error('Error:', error.message);
                toast.error(error.response.data.message);
                setLoading(false);

            });
    }

    return (
        <div className='bg-black w-full h-[100vh] flex justify-center items-center'>

            <div className='rounded-xl w-[95%] bg-white py-8 px-7 text-center space-y-8 lg:w-[30%]'>
                <h1 className='text-3xl font-bold'>Welcome Back!</h1>
                <div className='w-[90%] flex items-center rounded-xl border-2 border-gray-400 h-[50px] px-3 mx-auto focus-within:outline outline-1 outline-[#5d36eb]'>
                    <MdEmail size={20} className='text-gray-400' />
                    <input type="text" placeholder='Enter your Email' className='w-full h-full outline-none px-3' onChange={(e)=>{setFormData({...formData, email : e.target.value})}} />
                </div>
                <div className='w-[90%] flex items-center rounded-xl border-2 border-gray-400 h-[50px] px-3 mx-auto focus-within:outline outline-1 outline-[#5d36eb]'>
                    <FaKey size={18} className='text-gray-400' />
                    <input type="password" placeholder='Enter your Password' className='w-full h-full outline-none px-3' onChange={(e)=>{setFormData({...formData, password : e.target.value})}} />
                </div>
                <button className='bg-[#5d36eb] w-[90%] p-3 rounded-xl font-semibold text-white' onClick={submit} disabled={loading}>{loading ? (
                                    <div className="flex justify-center items-center">
                                        <TailSpin height={24} width={24} color="#fff" />
                                    </div>
                                ) : (
                                    "Login"
                                )}</button>
                <Link to={'/signup'}>
                    <p className='text-[#5d36eb] cursor-pointer mt-3'>Don't have an account? Sign Up</p>
                </Link>

            </div>

        </div>
    )
}

export default Login
