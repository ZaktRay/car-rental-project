const Booking = require('../models/booking.model');
const Car = require('../models/car.model');

const createBooking = async (req, res) => {
    try {
        const {
            carId,
            startDate,
            endDate,
            pickupTime,
            dropoffTime,
            pickupLocation,
            dropoffLocation,
            totalAmount
        } = req.body

        const userId = req.user.id;

        const start = new Date(startDate);
        const end = new Date(endDate);

        if (isNaN(start.getTime()) || isNaN(end.getTime())) {
            return res.status(400).json({
                success: false,
                message: 'Invalid date format'
            })
        }

        if (start > end) {
            return res.status(400).json({
                success: false,
                message: "Start date must be before end date"
            })
            
        }

        const car = await Car.findById(carId)
        if (!car) {
            return res.status(404).json({
                success: false,
                message: 'Car not found'
            })
        }

        if (!car.isAvailable) {
            return res.status(400).json({
                success: false,
                message: 'Car is not available for rental'
            })
        }

        const existingBooking = await Booking.findOne({
            carId,
            status: { $nin: ['cancelled', 'completed'] },
            $or: [
                {
                    startDate: { $lte: end },
                    endDate: { $gte: start }
                }
            ]
        })
        if (existingBooking) {
            return res.status(400).json({
                success: false,
                message: 'Car is already booked.'
            })
        }

        const booking = await Booking.create({
            carId,
            userId,
            startDate,
            endDate,
            pickupTime,
            dropoffTime,
            pickupLocation,
            dropoffLocation,
            totalAmount,
            status: 'pending'
        });

        res.status(201).json({
            success: true,
            data: {
                _id: booking._id,
                carId: booking.carId,
                userId: booking.userId,
                startDate: booking.startDate,
                endDate: booking.endDate,
                totalAmount: booking.totalAmount,
                status: booking.status
            }
        })


    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
}


const updateBookingStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const validStatus = ["pending", "completed", "cancelled", "confirmed"];

        if (!validStatus.includes(status)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid status'
            })
        }

        const booking = await Booking.findByIdAndUpdate(id, { status }, { new: true });
        res.json({
            success: true,
            data: booking
        })
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }

}


const getUserBookings = async (req, res) => {
    try {
        if (!req.user || !req.user.id) {
            return res.status(401).json({
                success: false,
                message: 'User is not authed'
            })
        }

        const userId = req.user.id;

        const bookings = await Booking.find({ userId })
            .populate({
                path: 'carId',
                select: 'name brand model year price image fuelType transmission seats features'
            })

        const formattedBooking = bookings.map(booking => ({
            _id: booking._id,
            carId: booking.carId,
            userId: booking.userId,
            startDate: booking.startDate,
            endDate: booking.endDate,
            totalAmount: booking.totalAmount,
            status: booking.status
        }))

        res.json({
            success: true,
            data: formattedBooking
        })

    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
}


const getBookingById = async (req, res) => {
    try {
        const id  = req.params.id;
        const booking = await Booking.findOne(id).populate({
            path: 'carId',
            select: 'name brand model year price image fuelType transmission seats features'
        });

        if (!booking) {
            res.status(404).json({
                success: false,
                message: "no booking found with the given id"
            })
        }


        res.json({
            success: true,
            data: booking
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}


const cancelBooking = async (req, res) => {
    try {
        const {id} = req.body;
        const booking = await Booking.findByIdAndUpdate(id, { status : "cancelled" }, { new: true });
        res.json({
            success: true,
            data: booking
        })


    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
}

const getAllBookings = async (req, res) => {
    try {
        const bookings = await Booking.find().populate([
            {
                path: 'carId',
                select: 'name brand model'
            },
            {
                path: 'userId',
                select: 'name'
            }
        ]);

        if (!bookings || bookings.length === 0) {
            return res.status(404).json({
                message: "No bookings found"
            });
        }

        res.status(200).json({
            message: "Success",
            data: bookings
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: "Server error"
        });
    }
};


module.exports = { createBooking, updateBookingStatus, getUserBookings, getBookingById, cancelBooking, getAllBookings }