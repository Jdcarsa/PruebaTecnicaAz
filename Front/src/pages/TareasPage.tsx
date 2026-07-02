import React, { useState, useEffect } from 'react';
import { 
    getTareas, 
    createTarea, 
    cambiarEstado, 
    deleteTarea,
    type Tarea,
    type EstadoTarea 
} from '../services/TareasService';
import { getCategorias, type Categoria } from '../services/CategoriaService';

export default function TareasPage() {
    const [tareas, setTareas] = useState<Tarea[]>([]);
    const [categorias, setCategorias] = useState<Categoria[]>([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState('');
    
    const [nombre, setNombre] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [categoriaId, setCategoriaId] = useState<number>(0);
    const [estado, setEstado] = useState<EstadoTarea>('pendiente');
    const [creando, setCreando] = useState(false);
    
    const [filtroEstado, setFiltroEstado] = useState('');
    const [filtroCategoria, setFiltroCategoria] = useState<number | ''>('');

    useEffect(() => {
        cargarDatos();
    }, []);

    useEffect(() => {
        if (categorias.length > 0) cargarTareas();
    }, [filtroEstado, filtroCategoria, categorias]);

    const cargarDatos = async () => {
        setCargando(true);
        try {
            const cats = await getCategorias();
            setCategorias(cats);
            if (cats.length > 0) setCategoriaId(cats[0].id);
        } catch {
            setError('Error al cargar datos');
        } finally {
            setCargando(false);
        }
    };

    const cargarTareas = async () => {
        try {
            const filtros: any = {};
            if (filtroEstado) filtros.estado = filtroEstado;
            if (filtroCategoria) filtros.categoria_id = Number(filtroCategoria);
            const data = await getTareas(filtros);
            setTareas(data);
        } catch {
            setError('Error al cargar tareas');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!nombre.trim() || !categoriaId) {
            setError('Completa nombre y categoría');
            return;
        }
        setCreando(true);
        try {
            await createTarea({
                nombre: nombre.trim(),
                descripcion: descripcion.trim() || undefined,
                categoria_id: categoriaId,
                estado,
            });
            setNombre('');
            setDescripcion('');
            setError('');
            await cargarTareas();
        } catch {
            setError('Error al crear tarea');
        } finally {
            setCreando(false);
        }
    };

    const handleCambiarEstado = async (id: number, nuevoEstado: EstadoTarea) => {
        try {
            await cambiarEstado(id, nuevoEstado);
            await cargarTareas();
        } catch {
            setError('Error al cambiar estado');
        }
    };

    const handleEliminar = async (id: number) => {
        if (!confirm('¿Eliminar esta tarea?')) return;
        try {
            await deleteTarea(id);
            await cargarTareas();
        } catch {
            setError('Error al eliminar');
        }
    };

    if (cargando && categorias.length === 0) {
        return (
            <div className="container py-5 text-center">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Cargando...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="container py-4">
            <h4 className="mb-4">Tareas</h4>

            {error && (
                <div className="alert alert-danger alert-dismissible fade show">
                    {error}
                    <button type="button" className="btn-close" onClick={() => setError('')}></button>
                </div>
            )}

            <div className="card mb-4">
                <div className="card-header bg-primary text-white">
                    <i className="bi bi-plus-circle me-2"></i>Nueva Tarea
                </div>
                <div className="card-body">
                    <form onSubmit={handleSubmit}>
                        <div className="row g-2">
                            <div className="col-md-4">
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Nombre"
                                    value={nombre}
                                    onChange={(e) => setNombre(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="col-md-3">
                                <select
                                    className="form-select"
                                    value={categoriaId}
                                    onChange={(e) => setCategoriaId(Number(e.target.value))}
                                    required
                                >
                                    {categorias.map((c) => (
                                        <option key={c.id} value={c.id}>{c.nombre}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="col-md-2">
                                <select
                                    className="form-select"
                                    value={estado}
                                    onChange={(e) => setEstado(e.target.value as EstadoTarea)}
                                >
                                    <option value="pendiente">Pendiente</option>
                                    <option value="en_progreso">En Progreso</option>
                                    <option value="completada">Completada</option>
                                </select>
                            </div>
                            <div className="col-md-3">
                                <button type="submit" className="btn btn-primary w-100" disabled={creando}>
                                    {creando ? 'Creando...' : 'Crear'}
                                </button>
                            </div>
                        </div>
                        <div className="row mt-2">
                            <div className="col-12">
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Descripción"
                                    value={descripcion}
                                    onChange={(e) => setDescripcion(e.target.value)}
                                />
                            </div>
                        </div>
                    </form>
                </div>
            </div>

            <div className="card">
                <div className="card-header bg-secondary text-white d-flex justify-content-between align-items-center">
                    <span><i className="bi bi-list-ul me-2"></i>Lista de Tareas</span>
                </div>
                <div className="card-body p-0">
                    <div className="row g-2 p-3 border-bottom bg-light">
                        <div className="col-md-5">
                            <select
                                className="form-select form-select-sm"
                                value={filtroEstado}
                                onChange={(e) => setFiltroEstado(e.target.value)}
                            >
                                <option value="">Todos los estados</option>
                                <option value="pendiente">Pendiente</option>
                                <option value="en_progreso">En Progreso</option>
                                <option value="completada">Completada</option>
                            </select>
                        </div>
                        <div className="col-md-5">
                            <select
                                className="form-select form-select-sm"
                                value={filtroCategoria}
                                onChange={(e) => setFiltroCategoria(e.target.value ? Number(e.target.value) : '')}
                            >
                                <option value="">Todas las categorías</option>
                                {categorias.map((c) => (
                                    <option key={c.id} value={c.id}>{c.nombre}</option>
                                ))}
                            </select>
                        </div>
                        <div className="col-md-2">
                            <button
                                className="btn btn-outline-secondary btn-sm w-100"
                                onClick={() => {
                                    setFiltroEstado('');
                                    setFiltroCategoria('');
                                }}
                            >
                                Limpiar
                            </button>
                        </div>
                    </div>

                    {tareas.length === 0 ? (
                        <p className="text-center text-muted py-4">No hay tareas</p>
                    ) : (
                        <div className="table-responsive">
                            <table className="table table-hover mb-0">
                                <thead className="table-dark">
                                    <tr>
                                        <th>Nombre</th>
                                        <th>Descripción</th>
                                        <th>Estado</th>
                                        <th>Categoría</th>
                                        <th>Fecha</th>
                                        <th className="text-end">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {tareas.map((tarea) => (
                                        <tr key={tarea.id}>
                                            <td className="fw-semibold">{tarea.nombre}</td>
                                            <td>{tarea.descripcion || '-'}</td>
                                            <td>
                                                {tarea.estado}
                                            </td>
                                            <td>
                                                {tarea.categoria_id || 'Sin categoría'}
                                            </td>
                                            <td>{new Date(tarea.fecha_creacion).toLocaleDateString('es-ES')}</td>
                                            <td className="text-end">
                                                <div className="d-flex gap-1 justify-content-end">
                                                    {tarea.estado !== 'completada' && (
                                                        <>
                                                            <button
                                                                className="btn btn-outline-primary btn-sm"
                                                                onClick={() => handleCambiarEstado(tarea.id, 'en_progreso')}
                                                                disabled={tarea.estado === 'en_progreso'}
                                                            >
                                                                Progreso
                                                            </button>
                                                            <button
                                                                className="btn btn-outline-success btn-sm"
                                                                onClick={() => handleCambiarEstado(tarea.id, 'completada')}
                                                            >
                                                                Completar
                                                            </button>
                                                        </>
                                                    )}
                                                    {tarea.estado === 'completada' && (
                                                        <button
                                                            className="btn btn-outline-warning btn-sm"
                                                            onClick={() => handleCambiarEstado(tarea.id, 'pendiente')}
                                                        >
                                                            Pendiente
                                                        </button>
                                                    )}
                                                    <button
                                                        className="btn btn-outline-danger btn-sm"
                                                        onClick={() => handleEliminar(tarea.id)}
                                                    >
                                                        Eliminar
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}