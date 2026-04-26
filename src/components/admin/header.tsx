import { Bell } from "lucide-react";
import { createClient } from "@/lib/supabase/server";

export async function AdminHeader() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-white px-6 shadow-sm">
      <div className="flex items-center gap-4">
        {/* Mobile menu toggle could go here */}
        <h2 className="text-lg font-semibold tracking-tight text-slate-800">
          Espace d'Administration
        </h2>
      </div>

      <div className="flex items-center gap-4">
        <button className="relative rounded-full p-2 text-slate-500 hover:bg-slate-100 transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500" />
        </button>
        <div className="h-8 w-px bg-slate-200 mx-2" />
        <div className="flex items-center gap-3">
          <div className="flex flex-col text-right">
            <span className="text-sm font-medium text-slate-700">Administrateur</span>
            <span className="text-xs text-slate-500">{user?.email || "admin@anis.phone"}</span>
          </div>
          <div className="h-9 w-9 rounded-full bg-slate-900 border-2 border-slate-200 flex items-center justify-center text-white font-bold text-sm">
            {user?.email?.charAt(0).toUpperCase() || "A"}
          </div>
        </div>
      </div>
    </header>
  );
}
