const storeController = require('../Controllers/storeController');
const express = require('express');
const storeRoutes = express.Router();

storeRoutes.get('/',storeController.getHomePage )
storeRoutes.get('/services',storeController.getServicesPage )

module.exports = storeRoutes;