import React, { createContext, useContext, useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import axios from "axios";
import Navbar from "./components/Navbar";
import HomeList from "./pages/HomeList";
import HomeDetail from "./pages/HomeDetail";
import Favourites from "./pages/Favourites";
import HostDashboard from "./pages/HostDashboard";
import EditHomeForm from "./pages/EditHomeForm";
import Login from "./pages/Login";
import Signup from "./pages/Signup";

// Axios defaults for credential sharing (express-session cookie)
axios.defaults.withCredentials = true;
axios.defaults.baseURL = import.meta.env.VITE_API_URL;

export const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  const checkAuthStatus = async () => {
    try {
      const response = await axios.get("/api/check-auth");
      if (response.data.isLoggedIn) {
        setUser(response.data.user);
        setIsLoggedIn(true);
      } else {
        setUser(null);
        setIsLoggedIn(false);
      }
    } catch (err) {
      console.error("Auth check failed:", err);
      setUser(null);
      setIsLoggedIn(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await axios.post("/login", { email, password });
      if (response.data.success) {
        setUser(response.data.user);
        setIsLoggedIn(true);
        return { success: true };
      }
      return { success: false, errors: response.data.errors || ["Login failed."] };
    } catch (err) {
      return { success: false, errors: err.response?.data?.errors || ["Network error during login."] };
    }
  };

  const signup = async (formData) => {
    try {
      const response = await axios.post("/signup", formData);
      if (response.data.success) {
        return { success: true };
      }
      return { success: false, errors: response.data.errors || ["Registration failed."] };
    } catch (err) {
      return { success: false, errors: err.response?.data?.errors || ["Registration failed."] };
    }
  };

  const logout = async () => {
    try {
      await axios.post("/logout");
      setUser(null);
      setIsLoggedIn(false);
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoggedIn, loading, login, signup, logout, checkAuthStatus }}>
      {children}
    </AuthContext.Provider>
  );
};

const ProtectedRoute = ({ children }) => {
  const { isLoggedIn, loading } = useAuth();
  if (loading) return <div className="flex justify-center items-center h-screen">Loading...</div>;
  return isLoggedIn ? children : <Navigate to="/login" />;
};

const HostRoute = ({ children }) => {
  const { user, isLoggedIn, loading } = useAuth();
  if (loading) return <div className="flex justify-center items-center h-screen">Loading...</div>;
  if (!isLoggedIn) return <Navigate to="/login" />;
  return user?.userType === "host" ? children : <Navigate to="/" />;
};

function AppRoutes() {
  const { loading } = useAuth();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-between">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8 max-w-7xl">
        <Routes>
          <Route path="/" element={<HomeList />} />
          <Route path="/homes/:homeId" element={<HomeDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          
          <Route path="/favourites" element={
            <ProtectedRoute>
              <Favourites />
            </ProtectedRoute>
          } />

          <Route path="/host/homes" element={
            <HostRoute>
              <HostDashboard />
            </HostRoute>
          } />

          <Route path="/host/add-home" element={
            <HostRoute>
              <EditHomeForm />
            </HostRoute>
          } />

          <Route path="/host/edit-home/:homeId" element={
            <HostRoute>
              <EditHomeForm />
            </HostRoute>
          } />
          
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
      <footer className="bg-white border-t border-gray-200 py-6 mt-12 text-center text-gray-500 text-sm">
        <p>&copy; {new Date().getFullYear()} WanderNest Inc. Made with ❤️ by Reshab</p>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}
