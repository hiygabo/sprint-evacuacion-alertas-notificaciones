import {
    AlertTriangle,
    MapPin,
    Phone,
    Bell,
    ShieldAlert,
    Settings,
    X,
} from 'lucide-react';

export type RolActivo = 'VISITANTE' | 'CIUDADANO' | 'SISMOLOGO' | 'ADMINISTRADOR';
export type TabId =
    | 'alertas'
    | 'puntos'
    | 'directorio'
    | 'mis-zonas'
    | 'panel-sismologo'
    | 'panel-admin';

interface SidebarProps {
    activeTab: TabId;
    setActiveTab: (tab: TabId) => void;
    rol: RolActivo;
    mobileOpen: boolean;
    setMobileOpen: (open: boolean) => void;
}

export function Sidebar({
                            activeTab,
                            setActiveTab,
                            rol,
                            mobileOpen,
                            setMobileOpen,
                        }: SidebarProps) {
    const navItems: { id: TabId; label: string; icon: any; roles: RolActivo[] }[] = [
        {
            id: 'alertas',
            label: 'Alertas Activas',
            icon: AlertTriangle,
            roles: ['VISITANTE', 'CIUDADANO', 'SISMOLOGO', 'ADMINISTRADOR'],
        },
        {
            id: 'puntos',
            label: 'Puntos de Evacuación',
            icon: MapPin,
            roles: ['VISITANTE', 'CIUDADANO', 'SISMOLOGO', 'ADMINISTRADOR'],
        },
        {
            id: 'directorio',
            label: 'Directorio Emergencias',
            icon: Phone,
            roles: ['VISITANTE', 'CIUDADANO', 'SISMOLOGO', 'ADMINISTRADOR'],
        },
        {
            id: 'mis-zonas',
            label: 'Mis Zonas y Notificaciones',
            icon: Bell,
            roles: ['CIUDADANO'],
        },
        {
            id: 'panel-sismologo',
            label: 'Gestión de Alertas',
            icon: ShieldAlert,
            roles: ['SISMOLOGO'],
        },
        {
            id: 'panel-admin',
            label: 'Administración',
            icon: Settings,
            roles: ['ADMINISTRADOR'],
        },
    ];

    const visibleItems = navItems.filter((item) => item.roles.includes(rol));

    return (
        <>
            {/* Overlay móvil */}
            {mobileOpen && (
                <div
                    className="fixed inset-0 z-40 bg-zinc-900/50 lg:hidden"
                    onClick={() => setMobileOpen(false)}
                />
            )}

            <aside
                className={`fixed top-0 left-0 z-50 h-screen w-[280px] bg-white border-r border-zinc-200 flex flex-col transition-transform duration-200 lg:sticky lg:top-16 lg:h-[calc(100vh-4rem)] lg:translate-x-0 ${
                    mobileOpen ? 'translate-x-0' : '-translate-x-full'
                }`}
            >
                <div className="flex items-center justify-between p-4 border-b border-zinc-200 lg:hidden">
                    <span className="font-bold text-lg text-zinc-900">SismoPaz</span>
                    <button
                        onClick={() => setMobileOpen(false)}
                        className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg hover:bg-zinc-100"
                    >
                        <X className="w-5 h-5 text-zinc-900" />
                    </button>
                </div>

                <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                    <p className="px-3 text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-3">
                        Módulo Alertas & Evacuación
                    </p>
                    {visibleItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = activeTab === item.id;
                        return (
                            <button
                                key={item.id}
                                onClick={() => {
                                    setActiveTab(item.id);
                                    setMobileOpen(false);
                                }}
                                className={`w-full min-h-[44px] px-4 py-2.5 flex items-center gap-3 rounded-lg font-semibold text-sm transition-colors duration-200 ${
                                    isActive
                                        ? 'bg-zinc-900 text-white'
                                        : 'text-zinc-800 hover:bg-zinc-100'
                                }`}
                            >
                                <Icon className="w-5 h-5 shrink-0" />
                                <span>{item.label}</span>
                            </button>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-zinc-200 text-xs text-zinc-500">
                    SismoPaz · La Paz, Bolivia
                </div>
            </aside>
        </>
    );
}