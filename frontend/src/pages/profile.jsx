import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify';
import { FaUser } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { FaPhone } from "react-icons/fa6";
import { ImCross } from "react-icons/im";
import { FaCar } from "react-icons/fa";
import BookingItem from '../components/BookingItem';
import axios from 'axios';

const Profile = () => {
    const backendURL = import.meta.env.VITE_BACKEND_URL;
    const [isEditFormOpen, setIsEditFormOpen] = useState(false);
    const [user, setUser] = useState({});
    const [bookings, setBookings] = useState([]);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: ''
    });

    useEffect(() => {
        axios.get(`${backendURL}/booking/user-bookings`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
            .then(response => {
                console.log('Success:', response.data);
                setBookings(response.data.data);
                console.log(bookings);
            })
            .catch(error => {
                console.error('Error:', error.message);

            });
    }, [])

    function editProfile() {
        setFormData({
            name: user.name || '',
            email: user.email || '',
            phone: user.phone || ''
        });
        setIsEditFormOpen(true);
    }

    useEffect(() => {
        axios.get(`${backendURL}/user/profile`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
            .then(response => {
                console.log('Success:', response.data.user);
                setUser({
                    name: response.data.user.name,
                    email: response.data.user.email,
                    phone: response.data.user.phone,
                    joinDate: response.data.user.joinDate
                })

            })
            .catch(error => {
                console.error('Error:', error.message);

            });
    }, [])

    function submitUpdate() {
        axios.put(`${backendURL}/user/updateprofile`, {
            ...formData
        }, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
            .then(response => {
                console.log('Success:', response.data);
                setUser({ ...user, email: formData.email, name: formData.name, phone: formData.phone });
                toast.success("Profile updated Successfully!");
                setIsEditFormOpen(false);
            })
            .catch(error => {
                console.error('Error:', error);
                toast.error(error.response.data.message);
            });

    }

    function logOut(){
        localStorage.removeItem('token');
        window.location.reload();
    }

    return (
        <div className='py-4 px-8 space-y-6 relative lg:px-20 lg:h-[100vh]'>

            {isEditFormOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    {/* Shadowy Background */}
                    <div
                        className="absolute inset-0 bg-black opacity-50"
                        onClick={() => setIsEditFormOpen(false)}
                    ></div>

                    {/* Centered Form */}
                    <div className='relative w-[95%] rounded-xl text-center py-6 px-8 bg-white space-y-5 lg:w-[30%] z-10'>
                        <button onClick={() => setIsEditFormOpen(false)} className='absolute right-3 top-3'>
                            <ImCross />
                        </button>

                        <h1 className='text-2xl font-bold'>Update Profile</h1>

                        <div className='flex gap-4 items-center'>
                            <FaUser size={20} />
                            <p className='text-lg font-bold'>Name</p>
                        </div>
                        <input
                            type="text"
                            placeholder='Name'
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className='w-full py-3 px-4 text-lg outline-none bg-gray-200 rounded-xl'
                        />

                        <div className='flex gap-4 items-center'>
                            <MdEmail size={22} />
                            <p className='text-lg font-bold'>Email</p>
                        </div>
                        <input
                            type="text"
                            placeholder='Email'
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className='w-full py-3 px-4 text-lg outline-none bg-gray-200 rounded-xl'
                        />

                        <div className='flex gap-4 items-center'>
                            <FaPhone size={20} />
                            <p className='text-lg font-bold'>Phone</p>
                        </div>
                        <input
                            type="text"
                            placeholder='Phone'
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            className='w-full py-3 px-4 text-lg outline-none bg-gray-200 rounded-xl'
                        />

                        <button onClick={submitUpdate} className='text-center p-4 bg-black text-white font-semibold text-lg rounded-xl w-full'>
                            Update
                        </button>
                    </div>
                </div>
            )}


            <div className='w-full shadow-xl p-7 flex flex-col items-center text-center rounded-lg lg:flex-row lg:text-left gap-6'>
                <div className='rounded-full bg-black w-[150px] h-[150px] flex justify-center items-center font-bold text-white text-4xl'>{user?.name?.[0] ?? ''}</div>
                <div className='space-y-3'>
                    <h1 className='text-4xl font-bold'>{user.name}</h1>
                    <p>{`Joined in ${user?.joinDate ? new Date(user.joinDate).toLocaleString('default', { month: 'long' }) + ' ' + new Date(user.joinDate).getFullYear() : ''}`}</p>
                </div>
            </div>

            <div className='flex flex-col gap-6 w-full lg:flex-row lg:justify-between'>
                {/* right section */}
                <div className='w-full py-5 px-8 rounded-lg shadow-xl lg:w-[48%] space-y-7'>
                    <div className='flex items-center gap-3'>
                        <div className='flex justify-center items-center p-3 rounded-xl bg-gray-100'><FaUser size={25} /></div>
                        <h1 className='text-xl font-bold'>Profile Information</h1>
                    </div>

                    <div className='space-y-2'>
                        <div className='flex gap-4 items-center'>
                            <FaUser size={20} />
                            <p className='text-lg font-bold'>Name</p>
                        </div>
                        <p className='text-lg '>{user.name}</p>
                    </div>

                    <div className='space-y-2'>
                        <div className='flex gap-4 items-center'>
                            <MdEmail size={22} />
                            <p className='text-lg font-bold'>Email</p>
                        </div>
                        <p className='text-lg '>{user.email}</p>
                    </div>

                    <div className='space-y-2'>
                        <div className='flex gap-4 items center'>
                            <FaPhone size={20} />
                            <p className='text-lg font-bold'>Phone</p>
                        </div>
                        <p className='text-lg '>{user.phone}</p>
                    </div>

                    <button className='text-center p-4 bg-black text-white font-semibold text-lg rounded-xl w-full' onClick={editProfile}> Edit Profile</button>
                    <button onClick={logOut} className='text-center p-4 bg-black text-white font-semibold text-lg rounded-xl w-full'>Log Out</button>

                </div>

                {/* left section */}

                <div className='overflow-y-auto space-y-4 w-full max-h-[500px] py-5 px-8 rounded-lg shadow-xl lg:w-[48%] flex flex-col'>
                    {/* Header */}
                    <div className='flex items-center gap-3 mb-5'>
                        <div className='flex justify-center items-center p-3 rounded-xl bg-gray-100'>
                            <FaCar size={30} />
                        </div>
                        <h1 className='text-xl font-bold'>Booking History</h1>
                    </div>
                    {
                        bookings?.map((booking) => {
                            return <BookingItem id = {booking._id} carId = {booking.carId} status = {booking.status} startDate = {booking.startDate} endDate = {booking.endDate} totalAmount = {booking.totalAmount}/>
                        })
                    }

                </div>

            </div>

        </div>
    )
}

export default Profile
