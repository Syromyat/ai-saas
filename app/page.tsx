'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { initializeTracking } from '@/lib/partner-tracking';
import AppDownloadModal from '@/components/AppDownloadModal';
import {
  Zap,
  Target,
  Rocket,
  CreditCard,
  ArrowRight,
  Sparkles,
  Users,
  TrendingUp,
  CheckCircle,
  XCircle,
} from 'lucide-react';

export default function Home() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    initializeTracking();

    const getUser = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };

    getUser();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 text-white">
      <AppDownloadModal />

      {/* Animated Background */}
      <div className="fixed inset-0 opacity-20 pointer-events-none">
        <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-blue-500 rounded-full mix-blend-screen filter blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-screen filter blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
      </div>

      {/* Hero Section */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-6 py-20">
        <div className="text-center max-w-4xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-400/20 text-blue-400 text-sm font-semibold mb-8">
            <Sparkles className="w-4 h-4" />
            Powered by AI
          </div>

          <h1 className="text-6xl lg:text-7xl font-bold mb-6 leading-tight">
            Умные <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">ИИ инструменты</span> для работы
          </h1>
          <p className="text-xl text-gray-400 mb-12">
            Генерируй тексты, анализируй информацию, создавай контент за секунды. Работает как мозг, думает как человек.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap gap-4 justify-center mb-16">
            {user ? (
              <>
                <Link
                  href="/dashboard"
                  className="flex items-center gap-2 px-12 py-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg font-bold text-lg hover:shadow-2xl hover:shadow-purple-500/50 transition-all transform hover:scale-105"
                >
                  <TrendingUp className="w-5 h-5" />
                  Личный кабинет
                </Link>
                <Link
                  href="/pricing"
                  className="flex items-center
