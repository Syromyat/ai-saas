import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';

export const metadata = {
  title: 'Админ-панель — IAPRO',
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Проверяем есть ли это админ (жёстко захардкодили email)
  const ADMIN_EMAILS = ['g4131313@gmail.com']; // Твой email

  if (!user || !ADMIN_EMAILS.includes(user.email!)) {
    redirect('/');
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 text-white">
      {/* Admin Header */}
      <nav className="sticky top-0 z-50 backdrop-blur-xl bg-slate-950/80 border-b border-blue-400/10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/admin/dashboard" className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            🛡️ АДМИН
          </Link>
          <div className="flex gap-6 items-center">
            <Link href="/admin/dashboard" className="text-gray-400 hover:text-white transition">
              📊 Статистика
            </Link>
            <Link href="/admin/leads" className="text-gray-400 hover:text-white transition">
              👥 Лиды
            </Link>
            <Link href="/" className="text-gray-400 hover:text-white transition">
              🏠 На сайт
            </Link>
          </div>
        </div>
      </nav>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        {children}
      </div>
    </div>
  );
}
