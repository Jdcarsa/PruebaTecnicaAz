const API_URL = 'http://localhost:8000';

export type EstadoTarea = 'pendiente' | 'en_progreso' | 'completada';

export interface Tarea {
    id: number;
    nombre: string;
    descripcion: string | null;
    estado: EstadoTarea;
    categoria_id: number;
    fecha_creacion: string;
}

export async function getTareas(filtros?: { estado?: string; categoria_id?: number;}) {
    const params = new URLSearchParams();
    if (filtros?.estado) params.append('estado', filtros.estado);
    if (filtros?.categoria_id) params.append('categoria_id', String(filtros.categoria_id));
    
    const res = await fetch(`${API_URL}/tareas?${params}`);
    if (!res.ok) throw new Error('Error al obtener tareas');
    return res.json();
}

export async function createTarea(data: any) {
    const res = await fetch(`${API_URL}/tareas`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Error al crear tarea');
    return res.json();
}

export async function cambiarEstado(id: number, estado: string) {
    const res = await fetch(`${API_URL}/tareas/${id}/estado?estado=${estado}`, {
        method: 'PATCH',
    });
    if (!res.ok) throw new Error('Error al cambiar estado');
    return res.json();
}

export async function deleteTarea(id: number) {
    const res = await fetch(`${API_URL}/tareas/${id}`, {
        method: 'DELETE',
    });
    if (!res.ok) throw new Error('Error al eliminar tarea');
}