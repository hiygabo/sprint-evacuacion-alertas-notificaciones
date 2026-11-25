import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:3000',
});

// 1. Macrodistritos
export const macrodistritosService = {
    getAll: () => api.get('/macrodistritos').then((res) => res.data),
};

// 2. Directorio de Emergencias
export interface DirectorioPayload {
    entidad: string;
    servicio: string;
    telefono: string;
    habilitado?: boolean;
}

export const directorioService = {
    getAll: () => api.get('/directorio').then((res) => res.data),
    create: (data: DirectorioPayload) =>
        api.post('/directorio', data).then((res) => res.data),
    update: (id: number, data: Partial<DirectorioPayload>) =>
        api.patch(`/directorio/${id}`, data).then((res) => res.data),
    setHabilitado: (id: number, habilitado: boolean) =>
        api.patch(`/directorio/${id}/habilitado`, { habilitado }).then((res) => res.data),
    remove: (id: number) => api.delete(`/directorio/${id}`).then((res) => res.data),
};

// 3. Puntos de Evacuación (PostGIS)
export const puntosService = {
    getAll: () => api.get('/puntos-evacuacion').then((res) => res.data),
    create: (data: {
        nombre: string;
        descripcion: string;
        direccion: string;
        latitud: number;
        longitud: number;
        idMacrodistrito: number;
    }) => api.post('/puntos-evacuacion', data).then((res) => res.data),
    update: (id: number, data: any) =>
        api.patch(`/puntos-evacuacion/${id}`, data).then((res) => res.data),
    setActivo: (id: number, activo: boolean) =>
        api.patch(`/puntos-evacuacion/${id}/activo`, { activo }).then((res) => res.data),
    remove: (id: number) => api.delete(`/puntos-evacuacion/${id}`).then((res) => res.data),
};

// 4. Alertas Sísmicas
export const alertasService = {
    getAll: () => api.get('/alertas').then((res) => res.data),
    create: (data: {
        titulo: string;
        mensajeOficial: string;
        gravedad: 'BASICA' | 'MODERADA' | 'SEVERA';
        esTodaLaCiudad: boolean;
        idSismologo: number;
        macrodistritoIds: number[];
    }) => api.post('/alertas', data).then((res) => res.data),
    update: (id: number, data: any) => api.patch(`/alertas/${id}`, data).then((res) => res.data),
    remove: (id: number) => api.delete(`/alertas/${id}`).then((res) => res.data),
};

// 5. Registros de Zona (Ciudadano <-> Macrodistrito)
export const registrosService = {
    getByUsuario: (idUsuario: number) =>
        api.get(`/registros/usuario/${idUsuario}`).then((res) => res.data),
    create: (data: { idUsuario: number; idMacrodistrito: number }) =>
        api.post('/registros', data).then((res) => res.data),
    remove: (id: number) => api.delete(`/registros/${id}`).then((res) => res.data),
};

// 6. Notificaciones
export const notificacionesService = {
    getByUsuario: (idUsuario: number) =>
        api.get(`/notificaciones/usuario/${idUsuario}`).then((res) => res.data),
    marcarLeida: (id: number) =>
        api.patch(`/notificaciones/${id}/leer`).then((res) => res.data),
};

// 7. Autenticación Real
export const authService = {
    login: (data: { correo: string; password: string }) =>
        api.post('/usuarios/login', data).then((res) => res.data),
    register: (data: { nombre: string; correo: string; password: string }) =>
        api.post('/usuarios/register', data).then((res) => res.data),
};