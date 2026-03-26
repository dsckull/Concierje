import { ReactNode, useState } from "react";
import { Link, useLocation } from "wouter";
import {
  LayoutDashboard, Users, Package, UserCheck, Wrench,
  DollarSign, CalendarDays, CalendarCheck, Scale, ShieldAlert,
  Layers, Menu, X, ChevronRight
} from "lucide-react";
import { useListAlertas } from "@workspace/api-client-react";
import { cn } from "@/lib/utils";

const NAV_GROUPS = [
  {
    label: "Principal",
    items: [
      { href: "/", icon: LayoutDashboard, label: "Dashboard" },
      { href: "/moradores", icon: Users, label: "Moradores" },
    ]
  },
  {
    label: "Portaria",
    items: [
      { href: "/encomendas", icon: Package, label: "Encomendas" },
      { href: "/visitantes", icon: UserCheck, label: "Visitantes" },
    ]
  },
  {
    label: "Gestão",
    items: [
      { href: "/ocorrencias", icon: Wrench, label: "Ocorrências" },
      { href: "/financeiro", icon: DollarSign, label: "Financeiro" },
      { href: "/assembleias", icon: CalendarDays, label: "Assembleias" },
      { href: "/reservas", icon: CalendarCheck, label: "Reservas" },
    ]
  },
  {
    label: "Segurança & Jurídico",
    items: [
      { href: "/juridico", icon: Scale, label: "Jurídico" },
      { href: "/defcom", icon: ShieldAlert, label: "DefCom", badge: true },
    ]
  }
];

export function AppLayout({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const { data: alerts } = useListAlertas(
    { resolvido: false },
    { query: { refetchInterval: 30000 } }
  );
  const criticalCount = alerts?.filter(a => !a.arquivado && (a.nivel_risco === 'critico' || a.nivel_risco === 'alto')).length || 0;

  const SidebarContent = () => (
    <>
      <div className="h-16 flex items-center px-5 border-b border-sidebar-border shrink-0 gap-3">
        <div className="w-8 h-8 rounded-lg bg-primary/20 border border-primary/40 flex items-center justify-center">
          <Layers className="w-4 h-4 text-primary" />
        </div>
        <div>
          <h1 className="font-display font-bold text-base tracking-wider text-white leading-none">CONSERJE</h1>
          <p className="text-[10px] text-muted-foreground tracking-widest uppercase">Gestão Condominial</p>
        </div>
      </div>

      <nav className="flex-1 py-4 px-3 overflow-y-auto space-y-5">
        {NAV_GROUPS.map((group) => (
          <div key={group.label}>
            <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60 px-3 mb-1.5">{group.label}</p>
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const isActive = location === item.href;
                const badgeCount = item.badge ? criticalCount : 0;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      "flex items-center px-3 py-2.5 rounded-lg transition-all duration-150 group relative text-sm",
                      isActive
                        ? "bg-primary/15 text-primary font-semibold"
                        : "text-sidebar-foreground/80 hover:bg-sidebar-border hover:text-white"
                    )}
                  >
                    <item.icon className={cn("w-4 h-4 mr-2.5 shrink-0", isActive ? "text-primary" : "text-muted-foreground group-hover:text-white")} />
                    <span className="flex-1">{item.label}</span>
                    {badgeCount > 0 && (
                      <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-destructive text-white animate-pulse">
                        {badgeCount}
                      </span>
                    )}
                    {isActive && <ChevronRight className="w-3 h-3 text-primary/60" />}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="p-3 border-t border-sidebar-border shrink-0">
        <div className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-sidebar-border transition-colors cursor-pointer">
          <div className="w-7 h-7 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center shrink-0">
            <span className="text-[10px] font-display font-bold text-primary">SY</span>
          </div>
          <div className="min-w-0">
            <p className="text-xs font-semibold text-white truncate">Síndico Admin</p>
            <p className="text-[10px] text-muted-foreground truncate">Turno Ativo</p>
          </div>
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0 ml-auto"></div>
        </div>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-background text-foreground flex overflow-hidden">
      {/* Desktop Sidebar */}
      <aside className="w-60 border-r border-sidebar-border bg-sidebar flex-col hidden md:flex shrink-0">
        <SidebarContent />
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/60" onClick={() => setMobileOpen(false)} />
          <aside className="absolute left-0 top-0 bottom-0 w-60 bg-sidebar border-r border-sidebar-border flex flex-col z-10">
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden relative min-w-0">
        {/* Mobile header */}
        <div className="md:hidden h-14 border-b border-border bg-sidebar flex items-center px-4 gap-3 shrink-0">
          <button onClick={() => setMobileOpen(true)} className="p-1.5 rounded-lg hover:bg-secondary text-muted-foreground hover:text-white transition-colors">
            <Menu className="w-5 h-5" />
          </button>
          <Layers className="w-4 h-4 text-primary" />
          <span className="font-display font-bold text-sm tracking-wider text-white">CONSERJE</span>
        </div>
        <div className="absolute inset-0 top-14 md:top-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />
        <div className="flex-1 overflow-y-auto z-10 relative mt-14 md:mt-0">
          {children}
        </div>
      </main>
    </div>
  );
}
