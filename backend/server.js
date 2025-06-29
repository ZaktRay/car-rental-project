const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const connectDB = require('./config/db');
const userRoutes = require('./routes/user.routes');
const adminRoutes = require('./routes/admin.routes');
const carRoutes = require('./routes/car.routes');
const bookingRoutes = require('./routes/booking.routes');
const verifyRoute = require('./routes/token.route');
const morgan = require("morgan");

dotenv.config();

connectDB();

const app = express();

app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    credentials: true
}))

app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/user', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/car', carRoutes);
app.use('/api/booking', bookingRoutes);
app.use('/api/verify', verifyRoute);
app.use(morgan("common"));


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log("server is running on PORT 5000"))
