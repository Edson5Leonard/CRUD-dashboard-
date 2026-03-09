import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Pencil, Trash2, Plus, LayoutDashboard } from 'lucide-react';
import EmployeeForm from './EmployeeForm';

export default function EmployeeList() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [showForm, setShowForm] = useState(false);
  const [employeeToEdit, setEmployeeToEdit] = useState(null);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/empleados');
      if (!res.ok) throw new Error('Error fetching data');
      const data = await res.json();
      setEmployees(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('¿Seguro que deseas eliminar este empleado?')) return;
    try {
      const res = await fetch(`/api/empleados/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Error al eliminar');
      fetchEmployees();
    } catch (err) {
      alert(err.message);
    }
  };

  const openCreateForm = () => {
    setEmployeeToEdit(null);
    setShowForm(true);
  };

  const openEditForm = (emp) => {
    setEmployeeToEdit(emp);
    setShowForm(true);
  };

  const closeFormAndRefresh = () => {
    setShowForm(false);
    fetchEmployees();
  };

  if (loading) return <div className="p-8 text-center text-gray-500">Cargando empleados...</div>;
  if (error) return <div className="p-8 text-center text-red-500">Error: {error}</div>;

  if (showForm) {
    return (
      <EmployeeForm 
        employee={employeeToEdit} 
        onClose={() => setShowForm(false)} 
        onSaved={closeFormAndRefresh} 
      />
    );
  }

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">Lista de Empleados</h1>
        <div className="flex gap-4">
          <Link 
            to="/dashboard" 
            className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800 transition"
          >
            <LayoutDashboard size={20} />
            Ver Dashboard
          </Link>
          <button 
            onClick={openCreateForm}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition shadow-sm hover:shadow-md"
          >
            <Plus size={20} />
            Nuevo Empleado
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow border border-gray-100 overflow-x-auto">
        <table className="w-full text-left border-collapse whitespace-nowrap text-sm">
          <thead>
            <tr className="bg-gray-100 border-b border-gray-200 text-gray-700">
              <th className="px-4 py-2 font-medium">ID</th>
              <th className="px-4 py-2 font-medium">Nombre</th>
              <th className="px-4 py-2 font-medium">Correo</th>
              <th className="px-4 py-2 font-medium">Tipo</th>
              <th className="px-4 py-2 font-medium">Área</th>
              <th className="px-4 py-2 font-medium">Categoría</th>
              <th className="px-4 py-2 font-medium">Estado</th>
              <th className="px-4 py-2 font-medium text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {employees.length === 0 ? (
              <tr>
                <td colSpan="8" className="px-6 py-8 text-center text-gray-500">
                  No hay empleados registrados.
                </td>
              </tr>
            ) : (
              employees.map((emp) => (
                <tr key={emp.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition">
                  <td className="px-4 py-2 text-gray-500">{emp.id}</td>
                  <td className="px-4 py-2 font-medium text-gray-900">{emp.nombre}</td>
                  <td className="px-4 py-2 text-gray-600">{emp.email}</td>
                  <td className="px-4 py-2 text-gray-600">{emp.tipo_nombre || emp.tipo_id}</td>
                  <td className="px-4 py-2 text-gray-600">{emp.area_nombre || emp.area_id}</td>
                  <td className="px-4 py-2 text-gray-600">{emp.categoria || '-'}</td>
                  <td className="px-4 py-2">
                    <span className={`px-2 py-0.5 flex items-center justify-center w-fit rounded-full text-xs font-medium ${
                      emp.estado === 'Activo' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {emp.estado}
                    </span>
                  </td>
                  <td className="px-4 py-2">
                    <div className="flex items-center justify-center gap-2">
                      <button 
                        onClick={() => openEditForm(emp)}
                        className="text-blue-600 hover:text-blue-800 transition bg-blue-50 hover:bg-blue-100 p-1.5 rounded-md"
                        title="Editar"
                      >
                        <Pencil size={14} />
                      </button>
                      <button 
                        onClick={() => handleDelete(emp.id)}
                        className="text-red-600 hover:text-red-800 transition bg-red-50 hover:bg-red-100 p-1.5 rounded-md"
                        title="Eliminar"
                      >
                        <Trash2 size={14} />
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
  );
}
