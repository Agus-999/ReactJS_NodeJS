import { useEffect, useState } from 'react';
import API from '../services/api';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import jsPDF from 'jspdf';

function Usuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [nuevo, setNuevo] = useState({ nombre: '', email: '', edad: '' });
  const [editando, setEditando] = useState(null);

  const cargar = async () => {
    const res = await API.get('/usuarios');
    setUsuarios(res.data);
  };

  useEffect(() => { cargar(); }, []);

  const crear = async () => {
    await API.post('/usuarios', nuevo);
    setNuevo({ nombre: '', email: '', edad: '' });
    cargar();
  };

  const eliminar = async (id) => {
    await API.delete(`/usuarios/${id}`);
    cargar();
  };

  const editar = async () => {
    await API.put(`/usuarios/${editando.id}`, editando);
    setEditando(null);
    cargar();
  };

  const exportarPDF = () => {
    const doc = new jsPDF();
    doc.text('Listado de Usuarios', 10, 10);
    usuarios.forEach((u, i) => {
      doc.text(`${u.nombre} - ${u.email} - Edad: ${u.edad}`, 10, 20 + i * 10);
    });
    doc.save('usuarios.pdf');
  };

  return (
    <div>
      <h2>Usuarios</h2>
      <InputText placeholder="Nombre" value={nuevo.nombre} onChange={(e) => setNuevo({ ...nuevo, nombre: e.target.value })} />
      <InputText placeholder="Email" value={nuevo.email} onChange={(e) => setNuevo({ ...nuevo, email: e.target.value })} />
      <InputText placeholder="Edad" value={nuevo.edad} onChange={(e) => setNuevo({ ...nuevo, edad: e.target.value })} />
      <Button label="Crear" onClick={crear} />

      {usuarios.map(u => (
        <div key={u.id}>
          {editando?.id === u.id ? (
            <>
              <InputText value={editando.nombre} onChange={(e) => setEditando({ ...editando, nombre: e.target.value })} />
              <InputText value={editando.email} onChange={(e) => setEditando({ ...editando, email: e.target.value })} />
              <InputText value={editando.edad} onChange={(e) => setEditando({ ...editando, edad: e.target.value })} />
              <Button label="Guardar" onClick={editar} />
            </>
          ) : (
            <>
              <span>{u.nombre} - {u.email} - Edad: {u.edad}</span>
              <Button label="Editar" onClick={() => setEditando(u)} />
              <Button label="Eliminar" severity="danger" onClick={() => eliminar(u.id)} />
            </>
          )}
        </div>
      ))}

      <Button label="Exportar PDF" onClick={exportarPDF} className="mt-3" />
    </div>
  );
}

export default Usuarios;
