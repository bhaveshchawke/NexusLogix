const storeController = require('../Controllers/storeController');
const express = require('express');
const storeRoutes = express.Router();
const authMiddleware = require('../Controllers/auth');

storeRoutes.get('/',storeController.getHomePage )
storeRoutes.get('/services',storeController.getServicesPage )
storeRoutes.get('/pricing',storeController.getPricingPage )
storeRoutes.get('/tracking', authMiddleware.isAuth, storeController.getTrackingPage)
// Assuming you have created these controller functions as suggested before
storeRoutes.get('/about', storeController.getAboutPage);
storeRoutes.get('/contact', storeController.getContactPage);

storeRoutes.get('/clientLogin', storeController.getclientLoginPage);
storeRoutes.get('/register', storeController.getRegisterPage);

// Client Dashboard
storeRoutes.get('/dashboard', authMiddleware.isAuth, storeController.getClientDashboard);

//help center

// --- Add these POST routes to handle form submissions ---

// Handle Contact Form
storeRoutes.post('/contact-submit', storeController.postContactForm);

// Handle Client Registration
storeRoutes.post('/client-register', ...storeController.postClientRegister);

// Handle Client Login
storeRoutes.post('/client-login', storeController.postClientLogin);

// Handle Client Logout
storeRoutes.post('/logout', storeController.postLogout);

// Handle Tracking Form Submission
storeRoutes.post('/tracking', authMiddleware.isAuth, storeController.postTrackShipment);

// Dynamic Learn More page for services
storeRoutes.get('/services/:slug', storeController.getLearnMorePage);

module.exports = storeRoutes;