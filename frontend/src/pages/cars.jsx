import React, { useEffect, useState } from 'react'
import { IoIosSearch } from "react-icons/io";
import CarCard from '../components/CarCard';
import axios from 'axios';


const Cars = () => {
    const backendURL = import.meta.env.VITE_BACKEND_URL;
    const [carData,setCarData] = useState({});
    const [searchData,setSearchData] = useState({
        search : "",
        priceRange : "",
        category : "",
        sortBy : 'name',
        page : 1,
        limit : 12
    });

    useEffect(()=>{
        axios.get(`${backendURL}/car`, {
            params : {
                ...searchData
            }
        })
            .then(response => {
                console.log('Success:', response.data);
                setCarData({...response.data.cars});
                
            })
            .catch(error => {
                console.error('Error:', error.message);

            });
    },[searchData])

    return (
        <div className='w-full flex flex-col justify-center items-center'>
            <h1 className='mx-auto py-6 text-4xl font-bold text-center px-4'>Discover Your Perfect Ride</h1>

            <div className='p-6 w-[95%] shadow-lg my-4 rounded-lg space-y-5 lg:w-[80%]'>

                <div className='flex bg-white rounded-md items-center px-2 gap-2 ring-1 ring-gray-200 focus-within:ring-1 focus-within:ring-emerald-500'>
                    <IoIosSearch size={25} className='text-gray-400' />
                    <input type="text" placeholder='Search your dream car' className='w-[100%] h-[50px] outline-none' onChange={(e)=>setSearchData({...searchData , search : e.target.value })} />
                </div>


                <div className='flex gap-4 flex-wrap'>

                    <div className='gap-4'>
                        <select className='p-2 border rounded-md outline-none' onChange={(e)=>{setSearchData({...searchData, priceRange : e.target.value})}}>
                            <option value="">All prices</option>
                            <option value="under50">Under 50$</option>
                            <option value="50to100">50$-100$</option>
                            <option value="over100">Above 100$</option>
                        </select>
                    </div>

                    <div className='gap-4'>
                        <select className='p-2 border rounded-md outline-none' onChange={(e)=>{setSearchData({...searchData, category : e.target.value})}}>
                            <option value="">All Categories</option>
                            <option value="sedan">Sedan</option>
                            <option value="suv">SUV</option>
                            <option value="hatchback">Hatchback</option>
                           
                        </select>
                    </div>

                    <div className='gap-4'>
                        <select className='p-2 border rounded-md outline-none' onChange={(e)=>{setSearchData({...searchData, priceRange : e.target.value})}}>
                            <option value="">Sort by Name</option>
                            <option value="price-low">Price : Low to High</option>
                            <option value="price-high">Price : High to Low</option>
                        </select>
                    </div>
                </div>
            </div>

            {/*Car section*/}
            <div className='w-[95%] flex flex-wrap gap-y-7 lg:w-[80%] my-6'>

                {
                    Object.values(carData).map((car)=>{
                        return <CarCard key={car._id || car.name} name={car.name} transmission={car.transmission} features={car.features} image={car.image} id={car.id} brand = {car.brand} price={car.price}/>
                    })
                }

            </div>

        </div>
    )
}

export default Cars
