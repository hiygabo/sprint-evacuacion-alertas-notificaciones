import { useEffect, useState } from 'react';
import { Bell, CheckCircle, MapPin, Plus, Trash2 } from 'lucide-react';
import {
    macrodistritosService,
    notificacionesService,
    registrosService,
} from '../services/api';

interface Props {
    idUsuario: number;
}

export function MisZonasPage({ idUsuario }: Props) {
    const [macrodistritos, setMacrodistritos] = useState<any[]>([]);
    const [misRegistros, setMisRegistros] = useState<any[]>([]);
    const [notificaciones, setNotificaciones] = useState<any[]>([]);
    const [selectedMacro, setSelectedMacro] = useState<string>('');

    const cargarDatos = async () => {
        const [macros, regs, notifs] = await Promise.all([
            macrodistritosService.getAll(),
            registrosService.getByUsuario(idUsuario),
            notificacionesService.getByUsuario(idUsuario),
        ]);
        setMacrodistritos(macros);
        setMisRegistros(regs);
        setNotificaciones(notifs);
    };

    useEffect(() => {
        cargarDatos().catch(console.error);
    }, [idUsuario]);

    const handleAgregarZona = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedMacro) return;
        try {
            await registrosService.create({
                idUsuario,
                idMacrodistrito: Number(selectedMacro),
            });
            setSelectedMacro('');
            cargarDatos();
        } catch {
            alert('Ya estás registrado en este macrodistrito.');
        }
    };

    const handleEliminarZona = async (idRegistro: number) => {
        await registrosService.remove(idRegistro);
        cargarDatos();
    };

    const handleMarcarLeida = async (idNotif: number) => {
        await notificacionesService.marcarLeida(idNotif);
        cargarDatos();
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl lg:text-[32px] font-bold text-zinc-900">
                    Mis Zonas y Notificaciones
                </h1>
                <p className="text-sm font-medium text-zinc-500">
                    Recibe alertas automáticas cuando ocurra un evento en tus macrodistritos
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Columna izquierda: Mis Macrodistritos (5 cols) */}
                <section className="lg:col-span-5 bg-white border border-zinc-200 rounded-lg p-6 shadow-sm space-y-5">
                    <h2 className="text-xl font-semibold text-zinc-900 flex items-center gap-2">
                        <MapPin className="w-5 h-5 text-orange-500" />
                        Zonas Registradas
                    </h2>

                    <form onSubmit={handleAgregarZona} className="flex gap-2">
                        <select
                            value={selectedMacro}
                            onChange={(e) => setSelectedMacro(e.target.value)}
                            className="flex-1 min-h-[44px] px-3 py-2 bg-white border border-zinc-200 rounded-lg text-sm text-zinc-800 focus:outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/15"
                        >
                            <option value="">Seleccionar macrodistrito...</option>
                            {macrodistritos.map((m) => (
                                <option key={m.id} value={m.id}>
                                    {m.nombre}
                                </option>
                            ))}
                        </select>
                        <button
                            type="submit"
                            className="min-h-[44px] px-4 py-2 bg-orange-500 text-white font-semibold rounded-lg hover:bg-orange-600 transition-colors duration-200 flex items-center gap-1.5"
                        >
                            <Plus className="w-4 h-4" />
                            Añadir
                        </button>
                    </form>

                    <div className="space-y-2.5">
                        {misRegistros.length === 0 ? (
                            <p className="text-sm text-zinc-500">
                                Aún no tienes zonas registradas.
                            </p>
                        ) : (
                            misRegistros.map((reg) => (
                                <div
                                    key={reg.id}
                                    className="flex items-center justify-between p-3 bg-zinc-50 border border-zinc-200 rounded-lg"
                                >
                  <span className="font-semibold text-sm text-zinc-900">
                    {reg.macrodistrito?.nombre}
                  </span>
                                    <button
                                        onClick={() => handleEliminarZona(reg.id)}
                                        className="min-h-[44px] px-3 text-sm font-semibold text-zinc-600 hover:text-rose-600 transition-colors flex items-center gap-1"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                        Quitar
                                    </button>
                                </div>
                            ))
                        )}
                    </div>
                </section>

                {/* Columna derecha: Bandeja de Notificaciones (7 cols) */}
                <section className="lg:col-span-7 bg-white border border-zinc-200 rounded-lg p-6 shadow-sm space-y-5">
                    <h2 className="text-xl font-semibold text-zinc-900 flex items-center gap-2">
                        <Bell className="w-5 h-5 text-orange-500" />
                        Historial de Notificaciones
                    </h2>

                    <div className="space-y-3">
                        {notificaciones.length === 0 ? (
                            <p className="text-sm text-zinc-500">
                                No tienes notificaciones todavía.
                            </p>
                        ) : (
                            notificaciones.map((n) => (
                                <div
                                    key={n.id}
                                    className={`p-4 rounded-lg border transition-colors ${
                                        n.leida
                                            ? 'bg-zinc-50 border-zinc-200'
                                            : 'bg-white border-orange-300'
                                    }`}
                                >
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="space-y-1">
                      <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                              n.leida
                                  ? 'bg-zinc-200 text-zinc-700'
                                  : 'bg-orange-100 text-orange-700'
                          }`}
                      >
                        {n.leida ? 'Leída' : 'Nueva'}
                      </span>
                                            <p className="text-sm font-medium text-zinc-800 pt-1">
                                                {n.mensaje}
                                            </p>
                                            <p className="text-xs text-zinc-500">
                                                {new Date(n.fechaHora).toLocaleString('es-BO')}
                                            </p>
                                        </div>

                                        {!n.leida && (
                                            <button
                                                onClick={() => handleMarcarLeida(n.id)}
                                                className="min-h-[44px] px-3 py-2 bg-transparent border border-zinc-200 text-zinc-900 text-xs font-semibold rounded-lg hover:bg-zinc-100 transition-colors flex items-center gap-1.5 shrink-0"
                                            >
                                                <CheckCircle className="w-4 h-4 text-emerald-600" />
                                                Marcar leída
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </section>
            </div>
        </div>
    );
}