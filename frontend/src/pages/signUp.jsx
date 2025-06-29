import React, { useState } from 'react'
import { MdEmail } from "react-icons/md";
import { FaKey } from "react-icons/fa";
import { Link, Navigate,useNavigate } from 'react-router-dom';
import { FaPhone } from "react-icons/fa6";
import { FaUser } from "react-icons/fa";
import { TailSpin } from 'react-loading-icons'
import axios from 'axios';
import { toast } from 'react-toastify';


const SignUp = () => {
    const backendURL = import.meta.env.VITE_BACKEND_URL;
    const navigate = useNavigate();
    const [user, setUser] = useState({
        name: "",
        email: "",
        phone: "",
        password: ""
    })

    const [loading, setLoading] = useState(false);

    function submit() {
        setLoading(true);
        console.log(user);

        axios.post(`${backendURL}/user/register`, {
            ...user
        })
            .then(response => {
                setLoading(false);
                console.log('Success:', response.data);
                toast.success('Registered Successfully');
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('role','user');
                console.log(response.data.token);
                setTimeout(() => {
                    navigate('/');
                }, 3000);
                
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
                <h1 className='text-3xl font-bold'>Sign Up!</h1>
                <div className='w-[90%] flex items-center rounded-xl border-2 border-gray-400 h-[50px] px-3 mx-auto focus-within:outline outline-1 outline-[#5d36eb]'>
                    <FaUser size={18} className='text-gray-400' />
                    <input type="text" placeholder='Full Name' onChange={(e) => { setUser({ ...user, name: e.target.value }) }} className='w-full h-full outline-none px-3' />
                </div>
                <div className='w-[90%] flex items-center rounded-xl border-2 border-gray-400 h-[50px] px-3 mx-auto focus-within:outline outline-1 outline-[#5d36eb]'>
                    <MdEmail size={20} className='text-gray-400' />
                    <input type="text" placeholder='Email' onChange={(e) => { setUser({ ...user, email: e.target.value }) }} className='w-full h-full outline-none px-3' />
                </div>
                <div className='w-[90%] flex items-center rounded-xl border-2 border-gray-400 h-[50px] px-3 mx-auto focus-within:outline outline-1 outline-[#5d36eb]'>
                    <FaPhone size={18} className='text-gray-400' />
                    <input type="text" placeholder='Phone Number' onChange={(e) => { setUser({ ...user, phone: e.target.value }) }} className='w-full h-full outline-none px-3' />
                </div>
                <div className='w-[90%] flex items-center rounded-xl border-2 border-gray-400 h-[50px] px-3 mx-auto focus-within:outline outline-1 outline-[#5d36eb]'>
                    <FaKey size={18} className='text-gray-400' />
                    <input type="password" placeholder='Password' required={true} minLength={6} onChange={(e) => { setUser({ ...user, password: e.target.value }) }} className='w-full h-full outline-none px-3' />
                </div>
                <button onClick={submit} className='bg-[#5d36eb] w-[90%] p-3 rounded-xl font-semibold text-white' disabled={loading}> {loading ? (
                    <div className="flex justify-center items-center">
                        <TailSpin height={24} width={24} color="#fff" />
                    </div>
                ) : (
                    "Sign Up"
                )}</button>
                <Link to={'/login'}>
                    <p className='text-[#5d36eb] cursor-pointer mt-3'>Back to Log in</p>
                </Link>

            </div>

        </div>
    )
}

export default SignUp
