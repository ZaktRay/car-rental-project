import React, { useState,useEffect } from 'react';
import { FaCar, FaMapMarkerAlt, FaCalendarAlt } from "react-icons/fa";
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';


const Booking = () => {
    const backendURL = import.meta.env.VITE_BACKEND_URL;
    const navigate = useNavigate();
    const { id } = useParams();
    const [carData,setCarData] = useState({});

    useEffect(()=>{
        axios.get(`${backendURL}/car/${id}`)
            .then(response => {
                console.log('Success:', response.data);
                setCarData({...response.data});
            })
            .catch(error => {
                console.error('Error:', error.message);

            });
    },[])

    const [bookingData, setBookingData] = useState({
        pickupLocation: '',
        startDate: '',
        dropoffLocation: '',
        endDate: '',
        pickupTime: '',
        dropoffTime: '',
        carId : id,
        totalAmount : ''
        
    });

   useEffect(() => {
    if (bookingData.startDate && bookingData.endDate) {
        const start = new Date(bookingData.startDate);
        const end = new Date(bookingData.endDate);

        setBookingData(prev => ({
            ...prev,
            pickupTime: start.toLocaleTimeString(),
            dropoffTime: end.toLocaleTimeString()
        }));

        console.log("Updated bookingData:", bookingData);
    }
}, [bookingData.startDate, bookingData.endDate]);

   const calculateDays = () => {
    if (bookingData.startDate && bookingData.endDate) {
        const pickup = new Date(bookingData.startDate);
        const dropoff = new Date(bookingData.endDate);
        const diffTime = Math.abs(dropoff - pickup);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays || 1;
    }
    return 1;
};


const totalPrice = carData?.price ? carData.price * calculateDays() : 0;

    const handleInputChange = (field, value) => {
        setBookingData({...bookingData, [field]: value,});
        console.log(bookingData);
    };

    const handleBooking = () => {

         axios.post(`${backendURL}/booking/create`, {
            ...bookingData , totalAmount : totalPrice
        },{
             headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
            .then(response => {
                console.log('Success:', response.data);
                toast.success('Booking Confirmed!');
                navigate('/profile');
                
            })
            .catch(error => {
                console.error('Error:', error.message);
                toast.error(error.response.data.message);
            });
        
    };

    return (
        <div className='w-full min-h-screen bg-gray-50 py-8'>
            <div className='w-[95%] lg:w-[80%] mx-auto'>
                
                {/* Car Details Section */}
                <div className='bg-white rounded-lg shadow-xl p-6 mb-8'>
                    <div className='flex flex-col lg:flex-row gap-8'>
                        
                        {/* Car Image */}
                        <div className='lg:w-1/2'>
                            <div className='h-[300px] lg:h-[400px] rounded-lg overflow-hidden'>
                                <img 
                                    src={carData.image} 
                                    alt={carData.name}
                                    className='w-full h-full object-cover hover:scale-105 transition-transform duration-500'
                                />
                            </div>
                        </div>

                        {/* Car Details */}
                        <div className='lg:w-1/2 space-y-6'>
                            <div className='space-y-3'>
                                <h1 className='text-3xl lg:text-4xl font-bold text-gray-800 mb-2'>{carData.name}</h1>
                                <div className='text-xl font-semibold text-gray-800'>{carData.brand}</div>
                                <div className='text-2xl font-semibold text-indigo-600'>${carData.price}/day</div>
                            </div>

                            <div className='space-y-4'>
                                <div className='flex items-center gap-3'>
                                    <FaCar className='text-gray-600' />
                                    <span className='text-lg'>{carData.transmission}</span>
                                </div>
                                
                                <div className='grid grid-cols-2 gap-4 text-gray-700'>
                                    <div><span className='font-semibold'>Category:</span> {carData.category}</div>
                                    <div><span className='font-semibold'>Seats:</span> {carData.seatingCapacity}</div>
                                    <div><span className='font-semibold'>Fuel:</span> {carData.fuelType}</div>
                                </div>
                            </div>

                            <div>
                                <h3 className='text-xl font-semibold mb-3'>Features</h3>
                                <div className='flex flex-wrap gap-2'>
                                    {carData?.features?.map((feature, index) => (
                                        <div key={index} className='rounded-3xl py-2 px-4 bg-gray-200 text-sm hover:bg-indigo-100 transition-colors duration-300'>
                                            {feature}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Booking Form Section */}
                <div className='bg-white rounded-lg shadow-xl p-6'>
                    <h2 className='text-2xl font-bold text-gray-800 mb-6'>Booking Details</h2>
                    
                    <div className='grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8'>
                        
                        {/* Pickup Details */}
                        <div className='space-y-4'>
                            <h3 className='text-xl font-semibold text-gray-700 flex items-center gap-2'>
                                <FaMapMarkerAlt className='text-green-500' />
                                Pickup Details
                            </h3>
                            
                            <div className='space-y-4'>
                                <div>
                                    <label className='block text-sm font-medium text-gray-700 mb-2'>
                                        Pickup Location
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Enter pickup location"
                                        className='w-full p-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300'
                                        value={bookingData.pickupLocation}
                                        onChange={(e) => {handleInputChange('pickupLocation', e.target.value)}}
                                    />
                                </div>
                                
                                <div>
                                    <label className='block text-sm font-medium text-gray-700 mb-2'>
                                        <FaCalendarAlt className='inline mr-2' />
                                        Pickup Date
                                    </label>
                                    <input
                                        type="datetime-local"
                                        className='w-full p-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300'
                                        value={bookingData.startDate}
                                        onChange={(e) => handleInputChange('startDate', e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Dropoff Details */}
                        <div className='space-y-4'>
                            <h3 className='text-xl font-semibold text-gray-700 flex items-center gap-2'>
                                <FaMapMarkerAlt className='text-red-500' />
                                Dropoff Details
                            </h3>
                            
                            <div className='space-y-4'>
                                <div>
                                    <label className='block text-sm font-medium text-gray-700 mb-2'>
                                        Dropoff Location
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Enter dropoff location"
                                        className='w-full p-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300'
                                        value={bookingData.dropoffLocation}
                                        onChange={(e) => handleInputChange('dropoffLocation', e.target.value)}
                                    />
                                </div>
                                
                                <div>
                                    <label className='block text-sm font-medium text-gray-700 mb-2'>
                                        <FaCalendarAlt className='inline mr-2' />
                                        Dropoff Date
                                    </label>
                                    <input
                                        type="datetime-local"
                                        className='w-full p-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300'
                                        value={bookingData.endDate}
                                        onChange={(e) => handleInputChange('endDate', e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Price Summary */}
                    <div className='bg-gray-50 rounded-lg p-6 mb-6'>
                        <h3 className='text-xl font-semibold text-gray-800 mb-4'>Price Summary</h3>
                        <div className='space-y-2 text-gray-700'>
                            <div className='flex justify-between'>
                                <span>Daily Rate:</span>
                                <span>${carData.price}/day</span>
                            </div>
                            <div className='flex justify-between'>
                                <span>Duration:</span>
                                <span>{calculateDays()} day{calculateDays() > 1 ? 's' : ''}</span>
                            </div>
                            <hr className='my-3' />
                            <div className='flex justify-between text-xl font-bold text-indigo-600'>
                                <span>Total Price:</span>
                                <span>${totalPrice}</span>
                            </div>
                        </div>
                    </div>

                    {/* Confirm Booking Button */}
                    <button 
                        onClick={handleBooking}
                        className='w-full bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-4 px-6 rounded-lg transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg'
                    >
                        Confirm Booking
                    </button>
                </div>
            </div>
        </div>
    );
};


export default Booking;