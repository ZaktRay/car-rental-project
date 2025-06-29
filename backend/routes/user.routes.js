const express = require('express');
const router = express.Router();
const {protect} = require('../middlewares/user.auth.middleware');
const { 
    registerUser,
    loginUser,
    getProfile,
    updateProfile,
    changePassword
} = require('../controllers/user.controller');


router.post('/register',registerUser);
router.post('/login',loginUser);
router.get('/profile',protect,getProfile);

router.put('/updateprofile',protect,updateProfile);
router.put('/changepassword',protect,changePassword);

module.exports = router;