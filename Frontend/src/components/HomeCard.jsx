import React from "react";
import { Link } from "react-router-dom";
import { Star, Heart } from "lucide-react";
import { useAuth } from "../App";

export default function HomeCard({ home, isFavorite, onFavoriteToggle }) {
  const { isLoggedIn, user } = useAuth();
  
  // Format image URL dynamically (checks if photo starts with http, otherwise prefixes backend baseURL)
  const imageUrl = home.photo 
    ? (home.photo.startsWith("http") ? home.photo : `http://localhost:3001/${home.photo}`)
    : "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80";

  return (
    <div className="group bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 flex flex-col justify-between relative">
      {/* Favorite Heart Button (Only visible for guests or non-logged in users) */}
      {(!isLoggedIn || user?.userType === "guest") && (
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onFavoriteToggle(home._id);
          }}
          className="absolute top-3 right-3 z-10 bg-white/80 backdrop-blur-sm p-2 rounded-full shadow-sm hover:scale-105 transition-all duration-150 text-gray-500 hover:text-red-500"
        >
          <Heart 
            className={`h-4.5 w-4.5 ${isFavorite ? "fill-red-500 text-red-500" : "text-gray-600"}`} 
          />
        </button>
      )}

      {/* Card Image and Details Link */}
      <Link to={`/homes/${home._id}`} className="block">
        <div className="relative aspect-video overflow-hidden bg-gray-100">
          <img
            src={imageUrl}
            alt={home.houseName}
            className="w-full h-full object-cover group-hover:scale-[1.03] transition-all duration-300"
          />
        </div>
        
        <div className="p-4 flex flex-col justify-between flex-grow">
          <div>
            <div className="flex justify-between items-start gap-2 mb-1.5">
              <h3 className="font-semibold text-gray-900 group-hover:text-red-500 line-clamp-1 transition-colors duration-200">
                {home.houseName}
              </h3>
              <div className="flex items-center gap-1 shrink-0 text-amber-500 font-medium text-sm">
                <Star className="h-4.5 w-4.5 fill-current" />
                <span>{home.rating?.toFixed(1) || "5.0"}</span>
              </div>
            </div>

            <p className="text-gray-500 text-sm mb-3 font-medium capitalize">{home.location}</p>
            <p className="text-gray-600 text-xs line-clamp-2 leading-relaxed mb-4">{home.description}</p>
          </div>
        </div>
      </Link>

      {/* Footer / Price Panel */}
      <div className="p-4 pt-0 border-t border-gray-50 flex items-center justify-between mt-auto">
        <span className="text-gray-900 font-bold text-lg">
          ₹{home.price} <span className="text-gray-500 font-normal text-sm">/ night</span>
        </span>
        <Link 
          to={`/homes/${home._id}`} 
          className="text-xs font-semibold text-red-500 hover:text-red-600 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg transition-all duration-200"
        >
          View Details
        </Link>
      </div>
    </div>
  );
}
