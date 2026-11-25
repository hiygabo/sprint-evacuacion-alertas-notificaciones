import { useEffect, useState } from 'react';
import { AlertTriangle, Clock, MapPin } from 'lucide-react';
import { alertasService } from '../services/api';

export function AlertasPage() {
    const [alertas, setAlertas] = useState<any[]>([]);
    const [soloActivas, setSoloActivas] = useState(true);

    useEffect(() => {
        alertasService.getAll().then(setAlertas).catch(console.error);
    }, []);

    const filtradas = soloActivas
        ? alertas.filter((a) => a.estado === 'ACTIVA')
        : alertas;

    const badgeGravedad = (gravedad: string) => {
        if (gravedad === 'SEVERA')
            return 'bg-rose-600 text-white';
        if (gravedad === 'MODERADA')
            return 'bg-orange-100 text-orange-700';
        return 'bg-sky-100 text-sky-800';
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl lg:text-[32px] font-bold text-zinc-900">
                        Alertas Sísmicas
                    </h1>
                    <p className="text-sm font-medium text-zinc-500">
                        Monitoreo oficial de alertas vigentes en el municipio de La Paz
                    </p>
                </div>

                <div className="flex gap-2">
                    <button
                        onClick={() => setSoloActivas(true)}
                        className={`min-h-[44px] px-5 py-2.5 rounded-lg font-semibold text-sm transition-colors duration-200 ${
                            soloActivas
                                ? 'bg-zinc-900 text-white'
                                : 'bg-white border border-zinc-200 text-zinc-900 hover:bg-zinc-50'
                        }`}
                    >
                        Solo Activas
                    </button>
                    <button
                        onClick={() => setSoloActivas(false)}
                        className={`min-h-[44px] px-5 py-2.5 rounded-lg font-semibold text-sm transition-colors duration-200 ${
                            !soloActivas
                                ? 'bg-zinc-900 text-white'
                                : 'bg-white border border-zinc-200 text-zinc-900 hover:bg-zinc-50'
                        }`}
                    >
                        Todas
                    </button>
                </div>
            </div>

            {filtradas.length === 0 ? (
                <div className="bg-white border border-zinc-200 rounded-lg p-8 text-center text-zinc-500">
                    No hay alertas sísmicas registradas en este filtro.
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-6">
                    {filtradas.map((alerta) => (
                        <article
                            key={alerta.id}
                            className="bg-white border border-zinc-200 rounded-lg p-6 shadow-sm space-y-4"
                        >
                            <div className="flex flex-wrap items-center justify-between gap-3">
                                <div className="flex items-center gap-3">
                                    <AlertTriangle className="w-5 h-5 text-zinc-900 shrink-0" />
                                    <h2 className="text-xl font-semibold text-zinc-900">
                                        {alerta.titulo}
                                    </h2>
                                </div>
                                <div className="flex items-center gap-2">
                  <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${badgeGravedad(
                          alerta.gravedad
                      )}`}
                  >
                    {alerta.gravedad}
                  </span>
                                    <span
                                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                                            alerta.estado === 'ACTIVA'
                                                ? 'bg-emerald-100 text-emerald-800'
                                                : 'bg-zinc-200 text-zinc-700'
                                        }`}
                                    >
                    {alerta.estado}
                  </span>
                                </div>
                            </div>

                            <p className="text-base text-zinc-800 leading-relaxed">
                                {alerta.mensajeOficial}
                            </p>

                            <div className="flex flex-wrap items-center gap-4 pt-2 border-t border-zinc-200 text-sm font-medium text-zinc-500">
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4" />
                    {alerta.esTodaLaCiudad
                        ? 'Toda la ciudad de La Paz'
                        : alerta.macrodistritosAfectados
                        ?.map((am: any) => am.macrodistrito?.nombre)
                        .join(', ') || 'Sin zona específica'}
                </span>
                                <span className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4" />
                                    {new Date(alerta.fechaEmision).toLocaleString('es-BO')}
                </span>
                            </div>
                        </article>
                    ))}
                </div>
            )}
        </div>
    );
}