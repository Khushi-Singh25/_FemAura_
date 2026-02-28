"use client";

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";

export default function RegisterPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setLoadingMessage("Creating your account...");
    
    try {
      // Add timeout to show better feedback
      const timeout = setTimeout(() => {
        setLoadingMessage("Server is waking up (this may take a moment)...");
      }, 3000);

      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/register`, 
        { username, email, password },
        { timeout: 60000 }  // 60 second timeout for cold starts
      );
      
      clearTimeout(timeout);
      setSuccess(true);
      setLoadingMessage("Account created! Redirecting to login...");
      
      // Redirect after 2 seconds
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch (err: any) {
      if (err.code === 'ECONNABORTED') {
        setError("Server is taking longer than expected. Please try again.");
      } else if (err.response?.status === 400) {
        setError(err.response?.data?.detail || "Registration failed");
      } else if (err.code === 'ERR_NETWORK') {
        setError("Cannot connect to server. Please check if backend is running.");
      } else {
        setError(err.response?.data?.detail || "Registration failed. Please try again.");
      }
    } finally {
      if (!success) {
        setLoading(false);
        setLoadingMessage("");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-rose-50 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-8 rounded-2xl shadow-lg max-w-md w-full"
      >
        <h2 className="text-3xl font-bold text-center text-rose-700 mb-6">Create Account</h2>
        
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-4">
            {error}
          </div>
        )}
        
        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl mb-4 flex items-center gap-2">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>{loadingMessage}</span>
          </div>
        )}
        
        {loadingMessage && !success && (
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
              minLength={3}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
              minLength={6}
            />
            <p className="text-xs text-gray-500 mt-1">Minimum 6 characters</p>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-rose-500 text-white font-semibold rounded-xl hover:bg-rose-600 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>Creating account...</span>
              </>
            ) : (
              'Register'
            )}
          </button>
        </form>
        <p className="text-center mt-4 text-sm text-gray-600">
          Already have an account?{" "}
          <Link href="/login" className="text-rose-600 font-medium hover:underline">
            Login
          </Link>
        </p>
      </motion.div>
    </div>
  );
}

