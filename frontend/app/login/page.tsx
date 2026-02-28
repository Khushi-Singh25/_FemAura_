"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import axios from "axios";
import Link from "next/link";
import { motion } from "framer-motion";

export default function LoginPage() {
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setLoadingMessage("Connecting to server...");
    
    try {
      // Add timeout to show better feedback
      const timeout = setTimeout(() => {
        setLoadingMessage("Server is waking up (this may take a moment on first login)...");
      }, 3000);

      // Send as JSON for Node backend with longer timeout
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/token`, 
        { username, password },
        { timeout: 60000 }  // 60 second timeout for cold starts
      );
      
      clearTimeout(timeout);
      setLoadingMessage("Login successful!");
      login(response.data.access_token);
    } catch (err: any) {
      if (err.code === 'ECONNABORTED') {
        setError("Server is taking longer than expected. Please try again.");
      } else if (err.response?.status === 401) {
        setError("Invalid username or password");
      } else if (err.code === 'ERR_NETWORK') {
        setError("Cannot connect to server. Please check if backend is running.");
      } else {
        setError("An error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
      setLoadingMessage("");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-rose-50 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-8 rounded-2xl shadow-lg max-w-md w-full"
      >
        <h2 className="text-3xl font-bold text-center text-rose-700 mb-6">Welcome Back</h2>
        
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-4">
            {error}
          </div>
        )}
        
        {loadingMessage && (
          <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-xl mb-4 flex items-center gap-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-700"></div>
            <span>{loadingMessage}</span>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full mt-1 p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-rose-200 outline-none"
              required
              disabled={loading}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full mt-1 p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-rose-200 outline-none"
              required
              disabled={loading}
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-rose-500 text-white font-semibold rounded-xl hover:bg-rose-600 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>Logging in...</span>
              </>
            ) : (
              'Login'
            )}
          </button>
        </form>
        <p className="text-center mt-4 text-sm text-gray-600">
          Don't have an account?{" "}
          <Link href="/register" className="text-rose-600 font-medium hover:underline">
            Register
          </Link>
        </p>
      </motion.div>
    </div>
  );
}

