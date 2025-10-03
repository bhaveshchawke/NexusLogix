require('dotenv').config(); // Sabse upar isko add karein
const express = require('express');
const app = express();
const port = 3000;
const path = require('path');
const mongoose=require('mongoose');
const rootDir = require('./utils/pathUtil');
const storeRoutes = require('./Routes/storeRouter');
const hostRoutes = require('./Routes/hostRoutes');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);

const MONGO_URL = process.env.MONGO_URL;

app.set('view engine', 'ejs')
app.set('views', 'views');

// Session Store for MongoDB
const sessionStore = new MongoDBStore({
  uri: MONGO_URL,
  collection: 'sessions'
});

// Body-parser middleware to handle form data
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(rootDir, 'public')));


app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false, // Don't save empty sessions
  store: sessionStore
}));

app.use((req, res, next) => {
  res.locals.isLoggedIn = req.session.isLoggedIn || false;
  res.locals.user = req.session.user || null;
  // Make isHost available in all views if it's in the session
  res.locals.isHost = req.session.isHost || false;
  next();
});

app.use(storeRoutes);
app.use("/host",hostRoutes);
app.use((req,res,next)=>{
 res.status(404).render('store/404',{pageTitle:'Page Not Found'})
})

mongoose.connect(MONGO_URL)
.then(()=>{
  app.listen(port, () => {
    console.log(`NexusLogix app listening at http://localhost:${port}`);
  });
})
.catch((err)=>{
  console.log(err);
});
