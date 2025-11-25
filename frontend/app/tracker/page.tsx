"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Heart, Moon, Activity, TrendingUp, Smile, CloudRain, Sun, ChevronLeft, ChevronRight } from 'lucide-react';
import ProtectedRoute from '@/components/ProtectedRoute';
import axios from 'axios';
import { useAuth } from '@/context/AuthContext';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceArea, ReferenceDot } from 'recharts';
import { format, parseISO, startOfMonth, endOfMonth, addMonths, subMonths } from 'date-fns';

const moodOptions = [
  { label: "Great", icon: Sun, color: "text-yellow-500", score: 3 },
  { label: "Good", icon: Smile, color: "text-green-500", score: 2 },
  { label: "Low", icon: CloudRain, color: "text-blue-500", score: 1 },
  { label: "Very Low", icon: Moon, color: "text-purple-500", score: 0 },
];

const symptomOptions = [
  "Cramps", "Bloating", "Headache", "Fatigue", 
  "Mood Swings", "Acne", "Back Pain", "Breast Tenderness"
];

export default function TrackerPage() {
  const { token } = useAuth();
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  
  // Form State
  const [isPeriodDay, setIsPeriodDay] = useState(false);
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [energyLevel, setEnergyLevel] = useState(3);
  const [painLevel, setPainLevel] = useState(1);
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);

  // Data State
  const [monthlyLogs, setMonthlyLogs] = useState<any[]>([]);
  const [historyLogs, setHistoryLogs] = useState<any[]>([]);

  useEffect(() => {
    if (token) {
      fetchMonthlyData(currentMonth);
      fetchHistoryData();
    }
  }, [currentMonth, token]);

  const fetchMonthlyData = async (date: Date) => {
    try {
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/symptoms/month?year=${year}&month=${month}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      // Format date for chart
      const formattedData = response.data.map((log: any) => ({
        ...log,
        day: format(parseISO(log.date), 'd'), // Day of month for X-axis
        fullDate: format(parseISO(log.date), 'MMM d'),
      }));
      setMonthlyLogs(formattedData);
    } catch (error) {
      console.error("Failed to fetch monthly logs", error);
    }
  };

  const fetchHistoryData = async () => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/symptoms/history?months=3`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setHistoryLogs(response.data.reverse().slice(0, 5)); // Show last 5 entries
    } catch (error) {
      console.error("Failed to fetch history", error);
    }
  };

  const handleSymptomToggle = (symptom: string) => {
    setSelectedSymptoms(prev =>
      prev.includes(symptom) ? prev.filter(s => s !== symptom) : [...prev, symptom]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMood) return alert("Please select a mood");

    setLoading(true);
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/symptoms/log`, {
        date: selectedDate,
        isPeriodDay,
        mood: selectedMood,
        energyLevel,
        painLevel,
        symptoms: selectedSymptoms,
        notes
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      alert('Log saved successfully!');
      fetchMonthlyData(currentMonth);
      fetchHistoryData();
    } catch (error) {
      console.error("Failed to save log", error);
      alert("Failed to save log");
    } finally {
      setLoading(false);
    }
  };

  const handleMonthChange = (direction: 'prev' | 'next') => {
    setCurrentMonth(prev => direction === 'prev' ? subMonths(prev, 1) : addMonths(prev, 1));
  };

  // Custom Dot for Chart to show period days
  const CustomDot = (props: any) => {
    const { cx, cy, payload } = props;
    if (payload.isPeriodDay) {
      return <circle cx={cx} cy={cy} r={6} fill="#e11d48" stroke="none" />;
    }
    return <circle cx={cx} cy={cy} r={4} fill="#8884d8" stroke="none" />;
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-b from-background to-rose-50 py-10 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto"> {/* Increased max-width to allow equal card sizes */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-10"
          >
            <h1 className="text-4xl font-bold mb-3 text-rose-900">Your Symptom & Mood Tracker</h1>
            <p className="text-lg text-gray-600">
              Log how you feel daily. We'll visualize your mood and symptoms to help you understand your body better.
            </p>
          </motion.div>

          {/* Top Row: Equal Width Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Left Column: Log Form */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-3xl p-6 shadow-lg border border-rose-100 h-full"
            >
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-rose-700">
                <Calendar className="text-rose-500" /> Log Today's Details
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                    <input
                      type="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      max={new Date().toISOString().split('T')[0]}
                      className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-rose-200 outline-none"
                    />
                  </div>
                  <div className="flex items-end pb-3">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isPeriodDay}
                        onChange={(e) => setIsPeriodDay(e.target.checked)}
                        className="w-5 h-5 text-rose-500 rounded focus:ring-rose-500"
                      />
                      <span className="font-medium text-rose-700">I'm on my period</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">How is your mood?</label>
                  <div className="grid grid-cols-4 gap-2">
                    {moodOptions.map((option) => (
                      <button
                        key={option.label}
                        type="button"
                        onClick={() => setSelectedMood(option.label)}
                        className={`flex flex-col items-center p-2 rounded-xl border-2 transition-all ${
                          selectedMood === option.label
                            ? "border-rose-400 bg-rose-50"
                            : "border-gray-100 hover:border-rose-200"
                        }`}
                      >
                        <option.icon size={24} className={option.color} />
                        <span className="text-xs mt-1 font-medium">{option.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Energy (1-5)</label>
                    <input
                      type="range"
                      min="1"
                      max="5"
                      value={energyLevel}
                      onChange={(e) => setEnergyLevel(parseInt(e.target.value))}
                      className="w-full accent-rose-500"
                    />
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>Low</span>
                      <span>High</span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Pain (1-5)</label>
                    <input
                      type="range"
                      min="1"
                      max="5"
                      value={painLevel}
                      onChange={(e) => setPainLevel(parseInt(e.target.value))}
                      className="w-full accent-rose-500"
                    />
                     <div className="flex justify-between text-xs text-gray-500">
                      <span>None</span>
                      <span>Severe</span>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Symptoms</label>
                  <div className="flex flex-wrap gap-2">
                    {symptomOptions.map((symptom) => (
                      <button
                        key={symptom}
                        type="button"
                        onClick={() => handleSymptomToggle(symptom)}
                        className={`px-3 py-1.5 rounded-full text-sm border transition-all ${
                          selectedSymptoms.includes(symptom)
                            ? "bg-rose-100 border-rose-300 text-rose-800"
                            : "border-gray-200 hover:border-rose-200"
                        }`}
                      >
                        {symptom}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-rose-500 text-white font-bold rounded-xl hover:bg-rose-600 transition disabled:opacity-50"
                >
                  {loading ? 'Saving...' : 'Log Entry'}
                </button>
              </form>
            </motion.div>

            {/* Right Column: Graph - Equal Height/Width */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-3xl p-6 shadow-lg border border-rose-100 h-full flex flex-col"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                  <Activity className="text-blue-500" /> Mood Trends
                </h2>
                <div className="flex items-center gap-2 bg-gray-50 rounded-lg p-1">
                  <button onClick={() => handleMonthChange('prev')} className="p-1 hover:bg-gray-200 rounded"><ChevronLeft size={20} /></button>
                  <span className="text-sm font-semibold min-w-[100px] text-center">
                    {format(currentMonth, 'MMMM yyyy')}
                  </span>
                  <button onClick={() => handleMonthChange('next')} className="p-1 hover:bg-gray-200 rounded"><ChevronRight size={20} /></button>
                </div>
              </div>

              {/* Made chart fill remaining height to match form height */}
              <div className="flex-grow min-h-[400px] w-full">
                {monthlyLogs.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={monthlyLogs}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="day" />
                      <YAxis domain={[0, 3]} hide />
                      <Tooltip 
                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                        labelFormatter={(label) => `Day ${label}`}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="moodScore" 
                        stroke="#8884d8" 
                        strokeWidth={3}
                        dot={<CustomDot />}
                        activeDot={{ r: 8 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                   <div className="h-full flex items-center justify-center text-gray-400">
                     No data for this month
                   </div>
                )}
              </div>
              <div className="flex justify-center gap-4 mt-4 text-xs text-gray-500">
                <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-rose-600"></div> Period Day</div>
                <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-[#8884d8]"></div> Normal Day</div>
              </div>
            </motion.div>
          </div>

          {/* Bottom Row: History - Full Width */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-3xl p-6 shadow-lg border border-rose-100 w-full"
          >
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <TrendingUp className="text-green-500" /> Recent History
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {historyLogs.map((log: any, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100">
                  <div>
                    <div className="font-semibold text-gray-800">{format(parseISO(log.date), 'MMM d, yyyy')}</div>
                    <div className="text-xs text-gray-500 flex gap-2">
                       <span>Mood: {log.mood}</span>
                       {log.isPeriodDay && <span className="text-rose-500 font-bold">• Period</span>}
                    </div>
                  </div>
                  <div className="text-xs text-gray-400 max-w-[150px] truncate">
                    {log.symptoms.join(', ')}
                  </div>
                </div>
              ))}
            </div>
            {historyLogs.length === 0 && (
              <p className="text-center text-gray-400 py-4">No recent logs found.</p>
            )}
          </motion.div>

        </div>
      </div>
    </ProtectedRoute>
  );
}
