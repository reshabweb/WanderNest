import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { ArrowLeft, Upload, Loader2 } from "lucide-react";

export default function EditHomeForm() {
  const { homeId } = useParams();
  const isEditMode = !!homeId;
  const navigate = useNavigate();

  const [houseName, setHouseName] = useState("");
  const [price, setPrice] = useState("");
  const [location, setLocation] = useState("");
  const [rating, setRating] = useState("5.0");
  const [description, setDescription] = useState("");
  const [photoFile, setPhotoFile] = useState(null);
  const [existingPhoto, setExistingPhoto] = useState("");
  
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(false);
  const [errors, setErrors] = useState([]);

  useEffect(() => {
    if (isEditMode) {
      const fetchHomeData = async () => {
        try {
          setFetchLoading(true);
          const response = await axios.get(`/host/edit-home/${homeId}`);
          if (response.data.success) {
            const home = response.data.home;
            setHouseName(home.houseName);
            setPrice(home.price);
            setLocation(home.location);
            setRating(home.rating);
            setDescription(home.description || "");
            setExistingPhoto(home.photo || "");
          }
        } catch (err) {
          console.error("Failed to load property for editing:", err);
          navigate("/host/homes");
        } finally {
          setFetchLoading(false);
        }
      };
      fetchHomeData();
    }
  }, [homeId, isEditMode, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors([]);
    setLoading(true);

    const formData = new FormData();
    if (isEditMode) {
      formData.append("id", homeId);
    }
    formData.append("houseName", houseName);
    formData.append("price", price);
    formData.append("location", location);
    formData.append("rating", rating);
    formData.append("description", description);
    
    if (photoFile) {
      formData.append("photo", photoFile);
    }

    try {
      const endpoint = isEditMode ? "/host/edit-home" : "/host/add-home";
      const response = await axios.post(endpoint, formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      if (response.data.success) {
        navigate("/host/homes");
      } else {
        setErrors([response.data.error || "Something went wrong."]);
      }
    } catch (err) {
      console.error("Submit failed:", err);
      const backendErr = err.response?.data?.error || "Network error. Please try again.";
      setErrors([backendErr]);
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-red-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Back link */}
      <Link to="/host/homes" className="inline-flex items-center gap-1.5 text-sm font-semibold text-gray-500 hover:text-gray-900 mb-6 group transition-colors">
        <ArrowLeft className="h-4 w-4 group-hover:-translate-x-0.5 transition-transform" />
        Back to Dashboard
      </Link>

      <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 shadow-sm">
        <h1 className="text-2xl font-extrabold text-gray-950 mb-1.5">
          {isEditMode ? "Edit Property Listing" : "Add New Property"}
        </h1>
        <p className="text-gray-500 text-sm mb-6">
          {isEditMode ? "Update details for this rental listing." : "Register a new space on the WanderNest catalog."}
        </p>

        {errors.length > 0 && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl mb-6 text-sm">
            <ul className="list-disc pl-4 space-y-1 font-medium">
              {errors.map((err, idx) => (
                <li key={idx}>{err}</li>
              ))}
            </ul>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* House Name */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1.5">House Name *</label>
            <input
              type="text"
              value={houseName}
              onChange={(e) => setHouseName(e.target.value)}
              placeholder="e.g. Sunset Luxury Villa"
              className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-sm font-medium"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Price */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5">Price Per Night (₹) *</label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="e.g. 1500"
                className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-sm font-medium"
                required
              />
            </div>

            {/* Rating */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5">Rating (1.0 - 5.0) *</label>
              <input
                type="number"
                step="0.1"
                min="1.0"
                max="5.0"
                value={rating}
                onChange={(e) => setRating(e.target.value)}
                placeholder="e.g. 4.8"
                className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-sm font-medium"
                required
              />
            </div>
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1.5">Location (City, Country) *</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. Positano, Italy"
              className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-sm font-medium"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1.5">Description</label>
            <textarea
              rows="4"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the house features, guest limits, views, amenities..."
              className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-sm font-medium"
            />
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1.5">
              Property Image {!isEditMode && "*"}
            </label>
            <div className="flex flex-col sm:flex-row gap-4 items-center">
              {existingPhoto && !photoFile && (
                <div className="shrink-0 h-20 w-28 rounded-lg overflow-hidden border border-gray-200">
                  <img 
                    src={existingPhoto.startsWith("http") ? existingPhoto : `http://localhost:3001/${existingPhoto}`} 
                    alt="Preview" 
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              
              <label className="flex flex-col justify-center items-center border-2 border-dashed border-gray-300 hover:border-red-400 py-4 px-6 rounded-lg cursor-pointer bg-gray-50 hover:bg-red-50/20 transition-all duration-200 w-full text-center">
                <Upload className="h-6 w-6 text-gray-400 mb-1" />
                <span className="text-xs font-semibold text-gray-700">
                  {photoFile ? photoFile.name : "Select an image file"}
                </span>
                <span className="text-[10px] text-gray-500 mt-0.5">PNG, JPG, JPEG allowed</span>
                <input
                  type="file"
                  accept="image/png, image/jpeg, image/jpg"
                  onChange={(e) => setPhotoFile(e.target.files[0])}
                  className="hidden"
                  required={!isEditMode}
                />
              </label>
            </div>
          </div>

          {/* Action Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-4 rounded-xl shadow-sm transition-all duration-200 flex items-center justify-center gap-2 mt-4"
          >
            {loading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>Saving Property...</span>
              </>
            ) : (
              <span>{isEditMode ? "Save Changes" : "Submit Property"}</span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
