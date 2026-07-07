import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../App";
import { useNavigate } from "react-router-dom";
import HomeCard from "../components/HomeCard";
import { Search, MapPin, SlidersHorizontal } from "lucide-react";

export default function HomeList() {
  const [homes, setHomes] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterLocation, setFilterLocation] = useState("");
  const { isLoggedIn, user } = useAuth();
  const navigate = useNavigate();

  const fetchHomesAndFavs = async () => {
    try {
      setLoading(true);
      const homesResponse = await axios.get("/homes");
      setHomes(homesResponse.data.homes || []);

      if (isLoggedIn && user?.userType === "guest") {
        const favsResponse = await axios.get("/favourites");
        const favIds = (favsResponse.data.favouriteHomes || []).map(item => item._id);
        setFavorites(favIds);
      }
    } catch (err) {
      console.error("Failed to load homes:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHomesAndFavs();
  }, [isLoggedIn, user]);

  const handleFavoriteToggle = async (homeId) => {
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }

    const isFav = favorites.includes(homeId);
    try {
      if (isFav) {
        // Remove from favorites
        await axios.post(`/favourites/delete/${homeId}`);
        setFavorites(favorites.filter(id => id !== homeId));
      } else {
        // Add to favorites
        await axios.post("/favourites", { id: homeId });
        setFavorites([...favorites, homeId]);
      }
    } catch (err) {
      console.error("Favorite toggle failed:", err);
    }
  };

  // Filter listings based on search text and location
  const filteredHomes = homes.filter(home => {
    const matchesSearch = home.houseName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          home.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLocation = filterLocation ? home.location.toLowerCase() === filterLocation.toLowerCase() : true;
    return matchesSearch && matchesLocation;
  });

  // Extract unique locations for the filter select dropdown
  const uniqueLocations = [...new Set(homes.map(h => h.location))];

  return (
    <div>
      {/* Banner / Hero Section */}
      <div className="mb-10 text-center py-10 bg-gradient-to-r from-red-500 to-orange-500 rounded-2xl text-white px-4 shadow-sm relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10">
          <h1 className="text-4xl font-extrabold mb-3">Find Your Nest Away From Home</h1>
          <p className="text-lg opacity-90 font-medium">Explore premium cabins, luxury villas, and traditional townhouses.</p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-8 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search homes, descriptions..."
            className="w-full pl-11 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 text-sm"
          />
        </div>

        <div className="flex w-full md:w-auto items-center gap-3">
          <div className="relative w-full md:w-56">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-gray-400" />
            <select
              value={filterLocation}
              onChange={(e) => setFilterLocation(e.target.value)}
              className="w-full pl-9 pr-8 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 text-sm bg-white capitalize appearance-none"
            >
              <option value="">All Locations</option>
              {uniqueLocations.map((loc, idx) => (
                <option key={idx} value={loc}>{loc}</option>
              ))}
            </select>
          </div>

          <button 
            onClick={() => { setSearchQuery(""); setFilterLocation(""); }}
            className="text-xs font-semibold text-gray-500 hover:text-gray-900 border border-gray-300 py-2.5 px-4 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Clear Filters
          </button>
        </div>
      </div>

      {/* Explore Grid */}
      {loading ? (
        <div className="flex justify-center items-center py-24">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-red-500"></div>
        </div>
      ) : filteredHomes.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredHomes.map((home) => (
            <HomeCard
              key={home._id}
              home={home}
              isFavorite={favorites.includes(home._id)}
              onFavoriteToggle={handleFavoriteToggle}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white rounded-2xl border border-gray-100 p-8 shadow-sm">
          <p className="text-gray-500 text-lg font-medium">No properties found matching your criteria.</p>
          <button 
            onClick={() => { setSearchQuery(""); setFilterLocation(""); }}
            className="mt-4 text-sm font-semibold text-red-500 hover:text-red-600 bg-red-50 px-4 py-2 rounded-lg"
          >
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
}
