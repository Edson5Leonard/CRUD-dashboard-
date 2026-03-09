import { useState, useEffect } from 'react';
import { ArrowLeft, Save } from 'lucide-react';

export default function EmployeeForm({ employee, onClose, onSaved }) {
  const isEditing = !!employee;
  
  const [formData, setFormData] = useState({
    nombre: employee?.nombre || '',
    email: employee?.email || employee?.correo || '',
    tipo_id: employee?.tipo_id || '',
    area_id: employee?.area_id || '',
    salario: employee?.salario || '',
    estado: employee?.estado || 'Activo',
    categoria: employee?.categoria || ''
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [dataLoaded, setDataLoaded] = useState(false);
  
  const [options, setOptions] = useState({ areas: [], tipos: [] });

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const [areasRes, tiposRes] = await Promise.all([
          fetch('/api/areas'),
          fetch('/api/tipos')
        ]);
        
        if (!areasRes.ok || !tiposRes.ok) throw new Error('Error al cargar opciones (Áreas/Tipos)');
        
        const areasData = await areasRes.json();
        const tiposData = await tiposRes.json();
        
        setOptions({ areas: areasData, tipos: tiposData });
        setDataLoaded(true);
      } catch (err) {
        setError(err.message);
      }
    };
    fetchOptions();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    
    try {
      const url = isEditing ? `/api/empleados/${employee.id}` : '/api/empleados';
      const method = isEditing ? 'PUT' : 'POST';
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Error al guardar');
      }
      
      onSaved();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="p-8 max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <button 
          onClick={onClose}
          className="p-2 text-gray-500 hover:bg-gray-200 rounded-full transition flex-shrink-0"
        >
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-3xl font-bold text-gray-800">
          {isEditing ? 'Editar Empleado' : 'Nuevo Empleado'}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow border border-gray-100 space-y-6">
        {error && <div className="p-4 bg-red-50 text-red-600 rounded-lg">{error}</div>}
        
        {!dataLoaded ? (
          <div className="p-8 text-center text-gray-500">Cargando formulario...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Nombre *</label>
            <input 
              required
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Correo Electrónico *</label>
            <input 
              required
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Salario *</label>
            <input 
              required
              type="number"
              step="0.01"
              name="salario"
              value={formData.salario}
              onChange={handleChange}
              placeholder="Ej: 1500.50"
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Tipo de Empleado *</label>
            <select 
              required
              name="tipo_id"
              value={formData.tipo_id}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
            >
              <option value="">Selecciona un tipo...</option>
              {options.tipos.map(tipo => (
                <option key={tipo.id} value={tipo.id}>{tipo.nombre}</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Área *</label>
            <select 
              required
              name="area_id"
              value={formData.area_id}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
            >
              <option value="">Selecciona un área...</option>
              {options.areas.map(area => (
                <option key={area.id} value={area.id}>{area.nombre}</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Dpto. Categoria</label>
            <input 
              name="categoria"
              value={formData.categoria}
              onChange={handleChange}
              placeholder="Ej: Marketing"
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Estado</label>
            <select 
              name="estado"
              value={formData.estado}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
            >
              <option value="Activo">Activo</option>
              <option value="Inactivo">Inactivo</option>
            </select>
          </div>
        </div>
        )}

        <div className="pt-4 flex justify-end gap-3 border-t border-gray-100 mt-6 pt-6">
          <button 
            type="button" 
            onClick={onClose}
            className="px-6 py-2 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition"
          >
            Cancelar
          </button>
          <button 
            type="submit" 
            disabled={saving}
            className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow-sm hover:shadow-md disabled:opacity-50"
          >
            <Save size={18} />
            {saving ? 'Guardando...' : 'Guardar'}
          </button>
        </div>
      </form>
    </div>
  );
}
