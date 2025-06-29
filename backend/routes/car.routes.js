const express = require('express');
const router = express.Router();
const {getCarById,searchCars,getCarImage} = require('../controllers/car.controller');


router.get('/:id',getCarById);
router.get('/',searchCars);
router.get('/image/:id',getCarImage);

module.exports = router;
