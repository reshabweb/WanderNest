import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { Star, MapPin, ArrowLeft, ShieldCheck, Sparkles } from "lucide-react";

export default function HomeDetail() {
  const { homeId } = useParams();
  const [home, setHome] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reserved, setReserved] = useState(false);
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHomeDetails = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/homes/${homeId}`);
        if (response.data.success) {
          setHome(response.data.home);
        } else {
          navigate("/");
        }
      } catch (err) {
        console.error("Error loading home details:", err);
        navigate("/");
      } finally {
        setLoading(false);
      }
    };

    fetchHomeDetails();
  }, [homeId, navigate]);

  const handleReserve = (e) => {
    e.preventDefault();
    if (!checkIn || !checkOut) {
      alert("Please select check-in and check-out dates.");
      return;
    }
    setReserved(true);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-32">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-red-500"></div>
      </div>
    );
  }

  if (!home) return null;

  const imageUrl = home.photo 
    ? (home.photo.startsWith("http") ? home.photo : `http://localhost:3001/${home.photo}`)
    : "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80";

  return (
    <div className="max-w-5xl mx-auto">
      {/* Back Button */}
      <Link to="/" className="inline-flex items-center gap-1.5 text-sm font-semibold text-gray-500 hover:text-gray-900 mb-6 group transition-colors">
        <ArrowLeft className="h-4 w-4 group-hover:-translate-x-0.5 transition-transform" />
        Back to listings
      </Link>

      {/* Title Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-2">{home.houseName}</h1>
        <div className="flex items-center gap-4 text-sm font-medium">
          <div className="flex items-center gap-1 text-amber-500">
            <Star className="h-4 w-4 fill-current" />
            <span>{home.rating?.toFixed(1) || "5.0"}</span>
          </div>
          <span className="text-gray-300">•</span>
          <div className="flex items-center gap-1 text-gray-600 capitalize">
            <MapPin className="h-4 w-4" />
            <span>{home.location}</span>
          </div>
        </div>
      </div>

      {/* Hero Image */}
      <div className="rounded-2xl overflow-hidden shadow-md aspect-video max-h-[480px] bg-gray-100 mb-8">
        <img src={imageUrl} alt={home.houseName} className="w-full h-full object-cover" />
      </div>

      {/* Main Details Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Left Side Info */}
        <div className="lg:col-span-2">
          <div className="border-b border-gray-200 pb-6 mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-red-500" />
              About this rental space
            </h2>
            <p className="text-gray-600 leading-relaxed whitespace-pre-line text-base">{home.description}</p>
          </div>

          <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
            <h3 className="font-bold text-gray-900 mb-3">Rental Highlights</h3>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm font-medium text-gray-600">
              <li className="flex items-center gap-2">
                <ShieldCheck className="h-4.5 w-4.5 text-green-500 shrink-0" />
                Verified Premium Host
              </li>
              <li className="flex items-center gap-2">
                <ShieldCheck className="h-4.5 w-4.5 text-green-500 shrink-0" />
                Geothermal Eco-Friendly Build
              </li>
              <li className="flex items-center gap-2">
                <ShieldCheck className="h-4.5 w-4.5 text-green-500 shrink-0" />
                Free high-speed WiFi connectivity
              </li>
              <li className="flex items-center gap-2">
                <ShieldCheck className="h-4.5 w-4.5 text-green-500 shrink-0" />
                Flexible Check-In window
              </li>
            </ul>
          </div>
        </div>

        {/* Right Side Reservation Panel */}
        <div>
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-md sticky top-24">
            {reserved ? (
              <div className="text-center py-6">
                <div className="bg-green-50 border border-green-200 text-green-700 p-4 rounded-xl mb-4 font-semibold text-sm">
                  Reservation request submitted successfully!
                </div>
                <p className="text-gray-500 text-xs">The host will review your request and contact you via email shortly.</p>
                <button 
                  onClick={() => setReserved(false)} 
                  className="mt-6 text-sm font-semibold text-red-500 hover:text-red-600 bg-red-50 hover:bg-red-100 px-4 py-2 rounded-lg transition-colors w-full"
                >
                  Book Another Date
                </button>
              </div>
            ) : (
              <form onSubmit={handleReserve}>
                <div className="flex justify-between items-baseline mb-6">
                  <span className="text-2xl font-bold text-gray-900">₹{home.price}</span>
                  <span className="text-gray-500 text-sm">/ night</span>
                </div>

                <div className="border border-gray-300 rounded-xl overflow-hidden mb-6">
                  <div className="grid grid-cols-2 divide-x divide-gray-300">
                    <div className="p-3">
                      <label className="block text-[10px] font-bold text-gray-700 uppercase mb-1">Check-in</label>
                      <input
                        type="date"
                        value={checkIn}
                        onChange={(e) => setCheckIn(e.target.value)}
                        className="w-full text-xs font-semibold text-gray-900 focus:outline-none bg-transparent"
                        required
                      />
                    </div>
                    <div className="p-3">
                      <label className="block text-[10px] font-bold text-gray-700 uppercase mb-1">Check-out</label>
                      <input
                        type="date"
                        value={checkOut}
                        onChange={(e) => setCheckOut(e.target.value)}
                        className="w-full text-xs font-semibold text-gray-900 focus:outline-none bg-transparent"
                        required
                      />
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-4 rounded-xl shadow-sm transition-all duration-200 text-base"
                >
                  Reserve Space
                </button>
                <p className="text-center text-xs text-gray-500 mt-4">You won't be charged immediately.</p>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
