import { useEffect, useState } from 'react';
import { Menu, AlertTriangle, LogIn, LogOut } from 'lucide-react';
import { Sidebar, type RolActivo, type TabId } from './components/Sidebar';
import { LoginModal } from './components/LoginModal';
import { alertasService } from './services/api';

import { AlertasPage } from './pages/AlertasPage';
import { PuntosEvacuacionPage } from './pages/PuntosEvacuacionPage';
import { DirectorioPage } from './pages/DirectorioPage';
import { MisZonasPage} from "./pages/MIsZonasPage.tsx";
import { PanelSismologoPage } from './pages/PanelSismologoPage';
import { PanelAdminPage } from './pages/PanelAdminPage';

export default function App() {
  const [usuario, setUsuario] = useState<any | null>(() => {
    const saved = localStorage.getItem('sismopaz_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [showLogin, setShowLogin] = useState(false);
  const [activeTab, setActiveTab] = useState<TabId>('alertas');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [alertaBanner, setAlertaBanner] = useState<any | null>(null);

  const rol: RolActivo = usuario ? usuario.rol : 'VISITANTE';

  const cargarBanner = async () => {
    try {
      const alertas = await alertasService.getAll();
      const activa = alertas.find((a: any) => a.estado === 'ACTIVA');
      setAlertaBanner(activa || null);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    cargarBanner();
  }, [activeTab]);

  const handleLoginSuccess = (user: any) => {
    setUsuario(user);
    localStorage.setItem('sismopaz_user', JSON.stringify(user));
    setShowLogin(false);
    if (user.rol === 'CIUDADANO') setActiveTab('mis-zonas');
    else if (user.rol === 'SISMOLOGO') setActiveTab('panel-sismologo');
    else if (user.rol === 'ADMINISTRADOR') setActiveTab('panel-admin');
    else setActiveTab('alertas');
  };

  const handleLogout = () => {
    setUsuario(null);
    localStorage.removeItem('sismopaz_user');
    setActiveTab('alertas');
  };

  const bannerColors: Record<string, string> = {
    SEVERA: 'bg-rose-600 text-white',
    MODERADA: 'bg-orange-500 text-white',
    BASICA: 'bg-sky-600 text-white',
  };

  return (
      <div className="min-h-screen bg-zinc-100 text-zinc-900 flex flex-col">
        <header className="sticky top-0 z-30 h-16 bg-zinc-900 text-white border-b border-zinc-800 px-4 lg:px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
                onClick={() => setMobileOpen(true)}
                className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg hover:bg-zinc-800 lg:hidden"
            >
              <Menu className="w-6 h-6" />
            </button>
            <span className="text-xl font-bold tracking-tight">
            Sismo<span className="text-orange-500">Paz</span>
          </span>
          </div>

          <div className="flex items-center gap-3">
            {usuario ? (
                <>
                  <div className="text-right hidden sm:block">
                    <p className="text-sm font-semibold leading-tight">{usuario.nombre}</p>
                    <p className="text-xs text-orange-400 font-medium">{usuario.rol}</p>
                  </div>
                  <button
                      onClick={handleLogout}
                      className="min-h-[44px] px-4 py-2 bg-zinc-800 border border-zinc-700 text-white text-sm font-semibold rounded-lg hover:bg-zinc-700 transition-colors flex items-center gap-2"
                  >
                    <LogOut className="w-4 h-4" />
                    Salir
                  </button>
                </>
            ) : (
                <button
                    onClick={() => setShowLogin(true)}
                    className="min-h-[44px] px-5 py-2 bg-orange-500 text-white text-sm font-semibold rounded-lg hover:bg-orange-600 transition-colors flex items-center gap-2"
                >
                  <LogIn className="w-4 h-4" />
                  Iniciar Sesión
                </button>
            )}
          </div>
        </header>

        {alertaBanner && (
            <div
                className={`w-full px-4 py-3 flex items-center justify-center gap-3 text-sm font-semibold ${
                    bannerColors[alertaBanner.gravedad] || 'bg-sky-600 text-white'
                }`}
            >
              <AlertTriangle className="w-5 h-5 shrink-0" />
              <span>
            ALERTA {alertaBanner.gravedad}: {alertaBanner.titulo} — {alertaBanner.mensajeOficial}
          </span>
            </div>
        )}

        <div className="flex flex-1 max-w-[1400px] w-full mx-auto">
          <Sidebar
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              rol={rol}
              mobileOpen={mobileOpen}
              setMobileOpen={setMobileOpen}
          />

          <main className="flex-1 p-6 overflow-x-hidden">
            {activeTab === 'alertas' && <AlertasPage />}
            {activeTab === 'puntos' && <PuntosEvacuacionPage />}
            {activeTab === 'directorio' && <DirectorioPage />}
            {activeTab === 'mis-zonas' && usuario && <MisZonasPage idUsuario={usuario.id} />}
            {activeTab === 'panel-sismologo' && usuario && (
                <PanelSismologoPage idSismologo={usuario.id} onAlertaChange={cargarBanner} />
            )}
            {activeTab === 'panel-admin' && usuario && <PanelAdminPage />}
          </main>
        </div>

        {showLogin && (
            <LoginModal
                onClose={() => setShowLogin(false)}
                onSuccess={handleLoginSuccess}
            />
        )}
      </div>
  );
}