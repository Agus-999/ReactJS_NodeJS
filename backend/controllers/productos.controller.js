const fs = require("fs");
const path = require("path");
const rutaArchivo = path.join(__dirname, "../data/productos.json");

const leerProductos = () => {
  const data = fs.readFileSync(rutaArchivo, "utf-8");
  return JSON.parse(data);
};

const guardarProductos = (productos) => {
  fs.writeFileSync(rutaArchivo, JSON.stringify(productos, null, 2));
};

exports.obtenerProductos = (req, res) => {
  const productos = leerProductos();
  res.json(productos);
};

exports.obtenerProductoPorId = (req, res) => {
  const productos = leerProductos();
  const producto = productos.find((p) => p.id === req.params.id);

  if (!producto) {
    return res.status(404).json({ error: "Producto no encontrado" });
  }

  res.json(producto);
};

exports.crearProducto = (req, res) => {
  const { nombre, precio } = req.body;
  if (!nombre || !precio) {
    return res.status(400).json({ error: "Faltan datos obligatorios" });
  }

  const productos = leerProductos();

  const nuevoProducto = {
    id: Date.now().toString(),
    nombre,
    precio,
  };

  productos.push(nuevoProducto);
  guardarProductos(productos);
  res.status(201).json(nuevoProducto);
};

exports.actualizarProducto = (req, res) => {
  const { nombre, precio } = req.body;
  const productos = leerProductos();
  const producto = productos.find((p) => p.id === req.params.id);

  if (!producto) {
    return res.status(404).json({ error: "Producto no encontrado" });
  }

  if (!nombre || !precio) {
    return res.status(400).json({ error: "Faltan datos obligatorios" });
  }

  producto.nombre = nombre;
  producto.precio = precio;

  guardarProductos(productos);
  res.json(producto);
};

exports.eliminarProducto = (req, res) => {
  const productos = leerProductos();
  const producto = productos.find((p) => p.id === req.params.id);

  if (!producto) {
    return res.status(404).json({ error: "Producto no encontrado" });
  }

  const nuevosProductos = productos.filter((p) => p.id !== req.params.id);
  guardarProductos(nuevosProductos);
  res.json({ mensaje: "Producto eliminado correctamente" });
};
