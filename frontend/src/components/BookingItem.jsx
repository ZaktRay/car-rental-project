import axios from 'axios';
import React from 'react'
import { BsCalendarDateFill } from "react-icons/bs";
import { FaDollarSign } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';


const BookingItem = ({id, carId, startDate, endDate, status, totalAmount}) => {
    const backendURL = import.meta.env.VITE_BACKEND_URL;

    function cancelbooking(){
        axios.put(`${backendURL}/booking/cancel`, {
            id
        },{
             headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
            .then(response => {
                console.log('Success:', response.data);
                toast.success('Booking Cancelled!');
                navigate('/profile');
                
            })
            .catch(error => {
                console.error('Error:', error.message);
                toast.error(error.response.data.message);
            });

    }
  return (
                        <div className='space-y-8 py-3'>
                        {/* Booking Item */}
                        <div className='flex flex-col bg-gray-100 rounded-xl w-full py-4 px-6 gap-4 lg:flex-row lg:justify-between'>
                            <div className='w-full space-y-3'>
                                <p className='font-bold text-lg'>{carId.model}</p>
                                <p>{carId.brand}</p>
                                <div className='flex items-center gap-3'><BsCalendarDateFill />{new Date(startDate).toLocaleDateString()} to {new Date(endDate).toLocaleDateString()}</div>
                                <div className='flex gap-3 items-center'><FaDollarSign /> ${totalAmount}</div>
                            </div>
                            <div className='space-y-7 h-full flex flex-col justify-between items-center'>
                                <div className='rounded-full font-lg bg-red-200 p-3 text-center h-[10%] font-semibold'>{status}</div>

                                    <button onClick={cancelbooking} className='text-red-500 font-bold'>Cancel Booking</button>

                            </div>
                        </div>


                    </div>
  )
}

export default BookingItem
