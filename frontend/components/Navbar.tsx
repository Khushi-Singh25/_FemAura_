"use client";

import Link from 'next/link';
import { useState } from 'react';
import { Menu, X, Heart, Activity, MessageCircle, User, Stethoscope, LogIn, LogOut } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';

const navItems = [
  { name: 'Home', href: '/', icon: Heart },
  { name: 'Awareness', href: '/awareness', icon: Activity },
  { name: 'Tracker', href: '/tracker', icon: Activity },
  { name: 'Diagnosis', href: '/diagnosis', icon: Stethoscope },
  { name: 'Chatbot', href: '/chatbot', icon: MessageCircle },
  { name: 'Fitness', href: '/fitness', icon: User },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated, logout, user } = useAuth();

  return (
    <nav className="fixed w-full z-50 top-0 start-0 bg-nav-bg backdrop-blur-md border-b border-white/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                FemAura
              </span>
            </Link>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-foreground hover:text-primary px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 flex items-center gap-1"
                >
                  <item.icon size={16} />
                  {item.name}
                </Link>
              ))}
              
              {isAuthenticated ? (
                <button
                  onClick={logout}
                  className="text-foreground hover:text-primary px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 flex items-center gap-1"
                >
                  <LogOut size={16} />
                  Logout
                </button>
              ) : (
                <Link
                  href="/login"
                  className="text-foreground hover:text-primary px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 flex items-center gap-1"
                >
                  <LogIn size={16} />
                  Login
                </Link>
              )}
            </div>
          </div>
          <div className="-mr-2 flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-foreground hover:text-primary focus:outline-none"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden bg-white/90 backdrop-blur-lg"
        >
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-foreground hover:text-primary block px-3 py-2 rounded-md text-base font-medium flex items-center gap-2"
                onClick={() => setIsOpen(false)}
              >
                <item.icon size={18} />
                {item.name}
              </Link>
            ))}
            {isAuthenticated ? (
              <button
                onClick={() => {
                  logout();
                  setIsOpen(false);
                }}
                className="text-foreground hover:text-primary block w-full text-left px-3 py-2 rounded-md text-base font-medium flex items-center gap-2"
              >
                <LogOut size={18} />
                Logout
              </button>
            ) : (
              <Link
                href="/login"
                className="text-foreground hover:text-primary block px-3 py-2 rounded-md text-base font-medium flex items-center gap-2"
                onClick={() => setIsOpen(false)}
              >
                <LogIn size={18} />
                Login
              </Link>
            )}
          </div>
        </motion.div>
      )}
    </nav>
  );
}
