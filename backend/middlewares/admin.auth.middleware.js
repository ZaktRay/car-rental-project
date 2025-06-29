const { verifyToken } = require('../utils/jwt');
const Admin = require('../models/admin.model');

exports.protect = async (req, res, next) => {
   const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({ message: 'Authorization is missing' });
    }

    if (!authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Token must be Bearer token' });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'Token not provided' });
    }

    try {
        const decoded = verifyToken(token);
        if (!decoded) {
            return res.status(401).json({ message: 'Invalid or expired token' });
        }

        const admin = await Admin.findById(decoded.id);
        if (!admin) {
            return res.status(401).json({ message: 'User not found' });
        }

        req.admin = admin;
        next();
    } catch (err) {
        console.error("Protect error:", err.message);
        return res.status(401).json({ message: 'Unauthorized (caught error)' });
    }
}