import { useEffect, useState } from 'react';
import { ShieldAlert, CheckCircle2, Trash2 } from 'lucide-react';
import { alertasService, macrodistritosService } from '../services/api';

interface Props {
    idSismologo: number;
    onAlertaChange: () => void;
}

export function PanelSismologoPage({ idSismologo, onAlertaChange }: Props) {
    const [alertas, setAlertas] = useState<any[]>([]);
    const [macrodistritos, setMacrodistritos] = useState<any[]>([]);

    const [titulo, setTitulo] = useState('');
    const [mensajeOficial, setMensajeOficial] = useState('');
    const [gravedad, setGravedad] = useState<'BASICA' | 'MODERADA' | 'SEVERA'>('MODERADA');
    const [esTodaLaCiudad, setEsTodaLaCiudad] = useState(false);
    const [macroIds, setMacroIds] = useState<number[]>([]);

    const cargarDatos = async () => {
        const [listaAlertas, macros] = await Promise.all([
            alertasService.getAll(),
            macrodistritosService.getAll(),
        ]);
        setAlertas(listaAlertas);
        setMacrodistritos(macros);
    };

    useEffect(() => {
        cargarDatos().catch(console.error);
    }, []);

    const toggleMacro = (id: number) => {
        setMacroIds((prev) =>
            prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
        );
    };

    const handleEmitir = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!titulo || !mensajeOficial) return;
        if (!esTodaLaCiudad && macroIds.length === 0) {
            alert('Selecciona al menos un macrodistrito o marca "Toda la ciudad".');
            return;
        }

        await alertasService.create({
            titulo,
            mensajeOficial,
            gravedad,
            esTodaLaCiudad,
            idSismologo,
            macrodistritoIds: esTodaLaCiudad ? [] : macroIds,
        });

        setTitulo('');
        setMensajeOficial('');
        setMacroIds([]);
        setEsTodaLaCiudad(false);
        await cargarDatos();
        onAlertaChange();
    };

    const handleCerrarAlerta = async (id: number) => {
        await alertasService.update(id, { estado: 'CERRADA' });
        await cargarDatos();
        onAlertaChange();
    };

    const handleEliminarAlerta = async (id: number) => {
        await alertasService.remove(id);
        await cargarDatos();
        onAlertaChange();
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl lg:text-[32px] font-bold text-zinc-900">
                    Gestión de Alertas Sísmicas
                </h1>
                <p className="text-sm font-medium text-zinc-500">
                    Emisión oficial y control de ciclo de vida de alertas
                </p>
            </div>

            {/* Formulario de emisión */}
            <form
                onSubmit={handleEmitir}
                className="bg-white border border-zinc-200 rounded-lg p-6 shadow-sm space-y-5"
            >
                <h2 className="text-xl font-semibold text-zinc-900 flex items-center gap-2">
                    <ShieldAlert className="w-5 h-5 text-orange-500" />
                    Emitir Nueva Alerta
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-zinc-700">Título</label>
                        <input
                            type="text"
                            required
                            placeholder="Ej. Sismo de magnitud 5.4 en zona Sur"
                            value={titulo}
                            onChange={(e) => setTitulo(e.target.value)}
                            className="w-full min-h-[44px] px-4 py-2 bg-white border border-zinc-200 rounded-lg text-zinc-800 focus:outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/15"
                        />
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-zinc-700">Gravedad</label>
                        <select
                            value={gravedad}
                            onChange={(e) => setGravedad(e.target.value as any)}
                            className="w-full min-h-[44px] px-4 py-2 bg-white border border-zinc-200 rounded-lg text-zinc-800 focus:outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/15"
                        >
                            <option value="BASICA">Básica (Informativa)</option>
                            <option value="MODERADA">Moderada (Precaución)</option>
                            <option value="SEVERA">Severa (Evacuación inmediata)</option>
                        </select>
                    </div>
                </div>

                <div className="space-y-1.5">
                    <label className="text-sm font-medium text-zinc-700">
                        Mensaje Oficial e Instrucciones
                    </label>
                    <textarea
                        required
                        rows={3}
                        placeholder="Indique recomendaciones y puntos de evacuación..."
                        value={mensajeOficial}
                        onChange={(e) => setMensajeOficial(e.target.value)}
                        className="w-full px-4 py-2.5 bg-white border border-zinc-200 rounded-lg text-zinc-800 focus:outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/15"
                    />
                </div>

                <div className="space-y-3">
                    <label className="flex items-center gap-2.5 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={esTodaLaCiudad}
                            onChange={(e) => setEsTodaLaCiudad(e.target.checked)}
                            className="w-5 h-5 accent-orange-500"
                        />
                        <span className="text-sm font-semibold text-zinc-900">
              Aplica a toda la ciudad de La Paz
            </span>
                    </label>

                    {!esTodaLaCiudad && (
                        <div className="flex flex-wrap gap-2 pt-1">
                            {macrodistritos.map((m) => {
                                const selected = macroIds.includes(m.id);
                                return (
                                    <button
                                        type="button"
                                        key={m.id}
                                        onClick={() => toggleMacro(m.id)}
                                        className={`min-h-[44px] px-3.5 py-2 rounded-lg text-sm font-semibold border transition-colors ${
                                            selected
                                                ? 'bg-zinc-900 text-white border-zinc-900'
                                                : 'bg-white text-zinc-800 border-zinc-200 hover:bg-zinc-50'
                                        }`}
                                    >
                                        {m.nombre}
                                    </button>
                                );
                            })}
                        </div>
                    )}
                </div>

                <button
                    type="submit"
                    className="min-h-[44px] px-6 py-2.5 bg-rose-600 text-white font-semibold rounded-lg hover:bg-rose-700 transition-colors duration-200"
                >
                    Emitir Alerta Oficial
                </button>
            </form>

            {/* Tabla de alertas emitidas */}
            <div className="bg-white border border-zinc-200 rounded-lg shadow-sm overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                    <tr className="border-b border-zinc-200 bg-zinc-50 text-xs font-semibold uppercase tracking-wider text-zinc-500">
                        <th className="py-3.5 px-6">Alerta</th>
                        <th className="py-3.5 px-6">Gravedad</th>
                        <th className="py-3.5 px-6">Estado</th>
                        <th className="py-3.5 px-6 text-right">Acciones</th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-200 text-sm">
                    {alertas.map((a) => (
                        <tr key={a.id}>
                            <td className="py-4 px-6">
                                <p className="font-semibold text-zinc-900">{a.titulo}</p>
                                <p className="text-xs text-zinc-500">
                                    {new Date(a.fechaEmision).toLocaleString('es-BO')}
                                </p>
                            </td>
                            <td className="py-4 px-6 font-semibold">{a.gravedad}</td>
                            <td className="py-4 px-6">
                  <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase ${
                          a.estado === 'ACTIVA'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-zinc-200 text-zinc-700'
                      }`}
                  >
                    {a.estado}
                  </span>
                            </td>
                            <td className="py-4 px-6 text-right">
                                <div className="inline-flex items-center gap-2">
                                    {a.estado === 'ACTIVA' && (
                                        <button
                                            onClick={() => handleCerrarAlerta(a.id)}
                                            className="min-h-[44px] px-3 py-2 bg-transparent border border-zinc-200 text-zinc-900 font-semibold rounded-lg hover:bg-zinc-50 flex items-center gap-1.5"
                                        >
                                            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                                            Cerrar
                                        </button>
                                    )}
                                    <button
                                        onClick={() => handleEliminarAlerta(a.id)}
                                        className="min-h-[44px] px-3 py-2 bg-rose-600 text-white font-semibold rounded-lg hover:bg-rose-700 flex items-center gap-1.5"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                        Eliminar
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}