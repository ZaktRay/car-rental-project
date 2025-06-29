const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/admin.auth.middleware');
const { registerAdmin, loginAdmin, getProfile, updateProfile, changePassword } = require('../controllers/admin.controller');
const { addCar, getAllCars } = require('../controllers/car.controller');
const { updateBookingStatus, getAllBookings } = require('../controllers/booking.controller')
const { getUsers } = require('../controllers/user.controller')
const upload = require('../utils/multer')


router.post('/login', loginAdmin);
router.post('/register', registerAdmin);

router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);
router.put('/change-password', protect, changePassword);

router.post('/addcar', protect, upload.single('image'), addCar);
router.get('/getallcars', protect, getAllCars);

router.put('/updateBookingStatus', protect, updateBookingStatus);
router.get('/getbookings', protect, getAllBookings);

router.get('/getusers', protect, getUsers);

module.exports = router;