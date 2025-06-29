const User = require('../models/user.model');
const { createToken } = require('../utils/jwt');

const registerUser = async (req, res) => {
    try {
        const { name, email, password, phone } = req.body;
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({
                success: false,
                message: "User already exists"
            })
        }

        const user = await User.create({
            name,
            email,
            password,
            phone,
            role: 'user'
        })

        res.status(201).json({
            success: true,
            token: createToken(user),
            data: {
                _id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone
            }
        })
    }
    catch (err) {
        console.log(err);
        return res.status(400).json({
            success: false,
            message: err.message
        })
    }
}


const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Please provide email and/or password'
            })
        }
        const user = await User.findOne({ email });

        if (!user) {
            res.status(400).json({
                success: false,
                message: "User not found please register to proceed"
            })
        }

        if (user.status === 'Banned') {
            return res.status(403).json({
                success: false,
                message: "Your account has been banned. Please contact admin/support."
            })
        }

        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message: "Invalid Password"
            })
        }

        res.json({
            success: true,
            token: createToken(user),
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone
            }
        })

    }
    catch (err) {
        console.log(err);
    }
}

const getProfile = async (req, res) => {
    try{ 
        res.json({
            success : true,
            user : {
                 _id: req.user._id,
                name: req.user.name,
                email: req.user.email,
                phone: req.user.phone,
                joinDate : req.user.createdAt
            }
        })
    }
    catch(err){
        console.log(err);
    }
}


const updateProfile = async (req, res) => {
    try {
        const { name, email, phone } = req.body;
        const existingUser = await User.findOne({ email, _id: { $ne: req.user._id } });

        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "User with this email already exists"
            })
        }

        const user = await User.findByIdAndUpdate(req.user._id,
            { name, email, phone },
            { new: true }
        ).select('-password');

        res.json({
            success: true,
            message: 'Profile updated successfully',
            data: {
                user: {
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    phone: user.phone,
                    joinedDate: user.createdAt
                }
            }
        })

    }
    catch (err) {
        console.log(err);
    }
}


const changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const user = await User.findById(req.user._id);

        const isMatch = await user.matchPassword(currentPassword);
        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message: "Invalid Password"
            })
        }
        user.password = newPassword;
        await user.save();

        res.json({
            success: true,
            message: 'Password changed successfully.'
        })

    }
    catch (err) {
        console.log(err);
    }
}

const getUsers = async(req,res)=>{
    try{
        const users = await User.find();
        if(!users){
            return res.json({
                message : "no user found"
            })
        }
        res.status(200).json({
            messsage : "success",
            data : users
        })
    }
    catch(err){
        res.status(500).json({
            message: "Server error"
        });
    }
}

module.exports = { registerUser, loginUser, getProfile,updateProfile, changePassword, getUsers };