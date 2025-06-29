let Admin = require('../models/admin.model');
let { createToken } = require('../utils/jwt');

const registerAdmin = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const adminExists = await Admin.findOne({ email });
        if (adminExists) {
            res.status(400).json({
                message: "email already exists"
            })
        }

        const admin = await Admin.create({
            name,
            email,
            password,
        })

        res.status(201).json({
            _id: admin._id,
            name: admin.name,
            email: admin.email,
            token: createToken(admin._id)
        })
    } catch (err) {
        console.log(err);
    }

}


const loginAdmin = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        if(!email || !password){
            return res.status(400).json({
                success: false,
                message: 'Please provide email and/or password'
            })
        }
        
        const admin = await Admin.findOne({ email });
        if(!admin){
            res.status(400).json({
                success : "false",
                message: "no user exists with this email"
            })
        }

        const isMatch = await admin.matchPassword(password);
        if(!isMatch){
            return res.status(400).json({
                success: false,
                message: "Invalid Password"
            })
        }

        res.json({
            _id: admin._id,
            name: admin.name,
            email: admin.email,
            token: createToken(admin._id)
        })
    } catch (err) {
        console.log(err);
    }
}

const getProfile = async (req, res) => {
    try{
        const admin = await Admin.findById(req.admin._id).select('-password');

        res.json({
            success: true,
            data: {
                name: admin.name,
                email: admin.email,
                phone: admin.phone,
                role: 'admin',
                lastLogin: admin.lastLogin,
                joinedDate: admin.createdAt
            }
        })
        
    }
    catch(error) {
        res.status(500).json({message: error.message})
    }
}


const updateProfile = async(req,res)=>{
    try{
        const {name,email,phone} = req.body;

        const admin = await Admin.findByIdAndUpdate(
            req.admin._id,
            {name, email, phone},
            { new: true }
        ).select('-password');
        
        
        res.json({
            success: true,
            message: 'Profile updated successfully',
            data: {
                name: admin.name,
                email: admin.email,
                phone: admin.phone,
                role: 'admin',
                lastLogin: admin.lastLogin,
                joinedDate: admin.createdAt
            }     
        })

    }catch(err){
        console.log(err);
    }
}


const changePassword = async (req,res)=>{
    try{
        const {currentPassword,newPassword} = req.body;
        const admin = await Admin.findById(req.admin._id);

        const isMatch = await admin.matchPassword(currentPassword);
        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message: 'Current password is incorrect.'
            })
        }
        admin.password = newPassword;
        admin.save();
        res.json({
            success: true,
            message: 'Password changed successfully'
        })

        
    }catch(err){
        console.log(err);
    }
}


module.exports = {
    registerAdmin,
    loginAdmin,
    getProfile,
    updateProfile,
    changePassword
}