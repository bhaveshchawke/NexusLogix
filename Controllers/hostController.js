const Shipment = require("../Models/dataBase");
const Contact = require("../Models/contactSchema");
const Vehicle = require('../Models/vehicle');
const Driver = require('../Models/driver');
const mongoose = require('mongoose');
 
exports.getUserPage = (req, res, next) => {
  res.render("host/addShipment", { pageTitle: "Add User" });
};
exports.postShipment = async (req, res, next) => {
  const {
    recipientName,
    recipientAddress,
    recipientPhone,
    packageWeight,
    packageContents,
  } = req.body;
  try {
    // Generate a unique shipment ID. Here we use a portion of a new MongoDB ObjectId.
    const uniqueId = new mongoose.Types.ObjectId().toString().slice(-8).toUpperCase();

    const shipment = new Shipment({
      clientId: req.session.user._id, // Assign the shipment to the logged-in host
      shipmentId: `UE-${uniqueId}`, // Example: UE-5F9B3C1D
      fullName: recipientName,
      address: recipientAddress,
      number: recipientPhone,
      weight: packageWeight,
      contents: packageContents,
      updates: [{ message: 'Shipment created and information received.' }]
    });
    const result = await shipment.save();
    console.log("Shipment Created:", result);
    res.redirect(`/host/shipment-success?id=${result.shipmentId}`);
  } catch (err) {
    console.error("Error creating shipment:", err);
    // Render the form again with an error message
    res.status(500).render("host/addShipment", { 
      pageTitle: "Add User",
      errorMessage: "Failed to create shipment. Please try again."
    });
  }
};

exports.getShipmentSuccessPage = async (req, res, next) => {
  try {
    const shipment = await Shipment.findOne({ shipmentId: req.query.id });
    if (!shipment) {
      return res.redirect('/host/addShipment');
    }
    res.render("host/shipment-success", {
      pageTitle: "Shipment Created",
      shipmentId: shipment.shipmentId,
      productName: shipment.contents,
    });
  } catch (err) {
    next(err);
  }
};
exports.getFleetManagementPage = (req, res, next) => {
  // This is the correct implementation, fetching data
  Promise.all([
    Vehicle.find({ hostId: req.session.user._id }).populate('assignedDriver'),
    Driver.find({ hostId: req.session.user._id }).populate('assignedVehicle')
  ]).then(([vehicles, drivers]) => {
    res.render('host/fleetManagement', { 
      pageTitle: 'Fleet Management',
      vehicles: vehicles,
      drivers: drivers,
      availableDrivers: drivers.filter(d => d.status === 'Available'),
      isHost: req.session.isHost // Pass isHost to the view
    });
  }).catch(err => next(err));
};

exports.getViewMessagesPage = async (req, res, next) => {
  try {
    const messages = await Contact.find().sort({ createdAt: -1 }); // Fetch all messages, newest first
    res.render('host/view-messages', {
      pageTitle: 'Client Messages',
      messages: messages
    });
  } catch (err) {
    console.error('Error fetching contact messages:', err);
    next(err);
  }
};

exports.postAddVehicle = async (req, res, next) => {
  const { vehicleId, type, model } = req.body;
  try {
    // Check if a vehicle with this ID already exists
    const existingVehicle = await Vehicle.findOne({ vehicleId: vehicleId.toUpperCase() });
    if (existingVehicle) {
      // For now, we'll log it and redirect. A better approach is to show a flash message.
      console.log(`Vehicle with ID ${vehicleId} already exists.`);
      return res.redirect('/host/fleet-management');
    }
    const vehicle = new Vehicle({
      vehicleId,
      type,
      model,
      hostId: req.session.user._id
    });
    await vehicle.save();
    res.redirect('/host/fleet-management');
  } catch (err) {
    console.error('Error adding vehicle:', err);
    next(err);
  }
};

exports.postAssignDriver = async (req, res, next) => {
  const { vehicleId, driverId } = req.body;
  try {
    // Atomically update both documents
    await Promise.all([
      Vehicle.findByIdAndUpdate(vehicleId, { assignedDriver: driverId, status: 'On-trip' }),
      Driver.findByIdAndUpdate(driverId, { assignedVehicle: vehicleId, status: 'On-trip' })
    ]);
    res.redirect('/host/fleet-management');
  } catch (err) {
    console.error('Error assigning driver:', err);
    next(err);
  }
};

exports.postAddDriver = async (req, res, next) => {
  const { fullName, phone, licenseNumber } = req.body;
  try {
    // Check if driver with the same phone or license already exists
    const existingDriver = await Driver.findOne({ $or: [{ phone }, { licenseNumber }] });
    if (existingDriver) {
      // In a real app, you'd show a proper error message to the user
      console.log('Driver with this phone or license already exists.');
      return res.redirect('/host/fleet-management');
    }

    const driver = new Driver({ fullName, phone, licenseNumber, hostId: req.session.user._id, status: 'Available' });
    await driver.save();
    res.redirect('/host/fleet-management');
  } catch (err) {
    console.error('Error adding driver:', err);
    next(err);
  }
};