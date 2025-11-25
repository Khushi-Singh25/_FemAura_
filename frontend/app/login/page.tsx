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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Send as JSON for Node backend
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/token`, {
        username,
        password
      });
      login(response.data.access_token);
    } catch (err) {
      setError("Invalid username or password");
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
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full mt-1 p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-rose-200 outline-none"
              required
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
            />
          </div>
          <button
            type="submit"
            className="w-full py-3 bg-rose-500 text-white font-semibold rounded-xl hover:bg-rose-600 transition"
          >
            Login
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

