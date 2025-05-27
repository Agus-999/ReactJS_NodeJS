import { useEffect, useState } from 'react';
import API from '../services/api';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import jsPDF from 'jspdf';

function Productos() {
  const [productos, setProductos] = useState([]);
  const [nuevo, setNuevo] = useState({ nombre: '', precio: '' });
  const [editando, setEditando] = useState(null);

  const cargar = async () => {
    const res = await API.get('/productos');
    setProductos(res.data);
  };

  useEffect(() => { cargar(); }, []);

  const crear = async () => {
    await API.post('/productos', nuevo);
    setNuevo({ nombre: '', precio: '' });
    cargar();
  };

  const eliminar = async (id) => {
    await API.delete(`/productos/${id}`);
    cargar();
  };

  const editar = async () => {
    await API.put(`/productos/${editando.id}`, editando);
    setEditando(null);
    cargar();
  };

  const exportarPDF = () => {
    const doc = new jsPDF();
    doc.text('Listado de Productos', 10, 10);
    productos.forEach((p, i) => {
      doc.text(`${p.nombre} - $${p.precio}`, 10, 20 + i * 10);
    });
    doc.save('productos.pdf');
  };

  return (
    <div>
      <h2>Productos</h2>
      <InputText placeholder="Nombre" value={nuevo.nombre} onChange={(e) => setNuevo({ ...nuevo, nombre: e.target.value })} />
      <InputText placeholder="Precio" value={nuevo.precio} onChange={(e) => setNuevo({ ...nuevo, precio: e.target.value })} />
      <Button label="Crear" onClick={crear} />

      {productos.map(p => (
        <div key={p.id}>
          {editando?.id === p.id ? (
            <>
              <InputText value={editando.nombre} onChange={(e) => setEditando({ ...editando, nombre: e.target.value })} />
              <InputText value={editando.precio} onChange={(e) => setEditando({ ...editando, precio: e.target.value })} />
              <Button label="Guardar" onClick={editar} />
            </>
          ) : (
            <>
              <span>{p.nombre} - ${p.precio}</span>
              <Button label="Editar" onClick={() => setEditando(p)} />
              <Button label="Eliminar" severity="danger" onClick={() => eliminar(p.id)} />
            </>
          )}
        </div>
      ))}

      <Button label="Exportar PDF" onClick={exportarPDF} className="mt-3" />
    </div>
  );
}

export default Productos;
