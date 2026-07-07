const Home = require("../models/home");
const User = require("../models/user");

exports.getIndex = (req, res, next) => {
  Home.find()
    .then(registeredHomes => {
      res.status(200).json({ success: true, homes: registeredHomes });
    })
    .catch(err => {
      res.status(500).json({ success: false, error: err.message });
    });
};

exports.getHomes = (req, res, next) => {
  Home.find()
    .then(registeredHomes => {
      res.status(200).json({ success: true, homes: registeredHomes });
    })
    .catch(err => {
      res.status(500).json({ success: false, error: err.message });
    });
};

exports.getBookings = (req, res, next) => {
  res.status(200).json({ success: true, bookings: [] });
};

exports.getFavouriteList = async (req, res, next) => {
  try {
    if (!req.session || !req.session.user) {
      return res.status(401).json({ success: false, message: "Unauthorized. Please log in." });
    }
    const userId = req.session.user._id;
    const user = await User.findById(userId).populate('favourites');
    res.status(200).json({ success: true, favouriteHomes: user.favourites });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.postAddToFavourite = async (req, res, next) => {
  try {
    if (!req.session || !req.session.user) {
      return res.status(401).json({ success: false, message: "Unauthorized. Please log in." });
    }
    const homeId = req.body.id;
    const userId = req.session.user._id;
    const user = await User.findById(userId);
    if (!user.favourites.some(fav => fav.toString() === homeId.toString())) {
      user.favourites.push(homeId);
      await user.save();
    }
    res.status(200).json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.postRemoveFromFavourite = async (req, res, next) => {
  try {
    if (!req.session || !req.session.user) {
      return res.status(401).json({ success: false, message: "Unauthorized. Please log in." });
    }
    const homeId = req.params.homeId;
    const userId = req.session.user._id;
    const user = await User.findById(userId);
    user.favourites = user.favourites.filter(fav => fav.toString() !== homeId.toString());
    await user.save();
    res.status(200).json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.getHomeDetails = (req, res, next) => {
  const homeId = req.params.homeId;
  Home.findById(homeId)
    .then(home => {
      if (!home) {
        res.status(404).json({ success: false, message: "Home not found." });
      } else {
        res.status(200).json({ success: true, home: home });
      }
    })
    .catch(err => {
      res.status(500).json({ success: false, error: err.message });
    });
};