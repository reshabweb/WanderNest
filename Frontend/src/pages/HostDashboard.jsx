import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { Edit3, Trash2, Plus, Star, MapPin, Eye } from "lucide-react";

export default function HostDashboard() {
  const [homes, setHomes] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchHostHomes = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/host/host-home-list");
      if (response.data.success) {
        setHomes(response.data.homes || []);
      }
    } catch (err) {
      console.error("Failed to load host homes:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHostHomes();
  }, []);

  const handleDelete = async (homeId) => {
    if (!window.confirm("Are you sure you want to delete this listing? This action cannot be undone.")) {
      return;
    }

    try {
      const response = await axios.post(`/host/delete-home/${homeId}`);
      if (response.data.success) {
        setHomes(homes.filter(home => home._id !== homeId));
      }
    } catch (err) {
      console.error("Failed to delete listing:", err);
      alert("Error deleting listing. Please try again.");
    }
  };

  return (
    <div>
      {/* Header Panel */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900">Host Dashboard</h1>
          <p className="text-gray-500 text-sm mt-1">Manage and edit your rental properties listed on WanderNest.</p>
        </div>
        <Link
          to="/host/add-home"
          className="flex items-center gap-1.5 self-start sm:self-auto bg-red-500 hover:bg-red-600 text-white font-semibold px-4 py-2.5 rounded-lg shadow-sm text-sm transition-all duration-200"
        >
          <Plus className="h-4 w-4" />
          Add New Property
        </Link>
      </div>

      {/* Grid of listings */}
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-red-500"></div>
        </div>
      ) : homes.length > 0 ? (
        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 text-gray-500 text-xs font-bold uppercase tracking-wider border-b border-gray-200">
                  <th className="p-4 pl-6">Property</th>
                  <th className="p-4">Location</th>
                  <th className="p-4">Price</th>
                  <th className="p-4">Rating</th>
                  <th className="p-4 pr-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 text-sm font-medium text-gray-700">
                {homes.map((home) => {
                  const imageUrl = home.photo 
                    ? (home.photo.startsWith("http") ? home.photo : `http://localhost:3001/${home.photo}`)
                    : "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80";

                  return (
                    <tr key={home._id} className="hover:bg-gray-50 transition-colors">
                      {/* Image + Title */}
                      <td className="p-4 pl-6">
                        <div className="flex items-center gap-4">
                          <img
                            src={imageUrl}
                            alt={home.houseName}
                            className="h-12 w-16 object-cover rounded-lg bg-gray-100 shrink-0"
                          />
                          <span className="font-semibold text-gray-900 line-clamp-1">{home.houseName}</span>
                        </div>
                      </td>

                      {/* Location */}
                      <td className="p-4">
                        <span className="flex items-center gap-1 capitalize text-gray-600">
                          <MapPin className="h-4 w-4 text-gray-400" />
                          {home.location}
                        </span>
                      </td>

                      {/* Price */}
                      <td className="p-4">
                        <span className="font-bold text-gray-900">₹{home.price}</span>
                        <span className="text-gray-500 text-xs font-normal"> / night</span>
                      </td>

                      {/* Rating */}
                      <td className="p-4">
                        <span className="flex items-center gap-1 font-semibold text-amber-500">
                          <Star className="h-4 w-4 fill-current" />
                          {home.rating?.toFixed(1) || "5.0"}
                        </span>
                      </td>

                      {/* Action buttons */}
                      <td className="p-4 pr-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            to={`/homes/${home._id}`}
                            className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                            title="View Public Details"
                          >
                            <Eye className="h-4.5 w-4.5" />
                          </Link>
                          <Link
                            to={`/host/edit-home/${home._id}`}
                            className="p-2 text-blue-500 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Edit Listing"
                          >
                            <Edit3 className="h-4.5 w-4.5" />
                          </Link>
                          <button
                            onClick={() => handleDelete(home._id)}
                            className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete Listing"
                          >
                            <Trash2 className="h-4.5 w-4.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="text-center py-20 bg-white border border-gray-100 rounded-2xl p-8 shadow-sm">
          <Plus className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-950 mb-1.5">No Hosted Properties</h2>
          <p className="text-gray-500 text-sm max-w-sm mx-auto leading-relaxed mb-6">
            Share your space with travelers! Host villas, cabins, or apartments and manage bookings here.
          </p>
          <Link
            to="/host/add-home"
            className="inline-flex items-center gap-1.5 bg-red-500 hover:bg-red-600 text-white font-semibold px-4 py-2.5 rounded-lg shadow-sm text-sm transition-all duration-200"
          >
            Create Your First Listing
          </Link>
        </div>
      )}
    </div>
  );
}
