"use client";

import ProtectedRoute from '@/components/ProtectedRoute';
import { motion } from 'framer-motion';
import { Heart, AlertCircle, Scale, Moon, Zap, TrendingUp } from 'lucide-react';

const symptoms = [
  {
    icon: Moon,
    title: "Irregular Periods",
    description: "Cycles longer than 35 days or fewer than 8 periods a year."
  },
  {
    icon: Scale,
    title: "Weight Changes",
    description: "Difficulty losing weight or sudden weight gain, especially around the abdomen."
  },
  {
    icon: Heart,
    title: "Hormonal Imbalances",
    description: "Excess androgens leading to acne, excessive hair growth, or hair loss."
  },
  {
    icon: Zap,
    title: "Insulin Resistance",
    description: "Difficulty regulating blood sugar, increasing diabetes risk."
  }
];

const managementTips = [
  {
    title: "Healthy Diet",
    description: "Focus on whole foods, low-glycemic index carbs, and balanced macros."
  },
  {
    title: "Regular Exercise",
    description: "Combine cardio with strength training to improve insulin sensitivity."
  },
  {
    title: "Stress Management",
    description: "Practice yoga, meditation, or mindfulness to regulate cortisol levels."
  },
  {
    title: "Medical Support",
    description: "Work with healthcare providers for proper diagnosis and treatment plans."
  }
];

export default function AwarenessPage() {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-b from-background to-primary/5 py-20 px-4 sm:px-8">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl sm:text-5xl font-bold mb-4 bg-gradient-to-r from-primary-dark to-secondary bg-clip-text text-transparent">
            Understanding PCOS
          </h1>
          <p className="text-lg text-foreground/70 max-w-3xl mx-auto">
            Polycystic Ovary Syndrome (PCOS) affects 1 in 10 women of reproductive age. 
            Learn about symptoms, causes, and how to manage this condition effectively.
          </p>
        </motion.div>

        {/* What is PCOS Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 sm:p-12 mb-12 shadow-lg border border-white/50"
        >
          <div className="flex items-start gap-4 mb-6">
            <div className="p-3 rounded-full bg-primary/20 text-primary-dark">
              <AlertCircle size={28} />
            </div>
            <div>
              <h2 className="text-3xl font-bold mb-4">What is PCOS?</h2>
              <p className="text-foreground/80 leading-relaxed mb-4">
                PCOS is a hormonal disorder that affects how the ovaries work. It's characterized by:
              </p>
              <ul className="list-disc list-inside space-y-2 text-foreground/80">
                <li>Irregular or absent menstrual periods</li>
                <li>Excess androgen (male hormones) levels</li>
                <li>Polycystic ovaries (enlarged ovaries with small cysts)</li>
              </ul>
            </div>
          </div>
        </motion.div>

        {/* Common Symptoms */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Common Symptoms</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {symptoms.map((symptom, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-sm hover:shadow-md transition-all border border-white/50"
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-full bg-accent/20 text-accent-dark">
                    <symptom.icon size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">{symptom.title}</h3>
                    <p className="text-foreground/70">{symptom.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Management Strategies */}
        <div className="mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <h2 className="text-3xl font-bold text-center mb-4">Management Strategies</h2>
            <p className="text-center text-foreground/70 mb-8 max-w-2xl mx-auto">
              While there's no cure for PCOS, these strategies can help manage symptoms effectively.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {managementTips.map((tip, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + index * 0.1 }}
                className="bg-gradient-to-br from-primary/10 to-secondary/10 p-6 rounded-2xl border border-primary/20"
              >
                <div className="flex items-center gap-2 mb-3">
                  <TrendingUp size={20} className="text-primary-dark" />
                  <h3 className="text-xl font-bold">{tip.title}</h3>
                </div>
                <p className="text-foreground/70">{tip.description}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="bg-gradient-to-r from-primary to-secondary p-8 rounded-3xl text-center text-white"
        >
          <h3 className="text-2xl font-bold mb-4">Ready to Take Control?</h3>
          <p className="mb-6 text-white/90">
            Use our AI-powered diagnosis tool to assess your PCOS risk and get personalized recommendations.
          </p>
          <a 
            href="/diagnosis" 
            className="inline-block px-8 py-3 bg-white text-primary-dark rounded-full font-semibold hover:bg-white/90 transition shadow-lg"
          >
            Check Your Risk
          </a>
        </motion.div>
      </div>
      </div>
    </ProtectedRoute>
  );
}


