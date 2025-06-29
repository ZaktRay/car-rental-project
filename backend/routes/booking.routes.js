const express = require('express');
const router = express.Router();
const {protect} = require('../middlewares/user.auth.middleware');


const { createBooking, getUserBookings, getBookingById, cancelBooking } = require('../controllers/booking.controller')


router.post('/create',protect,createBooking);
router.get('/user-bookings',protect,getUserBookings);
router.get('/:id',protect,getBookingById);
router.put('/cancel',protect,cancelBooking);


module.exports = router;