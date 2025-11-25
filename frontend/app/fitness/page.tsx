"use client";

import ProtectedRoute from '@/components/ProtectedRoute';
import { motion } from 'framer-motion';
import { Apple, Heart, Leaf, Sun, Smile, Youtube } from 'lucide-react';

const yogaPoses = [
  {
    name: "Butterfly Pose (Baddha Konasana)",
    desc: "A gentle hip opener that improves pelvic blood flow.",
    image: "https://imgix.bustle.com/uploads/getty/2023/7/21/f1edf317-c24e-4170-9876-c0f8a86c61d9-getty-1498471575.jpg?w=800&h=534&fit=crop&crop=focalpoint&fp-x=0.5507&fp-y=0.3792&dpr=2",
    youtubeLink: "https://www.youtube.com/watch?v=4J7kbCmPScQ"
  },
  {
    name: "Mountain Pose (Tadasana)",
    desc: "Improves posture & balance.",
    image: "https://blog.anaheart.co.uk/wp-content/uploads/2018/07/mountain-yoga-pose.png",
    youtubeLink: "https://www.youtube.com/shorts/E1xym-F_B84"
  },
  {
    name: "Bridge Pose (Setu Bandhasana)",
    desc: "Strengthens core & improves metabolism.",
    image: "https://www.arhantayoga.org/wp-content/uploads/2022/12/Half-Bridge-Pose-Ardha-Setu-Bandhasana-1.jpg",
    youtubeLink: "https://www.youtube.com/watch?v=SoOepykWJLw"
  },
  {
    name: "Cobra Pose (Bhujangasana)",
    desc: "Stimulates reproductive organs.",
    image: "https://rishikeshashtangayogaschool.com/blog/wp-content/uploads/2021/11/cobra-pose_11zon.jpg",
    youtubeLink: "https://www.youtube.com/watch?v=f7q3YeotCP0"
  },
  {
    name: "Half Moon Pose (Ardha Chandrasana)",
    desc: "Improves stability & opens hips.",
    image: "https://fitsri.com/wp-content/uploads/2020/03/half-moon-pose.jpg",
    youtubeLink: "https://www.youtube.com/watch?v=hDcDQdSeds8"
  },
  {
    name: "Cat–Cow Stretch (Marjaryasana–Bitilasana)",
    desc: "Reduces stomach bloating & improves hormonal health.",
    image: "https://www.verywellfit.com/thmb/l6miyM_PWM5IAPLcyC53eyWLm6U=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/About-A2-CatCow-017-570d44f55f9b581408773407.jpg",
    youtubeLink: "https://www.youtube.com/watch?v=LIVJZZyZ2qM"
  },
  {
    name: "Chair Pose (Utkatasana)",
    desc: "Strengthens lower body & metabolism.",
    image: "https://www.theyogacollective.com/wp-content/uploads/2019/10/Chair-Pose-2-for-Pose-Page-1200x800.jpeg",
    youtubeLink: "https://www.youtube.com/watch?v=tIJp9ySBr1s"
  },
  {
    name: "Child’s Pose (Balasana)",
    desc: "Relaxation and stress relief.",
    image: "https://www.theyogacollective.com/wp-content/uploads/2019/10/4143473057707883372_IMG_8546-2-e1572149256273.jpg",
    youtubeLink: "https://www.youtube.com/watch?v=EniGBCHAEVQ"
  },
  {
    name: "Lotus Pose (Padmasana)",
    desc: "Calms mind and regulates hormones.",
    image: "https://www.rishikulyogshalarishikesh.com/blog/wp-content/uploads/2024/03/half-lotus-pose.jpg",
    youtubeLink: "https://www.youtube.com/watch?v=YDCUjIMk7UQ"
  },
  {
    name: "Supine Twist (Supta Matsyendrasana)",
    desc: "Helps digestion & lower back pain.",
    image: "https://yogaposesandbenefits.com/wp-content/uploads/2024/08/supine-spinal-twist-yoga-pose-supine-spinal-twist-post-in-yoga.jpg",
    youtubeLink: "https://www.youtube.com/watch?v=_EdrLJViMrI"
  }
];

const nutritionTips = [
  {
    icon: Apple,
    title: "Friendly Carbs",
    description: "Focus on slow-digesting carbs like quinoa and sweet potatoes that keep energy steady.",
    examples: "Oats, berries, brown rice"
  },
  {
    icon: Heart,
    title: "Nourishing Proteins",
    description: "Adding protein to meals helps you feel full and balances blood sugar.",
    examples: "Chicken, lentils, eggs, tofu"
  },
  {
    icon: Leaf,
    title: "Anti-Inflammatory",
    description: "Foods that gently reduce inflammation and support your body's healing.",
    examples: "Turmeric, ginger, green tea, dark greens"
  },
  {
    icon: Sun,
    title: "Seed Cycling",
    description: "A natural way to support your monthly cycle using different seeds.",
    examples: "Flax & pumpkin (Phase 1), Sesame & sunflower (Phase 2)"
  }
];

export default function FitnessPage() {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-b from-rose-50 to-white py-20 px-4 sm:px-8 font-sans">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl sm:text-5xl font-bold mb-6 text-rose-900">
            Movement & Nourishment
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Discover gentle ways to move your body and nourishing foods that support your PCOS journey. 
            Focus on what makes you feel good, balanced, and strong.
          </p>
        </motion.div>

        {/* Yoga Section */}
        <div className="mb-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex items-center justify-center gap-3 mb-10"
          >
            <div className="p-3 rounded-full bg-purple-100 text-purple-600">
              <Smile size={28} />
            </div>
            <h2 className="text-3xl font-semibold text-gray-800">Yoga for Balance</h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {yogaPoses.map((pose, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                className="bg-white rounded-2xl p-4 shadow-sm border border-purple-50 flex flex-col hover:shadow-md transition-all"
              >
                <div className="w-full h-48 mb-4 rounded-xl overflow-hidden relative group">
                  <img 
                    src={pose.image} 
                    alt={pose.name} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <a 
                    href={pose.youtubeLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  >
                     <div className="bg-white text-red-600 rounded-full p-3">
                       <Youtube size={24} fill="currentColor" />
                  </div>
                  </a>
                </div>
                <h3 className="font-semibold text-lg mb-1 text-gray-800 leading-tight">{pose.name}</h3>
                <p className="text-sm text-gray-600 leading-relaxed mb-3 flex-grow">{pose.desc}</p>
                <a 
                  href={pose.youtubeLink} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-xs font-medium text-purple-600 hover:text-purple-800 flex items-center gap-1 mt-auto"
                >
                  <Youtube size={14} /> Watch Tutorial
                </a>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Detailed Meal Plan */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="bg-gradient-to-br from-rose-50 to-white rounded-3xl p-8 lg:p-12 border border-rose-100 shadow-sm relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 opacity-5 transform translate-x-10 -translate-y-10">
            <img src="https://images.unsplash.com/photo-1490645935967-10de6ba17061?q=80&w=2053&auto=format&fit=crop" alt="Healthy Food" className="w-96 h-96 rounded-full object-cover" />
          </div>

          <div className="flex items-center justify-center gap-3 mb-10 relative z-10">
            <div className="p-3 rounded-full bg-green-100 text-green-600">
              <Leaf size={28} />
            </div>
            <h2 className="text-3xl font-semibold text-gray-800">Nourishing Your Body</h2>
          </div>
          
          <div className="space-y-8 relative z-10">
            {/* Breakfast */}
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
              <h4 className="font-semibold text-lg text-rose-700 mb-3 flex items-center gap-2">
                <span className="text-2xl">🍴</span> Breakfast Ideas (Choose ONE daily)
              </h4>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-gray-700">
                <li className="flex items-center gap-2"><span className="text-green-500">✔</span> Oats with chia seeds + nuts + berries</li>
                <li className="flex items-center gap-2"><span className="text-green-500">✔</span> Vegetable omelet with spinach and tomatoes</li>
                <li className="flex items-center gap-2"><span className="text-green-500">✔</span> Greek yogurt with seeds and a sliced apple</li>
                <li className="flex items-center gap-2"><span className="text-green-500">✔</span> Moong dal chilla + mint chutney</li>
                <li className="flex items-center gap-2"><span className="text-green-500">✔</span> Avocado toast on whole-grain bread</li>
              </ul>
            </div>

            {/* Lunch */}
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
              <h4 className="font-semibold text-lg text-rose-700 mb-3 flex items-center gap-2">
                <span className="text-2xl">🍱</span> Lunch Ideas (Choose ONE daily)
              </h4>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-gray-700">
                <li className="flex items-center gap-2"><span className="text-green-500">✔</span> Brown rice + dal + sabzi + salad</li>
                <li className="flex items-center gap-2"><span className="text-green-500">✔</span> Whole wheat roti + paneer/chicken + vegetables</li>
                <li className="flex items-center gap-2"><span className="text-green-500">✔</span> Quinoa bowl with veggies, beans, and olive oil</li>
                <li className="flex items-center gap-2"><span className="text-green-500">✔</span> Grilled fish/chicken with roasted vegetables</li>
                <li className="flex items-center gap-2"><span className="text-green-500">✔</span> Rajma or chole with salad (limit portions)</li>
              </ul>
            </div>

            {/* Dinner */}
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
              <div className="flex justify-between items-center mb-3">
                <h4 className="font-semibold text-lg text-rose-700 flex items-center gap-2">
                  <span className="text-2xl">🍛</span> Dinner Ideas (Keep lighter than lunch)
                </h4>
                <span className="text-xs bg-rose-100 text-rose-600 px-2 py-1 rounded-full">Before 8 PM</span>
              </div>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-gray-700">
                <li className="flex items-center gap-2"><span className="text-green-500">✔</span> Soup + stir-fried veggies</li>
                <li className="flex items-center gap-2"><span className="text-green-500">✔</span> Paneer tofu salad with seeds</li>
                <li className="flex items-center gap-2"><span className="text-green-500">✔</span> Grilled veggies + protein (fish/chicken/tofu)</li>
                <li className="flex items-center gap-2"><span className="text-green-500">✔</span> Cauliflower rice bowl</li>
                <li className="flex items-center gap-2"><span className="text-green-500">✔</span> Moong khichdi</li>
              </ul>
            </div>

            {/* Snacks & Beverages Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                <h4 className="font-semibold text-lg text-rose-700 mb-3 flex items-center gap-2">
                  <span className="text-2xl">🥗</span> Healthy Snacks (Pick 1–2)
                </h4>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li>• Handful of nuts (almonds/walnuts)</li>
                  <li>• One fruit (apple, pear, guava, orange)</li>
                  <li>• Boiled chickpeas or sprout salad</li>
                  <li>• Coconut water</li>
                  <li>• Dark chocolate (70%+) — small piece</li>
                </ul>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                <h4 className="font-semibold text-lg text-rose-700 mb-3 flex items-center gap-2">
                  <span className="text-2xl">🧃</span> Drinks & Beverages
                </h4>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-center gap-2"><span className="text-green-500">✔</span> Green tea</li>
                  <li className="flex items-center gap-2"><span className="text-green-500">✔</span> Lemon water</li>
                  <li className="flex items-center gap-2"><span className="text-green-500">✔</span> Cinnamon tea (regulates sugar)</li>
                  <li className="flex items-center gap-2"><span className="text-green-500">✔</span> Spearmint tea (reduces symptoms)</li>
                </ul>
              </div>
            </div>

            {/* Avoid List */}
            <div className="bg-red-50 p-6 rounded-2xl border border-red-100">
              <h4 className="font-semibold text-lg text-red-700 mb-4 flex items-center gap-2">
                <span className="text-2xl">🚫</span> Foods to Avoid or Reduce
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div>
                  <strong className="block text-red-800">Sugar & Sweets</strong>
                  <span className="text-red-600/80">Spikes insulin</span>
                </div>
                <div>
                  <strong className="block text-red-800">White Rice/Maida</strong>
                  <span className="text-red-600/80">Fast digestion → sugar spike</span>
                </div>
                <div>
                  <strong className="block text-red-800">Fried/Fast Foods</strong>
                  <span className="text-red-600/80">Increases inflammation</span>
                </div>
                <div>
                  <strong className="block text-red-800">Sugary Drinks</strong>
                  <span className="text-red-600/80">High sugar content</span>
                </div>
              </div>
            </div>

            {/* Habits & Supplements */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100">
                <h4 className="font-semibold text-lg text-blue-700 mb-3 flex items-center gap-2">
                  <span className="text-2xl">🧭</span> Weekly Habits
                </h4>
                <ul className="space-y-2 text-sm text-blue-800">
                  <li className="flex justify-between"><span>Water intake</span> <strong>2–3 liters/day</strong></li>
                  <li className="flex justify-between"><span>Sleep</span> <strong>7–9 hours</strong></li>
                  <li className="flex justify-between"><span>Stress control</span> <strong>10 min meditation</strong></li>
                  <li className="flex justify-between"><span>Movement</span> <strong>30 min daily</strong></li>
                </ul>
              </div>

              <div className="bg-purple-50 p-6 rounded-2xl border border-purple-100">
                <h4 className="font-semibold text-lg text-purple-700 mb-3 flex items-center gap-2">
                  <span className="text-2xl">🧩</span> Helpful Supplements
                </h4>
                <p className="text-xs text-purple-600 mb-2 italic">(Optional & Consult Doctor)</p>
                <ul className="grid grid-cols-2 gap-2 text-sm text-purple-800 font-medium">
                  <li>• Omega-3</li>
                  <li>• Vitamin D3</li>
                  <li>• Inositol</li>
                  <li>• Magnesium</li>
                  <li>• Zinc</li>
                </ul>
              </div>
            </div>

            <div className="text-center mt-8 p-6 bg-green-50 rounded-2xl border border-green-100">
              <p className="text-lg text-green-800 font-medium italic">
                "More plants, more protein, less sugar, and move every day."
              </p>
            </div>
          </div>
        </motion.div>

        {/* Reminder */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="mt-16 text-center flex flex-col items-center gap-4"
        >
          <div className="bg-orange-50 p-4 rounded-full text-orange-400 mb-2">
            <Sun size={32} />
          </div>
          <p className="text-gray-600 max-w-2xl text-lg leading-relaxed">
            Remember, small steps lead to big changes. Listen to your body and be kind to yourself on this journey. 
            Consistency is more important than perfection.
          </p>
        </motion.div>
      </div>
      </div>
    </ProtectedRoute>
  );
}
