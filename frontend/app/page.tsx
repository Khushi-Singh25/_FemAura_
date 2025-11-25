"use client";

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Heart, Activity, Stethoscope, MessageCircle, User } from 'lucide-react';

const features = [
  {
    title: "PCOS Awareness",
    description: "Learn about symptoms, causes, and management strategies.",
    icon: Activity,
    link: "/awareness",
    color: "bg-primary/20 text-primary-dark"
  },
  {
    title: "Risk Diagnosis",
    description: "AI-powered PCOS risk assessment using XGBoost technology.",
    icon: Stethoscope,
    link: "/diagnosis",
    color: "bg-accent/30 text-accent-dark"
  },
  {
    title: "Symptom Tracker",
    description: "Track your cycle, symptoms, and mood daily.",
    icon: Heart,
    link: "/tracker",
    color: "bg-warning/30 text-orange-600"
  },
  {
    title: "AI Chatbot",
    description: "24/7 support from our AI gynecologist assistant.",
    icon: MessageCircle,
    link: "/chatbot",
    color: "bg-secondary/30 text-indigo-600"
  },
  {
    title: "Fitness & Nutrition",
    description: "Personalized plans to manage PCOS effectively.",
    icon: User,
    link: "/fitness",
    color: "bg-highlight/40 text-green-700"
  }
];

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 sm:p-20 bg-gradient-to-b from-background to-primary/10">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center max-w-3xl mx-auto mb-16"
      >
        <h1 className="text-5xl sm:text-7xl font-bold mb-6 bg-gradient-to-r from-primary-dark to-secondary bg-clip-text text-transparent">
          FemAura
        </h1>
        <p className="text-xl sm:text-2xl text-foreground/80 mb-8 font-light">
          Your companion for navigating PCOS with confidence, grace, and science.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link href="/diagnosis" className="px-8 py-3 rounded-full bg-primary text-white font-semibold hover:bg-primary-dark transition shadow-lg hover:shadow-xl flex items-center gap-2">
            Check Risk <ArrowRight size={20} />
          </Link>
          <Link href="/awareness" className="px-8 py-3 rounded-full bg-white text-primary-dark border border-primary font-semibold hover:bg-primary/5 transition shadow-md">
            Learn More
          </Link>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl w-full">
        {features.map((feature, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 + index * 0.1 }}
          >
            <Link href={feature.link} className="block h-full">
              <div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-sm hover:shadow-md transition-all hover:-translate-y-1 border border-white/50 h-full flex flex-col items-center text-center">
                <div className={`p-4 rounded-full mb-4 ${feature.color}`}>
                  <feature.icon size={32} />
                </div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-foreground/70">{feature.description}</p>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
