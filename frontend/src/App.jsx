import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/home'
import Cars from './pages/cars'
import Login from './pages/login'
import AdminLogin from './pages/adminLogin'
import Profile from './pages/profile'
import SignUp from './pages/signUp';
import Booking from './pages/booking';
import AdminDashboard from './pages/adminPages/adminDashboard';
import AdminCars from './pages/adminPages/adminCars'
import AdminSettings from './pages/adminPages/adminSettings';
import AdminBookings from './pages/adminPages/adminBookings';
import AdminReports from './pages/adminPages/adminReports';
import AdminUsers from './pages/adminPages/adminUsers';
import AdminProfile from './components/adminProfile';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>

        <Route path='/' element={<Home />} />
        <Route path='cars' element={<Cars />} />
        <Route path='/login' element={<ProtectedRoute><Login /></ProtectedRoute>} />
        <Route path='/signup' element={<ProtectedRoute><SignUp /></ProtectedRoute>} />
        <Route path='/admin-login' element={<ProtectedRoute><AdminLogin /></ProtectedRoute>} />
        <Route path='/profile' element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/booking/:id" element={<ProtectedRoute><Booking /></ProtectedRoute>} />
        <Route path='/admin' element={<ProtectedRoute><AdminProfile /></ProtectedRoute>}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/cars" element={<AdminCars/>} />
          <Route path="/admin/bookings" element={<AdminBookings />} />
          <Route path="/admin/users" element={<AdminUsers />} />
          <Route path="/admin/reports" element={<AdminReports />} />
          <Route path="/admin/settings" element={<AdminSettings />} />
        </Route>


      </Routes>
      <ToastContainer />
    </BrowserRouter>
  )
}

export default App
