import React, {useEffect, useState } from 'react';
import { FaUser, FaEnvelope, FaPhone, FaSearch, FaEye, FaUserSlash, FaUserCheck, FaFilter } from 'react-icons/fa';
import axios from 'axios';

const AdminUsers = () => {
  const backendURL = import.meta.env.VITE_BACKEND_URL;
 
  const [users, setUsers] = useState([]);

   useEffect(()=>{
    axios.get(`${backendURL}/admin/getusers`, {
            headers : {
                Authorization : `Bearer ${localStorage.getItem('token')}`
            }
        })
            .then(response => {
                console.log('Success:', response.data);
                setUsers(response.data.data);

            })
            .catch(error => {
                console.error('Error:', error.message);

            });
  },[])

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserDetails, setShowUserDetails] = useState(false);

  // Filter users based on search term and status
  const filteredUsers = users?.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.phone.includes(searchTerm);
    
    const matchesFilter = filterStatus === 'all' || 
                         (filterStatus === 'active' && !user.isBanned) ||
                         (filterStatus === 'banned' && user.isBanned);
    
    return matchesSearch && matchesFilter;
  });

  const handleStatusChange = (userId, newStatus) => {
    setUsers(users.map(user => 
      user.id === userId 
        ? { ...user, isBanned: newStatus === 'banned' }
        : user
    ));
  };

  const handleViewUser = (user) => {
    setSelectedUser(user);
    setShowUserDetails(true);
  };

  const getStatusColor = (isBanned) => {
    return isBanned 
      ? 'bg-red-100 text-red-800' 
      : 'bg-green-100 text-green-800';
  };

  const getStatusIcon = (isBanned) => {
    return isBanned ? <FaUserSlash /> : <FaUserCheck />;
  };

  return (
    <div className='w-full min-h-screen bg-gray-50 p-6'>
      <div className='w-full max-w-7xl mx-auto'>
        
        {/* Header */}
        <div className='mb-8'>
          <h1 className='text-3xl lg:text-4xl font-bold text-gray-800 mb-2'>User Management</h1>
          <p className='text-gray-600'>Manage all registered users and their account status.</p>
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
                placeholder="Search by name, email, or phone..."
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
                <option value="all">All Users</option>
                <option value="active">Active Users</option>
                <option value="banned">Banned Users</option>
              </select>
            </div>
          </div>

          {/* Stats */}
          <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-200'>
            <div className='text-center'>
              <div className='text-2xl font-bold text-indigo-600'>{users?.length}</div>
              <div className='text-sm text-gray-600'>Total Users</div>
            </div>
            <div className='text-center'>
              <div className='text-2xl font-bold text-green-600'>{users?.filter(u => !u.isBanned).length}</div>
              <div className='text-sm text-gray-600'>Active Users</div>
            </div>
            <div className='text-center'>
              <div className='text-2xl font-bold text-red-600'>{users?.filter(u => u.isBanned).length}</div>
              <div className='text-sm text-gray-600'>Banned Users</div>
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className='bg-white rounded-lg shadow-xl overflow-hidden'>
          <div className='p-6 border-b border-gray-200'>
            <h2 className='text-2xl font-bold text-gray-800 flex items-center gap-3'>
              <div className='w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center'>
                <FaUser className='text-white' />
              </div>
              Users ({filteredUsers?.length})
            </h2>
          </div>

          <div className='overflow-x-auto'>
            <table className='w-full'>
              <thead className='bg-gray-50'>
                <tr>
                  <th className='text-left py-4 px-6 font-semibold text-gray-700'>User</th>
                  <th className='text-left py-4 px-6 font-semibold text-gray-700'>Contact</th>
                  <th className='text-left py-4 px-6 font-semibold text-gray-700'>Join Date</th>
                  <th className='text-left py-4 px-6 font-semibold text-gray-700'>Bookings</th>
                  <th className='text-left py-4 px-6 font-semibold text-gray-700'>Status</th>
                  <th className='text-left py-4 px-6 font-semibold text-gray-700'>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers?.map((user) => (
                  <tr key={user.id} className='border-b border-gray-100 hover:bg-gray-50 transition-colors duration-200'>
                    
                    {/* User Info */}
                    <td className='py-4 px-6'>
                      <div className='flex items-center gap-3'>
                        <div className='w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center'>
                          <FaUser className='text-white text-sm' />
                        </div>
                        <div>
                          <div className='font-semibold text-gray-800'>{user.name}</div>
                          <div className='text-sm text-gray-600'>ID: {user.id}</div>
                        </div>
                      </div>
                    </td>

                    {/* Contact Info */}
                    <td className='py-4 px-6'>
                      <div className='space-y-1'>
                        <div className='flex items-center gap-2 text-sm text-gray-700'>
                          <FaEnvelope className='text-gray-400' />
                          {user.email}
                        </div>
                        <div className='flex items-center gap-2 text-sm text-gray-700'>
                          <FaPhone className='text-gray-400' />
                          {user.phone}
                        </div>
                      </div>
                    </td>

                    {/* Join Date */}
                    <td className='py-4 px-6'>
                      <div className='text-gray-700'>{new Date(user.joinDate).toLocaleDateString()}</div>
                    </td>

                    {/* Total Bookings */}
                    <td className='py-4 px-6'>
                      <div className='font-semibold text-gray-800'>{user.totalBookings}</div>
                    </td>

                    {/* Status */}
                    <td className='py-4 px-6'>
                      <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(user.isBanned)}`}>
                        {getStatusIcon(user.isBanned)}
                        {user.isBanned ? 'Banned' : 'Active'}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className='py-4 px-6'>
                      <div className='flex items-center gap-3'>
                        
                        {/* View Details Button */}
                        <button
                          onClick={() => handleViewUser(user)}
                          className='flex items-center gap-1 text-indigo-600 hover:text-indigo-800 font-medium transition-colors duration-300'
                        >
                          <FaEye />
                          View
                        </button>

                        {/* Status Dropdown */}
                        <select
                          value={user.isBanned ? 'banned' : 'active'}
                          onChange={(e) => handleStatusChange(user.id, e.target.value)}
                          className={`px-3 py-1 rounded-lg text-sm font-medium border-2 outline-none transition-all duration-300 ${
                            user.isBanned 
                              ? 'border-red-200 bg-red-50 text-red-700 focus:border-red-500' 
                              : 'border-green-200 bg-green-50 text-green-700 focus:border-green-500'
                          }`}
                        >
                          <option value="active">Active</option>
                          <option value="banned">Banned</option>
                        </select>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Empty State */}
            {filteredUsers?.length === 0 && (
              <div className='text-center py-12'>
                <FaUser className='mx-auto text-4xl text-gray-400 mb-4' />
                <h3 className='text-lg font-semibold text-gray-600 mb-2'>No users found</h3>
                <p className='text-gray-500'>Try adjusting your search or filter criteria.</p>
              </div>
            )}
          </div>
        </div>

        {/* User Details Modal */}
        {showUserDetails && selectedUser && (
          <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4'>
            <div className='bg-white rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto'>
              
              {/* Modal Header */}
              <div className='p-6 border-b border-gray-200'>
                <div className='flex items-center justify-between'>
                  <h2 className='text-2xl font-bold text-gray-800 flex items-center gap-3'>
                    <div className='w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center'>
                      <FaUser className='text-white' />
                    </div>
                    User Details
                  </h2>
                  <button
                    onClick={() => setShowUserDetails(false)}
                    className='text-gray-500 hover:text-gray-700 text-2xl transition-colors duration-300'
                  >
                    ×
                  </button>
                </div>
              </div>

              {/* Modal Content */}
              <div className='p-6 space-y-6'>
                
                {/* Basic Info */}
                <div className='bg-gray-50 rounded-lg p-6'>
                  <h3 className='text-lg font-semibold text-gray-800 mb-4'>Basic Information</h3>
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    <div>
                      <label className='block text-sm font-medium text-gray-600 mb-1'>Full Name</label>
                      <div className='text-gray-800 font-semibold'>{selectedUser.name}</div>
                    </div>
                    <div>
                      <label className='block text-sm font-medium text-gray-600 mb-1'>User ID</label>
                      <div className='text-gray-800 font-semibold'>#{selectedUser.id}</div>
                    </div>
                    <div>
                      <label className='block text-sm font-medium text-gray-600 mb-1'>Email Address</label>
                      <div className='text-gray-800'>{selectedUser.email}</div>
                    </div>
                    <div>
                      <label className='block text-sm font-medium text-gray-600 mb-1'>Phone Number</label>
                      <div className='text-gray-800'>{selectedUser.phone}</div>
                    </div>
                    <div>
                      <label className='block text-sm font-medium text-gray-600 mb-1'>Join Date</label>
                      <div className='text-gray-800'>{new Date(selectedUser.joinDate).toLocaleDateString()}</div>
                    </div>
                    <div>
                      <label className='block text-sm font-medium text-gray-600 mb-1'>Account Status</label>
                      <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedUser.isBanned)}`}>
                        {getStatusIcon(selectedUser.isBanned)}
                        {selectedUser.isBanned ? 'Banned' : 'Active'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Activity Stats */}
                <div className='bg-indigo-50 rounded-lg p-6'>
                  <h3 className='text-lg font-semibold text-gray-800 mb-4'>Activity Statistics</h3>
                  <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                    <div className='text-center'>
                      <div className='text-2xl font-bold text-indigo-600'>{selectedUser.totalBookings}</div>
                      <div className='text-sm text-gray-600'>Total Bookings</div>
                    </div>
                    <div className='text-center'>
                      <div className='text-2xl font-bold text-green-600'>
                        {Math.floor(Math.random() * 30) + 1}
                      </div>
                      <div className='text-sm text-gray-600'>Days Since Last Login</div>
                    </div>
                    <div className='text-center'>
                      <div className='text-2xl font-bold text-purple-600'>
                        ${(selectedUser.totalBookings * 150 + Math.random() * 500).toFixed(0)}
                      </div>
                      <div className='text-sm text-gray-600'>Total Spent</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className='p-6 border-t border-gray-200'>
                <button
                  onClick={() => setShowUserDetails(false)}
                  className='w-full bg-indigo-500 hover:bg-indigo-600 text-white py-3 px-6 rounded-lg transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg'
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

export default AdminUsers;