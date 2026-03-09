import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell } from 'recharts';
import { Link } from 'react-router-dom';
import { Users } from 'lucide-react';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('/api/dashboard-data')
      .then(res => {
        if (!res.ok) throw new Error('Error al cargar datos');
        return res.json();
      })
      .then(data => {
        setData(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="p-8 text-center">Cargando dashboard...</div>;
  if (error) return <div className="p-8 text-center text-red-500">Error: {error}</div>;

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Dashboard de Empleados</h1>
        <Link 
          to="/empleados" 
          className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800 transition shadow-sm hover:shadow-md"
        >
          <Users size={20} />
          Lista de Empleados
        </Link>
      </div>
      
      {/* Tarjetas de resumen */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Total Empleados</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{data.totalRegistros}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Último Insertado</CardTitle>
          </CardHeader>
          <CardContent>
            {data.ultimoInsertado ? (
              <>
                <p className="font-semibold">{data.ultimoInsertado.nombre}</p>
                <p className="text-sm text-gray-500">{data.ultimoInsertado.fecha}</p>
              </>
            ) : (
              <p className="text-gray-400">Sin datos</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Último Actualizado</CardTitle>
          </CardHeader>
          <CardContent>
            {data.ultimoActualizado ? (
              <>
                <p className="font-semibold">{data.ultimoActualizado.nombre}</p>
                <p className="text-sm text-gray-500">{data.ultimoActualizado.fecha}</p>
              </>
            ) : (
              <p className="text-gray-400">Sin datos</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Gráfico de Áreas (Pie) */}
        <Card>
          <CardHeader>
            <CardTitle>Empleados por Área</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center">
            {data.graficoAreas.length > 0 ? (
              <PieChart width={350} height={300}>
                <Pie
                  data={data.graficoAreas}
                  dataKey="value"
                  nameKey="label"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label={({ label, percent }) => `${label}: ${(percent * 100).toFixed(0)}%`}
                >
                  {data.graficoAreas.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            ) : (
              <p className="text-gray-400 py-8">No hay datos de áreas</p>
            )}
          </CardContent>
        </Card>

        {/* Gráfico de Categorías (Barra) */}
        <Card>
          <CardHeader>
            <CardTitle>Empleados por Categoría</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center">
            {data.graficoCategorias.length > 0 ? (
              <BarChart width={350} height={300} data={data.graficoCategorias}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="label" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#8884d8" />
              </BarChart>
            ) : (
              <p className="text-gray-400 py-8">No hay datos de categorías</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Tabla de estados */}
      <Card>
        <CardHeader>
          <CardTitle>Distribución por Estado</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {data.estados.map((estado, idx) => (
              <div key={idx} className="flex justify-between items-center border p-3 rounded-lg">
                <span className="font-medium">{estado.estado}</span>
                <span className="text-lg font-bold">{estado.cantidad}</span>
                <span className="text-sm text-gray-500">({estado.porcentaje})</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default Dashboard;