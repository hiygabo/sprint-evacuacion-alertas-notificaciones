import { useEffect, useState } from 'react';
import { Phone, Search } from 'lucide-react';
import { directorioService } from '../services/api';

export function DirectorioPage() {
    const [items, setItems] = useState<any[]>([]);
    const [busqueda, setBusqueda] = useState('');

    useEffect(() => {
        directorioService.getAll().then((data) => {
            setItems(data.filter((d: any) => d.habilitado));
        });
    }, []);

    const filtrados = items.filter(
        (item) =>
            item.entidad.toLowerCase().includes(busqueda.toLowerCase()) ||
            item.servicio.toLowerCase().includes(busqueda.toLowerCase()) ||
            item.telefono.includes(busqueda)
    );

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl lg:text-[32px] font-bold text-zinc-900">
                    Directorio de Emergencias
                </h1>
                <p className="text-sm font-medium text-zinc-500">
                    Líneas oficiales de auxilio, rescate y atención médica en La Paz
                </p>
            </div>

            <div className="relative max-w-md">
                <Search className="w-5 h-5 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                    type="text"
                    placeholder="Buscar entidad, servicio o número..."
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                    className="w-full min-h-[44px] pl-11 pr-4 py-2 bg-white border border-zinc-200 rounded-lg text-zinc-800 focus:outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/15 transition-all"
                />
            </div>

            <div className="bg-white border border-zinc-200 rounded-lg shadow-sm overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                    <tr className="border-b border-zinc-200 bg-zinc-50 text-xs font-semibold uppercase tracking-wider text-zinc-500">
                        <th className="py-3.5 px-6">Entidad</th>
                        <th className="py-3.5 px-6">Servicio</th>
                        <th className="py-3.5 px-6">Teléfono</th>
                        <th className="py-3.5 px-6 text-right">Acción</th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-200 text-sm">
                    {filtrados.length === 0 ? (
                        <tr>
                            <td colSpan={4} className="py-8 text-center text-zinc-500">
                                No se encontraron contactos de emergencia.
                            </td>
                        </tr>
                    ) : (
                        filtrados.map((item) => (
                            <tr key={item.id} className="hover:bg-zinc-50">
                                <td className="py-4 px-6 font-semibold text-zinc-900">
                                    {item.entidad}
                                </td>
                                <td className="py-4 px-6 text-zinc-700">{item.servicio}</td>
                                <td className="py-4 px-6 font-medium text-zinc-900">
                                    {item.telefono}
                                </td>
                                <td className="py-4 px-6 text-right">
                                    <a
                                        href={`tel:${item.telefono}`}
                                        className="inline-flex items-center gap-2 min-h-[44px] px-4 py-2 bg-orange-500 text-white font-semibold rounded-lg hover:bg-orange-600 transition-colors duration-200"
                                    >
                                        <Phone className="w-4 h-4" />
                                        Llamar
                                    </a>
                                </td>
                            </tr>
                        ))
                    )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}