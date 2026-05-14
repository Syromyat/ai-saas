import { createClient } from "@/lib/supabase/server";
import UserMenuClient from "@/components/UserMenuClient";
import Link from "next/link";

export default async function UserMenuServer() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return (
      <Link
        href="/login"
        className="text-sm px-4 py-1.5 rounded-full border border-zinc-700 text-zinc-300 hover:border-violet-500 hover:text-white transition-colors"
      >
        Войти
      </Link>
    );
  }

  return <UserMenuClient email={user.email ?? ""} />;
}
