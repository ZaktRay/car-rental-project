import React, { useState, useEffect } from 'react';
import { FaCalendarAlt, FaCar, FaUser, FaMapMarkerAlt, FaSearch, FaEye, FaFilter, FaDollarSign, FaCheck, FaTimes, FaClock } from 'react-icons/fa';
import axios from 'axios';

const AdminBookings = () => {
  const backendURL = import.meta.env.VITE_BACKEND_URL;
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${backendURL}/admin/getbookings`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        console.log('Success:', response.data);
        setBookings(response.data.data || []);
        setError(null);
      } catch (error) {
        console.error('Error:', error.message);
        setError('Failed to fetch bookings');
        setBookings([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [backendURL]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showBookingDetails, setShowBookingDetails] = useState(false);

  // Filter bookings based on search term and status
  const filteredBookings = bookings.filter(booking => {
    const customerName = booking?.userId?.name || '';
    const customerEmail = booking?.userId?.email || '';
    const carName = booking?.carId?.name || '';
    const bookingId = booking?._id || '';

    const matchesSearch = customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         bookingId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         carName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customerEmail.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterStatus === 'all' || booking.status === filterStatus;
    
    return matchesSearch && matchesFilter;
  });

  const handleStatusChange = async (bookingId, newStatus) => {
    try {
      // Update the booking status in the backend
      await axios.put(`${backendURL}/admin/updatebooking/${bookingId}`, 
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      // Update the local state
      setBookings(bookings.map(booking => 
        booking._id === bookingId 
          ? { ...booking, status: newStatus }
          : booking
      ));

      // Update selected booking if it's the one being changed
      if (selectedBooking && selectedBooking._id === bookingId) {
        setSelectedBooking({ ...selectedBooking, status: newStatus });
      }
    } catch (error) {
      console.error('Error updating booking status:', error);
      alert('Failed to update booking status');
    }
  };

  const handleViewBooking = (booking) => {
    setSelectedBooking(booking);
    setShowBookingDetails(true);
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'confirmed':
        return 'bg-blue-100 text-blue-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'active':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'confirmed':
        return <FaCheck />;
      case 'pending':
        return <FaClock />;
      case 'completed':
        return <FaCheck />;
      case 'cancelled':
        return <FaTimes />;
      case 'active':
        return <FaCar />;
      default:
        return <FaClock />;
    }
  };

  const formatDateTime = (dateTime) => {
    if (!dateTime) return 'N/A';
    return new Date(dateTime).toLocaleString();
  };

  const formatDate = (dateTime) => {
    if (!dateTime) return 'N/A';
    return new Date(dateTime).toLocaleDateString();
  };

  const calculateDuration = (startDate, endDate) => {
    if (!startDate || !endDate) return 1;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays || 1;
  };

  const calculateTotalRevenue = () => {
    return bookings.reduce((sum, booking) => {
      return sum + (booking.totalAmount || 0);
    }, 0);
  };

  if (loading) {
    return (
      <div className='w-full min-h-screen bg-gray-50 p-6 flex items-center justify-center'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4'></div>
          <p className='text-gray-600'>Loading bookings...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='w-full min-h-screen bg-gray-50 p-6 flex items-center justify-center'>
        <div className='text-center'>
          <p className='text-red-600 mb-4'>{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className='bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-lg'
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className='w-full min-h-screen bg-gray-50 p-6'>
      <div className='w-full max-w-7xl mx-auto'>
        
        {/* Header */}
        <div className='mb-8'>
          <h1 className='text-3xl lg:text-4xl font-bold text-gray-800 mb-2'>Booking Management</h1>
          <p className='text-gray-600'>Manage all car rental bookings and their status.</p>
        </div>

        {/* Search and Filter Section */}
        <div className='bg-white rounded-lg shadow-xl p-6 mb-8'>
          <div className='flex flex-col lg:flex-row gap-4'>
            
            {/* Search Bar */}
            <div className='flex-1 relative'>
              <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                <FaSearch className='text-gray-400' />
              </div>
              <input
                type="text"
                placeholder="Search by booking ID, customer name, car, or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className='w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300'
              />
            </div>

            {/* Status Filter */}
            <div className='relative'>
              <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                <FaFilter className='text-gray-400' />
              </div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className='pl-10 pr-8 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 bg-white'
              >
                <option value="all">All Bookings</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="active">Active</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          {/* Stats */}
          <div className='grid grid-cols-2 md:grid-cols-5 gap-4 mt-6 pt-6 border-t border-gray-200'>
            <div className='text-center'>
              <div className='text-2xl font-bold text-indigo-600'>{bookings.length}</div>
              <div className='text-sm text-gray-600'>Total Bookings</div>
            </div>
            <div className='text-center'>
              <div className='text-2xl font-bold text-yellow-600'>{bookings.filter(b => b.status === 'pending').length}</div>
              <div className='text-sm text-gray-600'>Pending</div>
            </div>
            <div className='text-center'>
              <div className='text-2xl font-bold text-blue-600'>{bookings.filter(b => b.status === 'confirmed').length}</div>
              <div className='text-sm text-gray-600'>Confirmed</div>
            </div>
            <div className='text-center'>
              <div className='text-2xl font-bold text-green-600'>{bookings.filter(b => b.status === 'completed').length}</div>
              <div className='text-sm text-gray-600'>Completed</div>
            </div>
            <div className='text-center'>
              <div className='text-2xl font-bold text-purple-600'>
                ${calculateTotalRevenue().toLocaleString()}
              </div>
              <div className='text-sm text-gray-600'>Total Revenue</div>
            </div>
          </div>
        </div>

        {/* Bookings Table */}
        <div className='bg-white rounded-lg shadow-xl overflow-hidden'>
          <div className='p-6 border-b border-gray-200'>
            <h2 className='text-2xl font-bold text-gray-800 flex items-center gap-3'>
              <div className='w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center'>
                <FaCalendarAlt className='text-white' />
              </div>
              Bookings ({filteredBookings.length})
            </h2>
          </div>

          <div className='overflow-x-auto'>
            <table className='w-full'>
              <thead className='bg-gray-50'>
                <tr>
                  <th className='text-left py-4 px-6 font-semibold text-gray-700'>Booking ID</th>
                  <th className='text-left py-4 px-6 font-semibold text-gray-700'>Customer</th>
                  <th className='text-left py-4 px-6 font-semibold text-gray-700'>Car Details</th>
                  <th className='text-left py-4 px-6 font-semibold text-gray-700'>Pickup Date</th>
                  <th className='text-left py-4 px-6 font-semibold text-gray-700'>Duration</th>
                  <th className='text-left py-4 px-6 font-semibold text-gray-700'>Amount</th>
                  <th className='text-left py-4 px-6 font-semibold text-gray-700'>Status</th>
                  <th className='text-left py-4 px-6 font-semibold text-gray-700'>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredBookings?.map((booking) => {
                  const duration = calculateDuration(booking.startDate, booking.endDate);
                  return (
                    <tr key={booking._id} className='border-b border-gray-100 hover:bg-gray-50 transition-colors duration-200'>
                      
                      {/* Booking ID */}
                      <td className='py-4 px-6'>
                        <div className='font-semibold text-indigo-600'>{booking._id?.slice(-8)}</div>
                        <div className='text-xs text-gray-500'>{formatDate(booking.createdAt)}</div>
                      </td>

                      {/* Customer Info */}
                      <td className='py-4 px-6'>
                        <div className='flex items-center gap-3'>
                          <div className='w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center'>
                            <FaUser className='text-white text-xs' />
                          </div>
                          <div>
                            <div className='font-semibold text-gray-800'>{booking.userId?.name || 'N/A'}</div>
                            <div className='text-sm text-gray-600'>{booking.userId?.email || 'N/A'}</div>
                          </div>
                        </div>
                      </td>

                      {/* Car Details */}
                      <td className='py-4 px-6'>
                        <div className='flex items-center gap-3'>
                          <div className='w-8 h-8 bg-gradient-to-r from-green-500 to-blue-600 rounded-full flex items-center justify-center'>
                            <FaCar className='text-white text-xs' />
                          </div>
                          <div>
                            <div className='font-semibold text-gray-800'>{booking.carId?.name || 'N/A'}</div>
                            <div className='text-sm text-gray-600'>{booking.carId?.brand || ''} {booking.carId?.model || ''}</div>
                          </div>
                        </div>
                      </td>

                      {/* Pickup Date */}
                      <td className='py-4 px-6'>
                        <div className='text-gray-700'>{formatDate(booking.startDate)}</div>
                        <div className='text-sm text-gray-500'>{booking.startDate ? new Date(booking.startDate).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : 'N/A'}</div>
                      </td>

                      {/* Duration */}
                      <td className='py-4 px-6'>
                        <div className='font-semibold text-gray-800'>{duration} day{duration > 1 ? 's' : ''}</div>
                      </td>

                      {/* Amount */}
                      <td className='py-4 px-6'>
                        <div className='font-bold text-green-600 flex items-center gap-1'>
                          <FaDollarSign className='text-sm' />
                          {booking.totalAmount || 0}
                        </div>
                      </td>

                      {/* Status */}
                      <td className='py-4 px-6'>
                        <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(booking.status)}`}>
                          {getStatusIcon(booking.status)}
                          {booking.status || 'pending'}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className='py-4 px-6'>
                        <div className='flex items-center gap-3'>
                          
                          {/* View Details Button */}
                          <button
                            onClick={() => handleViewBooking(booking)}
                            className='flex items-center gap-1 text-indigo-600 hover:text-indigo-800 font-medium transition-colors duration-300'
                          >
                            <FaEye />
                            View
                          </button>

                          {/* Status Dropdown */}
                          <select
                            value={booking.status || 'pending'}
                            onChange={(e) => handleStatusChange(booking._id, e.target.value)}
                            className={`px-2 py-1 rounded-lg text-xs font-medium border-2 outline-none transition-all duration-300 ${getStatusColor(booking.status)} border-current`}
                          >
                            <option value="pending">Pending</option>
                            <option value="confirmed">Confirmed</option>
                            <option value="active">Active</option>
                            <option value="completed">Completed</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {/* Empty State */}
            {filteredBookings.length === 0 && !loading && (
              <div className='text-center py-12'>
                <FaCalendarAlt className='mx-auto text-4xl text-gray-400 mb-4' />
                <h3 className='text-lg font-semibold text-gray-600 mb-2'>No bookings found</h3>
                <p className='text-gray-500'>
                  {bookings.length === 0 ? 'No bookings available yet.' : 'Try adjusting your search or filter criteria.'}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Booking Details Modal */}
        {showBookingDetails && selectedBooking && (
          <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4'>
            <div className='bg-white rounded-lg shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto'>
              
              {/* Modal Header */}
              <div className='p-6 border-b border-gray-200'>
                <div className='flex items-center justify-between'>
                  <h2 className='text-2xl font-bold text-gray-800 flex items-center gap-3'>
                    <div className='w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center'>
                      <FaCalendarAlt className='text-white' />
                    </div>
                    Booking Details - {selectedBooking._id?.slice(-8)}
                  </h2>
                  <button
                    onClick={() => setShowBookingDetails(false)}
                    className='text-gray-500 hover:text-gray-700 text-2xl transition-colors duration-300'
                  >
                    ×
                  </button>
                </div>
              </div>

              {/* Modal Content */}
              <div className='p-6 space-y-6'>
                
                {/* Customer Information */}
                <div className='bg-blue-50 rounded-lg p-6'>
                  <h3 className='text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2'>
                    <FaUser className='text-blue-600' />
                    Customer Information
                  </h3>
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    <div>
                      <label className='block text-sm font-medium text-gray-600 mb-1'>Full Name</label>
                      <div className='text-gray-800 font-semibold'>{selectedBooking.userId?.name || 'N/A'}</div>
                    </div>
                    <div>
                      <label className='block text-sm font-medium text-gray-600 mb-1'>Email Address</label>
                      <div className='text-gray-800'>{selectedBooking.userId?.email || 'N/A'}</div>
                    </div>
                    <div>
                      <label className='block text-sm font-medium text-gray-600 mb-1'>Phone Number</label>
                      <div className='text-gray-800'>{selectedBooking.userId?.phone || 'N/A'}</div>
                    </div>
                    <div>
                      <label className='block text-sm font-medium text-gray-600 mb-1'>Booking Date</label>
                      <div className='text-gray-800'>{formatDateTime(selectedBooking.createdAt)}</div>
                    </div>
                  </div>
                </div>

                {/* Car Information */}
                <div className='bg-green-50 rounded-lg p-6'>
                  <h3 className='text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2'>
                    <FaCar className='text-green-600' />
                    Car Information
                  </h3>
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    <div>
                      <label className='block text-sm font-medium text-gray-600 mb-1'>Car Name</label>
                      <div className='text-gray-800 font-semibold'>{selectedBooking.carId?.name || 'N/A'}</div>
                    </div>
                    <div>
                      <label className='block text-sm font-medium text-gray-600 mb-1'>Brand & Model</label>
                      <div className='text-gray-800'>{selectedBooking.carId?.brand || ''} {selectedBooking.carId?.model || ''}</div>
                    </div>
                  </div>
                </div>

                {/* Rental Details */}
                <div className='bg-purple-50 rounded-lg p-6'>
                  <h3 className='text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2'>
                    <FaMapMarkerAlt className='text-purple-600' />
                    Rental Details
                  </h3>
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    <div>
                      <label className='block text-sm font-medium text-gray-600 mb-1'>Pickup Location</label>
                      <div className='text-gray-800 font-semibold'>{selectedBooking.pickupLocation || 'N/A'}</div>
                    </div>
                    <div>
                      <label className='block text-sm font-medium text-gray-600 mb-1'>Dropoff Location</label>
                      <div className='text-gray-800 font-semibold'>{selectedBooking.dropoffLocation || 'N/A'}</div>
                    </div>
                    <div>
                      <label className='block text-sm font-medium text-gray-600 mb-1'>Start Date & Time</label>
                      <div className='text-gray-800'>{formatDateTime(selectedBooking.startDate)}</div>
                    </div>
                    <div>
                      <label className='block text-sm font-medium text-gray-600 mb-1'>End Date & Time</label>
                      <div className='text-gray-800'>{formatDateTime(selectedBooking.endDate)}</div>
                    </div>
                    <div>
                      <label className='block text-sm font-medium text-gray-600 mb-1'>Duration</label>
                      <div className='text-gray-800 font-semibold'>
                        {calculateDuration(selectedBooking.startDate, selectedBooking.endDate)} day
                        {calculateDuration(selectedBooking.startDate, selectedBooking.endDate) > 1 ? 's' : ''}
                      </div>
                    </div>
                    <div>
                      <label className='block text-sm font-medium text-gray-600 mb-1'>Status</label>
                      <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(selectedBooking.status)}`}>
                        {getStatusIcon(selectedBooking.status)}
                        {selectedBooking.status || 'pending'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Payment Information */}
                <div className='bg-yellow-50 rounded-lg p-6'>
                  <h3 className='text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2'>
                    <FaDollarSign className='text-yellow-600' />
                    Payment Information
                  </h3>
                  <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                    <div className='text-center'>
                      <div className='text-2xl font-bold text-green-600'>${selectedBooking.totalAmount || 0}</div>
                      <div className='text-sm text-gray-600'>Total Amount</div>
                    </div>
                    <div className='text-center'>
                      <div className='text-2xl font-bold text-blue-600'>
                        ${selectedBooking.totalAmount && calculateDuration(selectedBooking.startDate, selectedBooking.endDate) 
                          ? (selectedBooking.totalAmount / calculateDuration(selectedBooking.startDate, selectedBooking.endDate)).toFixed(0) 
                          : '0'}
                      </div>
                      <div className='text-sm text-gray-600'>Per Day</div>
                    </div>
                    <div className='text-center'>
                      <div className='text-2xl font-bold text-purple-600'>
                        {selectedBooking.paymentStatus || 'Paid'}
                      </div>
                      <div className='text-sm text-gray-600'>Payment Status</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className='p-6 border-t border-gray-200 flex gap-4'>
                <select
                  value={selectedBooking.status || 'pending'}
                  onChange={(e) => {
                    handleStatusChange(selectedBooking._id, e.target.value);
                    setSelectedBooking({...selectedBooking, status: e.target.value});
                  }}
                  className={`px-4 py-2 rounded-lg font-medium border-2 outline-none transition-all duration-300 ${getStatusColor(selectedBooking.status)} border-current`}
                >
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="active">Active</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
                <button
                  onClick={() => setShowBookingDetails(false)}
                  className='flex-1 bg-indigo-500 hover:bg-indigo-600 text-white py-3 px-6 rounded-lg transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg'
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminBookings;