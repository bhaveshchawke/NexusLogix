const { check, validationResult } = require('express-validator');
const Shipment = require('../Models/dataBase');
const Client = require('../Models/clientSchema');
const Contact = require('../Models/contactSchema');
const Vehicle = require('../Models/vehicle');
const Driver = require('../Models/driver');
const bcrypt = require('bcryptjs');

// Data for our services. In a real app, this might come from a database.
const servicesData = {
  'real-time-tracking': {
    title: 'Real-time Shipment Tracking',
    description: 'Our state-of-the-art GPS technology allows you and your customers to track parcels live on the city map, providing minute-by-minute updates from the pickup point to the final doorstep. Transparency and peace of mind are guaranteed.',
    features: [
      'Live map view of delivery agent',
      'Push notifications for status changes',
      'Shareable tracking links for customers',
      'Accurate Estimated Time of Arrival (ETA)'
    ],
    lottieUrl: 'https://lottie.host/b7dae6fd-b03d-4382-a513-8eec15d9fc43/hcvEl934Xj.lottie'
  },
  'ai-optimization': {
    title: 'AI-Powered Delivery Optimization',
    description: 'We leverage advanced artificial intelligence to analyze traffic patterns, weather conditions, and delivery density. Our smart algorithms calculate the fastest and most fuel-efficient routes, ensuring we meet our same-day delivery promise every time.',
    features: [
      'Dynamic route adjustments based on live traffic',
      'Batching of nearby orders to reduce trips',
      'Predictive analysis for demand forecasting',
      'Reduced carbon footprint through efficient routing'
    ],
    lottieUrl: 'https://lottie.host/69645ba5-0d6b-4ae3-be2e-ae3f03f56333/0SAX0dU9i8.lottie'
  },
  'fleet-management': {
    title: 'Intelligent Fleet Management',
    description: 'Our centralized command center manages our entire fleet of delivery bikes and vans in real-time. This ensures maximum reliability, vehicle health monitoring, and rapid allocation of the nearest driver for new pickups, maximizing speed for every order.',
    features: [
      'Real-time monitoring of all vehicles',
      'Automated driver assignment system',
      'Predictive maintenance alerts for vehicles',
      'Performance analytics for each driver and vehicle'
    ],
    lottieUrl: 'https://lottie.host/f7ee11d0-7718-4eed-837b-4607b58f632a/lDMKG6QfQO.lottie'
  }
};

exports.getHomePage = (req, res, next) => {
  res.render('store/home', { pageTitle: 'Urban Express - Home' });
};

exports.getServicesPage = (req, res, next) => {
  res.render('store/services', { pageTitle: 'Our Services' });
};
exports.getPricingPage = (req, res, next) => {
  res.render('store/pricing', { pageTitle: 'Pricing Plans' });
};
exports.getTrackingPage = (req, res, next) => {
  res.render('store/tracking', { 
    pageTitle: 'Track Your Shipment',
    shipment: undefined, // Ensure shipment is undefined initially
    notFoundError: undefined
  });
};
exports.getAboutPage = (req, res, next) => {
  res.render('store/about', { pageTitle: 'About Us' });
};
exports.getContactPage = (req, res, next) => {
  res.render('store/contact', { 
    pageTitle: 'Contact Us',
    errorMessage: null,
    oldInput: {},
    validationErrors: []
  });
};
exports.getclientLoginPage = (req, res, next) => {
  res.render('store/client', { 
    pageTitle: 'Client Login',
    errorMessage: null,
    oldInput: {}
  });
};
exports.getRegisterPage = (req, res, next) => {
  res.render('store/register', { 
    pageTitle: 'Client Registration',
    errorMessage: null,
    oldInput: {}
  });
};

exports.getClientDashboard = async (req, res, next) => {
  try {
    // Assuming the user ID is stored in the session
    const shipments = await Shipment.find({ clientId: req.session.user._id }).sort({ createdAt: -1 });
    res.render('store/dashboard', {
      pageTitle: 'My Dashboard',
      user: req.session.user,
      shipments: shipments,
      isHost: req.session.isHost || false
    });
  } catch (err) {
    console.log(err);
    next(err); // Pass error to the error handling middleware
  }
};

// --- POST Route Handlers ---

// Handle Contact Form Submission
exports.postContactForm = [
  // Validation rules
  check('fullName').trim().notEmpty().withMessage('Full name is required.'),
  check('email').isEmail().withMessage('Please enter a valid email.').normalizeEmail(),
  check('subject').trim().notEmpty().withMessage('Subject is required.'),
  check('message').trim().notEmpty().withMessage('Message is required.'),

  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // Render the contact page again with errors and old input
      return res.status(422).render('store/contact', {
        pageTitle: 'Contact Us',
        errorMessage: errors.array()[0].msg,
        oldInput: {
          fullName: req.body.fullName,
          email: req.body.email,
          subject: req.body.subject,
          message: req.body.message
        },
        validationErrors: errors.array()
      });
    }

    const { fullName, email, subject, message } = req.body;

    const contactMessage = new Contact({
      fullName,
      email,
      subject,
      message
    });

    await contactMessage.save();
    console.log('Contact form data saved:', contactMessage);
    // Redirect to a 'thank you' page or home page with a success message.
    res.redirect('/');
  }
];

// Handle Client Registration
exports.postClientRegister =[
  // 1. Validation Rules
  check('fullName')
    .trim()
    .notEmpty().withMessage('Full name is required.')
    .isLength({ min: 3 }).withMessage('Full name must be at least 3 characters long.'),

  check('email')
    .isEmail().withMessage('Please enter a valid email address.')
    .custom(async (value) => {
      const existingClient = await Client.findOne({ email: value });
      if (existingClient) {
        throw new Error('A user with this email address already exists.');
      }
    })
    .normalizeEmail(),

  check('phone')
    .trim()
    .notEmpty().withMessage('Phone number is required.')
    .isMobilePhone('en-IN').withMessage('Please enter a valid 10-digit Indian mobile number.'),

  check('password')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters long.'),

  check('confirmPassword')
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Passwords do not match.');
      }
      return true;
    }),

  // 2. Controller Logic
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).render('store/register', {
        pageTitle: 'Client Registration',
        errorMessage: errors.array()[0].msg,
        oldInput: { fullName: req.body.fullName, email: req.body.email, phone: req.body.phone }
      });
    }

    const { fullName, email, phone, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 12);
    const client = new Client({ 
      fullName, 
      email, 
      phone, 
      password: hashedPassword,
      // Set role to 'host' if the email matches the host email from .env
      // A more robust solution would be a dedicated admin panel to assign roles.
      role: email === process.env.HOST_EMAIL ? 'host' : 'client' 
    });
    
    await client.save();
    res.redirect('/clientLogin');
  }
]


// Handle Client Login
exports.postClientLogin = async (req, res, next) => {
  const { clientEmail, clientPassword } = req.body;

  try {
    const client = await Client.findOne({ email: clientEmail });

    if (!client) {
      // If client does not exist, redirect to register page
      return res.status(422).render('store/register', {
        pageTitle: 'Client Registration',
        errorMessage: 'No account found with that email. Please register.',
        oldInput: { email: clientEmail }
      });
    }

    const doMatch = await bcrypt.compare(clientPassword, client.password);

    if (doMatch) {
      // Passwords match, create session
      req.session.isLoggedIn = true;
      req.session.user = client; // Storing the whole user object might be too much, but ok for now.
      // Check role from database instead of hardcoding email
      if (client.role === 'host') {
        req.session.isHost = true;
      }

      return req.session.save(err => {
        if (err) console.log(err);
        res.redirect('/');
      });
    }

    // Passwords do not match
    return res.status(422).render('store/client', {
      pageTitle: 'Client Login',
      errorMessage: 'Invalid email or password.',
      oldInput: { clientEmail: clientEmail }
    });

  } catch (err) {
    console.log(err);
    res.redirect('/clientLogin');
  }
};

exports.postLogout = (req, res, next) => {
  req.session.destroy(err => {
    if (err) {
      console.log(err);
    }
    res.redirect('/');
  });
};

exports.postTrackShipment = async (req, res, next) => {
  const trackingId = req.body.id;

  try {
    const shipment = await Shipment.findOne({ shipmentId: trackingId });

    if (!shipment) {
      return res.render('store/tracking', {
        pageTitle: 'Track Your Shipment',
        notFoundError: `No shipment found with ID: ${trackingId}`
      });
    }

    res.render('store/tracking', {
      pageTitle: `Tracking - ${shipment.shipmentId}`,
      shipment: shipment
    });
  } catch (err) {
    console.error("Error fetching shipment:", err);
    res.status(500).send("An error occurred while tracking the shipment.");
  }
};
//learn More page
exports.getLearnMorePage = (req, res, next) => {
  const slug = req.params.slug;
  const service = servicesData[slug];

  // If service doesn't exist, show 404 page
  if (!service) {
    return res.status(404).render('store/404', { pageTitle: 'Service Not Found' });
  }

  res.render('store/learnMore', { 
    pageTitle: service.title,
    service: service,
    slug: slug // Pass the slug to the template
  });
};
