import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { ExternalLink, MapPin } from 'lucide-react';
import { macrodistritosService, puntosService } from '../services/api';

// Fix para íconos por defecto de Leaflet en Vite
const markerIcon = new L.Icon({
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
});

export function PuntosEvacuacionPage() {
    const [puntos, setPuntos] = useState<any[]>([]);
    const [macrodistritos, setMacrodistritos] = useState<any[]>([]);
    const [filtroMacro, setFiltroMacro] = useState<string>('');

    useEffect(() => {
        puntosService.getAll().then((data) => {
            setPuntos(data.filter((p: any) => p.activo));
        });
        macrodistritosService.getAll().then(setMacrodistritos);
    }, []);

    const puntosFiltrados = filtroMacro
        ? puntos.filter((p) => String(p.macrodistrito?.id) === filtroMacro)
        : puntos;

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl lg:text-[32px] font-bold text-zinc-900">
                        Puntos de Evacuación
                    </h1>
                    <p className="text-sm font-medium text-zinc-500">
                        Zonas seguras georreferenciadas en el municipio de La Paz
                    </p>
                </div>

                <select
                    value={filtroMacro}
                    onChange={(e) => setFiltroMacro(e.target.value)}
                    className="min-h-[44px] px-4 py-2 bg-white border border-zinc-200 rounded-lg text-sm font-medium text-zinc-800 focus:outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/15"
                >
                    <option value="">Todos los macrodistritos</option>
                    {macrodistritos.map((m) => (
                        <option key={m.id} value={m.id}>
                            {m.nombre}
                        </option>
                    ))}
                </select>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Mapa Leaflet (8 columnas en desktop) */}
                <div className="lg:col-span-8 bg-white border border-zinc-200 rounded-lg overflow-hidden shadow-sm flex flex-col">
                    <MapContainer
                        center={[-16.4897, -68.1193]} // La Paz, Bolivia
                        zoom={13}
                        className="w-full flex-grow min-h-[500px] z-0"
                    >
                        <TileLayer
                            attribution="&copy; OpenStreetMap contributors"
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        {puntosFiltrados.map((punto) => {
                            const coords = punto.ubicacion?.coordinates;
                            if (!coords) return null;
                            const lat = coords[1];
                            const lng = coords[0];
                            return (
                                <Marker key={punto.id} position={[lat, lng]} icon={markerIcon}>
                                    <Popup>
                                        <div className="text-sm space-y-1">
                                            <p className="font-bold text-zinc-900">{punto.nombre}</p>
                                            <p className="text-zinc-600">{punto.direccion}</p>
                                            <p className="text-xs font-medium text-orange-600">
                                                {punto.macrodistrito?.nombre}
                                            </p>
                                        </div>
                                    </Popup>
                                </Marker>
                            );
                        })}
                    </MapContainer>
                </div>

                {/* Lista lateral (4 columnas) */}
                <div className="lg:col-span-4 space-y-4 max-h-[520px] overflow-y-auto pr-1">
                    {puntosFiltrados.length === 0 ? (
                        <div className="bg-white border border-zinc-200 rounded-lg p-6 text-sm text-zinc-500">
                            No hay puntos activos en esta zona.
                        </div>
                    ) : (
                        puntosFiltrados.map((punto) => {
                            const coords = punto.ubicacion?.coordinates;
                            const lat = coords?.[1];
                            const lng = coords?.[0];
                            return (
                                <div
                                    key={punto.id}
                                    className="bg-white border border-zinc-200 rounded-lg p-4 shadow-sm space-y-2"
                                >
                                    <div className="flex items-start justify-between gap-2">
                                        <h3 className="font-semibold text-zinc-900 flex items-center gap-1.5">
                                            <MapPin className="w-4 h-4 text-orange-500 shrink-0" />
                                            {punto.nombre}
                                        </h3>
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold uppercase bg-emerald-100 text-emerald-800">
                      {punto.macrodistrito?.nombre}
                    </span>
                                    </div>
                                    <p className="text-sm text-zinc-600">{punto.direccion}</p>
                                    {punto.descripcion && (
                                        <p className="text-xs text-zinc-500">{punto.descripcion}</p>
                                    )}
                                    {lat && lng && (
                                        <a
                                            href={`https://www.google.com/maps?q=${lat},${lng}`}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="inline-flex items-center gap-1.5 text-sm font-semibold text-orange-600 hover:underline pt-1"
                                        >
                                            Abrir en Google Maps
                                            <ExternalLink className="w-3.5 h-3.5" />
                                        </a>
                                    )}
                                </div>
                            );
                        })
                    )}
                </div>
            </div>
        </div>
    );
}