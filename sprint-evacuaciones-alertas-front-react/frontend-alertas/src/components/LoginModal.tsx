import { useState } from 'react';
import { X } from 'lucide-react';
import { authService } from '../services/api';

interface LoginModalProps {
    onClose: () => void;
    onSuccess: (usuario: any) => void;
}

export function LoginModal({ onClose, onSuccess }: LoginModalProps) {
    const [modo, setModo] = useState<'login' | 'register'>('login');
    const [nombre, setNombre] = useState('');
    const [correo, setCorreo] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [cargando, setCargando] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setCargando(true);
        try {
            const user =
                modo === 'login'
                    ? await authService.login({ correo, password })
                    : await authService.register({ nombre, correo, password });
            onSuccess(user);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Error al autenticar');
        } finally {
            setCargando(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 bg-zinc-900/60 flex items-center justify-center p-4">
            <div className="bg-white border border-zinc-200 rounded-lg shadow-lg w-full max-w-md p-6 space-y-5">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-zinc-900">
                        {modo === 'login' ? 'Iniciar Sesión' : 'Crear Cuenta Ciudadana'}
                    </h2>
                    <button
                        onClick={onClose}
                        className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg hover:bg-zinc-100"
                    >
                        <X className="w-5 h-5 text-zinc-600" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {modo === 'register' && (
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-zinc-700">Nombre completo</label>
                            <input
                                type="text"
                                required
                                value={nombre}
                                onChange={(e) => setNombre(e.target.value)}
                                placeholder="Ej. María López"
                                className="w-full min-h-[44px] px-4 py-2 bg-white border border-zinc-200 rounded-lg text-zinc-800 focus:outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/15"
                            />
                        </div>
                    )}

                    <div className="space-y-1">
                        <label className="text-sm font-medium text-zinc-700">Correo electrónico</label>
                        <input
                            type="email"
                            required
                            value={correo}
                            onChange={(e) => setCorreo(e.target.value)}
                            placeholder="usuario@sismopaz.bo"
                            className="w-full min-h-[44px] px-4 py-2 bg-white border border-zinc-200 rounded-lg text-zinc-800 focus:outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/15"
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="text-sm font-medium text-zinc-700">Contraseña</label>
                        <input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            className="w-full min-h-[44px] px-4 py-2 bg-white border border-zinc-200 rounded-lg text-zinc-800 focus:outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/15"
                        />
                    </div>

                    {error && <p className="text-sm font-medium text-rose-600">{error}</p>}

                    <button
                        type="submit"
                        disabled={cargando}
                        className="w-full min-h-[44px] px-5 py-2.5 bg-orange-500 text-white font-semibold rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50"
                    >
                        {cargando ? 'Verificando...' : modo === 'login' ? 'Ingresar' : 'Registrarme'}
                    </button>
                </form>

                <div className="pt-2 border-t border-zinc-200 text-center">
                    <button
                        type="button"
                        onClick={() => {
                            setModo(modo === 'login' ? 'register' : 'login');
                            setError('');
                        }}
                        className="text-sm font-semibold text-zinc-700 hover:text-orange-600"
                    >
                        {modo === 'login'
                            ? '¿No tienes cuenta? Regístrate como ciudadano'
                            : '¿Ya tienes cuenta? Inicia sesión'}
                    </button>
                </div>
            </div>
        </div>
    );
}