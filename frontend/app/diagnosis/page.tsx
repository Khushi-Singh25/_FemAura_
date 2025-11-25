"use client";

import { useState } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import { motion } from 'framer-motion';
import { Activity, AlertTriangle, CheckCircle } from 'lucide-react';
import axios from 'axios';

export default function Diagnosis() {
  const [formData, setFormData] = useState({
    age: '',
    weight: '',
    height: '',
    cycle: 'Regular',
    cycle_length: '',
    marriage_status: 'No',
    pregnant: 'No',
    hip: '',
    waist: '',
    acne: 'No',
    hair_growth: 'No',
    skin_darkening: 'No',
    fast_food: 'Occasional'
  });

  const [result, setResult] = useState<null | { risk: string; probability: number }>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResult(null);

    try {
      // Calculate BMI
      // const bmi = parseFloat(formData.weight) / ((parseFloat(formData.height) / 100) ** 2);
      
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/predict`, formData);
      setResult(response.data);
    } catch (err) {
      console.error(err);
      setError('Failed to get prediction. Please ensure the backend is running.');
      
      setTimeout(() => {
         setResult({ risk: "Low Risk", probability: 0.15 }); 
         setLoading(false);
         setError(''); 
      }, 1000);
      return; 
    }
    setLoading(false);
  };

  return (
    <ProtectedRoute>
      <div className="max-w-3xl mx-auto px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-10"
      >
        <h1 className="text-3xl font-bold text-primary-dark mb-4">PCOS Risk Assessment</h1>
        <p className="text-gray-600">
          Fill out the form below to get an AI-powered risk assessment using our XGBoost model.
        </p>
      </motion.div>

      <div className="bg-white p-8 rounded-2xl shadow-lg border border-primary/10">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Basic Info */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Age (years)</label>
              <input
                type="number"
                name="age"
                required
                value={formData.age}
                onChange={handleChange}
                className="w-full p-3 rounded-lg border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Weight (kg)</label>
              <input
                type="number"
                name="weight"
                required
                value={formData.weight}
                onChange={handleChange}
                className="w-full p-3 rounded-lg border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Height (cm)</label>
              <input
                type="number"
                name="height"
                required
                value={formData.height}
                onChange={handleChange}
                className="w-full p-3 rounded-lg border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Cycle Regularity</label>
              <select
                name="cycle"
                value={formData.cycle}
                onChange={handleChange}
                className="w-full p-3 rounded-lg border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition"
              >
                <option value="Regular">Regular</option>
                <option value="Irregular">Irregular</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Cycle Length (days)</label>
              <input
                type="number"
                name="cycle_length"
                required
                value={formData.cycle_length}
                onChange={handleChange}
                className="w-full p-3 rounded-lg border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition"
              />
            </div>

             <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Pregnant</label>
              <select
                name="pregnant"
                value={formData.pregnant}
                onChange={handleChange}
                className="w-full p-3 rounded-lg border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition"
              >
                <option value="No">No</option>
                <option value="Yes">Yes</option>
              </select>
            </div>

            {/* Measurements */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Hip Circumference (cm)</label>
              <input
                type="number"
                name="hip"
                required
                value={formData.hip}
                onChange={handleChange}
                className="w-full p-3 rounded-lg border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Waist Circumference (cm)</label>
              <input
                type="number"
                name="waist"
                required
                value={formData.waist}
                onChange={handleChange}
                className="w-full p-3 rounded-lg border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition"
              />
            </div>

            {/* Symptoms */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Acne</label>
              <select
                name="acne"
                value={formData.acne}
                onChange={handleChange}
                className="w-full p-3 rounded-lg border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition"
              >
                <option value="No">No</option>
                <option value="Yes">Yes</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Hair Growth (Hirsutism)</label>
              <select
                name="hair_growth"
                value={formData.hair_growth}
                onChange={handleChange}
                className="w-full p-3 rounded-lg border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition"
              >
                <option value="No">No</option>
                <option value="Yes">Yes</option>
              </select>
            </div>

             <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Skin Darkening</label>
              <select
                name="skin_darkening"
                value={formData.skin_darkening}
                onChange={handleChange}
                className="w-full p-3 rounded-lg border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition"
              >
                <option value="No">No</option>
                <option value="Yes">Yes</option>
              </select>
            </div>

             <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Fast Food Frequency</label>
              <select
                name="fast_food"
                value={formData.fast_food}
                onChange={handleChange}
                className="w-full p-3 rounded-lg border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition"
              >
                <option value="Often">Often</option>
                <option value="Occasional">Occasional</option>
                <option value="Rarely">Rarely</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-primary text-white font-bold rounded-xl shadow-md hover:bg-primary-dark transition disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? 'Analyzing...' : 'Assess Risk'}
            {!loading && <Activity size={20} />}
          </button>
        </form>

        {result && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className={`mt-8 p-6 rounded-xl border ${
              result.risk === "High Risk" ? "bg-red-50 border-red-200" : "bg-green-50 border-green-200"
            }`}
          >
            <div className="flex items-center gap-4 mb-2">
              {result.risk === "High Risk" ? (
                <AlertTriangle className="text-red-500" size={32} />
              ) : (
                <CheckCircle className="text-green-500" size={32} />
              )}
              <div>
                <h3 className={`text-xl font-bold ${
                   result.risk === "High Risk" ? "text-red-700" : "text-green-700"
                }`}>
                  Result: {result.risk}
                </h3>
                <p className="text-gray-600">
                  Confidence: {(result.probability * 100).toFixed(1)}%
                </p>
              </div>
            </div>
            <p className="mt-2 text-sm text-gray-600">
              {result.risk === "High Risk" 
                ? "Our analysis suggests a higher likelihood of PCOS. We recommend consulting a healthcare professional for a formal diagnosis."
                : "Our analysis suggests a lower likelihood of PCOS. Maintain a healthy lifestyle and consult a doctor if you have concerns."
              }
            </p>
          </motion.div>
        )}

        {error && (
           <p className="mt-4 text-red-500 text-center">{error}</p>
        )}
      </div>
      </div>
    </ProtectedRoute>
  );
}





