const fs = require("fs");
const path = require("path");
const rutaArchivo = path.join(__dirname, "../data/usuarios.json");

const leerUsuarios = () => {
  const data = fs.readFileSync(rutaArchivo, "utf-8");
  return JSON.parse(data);
};

const guardarUsuarios = (usuarios) => {
  fs.writeFileSync(rutaArchivo, JSON.stringify(usuarios, null, 2));
};

exports.obtenerUsuarios = (req, res) => {
  const usuarios = leerUsuarios();
  res.json(usuarios);
};

exports.obtenerUsuarioPorId = (req, res) => {
  const usuarios = leerUsuarios();
  const usuario = usuarios.find((u) => u.id === req.params.id);

  if (!usuario) {
    return res.status(404).json({ error: "Usuario no encontrado" });
  }

  res.json(usuario);
};

exports.crearUsuario = (req, res) => {
  const { nombre, email, edad } = req.body;
  if (!nombre || !email || !edad) {
    return res.status(400).json({ error: "Faltan datos obligatorios" });
  }

  const usuarios = leerUsuarios();

  // Validar email único
  if (usuarios.find((u) => u.email === email)) {
    return res.status(400).json({ error: "El email ya existe" });
  }

  const nuevoUsuario = {
    id: Date.now().toString(),
    nombre,
    email,
    edad,
  };

  usuarios.push(nuevoUsuario);
  guardarUsuarios(usuarios);
  res.status(201).json(nuevoUsuario);
};

exports.actualizarUsuario = (req, res) => {
  const { nombre, email, edad } = req.body;
  const usuarios = leerUsuarios();
  const usuario = usuarios.find((u) => u.id === req.params.id);

  if (!usuario) {
    return res.status(404).json({ error: "Usuario no encontrado" });
  }

  if (!nombre || !email || !edad) {
    return res.status(400).json({ error: "Faltan datos obligatorios" });
  }

  usuario.nombre = nombre;
  usuario.email = email;
  usuario.edad = edad;

  guardarUsuarios(usuarios);
  res.json(usuario);
};

exports.eliminarUsuario = (req, res) => {
  const usuarios = leerUsuarios();
  const usuario = usuarios.find((u) => u.id === req.params.id);

  if (!usuario) {
    return res.status(404).json({ error: "Usuario no encontrado" });
  }

  const nuevosUsuarios = usuarios.filter((u) => u.id !== req.params.id);
  guardarUsuarios(nuevosUsuarios);
  res.json({ mensaje: "Usuario eliminado correctamente" });
};
