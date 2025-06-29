import React, { useState } from 'react';
import { FaUser, FaEnvelope, FaPhone, FaLock, FaEye, FaEyeSlash, FaSave, FaEdit } from 'react-icons/fa';
import axios from 'axios';

const AdminSettings = () => {
  const [formData, setFormData] = useState({
    email: 'admin@carrental.com',
    phone: '+1 (555) 123-4567',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });

  const [isEditing, setIsEditing] = useState({
    email: false,
    phone: false,
    password: false
  });

  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');

  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' });
    }
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords({ ...showPasswords, [field]: !showPasswords[field] });
  };

  const toggleEdit = (section) => {
    setIsEditing({ ...isEditing, [section]: !isEditing[section] });
    setErrors({});
  };

  const validateForm = () => {
    const newErrors = {};

    // Email validation
    if (isEditing.email && !formData.email) {
      newErrors.email = 'Email is required';
    } else if (isEditing.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Phone validation
    if (isEditing.phone && !formData.phone) {
      newErrors.phone = 'Phone number is required';
    }

    // Password validation
    if (isEditing.password) {
      if (!formData.currentPassword) {
        newErrors.currentPassword = 'Current password is required';
      }
      if (!formData.newPassword) {
        newErrors.newPassword = 'New password is required';
      } else if (formData.newPassword.length < 8) {
        newErrors.newPassword = 'Password must be at least 8 characters long';
      }
      if (formData.newPassword !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = (section) => {
    if (validateForm()) {
      // Simulate API call
      setSuccessMessage(`${section.charAt(0).toUpperCase() + section.slice(1)} updated successfully!`);
      setIsEditing({ ...isEditing, [section]: false });
      
      // Clear password fields after successful update
      if (section === 'password') {
        setFormData({
          ...formData,
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
      }

      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(''), 3000);
    }
  };

  const handleCancel = (section) => {
    setIsEditing({ ...isEditing, [section]: false });
    setErrors({});
    
    // Reset form data if canceling password change
    if (section === 'password') {
      setFormData({
        ...formData,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    }
  };

  return (
    <div className='w-full min-h-screen bg-gray-50 p-6'>
      <div className='w-full max-w-4xl mx-auto'>
        
        {/* Header */}
        <div className='mb-8'>
          <h1 className='text-3xl lg:text-4xl font-bold text-gray-800 mb-2'>Account Settings</h1>
          <p className='text-gray-600'>Manage your account information and security settings.</p>
        </div>

        {/* Success Message */}
        {successMessage && (
          <div className='mb-6 p-4 bg-green-100 border border-green-200 text-green-800 rounded-lg'>
            {successMessage}
          </div>
        )}

        {/* Profile Information Section */}
        <div className='bg-white rounded-lg shadow-xl p-6 mb-6'>
          <div className='flex items-center justify-between mb-6'>
            <h2 className='text-2xl font-bold text-gray-800 flex items-center gap-3'>
              <div className='w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center'>
                <FaUser className='text-white' />
              </div>
              Profile Information
            </h2>
          </div>

          <div className='space-y-6'>
            
            {/* Email Section */}
            <div className='border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow duration-300'>
              <div className='flex items-center justify-between mb-4'>
                <div className='flex items-center gap-3'>
                  <div className='w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center'>
                    <FaEnvelope className='text-blue-600' />
                  </div>
                  <h3 className='text-lg font-semibold text-gray-800'>Email Address</h3>
                </div>
                {!isEditing.email && (
                  <button
                    onClick={() => toggleEdit('email')}
                    className='flex items-center gap-2 text-indigo-600 hover:text-indigo-800 font-medium transition-colors duration-300'
                  >
                    <FaEdit />
                    Edit
                  </button>
                )}
              </div>

              {isEditing.email ? (
                <div className='space-y-4'>
                  <div>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className={`w-full p-3 border rounded-lg outline-none transition-all duration-300 ${
                        errors.email ? 'border-red-500 focus:ring-2 focus:ring-red-200' : 'border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent'
                      }`}
                      placeholder="Enter your email address"
                    />
                    {errors.email && <p className='text-red-500 text-sm mt-1'>{errors.email}</p>}
                  </div>
                  <div className='flex gap-3'>
                    <button
                      onClick={() => handleSave('email')}
                      className='flex items-center gap-2 bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-lg transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg'
                    >
                      <FaSave />
                      Save
                    </button>
                    <button
                      onClick={() => handleCancel('email')}
                      className='px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-300'
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <p className='text-gray-700 text-lg'>{formData.email}</p>
              )}
            </div>

            {/* Phone Section */}
            <div className='border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow duration-300'>
              <div className='flex items-center justify-between mb-4'>
                <div className='flex items-center gap-3'>
                  <div className='w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center'>
                    <FaPhone className='text-green-600' />
                  </div>
                  <h3 className='text-lg font-semibold text-gray-800'>Phone Number</h3>
                </div>
                {!isEditing.phone && (
                  <button
                    onClick={() => toggleEdit('phone')}
                    className='flex items-center gap-2 text-indigo-600 hover:text-indigo-800 font-medium transition-colors duration-300'
                  >
                    <FaEdit />
                    Edit
                  </button>
                )}
              </div>

              {isEditing.phone ? (
                <div className='space-y-4'>
                  <div>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className={`w-full p-3 border rounded-lg outline-none transition-all duration-300 ${
                        errors.phone ? 'border-red-500 focus:ring-2 focus:ring-red-200' : 'border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent'
                      }`}
                      placeholder="Enter your phone number"
                    />
                    {errors.phone && <p className='text-red-500 text-sm mt-1'>{errors.phone}</p>}
                  </div>
                  <div className='flex gap-3'>
                    <button
                      onClick={() => handleSave('phone')}
                      className='flex items-center gap-2 bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-lg transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg'
                    >
                      <FaSave />
                      Save
                    </button>
                    <button
                      onClick={() => handleCancel('phone')}
                      className='px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-300'
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <p className='text-gray-700 text-lg'>{formData.phone}</p>
              )}
            </div>
          </div>
        </div>

        {/* Security Settings Section */}
        <div className='bg-white rounded-lg shadow-xl p-6'>
          <div className='flex items-center justify-between mb-6'>
            <h2 className='text-2xl font-bold text-gray-800 flex items-center gap-3'>
              <div className='w-10 h-10 bg-gradient-to-r from-red-500 to-pink-600 rounded-full flex items-center justify-center'>
                <FaLock className='text-white' />
              </div>
              Security Settings
            </h2>
          </div>

          {/* Password Section */}
          <div className='border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow duration-300'>
            <div className='flex items-center justify-between mb-4'>
              <div className='flex items-center gap-3'>
                <div className='w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center'>
                  <FaLock className='text-red-600' />
                </div>
                <h3 className='text-lg font-semibold text-gray-800'>Change Password</h3>
              </div>
              {!isEditing.password && (
                <button
                  onClick={() => toggleEdit('password')}
                  className='flex items-center gap-2 text-indigo-600 hover:text-indigo-800 font-medium transition-colors duration-300'
                >
                  <FaEdit />
                  Change
                </button>
              )}
            </div>

            {isEditing.password ? (
              <div className='space-y-4'>
                {/* Current Password */}
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>Current Password</label>
                  <div className='relative'>
                    <input
                      type={showPasswords.current ? "text" : "password"}
                      value={formData.currentPassword}
                      onChange={(e) => handleInputChange('currentPassword', e.target.value)}
                      className={`w-full p-3 pr-12 border rounded-lg outline-none transition-all duration-300 ${
                        errors.currentPassword ? 'border-red-500 focus:ring-2 focus:ring-red-200' : 'border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent'
                      }`}
                      placeholder="Enter your current password"
                    />
                    <button
                      type="button"
                      onClick={() => togglePasswordVisibility('current')}
                      className='absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700'
                    >
                      {showPasswords.current ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                  {errors.currentPassword && <p className='text-red-500 text-sm mt-1'>{errors.currentPassword}</p>}
                </div>

                {/* New Password */}
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>New Password</label>
                  <div className='relative'>
                    <input
                      type={showPasswords.new ? "text" : "password"}
                      value={formData.newPassword}
                      onChange={(e) => handleInputChange('newPassword', e.target.value)}
                      className={`w-full p-3 pr-12 border rounded-lg outline-none transition-all duration-300 ${
                        errors.newPassword ? 'border-red-500 focus:ring-2 focus:ring-red-200' : 'border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent'
                      }`}
                      placeholder="Enter your new password"
                    />
                    <button
                      type="button"
                      onClick={() => togglePasswordVisibility('new')}
                      className='absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700'
                    >
                      {showPasswords.new ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                  {errors.newPassword && <p className='text-red-500 text-sm mt-1'>{errors.newPassword}</p>}
                </div>

                {/* Confirm Password */}
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>Confirm New Password</label>
                  <div className='relative'>
                    <input
                      type={showPasswords.confirm ? "text" : "password"}
                      value={formData.confirmPassword}
                      onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                      className={`w-full p-3 pr-12 border rounded-lg outline-none transition-all duration-300 ${
                        errors.confirmPassword ? 'border-red-500 focus:ring-2 focus:ring-red-200' : 'border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent'
                      }`}
                      placeholder="Confirm your new password"
                    />
                    <button
                      type="button"
                      onClick={() => togglePasswordVisibility('confirm')}
                      className='absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700'
                    >
                      {showPasswords.confirm ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                  {errors.confirmPassword && <p className='text-red-500 text-sm mt-1'>{errors.confirmPassword}</p>}
                </div>

                <div className='flex gap-3 pt-2'>
                  <button
                    onClick={() => handleSave('password')}
                    className='flex items-center gap-2 bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-lg transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg'
                  >
                    <FaSave />
                    Update Password
                  </button>
                  <button
                    onClick={() => handleCancel('password')}
                    className='px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-300'
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <p className='text-gray-700'>••••••••••••</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;