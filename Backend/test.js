require('dotenv').config();
const path = require('path');


const express = require('express');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const { default: mongoose } = require('mongoose');
const multer = require('multer');
const { storage: cloudinaryStorage } = require('./Utils/cloudinary');
const DB_PATH = process.env.MONGODB_URL;


const storeRouter = require("./routes/storeRouter")
const hostRouters = require("./routes/hostRouters")
const authRouter = require("./routes/authRouter")
const rootDir = require("./Utils/pathUtils");
const errorController = require("./controllers/error");


const app = express();
const cors = require('cors');

const allowedOrigins = [
  "http://localhost:5173",
  process.env.CLIENT_URL,
];

app.use(
  cors({
    origin: function (origin, callback) {
      console.log("Incoming Origin:", origin);
      console.log("Allowed Origins:", allowedOrigins);

      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error(`Origin ${origin} not allowed by CORS`));
    },
    credentials: true,
  })
);

app.set('view engine', 'ejs');

app.set('views', path.join(__dirname, 'views'));

const store = new MongoDBStore({
  uri: DB_PATH,
  collection: 'sessions'
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg') {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const multerOptions = {
  storage: cloudinaryStorage, fileFilter
};


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(multer(multerOptions).single('photo'));
app.use(express.static(path.join(rootDir, 'public')));


app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  store: store
}));

app.use((req, res, next) => {
  req.isLoggedIn = req.session.isLoggedIn;
  next();
});

app.use(storeRouter);
app.use('/host', (req, res, next) => {
  if (req.isLoggedIn) {
    next();
  } else {
    res.status(401).json({ success: false, message: 'Unauthorized. Please login.' });
  }
});
app.use('/host', hostRouters);

app.use(authRouter);


// app.get('/', (req,res) => {
//   res.sendFile(path.join(rootDir, 'views', 'home.html'));
// });

// app.get('/about', (req, res) => {
//   res.send('This is the about page');
// });

// 404 Page Not Found Handling  
app.use(errorController.get404);


const PORT = process.env.PORT || 3001;

mongoose.connect(DB_PATH)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch(err => console.error(err));



