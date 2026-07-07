const { check, validationResult } = require("express-validator");
const User = require("../models/user");
const bcrypt = require("bcryptjs");

exports.getLogin = (req, res, next) => {
  res.render('auth/login', {
    pageTitle: 'Add Home to WanderNest',
    currentPage: 'addHome',
    editing: false,
    isLoggedIn: false,
    errors: [],
    oldInput: { email: '' },
    user: {},
  });
};

exports.getSignup = (req, res, next) => {
  res.render('auth/signup', {
    pageTitle: 'Signup',
    currentPage: 'signup',
    editing: false,
    isLoggedIn: false,
    errors: [],
    oldInput: { firstName: '', lastName: '', email: '', userType: '', terms: '' },
    user: {},

  });
};


exports.postSignup = [
  check("firstName")
    .trim()
    .isLength({ min: 2 })
    .withMessage("First name must be at least 2 characters long.")
    .matches(/^[A-Za-z]+$/)
    .withMessage("First name must contain only alphabetic characters."),

  check("lastName")
    .matches(/^[A-Za-z]*$/)
    .withMessage("Last name must contain only alphabetic characters."),

  check("email")
    .isEmail()
    .withMessage("Please enter a valid email address.")
    .normalizeEmail(),

  check("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 8 characters long.")
    .matches(/[A-Z]/)
    .withMessage("Password must contain at least one uppercase letter.")
    .matches(/[a-z]/)
    .withMessage("Password must contain at least one lowercase letter.")
    .matches(/[0-9]/)
    .withMessage("Password must contain at least one number.")
    .matches(/[\W_]/)
    .withMessage("Password must contain at least one special character.")
    .trim(),

  check("confirmPassword")
    .trim()
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Passwords do not match.");
      }
      return true;
    }),

  check("userType")
    .notEmpty()
    .withMessage("User type is required.")
    .isIn(["host", "guest"])
    .withMessage("Invalid user type."),

  check("terms")
    .notEmpty()
    .withMessage("You must accept the terms and conditions.")
    .custom((value, { req }) => {
      if (value !== 'on') {
        throw new Error("You must accept the terms and conditions.");
      }
      return true;
    }),

  (req, res, next) => {
    const { firstName, lastName, email, password, confirmPassword, userType, terms } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ success: false, errors: errors.array().map(err => err.msg) });
    }

    bcrypt.hash(password, 12)
      .then(hashedPassword => {
        const user = new User({ firstName, lastName, email, password: hashedPassword, userType });
        return user.save();
      })
      .then(() => {
        res.status(201).json({ success: true, message: "User registered successfully." });
      })
      .catch(err => {
        res.status(422).json({ success: false, errors: [err.message] });
      });
  }
];

exports.postLogin = async (req, res, next) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email: email });
  if (!user) {
    return res.status(422).json({ success: false, errors: ["User does not exist."] });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(422).json({ success: false, errors: ["Invalid password."] });
  }

  req.session.isLoggedIn = true;
  req.session.user = user;
  await req.session.save();
  res.status(200).json({
    success: true,
    user: {
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      userType: user.userType
    }
  });
};

exports.postLogout = (req, res, next) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ success: false, message: "Could not log out." });
    }
    res.clearCookie('connect.sid');
    res.status(200).json({ success: true });
  });
};

exports.checkAuth = (req, res, next) => {
  if (req.session.isLoggedIn && req.session.user) {
    res.status(200).json({
      isLoggedIn: true,
      user: {
        _id: req.session.user._id,
        firstName: req.session.user.firstName,
        lastName: req.session.user.lastName,
        email: req.session.user.email,
        userType: req.session.user.userType
      }
    });
  } else {
    res.status(200).json({ isLoggedIn: false });
  }
};