import { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import { Trash2, Plus, Pencil, Power, PowerOff, X } from 'lucide-react';
import {
    directorioService,
    macrodistritosService,
    puntosService,
} from '../services/api';

const markerIcon = new L.Icon({
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
});

function SelectorMapa({
                          onSelect,
                      }: {
    onSelect: (lat: number, lng: number) => void;
}) {
    useMapEvents({
        click(e) {
            onSelect(
                Number(e.latlng.lat.toFixed(6)),
                Number(e.latlng.lng.toFixed(6))
            );
        },
    });
    return null;
}

export function PanelAdminPage() {
    const [subTab, setSubTab] = useState<'puntos' | 'directorio'>('puntos');
    const [macrodistritos, setMacrodistritos] = useState<any[]>([]);
    const [puntos, setPuntos] = useState<any[]>([]);
    const [directorio, setDirectorio] = useState<any[]>([]);

    // Form Punto Evacuación
    const [nombre, setNombre] = useState('');
    const [direccion, setDireccion] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [idMacro, setIdMacro] = useState('');
    const [latitud, setLatitud] = useState<number>(-16.4897);
    const [longitud, setLongitud] = useState<number>(-68.1193);

    // Form Directorio
    const formDirectorioRef = useRef<HTMLFormElement>(null);
    const [editandoDirectorioId, setEditandoDirectorioId] = useState<number | null>(null);
    const [entidad, setEntidad] = useState('');
    const [servicio, setServicio] = useState('');
    const [telefono, setTelefono] = useState('');

    const cargarDatos = async () => {
        const [macros, pts, dir] = await Promise.all([
            macrodistritosService.getAll(),
            puntosService.getAll(),
            directorioService.getAll(),
        ]);
        setMacrodistritos(macros);
        setPuntos(pts);
        setDirectorio(dir);
    };

    useEffect(() => {
        cargarDatos().catch(console.error);
    }, []);

    const handleCrearPunto = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!idMacro) return alert('Selecciona un macrodistrito');
        await puntosService.create({
            nombre,
            direccion,
            descripcion,
            latitud,
            longitud,
            idMacrodistrito: Number(idMacro),
        });
        setNombre('');
        setDireccion('');
        setDescripcion('');
        cargarDatos();
    };

    const limpiarFormularioDirectorio = () => {
        setEditandoDirectorioId(null);
        setEntidad('');
        setServicio('');
        setTelefono('');
    };

    const handleGuardarDirectorio = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!entidad.trim() || !servicio.trim() || !telefono.trim()) {
            alert('Completa entidad, servicio y teléfono.');
            return;
        }

        try {
            const datos = {
                entidad: entidad.trim(),
                servicio: servicio.trim(),
                telefono: telefono.trim(),
            };

            if (editandoDirectorioId !== null) {
                await directorioService.update(editandoDirectorioId, datos);
            } else {
                await directorioService.create({ ...datos, habilitado: true });
            }

            limpiarFormularioDirectorio();
            await cargarDatos();
        } catch {
            alert('No se pudo guardar el contacto de emergencia.');
        }
    };

    const handleEditarDirectorio = (item: any) => {
        setEditandoDirectorioId(item.id);
        setEntidad(item.entidad);
        setServicio(item.servicio);
        setTelefono(item.telefono);
        formDirectorioRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    const handleToggleDirectorio = async (item: any) => {
        try {
            await directorioService.setHabilitado(item.id, !item.habilitado);
            if (editandoDirectorioId === item.id) limpiarFormularioDirectorio();
            await cargarDatos();
        } catch {
            alert('No se pudo cambiar el estado del contacto.');
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl lg:text-[32px] font-bold text-zinc-900">
                        Panel de Administración
                    </h1>
                    <p className="text-sm font-medium text-zinc-500">
                        Gestión de puntos seguros (PostGIS) y líneas de emergencia
                    </p>
                </div>

                <div className="flex gap-2">
                    <button
                        onClick={() => setSubTab('puntos')}
                        className={`min-h-[44px] px-5 py-2.5 rounded-lg font-semibold text-sm transition-colors ${
                            subTab === 'puntos'
                                ? 'bg-zinc-900 text-white'
                                : 'bg-white border border-zinc-200 text-zinc-900 hover:bg-zinc-50'
                        }`}
                    >
                        Puntos de Evacuación
                    </button>
                    <button
                        onClick={() => setSubTab('directorio')}
                        className={`min-h-[44px] px-5 py-2.5 rounded-lg font-semibold text-sm transition-colors ${
                            subTab === 'directorio'
                                ? 'bg-zinc-900 text-white'
                                : 'bg-white border border-zinc-200 text-zinc-900 hover:bg-zinc-50'
                        }`}
                    >
                        Directorio
                    </button>
                </div>
            </div>

            {subTab === 'puntos' ? (
                <div className="space-y-6">
                    <form
                        onSubmit={handleCrearPunto}
                        className="bg-white border border-zinc-200 rounded-lg p-6 shadow-sm space-y-4"
                    >
                        <h2 className="text-xl font-semibold text-zinc-900">
                            Registrar Punto de Evacuación
                        </h2>
                        <p className="text-xs text-zinc-500">
                            Haz clic en el mapa para fijar automáticamente las coordenadas.
                        </p>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <div className="space-y-3">
                                <input
                                    type="text"
                                    required
                                    placeholder="Nombre del punto (Ej. Plaza Murillo)"
                                    value={nombre}
                                    onChange={(e) => setNombre(e.target.value)}
                                    className="w-full min-h-[44px] px-4 py-2 bg-white border border-zinc-200 rounded-lg text-zinc-800 focus:outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/15"
                                />
                                <input
                                    type="text"
                                    required
                                    placeholder="Dirección exacta"
                                    value={direccion}
                                    onChange={(e) => setDireccion(e.target.value)}
                                    className="w-full min-h-[44px] px-4 py-2 bg-white border border-zinc-200 rounded-lg text-zinc-800 focus:outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/15"
                                />
                                <select
                                    required
                                    value={idMacro}
                                    onChange={(e) => setIdMacro(e.target.value)}
                                    className="w-full min-h-[44px] px-4 py-2 bg-white border border-zinc-200 rounded-lg text-zinc-800 focus:outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/15"
                                >
                                    <option value="">Macrodistrito...</option>
                                    {macrodistritos.map((m) => (
                                        <option key={m.id} value={m.id}>
                                            {m.nombre}
                                        </option>
                                    ))}
                                </select>
                                <div className="grid grid-cols-2 gap-3">
                                    <input
                                        type="number"
                                        step="any"
                                        value={latitud}
                                        onChange={(e) => setLatitud(Number(e.target.value))}
                                        className="w-full min-h-[44px] px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-lg text-sm font-medium text-zinc-800"
                                        placeholder="Latitud"
                                    />
                                    <input
                                        type="number"
                                        step="any"
                                        value={longitud}
                                        onChange={(e) => setLongitud(Number(e.target.value))}
                                        className="w-full min-h-[44px] px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-lg text-sm font-medium text-zinc-800"
                                        placeholder="Longitud"
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="min-h-[44px] px-5 py-2.5 bg-orange-500 text-white font-semibold rounded-lg hover:bg-orange-600 transition-colors flex items-center gap-2"
                                >
                                    <Plus className="w-4 h-4" />
                                    Guardar Punto
                                </button>
                            </div>

                            <div className="rounded-lg overflow-hidden border border-zinc-200 min-h-[280px]">
                                <MapContainer
                                    center={[latitud, longitud]}
                                    zoom={13}
                                    className="w-full h-full min-h-[280px] z-0"
                                >
                                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                                    <SelectorMapa
                                        onSelect={(lat, lng) => {
                                            setLatitud(lat);
                                            setLongitud(lng);
                                        }}
                                    />
                                    <Marker position={[latitud, longitud]} icon={markerIcon} />
                                </MapContainer>
                            </div>
                        </div>
                    </form>

                    <div className="bg-white border border-zinc-200 rounded-lg shadow-sm overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                            <tr className="border-b border-zinc-200 bg-zinc-50 text-xs font-semibold uppercase tracking-wider text-zinc-500">
                                <th className="py-3.5 px-6">Nombre</th>
                                <th className="py-3.5 px-6">Macrodistrito</th>
                                <th className="py-3.5 px-6">Coordenadas (Lat, Lng)</th>
                                <th className="py-3.5 px-6 text-right">Acción</th>
                            </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-200 text-sm">
                            {puntos.map((p) => (
                                <tr key={p.id}>
                                    <td className="py-4 px-6 font-semibold text-zinc-900">
                                        {p.nombre}
                                    </td>
                                    <td className="py-4 px-6">{p.macrodistrito?.nombre}</td>
                                    <td className="py-4 px-6 font-medium text-zinc-600">
                                        {p.ubicacion?.coordinates?.[1]},{' '}
                                        {p.ubicacion?.coordinates?.[0]}
                                    </td>
                                    <td className="py-4 px-6 text-right">
                                        <button
                                            onClick={async () => {
                                                await puntosService.remove(p.id);
                                                cargarDatos();
                                            }}
                                            className="min-h-[44px] px-3 py-2 bg-rose-600 text-white font-semibold rounded-lg hover:bg-rose-700 inline-flex items-center gap-1.5"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                            Eliminar
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            ) : (
                <div className="space-y-6">
                    <form
                        ref={formDirectorioRef}
                        onSubmit={handleGuardarDirectorio}
                        className="bg-white border border-zinc-200 rounded-lg p-6 shadow-sm space-y-4 scroll-mt-24"
                    >
                        <div>
                            <h2 className="text-xl font-semibold text-zinc-900">
                                {editandoDirectorioId !== null
                                    ? 'Editar Contacto de Emergencia'
                                    : 'Agregar Contacto de Emergencia'}
                            </h2>
                            <p className="text-xs text-zinc-500 pt-1">
                                Los contactos inactivos no se muestran en el directorio público.
                            </p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <input
                                type="text"
                                required
                                placeholder="Entidad (Ej. Bomberos Antofagasta)"
                                value={entidad}
                                onChange={(e) => setEntidad(e.target.value)}
                                className="w-full min-h-[44px] px-4 py-2 bg-white border border-zinc-200 rounded-lg text-zinc-800 focus:outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/15"
                            />
                            <input
                                type="text"
                                required
                                placeholder="Servicio (Ej. Rescate e Incendios)"
                                value={servicio}
                                onChange={(e) => setServicio(e.target.value)}
                                className="w-full min-h-[44px] px-4 py-2 bg-white border border-zinc-200 rounded-lg text-zinc-800 focus:outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/15"
                            />
                            <input
                                type="text"
                                required
                                placeholder="Teléfono (Ej. 119)"
                                value={telefono}
                                onChange={(e) => setTelefono(e.target.value)}
                                className="w-full min-h-[44px] px-4 py-2 bg-white border border-zinc-200 rounded-lg text-zinc-800 focus:outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/15"
                            />
                        </div>
                        <div className="flex flex-wrap gap-2">
                            <button
                                type="submit"
                                className="min-h-[44px] px-5 py-2.5 bg-orange-500 text-white font-semibold rounded-lg hover:bg-orange-600 transition-colors flex items-center gap-2"
                            >
                                {editandoDirectorioId !== null ? (
                                    <>
                                        <Pencil className="w-4 h-4" />
                                        Guardar Cambios
                                    </>
                                ) : (
                                    <>
                                        <Plus className="w-4 h-4" />
                                        Guardar Contacto
                                    </>
                                )}
                            </button>
                            {editandoDirectorioId !== null && (
                                <button
                                    type="button"
                                    onClick={limpiarFormularioDirectorio}
                                    className="min-h-[44px] px-5 py-2.5 bg-white border border-zinc-200 text-zinc-900 font-semibold rounded-lg hover:bg-zinc-50 transition-colors flex items-center gap-2"
                                >
                                    <X className="w-4 h-4" />
                                    Cancelar
                                </button>
                            )}
                        </div>
                    </form>

                    <div className="bg-white border border-zinc-200 rounded-lg shadow-sm overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                            <tr className="border-b border-zinc-200 bg-zinc-50 text-xs font-semibold uppercase tracking-wider text-zinc-500">
                                <th className="py-3.5 px-6">Entidad</th>
                                <th className="py-3.5 px-6">Servicio</th>
                                <th className="py-3.5 px-6">Teléfono</th>
                                <th className="py-3.5 px-6">Estado</th>
                                <th className="py-3.5 px-6 text-right">Acciones</th>
                            </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-200 text-sm">
                            {directorio.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="py-8 text-center text-zinc-500">
                                        No hay contactos de emergencia registrados.
                                    </td>
                                </tr>
                            ) : (
                                directorio.map((d) => (
                                    <tr
                                        key={d.id}
                                        className={d.habilitado ? '' : 'bg-zinc-50/70 text-zinc-500'}
                                    >
                                        <td className="py-4 px-6 font-semibold text-zinc-900">
                                            {d.entidad}
                                        </td>
                                        <td className="py-4 px-6">{d.servicio}</td>
                                        <td className="py-4 px-6 font-medium">{d.telefono}</td>
                                        <td className="py-4 px-6">
                                            <span
                                                className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase ${
                                                    d.habilitado
                                                        ? 'bg-emerald-100 text-emerald-800'
                                                        : 'bg-zinc-200 text-zinc-600'
                                                }`}
                                            >
                                                {d.habilitado ? 'Activo' : 'Inactivo'}
                                            </span>
                                        </td>
                                        <td className="py-4 px-6 text-right">
                                            <div className="inline-flex flex-wrap items-center justify-end gap-2">
                                                <button
                                                    onClick={() => handleEditarDirectorio(d)}
                                                    className="min-h-[44px] px-3 py-2 bg-transparent border border-zinc-200 text-zinc-900 font-semibold rounded-lg hover:bg-zinc-50 inline-flex items-center gap-1.5"
                                                >
                                                    <Pencil className="w-4 h-4" />
                                                    Editar
                                                </button>
                                                <button
                                                    onClick={() => handleToggleDirectorio(d)}
                                                    className={`min-h-[44px] px-3 py-2 font-semibold rounded-lg inline-flex items-center gap-1.5 ${
                                                        d.habilitado
                                                            ? 'bg-amber-500 text-white hover:bg-amber-600'
                                                            : 'bg-emerald-600 text-white hover:bg-emerald-700'
                                                    }`}
                                                >
                                                    {d.habilitado ? (
                                                        <>
                                                            <PowerOff className="w-4 h-4" />
                                                            Desactivar
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Power className="w-4 h-4" />
                                                            Activar
                                                        </>
                                                    )}
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}