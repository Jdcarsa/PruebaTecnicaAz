const API_URL = 'http://localhost:8000';

export interface Categoria {
    id: number;
    nombre: string;
}

export async function getCategorias() {
    const res = await fetch(`${API_URL}/categorias`);
    if (!res.ok) throw new Error('Error al obtener categorías');
    return res.json();
}