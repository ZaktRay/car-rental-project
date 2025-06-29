import React, { useEffect,useState } from 'react';
import { FaUsers, FaCar, FaCalendarCheck, FaDollarSign, FaEye } from 'react-icons/fa';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import axios from 'axios';
import { Link } from 'react-router-dom';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const AdminDashboard = () => {
  const backendURL = import.meta.env.VITE_BACKEND_URL;
  const [bookingData,setBookingData] = useState({});
  useEffect(()=>{
    axios.get(`${backendURL}/admin/getbookings`, {
            headers : {
                Authorization : `Bearer ${localStorage.getItem('token')}`
            }
        })
            .then(response => {
                console.log('Success:', response.data);
                setBookingData(response.data.data);

            })
            .catch(error => {
                console.error('Error:', error.message);

            });
  },[])


  if (!bookingData || bookingData.length === 0) {
  return <div>No bookings found</div>;
}

  const dashboardStats = {
    totalUsers: 1247,
    totalCars: 89,
    totalBookings: 342,
    monthlyRevenue: 28450
  };

  // Sample data for revenue chart (last 3 months)
  const revenueData = {
    labels: ['October', 'November', 'December'],
    datasets: [
      {
        label: 'Monthly Revenue ($)',
        data: [22300, 25800, 28450],
        borderColor: 'rgb(99, 102, 241)',
        backgroundColor: 'rgba(99, 102, 241, 0.1)',
        borderWidth: 3,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: 'rgb(99, 102, 241)',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 6,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          font: {
            size: 14,
            weight: 'bold'
          }
        }
      },
      title: {
        display: true,
        text: 'Revenue Trend - Last 3 Months',
        font: {
          size: 18,
          weight: 'bold'
        },
        color: '#374151'
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value) {
            return '$' + value.toLocaleString();
          }
        }
      }
    }
  };


  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className='w-full min-h-screen bg-gray-50 p-6'>
      <div className='w-full max-w-7xl mx-auto'>
        
        {/* Header */}
        <div className='mb-8'>
          <h1 className='text-3xl text-center lg:text-left lg:text-4xl font-bold text-gray-800 mb-2'>Admin Dashboard</h1>
          <p className='text-gray-600'>Welcome back! Here's what's happening with your car rental business.</p>
        </div>

        {/* Dashboard Stats Cards */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8'>
          
          {/* Total Users Card */}
          <div className='bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-300'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm font-medium text-gray-600 mb-1'>Total Users</p>
                <p className='text-3xl font-bold text-gray-800'>{dashboardStats.totalUsers.toLocaleString()}</p>
              </div>
              <div className='bg-blue-100 p-3 rounded-full'>
                <FaUsers className='text-2xl text-blue-600' />
              </div>
            </div>
          </div>

          {/* Total Cars Card */}
          <div className='bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-300'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm font-medium text-gray-600 mb-1'>Total Cars</p>
                <p className='text-3xl font-bold text-gray-800'>{dashboardStats.totalCars}</p>
              </div>
              <div className='bg-green-100 p-3 rounded-full'>
                <FaCar className='text-2xl text-green-600' />
              </div>
            </div>
          </div>

          {/* Total Bookings Card */}
          <div className='bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-300'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm font-medium text-gray-600 mb-1'>Total Bookings</p>
                <p className='text-3xl font-bold text-gray-800'>{dashboardStats.totalBookings}</p>
              </div>
              <div className='bg-purple-100 p-3 rounded-full'>
                <FaCalendarCheck className='text-2xl text-purple-600' />
              </div>
            </div>
          </div>

          {/* Monthly Revenue Card */}
          <div className='bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-300'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm font-medium text-gray-600 mb-1'>Monthly Revenue</p>
                <p className='text-3xl font-bold text-gray-800'>${dashboardStats.monthlyRevenue.toLocaleString()}</p>
              </div>
              <div className='bg-indigo-100 p-3 rounded-full'>
                <FaDollarSign className='text-2xl text-indigo-600' />
              </div>
            </div>
          </div>
        </div>

        {/* Revenue Chart */}
        <div className='bg-white rounded-lg shadow-lg p-6 mb-8'>
          <div className='h-[400px]'>
            <Line data={revenueData} options={chartOptions} />
          </div>
        </div>

        {/* Recent Bookings Table */}
        <div className='bg-white rounded-lg shadow-lg p-6'>
          <div className='flex items-center justify-between mb-6'>
            <h2 className='text-2xl font-bold text-gray-800'>Recent Bookings</h2>
            <Link to="/admin/bookings">
            <button className='flex items-center gap-2 text-indigo-600 hover:text-indigo-800 font-medium transition-colors duration-300'>
              <FaEye />
              View All
            </button>
            </Link>
            
          </div>

          <div className='overflow-x-auto'>
            <table className='w-full'>
              <thead>
                <tr className='border-b border-gray-200'>
                  <th className='text-left py-3 px-4 font-semibold text-gray-700'>Customer Name</th>
                  <th className='text-left py-3 px-4 font-semibold text-gray-700'>Car Booked</th>
                  <th className='text-left py-3 px-4 font-semibold text-gray-700'>Amount</th>
                  <th className='text-left py-3 px-4 font-semibold text-gray-700'>Status</th>
                  <th className='text-left py-3 px-4 font-semibold text-gray-700'>Booking Date</th>
                </tr>
              </thead>
              <tbody>
                {Object.values(bookingData)?.map((booking) => (
                  <tr key={booking._id} className='border-b border-gray-100 hover:bg-gray-50 transition-colors duration-200'>
                    <td className='py-4 px-4'>
                      <div className='font-medium text-gray-800'>{booking.userId?.name}</div>
                    </td>
                    <td className='py-4 px-4'>
                      <div className='text-gray-700'>{booking.carId?.brand}</div>
                    </td>
                    <td className='py-4 px-4'>
                      <div className='font-semibold text-gray-800'>${booking.totalAmount}</div>
                    </td>
                    <td className='py-4 px-4'>
                      <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(booking.status)}`}>
                        {booking.status}
                      </span>
                    </td>
                    <td className='py-4 px-4'>
                      <div className='text-gray-600'>{new Date(booking.startDate).toLocaleDateString()}</div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;