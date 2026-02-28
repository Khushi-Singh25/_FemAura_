"use client";

import { useState, useRef, useEffect } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import { Send, User, Bot } from 'lucide-react';
import { motion } from 'framer-motion';
import axios from 'axios';

type Message = {
  id: number;
  text: string;
  sender: 'user' | 'bot';
};

export default function Chatbot() {
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, text: "Hello! I'm your AI Gynecologist assistant. How can I help you today regarding your reproductive health or PCOS?", sender: 'bot' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = { id: Date.now(), text: input, sender: 'user' };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/chat`, { message: input });
      const botMessage: Message = { id: Date.now() + 1, text: response.data.response, sender: 'bot' };
      setMessages(prev => [...prev, botMessage]);
    } catch (err) {
       console.error(err);
       // Fallback mock response
       setTimeout(() => {
         const botMessage: Message = { 
            id: Date.now() + 1, 
            text: "I'm having trouble connecting to my brain right now. But generally, for PCOS, maintaining a balanced diet and regular exercise is key. Please consult a doctor for specific medical advice.", 
            sender: 'bot' 
         };
         setMessages(prev => [...prev, botMessage]);
       }, 1000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProtectedRoute>
    <div className="max-w-4xl mx-auto px-4 py-8 h-[calc(100vh-6rem)] flex flex-col">
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold text-primary-dark">AI Gynecologist Chatbot</h1>
        <p className="text-sm text-gray-500">Ask anything about symptoms, periods, or PCOS.</p>
      </div>

      <div className="flex-grow overflow-y-auto bg-white rounded-2xl shadow-md border border-primary/10 p-6 space-y-4 mb-4">
        {messages.map((msg) => (
          <motion.div
            key={msg.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`flex items-start gap-2 max-w-[80%] ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              <div className={`p-2 rounded-full ${msg.sender === 'user' ? 'bg-primary text-white' : 'bg-secondary text-indigo-900'}`}>
                {msg.sender === 'user' ? <User size={20} /> : <Bot size={20} />}
              </div>
              <div className={`p-4 rounded-2xl ${
                msg.sender === 'user' 
                  ? 'bg-primary/10 text-foreground rounded-tr-none' 
                  : 'bg-secondary/20 text-foreground rounded-tl-none'
              }`}>
                <p className="text-sm sm:text-base">{msg.text}</p>
              </div>
            </div>
          </motion.div>
        ))}
        {loading && (
           <div className="flex justify-start">
             <div className="flex items-center gap-2 bg-secondary/20 p-4 rounded-2xl rounded-tl-none">
               <Bot size={20} className="text-indigo-900" />
               <div className="flex space-x-1">
                 <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                 <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                 <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
               </div>
             </div>
           </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSend} className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your question here..."
          className="flex-grow p-4 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition shadow-sm"
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="p-4 bg-primary text-white rounded-xl hover:bg-primary-dark transition disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
        >
          <Send size={24} />
        </button>
      </form>
    </div>
    </ProtectedRoute>
  );
}





