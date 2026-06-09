
const path = require('path');


const express = require('express');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const { default: mongoose } = require('mongoose');
const multer = require('multer');
const DB_PATH = "mongodb+srv://root:root@cluster0.gcmhdvl.mongodb.net/airbnb?retryWrites=true&w=majority&appName=Cluster0";


const storeRouter = require("./routes/storeRouter")
const hostRouters = require("./routes/hostRouters")
const authRouter = require("./routes/authRouter")
const rootDir = require("./Utils/pathUtils");
const errorController = require("./controllers/error");


const app = express();

app.set('view engine', 'ejs');

app.set('views', path.join(__dirname, 'views'));

const store = new MongoDBStore({
  uri: DB_PATH,
  collection: 'sessions'
});

const randomString = (length) => {
  const characters = 'abcdefghijklmnopqrstuvwxyz';
  let result = '';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, randomString(10) + '-' + file.originalname);
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg') {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const multerOptions = {
  storage, fileFilter
};


app.use(express.urlencoded({ extended: true }));
app.use(multer(multerOptions).single('photo'));
app.use(express.static(path.join(rootDir, 'public')));
app.use("/uploads", express.static(path.join(rootDir, 'uploads')));
app.use("/host/uploads", express.static(path.join(rootDir, 'uploads')));
app.use("/homes/uploads", express.static(path.join(rootDir, 'uploads')));



app.use(session({
  secret: "Doing with complete coding",
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
    res.redirect('/login');
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


mongoose.connect(DB_PATH).then(() => {
  console.log('Connected to MongoDb');
  app.listen(3001, () => {
    console.log('Server running on http://localhost:3001');
  });

}).catch(err => {
  console.log('Error while connecting to MongoDB using mongoose: ', err);
});



