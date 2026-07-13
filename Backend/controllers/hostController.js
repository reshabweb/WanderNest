const Home = require("../models/home");
const { cloudinary } = require("../Utils/cloudinary");

exports.getAddHome = (req, res, next) => {
  res.status(200).json({ success: true });
};

exports.getEditHome = (req, res, next) => {
  const homeId = req.params.homeId;
  Home.findById(homeId)
    .then(home => {
      if (!home) {
        return res.status(404).json({ success: false, message: "Home not found." });
      }
      res.status(200).json({ success: true, home: home });
    })
    .catch(err => {
      res.status(500).json({ success: false, error: err.message });
    });
};

exports.getHostHomes = (req, res, next) => {
  Home.find()
    .then(registeredHomes => {
      res.status(200).json({ success: true, homes: registeredHomes });
    })
    .catch(err => {
      res.status(500).json({ success: false, error: err.message });
    });
};

exports.postAddHome = (req, res, next) => {
  const { houseName, price, location, rating, description } = req.body;

  if (!req.file) {
    return res.status(400).json({ success: false, error: 'No image uploaded.' });
  }

  const home = new Home({
    houseName,
    price: Number(price),
    location,
    rating: Number(rating),
    photo: req.file.path,
    photoPublicId: req.file.filename,
    description
  });

  home.save()
    .then(result => {
      res.status(201).json({ success: true, home: result });
    })
    .catch(err => {
      res.status(500).json({ success: false, error: err.message });
    });
};

exports.postEditHome = (req, res, next) => {
  const { id, houseName, price, location, rating, description } = req.body;

  Home.findById(id)
    .then(home => {
      if (!home) {
        return res.status(404).json({ success: false, error: 'Home not found.' });
      }
      home.houseName = houseName;
      home.price = Number(price);
      home.location = location;
      home.rating = Number(rating);
      home.description = description;

      if (req.file) {
        if (home.photoPublicId) {
          cloudinary.uploader.destroy(home.photoPublicId, (err) => {
            if (err) {
              console.log("Error while deleting old photo: ", err);
            }
          });
        }
        home.photo = req.file.path;
        home.photoPublicId = req.file.filename;
      }

      home.save()
        .then(result => {
          res.status(200).json({ success: true, home: result });
        })
        .catch(err => {
          res.status(500).json({ success: false, error: err.message });
        });
    })
    .catch(err => {
      res.status(500).json({ success: false, error: err.message });
    });
};

exports.postDeleteHome = (req, res, next) => {
  const homeId = req.params.homeId;
  Home.findById(homeId)
    .then(home => {
      if (!home) {
        return res.status(404).json({ success: false, error: 'Home not found.' });
      }
      if (home.photoPublicId) {
        cloudinary.uploader.destroy(home.photoPublicId, (err) => {
          if (err) {
            console.log("Error while deleting photo on home deletion:", err);
          }
        });
      }
      return Home.findByIdAndDelete(homeId);
    })
    .then(() => {
      res.status(200).json({ success: true });
    })
    .catch(err => {
      res.status(500).json({ success: false, error: err.message });
    });
};