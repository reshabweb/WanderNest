import React, { useState, useEffect } from "react";
import axios from "axios";
import HomeCard from "../components/HomeCard";
import { Heart, Search } from "lucide-react";

export default function Favourites() {
  const [favouriteHomes, setFavouriteHomes] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchFavourites = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/favourites");
      if (response.data.success) {
        setFavouriteHomes(response.data.favouriteHomes || []);
      }
    } catch (err) {
      console.error("Failed to load favourites:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFavourites();
  }, []);

  const handleFavoriteToggle = async (homeId) => {
    try {
      // Remove from favorites immediately since we are in the favorites page
      await axios.post(`/favourites/delete/${homeId}`);
      setFavouriteHomes(favouriteHomes.filter(home => home._id !== homeId));
    } catch (err) {
      console.error("Failed to remove favourite:", err);
    }
  };

  return (
    <div>
      <div className="flex items-center gap-2 mb-8">
        <Heart className="h-7 w-7 text-red-500 fill-current" />
        <h1 className="text-3xl font-extrabold text-gray-900">My Favourites</h1>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-red-500"></div>
        </div>
      ) : favouriteHomes.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {favouriteHomes.map((home) => (
            <HomeCard
              key={home._id}
              home={home}
              isFavorite={true} // In favourites view, they are all favorited
              onFavoriteToggle={handleFavoriteToggle}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-24 bg-white border border-gray-100 rounded-2xl p-8 shadow-sm">
          <Heart className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-950 mb-1.5">No Favourites Yet</h2>
          <p className="text-gray-500 text-sm max-w-sm mx-auto leading-relaxed">
            As you explore WanderNest, click the heart icon on properties to save them here for your next getaway.
          </p>
        </div>
      )}
    </div>
  );
}
