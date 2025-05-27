import Productos from './components/Productos';
import Usuarios from './components/Usuarios';
import 'primereact/resources/themes/lara-light-indigo/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';

function App() {
  return (
    <div className="p-4">
      <h1>CRUD Fullstack</h1>
      <hr />
      <Usuarios />
      <hr />
      <Productos />
    </div>
  );
}

export default App;
