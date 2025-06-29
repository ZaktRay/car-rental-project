import React from 'react'
import { FaCar } from "react-icons/fa";
import { Link } from 'react-router-dom';


const CarCard = ({ name, transmission, features, image, id, brand, price }) => {
    return (
        <div className='w-[100%] rounded-xl shadow-xl overflow-hidden lg:w-[32%] lg:mx-2 cursor-pointer hover:-translate-y-2 transition-all duration-500 ease-in-out transform-gpu will-change-transform hover:shadow-2xl'>

            <div className='h-[220px] w-full overflow-hidden'>
                <div className='w-[20%] absolute right-3 top-2 text-center text-white p-[2px] bg-indigo-500/40 rounded-full'>{price}$/Day</div>
                <img src={image} alt="car image" />
                </div>

            <div className='px-5 py-6 space-y-5'>
                <div className=''>{brand}</div>
                <div className='font-bold text-2xl'>{name}</div>
                <div className='flex items-center gap-2'><FaCar />{transmission}</div>
                <div className='flex flex-wrap gap-2 py-4 h-[100px]'>
                    {features.map((feature, index) => (
                        <div key={index} className='rounded-3xl py-1 px-4 bg-gray-200 text-sm h-[50%]'>{feature}</div>
                    ))}
                </div>
                <Link to={`/booking/${id}`}>
                    <button className='text-center w-full rounded-lg bg-indigo-500 text-white py-4'> Book Now</button>
                </Link>

            </div>

        </div>
    )
}

export default CarCard
