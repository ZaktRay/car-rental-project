import React, { useState, useEffect } from 'react';
import { FaCar, FaPlus, FaEye, FaEdit, FaTrash, FaTimes, FaUpload, FaSave, FaGasPump, FaCogs, FaUsers, FaCalendarAlt, FaDollarSign, FaTags, FaList, FaImage } from 'react-icons/fa';
import axios from 'axios';
import { toast } from 'react-toastify';

const AdminCars = () => {

  const backendURL = import.meta.env.VITE_BACKEND_URL;
  const [cars, setCars] = useState([]);

  useEffect(() => {
    axios.get(`${backendURL}/admin/getallcars`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
      .then(response => {
        console.log('Success:', response.data);
        setCars(response.data.data);

      })
      .catch(error => {
        console.error('Error:', error);

      });
  }, [])



  const [selectedCar, setSelectedCar] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newCar, setNewCar] = useState({
    name: '',
    model: '',
    brand: '',
    year: '',
    price: '',
    isAvailable: true,
    image: null,
    fuelType: '',
    transmission: '',
    seats: '',
    category: '',
    features: []
  });
  const [newFeature, setNewFeature] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');

  const handleStatusChange = (carId, newStatus) => {
    setCars(cars.map(car =>
      car.id === carId ? { ...car, isAvailable: newStatus === 'true' } : car
    ));
  };

  const handleViewDetails = (car) => {
    setSelectedCar(car);
    setShowDetailModal(true);
  };

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
        setNewCar({ ...newCar, image: e.target.result });
      };
      reader.readAsDataURL(file);
    }
  };


  const handleAddFeature = () => {
    if (newFeature.trim() && !newCar.features.includes(newFeature.trim())) {
      setNewCar({
        ...newCar,
        features: [...newCar.features, newFeature.trim()]
      });
      setNewFeature('');
    }
  };

  const handleRemoveFeature = (featureToRemove) => {
    setNewCar({
      ...newCar,
      features: newCar.features.filter(feature => feature !== featureToRemove)
    });
  };

  const getStatusColor = (isAvailable) => {
    return isAvailable
      ? 'bg-green-100 text-green-800'
      : 'bg-red-100 text-red-800';
  };


  function submit() {

    setShowAddModal(false);
    setSelectedFile(null);
    setImagePreview('');

    const data = new FormData();
    data.append('name', newCar.name);
    data.append('model', newCar.model);
    data.append('brand', newCar.brand);
    data.append('year', newCar.year);
    data.append('price', newCar.price);
    data.append('isAvailable', newCar.isAvailable);
    data.append('fuelType', newCar.fuelType);
    data.append('transmission', newCar.transmission);
    data.append('seats', newCar.seats);
    data.append('category', newCar.category);

    newCar.features.forEach((feature) => {
      data.append('features[]', feature);
    });

    if (selectedFile) {
    data.append('image', selectedFile);
  }


    axios.post(`${backendURL}/admin/addcar`, data,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        }
      })
      .then(response => {
        console.log(response.data);
        toast.success("Added Car Successfully");
        window.location.reload();
      })
      .catch(error => {
        console.error('Error:', error);
        toast.error("something went wrong");
      });

  }


  return (
    <div className='w-full min-h-screen bg-gray-50 p-6'>
      <div className='w-full max-w-7xl mx-auto'>

        {/* Header */}
        <div className='flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8'>
          <div>
            <h1 className='text-3xl lg:text-4xl font-bold text-gray-800 mb-2'>Car Management</h1>
            <p className='text-gray-600'>Manage your fleet of rental cars and their availability.</p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className='mt-4 lg:mt-0 flex items-center gap-2 bg-indigo-500 hover:bg-indigo-600 text-white px-6 py-3 rounded-lg transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg'
          >
            <FaPlus />
            Add New Car
          </button>
        </div>

        {/* Cars Table */}
        <div className='bg-white rounded-lg shadow-xl overflow-hidden'>
          <div className='overflow-x-auto'>
            <table className='w-full'>
              <thead className='bg-gradient-to-r from-indigo-50 to-purple-50'>
                <tr>
                  <th className='text-left py-4 px-6 font-semibold text-gray-700'>Car Details</th>
                  <th className='text-left py-4 px-6 font-semibold text-gray-700'>Year</th>
                  <th className='text-left py-4 px-6 font-semibold text-gray-700'>Price/Day</th>
                  <th className='text-left py-4 px-6 font-semibold text-gray-700'>Availability</th>
                  <th className='text-left py-4 px-6 font-semibold text-gray-700'>Actions</th>
                </tr>
              </thead>
              <tbody>
                {cars.map((car) => (
                  <tr key={car.id} className='border-b border-gray-100 hover:bg-gray-50 transition-colors duration-200'>
                    <td className='py-4 px-6'>
                      <div className='flex items-center gap-4'>
                        <div className='w-16 h-12 rounded-lg overflow-hidden'>
                          <img
                            src={car.image}
                            alt={car.name}
                            className='w-full h-full object-cover'
                          />
                        </div>
                        <div>
                          <div className='font-semibold text-gray-800'>{car.name}</div>
                          <div className='text-sm text-gray-600'>{car.brand} {car.model}</div>
                        </div>
                      </div>
                    </td>
                    <td className='py-4 px-6'>
                      <div className='text-gray-700'>{car.year}</div>
                    </td>
                    <td className='py-4 px-6'>
                      <div className='font-semibold text-indigo-600'>${car.price}</div>
                    </td>
                    <td className='py-4 px-6'>
                      <select
                        value={car.isAvailable.toString()}
                        onChange={(e) => handleStatusChange(car.id, e.target.value)}
                        className={`px-3 py-1 rounded-full text-xs font-medium border-0 outline-none cursor-pointer ${getStatusColor(car.isAvailable)}`}
                      >
                        <option value="true">Available</option>
                        <option value="false">Not Available</option>
                      </select>
                    </td>
                    <td className='py-4 px-6'>
                      <button
                        onClick={() => handleViewDetails(car)}
                        className='flex items-center gap-2 text-indigo-600 hover:text-indigo-800 font-medium transition-colors duration-300'
                      >
                        <FaEye />
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Car Details Modal */}
        {showDetailModal && selectedCar && (
          <div className='fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4'>
            <div className='bg-white rounded-lg shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto'>

              {/* Modal Header */}
              <div className='flex items-center justify-between p-6 border-b border-gray-200'>
                <h2 className='text-2xl font-bold text-gray-800 flex items-center gap-3'>
                  <div className='w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center'>
                    <FaCar className='text-white' />
                  </div>
                  {selectedCar.name}
                </h2>
                <button
                  onClick={() => setShowDetailModal(false)}
                  className='p-2 hover:bg-gray-100 rounded-lg transition-colors duration-300'
                >
                  <FaTimes className='text-gray-500' />
                </button>
              </div>

              {/* Modal Content */}
              <div className='p-6'>
                <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>

                  {/* Car Image */}
                  <div>
                    <div className='h-64 rounded-lg overflow-hidden mb-4'>
                      <img
                        src={selectedCar.image}
                        alt={selectedCar.name}
                        className='w-full h-full object-cover'
                      />
                    </div>
                    <div className={`inline-flex px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(selectedCar.isAvailable)}`}>
                      {selectedCar.isAvailable ? 'Available' : 'Not Available'}
                    </div>
                  </div>

                  {/* Car Details */}
                  <div className='space-y-6'>

                    {/* Basic Info */}
                    <div className='grid grid-cols-2 gap-4'>
                      <div className='flex items-center gap-3'>
                        <FaTags className='text-indigo-600' />
                        <div>
                          <div className='text-sm text-gray-600'>Brand</div>
                          <div className='font-semibold'>{selectedCar.brand}</div>
                        </div>
                      </div>
                      <div className='flex items-center gap-3'>
                        <FaCar className='text-green-600' />
                        <div>
                          <div className='text-sm text-gray-600'>Model</div>
                          <div className='font-semibold'>{selectedCar.model}</div>
                        </div>
                      </div>
                      <div className='flex items-center gap-3'>
                        <FaCalendarAlt className='text-blue-600' />
                        <div>
                          <div className='text-sm text-gray-600'>Year</div>
                          <div className='font-semibold'>{selectedCar.year}</div>
                        </div>
                      </div>
                      <div className='flex items-center gap-3'>
                        <FaDollarSign className='text-purple-600' />
                        <div>
                          <div className='text-sm text-gray-600'>Price/Day</div>
                          <div className='font-semibold'>${selectedCar.price}</div>
                        </div>
                      </div>
                    </div>

                    {/* Technical Details */}
                    <div className='grid grid-cols-2 gap-4'>
                      <div className='flex items-center gap-3'>
                        <FaGasPump className='text-red-600' />
                        <div>
                          <div className='text-sm text-gray-600'>Fuel Type</div>
                          <div className='font-semibold'>{selectedCar.fuelType}</div>
                        </div>
                      </div>
                      <div className='flex items-center gap-3'>
                        <FaCogs className='text-orange-600' />
                        <div>
                          <div className='text-sm text-gray-600'>Transmission</div>
                          <div className='font-semibold'>{selectedCar.transmission}</div>
                        </div>
                      </div>
                      <div className='flex items-center gap-3'>
                        <FaUsers className='text-teal-600' />
                        <div>
                          <div className='text-sm text-gray-600'>Seats</div>
                          <div className='font-semibold'>{selectedCar.seats}</div>
                        </div>
                      </div>
                      <div className='flex items-center gap-3'>
                        <FaList className='text-pink-600' />
                        <div>
                          <div className='text-sm text-gray-600'>Category</div>
                          <div className='font-semibold'>{selectedCar.category}</div>
                        </div>
                      </div>
                    </div>

                    {/* Features */}
                    <div>
                      <h3 className='text-lg font-semibold mb-3 text-gray-800'>Features</h3>
                      <div className='flex flex-wrap gap-2'>
                        {selectedCar.features.map((feature, index) => (
                          <div key={index} className='bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm'>
                            {feature}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Add Car Modal */}
        {showAddModal && (
          <div className='fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4'>
            <div className='bg-white rounded-lg shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto'>

              {/* Modal Header */}
              <div className='flex items-center justify-between p-6 border-b border-gray-200'>
                <h2 className='text-2xl font-bold text-gray-800 flex items-center gap-3'>
                  <div className='w-10 h-10 bg-gradient-to-r from-green-500 to-blue-600 rounded-full flex items-center justify-center'>
                    <FaPlus className='text-white' />
                  </div>
                  Add New Car
                </h2>
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    setSelectedFile(null);
                    setImagePreview('');
                  }}
                  className='p-2 hover:bg-gray-100 rounded-lg transition-colors duration-300'
                >
                  <FaTimes className='text-gray-500' />
                </button>
              </div>

              {/* Modal Content */}
              <div className='p-6'>
                <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>

                  {/* Basic Information */}
                  <div className='space-y-4'>
                    <h3 className='text-lg font-semibold text-gray-800 mb-4'>Basic Information</h3>

                    <div>
                      <label className='block text-sm font-medium text-gray-700 mb-2'>Car Name</label>
                      <input
                        type="text"
                        value={newCar.name}
                        onChange={(e) => setNewCar({ ...newCar, name: e.target.value })}
                        className='w-full p-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300'
                        placeholder="e.g., Toyota Camry"
                      />
                    </div>

                    <div className='grid grid-cols-2 gap-4'>
                      <div>
                        <label className='block text-sm font-medium text-gray-700 mb-2'>Brand</label>
                        <input
                          type="text"
                          value={newCar.brand}
                          onChange={(e) => setNewCar({ ...newCar, brand: e.target.value })}
                          className='w-full p-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300'
                          placeholder="e.g., Toyota"
                        />
                      </div>
                      <div>
                        <label className='block text-sm font-medium text-gray-700 mb-2'>Model</label>
                        <input
                          type="text"
                          value={newCar.model}
                          onChange={(e) => setNewCar({ ...newCar, model: e.target.value })}
                          className='w-full p-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300'
                          placeholder="e.g., Camry"
                        />
                      </div>
                    </div>

                    <div className='grid grid-cols-2 gap-4'>
                      <div>
                        <label className='block text-sm font-medium text-gray-700 mb-2'>Year</label>
                        <input
                          type="number"
                          value={newCar.year}
                          onChange={(e) => setNewCar({ ...newCar, year: e.target.value })}
                          className='w-full p-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300'
                          placeholder="2024"
                        />
                      </div>
                      <div>
                        <label className='block text-sm font-medium text-gray-700 mb-2'>Price per Day ($)</label>
                        <input
                          type="number"
                          value={newCar.price}
                          onChange={(e) => setNewCar({ ...newCar, price: e.target.value })}
                          className='w-full p-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300'
                          placeholder="75"
                        />
                      </div>
                    </div>

                    {/* Image Upload Section */}
                    <div>
                      <label className='block text-sm font-medium text-gray-700 mb-2'>Car Image</label>
                      <div className='space-y-4'>
                        {/* File Input */}
                        <div className='flex items-center justify-center w-full'>
                          <label className='flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors duration-300'>
                            <div className='flex flex-col items-center justify-center pt-5 pb-6'>
                              <FaUpload className='w-8 h-8 mb-4 text-gray-500' />
                              <p className='mb-2 text-sm text-gray-500'>
                                <span className='font-semibold'>Click to upload</span> or drag and drop
                              </p>
                              <p className='text-xs text-gray-500'>PNG, JPG or JPEG (MAX. 5MB)</p>
                            </div>
                            <input
                              type="file"
                              className='hidden'
                              accept="image/*"
                              onChange={handleFileSelect}
                            />
                            
                          </label>
                        </div>

                        {/* Image Preview */}
                        {imagePreview && (
                          <div className='relative'>
                            <div className='w-full h-40 rounded-lg overflow-hidden border border-gray-200'>
                              <img
                                src={imagePreview}
                                alt="Preview"
                                className='w-full h-full object-cover'
                              />
                            </div>
                            <button
                              onClick={() => {
                                setImagePreview('');
                                setSelectedFile(null);
                                setNewCar({ ...newCar, image: '' });
                              }}
                              className='absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-1 rounded-full transition-colors duration-300'
                            >
                              <FaTimes size={12} />
                            </button>
                          </div>
                        )}

                        {/* Selected File Info */}
                        {selectedFile && (
                          <div className='flex items-center gap-3 p-3 bg-indigo-50 rounded-lg border border-indigo-200'>
                            <FaImage className='text-indigo-600' />
                            <div className='flex-1'>
                              <p className='text-sm font-medium text-indigo-800'>{selectedFile.name}</p>
                              <p className='text-xs text-indigo-600'>{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Technical Details */}
                  <div className='space-y-4'>
                    <h3 className='text-lg font-semibold text-gray-800 mb-4'>Technical Details</h3>

                    <div className='grid grid-cols-2 gap-4'>
                      <div>
                        <label className='block text-sm font-medium text-gray-700 mb-2'>Fuel Type</label>
                        <select
                          value={newCar.fuelType}
                          onChange={(e) => setNewCar({ ...newCar, fuelType: e.target.value })}
                          className='w-full p-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300'
                        >
                          <option value="">Select Fuel Type</option>
                          <option value="Petrol">Petrol</option>
                          <option value="Diesel">Diesel</option>
                          <option value="Electric">Electric</option>
                          <option value="Hybrid">Hybrid</option>
                        </select>
                      </div>
                      <div>
                        <label className='block text-sm font-medium text-gray-700 mb-2'>Transmission</label>
                        <select
                          value={newCar.transmission}
                          onChange={(e) => setNewCar({ ...newCar, transmission: e.target.value })}
                          className='w-full p-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300'
                        >
                          <option value="">Select Transmission</option>
                          <option value="Automatic">Automatic</option>
                          <option value="Manual">Manual</option>
                        </select>
                      </div>
                    </div>

                    <div className='grid grid-cols-2 gap-4'>
                      <div>
                        <label className='block text-sm font-medium text-gray-700 mb-2'>Seats</label>
                        <input
                          type="number"
                          value={newCar.seats}
                          onChange={(e) => setNewCar({ ...newCar, seats: e.target.value })}
                          className='w-full p-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300'
                          placeholder="5"
                        />
                      </div>
                      <div>
                        <label className='block text-sm font-medium text-gray-700 mb-2'>Category</label>
                        <select
                          value={newCar.category}
                          onChange={(e) => setNewCar({ ...newCar, category: e.target.value })}
                          className='w-full p-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300'
                        >
                          <option value="">Select Category</option>
                          <option value="sedan">Sedan</option>
                          <option value="suv">SUV</option>
                          <option value="hatchback">Hatchback</option>
                          
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className='block text-sm font-medium text-gray-700 mb-2'>Availability</label>
                      <select
                        value={newCar.isAvailable.toString()}
                        onChange={(e) => setNewCar({ ...newCar, isAvailable: e.target.value === 'true' })}
                        className='w-full p-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300'
                      >
                        <option value="true">Available</option>
                        <option value="false">Not Available</option>
                      </select>
                    </div>

                    {/* Features */}
                    <div>
                      <label className='block text-sm font-medium text-gray-700 mb-2'>Features</label>
                      <div className='flex gap-2 mb-3'>
                        <input
                          type="text"
                          value={newFeature}
                          onChange={(e) => setNewFeature(e.target.value)}
                          className='flex-1 p-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300'
                          placeholder="Add a feature"
                          onKeyPress={(e) => e.key === 'Enter' && handleAddFeature()}
                        />
                        <button
                          onClick={handleAddFeature}
                          className='bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-3 rounded-lg transition-colors duration-300'
                        >
                          Add
                        </button>
                      </div>
                      <div className='flex flex-wrap gap-2'>
                        {newCar.features.map((feature, index) => (
                          <div key={index} className='bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm flex items-center gap-2'>
                            {feature}
                            <button
                              onClick={() => handleRemoveFeature(feature)}
                              className='text-indigo-600 hover:text-indigo-800'
                            >
                              <FaTimes size={12} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Modal Footer */}
                <div className='flex gap-4 mt-8 pt-6 border-t border-gray-200'>
                  <button
                    onClick={submit}
                    type='submit'
                    className='flex items-center gap-2 bg-indigo-500 hover:bg-indigo-600 text-white px-6 py-3 rounded-lg transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg'
                  >
                    <FaSave />
                    Add Car
                  </button>
                  <button
                    onClick={!showAddModal}
                    className='px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-300'
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminCars;