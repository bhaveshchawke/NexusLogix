const express = require('express');
const hostRoutes = express.Router();

const hostController=require('../Controllers/hostController');
const authMiddleware = require('../Controllers/auth');

hostRoutes.get('/addShipment', authMiddleware.isAuth, authMiddleware.isHost, hostController.getUserPage)
hostRoutes.post('/addShipment', authMiddleware.isAuth, authMiddleware.isHost, hostController.postShipment)

// Route to show shipment success page
hostRoutes.get('/shipment-success', authMiddleware.isAuth, authMiddleware.isHost, hostController.getShipmentSuccessPage);

// Route for host to view contact messages
hostRoutes.get('/messages', authMiddleware.isAuth, authMiddleware.isHost, hostController.getViewMessagesPage);

// Fleet Management page
hostRoutes.get('/fleet-management', authMiddleware.isAuth, authMiddleware.isHost, hostController.getFleetManagementPage);

// Routes for Fleet Management
hostRoutes.post('/add-vehicle', authMiddleware.isAuth, authMiddleware.isHost, hostController.postAddVehicle);
hostRoutes.post('/assign-driver', authMiddleware.isAuth, authMiddleware.isHost, hostController.postAssignDriver);
hostRoutes.post('/add-driver', authMiddleware.isAuth, authMiddleware.isHost, hostController.postAddDriver);


module.exports = hostRoutes;